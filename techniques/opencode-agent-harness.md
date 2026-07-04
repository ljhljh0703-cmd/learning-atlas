---
created: 2026-06-17
updated: 2026-06-17
type: learning
tags: [agent-harness, context-engineering, system-context, durable-session, permission-policy, plugins, model-independent, clean-room, effect]
source: https://github.com/sst/opencode
authors: [sst, anomalyco]
year: 2026
category: technique
---

<!-- opencode(sst, TS/Bun/Effect) 전문 해체 — 모델독립 하네스 #2 대조군. goose=breadth/features, opencode=depth/rigor(System Context 대수·durable session core·capability-scoped tools). clean-room 통독(코드복제 X). -->

> ⚠️ **임시(provisional)** — Claude 작성, 작가 컨펌 전. clean-room 전문통독 기반 ③Gate PASS(출처 실존·환각0·코드 복제 X). 컨펌 시 `status: confirmed`.

# opencode — 모델독립 에이전트 하네스 #2 (컨텍스트 조립 *엄밀성* 정본)

**opencode** = sst(SST 제작사) 의 오픈소스 AI 코딩 에이전트. **TypeScript/Bun**, **Effect**(함수형) + Drizzle, 터미널 TUI 중심 + 데스크톱/서버/SDK. MIT.

**왜 / 위치** — [goose — 모델독립 에이전트 하네스 (production 오픈소스 정본)](goose-agent-harness.md) 에 이은 **모델독립 하네스 3번째 대조군**(goose·[pi 코딩 에이전트 CLI](../methods/pi-coding-agent.md) 와 함께; goose Open Model Gym 이 opencode 를 runner 로 씀 = 인접 추출로 발굴). **goose 와 상보적**:
- **goose = breadth** — recipes·subagents·hooks·MCP·ACP, *사용자향 하네스 기능 폭*.
- **opencode = depth/rigor** — *컨텍스트 조립·durable session·capability 권한*의 아키텍처 엄밀성. "어떻게 *결정론적·durable·다중프로젝트* 에이전트 런타임을 설계하나."

→ 작가 북극성(agent-harness-rsi-brief "Agent=Model+Harness")의 *설계 깊이* 측 ground-truth. [Claude Code 런타임 내부 (Layer C)](../methods/claude-code-runtime-internals.md) compaction·CLAUDE.md "주입 표면" 원칙의 *한 단계 위 형식화*.

## 1. 🌟 System Context 대수 (CONTEXT.md — 최대 차별점)

opencode 는 시스템 프롬프트를 *blob* 이 아니라 **typed Context Source 들의 합성**으로 다룬다. 용어가 곧 설계:

- **Context Source** — 독립 관찰되는 typed 값 1개(안정 key + JSON codec + infallible loader + pure *baseline/update/removal* renderer). 시스템 프롬프트의 한 조각이 *개별 추적*됨.
- **System Context Registry** — Location-scoped, ordered scoped producer 들이 stable key 로 기여. 중복 key = 합성 실패. concurrent 평가하되 *contribution-key 순서로 결합* → 렌더 결정론.
- **Context Epoch** — 한 baseline System Context 가 *불변*인 구간. compaction 또는 model/provider 전환 시 종료. = **provider 캐시 prefix 보존 단위**(baseline 의 정확한 joined text 를 durable 보존).
- **Mid-Conversation System Message** — Context Source 가 바뀌면 *전체 시스템 프롬프트 재작성 X*. 대신 "newly effective state" 를 **chronological 메시지 1개**로 admit(durable·재시도 시 그대로 replay). 여러 source 변경은 *한 경계에서 1개로 결합*.
- **Safe Provider-Turn Boundary** — 변경은 provider 호출 *직전*에 lazy 하게 admit(source 가 바뀔 때 async push 안 함). 새 user input·정착된 tool 결과가 system 메시지보다 *앞*.
- **Unavailable Context** — stale-while-revalidate. 일시 관찰 불가 시 *직전 상태 유지·업데이트 미발행*(성공적으로 로드된 "부재"=removal text 발행과 구분).

