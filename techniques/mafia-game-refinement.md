---
created: 2026-04-25
updated: 2026-04-25
type: learning
tags: [game-design, mafia, game-refinement-theory, entertainment, simulation, balance]
---

# Mafia Game Refinement (Ri et al. 2022, JAIST)

> The Dynamics of Minority versus Majority Behaviors: A Case Study of the Mafia Game
> Information 2022, 13, 134 · MDPI · Hong Ri, Xiaohan Kang, Khalid, Iida — JAIST 일본
> doi: 10.3390/info13030134

## 한 줄

마피아 게임의 캐릭터 조합을 **Game Refinement (GR) theory + Motion in Mind 모델**로 정량 분석. 648 조합 × 10,000회 시뮬레이션. **Mafia 수 = Sheriff 수**일 때 sophistication 최대. 몰입도 순위: **Mafia > Sheriff > Citizen**.

> ⚠️ 이 논문은 LLM/AI 논문이 아님 — **게임 디자인 측 정량 이론**. NPC blueprint의 **사회 게임 밸런싱** 사이드에서 활용.

## 핵심 이론 1: Game Refinement (GR)

게임 sophistication을 단일 숫자로 측정.

$$ GR = \frac{\sqrt{B}}{D} $$

- B = branching factor (총 골/액션)
- D = game length (총 step)

**"Zone" 이론:** GR ∈ [0.07, 0.08] 일 때 인간이 가장 즐겁다. 실증 데이터:

| 게임 | B | D | GR |
|------|---|---|-----|
| Chess | 35 | 80 | 0.074 |
| Go | 250 | 208 | 0.076 |
| Basketball | 36.38 | 82.01 | 0.073 |
| Soccer | 2.64 | 22 | 0.073 |
| Badminton | 46.34 | 79.34 | 0.086 |
| Dota 6.80 | 68.6 | 106.2 | 0.078 |

→ 다양한 장르가 같은 GR 영역에 수렴. **Skill ↔ Chance 균형의 보편 상수** 가설.

## 핵심 이론 2: Motion in Mind

게임을 "정신적 운동"으로 모델링:
- **velocity v** = success rate (게임 진행 속도)
- **mass m** = 1 - v (난이도)
- **momentum p** = mv = m(1-m) → m=1/2에서 최대 (1/4)
- **potential energy E_p** = 2mv²

리워드 시스템 N 도입 후:
- E_p = 2(N-1)/N³
- p = (N-1)/N²

→ N에 따른 에너지 곡선이 **장르별 sports 분류**(m-sports/p-sports/e-sports)와 수렴.

## Mafia 분석 결과 (10,000회 × 648 조합)

### Win rate 핵심 발견

> **Mafia 수가 전체의 1/5 초과하면 압도적으로 Mafia 승리**

| Com(S,C,M) | C win | M win |
|---|---|---|
| 2,4,2 | 2275 | 7725 |
| 2,10,2 | 2901 | 7099 |
| 4,15,2 | 7059 | 2941 |
| 5,10,5 | 2170 | 7830 |
| 7,15,7 | 2138 | 7862 |
| 10,15,10 | 630 | 9370 |

→ Mafia가 적정 비율 넘으면 게임 무너짐. Citizen이 이기려면 **Mafia 비율 ≤ 1/5** 필수.

### GR 측정으로 본 캐릭터별 sophistication

| Com(S,C,M) | GR(S) | GR(C) | GR(M) | Var |
|---|---|---|---|---|
| 5,10,5 | 0.1145 | 0.0550 | 0.1058 | 0.0035 |
| 7,15,7 | **0.071** | 0.0318 | **0.0674** | 0.0015 |
| 9,15,10 | 0.0571 | 0.0301 | 0.0453 | 0.0024 |

→ **(S=7, C=15, M=7)** 이 zone[0.07, 0.08] 가장 가깝고 균형. **Mafia = Sheriff** 일 때 sophistication 극대.

### Potential Energy 분석

- Mafia/Sheriff: N ∈ [2, 6] — 좁고 안정 (소수파, 전략 의무)
- Citizen: N ∈ [3, 14] — 넓고 불안정 (다수파, 능력 의존)
- 몰입 순위: **Mafia > Sheriff > Citizen**
- 노력 순위: **Sheriff > Mafia > Citizen** (Sheriff는 직접 승리 못 시키고 Citizen 도와야 함)

### 플레이어 수 vs 에너지

