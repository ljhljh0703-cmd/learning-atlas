---
created: 2026-06-18
updated: 2026-06-18
type: learning
tags: [AI, agent-harness, spec-driven, prompt-optimization, defect-detection, text-gradient, llm-as-judge, closed-loop, ceiling-escalation, naver]
source: 스펙만 바꾸면 프롬프트가 따라옵니다 - 답변 생성 모델 자동화 파이프라인 (NAVER D2)
authors: [정영훈, 김규철, 박세]
year: 2026
category: method
---

# 스펙→프롬프트 Closed-loop — 스펙 변경이 프롬프트 자동 최적화로 흐르는 파이프라인 (NAVER, 정영훈·김규철·박세)

*NAVER D2 발표(에이전트 리즈닝 앤 플래닝) · NotebookLM 충실(depth) 외주 ④Gate PASS · **세 번째 NAVER 영상 = 하네스 직결**(vault spec=test·done-gate·ceiling escalation 의 *프롬프트 자가최적화 루프* 확장)*

스펙이 1줄 바뀌면 프롬프트·평가셋·학습데이터가 도미노로 영향받아 사람이 매번 손봐야 하는 게 페인포인트였다. NAVER 팀은 **스펙을 기준점(SSOT)**으로 두고 → **결함 탐지(defect detection)**가 "스펙 위반 여부"를 판단 → 그 결과를 **보상 신호(text gradient)**로 → **프롬프트 최적화**가 자동 수행하는 closed-loop 로 풀었다. 프롬프트로 안 되는 한계는 **SFT 로 위임**(무한루프 구조 차단). 프롬프트 최적화 41.7% → SFT 결합 62% 개선. = vault "spec=test"([Forge Spec-Gate (why-was-fable-banned) — 차용 해체](forge-spec-gate.md))의 *자동 최적화 루프* 확장 + ceiling escalation([AutoResearch 프로덕션 인스턴스 — LLHLS ABR 자율 실험으로 QoE 17.1% 향상 (NAVER D2, 배웅준)](autoresearch-llhls-abr.md) Halt) 의 "다른 레이어 위임" 완성형.

---

## 한 줄 요약

> "스펙을 갱신하면 자동으로 그 스펙을 반영한 최적 프롬프트를 찾아주는 closed-loop" — 평가를 *원자 체크리스트(예/아니오)*로 쪼개고, '틀렸다'가 아니라 *어디를 어떻게 고쳐라*(text gradient)를 보상으로 넘기며, 프롬프트 한계 도달 시 SFT 로 위임해 무한 시도를 구조적으로 차단.

---

## 확증 매핑 — 발표 개념 → vault 기존 자산 (재서술 X, 링크만 — #3)

1. **스펙이 기준점(SSOT)·결함 판단 기준** → [Forge Spec-Gate (why-was-fable-banned) — 차용 해체](forge-spec-gate.md) spec=test + vault "위키=SSOT, 모든 결정 위키에 먼저 잠금". 확증.
2. **에이전트 샌드박스 권한 경계**(자기 모듈만 자동 업데이트 / 스펙 자체 수정·정책 변경은 사람) → 헌법 HITL 스테이징(`스테이징 영역`) + 권한 분리. 강한 확증.
3. **스펙 매니저가 PR 생성→충돌 검증→사람 승인** → vault `스테이징 영역` HITL merge 절차와 동형. 확증.
4. **메모리 상속**(평가기록·계획 마크다운 누적, 제로베이스 시작 X) → [AutoResearch 프로덕션 인스턴스 — LLHLS ABR 자율 실험으로 QoE 17.1% 향상 (NAVER D2, 배웅준)](autoresearch-llhls-abr.md) lessons.json + vault lessons. 확증.
5. **무한 시도 구조적 차단**(목표 점수 도달 or 한계 시 멈춤) → [AutoResearch 프로덕션 인스턴스 — LLHLS ABR 자율 실험으로 QoE 17.1% 향상 (NAVER D2, 배웅준)](autoresearch-llhls-abr.md) escalation Halt + agent-harness ceiling. 확증.
6. **base.md(공통)+domain.md(특화) 스펙 분리** → vault CLAUDE.md(헌법)+`<project>-AGENTS.md`(특화) 2층 구조. 확증.

---

## 진짜 새것 (vault delta)

