---
created: 2026-06-22
updated: 2026-06-22
type: learning
tags: [agentic-engineering, harness, afk-agents, procedure-skills, queue-workflow, context-engineering, dispatch, agent-harness]
category: method
source: https://www.aihero.dev/ (AI Coding for Real Engineers workshop, 2026-04-24)
authors: [Matt Pocock]
year: 2026
---

<!-- Matt Pocock의 에이전틱 엔지니어링 워크플로우 — 하네스 최적화·AFK 큐·Procedure 스킬 방법론 정본. -->

# Matt Pocock의 에이전틱 워크플로우 (하네스 공학)

> ⚠️ **임시(provisional)** — NotebookLM 충실(depth) 외주 → vault Claude ④Gate(웹 교차확인). 방법론 흡수 가치 확정, 작가 명시 컨펌 전. 출처 = 단일 워크숍 영상 + repo 웹확인.

> 한 줄: **모두가 모델에 집착할 때, 정작 레버는 하네스(harness)다.** 전술적 코딩은 에이전트에 위임하고, 사람은 하네스 설계·큐 통제·전략에 집중한다.

## ⚠️ Gate 정정 (NotebookLM 오교정 — verifier-regate)

외부 검증자(NotebookLM)가 §6 신뢰도 메모에서 *틀린 교정*을 다수 했다. 지식이 stale 하거나 vault 컨텍스트가 없어 **실재하는 2026 모델·도구를 옛것으로 다운그레이드**함. [검증자의 주장도 환각이다 — 강한 주장은 1차 출처로 재-Gate](verifier-claims-need-regate.md) 전형. vault 지식 + 웹확인으로 정정:

- `opus 4.8`/`opus 4.5` → NotebookLM "Claude 3 Opus/3.5 Sonnet 오인식"이라 추정 = **틀림**. 2026년 Opus 4.x 는 실재 모델(작가 환경 현행 Opus 4.8). 워크숍이 2026-04 이므로 Matt 이 실제로 4.x 를 말했을 가능성 높음. 다운그레이드 채택 X.
- `Fable` → NotebookLM "Cursor 브라우저 에이전트" 추정 = **틀림**. Fable 은 Anthropic 모델(Fable 5). 에이전틱 맥락의 "Fable" = 그 모델. (vault 의 Fable 아크 전체 참조.)
- `CMAX` → 문맥상 **Claude Max**(구독제) 유력. claude-max-cost-shift 참조.
- `TSC scale` → Matt Pocock = TypeScript 교육자(Total TypeScript). **TSC = TypeScript Compiler** 유력(대규모 TS 맥락).
- `claw code`/`claw.md` → `Claude Code`/`CLAUDE.md` ✅ / `agents.mmd` → `AGENTS.md` ✅ (NotebookLM 정확).

**웹확인으로 실재 확정**: `mattpocock/sandcastle`(repo) · `disable-model-invocation: true`(aihero v1, 토큰 63%↓) · `/grill-me`(user-invoked 스킬) · `npx skills add mattpocock/skills`("map skills"=mattpocock/skills 자막오인식).

## 1. 핵심 명제 [VERBATIM]

- *"everyone's obsessed with the model and I think they should be more interested in the harness — what you can do to get the most out of the harness, giving it the right prompts, giving it the right skills to work with, and improving the environment in which the model runs."*
- *"AI makes senior developers just 10 times better… your skills are the ceiling on what AI can do."*
- *"If you're just a tactical programmer just plumbing away doing your work, you're gone."*
- *"I mostly think about these things as queues — not loops. The queue is really the backlog of tasks that I need to complete."*
- (하네스 최적화 첫 액션) *"delete every single skill, every single plugin, every single MCP server… delete your CLAUDE.md, delete your AGENTS.md, go back to absolutely nothing, and then observe the agent."*

## 2. 5대 메커니즘 [PARAPHRASE]

**① Harness(하네스) = AX(Agent Experience)**
- 정의: 모델이 실행되는 환경 + 올바른 프롬프트 + 적절한 스킬 + 코드베이스 구조. DX(개발자 경험)의 에이전트판.
- **튜닝 절차 (빈 도화지 전법)**: ⓐ 모든 스킬·플러그인·MCP·설정파일(CLAUDE.md/AGENTS.md) 삭제 → 백지 ⓑ 기본 모드에서 에이전트 행동 관찰(불필요 지시로 컨텍스트 붓는 현상 억제) ⓒ 명확한 결핍 발견 시에만, 통제 가능한 Procedure 스킬 위주로 한 겹씩 조심스레 추가.
- 효과: 좋은 하네스 = 가드레일 충분 → **더 싼(stupider) 모델로도** 토큰 낭비 없이 동작.

