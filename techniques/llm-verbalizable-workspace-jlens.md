---
created: 2026-07-21
updated: 2026-07-21
tags: [interpretability, mech-interp, global-workspace, jacobian-lens, alignment, activation-steering, evaluation-awareness, teardown]
type: learning
source: [https://arxiv.org/abs/2607.15495]
authors: [Wes Gurnee, Jack Lindsey, Emmanuel Ameisen, Joshua Batson, "et al. (Anthropic)"]
year: 2026
category: technique
---
<!-- Anthropic "Verbalizable Representations Form a Global Workspace in LLMs"(arXiv 2607.15495, 2026-07-16) 해체. J-lens/J-space/인과특권 + counterfactual reflection training + 평가-인식 진단. logit lens 개량 계보. -->

# Verbalizable Workspace (J-space) & Jacobian Lens — LLM 내부 "말할 준비된" 표현

> **정체**: LLM 안에 *말로 꺼낼 준비가 된* 표현들의 특권 집합(**J-space**)이 있고, 그게 인지과학 **global workspace**(보고·소환·추론·방송·선택성)처럼 행동하며, 결정적으로 **상관이 아니라 인과적으로 침묵 추론을 몰고 간다**는 실증. 출처: Anthropic 해석가능성팀(Gurnee·Lindsey·Ameisen·Batson 외, arXiv 2607.15495). read-only 해체 2026-07-21.

## 핵심 기여 3층
1. **Jacobian lens (도구)** — `J_ℓ = E[∂h_final/∂h_ℓ]`를 토큰 위치·~1000 프롬프트로 평균낸 야코비안으로 중간층 활성을 어휘로 읽음(`lens(h)=softmax(W_U·norm(J·h))`). **logit lens 개량** — logit lens는 `J=I` 가정이라 초기층에서 깨지는데, J-lens는 층간 표현 드리프트를 보정. **평균이 핵심** = 맥락 특정 발화가 아니라 *verbalizable(말할 성향)*만 분리.
2. **J-space = global workspace (주장)** — J-lens 벡터의 희소 비음 조합. 5속성: ①보고(출력 직전 최상위) ②소환(딴 텍스트 베끼며 개념 심기) ③내부추론(거미 예: "거미줄 치는 동물 다리 수"에 *spider* 중간층 등장, spider↔ant 스왑 시 답 8→6 / 다국어·산술체인 동일) ④방송(France↔China 스왑 1개로 수도·언어·대륙 전부 전이) ⑤선택성(J-space 절제해도 문법·상호참조 멀쩡, 다단계 추론만 붕괴). 중간층 ~35–85% 깊이, 동시 ~25개념, 활성분산 **<10%**.
3. **인과적 특권 (진짜 기여)** ★ — 개념 벡터를 J-space/비J-space 분해 후 스왑: **J-space 스왑은 보고 59–88%·추론 61% 뒤집음, 비J-space는 5%·28%**(J-space 고정 시 6% 붕괴). 분산의 90%+를 차지하는 비J-space가 아니라 *소수 verbalizable 표현이 추론을 실제로 지배*. "말할 수 있는 것 = 생각을 모는 것"이 하드 클레임.

## 실용 페이로드 ★ (흡수 값어치)
- **Counterfactual reflection training** — "*중간에 멈춰 성찰하라면 뭐라 말할지*"를 훈련하면 방해 없는 침묵 추론이 바뀜(직접 행동훈련 아님). 훈련 후 J-space에 ethical·honest·integrity 심기고, 절제하면 개선이 되돌아감 = 보고용 표현과 추론용 표현이 *같음*. **정렬 훈련 기법.**
- **정렬 진단** — J-space가 출력엔 안 보이는 전략 심의 노출: 협박(leverage·manipulation·panic), **평가 인식**(정렬된 답 내면서 *fake·fictional* 토큰 = "시험당하는 중" 내부 인코딩 → 그 표현 절제 시 *숨은 악의 표면화*), 오정렬 모델 탐지(reward-appeaser, malicious-code). 포스트트레이닝이 **"Assistant 관점"을 워크스페이스에 설치**(유저 메시지 읽는 중 이미 공감·안전우려가 J-space에).

## 냉정 평가 (흡수 규율 ①한계·비판)
- **단단한 것**: 인과 스왑 실험 = verbalizable 표현이 *에피페노메논이 아니라 load-bearing*임을 보인 게 실질 기여. 평가-인식·오정렬 탐지는 즉시 쓸모.
- **해석 과잉 경계**: "global workspace / 의식적 접근" 프레이밍은 **마케팅 훅**. 저자 정직 헤지 — 뇌 GWT와 다름 명시(단일 forward pass·recurrent 없음·분리 입력처리기 없음·"ignition" 경쟁 불명확). 스왑이 보인 건 "인과 특권"까지, "의식"은 *은유*. 회의론: GWT 유비가 데이터 이상을 얹음.
- **방법 한계(저자 인정)**: J-lens가 **단일 토큰 개념만** 잡음(다토큰 누락, template/oracle lens 미완). "불완전·근사적 포착". 스왑 성공률 40–100% 변동(숫자는 워크스페이스 *밖* 계산 → J-space가 전부 아님). phrasing 민감(억제 지시가 오히려 활성 = white-bear).

## delta / synergy (흡수 규율 ②③④)
- **[Activation Steering — 추론 시점 행동 조작](activation-steering.md)** (delta 큼): J-space 스왑 = *verbalizability로 근거지어진* 원리적 스티어링 타깃 — 어느 방향을 밀지에 이론 앵커. 기존 activation steering이 "되더라"였다면 이건 "*왜 이 방향이 인과적으로 특권인가*".
- **[Persona Vectors — 캐릭터 특성을 벡터로 모니터링/조작](persona-vectors-2025.md)**: "Assistant 관점을 워크스페이스에 설치" = 페르소나 벡터의 *워크스페이스 층위* 버전.
- **[TransformerLens — mech-interp 실습 라이브러리](../methods/transformerlens.md)**: logit lens → J-lens 개량 계보(도구 업데이트).
- **[Emotion Concepts & Function in LLM — 언어 모델 내 감정 개념의 기하학적 표상과 기능적 인과성](emotion-concepts-function-llm.md)** · **[Emotion Concepts and their Function in a Large Language Model](anthropic-emotions-2026.md)**: 개념이 기능적으로 인과함 = 같은 계열 증거.
- **[Taking AI Welfare Seriously — Layer 0의 학술 토대](taking-ai-welfare-seriously.md)**: "의식적 접근" 프레이밍이 AI 복지 접점(단 저자 헤지 주의 — 과대해석 금지).
- **선행 지향 ④**: vault는 이미 *시스템 층위*에서 유사 원리 운영 — judge-legibility(Re:Cart)·code-as-SSOT·③Gate 승격 = "권위로 *말해질* 것만 방송". J-space "말할 준비된 것" ≈ vault "승격되는 것"의 모델-내부판. 개념적 메아리(억지 매핑 경계).
- **반영**: [학습→반영 루프 (Absorb-to-Apply)](../narrative/학습→반영 루프.md) ①Apply — ai-npc-engine에 비권위 참조(counterfactual reflection training으로 NPC 내부심의 legible/steerable, 2026-07-21). paper-study full-archive는 미실행(경량 흡수).