**→ vault 직결**: 이게 MOIM/persistent-instruction([goose — 모델독립 에이전트 하네스 (production 오픈소스 정본)](goose-agent-harness.md) §2.1)·compaction Layer C·작가 "주입 표면" 원칙의 **엄밀 형식화**. 핵심 교훈 = *규율/컨텍스트를 통째 재주입하지 말고, 변경분만 안전 경계에서 chronological diff 메시지로* → 토큰·캐시 효율 + 결정론.

## 2. AGENTS.md·Skill 을 Context Source 로

- **AGENTS.md = aggregate Context Source** — global + 상향 프로젝트 `AGENTS.md` 를 *ordered aggregate* 1개로, 매 safe boundary 관찰. 변경 시 "complete current ordered set" 메시지로 supersede(남은 게 없으면 "이전 지시 더 이상 적용 안 됨" 명시). `OPENCODE_DISABLE_PROJECT_CONFIG` 로 프로젝트 지시 차단(global 은 유지). nested 디스커버리.
- **Skill guidance = permission-gated Context Source** — 에이전트에 *허용된* skill 의 **이름+설명만** 컨텍스트에 노출. skill body·위치는 **permission-checked `skill` tool** 로만. = **Progressive Disclosure 의 형식화**(작가 RTK·슬라이스 규율의 정본). 에이전트 전환 = Context Epoch replacement 요청(권한 baseline 누수 방지, fenced).

## 3. Tool = single opaque executor + codec 경계 (specs/v2/tools.md)

- **Tool.make** = `{description, input codec, output codec, execute, toModelOutput?}` 단일 불투명 정의. *executor 정확히 1개*. schema 변환은 service 불요(의존성은 construction 때 capture).
- **codec 경계**: execute 는 *decoded* input 관찰, projection 은 *encoded* output. 잘못된 input=tool 미호출, 잘못된 output=성공 settlement 불가.
- **scoped registration overlay**: 이름으로 등록, 최신 active 가 win, 닫으면 *직전 active 가 다시 드러남*. **stale rejection** = provider turn 에 advertised 된 registration 만 실행(교체/제거되면 stale).
- **권한은 tool 이 직접 형성**: 신뢰 tool 이 `permission.assert{action, resources, save}` 를 스스로 호출. registry 가 helper 주입 X. *tool 타입 공유 ≠ 권한 동일*(built-in 만 trusted Location service capture).
- **Laws 7개**(single executor·codec boundary·durable identity·scoped registration·captured execution·stale rejection·storage encapsulation).

## 4. Model Tool Output Bounding = RTK 엄밀판

- tool 은 *완전한* 도메인 출력 반환(절단·retention 파일 관리 안 함). settlement 경계가 **provider 로 가는 채널만** bound: 한도 = max lines or UTF-8 bytes(먼저 닿는 것), provider-독립.
- 초과 시 → **Managed Tool Output File**(공유 temp 디렉토리, 전체 텍스트) + history 엔 *bounded preview*(+typed path). 절단은 *시작+끝 보존*. retention 실패 시 → "lossy bounded output without path" 기록(성공을 실패로 바꾸지 않음).
- **producer memory ≠ model-output bounding** 구분(프로세스/스트림 spool 한도는 producer 경계서, model 절단으로 위장 금지).
- → token-minimal-session-router·RTK "verbose 출력 요약"의 형식 정본.

## 5. plan/build/general 에이전트 + 권한=정책

- **build**(기본, full-access) ↔ **plan**(read-only: 편집 deny·bash 전 permission 요청) **Tab 전환**. **@general** subagent(복잡 검색·multistep, 내부용). = goose plan mode 를 *1급 에이전트 토글*로.
- **Permission = 정책**(provider-policy.md): provider 가 *올바로 설정·유효 인증* 이라도 **policy 가 deny 가능**(`experimental.policies`, `action:provider.use` / `resource:provider ID`). *권한 ≠ 인증* 분리. config(엔드포인트)와 policy(허용 여부) 별개 런타임 관심사.

