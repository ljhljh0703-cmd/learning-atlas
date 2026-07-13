---
created: 2026-07-04
updated: 2026-07-04
type: learning
tags: [agent, production, eval, observability, lifecycle]
source: https://github.com/google/agents-cli
authors: [Google]
year: 2026
category: method
---
<!-- Google agents-cli 비판적 해체 — 클라우드/ADK/GKE 종속은 버리고, spec→eval→trace→gate 프로덕션 라이프사이클 커널만 추출 -->
# Agent Production Lifecycle (spec→eval→trace→gate)

> ⚠️ 임시 — Codex 외주 해체(RETURN gate_pending) 기반. 작가 ③Gate 컨펌 전. 사례 = `google/agents-cli`.

## 한 줄

`google/agents-cli`를 "Google Cloud 배포 CLI"로만 보면 좁다. 추출할 커널은 **agent 제작→평가→관측 lifecycle을 코딩 에이전트에 skill로 주입하는 운영체계**다. Google Cloud / ADK / GKE / Gemini Enterprise 종속과 대형 scaffold-first는 *버린다*. 남기는 것은 클라우드-독립적인 `spec → eval → trace → gate` 골격.

## 커널 (가져올 알맹이)

### 1. Skills = 문서가 아니라 운영 주입(operational injection)
- agents-cli의 핵심은 CLI가 아니라 skills다. 코딩 에이전트에게 "개발 절차를 *기억*하라"고 부탁하지 않고, skill로 절차를 **항상 활성(always-active)** 화한다.
- 교훈: dev procedure는 지식 노트가 아니라 *행동 제약*으로 상주시켜야 샌다("remember" ≠ 강제). → 헌법 §"강제 규율 4부 골격"·§"주입 표면"과 같은 정신.

### 2. Eval-fix loop를 *제품*으로
```
core eval case 1-2개 작성
→ agent 실행으로 trace 생성
→ judge/rubric으로 grade
→ 실패 원인 분석(spec/tool/memory/prompt/code 중 어디를 고칠지 분리)
→ baseline vs candidate compare
→ 모든 core case가 threshold 통과할 때만 coverage 확장
```
- 핵심 규율: **core case가 통과하기 전엔 coverage를 넓히지 않는다.** 확장은 통과 이후.
- metric vocabulary(중복 주의 → 아래 dedup): `tool_use_quality` / `multi_turn_trajectory_quality` / `multi_turn_task_success` / `grounding` / `hallucination` / `safety`.

### 3. Trace-first observability + PRIVACY 기본값
- observe = 단순 로그 아님. eval이 놓친 regression·비용 급증·sub-agent handoff 문제를 잡고, production traffic을 다음 eval dataset으로 되돌리는 루프.
- **개인정보 기본 원칙: prompt/response 전문 저장 금지(default).** 저장은 hash·score·failure-tag·tool-call metadata 중심. 원문이 필요하면 별도 승인 + 보존기간.
  - 근거: agents-cli release notes가 Cloud Trace를 prompt/response 미capture로 바꿈. 이 방향은 수용 가치.
- trace schema 예: `trace_id / agent_id / scene_id / turn_index / input_context_hash / memory_read_keys / memory_write_candidates / tool_calls / action_selected / judge_scores / failure_tags / artifact_hash / gate_result`.
- **deploy vs publish 분리** — deploy = agent가 실행 가능 상태 / publish = registry(A2A AgentCard)에 등록. registry entry = capability·input contract·output artifact·owner·eval status·last gate·version. → **검증된(verified) agent만 등록.**

### 4. 8-phase production lifecycle (+ spec-first 계약)
```
Spec → Scaffold → Build → Orchestrate → Evaluate → Deploy → Publish → Observe
```
- 단 *우리* 버전은 `Deploy/Publish`보다 **`Evaluate/Observe/Gate`가 우선**.
- 진입점 = `.agent-spec.md` 계약: role · allowed tools · forbidden actions · memory boundary · behavior invariants · success criteria · eval dataset path · trace fields · gate owner. scaffold/eval/safety/trace가 여기서 파생.

