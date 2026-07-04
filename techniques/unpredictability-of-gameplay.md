---
created: 2026-06-07
updated: 2026-06-07
type: learning
tags: [game-design, randomness, determinism, rng, combat-design, libgdx-rogue-os]
source:
  - https://www.bloomsburycollections.com/book/the-unpredictability-of-gameplay/
authors: [Mark R. Johnson]
year: 2019
category: technique
---

<!-- Mark R. Johnson, The Unpredictability of Gameplay (2019) 학습 노트 — 결정론적 전투/RNG 설계 근거 -->

# The Unpredictability of Gameplay — 무작위성을 randomness / chance / luck 로 분해

*Mark R. Johnson (Bloomsbury Academic, 2019)*

게임의 "예측 불가능성"을 하나로 뭉뚱그리지 않고 세 갈래(randomness · chance · luck)로 나눠 분석한 게임학 단행본. 그랜드 전략·MMORPG·슬롯머신·카드게임까지 폭넓게 다룬다.

---

## 한 줄 요약

> 게임의 불확실성은 단일한 "RNG 문제"가 아니라 **randomness(시스템의 무작위) / chance(플레이어가 마주하는 확률) / luck(결과의 사후 귀속)** 세 층위의 구조적 디자인 변수이며, 어디에 불확실성을 넣고 빼느냐가 곧 플레이어의 통제감·성취감을 설계하는 일이다.

---

## 핵심 개념

### 1. 3분류 타이폴로지 (randomness / chance / luck)
- **Randomness** — 시스템 내부의 무작위 생성 메커니즘 (PCG, 주사위)
- **Chance** — 플레이어가 *의사결정 시점에 마주하는* 확률 구조
- **Luck** — 결과가 나온 *뒤에* 플레이어가 좋고 나쁨을 귀속시키는 사후 해석
- → 같은 RNG라도 어느 층위에서 작동하느냐에 따라 경험이 완전히 달라진다.

### 2. 의도된 vs 의도되지 않은 불확실성
- 설계자가 *의도한* 불확실성(전략적 긴장)과, 시스템이 *의도대로 작동하지 않아* 생기는 창발적 불확실성(버그·악용)을 구분.

### 3. 3대 사례 연구
- **절차적 생성 (PCG)** — randomness 가 재플레이성을 만드는 방식
- **리플레이 가치 / 그라인딩** — 반복과 불확실성의 상호작용
- **플레이어가 *운을 줄이려고* 만든 관행** — 비결정론 게임에서 플레이어가 스스로 luck 을 통제하려는 전략 (pity·확률 계산 등)

---

## 기술 스택 / 사용법

해당 없음 — 디자인 이론서. 전투·보상·PCG 의 불확실성 배치 *판단 근거*로 사용.

---

## 내 생각 — libgdx-rogue-os 적용 관점

### Honest Assessment
- **레이어**: 해당 없음 (디자인 철학)
- **적용 가치**: 개념 수확 (직접 코드 아님 — *어디에 RNG 를 둘지* 판단 프레임)
- **시급성**: 중기 (전투/PCG 스펙 확정 시점)

### 직접적 연결: 중간~높음 (전투 결정론의 이론적 분리)
프로젝트는 **전투 핵심 판정을 deterministic** 으로 가져간다(확률형 명중/회피 대신 확정 연산). Johnson 의 프레임은 이 선택을 *원리적으로* 정당화한다 — 불확실성을 **층위별로 분리 배치**하면 된다:
- **전투 판정 = 결정론** (chance 제거) → 플레이어 완전 계산 가능 + [헤드리스 validator](../methods/automated-playtesting-shooterbot.md) 에서 결과 재현·검증 가능
- **PCG·자원 배치·탐험 = 제한적 randomness** → 재플레이성 확보
- **luck = 플레이어 사후 서사**로만 남김

### 개념적 수확
- **"주사위 없는 전투"는 문헌의 직접 주장이 아니다** — 이건 프로젝트 *내부 설계 원칙*이다. Johnson 책은 *왜 그렇게 나눌 수 있는지*의 이론적 어휘를 줄 뿐, "격자 거리 감쇄 함수" 같은 구체 공식은 책에 없다. 인용 시 이 경계를 지킬 것.
- 사례연구 #3("플레이어가 운을 줄이려는 관행")은 곧 **pity / 보정 시스템 설계**의 학술적 뿌리.

### 처참한 실패 시나리오
- 전투를 완전 결정론으로 만들면 *최적해가 고정*되어 "풀이된(solved)" 지루함이 올 수 있다. → randomness 를 PCG·적 배치 쪽으로 충분히 밀어 매 판 초기조건을 흔들어야 함 (책의 PCG 사례연구가 이 균형의 근거).

---

## 열린 질문

- 전투 결정론 + PCG randomness 의 균형점은 어디인가 — 어느 비율에서 "전략적"이 "단조로움"으로 무너지는가?
- Permadeath([Berlin Interpretation — 로그라이크 장르 정의의 사실상 표준](berlin-interpretation.md))와 luck 의 상호작용 — 영구사 게임에서 플레이어의 luck 귀속이 이탈률에 주는 영향은?

---

## 다음 학습 후보

- **Into the Breach 디자인 분석** — 정보 완전공개·결정론 전투의 상업적 정점 사례 (GDC/디자이너 글)
- [Berlin Interpretation — 로그라이크 장르 정의의 사실상 표준](berlin-interpretation.md) — random generation·permadeath 의 장르 정의 짝
- **Pity / pseudo-random distribution (PRD)** — Dota2/Warcraft III 의 "체감 운 보정" 알고리즘 (결정론과 확률의 중간)

---

## 연결된 페이지

- libgdx-rogue-os — 결정론 전투 + validator-first 설계 프로젝트
- [Improving Playtesting Coverage via Curiosity-Driven RL Agents — 자동 커버리지 탐색](../methods/automated-playtesting-shooterbot.md) — 결정론이 헤드리스 검증을 가능케 하는 짝
- [Berlin Interpretation — 로그라이크 장르 정의의 사실상 표준](berlin-interpretation.md) — randomness·permadeath 의 장르 프레임
