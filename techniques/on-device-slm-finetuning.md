---
created: 2026-07-18
updated: 2026-08-27
type: learning
tags: [slm, finetuning, lora, quantization, on-device, local-ai, gemma, peft, playbook]
source:
  - https://x.com/h100envy/status/2077784077604692440
  - https://developers.googleblog.com/en/introducing-gemma-3-270m/
  - https://developers.googleblog.com/own-your-ai-fine-tune-gemma-3-270m-for-on-device/
authors: [Google DeepMind]
year: 2025
category: technique
---

<!-- 작은 베이스 모델을 좁은 태스크에 특화 파인튜닝→양자화→온디바이스 배포하는 실전 플레이북 (작가가 로컬 모델 다룰 때 꺼내 쓰는 레시피) -->

# 온디바이스 SLM 특화 파인튜닝 플레이북

> **왜 이 노트**: 작가가 *나중에 파인튜닝·로컬 모델을 실제로 다룰 때* 꺼내서 적용·응용할 재사용 레시피. 특정 모델(Gemma 270M) 데모에서 출발하되, **초소형 베이스 → 좁은 태스크 특화 → 온디바이스**라는 일반 패턴으로 정리한다.
> 출처 = @h100envy 바이럴 트윗을 [해체분석](../methods/dissect-not-install-external-tools.md) 후 Google 공식 블로그 2건으로 교차검증. 트윗의 마케팅 수치는 걷어내고 **검증된 알맹이만** 승격.

---

## 한 줄 요약

> 범용 거대모델(70B급) 대신, **좁게 정의된 단일 태스크**(분류·추출·포맷팅·의도 라우팅)는 초소형 모델(수백M)을 LoRA로 특화 파인튜닝 → int4 양자화 → 온디바이스 배포하면 **그 태스크에 한해** 거대모델을 이기고, 오프라인·저지연·저비용·프라이버시를 얻는다.

---

## 핵심 파이프라인 (5단계)

```
① 초소형 베이스 선택        (예: Gemma 3 270M — 270M params, 256k vocab, 32K ctx)
      ↓
② 합성 태스크 데이터 생성    (거대모델로 in-task 예시 대량 생성 → 라벨링 자동화)
      ↓
③ LoRA / QLoRA 파인튜닝      (PEFT — 소수 가중치만 갱신, 무료 Colab T4로 분 단위)
      ↓
④ int4 양자화                (0.5GB RAM 급으로 축소, 정확도 손실 최소)
      ↓
⑤ 온디바이스 런타임 배포     (완전 오프라인, 폰/엣지 기기에서 추론)
```

## 검증된 사실 (Google 공식)

| 항목 | 수치 | 출처 |
|---|---|---|
| Gemma 3 270M 구성 | 270M(임베딩 170M + 트랜스포머 100M), **256k 어휘**, 32K ctx, 140+ 언어 | Google 블로그 |
| 메모리 | INT4로 **0.5GB RAM** 구동 | 〃 |
| 전력 | Pixel 9 Pro INT4: 25대화에 배터리 **0.75%** (Gemma 계열 최고 효율) | 〃 |
| 파인튜닝 비용 | QLoRA + 무료 Colab T4 → **분 단위** 특화 | 〃 |
| 설계 의도 | 분류·추출·instruction-following 같은 **well-defined task** 전용 | 〃 |

## ⚠️ 마케팅 vs 실체 (트윗 낚시 가드)

원 트윗이 부풀린 지점 — 나중에 남의 유사 주장 볼 때 같은 잣대로 판별:

- **"46%→90%, 21분"** = 특정 좁은 태스크 데모. "21분"은 폰이 아니라 **Colab GPU 학습** 시간일 개연성 大. *학습(GPU)과 추론(폰) 단계를 뭉개면* 낚시.
- **"Pixel 2000 tok/s"** = 벤치 조건(배치·프롬프트 길이) 미명시 상한치. 마케팅 숫자로 취급.
- **"270M이 70B를 이긴다"** = 참이지만 **파인튜닝된 그 단일 태스크에 한정**. 범용 추론·다태스크에선 70B가 압도. 이 각주를 지우면 "작은 게 큰 걸 이긴다"는 착시.
- **핵심 원칙**: 파이프라인은 진짜, 숫자는 마케팅. **태스크가 좁을수록 초소형 특화가 유리**하다는 방향성만 신뢰.

## 적용 트리거 (언제 이 레시피를 꺼내나)

> [학습→반영 루프 (Absorb-to-Apply)](../narrative/학습→반영 루프.md) — 지금은 즉시 반영처 없음(순수 지식, **파킹**). 아래 트리거 충족 시 착수:

1. **게임 NPC 의도 분류·대사 라우팅** — ai-npc-game / libgdx-rogue-os에 로컬 SLM을 붙일 때. 이 파이프라인이 후보 스택. (cf. [Fixed-Persona SLMs with Modular Memory — 소비자급 하드웨어 다중 NPC 대화](slm-dynamic-content-generation.md) = persona를 LoRA로 고정하고 메모리 분리하는 인접 아키텍처)
2. **앱/도구에 오프라인 특화 기능** — 텍스트 분류·추출·포맷팅을 서버 없이 온디바이스로. 프라이버시·지연·비용이 걸릴 때.
3. **거대모델 API 비용이 병목** — 반복적·좁은 태스크를 초소형 특화모델로 오프로딩([The New SDLC With Vibe Coding (Google / Addy Osmani)](../methods/google-new-sdlc-vibe-coding.md) Intelligent Model Routing의 극단값 = self-hosted tiny).

