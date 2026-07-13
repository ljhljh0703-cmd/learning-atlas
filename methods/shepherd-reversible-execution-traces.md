---
created: 2026-07-10
updated: 2026-07-10
type: learning
tags: [agent-harness, execution-trace, settlement, retained-output, self-repair, gate]
source: [https://github.com/shepherd-agents/shepherd, https://arxiv.org/abs/2605.10913]
authors: [shepherd-agents]
year: 2026
doi: arXiv:2605.10913
category: method
---
<!-- Codex 해체분석 ③Gate 흡수(2026-07-09 sweep 2차, 07-10 게이트) — reversible execution trace를 하네스 자가수리 기판으로. -->

# Shepherd — Reversible Execution Traces (하네스 자가수리 기판)

> ③Gate 통과(2026-07-10). MIT, early alpha. SHA `2d86248`·arXiv 2605.10913(*Enabling Programmable Meta-Agents via Reversible Agentic Execution Traces*) 실재 검증. **패턴만 추출**(라이브러리 채택 아님 — PyPI 0.2.1 ↔ docs v0.3.0 불일치, 채택 전 설치 검증 필수).

## 1. 델타 (기존 하네스 위 substrate)

vault엔 이미 agent-harness(RUN→OBSERVE→FIX→RERUN)·[Playwright E2E 에이전트 하네스 — 테스트=실행가능 명세, trace=user-facing 증빙 매체 (Naver 발표)](playwright-e2e-agent-harness.md)·[Agent Production Lifecycle (spec→eval→trace→gate)](agent-production-lifecycle.md)(spec→eval→trace→gate)·hermes-loop(Gate/Promote)가 있다. Shepherd의 신규 델타 = **"trace를 남기자"가 아니라, 실행 결과를 적용 *전* 후보물로 보존하고 그 후보를 `select/apply/release/discard`로 명시 처리하는 settlement vocabulary를 런타임 1급 개념으로 둔 점.**

## 2. Retained candidate + settlement loop

- run은 결과를 작업 폴더에 **바로 쓰지 않는다** → retained output으로 보관 → changeset으로 검토 → 정확히 한 번 `select`(게이트행)/`apply`(path-disjoint delta 3-way 병합, 겹치면 fail-closed)/`release`·`discard`(기각하되 기록 보존)/`repair`(좁힌 계약으로 재실행).
- **자가수리 = 제자리 덮어쓰기가 아니다.** 후보를 격리하고, 검증 가능한 changeset/trace 기준으로 버리거나 재실행. 실패 후보와 그 이유가 trace에 남아 다음 후보가 왜 더 나은지 비교 가능.
- Supervisor = **check-at-commit**: 실행은 끝났지만 병합 *직전*(마지막 undo point 전) Gate가 path·claim·risk·privacy·test evidence 검사. 거부 시 기존 ground 무손상, candidate만 폐기/repair.

## 3. Bad-step taxonomy (evaluator가 잡을 실패 분류)

개발·법리스크·게임빌드·NPC 실험 공통 적용:

| Bad step | Gate 대응 |
|---|---|
| `precondition_missing`(SCA-Gate 0인데 착수) | stop·ask, 컨텍스트 공급 전 repair 금지 |
| `permission_boundary_violation` | candidate 폐기·경계 침해 보고 |
| `irreversible_write_attempt`(retained 없이 authority 직접 반영) | hard stop·가능시 rollback |
| `unverified_claim` | unverified 마킹 또는 source 재확인 |
| `spec_mismatch` | 좁힌 계약으로 repair |
| `dead_path` | lookup 재실행·source_status 갱신 |
| `test_failure`(실패를 통과처럼 포장) | gate fail·promote 금지 |
| `trace_incomplete` | repair evidence 요청 |
| `unsafe_external_action`(승인필요 행동 무단) | stop·보고 |
| `privacy_log_overcapture` | redact·retention 분리·리스크 리뷰 |

## 4. 반영 (Apply-or-Park)

- **① Applied**: 본 노트(패턴 정본). agent-harness·[SCA-Gate & Spike 1A RAG Failure Defense Specification](sca-gate-specification.md)와 상보 — trace를 typed boundary record(run_id·task_contract·input_authority·effect_events·workspace_delta·settlement_action·gate_result)로 강화하는 방향.
- **② Staged(HITL, R-01)**: `templates/RETURN.md` candidate_outputs `settlement_state` 필드 + agent-harness H-14 하위 retained-candidate 루프 패치 = authority-class → `스테이징 영역/` 별도 작가 merge. → codex-gate-9pack-merges-2026-07-10.
- **② Parked**: `retained-output-repair-gate` skill 후보(1회 관측, 작가 승인 대기).

## 5. Anti-overclaim

early alpha. settlement loop·retained run·permission grant·changeset·trace = shipped. task-to-task delegation·typed value projection·replay API = roadmap. paper 성능수치(28.8→54.7% 등)는 개념근거로만, 운영 일반화 금지.
