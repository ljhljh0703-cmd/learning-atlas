---
created: 2026-06-30
updated: 2026-06-30
type: learning
category: method
tags: [game-design, ai-delegation, simulation, player-experience, dispatch, gate]
source: "작가 ChatGPT 대화(게임 재미 인터뷰) → Codex 카드화 패킷 chard-12240 → vault Claude ③Gate"
authors: [user, codex]
year: 2026
---
<!-- AI에게 게임 개발을 잘 맡기기 위한 "재미 설계 OS" — 작가 재미신호→이론 claim→AI 위임 계약→지표→테스트. Codex chard-12240 패킷 ③Gate 흡수(2026-06-30). 개별 계약은 사용·검증 통해 confirm 예정(provisional). -->

# 게임 재미 설계 OS (AI 위임용)

> **⚠️ ③Gate 정직성 (필독)**
> - **출처**: 작가 게임 인터뷰(ChatGPT 대화) → Codex 카드화. **논문 claim은 GPT 추출분** — reachability(200/302)만 확인, **full-text 미검증**(MDA·GameFlow·Flow·SDT·Immersion). 본문 재대조 전까지 "전문 확인"으로 인용 금지.
> - **GEQ = hold** — 원논문 본문 아닌 response 논문 정정 포함. auxiliary만.
> - **재미·몰입 = 플레이어 대면 검증** — 기술 게이트로 박제 불가(fun-feedback-separate-track). 아래 지표는 *대리(proxy) 신호*지 재미 증명 아님.
> - **provisional** — 작가가 흡수(③Gate) 지시(A). 개별 계약은 실사용·검증으로 confirm 예정.

## 1. 한 줄 정의

작가의 게임 지식 흡수 방향 = **AI에게 게임 개발을 더 잘 맡기기 위한 재미 설계 OS**. 단순 자료 모음이 아니라 변환 루프:

```
작가 재미신호 → 이론 claim → 설계 규칙 → AI 위임 계약 → 시뮬 지표 → 테스트 케이스 → SSOT 후보
```

## 2. 작가 취향 신호 (보존 — 1인칭 앵커)

- **핵심 재미**: 반복 플레이 가능 + 경우의 수 조합으로 *매번 새로움*.
- **최대 실패 조건**: 피로도 높음.
- **목표 감정**: 몰입.
- **뜯을 레퍼런스**: Shattered Pixel Dungeon · Baldur's Gate 3 · Slay the Spire.
- **훔칠 요소**: 반복 플레이 동기 · 전투 · 성장. **거부**: 메이플키우기식 과금.
- **AI에 맡길 것**: 시스템 설계 · 전투/스킬 밸런스 · 퀘스트/이벤트 생성 · 코드 구현 · 로그 분석.
- **AI가 망치면 안 되는 것**: 몰입 저해 요소 · 캐릭터 말투 · 세계관 톤.
- **최우선 역량**: AI에게 게임 개발을 더 잘 맡기는 능력.

## 3. AI 위임 계약 6종 (이 OS의 핵심 산출)

> 게임 작업을 AI에 위임할 때 *입력·출력·금지·검증* 계약으로 변환하는 틀. dispatch-builder 게임 디스패치에 직접 환류(§6).

### 3.1 MDA Trace Contract
모든 게임 기능은 trace를 가진다 — **Aesthetics**(느낄 감정) → **Dynamics**(발생할 행동패턴) → **Mechanics**(규칙·데이터·코드) → **Telemetry**(그 패턴 발생 검증 지표).
- **금지 요청**(모호): "재미있게 만들어줘" · "전투 더 좋게" · "스킬 여러 개" · "AI NPC 똑똑하게".
- **필수 변환**: `target_aesthetic` · `expected_dynamics` · `allowed_mechanics` · `forbidden_dynamics` · `telemetry`.
- (기존 [MDA 프레임워크 — Mechanics, Dynamics, Aesthetics](../techniques/mda-framework.md) 보강 — 새 이론 아닌 *위임 계약 관점*.)

### 3.2 AI Output Review Gate (GameFlow 8축)
AI 산출물은 *작동*만으로 pass 안 함. 8축 검수: ① Concentration(잡무가 판단 방해 X) ② Challenge(실패+대응 가능, 실패원인 읽힘) ③ Player Skills(향상 여지) ④ Control(선택이 결과에 영향·랜덤이 agency 안 죽임) ⑤ Clear Goals(장기+단기 가시) ⑥ Feedback(원인→결과→다음판단 연결) ⑦ Immersion(말투·톤 유지) ⑧ Social/World Response(세계가 선택 기억).

### 3.3 Active DDA Contract
난이도 조절 = 몰래 수치 보정 X. 플레이어가 *플레이 안에서* 위험·보상·속도·회복을 선택. 각 run segment에 `safe / standard / risky / recovery / wildcard` 옵션을 *메뉴 아닌 방·적·보상·루트*에 박음.

