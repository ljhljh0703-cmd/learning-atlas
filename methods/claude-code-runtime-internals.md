---
created: 2026-06-15
updated: 2026-06-15
type: learning
tags: [claude-code, agent-sdk, runtime, layer-c, permissions, sandbox, compaction, mcp, autonomous-dispatch]
source: https://code.claude.com/docs/en/
authors: [Anthropic]
year: 2026
category: method
---

<!-- Claude Code / Agent SDK 런타임 내부(Layer C) 정본 — 공식 docs 확증 Tier A + 비공식 논문 Tier B 격리. research-relay GPT ④Gate. -->

# Claude Code 런타임 내부 (Layer C)

> **한줄**: 자율 에이전트를 *안전·장기* 구동하는 Claude Code/Agent SDK 내부 — 권한·샌드박스·컴팩션·MCP/tool_search·세션·서브에이전트. Fable-as-harness 5층 중 **Layer C(런타임 환경)** 정본. **Tier A = 공식 docs 확증**(권위), **Tier B = 비공식 논문 후보**(미확정, 격리).
> **흡수 경로**: research-relay GPT 외주(breadth) → vault Claude ④Gate(arXiv ID 2건 실존 직접 검증). leak 프롬프트엔 *부재* — 본 내부는 공식 SDK docs + 소스레벨 분석 논문이 실제 출처.

## Tier A — 공식/권위 (code.claude.com/docs)

### A1 권한 심사
- 룰 평가 = **`deny → ask → allow`** 순서, 첫 매치 결정(specificity 무관). 모델 내부 아닌 CLI/SDK 단 평가.
- modes: `default`·`acceptEdits`·`plan`·`auto`·`dontAsk`·`bypassPermissions`.
- `bypassPermissions` = explicit `ask` 룰·root/home 삭제 circuit breaker 제외하고 prompt 생략.
- MCP 도구명 `mcp__<server>__<tool>`. allow glob 은 server segment 가 literal 일 때만(`mcp__srv__*`), unanchored(`*`·`B*`·`mcp__*`)는 warning 후 skip.
- compound Bash 는 `&&`·`||`·`;`·`|`·`&` 등으로 subcommand 분리 평가. Read/Edit 경로룰 = gitignore spec 계열.
- 출처: code.claude.com/docs/en/permissions · /settings · /agent-sdk/agent-loop

### A2 샌드박스
- `bypassPermissions` = prompt 생략 *≠ OS 격리*. 공식: isolated container/VM 에서만 쓰라 경고.
- macOS = **Seatbelt** / Linux·WSL2 = **bubblewrap + socat**(native Windows 미지원). `@anthropic-ai/sandbox-runtime` = seccomp helper.
- 네트워크 격리 = 샌드박스 밖 프록시 + domain allowlist. 내장 프록시는 TLS terminate/inspect 안 함(터널만).
- 샌드박스는 Bash subprocess·child 에 적용. Read/Edit/Write 빌트인은 permission system 으로 제어.
- 출처: code.claude.com/docs/en/sandboxing

### A3 컴팩션 (공식 표면)
- `/compact [instructions]`. context limit 근접 시 자동 compaction. stream 에 `compact_boundary`(`SDKCompactBoundaryMessage`).
- `PreCompact` hook = `trigger`(manual|auto)·`custom_instructions`(manual 시 `/compact` 인자). `PostCompact` = `trigger`·`compact_summary`.
- `CLAUDE.md` 의 "Summary instructions" 섹션으로 보존 항목 지시(헤더명은 magic string 아님): objective·acceptance·읽은/수정 파일·테스트 실패·결정·TODO·권한경계.
- **공식 미확인**(→ Tier B): `DISABLE_AUTO_COMPACT`·`DISABLE_COMPACT` env · 토큰 임계치 · per-file/skill 제한 · 중요도 공식.
- 출처: code.claude.com/docs/en/agent-sdk/agent-loop · /hooks · /sessions