## 그대로 가져오면 안 되는 것 (Reject)
1. Google Cloud 중심 배포(Agent Runtime / Cloud Run / GKE / Gemini Enterprise 종속).
2. ADK 전제 — 우리 표준 아직 아님. Claude/Codex/로컬/A2A 혼합 유연성 저하.
3. 자동 scaffold 과신(Terraform/CI/CD 대량 생성) — 필요한 건 "작동 가능한 최소 계약".
4. `eval optimize` 자동 prompt tuning 남용 — 고비용·평가 과적합. 명시 승인 + 수동 fix loop 선행 없이는 금지.
5. LLM-as-judge 단독 판정 — rule-based check·행동 로그와 함께 봐야 함(judge가 최종 권위 X).
6. Cloud observability 무비판 이식 — prompt/응답 로그 저장은 개인정보·저작권·비용 문제(위 §3 privacy 기본값으로 대체).

## Dedup 주의 — [AgentBench — agent 평가는 task completion + failure taxonomy다](../techniques/agentbench-evaluation-taxonomy.md)와 중복 금지
- metric vocabulary(tool-use/trajectory/grounding/hallucination/safety)는 이미 [AgentBench — agent 평가는 task completion + failure taxonomy다](../techniques/agentbench-evaluation-taxonomy.md) 계열이 다룬다. **평가 지표 어휘를 여기서 재정의·복제하지 말 것.**
- 본 노트의 *고유 gap* = 지표가 아니라 **production-lifecycle framing** (spec-first 계약 → eval-fix 제품화 → trace-honesty/privacy → deploy≠publish/verified-registry → gate). 지표는 taxonomy 참조, 라이프사이클은 여기.

## 학습→반영 (Absorb-to-Apply)
- **hermes-loop ③Gate 강화** — Gate에 (a) eval-fix loop 체크(core eval case가 threshold 통과했는가) + (b) trace-honesty 체크(prompt/response 전문 저장 대신 hash·score·failure-tag만 남겼는가)를 추가할 후보. case evidence = agents-cli.
- **dispatch-builder done-gate 강화** — done-gate에 spec-first 계약(`.agent-spec.md` 등가: 목적·스코프·검증기준) + "core case 통과 전 coverage 확장 금지" 규율을 반영할 후보.
- 관계: agent-harness RSI(spec→implement→eval→trace→gate)와 동형. 본 라이프사이클은 그 외부 사례 검증판.
- **park (1줄 아이디어)**: agents-cli의 metric/spec 골격을 AI-NPC(캐릭터 behavior spec·memory policy·scene eval)로 번역하는 아이디어 — 지금은 순수 아이디어로 보류, 신규 도메인 결정이므로 vault 반영 X.
- 억지 반영 가드(Karpathy #2/#3): 위 강화는 *후보*. 실제 hermes-loop/dispatch-builder 수정은 작가 결정 후. Google 도구 설치·ADK·클라우드 배포는 미채택.

## 출처
- source: https://github.com/google/agents-cli · docs: https://google.github.io/agents-cli/
- 해체 packet: `~/Documents/Codex/2026-07-03/agents-cli-critical-adoption/outputs/` (RETURN + asset + sha256.tsv). skill_candidate: `agents-cli-lite-for-ai-npc`(승인 대기, `skills/.incubator/` 후보 — 직접 생성 금지).
- source anchors(asset §Source Anchors): `README.md:20,60-70,74-111,141-148,173-180` · `lifecycle.html:1972-2037,2097-2100,2117-2132` · `evaluation.html:1948-1997,2029-2031,2040-2071` · `skill-eval.md:39-75,356-368,423-424` · `RELEASE_NOTES.md:5-10,18-24`.

## 외부 확증 + AgentKit 라이프사이클 watch (2026-07-11, codex-gate)
<!-- openai-agentic-systems-video PARK 델타 흡수(~90%는 기보유). proposed_by: external_ai (via codex), 판정 by claude. -->
- **외부 확증**: OpenAI Build Hours "Agentic Systems"가 본 노트의 4레이어(work-unit 계약 → replayable workflow → context/memory governance → evaluate-before-optimize)를 *공개적으로 같은 순서*로 지시. vault 하네스 명제의 외부 ground-truth 1건 추가(신규 method 아님).
- ⚠ **watch(휘발성)**: OpenAI AgentKit / Agent Builder+Evals = **2026-11-30 wind-down** 예고(소프트앵커 — 공식 페이지 403, 인용 전 재확인). 해당 도구 의존 설계 시 만료 인지.
