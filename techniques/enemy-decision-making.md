---
created: 2026-06-07
updated: 2026-06-07
type: learning
tags: [game-ai, roguelike, utility-ai, goap, decision-making, enemy-ai, libgdx-rogue-os]
source:
  - https://www.gdcvault.com/play/1012410/Improving-AI-Decision-Modeling-Through
  - https://media.gdcvault.com/gdc10/slides/MarkDill_ImprovingAIUtilityTheory.pdf
  - https://gdcvault.com/play/1013394/Three-States-and-a-Plan
  - https://www.gamedevs.org/uploads/three-states-plan-ai-of-fear.pdf
authors: [Dave Mark, Kevin Dill, Jeff Orkin]
year: 2010
category: technique
---

# 적 의사결정 — Utility AI + GOAP 하이브리드 ("무엇을 하나")

*Dave Mark & Kevin Dill, "Improving AI Decision Modeling Through Utility Theory" (GDC 2010) · Jeff Orkin, "Three States and a Plan: The A.I. of F.E.A.R." (GDC 2006)*

[Dijkstra map](dijkstra-maps.md) 이 "*어디로* 가나"를 푼다면, 이 둘은 "*무엇을* 하나"(공격/도주/스킬/엄폐/대기)를 푼다. Utility AI = 매 턴 행동을 점수로 고름. GOAP = 목표를 만족시키는 *행동 순서*를 탐색.

---

## 한 줄 요약

> 일반 적은 **Utility AI**(고려요소를 0..1 로 정규화 → response curve → 점수 → 최고점/가중랜덤 선택)로 매 턴 단일 행동을 고르고, 보스·정예는 **GOAP**(goal=원하는 world state, action=precondition+effect, planner=A* 행동탐색)로 다단계 계획을 세우는 하이브리드.

---

## 핵심 개념

### A. Utility AI (Mark & Dill, GDC 2010)
1. **Consideration → utility 변환**: raw data 를 의미축으로. 거리→threat, 탄약→reload necessity, 체력→heal necessity.
2. **0..1 정규화 + response curve**: binary threshold / linear / exponential / logistic 곡선으로 점수화.
   - 예: `Anxiety = (100 - distance) / 100` (linear), `distance <= 30 → anxiety = 1` (binary), exponent k=2,3,4,6.
3. **선택**: 행동 후보 점수 비교 → 최고점 또는 **weighted random**.

### B. GOAP (Orkin, F.E.A.R. GDC 2006)
- **FSM 을 3 상태로 축소**: Goto, Animate, UseSmartObject (UseSmartObject 는 Animate 의 data-driven 특수형 → 사실상 2 상태).
- **A\* 를 *행동 계획*에 사용**: goal(world state) 을 만족시키는 action sequence 를 precondition/effect 로 탐색 (STRIPS 식).
- **Goal 우선순위 경쟁**: 예 Work 8.0 / Stunned 80.0 / Death 100.0 — 최고 우선 goal 을 planner 가 충족.

---

## 기술 스택 / 사용법

```
[일반 몹] Utility:
  for action in {Attack, Retreat, UseSkill, Guard, Wait}:
    score = Σ curve_i( normalize(consideration_i) )   // HP%, 거리, FOV내 인지, 쿨다운, 도주로 유무
  pick argmax(score)            // ← 결정론 위해 weighted random 회피(또는 seeded)

[보스/정예] GOAP:
  goals = {KillPlayer, Survive, ProtectAlly, ReachCover} (우선순위)
  plan  = AStarOverActions(currentWorldState, topGoal)   // 깊이 상한 필수
```

---

## 내 생각 — libgdx-rogue-os 적용 관점

### Honest Assessment
- **레이어**: 적 행동(decision) 레이어 — [Dijkstra Maps — 격자 로그라이크 적 AI 의 공유 거리 필드](dijkstra-maps.md) 위에 얹힘
- **적용 가치**: **직접 적용** (Utility), **개념 수확→제한 적용** (GOAP, 보스만)
- **시급성**: 지금~중기 (Utility 먼저, GOAP 는 보스 도입 시)

### 직접적 연결: 높음 (Dijkstra 와 역할 분리)
- **Dijkstra = 이동, Utility/GOAP = 행동, FOV = 인지 게이트** 의 3분할이 깔끔히 맞물린다.
- 일반 몹에 풀 GOAP 는 **과잉**(턴 지연·복잡도). Utility 로 충분. GOAP 는 "공격하려면 접근→시야확보→사거리진입" 같은 *다단계 전제*가 필요한 보스에만.

### ⚠️ 처참한 실패 시나리오
- **weighted random 이 결정론을 깬다**: Utility 의 가중랜덤은 [헤드리스 validator](../methods/automated-playtesting-shooterbot.md) 재현성을 망친다. → **argmax 또는 seeded RNG** 사용. 같은 seed·world state → 같은 행동이어야 검증 가능.
- **GOAP planner 무한/과대 탐색**: action space 가 크면 턴이 멈춘다(모바일 프리징). → **계획 깊이 상한 + 시간 budget + fallback action** 강제.

### 개념적 수확
- Utility 의 response curve 는 "급격한 행동 전환(딱딱한 if/then)"을 부드럽게 — [결정론 전투](unpredictability-of-gameplay.md)에서도 *적 행동의 자연스러운 그라데이션*을 결정론적으로 얻는 길.
- GOAP 의 goal/action 분리는 적 행동을 *데이터*로 — Codex 가 ScriptableObject 류로 적 archetype 을 데이터 주도 확장하기 좋음.

---

## 열린 질문

- 우리 적 archetype 수·행동 후보 수에서 Utility consideration 가중치 튜닝을 어떻게 데이터화·검증하나?
- 보스 GOAP 의 plan 깊이 상한을 몇으로 잡아야 "똑똑함"과 "턴 지연" 사이가 맞나? (실측 임계)
- Utility vs Behavior Tree — 우리 규모에선 어느 쪽 유지보수가 싼가?

---

## 다음 학습 후보

- **IAUS (Infinite Axis Utility System)** — Dave Mark 의 Utility AI 정식 아키텍처(후속 GDC)
- **Behavior Trees** — Utility 의 대안/보완 행동 구조
- **HTN Planning** — GOAP 대비 계층적 계획(보스 행동 표현력)
- [Dijkstra Maps — 격자 로그라이크 적 AI 의 공유 거리 필드](dijkstra-maps.md) · [Recursive Shadowcasting — 격자 로그라이크 FOV 의 표준](fov-recursive-shadowcasting.md) — 이동·인지 짝

---

## 연결된 페이지

- libgdx-rogue-os — 적 행동 AI 직접 적용
- [Dijkstra Maps — 격자 로그라이크 적 AI 의 공유 거리 필드](dijkstra-maps.md) — "어디로"(이동) 담당, 본 노트는 "무엇을"(행동)
- [Recursive Shadowcasting — 격자 로그라이크 FOV 의 표준](fov-recursive-shadowcasting.md) — 적 인지 게이트
- [Improving Playtesting Coverage via Curiosity-Driven RL Agents — 자동 커버리지 탐색](../methods/automated-playtesting-shooterbot.md) — 결정론적 행동의 헤드리스 검증
- [The Unpredictability of Gameplay — 무작위성을 randomness / chance / luck 로 분해](unpredictability-of-gameplay.md) — 결정론 전투와 행동 그라데이션