### A4 MCP / tool_search
- `tool_search` = 수백~수천 도구에서 정의를 upfront 전량 주입하지 않고 필요 도구만 dynamic load(default on, 결과 3~5개).
- `ENABLE_TOOL_SEARCH`: unset/`true`=on · `auto`=정의 토큰이 컨텍스트 10% 초과 시 발동 · `auto:N`=커스텀 % · `false`=off. max 10,000 도구, Haiku 제외 전 모델.
- `allowedTools: ["mcp__server__*"]` 로 서버 도구 auto-approve. = 작가 **RTK/Progressive Disclosure 의 공식 확증**.
- 출처: code.claude.com/docs/en/agent-sdk/mcp · /agent-sdk/tool-search

### A5 세션 영속성
- transcript = `~/.claude/projects/<project>/<session-id>.jsonl`(line 당 message/tool-use/metadata, append). cleanup 기본 30일.
- resume `--continue`·`--resume[ <name>]`·`/resume` / branch·fork `/branch`·`--fork-session`.
- checkpoint 는 **Claude 편집 도구 변경만** 추적 — Bash 가 바꾼 파일은 rewind 대상 X(→ git/worktree/container snapshot 병행).
- 출처: code.claude.com/docs/en/sessions · /checkpointing

### A6 서브에이전트 / 병렬 / 사용자 노출
- subagent = fresh conversation, 중간 tool call 은 parent 미누적·**final message 만 반환**. 동시 실행 가능.
- `AgentDefinition` 필드: description·prompt·tools·disallowedTools·model·skills·memory·mcpServers·initialPrompt·maxTurns·background·effort·permissionMode.
- read-only(및 read-only MCP) 도구 = concurrent / state-modifying = sequential.
- ⚠️ `send_to_user` = Claude Code CLI docs 에 *미수록*. 우리 [Fable 5 프롬프팅 (공식 가이드)](fable-5-prompting.md) §스캐폴딩 #5 의 스키마는 *Fable 프롬프팅 가이드*(platform.claude.com)의 권고 **클라이언트 측** 도구지 CLI 빌트인 아님.
- 출처: code.claude.com/docs/en/agents · /agent-sdk/subagents

## Tier B — 비공식 논문 후보 (미확정, 인용 시 "논문 주장"으로만)
- **B1 5단계 컴팩션 파이프라인** — ✅ **본문 확정 (arXiv 2604.14228 본문, research-relay GPT ④Gate 2026-06-15)**: 5단계 명칭 = `Budget reduction → Snip → Microcompact → Context collapse → Auto-compact`(HTML L440-454, `query.ts` 내 model call 전 sequential shapers, cheaper→costlier escalate). 단계별: budget=tool output size limit→content reference 치환 / snip=older history trim(`HISTORY_SNIP` flag) / microcompact=cache-aware(`CACHED_MICROCOMPACT`) / context collapse=read-time projected view(stored history 불변, `CONTEXT_COLLAPSE` flag) / auto-compact=앞 4단계 뒤 pressure threshold 초과 시 full model summary(`compactConversation()`+PreCompact hook). **단 ① 단계별 토큰 임계치(이전 추정 ~50k/~5k) ② 중요도 스코어링 공식 ③ summarizer 전용 모델명 = 본문에도 부재 → 생성 금지**(논문은 "pressure threshold" 언급만 numeric 무, memory retrieval 은 "LLM-based scan" L786). context window 수치만 확인: 200K(older)·1M(Claude 4.6) L271.
- **B2 권한 ML 분류기**: arXiv **2604.04978** "Measuring the Permission Gate"(Ji 외, 2026-04-04)가 auto mode 를 "two-stage transcript classifier" 로 서술, AmPermBench(128프롬프트). 수치(생산 0.4% FP/17% FN[Anthropic 보고로 인용]·독립 stress 81% FNR)는 논문 주장.
- 맥락: 2026-03 Claude Code 소스맵 유출(The Verge·BI 보도) → 이런 소스레벨 분석 논문의 배경.
- 두 arXiv ID = vault Claude WebFetch 직접 검증 = **실존 확인**(2026-06-15).