**② AFK(Away From Keyboard) 비동기 에이전트**
- 정의: 사람이 키보드 떠난 동안 에이전트가 작업 독립 수행·병렬화.
- **Sync vs Async 판단**: 동기(HITL) = 계획 수립·복잡 구현·스코프 미확정 탐색 / 비동기(AFK) = 잘게 쪼개져 스코프 명확한 작업.
- **셋업**: `Sandcastle`(Matt 자작 TS 프레임워크)로 Docker/Podman/Vercel 샌드박스 내 격리 실행 + git worktree + planner/impl/reviewer/merger 에이전트 + 커밋 자동 patch-back. 또는 GitHub Actions 에 물려 백그라운드 작업 후 PR → 사람이 비동기 리뷰·머지.

**③ Procedure(user-invoked) vs Abilities(model-invoked) 스킬**
- 구분: 모델이 스스로 꺼내쓰는 기술(model-invoked, 재사용 규율) vs 사람이 직접 호출해 행동 제어(user-invoked/Procedure, orchestrate).
- **컨텍스트 누수 차단**: `disable-model-invocation: true` 속성 → 스킬 description 이 컨텍스트 윈도우로 안 새게 막아 **토큰 63% 절감**.
- **구체 사례 `/grill-me`**: "모델을 적대적 면접관으로 변신시켜, 코딩 *전* 계획 단계에서 98% 공유된 이해에 도달할 때까지 질문" (4~5문장). 워크플로우 = grill-me → PRD 작성 → PRD 를 개별 이슈로 분해.

**④ Queue(큐) 기반 워크플로우 (≠ 무한 while loop)**
- 개념: 에이전트에 무한 루프 돌리는 대신 태스크 백로그(큐)를 하나씩 던짐.
- **루프**: ⓐ 텔레메트리/Sentry → 버그리포트가 큐(이슈 트래커) 인입 ⓑ 사람이 큐 확인·우선순위 통제(triage) ⓒ 샌드박스 에이전트에 `explore` 라벨 → 분석 지시 ⓓ 결과 보고 사람이 `implement` 라벨 → GitHub Action 으로 코드 작성 ⓔ PR 생성 → 사람 개입(HITL checkpoint) 리뷰·머지. (`/setup-matt-pocock-skills` 가 이슈트래커·라벨 셋업.)

**⑤ 전략적(Strategic) vs 전술적(Tactical) 코딩**
- 전술(위임): 구문 파악·버그픽스·코드 작성·커밋 등 지상전.
- 전략(인간 유지): 로드맵·아키텍처·모듈 인터페이스·테스트 씬 설계·핵심 가치 연관 프로덕트 디자인.
- 경계선: *"무엇을 뺄지, UX 를 어떻게 개선할지, 1000개 피처 덩어리 앱이 되지 않게 막는 것은 온전히 인간의 몫."*
- 모델 선택 규율: *신 모델 출시 즉시 갈아타지 않고 ~1개월 관망 후 도입.*

## 3. vault 대조 — 확증 vs delta

