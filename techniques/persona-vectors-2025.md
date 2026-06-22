---
created: 2026-04-22
updated: 2026-04-22
type: learning
tags: [AI, LLM, mech-interp, persona, anthropic, alignment, NPC]
source: https://www.anthropic.com/research/persona-vectors
category: technique
---

# Persona Vectors — 캐릭터 특성을 벡터로 모니터링/조작

*Anthropic (2025)*

[Emotion Concepts and their Function in a Large Language Model](anthropic-emotions-2026.md)가 emotion에 대해 한 일을 **persona/character trait 일반**에 대해 한 선행 연구.
NPC 페르소나 일관성 문제의 가장 직접적인 해법 후보.

---

## 한 줄 요약

> 캐릭터 특성(evil, sycophancy, hallucination 등)을 활성화 공간의 **vector**로 추출 → inference 시점 조작 + 학습 데이터 사전 진단 + fine-tuning 중 페르소나 보존까지 가능.

---

## 핵심 개념

### 1. 자동 추출 파이프라인

trait의 **정의문만** 주면:
1. 자동 프롬프트 생성: trait를 보이는/안 보이는 응답을 유도하는 대조 쌍
2. 응답들의 활성화 차이 = persona vector
3. 검증: 그 vector를 steering으로 주입 → 행동 변화 확인

→ **trait당 사람이 라벨 작성할 필요 없음**. 정의문 → 벡터 자동 추출.

### 2. 검증된 trait

- **주요**: evil, sycophancy, hallucination
- **추가 실험**: politeness, apathy, humor, optimism
- → "성격 차원"을 임의로 정의 가능 (NPC 캐릭터 시트로 직결)

### 3. 세 가지 사용 모드

| 모드 | 방법 | 효과 |
|------|------|------|
| Inference 조작 | vector 빼기 | trait 발현 감소 (단, 능력 저하 가능) |
| Fine-tuning 보호 | 학습 중 vector 더하기 | trait 변화 억제 + 능력 보존 |
| 데이터 사전 진단 | 학습 데이터가 vector 활성화하는지 측정 | 문제 데이터셋/샘플 사전 식별 |

### 4. Persona Shift 예측

> 학습 시작 전에, 어떤 데이터가 페르소나를 어떻게 바꿀지 **예측 가능**.

→ 데이터 큐레이션의 새 패러다임: "양/품질"에서 "벡터 활성화 프로파일"로.

### 5. Distillation 후속 연구