## 적용 — 안전한 고자율 디스패치 (→ dispatch-builder)
- **deny-first 외부화**: 민감 파일은 프롬프트가 아닌 `deny` 룰(`Read(./.env*)`·`Read(./secrets/**)`·`mcp__*`)로 차단.
- **bypass 는 격리 전제만**: CI/container/VM 한정 + sandbox unavailable 시 fail-closed(`failIfUnavailable: true`·`allowUnsandboxedCommands: false`).
- **permission ↔ sandbox 분리**: 전자=어떤 tool call 시도 가능, 후자=Bash 가 OS 에서 실제 가능. 둘 다 필요.
- **compaction 손실 방지**: 불변 조건은 initial prompt 아닌 CLAUDE.md "Summary instructions" + Pre/PostCompact hook archive.
- **tool_search 로 도구폭발 억제**: 대규모 MCP 는 upfront 주입 X, `ENABLE_TOOL_SEARCH=auto:N`.
- **병렬은 subagent 격리**: 조사/검증/리뷰는 subagent, parent 엔 final summary 만. edit 가능 ↔ read-only subagent 분리.

## 소비자 표면 / 권한 사다리 / 캐싱 (2026-07-11, codex-gate merge-small)
<!-- claude-feature-guide teardown 3넉킷(나머지 ~70% 중복=기존 페이지·헌법). proposed_by: external_ai (via codex), 판정 by claude. -->
- **R0–R3 권한 사다리** (산재 개념의 형식화 — deny>ask>allow의 소비자판): R0 read-only(기본) → R1 sandbox(격리 쓰기) → R2 scoped write(명시 경로) → R3 external/side-effect(승인 필요). web-reach "read-only→sandbox→external"·CLAUDE.md CLI write-block 규율과 정합.
- **Task-contract YAML** (디스패치 계약 패턴, vault 대응물 없음): `freshness / write_scope / side_effects / acceptance / on_failure`. 자율 작업 지시에 이 5필드 명시 → dispatch-builder 슬롯 보강 후보.
- **Prompt-caching 비용 역학** (⚠ 수치 = 가이드 주장, **`claude-api` 스킬과 대조 후 잠금**): TTL 5분/1시간, read ~0.1×·write ~1.25×, 프리픽스 순서 tools→system→messages. 버전 드리프트 취약 zone — 인용 전 claude-api 정본 확인.
- **Telemetry anti-hype: `input_tokens` 단독 ≠ 총 context** (2026-07-17, computer-use video merge-small): 데모의 `108,000 → 11` 은 context가 줄어든 게 *아니라* usage accounting이 **cache read/create + post-breakpoint input**으로 분리된 것. 캐시 히트 시 `input_tokens`는 breakpoint 이후 신규 입력만 세므로 작게 보인다 → 총 context = cache_read + cache_creation + input 합산으로 읽어야. "90% fewer tokens" 류 제목은 회계 착시. (출처: `Building toward Computer Use`(DeepLearning.AI×Anthropic) X 편집본, Anthropic 2026 docs 교차확인. 수치 계약은 `claude-api` 스킬(공식 docs) 우선.)
- ⚠ 나머지(SSOT-not-memory·Artifacts 저장·권한/샌드박스)는 본 페이지·[Fable 5 프롬프팅 (공식 가이드)](fable-5-prompting.md)·헌법 §0에 기보유 → 재흡수 X.

## 관계
- agent-harness §leak대조군 L-1·L-2·L-4·L-5 = 본 페이지로 de-fence(공식 확증). L-3 = 위 B1(명칭 confirmed 본문출처, 임계치/공식/모델 부재 확정).
- [Fable 5 프롬프팅 (공식 가이드)](fable-5-prompting.md) §4~6 = 본 페이지가 공식 정본(leak 대조군은 역사 보존).
- 출처 신뢰도: EVAL GPT 6건째.
