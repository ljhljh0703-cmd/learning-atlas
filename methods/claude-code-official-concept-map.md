---
created: 2026-07-27
updated: 2026-07-27
type: learning
tags: [claude-code, agent-harness, skills, hooks, subagents, context-engineering, concept-map, study-reference]
source: "https://code.claude.com/docs (llms.txt 전량 색인 ~170p) · 정독분 = features-overview.md · whats-new/index.md(W13~W29) · 기준선 W29(2026-07-13~17, v2.1.207–212)"
authors: [Anthropic]
year: 2026
category: method
---
<!-- Claude Code 공식 문서의 확장 레이어 개념 지도 + vault 실측 대조 + 흡수 우선순위. 회고·공부 시 여기서 시작한다. 기준선 = W29. -->

> ⚠️ **임시 (provisional)** — AI 작성, 작가 컨펌 전. §4 우선순위와 §6 교리 판정은 작가 검토 대상.

# Claude Code 공식 개념 지도 — vault 대조 기준선 (W29)

> **이 노트의 용도.** ① 회고·공부 시작점(공식 개념을 vault 언어로 고정) ② 최신화 기준선(다음 대조는 W29 이후만 보면 된다) ③ 인사이트 도출 재료(§6 = 공식 교리 ⟂ vault 교리 대조). 개별 기능 사용법은 여기 안 적는다 — **개념·판단축·격차**만.

## 1. 확장 레이어 = 8종, 각자 다른 곳에 꽂힌다

공식 프레이밍의 핵심은 "기능 목록"이 아니라 **에이전트 루프의 어느 지점에 꽂히는가**다.

| 메커니즘 | 하는 일 | 로딩 시점 | 컨텍스트 비용 |
|---|---|---|---|
| **CLAUDE.md** | 매 세션 상주 컨텍스트 | 세션 시작 | **매 요청**(전문) |
| **`.claude/rules/`** | 상주 규칙, **경로 스코핑 가능**(`paths:` frontmatter) | 세션 시작 **또는 매칭 파일 열릴 때** | 스코프 한정 |
| **Skills** | 재사용 지식·호출 가능 워크플로우 | 시작=description / 사용시=전문 | 낮음(description만 상주) |
| **Code intelligence(LSP)** | 심볼 단위 항해·타입 오류 | 편집 후·조회 시 | 낮음(파일 읽기를 *대체*해 순감 가능) |
| **MCP** | 외부 서비스 연결 | 시작=툴 이름 / 스키마는 지연 | 낮음(tool search 기본 on) |
| **Subagents** | 격리 컨텍스트 워커, 요약만 반환 | 스폰 시 | **본 세션과 격리** |
| **Agent teams** | 독립 세션 다수 + **피어 메시징 + 공유 태스크** | 명시 기동(실험적·기본 off) | 높음(각자 별 인스턴스) |
| **Hooks** | 라이프사이클 이벤트에 **셸·HTTP·LLM 프롬프트·서브에이전트** 실행 | 트리거 시 | **0**(출력 반환 시만 발생) |
| **Artifacts** | 세션 산출을 비공개 인터랙티브 웹페이지로 발행 | 명시 | — |
| **Plugins / Marketplaces** | 위 전부를 묶는 **패키징·배포 층**(스킬 네임스페이스 `/plugin:skill`) | — | — |

**계층 충돌 해소 규칙**(공식) — CLAUDE.md = *가산*(전 레벨 동시 기여, 충돌은 모델 판단·구체적인 쪽 우선) / Skills = 이름 충돌 시 **managed > user > project** / Subagents = **managed > CLI > project > user > plugin** / MCP = **local > project > user** / Hooks = **병합**(전부 발화).

## 2. 판단축 — "언제 무엇을 추가하나"(공식 트리거 표)

| 트리거 | 추가할 것 |
|---|---|
| Claude 가 같은 관례를 **두 번** 틀림 | CLAUDE.md |
| 같은 프롬프트를 반복 타이핑 | 사용자 호출 skill |
| 같은 플레이북을 **세 번째** 붙여넣음 | skill |
| 브라우저 탭에서 데이터를 계속 복사 | MCP 서버 |
| 심볼 정의 찾느라 파일 다수 읽음 | code intelligence 플러그인 |
| 곁가지 작업이 대화를 출력으로 범람시킴 | subagent |
| **묻지 않고 매번 일어나야 함** | **hook** |
| 두 번째 저장소가 같은 셋업 필요 | plugin |

