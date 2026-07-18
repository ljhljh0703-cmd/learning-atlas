---
created: 2026-06-17
updated: 2026-06-17
type: learning
tags: [agent-harness, rsi, mcp, acp, recipes, subagents, hooks, context-engineering, model-independent, clean-room, north-star]
source: https://github.com/aaif-goose/goose
authors: [Block, Agentic AI Foundation]
year: 2026
category: technique
---

<!-- goose(Block→AAIF/Linux Foundation) 전문 해체 — "Agent=Model+Harness"의 production 오픈소스 정본. 모델독립 하네스·RSI ②Apply 외부증거. clean-room 통독(코드복제 X). -->

> ✅ **confirmed** (2026-06-17, 작가 확정) — Claude 작성, clean-room 전문통독 기반 ③Gate PASS(출처 실존·환각0·코드 복제 X).

# goose — 모델독립 에이전트 하네스 (production 오픈소스 정본)

**goose** = Block 이 만들어 **Agentic AI Foundation(Linux Foundation)** 으로 이관한 오픈소스 범용 AI 에이전트. **Rust** 구현, 데스크톱·CLI·API 3형태, 15+ provider, MCP 70+ 확장, ACP. Apache-2.0.

**왜 중요** — 작가 북극성 *"Agent = Model + Harness"*(agent-harness-rsi-brief)의 **완성형 production 실물**이다. 모델은 갈아끼우고(15+ provider, ACP 로 Claude/Codex 구독까지) 나머지 전부가 하네스. [The New SDLC With Vibe Coding (Google / Addy Osmani)](../methods/google-new-sdlc-vibe-coding.md) 에 이은 **두 번째 외부 ground-truth**이며, *Fable 과 무관한* 모델독립 하네스라 Fable 차단 비상에 직접 유효. 하네스가 곧 *오픈소스 코드*로 존재 = 작가가 H-Core 를 검증·차용할 1:1 대조군.

## 1. 코어 아키텍처

- **3-요소**: Interface(데스크톱/CLI) + Agent(상호작용 루프 코어) + Extensions(MCP 툴). Interface 가 agent 인스턴스를 띄우고, 동시 다중 agent 도 가능.
- **상호작용 루프 6단계**: ① 인간 요청 → ② Provider Chat(요청+툴목록을 LLM 에) → ③ 툴콜 실행(LLM 은 JSON 툴콜 생성만, 실행은 goose) → ④ 결과 환류 → ⑤ **Context Revision**(낡은/무관 정보 제거) → ⑥ 최종 응답. ↔ [Claude Code 런타임 내부 (Layer C)](../methods/claude-code-runtime-internals.md) 루프.
- **Extension trait**(Rust): `name/description/instructions/tools/status/call_tool`. 툴 = `Value → AgentResult<Value>` async. **에러 = 프롬프트** 설계: 잘못된 툴명·파라미터·툴 실패를 *tool response 로 LLM 에 환류*해 스스로 복구(`ToolUse`/`ToolResult`를 `Result<T, AgentError>`로 전달, thiserror 컬렉션 유지). 에러로 흐름 끊지 않음.
- **ACP (Agent Client Protocol)** 양방향: ⓐ goose 가 *ACP 서버*(Zed/JetBrains 가 붙음) ⓑ 외부 ACP 에이전트(Claude Code·Codex)를 *provider*로 위임 — **기존 Claude/ChatGPT/Gemini 구독(외부 도구 기능)을 API키 없이** 사용. ↔ claude-max-cost-shift.

## 2. 하네스 척추에 직결되는 메커니즘 (높은 순)

### 2.1 MOIM + Persistent Instructions = "규율이 안 새게"
- **MOIM(Model-Observed Internal Memory)** = 매 턴 모델에 컨텍스트 주입(타임스탬프·작업디렉토리·todo). 여기에 **persistent instructions** 를 매 턴 *새로 읽어* 주입.
- `.goosehints`(세션 시작 1회 로드, 컨텍스트 차면 잊힘) vs **persistent instructions(매 턴 주입 → 절대 안 잊힘)**. env `GOOSE_MOIM_MESSAGE_TEXT`/`GOOSE_MOIM_MESSAGE_FILE`(매 턴 fresh read, 재시작 불요, 64KB cap).
- **→ vault 직결**: 작가의 *"꼭 지켜야 하는데 자꾸 새는 규율"*(CLAUDE.md §강제 규율 4부 골격) 의 **메커니즘 답안**. 시스템 프롬프트보다 *매 턴 주입*이 가드레일에 강하다는 외부 정본. (현 vault 는 system-reminder 주입에 의존 — goose 는 이를 명시 메커니즘화.)

