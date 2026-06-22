---
created: 2026-06-10
updated: 2026-06-10
type: learning
tags: [social-deduction, mafia, llm-agent, controllable-npc, dynamic-difficulty, decision-chain, reward-shaping, libgdx-rogue-os]
source:
  - https://arxiv.org/abs/2501.06695
  - https://arxiv.org/abs/1707.06347
year: 2025
category: technique
---

# DVM — 추론/결정/발화 분리형 소셜추론 NPC 결정 체인

> 한 줄: 사회적 추론 게임 NPC를 **Predictor(관계·정체성 추론) → Decider(규칙·승률 제약 하 행동선택) → Discussor(행동의 자연어 발화화)**로 분리. "머릿속 추론"과 "겉 발화"를 같은 LLM 출력에 안 섞어, 게임 시스템이 Decider 단계에서 난이도·합법행동을 제어한다.

근거: DVM (arXiv:2501.06695) + PPO (arXiv:1707.06347). 기존 [Werewolf LLM (Xu et al. 2023, Tsinghua)](werewolf-llm.md)(emergent 전략)·[Mafia Game Refinement (Ri et al. 2022, JAIST)](mafia-game-refinement.md)(밸런스)·[Clever Hans or N-ToM? (Shapira et al. 2023) — LLM 사회 추론 능력의 진실](clever-hans-ntom.md)(ToM 위험)와 대비 — DVM은 *제어 가능한* 결정 분리 구조를 제시.

## 1. 3단 분해 [VERBATIM 수식]

- **Predictor**: $P_t = \text{Predictor}(D_t, V_t)$. $D_t$=prior discussion, $V_t$=prior voting, $P_t$=타 플레이어 identity 예측.
- **Decider**: $\text{Logits}(a) = \text{Decider}(G_t, P_t, WR_{cons})$, $\text{Prob}(a) = \text{Softmax}(\text{Logits}(a) - a_{mask}\times 10^9)$. 승률 제약 $WR_{cons}$ 와 illegal-action mask가 정책 단계에 직접 들어감.
- **Discussor**: $D_{t+1} = \text{Discussor}(G_t,D_t,V_t,S_t) + D_t$, $V_{t+1} = \text{Discussor}(\dots) + V_t$. Decider의 step decision $S_t$ 를 발화/투표 갱신으로 변환.

## 2. 보상·제어 [VERBATIM 수식]

- **Reward**: $r_t = sr_t + cr$, $cr(DC) = \alpha\cdot(WR - 0.5)$. controllable 세팅에선 $cr_{ctrl}$ 로 decision chain reward 재정의.
- **Controllable reward**:
  - $d = (WR_{cons} - WR_{dc})^2$
  - $\rho = -\tanh((d - \varepsilon^2)/k)$
  - $cr_{ctrl} = \rho\cdot(1 - d/\varepsilon)\cdot s$  (if $\rho \ge 0$)
  - $cr_{ctrl} = \rho\cdot((d-\varepsilon)/(1-\varepsilon))\cdot s$  (if $\rho < 0$)
- **PPO seed**: $A_t = sr_t + cr_{ctrl}(DC_t) + \gamma V(s_{t+1}) - V(s_t)$, $L_{actor} = -\mathbb{E}[\min(q_t A_t,\ \text{clip}(q_t, 1-\delta, 1+\delta)A_t)]$.

## 3. libgdx-rogue-os 적용

- 마피아/던전 NPC를 단일 "대화 생성기"로 만들지 말고, blackboard에 `prediction_state` / `decision_state` / `speech_state` 분리 저장.
- Predictor는 플레이어 행동·대화 로그를 읽어 suspicion/camp/role-belief 갱신.
- Decider는 난이도 목표값(`target_win_rate` 또는 `target_pressure`)을 입력받아 vote/accuse/protect/deceive/silence 같은 symbolic action 선택.
- Discussor는 symbolic action을 캐릭터 말투·관계·기억 키워드로 surface realization.
- **난이도 조절은 "말투 약화"보다 Decider reward 조정**(좋은 추론을 일부러 덜 쓰거나 위험한 bluff 선택)이 더 제어 가능.

### Implementation seed (최소 schema)
```
predictor:  in {D_t, V_t} → out {P_t:[{player_id, predicted_role, predicted_camp, confidence, rationale}]}
decider:    in {G_t, P_t, WR_cons, action_mask} → out {S_t:{action_type, subject_id, target_id, reason_code}}
discussor:  in {G_t, D_t, V_t, S_t, style_profile, memory} → out {utterance, D_{t+1}, V_{t+1}}
reward:     {sr_t, cr_ctrl, r_t, WR_cons, WR_dc, d, epsilon, k, s}
```

## 4. Risk / 흡수 경계 (disclaimer)

- ⚠️ **DVM 논문은 공식 JSON schema 미제공** — 위 schema는 paper 변수에서 파생한 *implementation mapping*이다 (paper-fact 아님).
- ⚠️ 논문은 controllability를 *상승 추세*로 보고하며 target/actual 격차가 남는다 — 완벽한 목표 승률 일치 아님.
- ⚠️ $\alpha, \varepsilon, k, s$ 의 수치 기본값은 확인 범위에서 미지정 — 구현 시 *경험적 튜닝* 필요.

## 5. 연결된 페이지
- [Werewolf LLM (Xu et al. 2023, Tsinghua)](werewolf-llm.md) · [Mafia Game Refinement (Ri et al. 2022, JAIST)](mafia-game-refinement.md) · [Clever Hans or N-ToM? (Shapira et al. 2023) — LLM 사회 추론 능력의 진실](clever-hans-ntom.md) · [RoleLLM (Wang et al. 2023) — 캐릭터 단위 역할극 LLM 표준화](role-llm.md) · [Generative Agents (Park et al. 2023) — AI NPC의 성경](generative-agents.md) — 소셜추론 NPC 계열.
- [Mini-Mafia — 기만/탐지/폭로 분해 벤치마크 + NPC 기만 데이터셋](mini-mafia-benchmark.md) — 기만/탐지/폭로 분해 평가 (짝).
- [Unity ML-Agents — Unity 환경을 RL 학습장으로 쓰는 오픈 툴킷](unity-ml-agents.md) · roadmap — PPO 학습 인프라.