## 6. Plugin = 확장 경계 + Durable Session Core

- **v2 방향**: "behavior 를 큰 service 에서 *plugin* 으로 빼라." core = 작고 typed 한 container(스키마·typed error·state·events·hook 계약), 정책/통합은 plugin hooks(immutable input + Immer draft output + `cancel`, **sequential = 결정론 순서**). hook 은 *커밋 전*, event 는 *커밋 후*. = 작가 스킬/하네스 분리 철학과 공명.
- **Durable V2 Session Core**(AGENTS.md): durable prompt admission *≠* model execution(`session_input` row 먼저 admit → advisory `wake`), Session-ID 기반 process-global, **Location-scoped**(이동 시 destination 서 baseline 재초기화·fenced), revert/unrevert·share·compact. clustering-ready. = 헤드리스·복구·다중프로젝트 런타임 설계 참조.
- **dense AGENTS.md 스타일 가이드** = 또 하나의 §강제 규율 4부 골격 사례(Never alias imports·Avoid `else`·early return·inline single-use·no `any`). repo AGENTS.md 가 *코드 스타일 계약*.

## 7. goose ↔ opencode 대조 (한 표)

| 축 | goose | opencode |
|---|---|---|
| 강점 | breadth(기능 폭) | depth(아키텍처 엄밀) |
| 컨텍스트 | Context Revision(요약·삭제, 서술) | **System Context 대수**(typed source·epoch·diff 메시지) |
| 확장 | MCP + recipes + hooks | **plugin hooks**(core 박막화) + MCP |
| 권한 | 4 모드(auto/manual/smart/chat) | **policy=action:resource**(인증과 분리) + plan/build 토글 |
| 출력 한도 | tool output 요약(>10건) | **bounding + managed-output-file**(법칙화) |
| 언어 | Rust | TS/Bun/Effect |
| 흡수 가치 | 사용자향 하네스 기능 | **컨텍스트·런타임 설계 rigor** |

## 8. 학습→반영 (학습→반영 루프) — backlog (즉시 헌법변경 X)

| 학습 | 반영처 후보 | 상태 |
|---|---|---|
| Mid-Conversation System Message(변경분만 diff 주입) | CLAUDE.md "주입 표면" 원칙 *심화* | ⏸ **보류** — 주입 표면 원칙이 06-17 갓 merge(미검증). 적층 회피(거버넌스 교훈). ②검증 후 재검토 |
| System Context 대수 = compaction 형식화 | [Claude Code 런타임 내부 (Layer C)](../methods/claude-code-runtime-internals.md) 참조 보강 | backlog |
| Model Tool Output bounding 법칙 | token-minimal-session-router·RTK | backlog |
| plan/build 토글·permission=policy | agent-harness 참조 | backlog |
| plugin=확장경계(core 박막화) | 스킬/하네스 분리 철학 참조 | backlog |

**과적용 가드**([Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](../methods/karpathy-guidelines.md) #2/#3): opencode=별도 도구, vault 채택 대상 X. 특히 *갓 merge 된 "주입 표면" 위에 즉시 적층 금지*(2026-06-17 거버넌스 교훈 — 미검증 규칙은 *관찰* 대상). 모든 반영은 작가 컨펌 시 patch.

## 관련
[goose — 모델독립 에이전트 하네스 (production 오픈소스 정본)](goose-agent-harness.md) · agent-harness · [Claude Code 런타임 내부 (Layer C)](../methods/claude-code-runtime-internals.md) · agent-harness-rsi-brief · [pi 코딩 에이전트 CLI](../methods/pi-coding-agent.md) · [The New SDLC With Vibe Coding (Google / Addy Osmani)](../methods/google-new-sdlc-vibe-coding.md)