같은 트리거가 *갱신* 시점도 알려준다 — 반복되는 실수는 채팅 교정이 아니라 CLAUDE.md 편집, 손으로 계속 손보는 워크플로우는 개정이 필요한 skill.

**구분 요령 3개 (공식)**
- **Skill ⟂ Subagent**: 스킬=어느 컨텍스트에나 로드하는 *내용* / 서브에이전트=따로 도는 *격리 워커*. 조합 가능 — 서브에이전트는 `skills:` 필드로 스킬을 **전량 프리로드**, 스킬은 `context: fork` 로 격리 실행.
- **Subagent ⟂ Agent team**: 서브에이전트=리드가 전부 관리·결과만 회수 / 팀=**팀원끼리 직접 메시징 + 공유 태스크 자기조율**. 전환점 = *병렬 서브에이전트가 컨텍스트 한계에 걸리거나 서로 대화가 필요해질 때*.
- **Hook ⟂ Skill**: 훅=트리거 **보장**·컨텍스트 0 / 스킬=모델이 해석·결과 가변.

## 3. vault 실측 대조 (2026-07-27)

| 항목 | 공식 | vault 실측 | 판정 |
|---|---|---|---|
| CLAUDE.md 길이 | **"200줄 이하로 유지"** | **885줄** | **4.4배 초과** |
| `.claude/rules/` | CLAUDE.md 비대 해소 정본 수단 | **없음**(project·user 양쪽) | 미도입 |
| `skillOverrides`(설정에서 타인 스킬 가시성 override) | 존재 | **0** | 미인지 |
| skill `context: fork` | 존재 | **0** | 미인지 |
| subagent `skills:` 프리로드 | 존재 | **0** | 미인지 |
| `disable-model-invocation` | 존재 | **4건 사용** | ✅ 인지·적용 |
| `fallbackModel`(최대 3단) · `--safe-mode` | 존재 | **0** | 미인지 |
| Agent teams | 실험적 | **0**(hit 10건은 전부 `human-agent-teams` 논문 노드명 오탐) | 미인지 |
| `/rewind` · `/cd` · `/checkup` | 존재 | **0** | 미인지 |
| 주요 Claude Code 노드 최신성 | 문서 = W29(07-17) | `everything-claude-code` 04-24 · `runtime-internals`/`dynamic-workflows-harness` 06-15 | **6~13주 지연** |
| 깊게 반영된 축 | — | skills 81 · MCP 60 · hooks 52 · sandbox 50 · plugins 43 · subagents 39 · worktree 25 | ✅ 문서보다 깊음(자체 게이트 상재) |

## 4. 흡수 포인트 — 우선순위

### P1. `.claude/rules/` + `paths:` 스코핑 — 885줄 문제의 정본 해법
vault 는 CLAUDE.md 비대를 **손으로** 메워왔다 — §"토픽별 자동 진입점" 표(로드 라우팅) + hot.md §절대 룰 8줄 중복 노출(주입 표면·decay 방어) + `workflows/wiki-authoring-reference` 로 reference 추출. 공식 해법은 **경로 조건부 상주 규칙 파일**이다. `paths:` frontmatter 로 *매칭 파일을 열 때만* 로드되므로, 예컨대 창작 규율은 `wiki/creative/**` 열 때만, 게임 규율은 게임 경로에서만 로드된다. **컨텍스트 절감이 아니라 *정확도* 문제** — 공식 문서가 "너무 많으면 스킬이 잘못 트리거되고 관례를 놓친다"고 명시.
> ⚠ 가드: 헌법 구조 변경이므로 L-STAGE. 그리고 rules 도입이 §"주입 표면" 결정을 **폐기하는 게 아니라** 그 결정이 손으로 하던 일을 기계로 옮기는 것 — 비협상 철칙의 hot.md 재노출은 §6-A 근거상 오히려 hook 으로 승격 대상.

### P2. `skillOverrides` — graphify 예외 규칙의 정본 대체
헌법 §"외부 도구 관리 skill 예외"는 *"도구가 `install` 로 frontmatter 를 덮어쓰니 vault Claude 가 origin/state 를 복원한다"* 는 **수동 보정 루프**다. `skillOverrides`(settings)는 **파일을 수정하지 않고** 가시성을 덮어쓴다. 즉 그 예외 규칙의 상당 부분이 설정 1줄로 대체될 수 있다.