### 3.4 Motivation / Reward Contract (SDT)
반복 동기 = 보상량 X, **need satisfaction**: Autonomy(선택이 이후 플레이에 차이) · Competence(더 잘하게 됨·원인 읽힘) · Relatedness(세계가 선택 기억). 모든 보상은 셋 중 ≥1로 태그.
- **금지 동기**: 접속 강박 · 손실 회피 압박 · 과금 없이 피로한 성장 · 판단 없는 자동반복 · 수치만 오름 · 선택 결과 안 남음.

### 3.5 Immersion Guardrail
몰입 = graded experience. 실패 추적 5종: Cognitive(자동반복·무의미 클릭·정보과다) · Real-world dissociation(메타설명·세계관밖 UI·반복 확인창) · Emotional(이겨도 져도 감정차 없음) · Challenge(쉬움/어려움/원인불명/수치벽) · Control(랜덤사망·동일결과 선택지·회복수단 없음).

## 4. 지표·테스트 카탈로그 (proxy 신호 — 재미 증명 아님)

- **전투/밸런스**: 승률 · 평균 턴수 · 사망원인 분포 · 스킬선택률 · 조합 다양도 · 빌드 편중도 · 보상 의존도 · 반복전투 유사도 · 재도전율 · dominant strategy 유무.
- **피로도**: meaningless_click · repeated_action_ratio · no_decision_duration · forced_wait · repeated_combat_pattern · tooltip/combat_log_reopen.
- **몰입**: meaningful_decision · uninterrupted_segment · dialogue_skip · event_completion · counterplay_success · death_cause_readability · recovery_pick · frustration_exit.
- **보상/동기**: option_pick_entropy · build_path_diversity · voluntary_risk_accept · same_encounter_improvement · npc_memory_trigger · relationship_state_change · paywall_fatigue.

## 5. 흡수 우선순위 & 보류

- **Tier 1**(먼저): 조합적 리플레이성 · 전투/스킬/성장 밸런스 · 자동 시뮬/테스트 지표 · 피로도·몰입 가드.
- **Tier 2**(프로젝트 연결): 로그라이크 구조(SPD 자원희소·식별·읽히는 적패턴) · StS 조합깊이(낮은 입력량→빌드 시너지) · 퀘스트=상태변화 계획(world_state·goal·actions·reward·consequence) · AI 구현 명세(입력/출력/금지/검증 계약).
- **Tier 3**(장기): NPC 기억/대화 심화(단 말투·톤 보호용 최소 메모리 경계 필요) · 내러티브 감정곡선.
- **보류**(중심축 흐림): 과금 최적화·고래 BM·방치형 과금 · 광고 수익화 · MMO 경제학 · 그래픽스 논문 · 순수 RL SOTA · 완전 자율 NPC 사회 시뮬. (BM은 `retention-without-exploitation`으로만.)

## 5+. 후속 카드 클러스터 (card06-15 + card16, 2026-06-30 ③Gate)

> Codex 후속 패킷 2종(card06-15·card16). 자산 §"연구 카드 상태"의 queued 07~15 완성 + Card 16(탐정) 신규. **⚠️ source-local `full_text_checked` 표기 = GPT 주장, Codex 본문 재검증 X(`codex_external_body_verified: false`) — 전문 확인으로 인용 금지. Card 15는 partial(책 전체 추출 아님). GEQ "cannot stop"=위험 신호지 KPI 아님.**

**5 클러스터 (계약):**
1. **플레이어 경험 게이트** — Card 06 GEQ(engagement/anti-compulsion: presence→flow→absorption, "못 멈춤"=위험) + Card 07 Game Feel(physicality·juice·streamlining, 과한 juice 톤붕괴 주의).
2. **AI 콘텐츠 생성·수리** — Card 08 PCGML(schema-first 생성=완성/수리/비평, 자율마법 X) + Card 09 PCGRL(reward/MDP repair, change budget·"playable≠fun") + Card 13 CONAN(quest=plan graph: goal·action·precondition·effect·world-state-delta·NPC intent).
3. **자동 플레이테스트·시뮬** — Card 10 Procedural Personas+MCTS(다중 utility 페르소나가 다른 실패모드 노출, 인간 대체 X) + Card 11 Active Learning(인간 예산 하 가장 정보적인 다음 테스트, 메커닉 고정 후) + Card 12 MCTS 4층 trace(summary/atom/chain/action-space).
4. **NPC·월드 에이전트 루프** — Card 14 = 기존 [Generative Agents (Park et al. 2023) — AI NPC의 성경](../techniques/generative-agents.md) **보강**(memory/retrieval/reflection/planning/world grounding, believable≠human·over-cooperation 주의). 신규 노트 X.
5. **Game AI 위임 OS 색인** — Card 15(partial) = play/generate/model/design-support 레이어 + "forward model first". 통합 색인용만.

