---
created: 2026-04-22
updated: 2026-04-22
type: learning
tags: [AI, LLM, mech-interp, activation-steering, ActAdd, CAA, alignment]
source: https://arxiv.org/abs/2312.06681
category: technique
---

# Activation Steering — 추론 시점 행동 조작

*Turner et al. (ActAdd, 2023), Panickssery et al. (CAA, 2023)*

[Emotion Concepts and their Function in a Large Language Model](anthropic-emotions-2026.md)가 입증한 "emotion vector → 출력 변화"의 **방법론적 토대**.
파인튜닝 없이, 추론 시점에 활성화 벡터를 더하는 것만으로 모델 행동을 조작.

---

## 한 줄 요약

> 모델의 residual stream에 **steering vector**를 더하면(또는 빼면) 파인튜닝 없이 inference 시점에 행동(감정, 주제, 정직함 등)이 인과적으로 바뀐다.

---

## 핵심 개념

### 1. ActAdd (Activation Addition) — Turner et al.

가장 단순한 형태:
- 대조 프롬프트 쌍 ("Love" vs "Hate") → 각각의 hidden state 추출
- 차이 벡터 = **steering vector**
- 추론 시점에 모든 토큰 위치 hidden state에 (계수 × 벡터) 더하기

**특징:** 단 1쌍의 contrast로도 작동. 학습 불필요.

### 2. CAA (Contrastive Activation Addition) — Panickssery et al.

ActAdd의 안정화 버전:
- **수백~수천 쌍**의 (positive, negative) behavior 예시 평균
- residual stream의 layer별로 벡터 추출
- 계수로 강도 조절 (양수 = 행동 증폭, 음수 = 억제)

**대상 behavior:** 정직함 vs 환각, sycophancy, 거절, 위험 답변 등

### 3. 작동 원리 (가설)

LLM은 학습 중 **개념별 방향(direction)**을 활성화 공간에 자연 형성.
→ 그 방향을 직접 조작하면 출력이 인과적으로 변함.
→ [Emotion Concepts and their Function in a Large Language Model](anthropic-emotions-2026.md)가 emotion 개념에 대해 동일 현상을 입증.

### 4. 다른 변형

| 기법 | 차이점 |
|------|------|
| Representation Engineering (RepE) | Layer별 다양한 방향 동시 조작 |
| K-Steering | 다중 행동 동시 조작, 클러스터 기반 |
| Persona Vectors | 페르소나 차원에서의 steering (다음 학습 후보) |

---

## 기술 스택

| 도구 | 용도 |
|------|------|
| TransformerLens | hidden state hook + 조작 |
| nrimsky/CAA (GitHub) | CAA 공식 구현 |
| RepEng / nnsight | 활성화 분석/조작 라이브러리 |
| 대상 모델 | Llama 2/3, Qwen, Gemma 등 open weights |

**API 모델 한계:** Claude/GPT/Gemini API는 hidden state 접근 불가 → **prompt engineering만 가능**.

---

## 내 생각 — AI NPC 관점

### 직접적 연결: **중간 (지금) → 높음 (장기)**

지금 당장 적용은 어려움 — 게임 NPC를 open weights 모델로 굴려야 가능.
하지만 **NPC 페르소나 일관성의 궁극 해법**으로는 1순위.

### 개념적 수확

1. **페르소나 유지의 새 메커니즘**:
   - 시스템 프롬프트 = 출발선만 정함, 멀티턴 후 드리프트
   - Steering vector = **매 토큰마다 페르소나 방향 재주입** → 드리프트 차단
2. **감정 상태를 코드 변수로**:
   - 현재 게임 상태(분노 +0.6) → 그 강도로 anger vector 주입
   - "프롬프트로 감정 묘사" → "감정 좌표를 직접 활성화에 더함"으로 패러다임 전환