### P3. 서브에이전트 설계 3점 — graphify·디스패치 직결
- `skills:` 필드 = 스킬 **전량 프리로드**(온디맨드 아님). graphify semantic 추출 서브에이전트에 추출 규약을 프리로드하면 프롬프트 반복 조립이 사라진다.
- **서브에이전트가 서브에이전트를 스폰 가능**(W24, 백그라운드 체인 5단 상한) + **W27부터 서브에이전트 기본 백그라운드**. 웨이브 병렬 설계 전제가 바뀐다.
- 서브에이전트 시작 시 로드되는 것 = 자기 시스템 프롬프트 + `skills:` 전문 + CLAUDE.md·git status(단 내장 Explore/Plan 은 **둘 다 생략**) + 리드가 넘긴 프롬프트. **대화 이력·이미 호출한 스킬은 상속 안 됨** — 디스패치에 컨텍스트를 명시로 실어야 하는 이유의 공식 근거.

### P4. 6주 릴리스 델타 중 vault 실효분
| 기능 | 주차 | vault 관련성 |
|---|---|---|
| **`--safe-mode`**(전 커스터마이징 비활성 기동) | W24 | 훅·설정 간섭 디버깅의 결정적 도구. false-red/false-green 사고 계보(llm-wiki-reliability-harness)에 직결 |
| **`/doctor`(`/checkup`)** 설정 진단+수리 | W28 | 위와 같은 축 |
| **deny/ask 규칙이 툴 파라미터 매칭** `Tool(param:value)` | W25 | 권한 규율을 파라미터 단위로 — 예 `Agent(model:opus)` |
| **`/rewind` 가 `/clear` 이전으로 복원** | W26 | 세션 연속성(hot.md 핸드오프 규율의 안전망) |
| **`/cd`** 세션 중 작업 디렉터리 이동, **프롬프트 캐시 재구축 없이** | W24 | vault ↔ 외부 repo 이동 시 cold-start 비용 회피 |
| **`fallbackModel`** 최대 3단 | W24 | 모델 라우팅(§4) 복원력 |
| **`claude mcp login/logout`** 셸에서 MCP 인증 | W26 | 커넥터 관리(토큰 절감 메모리) |
| **Artifacts** + 뷰어 MCP 커넥터 호출 | W25·W29 | 발행 표면(bespoke-html-direction)과 인접 — 단 공개 공유는 L-HITL |
| **Sonnet 5 = Pro/Team 기본, 네이티브 1M 컨텍스트, adaptive thinking 기본** | W27 | §4 모델 라우팅 사실 갱신(추출=Sonnet 5 결정의 전제) |
| **shell mode 가 명령 출력에 반응**(`! npm test` → 설명) | W26 | `!` 프리픽스 운영 |
| **Agent teams**(피어 메시징·공유 태스크) | — | 다중 세션 충돌 규율(§"충돌 방지")과 정면 인접. 실험적·기본 off |

## 5. 기준선 (다음 대조는 여기서부터)

- 문서 색인 = `llms.txt` ~170p. 정독분 = `features-overview` · `whats-new/index`(W13~W29).
- **기준선 = W29 (2026-07-13~17, v2.1.207–212).** 다음 대조 시 W30 이후만 보면 된다.
- 미정독 대영역(필요 시 진입): Agent SDK 30여 p · 엔터프라이즈/게이트웨이 15여 p · `hooks.md` 레퍼런스 · `settings.md` · `permissions.md` · `context-window.md` · `tools-reference.md`.

## 6. 공식 교리 ⟂ vault 교리 — 인사이트 재료

**A. ★ "가드레일은 훅에 넣어라" = vault recurrence-4 교훈의 공식 확증.**
공식 원문: *"CLAUDE.md 나 스킬의 '`.env` 절대 편집 금지' 같은 지시는 **요청이지 보장이 아니다**. 편집을 막는 `PreToolUse` 훅이 집행이다. 규칙이 매번 지켜져야 한다면 프롬프트 지시가 아니라 훅으로 만들어라."*
vault lessons 는 같은 것을 **4회 재발**로 배웠다("외부 AI 는 프롬프트에 명시한 제약만 준수 — 침묵의 헌법룰은 옆구리로 샌다"). 즉 vault 의 비협상 철칙(§5 HITL 시뮬레이트 금지 · §5.7 2조건 · Archive-only)은 **산문으로 있는 한 구조적으로 샐 수밖에 없다**. hot.md 8줄 재노출은 decay 완화책이지 집행이 아니다.
→ 도출: **"철칙은 훅으로, 관례는 산문으로"** 가 다음 하네스 세대의 분할선. (단 vault 는 PreToolUse 훅 차단이 헤드리스 Codex 에 불안정하다는 반례도 실측 보유 — [Forge Spec-Gate (why-was-fable-banned) — 차용 해체](forge-spec-gate.md) worktree-accept. 즉 *훅 집행 + 격리 수용*의 이중화가 vault 의 정답 형태.)