**Card 16 — 플레이어를 탐정으로 (미스터리/단서 그래프)** ★ 작가 직결(초파리 이현수·eldritch-seoul 탐정 + hwiglija-tower-gdd tower laws·floor history·god-fragment causality):
- 핵심: 탐정 서사 2층(`story_of_crime` ↔ `story_of_investigation`). 대다수 게임=플레이어를 **Watson(스크립트 추종)**으로 만듦 → 원하는 건 **Holmes 기능**(증거 검토·단서 연결·가설 검증·숨은 진실 재구성). knowledge=progression(스탯 아닌 *이해*로 해금). 비-범죄 월드빌딩에도 적용(탑 법칙·NPC 숨은 기억·보스 기원·진영 배신).
- **MPD-16 계약 6종**: ①quest=clue graph(답안 유도 단서리스트 X) ②player-led-investigation(일부 구간 리드 선택) ③knowledge-progression ④wrong-but-informative(틀린 가설도 학습·옵션 제거·상태 변화) ⑤hidden-structure-low-fatigue(단서 로그·보드·검색 노트·재방문 대화·힌트 tier — 피로 가드) ⑥world-mystery-no-crime.
- **결합 계약** `mystery-clue-graph-generation-contract` = Card 13 plan_graph + Card 16 clue_graph(hidden_truth·clue 노드·evidence/inference 엣지·misleading-but-fair·contradiction check·solution 조건) + Card 14 npc_memory(거짓말·부분지식·증거연결 reflection) + Card 06 GEQ guardrail(피로 가드).

## 5++. 실행 다리 + 계약 압축 (Codex 2026-06-30 후속, 비판적 수용)
- ✅ **combat-sim-harness-spec** 신규 — §4 지표 카탈로그의 *개념→실행* 다리(결정론 전투 시뮬 하네스 v0.1, repo 디스패치 후보). 이 OS의 진짜 payoff(재미 지식→runnable 밸런스 증거).
- ❌ **8-계약 팩 dedup 기각** — Codex가 Card 01-16을 8 계약(game-ai-delegation·output-review-gate·feature-template·tone·npc-memory·quest-clue 등)으로 압축했으나 **§3 계약 + game-research-card-gate의 재명명(~85% 중복)** → 신규 노드 X(Karpathy #3). 카드→계약 매핑이 필요하면 외부 분류매트릭스(`~/Documents/Codex/2026-06-30/game-card-contract-compression/outputs/card-01-16-classification-matrix.md`) 참조.

## 6. 학습→반영 (이 OS가 바꾸는 곳)

- **dispatch-builder 게임 디스패치** ★ 최고가치 — ✅ **반영 완료(2026-06-30, 작가 명시)**: 슬롯3에 "게임 디스패치 MDA Trace 계약" 추가(모호요청 STOP + target_aesthetic/expected_dynamics/forbidden_dynamics/telemetry 변환 + GameFlow 8축 리뷰게이트 + 재미=플레이어대면 가드).
- **game-design SKILL M4(디스패치)·M1(pre-gdd §5 취향)** — 본 OS를 취향 라이브러리·계약 소스로 라우팅.
- **시뮬레이션** — §4 지표 = libgdx-rogue-os·ClaudeCraft 자동 플레이테스트 harness의 측정축 후보.
- **보강(중복 회피)**: [MDA 프레임워크 — Mechanics, Dynamics, Aesthetics](../techniques/mda-framework.md)(→ MDA Trace Contract 관점) · [Generative Agents (Park et al. 2023) — AI NPC의 성경](../techniques/generative-agents.md)(→ npc-memory-minimum·character-voice-contract). *새 노트 아님*.

## 7. ③Gate 기록 (2026-06-30)
- 패킷: Codex `chard-12240` Hermes RETURN(SHA-256 고정, vault 직접쓰기 0 = 경계 PASS).
- 출처 정직성: source_status.tsv가 reachability ≠ full-text 분리(=[검증자의 주장도 환각이다 — 강한 주장은 1차 출처로 재-Gate](verifier-claims-need-regate.md) 규율 정합, Codex 모범).
- 중복: MDA·generative-agents·dcss 기존 확인 → 본 노트는 *합성·위임계약*이라 신규 유의미.
- origin: GPT 추출 → Codex 카드 → Claude gate. 개별 계약 = provisional, 작가 사용·검증으로 confirm.

## 8. 연결
- 게임 허브: game-design · 카탈로그 game-domain-prep · 디스패치 dispatch-builder
- 이론 노드: [MDA 프레임워크 — Mechanics, Dynamics, Aesthetics](../techniques/mda-framework.md) · [DCSS(Dungeon Crawl Stone Soup) 던전 디자인 — 다층·위험보상·함정·상호작용](../techniques/dcss-dungeon-design.md) · [Generative Agents (Park et al. 2023) — AI NPC의 성경](../techniques/generative-agents.md)
- 정직성 규율: fun-feedback-separate-track · [검증자의 주장도 환각이다 — 강한 주장은 1차 출처로 재-Gate](verifier-claims-need-regate.md)
- 방법론 자매: [제약 기반 게임 창의성 — 불편한 조건이 설계를 끌고 가게 하기](constraint-driven-game-design.md) · [Game Planning AI Agent — 역질문 기반 게임 기획 에이전트](game-planning-ai-agent.md) — AI 위임용 게임 설계 방법론(제약 주도 / AI 에이전트 기획 / 본 페이지=재미 위임 OS·proof-gate 계약)