## 행동 결정기 특화 — 대화가 아니라 도구 호출만 시킨다 (2026-08-27 · Needle 2 해체 흡수)

> 위 ①~⑤ 가 *어떻게 작게 만드나*라면, 이 절은 *작게 만든 걸 무슨 역할에 앉히나*다. 출처 = Cactus Compute `needle` 공식 README(패킷 스냅샷 실측) + 2차 기사. **기사 단독 수치는 승격하지 않았다.**

로컬 초소형 모델에게 **"무엇을 말할까"를 시키지 않고 "어떤 도구를 어떤 인자로 부를까"만** 풀게 한다. 그 위에 오작동을 줄이는 세 겹:

1. **스키마를 문법으로 컴파일** — 선언된 도구 스키마를 byte-level grammar 로 바꿔 **디코딩 자체를 제약**한다. 존재하지 않는 함수·인자가 문자열로도 안 나온다. (vault 선행 0건 = 신규)
2. **도구 검색 선행 (top-5)** — 카탈로그가 커도 매 턴 상위 5개만 렌더하고 grammar 도 그 부분집합으로 좁힌다. (vault 선행 0건 = 신규)
3. **confidence 임계 승격** — 학습된 confidence head 점수가 임계 이상일 때만 실행, 이하면 재질문하거나 상위 모델로 올린다.
   🔗 **같은 기전이 다른 도메인에 이미 있다** — [DeepSpec / DSpark — speculative decoding draft-model 스택](deepspec-dspark.md) §4 는 confidence head 를 *검증 예산 게이트*(임계 아래 suffix 를 verify 에서 trim)로 쓴다. **점수를 임계로 잘라 비싼 단계를 아낀다**는 뼈대가 같다. 한쪽을 고칠 때 다른 쪽을 같이 본다.

**⛔ 문법상 유효한 호출 ≠ 안전한 호출.** 로컬 모델은 "실행 후보"까지만 만들고, 게임 규칙 엔진이 precondition·쿨다운·권한·현재 상태를 **다시** 검사한다. 이 검사기를 빼면 위 3겹이 무의미하다.

**⛔ Hermes 라우터로 쓸 때** — 읽기 전용·되돌릴 수 있는 분류까지만. vault 쓰기·publish·삭제·결제는 tiny-model confidence 만으로 허용하지 않는다.

**평가 지표를 바꾼다** — BLEU·대화 매력 대신 `도구 선택 정확도 / 인자 정확도 / no-tool 거절률 / 잘못된 실행률 / escalation recall`. 성공 조건은 정확도가 아니라 **잘못된 실행 0 + 모호·위험 요청 승격**이다. 임계값을 고른 셋과 통과 판정 셋을 **분리**한다(같은 셋으로 고르고 통과시키면 누수 — [검증자의 주장도 환각이다 — 강한 주장은 1차 출처로 재-Gate](../methods/verifier-claims-need-regate.md) §누수 8패턴 ⑥).

**검증 상태 (공식 README 실측 / 기사 단독 구분)**

| 주장 | 상태 |
|---|---|
| 45M params · 단일 14MB 바이너리 · 세션 RAM 28MB · CQ2-bit · schema→grammar · confidence head · top-5 retrieval · 256-token sliding window + KV sink | 공식 README 확인 (RAM 은 vendor 주장) |
| Raspberry Pi 5 500+ tok/s · Samsung A 300~700 tok/s · vocabulary projection 98% 생략 | 🔴 **기사 단독. 공식 README 0건 → 미검증** |
| 경쟁 모델 대비 일반 우위 | vendor benchmark only — 독립 재현 전 주장 금지 |

**⛔ 도입 조건** — 실제 온디바이스 행동 라우터 병목이 생길 때 격리 파일럿부터. 추론 엔진이 최초 1회 Hugging Face 에서 내려받으므로 **"오프라인 추론"과 "무설치·무다운로드"는 다르다.**

파일럿 최소 규격 = 도구 5~10개 · 한국어 요청 60개(정상 30 · 표현 변형 10 · 모호 10 · no-tool/위험 10) · 대상 기기 latency·peak RAM 동시 측정.

<!-- 흡수 2026-08-27 · Codex 패킷 four-source-independent-teardown ③Gate 후 작가 승인("1, 2는 ok"). 게이트 기록 = four-source-teardown-gate-2026-08-27 -->

## 인접 지식

- [Fixed-Persona SLMs with Modular Memory — 소비자급 하드웨어 다중 NPC 대화](slm-dynamic-content-generation.md) — Fixed-Persona SLM + LoRA 고정 + 외부 벡터 메모리 (NPC 다중 대화 아키텍처). *LoRA를 성격 고정에* 쓰는 변형.
- [LLM in a Flash (Alizadeh et al. 2023, Apple)](llm-in-a-flash.md) — 온디바이스 *추론* 메모리 최적화(flash 저장 + selective load). 파인튜닝이 아니라 배포 단계 최적화 — ④⑤ 단계 심화판.
- 기법 계보: PEFT/LoRA(소수 가중치 갱신) → QLoRA(양자화+LoRA) → int4 배포.