- 인원 ↑ → 에너지 ↓ (각자 의심받을 빈도 ↓ → 긴장 ↓)
- Mafia 비율 ↑ → Mafia 에너지 ↓ (게임이 쉬워짐)
- Sheriff 비율 ↑ → Sheriff 에너지 ↑ (역할 어려워짐)
- Citizen 비율 변화 → 영향 거의 없음 (가장 단순한 역할)

## 한계

1. **AI = 단순 random + threshold** — 진짜 LLM 에이전트 아님 (cf. [Werewolf LLM (Xu et al. 2023, Tsinghua)](werewolf-llm.md))
2. **GR theory의 zone[0.07, 0.08]** — 보편 상수 주장에 비해 통계 검증 빈약
3. **Motion in Mind** — 물리 비유의 설명력은 직관적이나 예측력 검증 부족
4. **인간 플레이어 vs 시뮬레이션 ground truth** 비교 없음
5. **현대 사회 추리 게임 (Among Us, Town of Salem 등) 일반화** 미실시

---

## 내 NPC 블루프린트 함의

### A. NPC 게임 밸런싱의 정량 도구

[Werewolf LLM (Xu et al. 2023, Tsinghua)](werewolf-llm.md) 은 LLM 행동을 보여주지만 "**얼마나 많은 NPC를 어떻게 배치할지**" 답 없음. 이 논문이 그 답:
- **마피아형 NPC 사회 시뮬레이션**: minority NPC : majority NPC ≈ 1:5 미만일 때 균형
- 비율 깨지면 narrative 붕괴 — 작가 입장에서 **균형 공식**으로 활용

### B. NPC sophistication 측정 지표

내 NPC가 "재미있는가"를 정량화하려면 GR ∈ [0.07, 0.08] 영역 추구:
- B = NPC가 취하는 의미있는 행동 수
- D = 플레이어와의 상호작용 길이
- → **NPC dialogue/quest 디자인 시 GR 계산해서 zone 진입 여부 체크**

이건 ai-npc-vision 의 "강렬함" 추구를 정량화하는 단서.

### C. NPC 역할 차별화 = 에너지 곡선

세 캐릭터(Mafia/Sheriff/Citizen)가 N 범위가 다르다는 발견:
- 소수파/숨김 역할 → 좁고 깊은 N (몰입 높음)
- 다수파/단순 역할 → 넓고 얕은 N (안정)

→ 내 NPC 캐스트 설계: **"숨김"과 "노출"의 비대칭이 몰입의 핵심**. RPG의 "히든 NPC" 트로프와 정합.

### D. Park+2023 / Xu+2023 보완

| 측면 | Park (Generative) | Xu (Werewolf LLM) | Ri (Game Refinement) |
|------|-------------------|-------------------|----------------------|
| 다루는 것 | 행동 emergent | 전략 emergent | 캐릭터 조합 균형 |
| 측정 | TrueSkill (인간 평가) | 승률 + duration | GR + E_p (수학) |
| 답하는 질문 | "어떻게 만드는가" | "어떻게 학습하는가" | "어떻게 균형 잡는가" |

→ 3개 함께 = NPC 작가의 완전한 도구 세트.

### E. "강렬함" 정량화

values 의 강렬함 추구가 막연한 미감이 아니라 **GR zone + E_p 변동성**으로 측정 가능. 내 글쓰기/게임 작품 평가에도 응용 가능 — 독자/플레이어가 가장 몰입하는 정보 진행 속도.

### F. ⚠ 한계 인지

GR theory는 **통계적 직관**이지 검증된 법칙 아님. 이걸 NPC blueprint에 넣을 때:
- 발견적 가이드로 사용 (heuristic)
- 절대 기준으로 사용 금지 (dogma)
- [Clever Hans or N-ToM? (Shapira et al. 2023) — LLM 사회 추론 능력의 진실](clever-hans-ntom.md) 의 경고처럼 단일 지표 신앙 금지

---

## 연결

- 짝: [Werewolf LLM (Xu et al. 2023, Tsinghua)](werewolf-llm.md) (LLM 행동 ↔ 게임 디자인 균형)
- 보완: [Generative Agents (Park et al. 2023) — AI NPC의 성경](generative-agents.md) (sandbox 행동 ↔ 게임 sophistication)
- 비전: ai-npc-vision (강렬함의 정량화)
- 가치 연결: values (강렬함 추구의 수학 표현)
- 평가 경계: [Clever Hans or N-ToM? (Shapira et al. 2023) — LLM 사회 추론 능력의 진실](clever-hans-ntom.md) (단일 지표 맹신 금지)
- 블루프린트: ai-npc-blueprint Layer 4 (사회 균형) + Layer 5 (작가성)