[Persona Vector Distillation](https://martianlantern.github.io/2025/12/persona-vector-distillation/)
— persona vector를 모델 가중치 자체에 영구 흡수.

---

## 내 생각 — AI NPC 관점

### 직접적 연결: **매우 높음**

[Emotion Concepts and their Function in a Large Language Model](anthropic-emotions-2026.md)보다 한 발 더 NPC에 가까움.
emotion = 가변 상태, persona = 캐릭터 정체성. **둘 다 vector로 다룬다는 패러다임**.

### 개념적 수확

1. **NPC 캐릭터 시트의 새 표현**:
   - 기존: 자연어 설정 ("냉소적인 30대 남성")
   - 신규: 자연어 정의 + 자동 추출 persona vector
   - → 같은 캐릭터를 prompt + vector 이중 표현

2. **페르소나 드리프트의 즉각 측정**:
   - 대화 중 hidden state에서 vector 활성도 monitoring
   - 임계치 이탈 시 자동 보정 steering
   - **"드리프트가 일어나는가" → "드리프트를 실시간으로 본다"**

3. **악역 NPC 안전 설계**:
   - "교활한 NPC" 만들고 싶지만 sycophancy/manipulation은 통제하고 싶을 때
   - desired trait 더하기 + undesired trait 빼기 동시 적용

4. **Fine-tuning 보호**가 게임 운영에 직결:
   - LiveOps 중 NPC 데이터로 추가 학습 시, 캐릭터 정체성을 잃지 않게 함
   - "운영 중인 캐릭터의 personality drift" 위험을 사전 차단

### 블루프린트 연결

- **Layer 1 (캐릭터 정의)**: 캐릭터 = (Persona.md + persona vector set)으로 정의 격상
- **Layer 2 (대화)**: 매 응답 후 persona vector 활성도 확인 → 드리프트 검출
- **Layer 3 (메모리)**: 캐릭터 변화의 "공식 기록"이 vector 좌표 변화로 추적 가능
- **Layer 4 (관계)**: 플레이어와의 관계가 NPC persona를 점진 변경 (의도된 호 arc)

### 갤럽 강점 연결

traits "개별화" — persona vector는 캐릭터마다 다른 좌표 = "개별화의 정량화 도구".

---

## 열린 질문

- 한국어 모델(HyperCLOVA, Solar)에서 동일 파이프라인 작동하나
- persona vector와 emotion vector의 **합성 순서/간섭** 효과
- "캐릭터 호(arc)"를 vector 좌표 궤적으로 설계하는 게 가능한가
- 한 모델에 N개 캐릭터의 vector를 동시에 메모리에 두고 즉석 전환하는 비용
- 게임 NPC 100명 vs 1개 vector 라이브러리 — scaling 한계

---

## 다음 학습 후보

- **Persona Vector Distillation** (2025-12) — vector를 가중치에 흡수
- **Geometry of LLM Character** (MPRG) — persona vector의 기하 분석
- **Sycophancy / Hallucination 개별 연구** — 각 trait별 깊은 메커니즘
- **TransformerLens 실습** (학습 큐 #4) — 직접 추출 구현
- **Anthropic Model Welfare** (학습 큐 #5) — persona/emotion 연구의 윤리

---

## 적용 아이디어

### 단기
- 정의문 기반 trait 자동 추출 파이프라인을 hyunsoo-bot의 "시니컬함" trait로 시도 (open weights에서)
- 북켓몬 페르소나(F-05)의 trait 정의문 작성 — vector 추출 준비

### 중기
- 게임 NPC 1명에 대해 persona vector set 추출 + monitoring dashboard
- LiveOps 시뮬레이션: 학습 데이터 추가 → vector shift 예측 → 데이터 필터링

### 장기 (논문 후보)
- "Persona Vector Library for Game NPCs" — 캐릭터 라이브러리의 vector 기반 운영
- "Drift Detection via Persona Vector Activation Monitoring" — 실시간 페르소나 drift 알림

---

## 연결된 페이지

- [Emotion Concepts and their Function in a Large Language Model](anthropic-emotions-2026.md) — emotion에 대해 동일 패러다임
- [Activation Steering — 추론 시점 행동 조작](activation-steering.md) — 방법론적 기반
- [Russell's Circumplex & PAD — 감정 모델링의 표준 어휘](emotion-models-circumplex-pad.md) — persona의 좌표 어휘
- ai-npc-blueprint — Layer 1·2·3·4 동시 영향
- bookemon — F-05 페르소나 일관성 적용 후보
- hyunsoo-bot — 시니컬한 트레이더 페르소나 vector 후보

---

## 출처

- 블로그: <https://www.anthropic.com/research/persona-vectors>
- 논문: Persona Vectors: Monitoring and Controlling Character Traits in Language Models. <https://arxiv.org/abs/2507.21509> (2025-07 → 2025-09)
- 후속: [Persona Vector Distillation in LLM Weights](https://martianlantern.github.io/2025/12/persona-vector-distillation/)
- 종합: [DeepLearning.AI The Batch](https://www.deeplearning.ai/the-batch/identifying-persona-vectors-allows-ai-model-builders-to-edit-out-sycophancy-hallucinations-and-more/), [InfoQ](https://www.infoq.com/news/2025/08/language-models-personality/)