**확증 (외부 ground-truth)** — 우리가 이미 한 것을 Matt 이 독립 재발명:
- "harness > model" = [goose — 모델독립 에이전트 하네스 (production 오픈소스 정본)](../techniques/goose-agent-harness.md)·[The New SDLC With Vibe Coding (Google / Addy Osmani)](google-new-sdlc-vibe-coding.md) "Agent = Model + Harness" 정본 재확인(외부 ground-truth #N).
- `/grill-me`(98% 공유이해까지 적대적 질문 후 코딩) = 우리 **dispatch-builder 역면접** + GOAL 역면접의 외부 ground-truth.
- "queue not loops" + 사람 triage = 우리 hermes-loop·[Loop Engineering (Addy Osmani & Neyzis) — 프롬프터에서 루프 디자이너로 가는 14단계 로드맵](loop-engineering.md) Automations 가드(read-only·작게·triage inbox)와 정합. infra-0 큐 철학 확증.
- Sandcastle worktree + planner/reviewer/merger + patch-back = 우리 [Forge Spec-Gate (why-was-fable-banned) — 차용 해체](forge-spec-gate.md) worktree-accept + Dual-Track 절대룰 #6(Codex worktree-accept)의 외부 ground-truth.
- "싼 모델 + 좋은 하네스" = [The New SDLC With Vibe Coding (Google / Addy Osmani)](google-new-sdlc-vibe-coding.md) §4 컨텍스트 엔지니어링=최상위 레버 + claude-max-cost-shift 라우팅 확증.
- "빈 도화지 후 한 겹씩" = skill-curator + CLAUDE.md 비대화 경계(Karpathy #2) 확증.

**delta (신규 — 반영 후보)**:
1. **`disable-model-invocation: true`** — 스킬 description 컨텍스트 누수 차단으로 토큰 63%↓. 우리 스킬은 `origin/state` provenance 는 있어도 *invocation 제어*는 없음. → RTK 강화 반영 후보(아래 §4). (⚠️ caveat, 2026-07-06, davidondrej/skills @ 42dfc3d MIT: 이 플래그는 클라이언트에 따라 자동 invocation *만* 막을 뿐 일부 클라이언트는 description을 여전히 컨텍스트에 주입할 수 있다 — 라우팅 제어가 1차 목적, 토큰절감은 2차·환경별 측정 후 확정. §4 측정 게이트 결론과 정합.)
2. **"98% 공유 이해" 임계** — 역면접의 *정량 종료 조건*. 우리 dispatch-builder 역면접엔 "모호 해소"만 있고 수치 게이트 없음. → done-gate 후보.
3. **explore/implement 라벨 + triage 큐** — hermes-loop dispatch 의 구체 라벨 운영법.

## 4. 학습→반영 루프 (반영처 자문 — grounded 결론)

dispatch-builder 실독 후 결론: **net-new 반영 = #1 하나(측정 게이트), 나머지는 확증/흡수0.**

- **delta #1 `disable-model-invocation`** = 유일한 실반영 후보지만 *측정 게이트*. "63%↓"는 Matt 스킬셋 수치(우리 것 아님, cold-verify-before-adopt). 마침 **2026-06-24 Token-Minimal Startup 점검**이 "첫 턴 컨텍스트 실측"을 하므로 → 그 체크포인트의 *레버 후보*로 라우팅. 측정 후 *user-invoke 전용 스킬*(discipline/orchestration)에만 선별 적용. 블랭킷 X(Karpathy #2).
- **delta #2 "98% 공유이해" 임계** = **흡수 0**. 우리 역면접은 이미 grill-me 를 *상회* — 적대 프레이밍은 hyperplan 적대팀(skeptic/validator/architect/creative, 단일 grill보다 강함), 종료조건은 done-gate `exit 0`(머신체크, "98% 느낌"보다 강함) + 작가 master prompt 승인. "98%"는 false precision 다운그레이드라 채택 X.
- **delta #3 explore/implement triage** = hermes-loop dispatch 운영 참조(인용만).
- **블랭크 슬레이트 하네스 튜닝**("삭제→관찰→한겹씩") = 우리 skill-curator + CLAUDE.md 비대화 경계 확증(신규 X).
- **Sandcastle 도구** = [외부 도구는 설치 말고 해체해 흡수 (Dissect, Don't Install)](dissect-not-install-external-tools.md) 점검 대상(infra-0·TS/Node 의존). 지식 확증만, 도입 X.

> 🗝️ 메타: **하네스 실천가 vein 도 포화 신호.** Matt(존경받는 실천가)이 우리 북극성을 독립 확증하지만 net-new delta 는 측정 후보 1건뿐 — 우리 하네스 작업이 이미 성숙했다는 정황. (Fable-instance vein 포화와 동형.) 가치 = ① 북극성 외부 ground-truth(포폴·면접 talking point) ② verifier-regate 산 사례 ③ #1 측정 후보.

## 5. 신뢰도 메모

- **확실(웹확인)**: Sandcastle·disable-model-invocation(63%)·/grill-me·npx skills add mattpocock/skills·Docker/Podman/Vercel·"10x"·전술/전략 구분.
- **불확실**: 원문이 타임스탬프 없는 텍스트 덤프 → 앵커는 발화 `[블록 n]` 기반(분초 X). `Sandcastle`의 Podman 지원은 repo 확인됨이나 워크숍 발화 그대로인지는 미확인.
- **정정 적용됨**: §"Gate 정정" 참조 — Opus 4.x·Fable·Claude Max·TSC 는 NotebookLM 다운그레이드를 채택하지 않고 vault+웹 기준으로 복원.

---

## 연결된 페이지
- [Loop Engineering (Addy Osmani & Neyzis) — 프롬프터에서 루프 디자이너로 가는 14단계 로드맵](loop-engineering.md) · [pi 코딩 에이전트 CLI](pi-coding-agent.md) · [Ponytail — "게으른 시니어 개발자"를 13개 코딩 에이전트에 이식하는 portable behavioral skill](ponytail.md) — 모델 독립 에이전트 하네스 *실천 사례* 자매(본 페이지=skills 워크플로우/Sandcastle / loop 정련 / depth 하네스 / 정적 룰셋 주입)
- agent-harness — 하네스 SSOT
