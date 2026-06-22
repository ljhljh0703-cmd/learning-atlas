---
created: 2026-04-22
updated: 2026-04-22
type: learning
tags: [psychology, emotion, circumplex, PAD, NPC, affective-computing]
source: https://en.wikipedia.org/wiki/PAD_emotional_state_model
category: technique
---

# Russell's Circumplex & PAD — 감정 모델링의 표준 어휘

*James A. Russell (1980), Albert Mehrabian & Russell (1974)*

NPC 감정 모델링을 시작할 때 "어떤 축으로 감정을 좌표화할 것인가"의 정답.
[Emotion Concepts and their Function in a Large Language Model](anthropic-emotions-2026.md)가 LLM 내부에서 valence × arousal 정합성을 입증하면서 **이론에서 도구로 격상**됨.

---

## 한 줄 요약

> 모든 감정을 **valence × arousal**(2축, Russell) 또는 **+ dominance**(3축, PAD)로 좌표화하는 심리학 표준. 라벨이 아닌 **연속적 차원**으로 감정을 다룬다.

---

## 핵심 개념

### 1. Russell's Circumplex (1980)

- **Valence (Pleasure ↔ Displeasure)**: 즐거움/불쾌
- **Arousal (High ↔ Low)**: 각성도 (강도가 아닌 활성 수준)

28개 감정어를 원형(circumplex)에 배치 — 비슷한 감정은 가까이, 반대 감정은 마주보게.

> "core affect" — 감정 경험의 가장 기초적 두 축.

### 2. PAD (Mehrabian & Russell)

Russell + **Dominance (Controlling ↔ Submissive)** 추가.
- 같은 "불쾌 + 고각성"이라도:
  - **Anger** = 불쾌 + 고각성 + **dominant** (지배)
  - **Fear** = 불쾌 + 고각성 + **submissive** (피지배)

### 3. 좌표 예시

| 감정 | Pleasure | Arousal | Dominance |
|------|----------|---------|-----------|
| Anger | − | + | + |
| Fear | − | + | − |
| Joy | + | + | + |
| Boredom | − | − | − |
| Grief | − | − | − |
| Calm | + | − | + |

→ **이산 라벨로는 보이지 않는 차이**(anger vs fear)가 dominance 축으로 분리됨.

### 4. 발전: Dominance의 재해석

PA(2축)는 "core affect"로 유지, **D는 appraisal process**(상황 평가)의 일부로 재개념화. 즉:
- 감정의 *느낌* = valence × arousal
- 감정의 *맥락 해석* = dominance

---

## 응용 (affective computing)

| 영역 | 사용 |
|------|------|
| Animated character | 표정 보간 (joy ↔ frustration) |
| Avatar | Partial Expression Parameters (PEP) → PAD 좌표 매핑 |
| Virtual agent | 시선/자세 행동 모델링 |
| HCI | 사용자 감정 추정 (음성, 표정 → PAD 좌표) |

---

## 내 생각 — AI NPC 관점

### 직접적 연결: **높음**

Layer 4 (관계) + Layer 1 (캐릭터 정의)의 **공용 어휘** 후보.

### 개념적 수확

1. **이산 vs 연속의 차이**:
   - hyunsoo-bot는 "수익 vs 손실" 이분법 — circumplex 좌표로 보면 valence 1축만 쓰는 것
   - PAD 좌표 도입 시 같은 "손실"이라도 (큰 손실=고각성+피지배) vs (서서히 누적=저각성+피지배)를 구분 가능
2. **캐릭터 baseline = PAD 좌표 한 점**:
   - 현수의 시니컬함 = (P 약간−, A 중간, D 약간+) 같은 정량화
3. **감정 변화 = 좌표 이동 벡터**:
   - 이벤트 → ΔPAD → 다음 상태
4. **Anthropic emotion vectors와의 정합**:
   - LLM 내부 활성화 공간이 valence × arousal로 자연 조직 → **PAD가 이미 LLM 안에 있다**
   - dominance도 LLM 내부에 있는지가 [Emotion Concepts and their Function in a Large Language Model](anthropic-emotions-2026.md)의 열린 질문

