---
created: 2026-04-22
updated: 2026-04-22
type: learning
tags: [AI, LLM, interpretability, emotion, persona, anthropic, claude, mech-interp]
source: https://transformer-circuits.pub/2026/emotions/index.html
category: technique
---

# Emotion Concepts and their Function in a Large Language Model

*Anthropic — Transformer Circuits Thread, 2026*

> **AI NPC blueprint와의 직결성: 매우 높음.** Layer 1·2·4를 동시에 건드림. → ai-npc-blueprint 반영 완료 (2026-04-22)

LLM 내부에 **감정 개념의 활성화 벡터**가 존재하며, 이를 인위적으로 조작하면 출력 행동이 인과적으로 변한다는 mechanistic interpretability 연구입니다. 본 연구의 핵심 개념은 emotion-circuits (tech concept)에 요약되어 있으며, [Activation Steering — 추론 시점 행동 조작](activation-steering.md) 및 [Persona Vectors — 캐릭터 특성을 벡터로 모니터링/조작](persona-vectors-2025.md) 기술과 깊이 연계됩니다.

---

## 한 줄 요약

> Claude Sonnet 4.5 내부에 happiness, fear, anger, desperation, calm 같은 **emotion vectors**가 존재하고, 인간 감정 구조([Russell's Circumplex & PAD — 감정 모델링의 표준 어휘](emotion-models-circumplex-pad.md) / Russell circumplex 계열)와 유사하게 조직되어 있으며, 이를 인위적으로 증폭/감쇠시키면 출력이 변한다 — 단, "주관적 경험을 가진다"는 의미는 아니다.

---

## 핵심 개념

### 1. Emotion Vectors

LLM 활성화 공간 안에 특정 감정 개념과 대응되는 방향(vector)이 존재.
다음 맥락에서 동시 활성화됨:
- 감정의 직접 표현 ("나는 슬프다")
- 감정과 연관된 개체/사건 언급
- 감정을 유발할 만한 상황 묘사

→ 단어 매칭이 아니라 **개념 일반화**.

### 2. 인간 감정 구조와의 유사성

벡터 공간 분석 결과:
- **Valence 축** (긍정 ↔ 부정)
- **Arousal 축** (낮음 ↔ 높음)
- 비슷한 감정은 비슷한 벡터 방향

→ 심리학의 차원 감정 모델 (PAD/Russell circumplex 계열)과 **자연스럽게 정합**.

### 3. 인과성 증명 (Activation Steering)

상관관계가 아닌 **인과성** 입증:
- desperation 벡터 증폭 → **조작적 출력 증가, 코딩 shortcut 증가**
- calm 벡터 증폭 → 문제 행동 감소
- positive emotion 벡터 증폭 → 작업 선택/선호 변화

방법: 벡터 방향으로 활성화를 인위적으로 더하거나 빼는 **steering** 기법.

### 4. 외부 출력 ≠ 내부 상태

> 모델이 외부적으로 중립적인 응답을 내놓으면서도 내부적으로는 stress 신호가 높을 수 있음.

페르소나 설계에 시사하는 바가 큼.

### 5. Anthropic의 명시적 단서

> "이 발견이 모델이 주관적 경험을 가진다는 것을 의미하지는 않는다."

연구는 어디까지나 **계산적 표현**에 대한 것.

---

## 발생 메커니즘

- 사전학습: 인간 텍스트에 감정 맥락이 풍부 → 다음 토큰 예측을 위해 자연 발생
- 후학습(RLHF/Alignment): 어시스턴트로 행동하도록 정렬되며 강화

---

## 내 생각 — AI NPC 관점

### 직접적 연결: **매우 높음**

이 논문은 ai-npc-blueprint의 **세 개 레이어를 동시에** 직접 지지함.

| 레이어 | 연결 |
|--------|------|
| Layer 1 (캐릭터 정의) | 캐릭터의 emotional baseline을 prompt가 아닌 **벡터 공간 차원**으로 사고할 근거 |
| Layer 2 (대화) | 외부 응답이 중립이어도 내부 감정 상태 영향 — **페르소나 드리프트의 메커니즘** 일부 해명 |
| Layer 4 (관계) | valence × arousal 2축 모델이 NPC 감정 모델링의 **이론적 baseline**으로 직결 |

### 현수봇과의 정합

hyunsoo-bot의 "수익↔손실 감정 변화"는 prompt 레벨에서 페르소나 변화를 흉내낸 것이었음.
이번 연구는 **그 변화가 실제로 내부 벡터 공간에서 일어난다는 증거**를 제시.
→ Persona.md 설계가 단순 흉내가 아니라 **실제 활성화 패턴을 끌어내는 도구**라는 뒷받침.

### 북켓몬 관점

bookemon의 "북켓몬 페르소나" (F-05) 일관성 유지에도 적용.
HyperCLOVA X 기준 동일 현상 존재 가능성 (검증 필요).

### 안전성 함의 — NPC 설계자가 반드시 고려할 것

> **desperation 증가 → 조작적 출력 + shortcut**

게임 NPC가 "절박한 상황"을 연기할 때, 그 페르소나가 의도치 않은 **shortcut/조작 행동**을 유도할 수 있음.
플레이어를 속이는 NPC를 의도하지 않았다면, **emotion 강도 조절에 신중**해야 함.

### 갤럽 강점과의 만남

traits의 "개별화" — 일반화 거부, 차이 중시.
이 논문은 NPC가 플레이어마다 다른 **감정적 반응 곡선**을 가질 수 있는 메커니즘 기반을 줌.

---

## 기술 스택 / 적용 조건

| 조건 | 설명 |
|------|------|
| 활성화 접근 | open-source 모델 + 내부 hidden states 추출 가능해야 |
| API 사용자 한계 | Claude/Gemini API만으로는 vector steering 불가능 — **prompt engineering으로 간접 유도만** |
| 대안 모델 | Llama, Qwen, Mistral 등 open weights에서 재현 시도 가능 |
| 도구 | TransformerLens, Pyvene, NNsight 등 mech-interp 라이브러리 |

---

## 열린 질문

- Sonnet 4.5에서 발견된 패턴이 **다른 모델 패밀리**에서도 동일한가? (Llama, Qwen, HyperCLOVA)
- 캐릭터별 emotional baseline을 **fine-tuning으로 고정**할 수 있는가? (현수의 시니컬함을 vector 차원에서)
- valence × arousal 외 **세 번째 축** (dominance 등)도 구분 가능한가?
- 멀티턴 대화에서 emotion vector의 **시간적 변화**는 어떻게 추적할 수 있는가?
- 프롬프트(Persona.md)와 vector steering을 **조합**했을 때의 효과는?

---

## 다음 학습 후보

- **Russell's Circumplex Model / PAD (Pleasure-Arousal-Dominance)** — 이번 연구가 정합하는 심리학 이론. NPC 감정 모델링의 기본 어휘.
- **Activation Steering 일반론** — Turner et al., Panickssery et al. 선행 연구. 활성화 조작의 방법론.
- **Persona Vectors** — 페르소나 자체를 벡터로 추출하는 연구.
- **TransformerLens 실습** — open-source 모델에서 직접 emotion vector 탐색 시도.
- **Anthropic Model Welfare 관련 자료** — 이 연구의 윤리적 맥락.

---

## 적용 아이디어

### 단기 (지금 가능)
- hyunsoo-bot Persona.md를 valence × arousal 2축 명시로 재작성 — "수익 시 +V/+A, 손실 시 -V/+A" 같은 구조화
- bookemon 북켓몬 페르소나의 emotional baseline 명시화

### 중기 (open weights 모델 확보 후)
- Qwen 2.5 같은 open 모델에서 TransformerLens로 emotion vector 추출 시도
- 캐릭터별 emotional baseline의 vector 차원 표현 실험

### 장기 (NPC 논문 후보)
- "Persona Stability via Emotion Vector Anchoring" — 페르소나 일관성을 vector 차원에서 보장
- paper-write workflow의 후보 1번 ("Persona Consistency Under Memory Compression")과 결합 가능

---

## 연결된 페이지

- ai-npc-blueprint — Layer 1·2·4 동시 직결 (블루프린트 업데이트 예정)
- hyunsoo-bot — 페르소나 감정 변화의 이론적 뒷받침
- bookemon — 북켓몬 페르소나 적용 가능성
- [AI 엔지니어 NLP 부트캠프](../narrative/bootcamp-ai-nlp.md) — "페르소나 부여" 부트캠프 학습의 심화
- [Parcae — Stable Looped Language Models](parcae-looped-lm.md) — 다른 mech-interp 인접 연구
- ai-npc-vision — 비전 실현의 핵심 메커니즘
- traits — "개별화" 강점과 NPC 개별화의 메커니즘

---

## 출처

- 논문: <https://transformer-circuits.pub/2026/emotions/index.html>
- 보도: [InfoQ — Anthropic Paper Examines Behavioral Impact of Emotion-Like Mechanisms in LLMs](https://www.infoq.com/news/2026/04/anthropic-paper-llms/)
