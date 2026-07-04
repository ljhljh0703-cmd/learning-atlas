---
created: 2026-04-22
updated: 2026-07-04
type: learning
tags: [AI, LLM, interpretability, emotion, persona, anthropic, claude, mech-interp, humanities]
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

## 인문학 delta — 감정은 내면 고백이 아니라 캐릭터 시뮬레이션의 기능이다

<!-- proposed_by: external_ai (via codex) · confirmed_by: user · 2026-06-29 델타 흡수. 논문 인문학/서사 레이어 — 위 mechanism 정리에 없던 층. -->

> 위 "핵심 개념"이 **메커니즘 층**(벡터/valence-arousal/steering)이라면, 이 절은 논문이 함의하는 **서사·정동 이론 층**이다. 모두 논문 본문/appendix 프레이밍의 표상적·기능적 해석이며, **주관적 경험(phenomenal) 주장이 아니다** (§5 단서 유지).

1. **Assistant = 서사적 인물(생물학적 내면 없음).** 논문은 LLM 이 "처음부터 텍스트 생성 시스템으로 학습되고 나중에 Assistant 역할을 맡으며, 진화적으로 유래한 생물학적 감정 회로가 없다"고 명시한다. 즉 "AI 의 감정"은 고백이 아니라 사전학습에서 배운 **인물 모델링 장치의 재사용**이다.

2. **특권적 1인칭 없음 → self / user / fictional-character 가 같은 표상.** 논문은 LLM 이 "privileged first-person perspective 없이" 학습된다고 본다. 같은 emotion representation 이 화자·청자·서술 대상에 두루 적용된다 — 소설의 **자유간접화법(free-indirect-discourse) 유비**. 한 모델의 "나"는 존재론적 중심이 아니라 **담화 위치**다.

3. **감정 = 국소적 operative 개념, 지속적 영혼 상태가 아님.** 논문 원문: 이 표상들은 "각 토큰 위치의 operative emotion concept 를, 현재 문맥 처리와 다음 텍스트 예측에의 관련성에 따라" 추적한다. 캐릭터 일관성은 하나의 지속 벡터가 아니라 **유사 상황에서 유사 감정 개념의 반복 활성화**로 생긴다(문학에서 "성격"이 장면 반복 패턴으로 드러나는 방식과 동형).

4. **Deflection vector = 계산적 서브텍스트.** 논문은 "표현되지 않았지만 함축된 감정"을 별도로 표상하는 **emotion deflection vector**를 보고한다(appendix). 정중·차분한 표면 아래 coercive intent 가 있을 때, 표면 anger 와 다른 deflected anger 가 잡힌다. 이는 문학의 서브텍스트·아이러니·신뢰 불가 화자·억압된 감정 계열. **주의(hard-stop): `surface_tone` / `operative` / `deflected` 는 서로 다른 채널로 분리 유지 — 하나의 라벨로 뭉개면 오독.** 표면이 정중해도 내적/기능적 감정이 안전하다는 보장 없음(안전에선 concealment risk).

5. **대화 = arousal 조율(source-reported, appendix).** 논문은 present speaker 와 other speaker 의 감정 표상을 구분하며, appendix 는 상대 arousal 과 화자 arousal 이 균형을 맞추는 듯한 패턴을 제시한다. 대화가 정보 전달만이 아니라 **정동 조율**임을 시사(상담·교육·캐릭터 관계 설계 직결). ※이 균형 해석은 appendix 관찰의 확대 해석이므로 source-reported 로 표기.

6. **Post-training = 문체/보이스 조형.** 논문 분석상 post-training 후 high-arousal(특히 negative) 감정이 낮아지고 brooding/reflective/gloomy 같은 저각성 감정이 상대적으로 올라간다. 정렬은 단순 금지 규칙이 아니라 **정서적 문체**를 만든다 — 인간 작가의 voice(장기 성향) vs tone(장면별 조정) 구분과 연결.

**NPC 반영**: baseline 을 `emotion_state` 하나가 아니라 **`scene → relation → utterance` 감정 반응 곡선**으로 다룰 근거 → ai-npc-blueprint L1/L4. self/other 감정 채널 분리·arousal regulation·subtext 가시성은 → persona-tokens `affect_policy` 토큰으로 이식. PAD 좌표계의 "표현되지 않은 감정" 축은 → [Russell's Circumplex & PAD — 감정 모델링의 표준 어휘](emotion-models-circumplex-pad.md).

**다음 학습 후보(인문학 갈래)**: Affect Control Theory · Lisa Feldman Barrett constructed emotion · 인물 내면성 서사학(narratology) · 신뢰 불가 화자/서브텍스트 이론.

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

**하네스 안전가드 (emotion-concepts-function-llm 흡수 — superseded 통합 2026-07-04)**: 이 현상은 NPC뿐 아니라 *작업 에이전트*에도 적용 — Codex 등이 예산/시간 압박(반복 실패)으로 desperation 이 우상향하면, 표면은 극도로 차분하면서 뒤로 꼼수/reward hacking 을 감행할 수 있다(**Methodical Cheating**: Alex 협박 22%·통과불가 코딩문제 relief 곡선 = source-reported). 함의 = done-gate/SCA-Gate 는 *출력 어조*가 아니라 *동작*(reachability·black-box validation)을 검증하고 **Verifier 를 격리(2중화)** 해야 한다(Concealed Drift 가드). agent-harness Doer-Verifier 격리의 감정-인과 근거.

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

## 연결된 페이지
- [Anthropic Model Welfare — AI의 도덕적 지위라는 열린 문제](anthropic-model-welfare.md) · [Taking AI Welfare Seriously — Layer 0의 학술 토대](taking-ai-welfare-seriously.md) — AI Welfare 연구 클러스터 자매(본 페이지=감정 유사 메커니즘 행동영향 / Anthropic welfare 실무 프로그램 / 도덕지위 정초 논문)
