---
created: 2026-07-09
updated: 2026-07-09
type: learning
tags: [ai-npc, memory, game-theory, belief, architecture, cognee, evidence-gate]
source: [https://github.com/topoteretes/cognee, https://arxiv.org/abs/1512.06808, https://github.com/TencentCloud/TencentDB-Agent-Memory]
authors: [topoteretes, "Giacomo Bonanno", TencentCloud]
year: 2026
category: technique
---
<!-- Codex 3패킷(cognee·bonanno game theory·tencentdb) ③Gate 흡수 — AI NPC 기억·신념 아키텍처 델타. -->

# AI NPC 기억·신념 아키텍처 (Memory + Belief)

> ③Gate 통과(2026-07-09 codex-gate-sweep). 출처 3종 read-only teardown → 패턴만 추출(clean-room). 어느 것도 wholesale 채택 아님. → ai-npc-blueprint delta.

## 1. 왜 (북극성 ▸NPC)

NPC 관계를 **단일 호감도 숫자에서 "검증 가능한 신념·기억 상태"로** 승격. 두 축을 합친다 — (A) *기억이 세션↔영구로 어떻게 승격되나*(cognee/tencentdb), (B) *NPC가 세계 정답을 몰래 알지 않게 신념을 어떻게 모델링하나*(game theory KBST).

## 2. 2-Speed Memory (cognee `f7e2267`, Apache-2.0)

핵심 = **빠른 세션 캐시 ↔ 영구 그래프**의 2속도. 흡수할 델타:

- **명시적 승격 경계**: `remember(session_id=...)` 기본값 `self_improvement=True` = 세션→영구 자동 브리지. **작가 통제 NPC엔 위험** → 반드시 `self_improvement=False` 래핑 + `improve()` 수동 승격.
- **3-lane 메모리 모델** (의존성 없이 패턴만): `session_memory`(스크래치·private·mutable) / `candidate_lessons`(제안) / `accepted_graph_memory`(영구·lore·personality). 승격 = source turn/trace id + 작가 사유 + replay 결과 + rollback 경로 필수.
- **Active Guidance = bounded UI 객체**: goals/rules/preferences/lessons + tool_rules/workflow_state/success_patterns/failure_lessons. 결정적 랭커(LLM 0), section 예산 400자/총 1200자. → Stateful Companion UI의 "보이는 작업 기억".
- **Proposal-first self-improvement**: 저점수 skill run → `SkillImprovementProposal` → 명시적 `apply=True`만 mutation. (vault ⑤Distill 2-레인과 동형.)
- **anti-overclaim**: 키워드 세션 recall ≠ 의미 기억. LLM 추출 lesson ≠ 진실. 아키텍처만으로 "기억 품질" 주장 금지 — 벤치 하네스 필수(arXiv 2505.24478 = KG+LLM은 하이퍼파라미터 민감).

## 3. 4-Layer Memory Pipeline (TencentDB-Agent-Memory `4339e63`, MIT)

동일 문제의 다른 구현 — **파생 substrate**(vault 대체 X):

- **L0 raw 대화 → L1 atom → L2 scene → L3 persona** 압축 파이프라인. 각 층은 raw로 drill-down 가능(evidence 보존).
- **Hybrid retrieval**: FTS/BM25 + vector + RRF, graceful degradation.
- **Context offload 패턴**: `node_id + result_ref + Mermaid canvas` → Codex 토큰 절감하면서 evidence 복구 가능. (Sub brain offload 후보.)
- 파일럿 조건: 외부 read-only SQLite 미러 → fixture seed → grep/Graphify/MemoryDB retrieval 비교 → sufficiency eval. npm `1.0.0` ≠ clone `0.3.6` 버전 드리프트 주의.

## 4. KBST 신념 스택 (Bonanno *Game Theory*, arXiv 1512.06808, CC BY-NC-ND — verbatim 금지)

관계 설계를 scalar affinity → **감사 가능한 belief/type 시스템**으로. 스택:

- **Knowledge**: NPC가 구별 가능한 possible worlds (information set). *knowledge ≠ certainty* — certainty는 틀릴 수 있고 knowledge는 아니다.
- **Belief**: 그 worlds에 대한 확률/confidence (uncertain→suspicious→likely→near_certain→certain).
- **Strategy**: information set별 행동 정책.
- **Type**: 남이 추론하는 숨은 utility/belief 구조. (hidden type > hidden information.)

**철칙**: `LLM은 true_state를 보지 않는다. agent_view만 본다. belief와 knowledge를 분리한다.`

런타임 루프: world event → 관측 resolver(누가 봤나) → information_set 갱신 → evidence 변환 → prior 하에 가능하면 **update** / 불가능하면 **revision**(shock→denial→reopen→new hypotheses = 배신·부활·정체 폭로의 감정 문법) → type belief 재계산 → strategy table → LLM 음성화 → eval gate.

**설계 프리미티브**: costly signal(무비용 cheap-talk은 type 분리 금지), credible threat(수행이 utility에 부합/미수행 평판비용/commitment device/외부제도 중 1+), vague-truth(거짓/진실 이분법보다 우수), pooling/separating, 평판=type 불확실성 필요.

**Eval gates G1-G7**: G1 agent-view 격리 / G2 knowledge wording("안다"=known만, "믿는다/의심한다"=belief) / G3 evidence 회계(belief delta는 evidence id 인용) / G4 publicness 회계 / G5 cheap-talk 방어 / G6 credible threat / G7 off-path 응답표. → npc-eval 후보.

## 5. Evidence·Replay 게이트 (orca `research-claim-gate` 차용)

NPC 데모 주장 오버클레임 방지: source/run lock → run 등록 → canonical `game_history` 보존 → replay digest → raw/sanitized/public 분리 → claim inventory → human 결정 게이트. "representative run = Demo만, efficacy = same-seed/N-parity + uncertainty."

## 6. Apply-or-Park verdict

- **① Applied**: 본 노드 신설(technique) + ai-npc-blueprint 통합점 병기 — L0 impossible-knowledge/false-certainty 게이트, L1 type/utility, L2 claim policy·certainty wording, L3 memory→belief evidence, L4 관계=belief/type, L5 reveal/costly signal/common knowledge=story beat, E=G1-G7 npc-eval.
- **▸NPC**: blueprint L2/L4/E 슬롯 전진. **▸게임개발**: game-design M2 첫 mechanic 가설 = `vault_key_theft`. **▸창작**: belief/misunderstanding/costly signal/hidden type = 캐릭터 갈등 문법.
- **② Parked (실행형, 트리거 명기)**: `vault_key_theft` belief ledger 프로토타입 · cognee-memory-sandbox(격리 venv, self_improvement=False) · sub-brain-memory-db-pilot(tencentdb 미러). 트리거 = ai-npc-engine 다음 실행 스파이크. → dispatch-builder로 Codex/Fable 위임(무거운 실행).

## 7. 첫 dispatch 후보 (park)

```
vault_key_theft belief ledger 최소 프로토타입.
성공: NPC가 agent view 밖 true_state 미수신 · belief delta에 evidence id 로깅 ·
대사가 knowledge vs suspicion 구분 · costly signal이 cheap denial보다 belief 더 이동 · G1-G7 통과.
```
