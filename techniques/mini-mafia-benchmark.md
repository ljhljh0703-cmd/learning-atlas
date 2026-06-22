---
created: 2026-06-10
updated: 2026-06-10
type: learning
tags: [social-deduction, mafia, llm-agent, deception, theory-of-mind, benchmark, npc-memory, detector-dataset, libgdx-rogue-os]
source:
  - https://arxiv.org/abs/2509.23023
  - https://github.com/bastoscostadavi/llm-mafia-game
year: 2025
category: technique
---

# Mini-Mafia — 기만/탐지/폭로 분해 벤치마크 + NPC 기만 데이터셋

> 한 줄: LLM 마피아 상호작용을 **mafioso의 Deception · detective의 Disclosure · villager의 Detection** 으로 분해. 4인 게임을 고정 night + 단일 day discussion/vote로 축소해, 역할별 능력을 $\text{logit}(p) = v\times(m-d)$ 라는 해석 가능한 식으로 추정한다.

근거: "Deceive, Detect, and Disclose" (arXiv:2509.23023) + repo bastoscostadavi/llm-mafia-game.

> ⚠️ **출처 교정 (흡수 시 보존)**: 원 요청에 적힌 `arXiv:2507.12732`는 *다른 논문*(Strategy Adaptation in LLM Werewolf Agents)이다. 본 논문의 실제 ID는 **2509.23023**. 또한 **논문은 Deception Detector를 직접 학습하지 않는다** — mafioso claims + detective disclosures를 이용한 *labeled deception-detection data source*를 제안할 뿐.

## 1. Setup
- 4 players: 1 mafioso, 1 detective, 2 villagers.
- night: mafioso가 villager 1명 처치, detective가 mafioso 조사.
- day: 생존 3인이 2라운드 공개 토론 후 blind vote.

## 2. 역할 능력 모델 [VERBATIM]
- $\omega_{ijk} \sim \text{Binomial}(n_{ijk}, p_{ijk})$
- $\text{logit}(p_{ijk}) = v_k \times (m_i - d_j)$
  - $m_i$ = mafioso 모델 $i$ 의 deception 능력
  - $d_j$ = detective 모델 $j$ 의 disclosure 능력
  - $v_k$ = villager 모델 $k$ 의 detection 민감도

## 3. Prompt masking (컨텍스트 분리)
- 공유: rules / composition / public discussion.
- 각 player는 고유 `#YOUR MEMORY`.
- detective 조사 결과 = detective에게만 가시.
- villager는 public death/discussion만 — 사적 조사결과 안 봄.
- private messaging 없음 — day 소통은 전부 public.

## 4. Dataset pipeline
- run games → SQLite DB 저장 → analyze → results.
- core tables: `games`, `game_sequence`, `votes`, `game_players`, `benchmark`.
- `game_sequence`: discuss/vote/kill/investigate를 actor·raw_response·parsed_result로 저장.
- `benchmark`: deceive/detect/disclose 능력 실험 분리.

## 5. 주요 실측 (paper 귀속)
- 10 models, 140 targeted configs, 100 games/config = **14,000 unique games**.
- 5-fold CV: Brier score **0.0073** (constant-0.5 baseline 0.0312 대비 76.6% 감소).
- 보고 벤치마크: 최강 detector = **Grok 3 Mini**, 최강 discloser = **GPT-5 Mini**, 최약 detector = **Claude Sonnet 4**(near random).

## 6. libgdx-rogue-os 적용
- 마피아/추리 이벤트 NPC를 "대사 생성"이 아니라 **role capability vector**로 분해 — 각 NPC에 `deception_m`/`disclosure_d`/`detection_v`.
- 결과 예측·난이도 조절: `mafia_win_prob = sigmoid(v_villager * (m_mafioso - d_detective))`. target tension에 따라 m/d/v 조정.
- masking은 LLM context를 직접 절단: `global_rules`(공유) / `public_log`(공유) / `private_memory`(역할별) / `detective_observation`(detective만) / `mafioso_private_goal`(mafioso만).
- player-facing utterance는 `public_log`에만 append, hidden_reasoning/private_memory는 **절대 public_log 누출 금지**.

### Detector dataset seed + 라벨 규칙
- schema: `{game_id, step, speaker, speaker_role, public_context_before, utterance, private_state, gold_mafioso, vote_after_context, labels{deception_label, claim_type, detector_target, correct_detection_after_vote}}`.
- auto-label: mafioso의 innocence/counter-accusation → `strategic_deception`; detective가 조사한 mafioso 지명 → `truthful_disclosure`; villager 발화는 truthfulness 라벨 X(detector trajectory로만); villager가 gold_mafioso 투표 → `correct_detection=true`.

## 7. Risk / 흡수 경계 (disclaimer)
- ⚠️ **모든 mafioso 발화를 거짓으로 라벨하지 말 것** — claim span / strategic speech act 단위로.
- ⚠️ message-level weak label과 proposition-level truth label 분리 유지.
- ⚠️ 능력 점수는 prompt-conditioned — prompt/이름/토론길이/모델셋 변경 시 재캘리브레이션.
- ⚠️ 축소 모델은 long-horizon belief update / 반복 night / dynamic target selection 생략.
- ⚠️ dataset schema는 *제안 seed* (논문이 직접 학습한 detector 아님 — §출처 교정 참조).

## 8. 다음 엔지니어링 스텝
- `MafiaTrajectoryRecorder`: public_log·private_memory_hash·role·action·raw_response·parsed_result·vote·winner 기록.
- `DetectorDatasetBuilder`: 기록 trajectory → JSONL export.
- offline evaluator: (A) transcript prefix로 mafioso 식별 (B) 발화를 strategic_deception/truthful_disclosure/uncertain 분류 (C) villager 정답 투표 예측.

## 9. 연결된 페이지
- [DVM — 추론/결정/발화 분리형 소셜추론 NPC 결정 체인](dvm-decision-chain-npc.md) — 추론/결정/발화 분리 결정 체인 (짝).
- [Werewolf LLM (Xu et al. 2023, Tsinghua)](werewolf-llm.md) · [Mafia Game Refinement (Ri et al. 2022, JAIST)](mafia-game-refinement.md) · [Clever Hans or N-ToM? (Shapira et al. 2023) — LLM 사회 추론 능력의 진실](clever-hans-ntom.md) — 소셜추론 NPC 계열.
- [Generative Agents (Park et al. 2023) — AI NPC의 성경](generative-agents.md) — NPC 기억/관찰 구조.