### 2.2 Adversary Mode = ③Gate 적대검증자 외부 정본
- 메인과 *동일 모델*의 **독립 리뷰어**가 *툴 실행 전* 원래 작업+최근 메시지+툴 상세를 보고 **ALLOW/BLOCK**. 규칙은 `~/.config/goose/adversary.md` 평문(파일 존재=ON). 차단된 콜은 재시도 불가.
- 패턴매칭(prompt-injection-detection = `patterns.rs` 정규식+선택적 ML)과 **2층**: adversary 는 *맥락 이해*, 패턴은 *상시*.
- ⚠ **설계 차이 = fail-OPEN**(리뷰어 실패 시 *통과*). vault ③Gate/[검증자의 주장도 환각이다 — 강한 주장은 1차 출처로 재-Gate](../methods/verifier-claims-need-regate.md) 는 fail-safe 성향 — *비교 가치 큼*(편의 vs 안전 트레이드오프). ↔ hermes-loop ③Gate.

### 2.3 Recipes + Subrecipes = dispatch-builder/SSOT 위성 외부 정본
- **Recipe**(YAML/JSON) = instructions+prompt+params+extensions+`settings`(model override)+`activities`를 1파일 패키징(재사용·공유·재현). `GOOSE_RECIPE_PATH`/GitHub repo 로딩. ↔ dispatch-builder master prompt.
- **`response.json_schema`** = 최종 출력을 JSON 스키마로 *강제*(비대화 자동화용). ↔ RETURN 구조화 강제·[Forge Spec-Gate (why-was-fable-banned) — 차용 해체](../methods/forge-spec-gate.md).
- **`retry`(done-gate!)** = `max_retries`+`checks`(shell, exit 0=성공)+`on_failure`. 실패 시 **agent 메시지 히스토리 초기화 후 재실행**, 모든 check pass 까지. = TDD/검증가능 성공기준([Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](../methods/karpathy-guidelines.md) #4)의 *런타임 자동화*. ↔ dispatch-builder TDD·agent-harness done-gate.
- **`parameters`**: `string/number/boolean/date/file/select`. **`file` 타입=경로 아닌 *내용*을 읽어 치환**. `user_prompt`=대화형 질문. Jinja `{{ }}` + `{% extends %}` 템플릿 상속.
- **Subrecipe** = recipe 가 호출하는 recipe. **격리 세션**(history/state/memory 비공유), **중첩 금지**(무한재귀 차단), `values`(고정값, context 우선), 순차/조건/병렬(`sequential_when_repeated`). `summon` 확장 자동 주입. ↔ SSOT 위성 패턴.

### 2.4 Subagents = 3-AI 분업 + "3심제 Checker 분리" 외부 답안
- 독립 인스턴스(프로세스 격리·컨텍스트 보존). autonomous 모드서 *자율 생성*(manual/smart/chat 모드선 비활성). 순차/병렬. **return mode**(full/summary), 확장 제한.
- **보안제약**: 서브에이전트 *재귀생성 금지*·확장 enable/disable 금지·스케줄 변경 금지(부모 세션 보호). timeout 5분·max_turns 25 기본.
- **External subagent = Codex 를 MCP 서버로** 물려 호출(`cmd: codex`, `approval_policy=never`, `sandbox=workspace-write`). ↔ 작가 Codex 위임.
- **→ vault 직결**: hot.md 펜딩 *"3심제 Checker 분리(Claude Code sub-agent 인프라 의존)"* 의 외부 작동 답안.

### 2.5 Context Revision / Smart Context = RTK 정량
- auto-compact **80% 토큰**(`GOOSE_AUTO_COMPACT_THRESHOLD`) → 작은 LLM 요약. tool output **10건 초과 시** 백그라운드 요약(`GOOSE_TOOL_CALL_CUTOFF`). `GOOSE_CONTEXT_STRATEGY`(summarize/truncate/clear/prompt, 헤드리스=summarize 기본). **Max Turns**(기본 1000, 폭주·무한루프 가드).
- 명시 원칙: *rewrite 대신 find&replace·ripgrep 로 시스템파일 skip·verbose 출력 요약·낡은 콘텐츠 삭제*. ↔ token-minimal-session-router·RTK.

### 2.6 Plan mode + Planner 모델 분리
- `GOOSE_PLANNER_MODEL`(기획)≠실행 모델(예: GPT 기획+Claude 실행). 대화형 clarifying questions(번호 batch 답변), `/plan`·`/endplan`. ↔ dispatch-builder 역면접·§4 모델 라우팅.

### 2.7 편집 가능 Prompt Templates = 하네스 뇌의 표면화
- `crates/goose/src/prompts/` 의 system.md·**compaction.md**(요약 정책!)·**permission_judge.md**(read/write 분류)·plan.md·recipe.md·**subagent_system.md** 를 *사용자가 오버라이드*(`~/.config/goose/prompts/`, 업데이트에도 persist). Jinja2(`{{ extensions }}`/`{{ hints }}`).
- **→ vault**: [Claude Code 런타임 내부 (Layer C)](../methods/claude-code-runtime-internals.md) compaction Layer C 가 goose 에선 *편집 가능 파일*로 노출 = 작가 하네스 설계 참조.

## 3. 운영·거버넌스 메커니즘 (인접 추출)

- **Hooks**(Open Plugins 스펙): 라이프사이클 이벤트(SessionStart/End·Pre/PostToolUse·PostToolUseFailure·AfterFileEdit·BeforeShellExecution·AfterShellExecution…)에 셸 스크립트, payload=stdin JSON, `matcher`=정규식(예 `"\\.rs$"`, `"^(cargo test)"`). 실패해도 goose 안 죽음(로그+계속). ↔ 작가 *강제 규율 자동화*(agy `--sandbox` 강제·Codex worktree-accept 게이트를 훅화할 단서).
- **Plugins** = skills+hooks 번들. `goose plugin install <git>`·`update`. 네임스페이스 `plugin:skill`. ↔ 작가 스킬 incubator.
- **Skills 표준 수렴**: goose 가 Agent Skills 표준(`SKILL.md`, `~/.agents/skills/`) 채택 + **`.claude/skills/` 하위호환 읽기** + Claude Desktop 호환(agentskills.io). → 작가 스킬 시스템이 *수렴하는 개방표준 위*에 있다는 확인. (블로그 "Did Skills Kill MCP?")
- **Permission modes**: Auto(기본)/Manual/Smart(리스크 기반 자동승인)/Chat. read/write 툴 분류는 LLM 해석. CLI provider(Claude Code) 권한을 goose UI 로 라우팅(Claude Agent SDK 동일 메커니즘).
- **Sandbox**(macOS seatbelt + egress proxy): `GOOSE_SANDBOX=true`. SSH키/`.zshrc`/config.yaml 쓰기차단, 모든 트래픽 프록시 강제, `nc/socat/telnet`·raw socket 차단, `blocked.txt` 도메인 차단(live reload `fs.watch`), SSH 는 git host 화이트리스트. ↔ 작가 외부 CLI `--sandbox` 강제룰의 production 모델.
- **Allowlist**: `GOOSE_ALLOWLIST`=YAML URL → 설치 가능 MCP 만 화이트리스트(기업용). HTTPS 권장.
- **Code Mode**(pctx Deno 런타임): LLM 이 JS 작성해 MCP 툴 *programmatic* 호출(3 meta-tool: list_functions/get_function_details/execute_typescript), 콜 batch·중간결과 로컬 체이닝·on-demand 툴 발견. **5+ 확장**서 컨텍스트 절감.
- **`goose run`(헤드리스)**: `-t`/`-i file`/`-i -`(stdin)·`--no-session`(/dev/null)·**`--output-format json|stream-json`**(CI 파싱)·`--with-builtin`·`--provider/--model` override. CI/CD 통합. `goose-self-test.yaml`(기능 추가 시 self-test recipe 갱신·재실행=자가검증).
- **codebase-analysis**: Developer 확장의 `analyze` 툴 = 빌트인 심볼/콜그래프 추적(구조/시맨틱/포커스 3모드, 다언어). ↔ vault CodeGraph/graphify 와 동류(빌트인이라는 점이 차이).
- **Custom Distros**(white-label): fork→config/prompts/extensions/branding 커스터마이즈→배포. goose-server(goosed) REST API 위에 자체 UI. Apache-2.0 준수(라이선스·수정고지·상표 주의).

## 4. 🌟 Open Model Gym = RSI ②Apply 측정 방법론 정본

`evals/open-model-gym/` = **models × runners × scenarios 매트릭스** 벤치. 핵심 철학·메커니즘:
- *"opus 로 잘하는 건 쉽다 — 반대 방향으로 스케일해 무엇까지 쪼개야 되나"* = **하네스로 약한 모델을 끌어올리는 정도**를 측정. = 작가 ②Apply *"다른 모델+하네스로 Fable급 나오나"* 와 동일 질문.
- **worst-of-N(기본 3회)**: 한 번이라도 실패하면 FAIL = flaky pass 검출. = 작가 ③Gate "전수 직접 재현" 정신.
- **runner 추상화**: `goose`·`opencode`·**`pi`**([pi 코딩 에이전트 CLI](../methods/pi-coding-agent.md)!) 교체 가능 = 하네스(runner)와 모델 분리 측정. config.yaml 로 매트릭스 선언.
- **→ vault 반영처**: agent-harness-rsi-brief §6 ②Apply 측정을 *매트릭스화*(과제×모델×runner, worst-of-N)할 설계 참조. 현 vault 의 1과제-수동측정 → 매트릭스 자동화 업그레이드 후보.

## 5. AGENTS.md 자체 = "강제 규율 4부 골격" 모범

goose repo `AGENTS.md` 는 작가 §강제 규율 4부 골격의 외부 사례 — `Never` 실명 나열·Ink UI 정확 제약(문자그리드 overflow 규칙 7종)·"comment = why not what". [The New SDLC With Vibe Coding (Google / Addy Osmani)](../methods/google-new-sdlc-vibe-coding.md) "dense AGENTS.md=first-pass 성공률↑" 의 구체 인스턴스. `.goosehints`=계층형(monorepo 디렉토리별), `@file`=즉시 컨텍스트 주입 vs plain=필요시.

## 6. 학습→반영 (학습→반영 루프)

| 학습 | 반영처 | 상태 |
|---|---|---|
| MOIM 매 턴 주입 = 규율 안 새는 메커니즘 | CLAUDE.md §"대화 시작 시" 주입 표면 배치 원칙(A안, 4부 골격 미변경) | ✅ **merged**(2026-06-17, 작가 명시 merge — 패치 `_archive/`) |
| Open Model Gym 매트릭스+worst-of-N | agent-harness-rsi-brief §6 ②Apply 측정 자동화 | ✅ **반영**(2026-06-17, §6 매트릭스화 항목 — 과제 5+ 누적 시 도입 가드) |
| retry+success-check done-gate | dispatch-builder 슬롯3 done-gate 형식화 | ✅ **반영**(2026-06-17, 슬롯3 머신체크 게이트 항목) |
| Adversary fail-open 비교 | hermes-loop ③Gate / [검증자의 주장도 환각이다 — 강한 주장은 1차 출처로 재-Gate](../methods/verifier-claims-need-regate.md) | 본 페이지 §2.2 박제(비교축) |
| Hooks 라이프사이클 자동화 | 강제 규율 자동화(agy/Codex 게이트 훅화) | backlog(인프라 의존) |

**과적용 가드**([Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](../methods/karpathy-guidelines.md) #2/#3): goose 는 *별도 도구*이지 vault 채택 대상 아님. 위 backlog 는 *메커니즘 차용 후보*일 뿐, 즉시 헌법 변경 X — 작가 컨펌 시 patch.

## 관련
[opencode — 모델독립 에이전트 하네스 #2 (컨텍스트 조립 *엄밀성* 정본)](opencode-agent-harness.md)(자매 = 모델독립 하네스 #2, depth/rigor 측) · agent-harness · agent-harness-rsi-brief · [Claude Code 런타임 내부 (Layer C)](../methods/claude-code-runtime-internals.md) · dispatch-builder · hermes-loop · [The New SDLC With Vibe Coding (Google / Addy Osmani)](../methods/google-new-sdlc-vibe-coding.md) · [Fable 5 프롬프팅 (공식 가이드)](../methods/fable-5-prompting.md) · [Forge Spec-Gate (why-was-fable-banned) — 차용 해체](../methods/forge-spec-gate.md) · [pi 코딩 에이전트 CLI](../methods/pi-coding-agent.md)