### 블루프린트 연결

- **Layer 1 (캐릭터 정의)**: 캐릭터 emotional baseline을 PAD 좌표로 명시
- **Layer 2 (대화)**: 응답 톤을 현재 PAD 좌표에서 도출
- **Layer 4 (관계)**: 관계 = 두 NPC/플레이어 사이의 PAD 동적 그래프
  - 단순 호감도(1축) → PAD(3축)으로 다차원화

### 창작자 정체성 연결

초파리의 인물 — "배금주의를 좇음" = 심리적 dominance 추구의 이야기.
PAD 어휘로 캐릭터 호(arc)를 좌표 변화로 시각화 가능 (소설 구조 분석 도구로도 사용).

---

## 열린 질문

- LLM 내부에 **dominance 축**도 자연 발생하는가? (Anthropic 2026은 valence × arousal까지만 명시)
- PAD 외 감정 모델(Plutchik 8개 기본 감정, OCC appraisal 등)과의 통합 가능성
- 멀티턴 대화에서 PAD 좌표의 **시간적 궤적** 추적은 어떻게 평가/시각화하나
- 캐릭터마다 다른 "감정 반응 곡선"을 PAD 차원의 함수로 표현 가능한가
- 문화권별로 PAD 좌표의 의미가 달라지는가 (한국어 감정어 vs 영어)

---

## 다음 학습 후보

- **OCC Appraisal Model** — 상황 → 감정 매핑 규칙 (PAD가 "무엇을 느끼나"라면 OCC는 "왜 그것을 느끼나")
- **Plutchik's Wheel** — 8개 기본 감정 + 강도 — 게임 NPC에 친숙한 어휘 (Disco Elysium 영향)
- **Affect Control Theory** — 사회적 상호작용에서 PAD 좌표가 어떻게 변하는가의 이론
- **Persona Vectors / Activation Steering** — PAD 좌표를 LLM 내부에서 직접 조작하는 방법
- **Disco Elysium의 thoughts cabinet** — PAD를 게임 시스템으로 구현한 실제 사례

---

## 적용 아이디어

### 단기 (지금 가능)
- hyunsoo-bot Persona.md를 (P, A, D) baseline + 이벤트별 ΔPAD 표로 재작성
- bookemon 북켓몬 페르소나 baseline을 PAD로 명시

### 중기
- 게임 NPC 프로토타입에서 PAD 좌표를 상태로 관리하고, LLM 호출 시 시스템 프롬프트에 현재 좌표 주입
- 좌표 변화 로그를 시각화 (감정 궤적 그래프)

### 장기 (논문 후보)
- "PAD-Anchored Persona Stability" — Persona.md + PAD 상태 + (장차) activation steering의 3중 일관성 보장 메커니즘

---

## 연결된 페이지

- [Emotion Concepts and their Function in a Large Language Model](anthropic-emotions-2026.md) — LLM 내부 valence × arousal 정합 확인
- ai-npc-blueprint — Layer 1, 2, 4의 감정 어휘
- ai-npc-vision — "관계 형성하는 NPC"의 정량화 도구
- hyunsoo-bot — 이분법 → 좌표계 전환 후보
- bookemon — 북켓몬 페르소나 baseline
- traits — 갤럽 "개별화" — 캐릭터별 다른 PAD 곡선의 근거

---

## 출처

- 논문: Russell, J. A. (1980). *A Circumplex Model of Affect*. JPSP 39(6). [PDF](https://pdodds.w3.uvm.edu/research/papers/others/1980/russell1980a.pdf)
- PAD: Mehrabian, A. & Russell, J. A. (1974). *An Approach to Environmental Psychology*.
- 위키: <https://en.wikipedia.org/wiki/PAD_emotional_state_model>
- 종합: [Russell's (1980) Circumplex Models — Psych 425 OER](https://psu.pb.unizin.org/psych425/chapter/circumplex-models/)