1. **★Text Gradient = 방향성 보상 신호** — done-gate 가 "exit 0 / fail"의 *binary*인 vault 와 달리, 결함 탐지가 "단순히 틀렸다"가 아니라 **"어디를 어떻게 고쳐야 하는지"**까지 출력해 프롬프트 최적화의 보상으로 넘김. = 평가 신호가 *판정*에서 *개선 방향*으로 진화. → dispatch-builder done-gate 보강(2026-06-18).
2. **★평가의 원자 분해**(28개 결함 유형 예/아니오 체크리스트) — "복잡·주관적 평가를 작은 예/아니오로 분리하면 judge 판단 범위↓·신호 명확↑". LLM-as-judge 신뢰도 기법. vault ③Gate 가 통째 대조인 것의 *원자화* 처방.
3. **★Judge 컨텍스트 국소화(Localization)** — judge 64K 부담↓ 위해 *응답 입출력만 보는 스코프* / *정책 원문만 인용하는 스코프* 분리. = RTK·Progressive Disclosure 의 *평가 단계* 적용(vault 는 작업 단계만 RTK 적용했음).
4. **프롬프트 한계→SFT 위임**(41.7%→62%) — 프롬프트 최적화로 못 푸는 유형(예: 응답 길이 조절)은 무한루프 대신 *fine-tuning 레이어로 위임*. = escalation Halt 의 **"다른 레이어로 넘김" 완성형**(vault 는 Halt=사람 호출까지만, *대체 해결 레이어* 개념 없었음).
5. **회귀 차단 영역 등록** — 한 결함 고쳐 다른 곳 망가지는 regression 막으려 차단 영역 등록. vault 회귀 green 원칙의 *프롬프트 최적화* 버전.

---

## 한계·미검증 (격상 금지)

- **타임스탬프 없음**: 텍스트 소스 → (블록 n) 대체(정직).
- **자막 오인식 정리됨**(RETURN §6): `프롬프트/옵티마이제이션`(←프럼프트/옵티마이션), `에이전트 스펙`(←에이트 스펙), `저지(Judge)`(←저치), `Defect Rate`(←디펙 웨레이트), `Multi-hop QA`(←월티오브 QA).
- **모델명·논문명·연도 = 자막 추정, 박제 X**(verifier-claims-need-regate): `Opus`(←오프스 4.1), `Rubric as a Reward`/`Zephyr`(논문명 추정), `ICLR 2024`(←iclr 2026월, 연도 오인식). 본 페이지는 *메커니즘*만 신뢰, 출처 인용은 미확정.
- **자가최적화 인프라**(자동 옵티마이저·SFT 파이프라인)는 vault 미보유 → 메커니즘·평가설계 원칙만 차용, 인프라 도입 아님.

---

## 반영 (학습→반영 루프)

- ✅ **dispatch-builder 슬롯3 done-gate 보강** (2026-06-18) — 평가 신호 정밀화 라인: 원자 체크리스트 분해 + judge 컨텍스트 국소화 + text gradient(개선방향 보상) + 프롬프트 한계 시 다른 레이어 위임.
- 🔗 **agent-harness ceiling escalation 연결**: "프롬프트로 안 되면 SFT/사람 레이어로 위임"은 ceiling escalation 의 *대체 해결 레이어* 개념 — H-Core 신규항목 추가는 구조변경 회피, dispatch-builder·본 페이지 cross-ref 로 보강(②Apply 검증 후 H-Core 승격 backlog).
- 🔗 **[Forge Spec-Gate (why-was-fable-banned) — 차용 해체](forge-spec-gate.md)·[SCA-Gate & Spike 1A RAG Failure Defense Specification](sca-gate-specification.md) 연결**: spec=판단기준 확증(룰 신설 X).
- ❌ **확증분**(SSOT·권한경계·PR승인·메모리상속·base/domain 분리)은 이미 vault 보유 → 흡수만.
- ⚙️ **인프라 미도입 명시**: 프롬프트 자가최적화 루프 *자체*는 작가 vault 에 옵티마이저/SFT 인프라가 없어 미도입(개념·평가설계만 흡수). 도입 트리거 = 프롬프트 수동 튜닝이 반복 병목이 될 때.

---

## 연결된 페이지

- [Forge Spec-Gate (why-was-fable-banned) — 차용 해체](forge-spec-gate.md) (spec=test 기준점) · [SCA-Gate & Spike 1A RAG Failure Defense Specification](sca-gate-specification.md) (컨텍스트 평가) · [AutoResearch 프로덕션 인스턴스 — LLHLS ABR 자율 실험으로 QoE 17.1% 향상 (NAVER D2, 배웅준)](autoresearch-llhls-abr.md) (형제 NAVER 발표 + escalation Halt — 본 페이지가 "다른 레이어 위임" 으로 확장) · [Playwright E2E 에이전트 하네스 — 테스트=실행가능 명세, trace=user-facing 증빙 매체 (Naver 발표)](playwright-e2e-agent-harness.md) (형제 NAVER 발표)
- agent-harness (ceiling escalation·done-gate) · dispatch-builder (done-gate 반영처) · agent-harness-rsi-brief (RSI ②Apply — 프롬프트 자가진화 인스턴스)
- [GPT-5.5 Prompt Guidance — 결과 중심 프롬프팅](openai-prompt-guidance-gpt55.md) (프롬프트 엔지니어링 인접) · lessons (메모리 상속 동형)