**B. 컨텍스트 비용을 "토큰"이 아니라 "정확도"로 프레이밍.**
공식: 과다 컨텍스트는 창을 채우는 문제 이전에 **노이즈** — 스킬이 잘못 트리거되고 관례를 놓친다. vault RTK 는 토큰 절감 논리로 서 있는데, 885줄 CLAUDE.md 의 실제 리스크는 비용이 아니라 **규율 오발화**다. 프레이밍 교체가 필요하다.

**C. 트리거 임계가 vault 보다 관대하다.**
공식 = "두 번 틀리면 CLAUDE.md / 세 번 붙여넣으면 skill". vault 스킬 신설은 4조건 + 가설 레인 + incubator + 8주 무입증 강등이라 훨씬 보수적이다. vault 쪽이 **스킬 스프롤 방어**로는 우월하고, **채택 속도**로는 느리다. 어느 쪽이 맞는지는 use-ledger 사용률 데이터로만 판정 가능 — 지금은 미판정.

**D. Skill 을 "reference ⟂ action" 으로 이분.**
공식은 스킬을 *레퍼런스형*(API 스타일 가이드처럼 세션 내내 참조)과 *액션형*(`/deploy` 처럼 실행)으로 나눈다. vault 스킬 레지스트리엔 이 축이 없다 — `invocation_type`(user/model)은 *호출 주체* 축이고 이건 *성격* 축이다. 큐레이터 분류에 직교 축 1개 추가 여지.

**E. Agent teams = vault 다중세션 충돌 규율의 상류.**
vault 는 "같은 시점 같은 파일 동시 편집 금지 · 다른 세션은 read-only"를 **금지 규율**로 해결했다. 공식 Agent teams 는 같은 문제를 **공유 태스크 리스트 + 피어 메시징**으로 해결한다. 즉 vault 는 충돌을 *회피*하고 공식은 *조율*한다. 실험적이라 지금 채택 대상은 아니나, 방향 차이 자체가 기록 가치.

## 7. 회고용 질문 (나중에 이 노트를 꺼낼 때)

1. CLAUDE.md 는 몇 줄인가? 885 에서 늘었나 줄었나 — 늘었다면 P1 을 왜 아직 안 했나.
2. 지난 4주 whats-new 중 **내 런타임에 이미 붙어 있는데 내가 모르고 손으로 우회한** 기능이 있나?
3. 비협상 철칙 중 아직 **산문으로만** 존재하는 것은? (§6-A 분할선 적용)
4. 신설 스킬이 `use-ledger` 에서 8주 내 사용 기록을 남겼나 — §6-C 의 보수성이 옳았나?
5. 이 노트의 기준선(W29)이 몇 주 밀렸나? 4주 초과면 `review_trigger` 발동.

## 8. 반영 판정 ([학습→반영 루프 (Absorb-to-Apply)](../narrative/학습→반영 루프.md) 3-way)

- **②파킹 + 이름붙은 트리거** — P1(`.claude/rules/`)·P2(`skillOverrides`)·P3(서브에이전트 3점). 반영처 = 각각 CLAUDE.md 구조(L-STAGE 패치) · 헌법 §외부도구 예외 · dispatch-builder/graphify 운영규칙. 트리거 = **P1 = 다음 헌법 구조 작업 시** / **P2 = 다음 graphify install·업그레이드 시** / **P3 = 다음 서브에이전트 디스패치 설계 시**.
- **③순수 참조** — 엔터프라이즈·게이트웨이·SDK 대영역(작가 스택 아님), Agent teams(실험적·기본 off), Artifacts 공개 공유(L-HITL).
- **반영 diff 0** — 본 흡수로 즉시 고친 파일 없음. 정직 선언. §6-A 는 *도출*이지 반영이 아니다.

## 연결

agent-harness · [Claude Code 런타임 내부 (Layer C)](claude-code-runtime-internals.md) · [Dynamic Workflows — 작업마다 하네스 (Claude Code)](dynamic-workflows-harness.md) · hermes-loop · skill-curator · agent-skill-quality-gate · llm-wiki-reliability-harness · [Forge Spec-Gate (why-was-fable-banned) — 차용 해체](forge-spec-gate.md) · use-ledger · lessons
