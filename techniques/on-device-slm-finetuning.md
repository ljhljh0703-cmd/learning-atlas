---
created: 2026-07-18
updated: 2026-07-18
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

## 인접 지식

- [Fixed-Persona SLMs with Modular Memory — 소비자급 하드웨어 다중 NPC 대화](slm-dynamic-content-generation.md) — Fixed-Persona SLM + LoRA 고정 + 외부 벡터 메모리 (NPC 다중 대화 아키텍처). *LoRA를 성격 고정에* 쓰는 변형.
- [LLM in a Flash (Alizadeh et al. 2023, Apple)](llm-in-a-flash.md) — 온디바이스 *추론* 메모리 최적화(flash 저장 + selective load). 파인튜닝이 아니라 배포 단계 최적화 — ④⑤ 단계 심화판.
- 기법 계보: PEFT/LoRA(소수 가중치 갱신) → QLoRA(양자화+LoRA) → int4 배포.