3. **안전장치도 같은 메커니즘**:
   - desperation 벡터 음수 계수 = 조작/shortcut 행동 억제 ([Emotion Concepts and their Function in a Large Language Model](anthropic-emotions-2026.md) 결과)

### 블루프린트 연결

- **Layer 1 (캐릭터 정의)**: 캐릭터를 prompt + persona vector 한 쌍으로 표현
- **Layer 2 (대화)**: 매 응답 시 현재 감정 좌표를 steering으로 주입 → 드리프트 방지
- **Layer 4 (관계)**: 관계 상태 변화를 steering 계수 변화로 매핑
- **공통 안전성**: desperation/조작 벡터를 항상 약하게 음수 적용 → 게임 NPC가 의도치 않게 플레이어를 속이지 않게

### 갤럽 강점 연결

traits "전략" — 여러 경로 동시 평가. Steering은 **prompt와 다른 축**의 제어 경로 → 옵션을 늘림.

---

## 열린 질문

- **Persona vector vs Emotion vector**: 어떻게 합성/순서 적용하나
- 다중 벡터를 동시에 적용할 때 **간섭/상쇄** 효과는
- 캐릭터별 steering vector를 **fine-tuning 대신** 두는 것이 정말 효율적인가
- Game tick 단위로 계수를 변화시킬 때 출력 자연스러움은
- 한국어 모델(HyperCLOVA, Solar 등)에서도 동일 현상 재현되나

---

## 다음 학습 후보

- **Persona Vectors** — 페르소나 자체를 steering vector로 (이미 다음 학습 큐에 있음)
- **Representation Engineering (RepE)** — Zou et al. 종합 프레임워크
- **K-Steering / multi-behavior steering** — 여러 벡터 합성
- **Inference-Time Intervention (ITI)** — Truthful 응답 유도 사례
- **TransformerLens 실습** — 직접 vector 추출/주입 구현 (학습 큐 #4)

---

## 적용 아이디어

### 단기 (지금)
- Open weights 모델 (Qwen 2.5 7B 등) 다운로드 + nrimsky/CAA 코드로 emotion vector 추출 시도
- hyunsoo-bot를 prompt 기반 그대로 두되, **개념 검증용** 별도 스크립트로 steering 효과 측정

### 중기
- 캐릭터별 persona vector 라이브러리 구축 (현수, 북켓몬 NPC 후보 등)
- 게임 상태 → steering 계수 매핑 함수 설계

### 장기 (논문 후보)
- "Persona Stability via Multi-Vector Steering in Game NPCs" — prompt + persona + emotion 3중 합성의 안정성 분석
- paper-write workflow의 후보 1번과 결합 가능

---

## 연결된 페이지

- [Emotion Concepts and their Function in a Large Language Model](anthropic-emotions-2026.md) — emotion vector의 인과성 입증 = activation steering의 응용 사례
- [Russell's Circumplex & PAD — 감정 모델링의 표준 어휘](emotion-models-circumplex-pad.md) — steering이 조작하는 좌표의 어휘
- ai-npc-blueprint — Layer 1, 2, 4 안정성 메커니즘
- [Parcae — Stable Looped Language Models](parcae-looped-lm.md) — 다른 mech-interp 인접 연구
- bookemon — 페르소나 일관성(F-05) 적용 후보
- hyunsoo-bot — prompt 기반 페르소나의 한계 검증

---

## 출처

- ActAdd: Turner et al. (2023). *Activation Addition: Steering Language Models Without Optimization*. <https://arxiv.org/abs/2308.10248>
- CAA: Panickssery, Gabrieli, Schulz, Tong, Hubinger, Turner (2023). *Steering Llama 2 via Contrastive Activation Addition*. <https://arxiv.org/abs/2312.06681>
- 구현: <https://github.com/nrimsky/CAA>
- 종합: [Emergent Mind — Contrastive Activation Steering](https://www.emergentmind.com/topics/contrastive-activation-steering)
