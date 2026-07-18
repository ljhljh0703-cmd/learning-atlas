---
created: 2026-06-11
updated: 2026-06-13
type: learning
tags: [fable-5, prompting, scaffolding, agent-harness, rsi, model-operation]
source: https://platform.claude.com/docs/ko/build-with-claude/prompt-engineering/prompting-claude-fable-5
authors: [Anthropic]
year: 2026
category: method
---

<!-- Anthropic 공식 Fable 5 프롬프팅 가이드 흡수 — 작가의 모든 AI(Codex/Claude — 작성 당시 Gemini 포함) 운영에 적용 가능한 ground truth. research-relay ④Gate에서 GPT 누락분을 vault Claude가 WebFetch 직접 확인·흡수. -->

# Fable 5 프롬프팅 (공식 가이드)

> **한줄**: Anthropic이 공개한 Claude Fable 5 고유 프롬프팅·스캐폴딩 패턴. agent-harness의 **ground truth** — 우리가 Fable 산출에서 역추출한 하네스가 이 공식 원천과 수렴함을 확인(RSI 검증). 작가의 *모든 AI* 운영에 적용.
> **출처 신뢰도**: ✅ 본문(§동작 차이·§프롬프팅 패턴·§스캐폴딩)은 Anthropic 공식 docs 만. 하단 §"비공식 유출본 분석 및 공식 캘리브레이션"은 *명시 fenced* leak-candidate **대조군**(절대 원천 아님, caveat 유지) — 공식 본문과 구분해 흡수(2026-06-13 패치 merge).
> **흡수 경로**: research-relay GPT 외주가 본 가이드 누락 → vault Claude WebFetch 직접 확인·④Gate.

## Fable 5 동작 차이 (Opus 4.8 대비, 공식)
- **장기 자율성**: 며칠 규모 목표지향 실행을 지시 유지력 강하게 완수.
- **첫 시도 정확성**: 이전엔 며칠 반복하던 시스템을 단일 패스로 구현(초기 테스터 보고).
- **비전·모호성 탐색·위임**: 밀집 기술 이미지 해석↑, 다중스레드 모호 요청에서 다음 단계 결정 우수, 병렬 서브에이전트 디스패치·유지 신뢰성↑.

## 프롬프팅 패턴 (공식 권장 지시문 및 적용 맥락)

Fable 5의 성능을 제어하기 위해 시스템 프롬프트 및 에이전트 하네스에 주입하는 공식 프롬프팅 패턴 지시어 전문. (번호 = 하류 §대조/§적용처가 참조하는 안정 ID.)

### 1. 과계획 및 중복 추론 억제 (Suppress Over-planning)
-  **적용 배경**: 작업이 모호하거나 긴 세션이 진행될 때 에이전트가 과도한 계획이나 불필요한 대화 서사를 생성하여 자원을 낭비하는 현상을 방지합니다.
-  **공식 지시문**:
   ```text
   When you have enough information to act, act. Do not re-derive facts already established in the conversation, re-litigate a decision the user has already made, or narrate options you will not pursue in user-facing messages. If you are weighing a choice, give a recommendation, not an exhaustive survey. This does not apply to thinking blocks.
   ```

### 2. 과설계 및 불필요한 리팩토링 차단 (Prevent Over-engineering)
-  **적용 배경**: 높은 effort 설정에서 일상 작업을 수행할 때 요구사항 밖의 오버 엔지니어링이나 불필요한 예외 처리를 구현하려는 현상을 억제합니다.
-  **공식 지시문**:
   ```text
   Don't add features, refactor, or introduce abstractions beyond what the task requires. A bug fix doesn't need surrounding cleanup and a one-shot operation usually doesn't need a helper. Don't design for hypothetical future requirements: do the simplest thing that works well. Avoid premature abstraction and half-finished implementations. Don't add error handling, fallbacks, or validation for scenarios that cannot happen. Trust internal code and framework guarantees. Only validate at system boundaries (user input, external APIs). Don't use feature flags or backwards-compatibility shims when you can just change the code.
   ```

### 3. 결과물 우선 보고 및 가독성 확보 (Outcome-First & Concise)
-  **적용 배경**: 모델이 챗창이나 PR 설명 등에서 근본 원인이나 다음 단계 계획을 지나치게 나열하는 현상을 줄이고 결과 위주로 단순 명확하게 소통하도록 강제합니다.
-  **공식 지시문**:
   ```text
   Lead with the outcome. Your first sentence after finishing should answer "what happened" or "what did you find": the thing the user would ask for if they said "just give me the TLDR." Supporting detail and reasoning come after. Being readable and being concise are different things, and readability matters more.

   The way to keep output short is to be selective about what you include (drop details that don't change what the reader would do next), not to compress the writing into fragments, abbreviations, arrow chains like A → B → fails, or jargon.
   ```

### 4. 사용자 일시 중지 및 체크포인트 동작 (Human-in-the-Loop Gates)
-  **적용 배경**: 불필요한 단순 확인용 질문으로 에이전트 루프가 멈추는 것을 방지하되, 진짜 사용자의 개입이 필요한 경계선을 선언합니다.
-  **공식 지시문**:
   ```text
   Pause for the user only when the work genuinely requires them: a destructive or irreversible action, a real scope change, or input that only they can provide. If you hit one of these, ask and end the turn, rather than ending on a promise.
   ```

### 5. 진행 상황 주장의 실물적 근거 확보 (Audit Progress Against Tools)
-  **적용 배경**: 장기 자율 실행 중에 에이전트가 가상으로 진행 상황을 거짓 보고(Hallucinated status)하는 현상을 방지합니다.
-  **공식 지시문**:
   ```text
   Before reporting progress, audit each claim against a tool result from this session. Only report work you can point to evidence for; if something is not yet verified, say so explicitly. Report outcomes faithfully: if tests fail, say so with the output; if a step was skipped, say that; when something is done and verified, state it plainly without hedging.
   ```

### 6. 문제 진단과 수정의 경계 명시 (Assessment vs Fix)
-  **적용 배경**: 사용자가 아이디어를 브레인스토밍하거나 문제를 질문할 뿐인데 임의로 코드를 수정해 버리는 오버액션을 제한합니다.
-  **공식 지시문**:
   ```text
   When the user is describing a problem, asking a question, or thinking out loud rather than requesting a change, the deliverable is your assessment. Report your findings and stop. Don't apply a fix until they ask for one. Before running a command that changes system state (restarts, deletes, config edits), check that the evidence actually supports that specific action. A signal that pattern-matches to a known failure may have a different cause.
   ```

### 7. 병렬 서브에이전트 비동기 디스패치 (Parallel Subagents)
-  **적용 배경**: 병렬 서브 태스크를 디스패치할 때 메인 루프가 블로킹되지 않도록 제어합니다.
-  **공식 지시문**:
   ```text
   Delegate independent subtasks to subagents and keep working while they run. Intervene if a subagent goes off track or is missing relevant context.
   ```

### 8. 메모리 노트 수립 규칙 (Memory Systems)
-  **적용 배경**: 세션 간의 교훈과 확인된 접근법을 중복 없이 로컬 지식으로 아카이브하도록 강제합니다. (우리의 Sub-brain memory 컨벤션과 일치함)
-  **공식 지시문**:
   ```text
   Store one lesson per file with a one-line summary at the top. Record corrections and confirmed approaches alike, including why they mattered. Don't save what the repo or chat history already records; update an existing note rather than creating a duplicate; delete notes that turn out to be wrong.
   ```

### 9. 과거 세션 복원을 통한 메모리 부트스트랩 (Memory Bootstrapping)
-  **적용 배경**: 이전 대화 세션을 검토하여 핵심 테마를 추출해 메모리 파일에 적재하게 만듭니다.
-  **공식 지시문**:
   ```text
   Reflect on the previous sessions we've had together. Use subagents to identify core themes and lessons, and store them in [X]. Make sure you know to reference [X] for future use.
   ```

### 10. 조기 중단 및 의지 표명 방지 (Prevent Premature Halting)
-  **적용 배경**: 도구 실행 없이 텍스트로만 "X 하겠습니다" 하고 턴을 끝내는 행위나 불필요한 권한 확인으로 블로킹되는 현상을 차단합니다.
-  **공식 지시문**:
   ```text
   You are operating autonomously. The user is not watching in real time and cannot answer questions mid-task, so asking "Want me to…?" or "Shall I…?" will block the work. For reversible actions that follow from the original request, proceed without asking. Offering follow-ups after the task is done is fine; asking permission after already discussing with the user before doing the work is not. Before ending your turn, check your last paragraph. If it is a plan, an analysis, a question, a list of next steps, or a promise about work you have not done ("I'll…", "let me know when…"), do that work now with tool calls. End your turn only when the task is complete or you are blocked on input only the user can provide.
   ```

### 11. 컨텍스트 임계 예산에 따른 요약 및 조기 종료 금지 (Context Amnesia Prevention)
-  **적용 배경**: 에이전트에 남은 토큰 카운트다운을 표시할 때 임의로 산출물을 압축하거나 새 세션을 권유하는 현상을 차단합니다.
-  **공식 지시문**:
   ```text
   You have ample context remaining. Do not stop, summarize, or suggest a new session on account of context limits. Continue the work.
   ```

### 12. 목적 및 이유 기반 맥락 제공 (Goal Context Injection)
-  **적용 배경**: 장기 에이전트의 다중 작업 스트림 연동 시, 요청에 담긴 본질적인 목적과 활용처를 이해시켜 결과의 품질을 높입니다.
-  **공식 지시문**:
   ```text
   I'm working on [the larger task] for [who it's for]. They need [what the output enables]. With that in mind: [request].
   ```

### 13. 최종 보고서 작성 시 속어 필터링 (Format Re-grounding)
-  **적용 배경**: 도구 호출 과정에서 썼던 내부 구현 용어나 약어 체인을 배제하고, 첫머리에 TLDR을 둔 정형 문장으로 재구성합니다.
-  **공식 지시문**:
   ```text
   Terse shorthand is fine between tool calls (that's you thinking out loud, and brevity there is good). Your final summary is different: it's for a reader who didn't see any of that.

   If you've been working for a while without the user watching (overnight, across many tool calls, since they last spoke), your final message is their first look at any of it. Write it as a re-grounding, not a continuation of your working thread: the outcome first, then the one or two things you need from them, each explained as if new. The vocabulary you built up while working is yours, not theirs; leave it behind unless you re-introduce it.

   When you write the summary at the end, drop the working shorthand. Write complete sentences. Spell out terms. Don't use arrow chains, hyphen-stacked compounds, or labels you made up earlier. When you mention files, commits, flags, or other identifiers, give each one its own plain-language clause. Open with the outcome: one sentence on what happened or what you found. Then the supporting detail. If you have to choose between short and clear, choose clear.
   ```

> **+ effort 레벨** (지시문 아님, 설정값 — 보강 교체 시 보존): high 기본 / xhigh 최난도 / medium·low 일상. Fable의 low도 종종 이전 모델 xhigh 능가. 너무 오래 걸리면 effort↓. (§대조 N-2 참조원.)

## 스캐폴딩 변경 사항 (공식 권장 Scaffolding Architecture)

Fable 5의 확장 추론 루프와 결합하여 최상의 시너지를 내기 위한 에이전트 스캐폴딩(하네스) 설계 가이드라인.

1.  **난이도 최상단 위임**: 이전 모델에 할당했을 작업보다 더 무거운 전체 시스템 설계 및 모호성 해결을 에이전트에게 처음부터 맡겨 성능 범위를 활용합니다.
2.  **검증자 서브에이전트 아키텍처 (Validator Subagents)**: 자기비평(Self-criticism) 방식은 편향되기 쉬우므로, 독립된 새로운 컨텍스트를 가진 검증용 서브에이전트를 주기적으로 작동시켜 스펙 만족 여부를 체크합니다.
    - *지시문 예시*: `Establish a method for checking your own work at an interval of [X] as you build. Run this every [X interval], verifying your work with subagents against the specification.`
3.  **이전 프롬프트 및 규범적 스킬의 리팩토링**: 이전 모델(Opus 4.8 등)을 제어하기 위해 규범적으로 장황하게 나열했던 지시어들을 대폭 제거하여 Fable 5 고유의 자율 추론을 억제하지 않도록 프롬프트를 단순화합니다.
4.  **응답 내 추론(Reasoning) 재현 지시 금지** ⚠: Fable 5의 structured thinking 블록에 적힌 사고 과정을 답변으로 다시 반복, 전사하게 만들면 `reasoning_extraction` 거절 카테고리가 트리거되어 Opus 4.8로의 폴백이 증가할 수 있습니다(공식: "fallback ... may increase" — *필연·강제 아님*). 사용자 가시성이 필요할 경우 API 응답의 thinking 필드를 직접 읽고, 사용자 알림은 `send_to_user` 도구를 경유하게 설계합니다. (cf. 하단 §"비공식 유출본 분석" §1 — leak 본문엔 `reasoning_extraction` 문자열 미발견. 본 항은 공식 가이드 기준.)
5.  **`send_to_user` 도구의 공식 배선**: 장기 비동기 에이전트 구동 중 턴을 넘기지 않고 사용자에게 렌더링된 메인 콘텐츠를 보여주기 위해 아래 스펙의 클라이언트 측 도구를 반드시 하네스에 배선합니다.
    - *도구 스키마*:
      ```json
      {
        "name": "send_to_user",
        "description": "Display a message directly to the user. Use this for progress updates, partial results, or content the user must see exactly as written before the task finishes.",
        "input_schema": {
          "type": "object",
          "properties": {
            "message": {
              "type": "string",
              "description": "The content to display to the user."
            }
          },
          "required": ["message"]
        }
      }
      ```

## agent-harness 대조 (RSI ground truth)
**수렴 확정** (역추출 ↔ 공식 일치): 과계획 억제(패턴 #1) · 과설계 기각(패턴 #2 ↔ H-09) · 진행 근거/정직(패턴 #5 ↔ H-12) · 메모리 규율(패턴 #8) · 체크포인트/일시중지(패턴 #4·#10). → 행동 관찰로 뽑은 하네스가 공식과 맞음.
**하네스 신규 후보** (공식엔 있고 v0엔 약한 것): effort 레벨(N-2, 위 §패턴 effort 보존 노트) · 검증자 서브에이전트(스캐폴딩 #2) · reasoning 재현 금지(스캐폴딩 #4 refusal 가드) · 이유 제공(패턴 #12) · 가독성·최종보고(패턴 #3·#13) · send_to_user 배선(스캐폴딩 #5). → agent-harness v1 §공식 대조에 반영.

## 적용처 (Sub brain 운영)
- **모든 AI 운영**: 위 패턴은 Codex/Claude 디스패치 프롬프트에 직접 적용 가능(작성 당시 Gemini 포함 — RETIRED 2026-07-04)(특히 패턴 #6 경계명시(assessment vs fix)·#5 진행근거·#4·#10 체크포인트는 외부 에이전트 RETURN 품질↑).
- **하네스 진화**: v1 보강 입력(공식 대조).
- 본 vault CLAUDE.md(작성 당시 GEMINI.md 포함 — RETIRED) 운영 규칙과 상당 부분 이미 정합(메모리·정직보고·과계획억제) — 공식 확증.

---

## 비공식 유출본 분석 및 공식 캘리브레이션 (Fable 5 Leak & Calibration Analysis)

> ⚠️ **대조군 한정**: 본 섹션은 비공식 leak-candidate 분석. 위 본문(공식 docs)과 신뢰도가 다름. *절대 원천 아님* — `consumer Claude/Fable prompt leak candidate`로 분류해 대조군으로만 활용. Track 0 반영분은 agent-harness §"비공식 leak 대조군" 참조.
>
> **✅ UPDATE 2026-06-15**: §4(권한/샌드박스)·§5(compaction 공식표면)·§6(MCP/세션)의 *런타임 내부*는 Layer C 외주 ④Gate 에서 **공식 docs 확증** → 정본 이관 [Claude Code 런타임 내부 (Layer C)](claude-code-runtime-internals.md). 본 섹션은 leak 대조군 *역사*로 보존. 단 §5 5단계 명칭은 **2026-06-15 본문 확정**(arXiv 2604.14228 GPT ④Gate → [Claude Code 런타임 내부 (Layer C)](claude-code-runtime-internals.md) B1 정본), 단계별 토큰 임계치·중요도 공식·summarizer 모델은 *본문에도 부재*(생성 금지). `send_to_user`(§스캐폴딩 #5)는 *CLI 빌트인 아님* — Fable 프롬프팅 가이드 권고 클라이언트 측 도구(code.claude.com CLI docs 미수록).

최근 식별된 비공식 Fable 5 시스템 프롬프트 유출본(leak candidate)과 공식 Agent SDK 사양을 교차 분석하여 정밀 교정한 행동 하네스 모델 대조군 자료입니다.

### 1. 프롬프트의 분류학적 한계 (Taxonomy Caveat)
-  **분석 대상**: GitHub 렌더링 기준 `CLAUDE-FABLE-5.md`는 1585 lines / 117 KB 크기이며, 제목은 "Claude Fable 5 — System Prompt"로 되어 있음.
-  **⚠ 수치 불일치 (research-relay GPT ④Gate 2026-06-14)**: GPT 가 raw(main)에서 실측한 줄 수는 **258줄**(위 1585/117KB 와 불일치 — 둘 다 ground-truth 검증 X). storage 한도도 GPT 는 값<5MB·키<200자로 읽음(아래 §3 "20MB" 와 불일치 — 아티팩트 총량 vs 값당 별개 지표 가능성). 한편 성격 판정(Cowork/Artifacts/computer-use 런타임 leak)·`reasoning_extraction` 미발견·`compaction`/`bypassPermissions`/sandbox 가 *이 파일엔* 부재인 점은 GPT 독립 재확증. 출처 EVAL.
-  **포함 섹션**: `refusal_handling`, `mcp_app_suggestions`, `computer_use`, `Tool Definitions`, `anthropic_api_in_artifacts` ("Claudeception") 등.
-  **정정 사항**: 해당 파일 검색상 `reasoning_extraction` 문자열은 직접 발견되지 않음.
-  **분류학적 성격**: 이 유출본은 Claude Code CLI 전용 시스템 프롬프트가 아니라, **Claude Web/Cowork 제품 런타임 프롬프트(Claude product runtime prompt)**에 가깝습니다. 따라서 이를 공식 Claude Code의 절대적 원천으로 확정하지 않고, `consumer Claude/Fable prompt leak candidate`로 분류하여 대조군으로만 활용합니다.

### 2. Refusal Handling 대안: 안전한 고자율 코딩 프롬프트 템플릿
유출본의 거절 처리(refusal_handling)는 위험 주제에서 "짧게 답하는 것이 안전하다"는 지침과 무기, 악성코드, 불법 약물 등의 협조 금지 기조를 보입니다. 가드라인을 우회하려는 시도 대신 범위와 권한을 투명하게 정의한 안전한 고자율 실행 프롬프트를 사용하는 것이 권장됩니다. 이는 공식 Agent SDK의 allowed_tools, permission mode, hook 등과 정합합니다.

#### 고자율 코딩 프롬프트 템플릿
*   **목표**: 이 저장소에서 <구체적 기능/버그>를 수정한다.
*   **보안 한계**: 보안 우회, credential 접근, 외부 시스템 변경, 파괴적 명령(destructive command)은 수행하지 않는다.
*   **권한 범위**:
    *   **읽기**: 전체 repo 파일 읽기 허용.
    *   **쓰기**: <허용 경로> 안의 소스/테스트 파일 수정 허용.
    *   **실행**: test/lint/typecheck 명령만 허용.
    *   **금지**: `.env`, secrets, credential, production config, 파괴적 shell 명령, 외부 네트워크 side effect.
*   **작업 루프**:
    1.  관련 파일을 찾아 변경 계획을 짧게 세운다.
    2.  최소 수정으로 구현한다.
    3.  테스트를 실행한다.
    4.  실패하면 실패 로그를 근거로 한 번씩 수정한다.
    5.  최종 diff, 테스트 결과, 남은 리스크를 보고한다.
*   **중단 조건**:
    *   권한 밖 파일/명령이 필요하면 즉시 작업을 멈추고 이유를 소상히 밝힌다.
    *   요구사항이 안전/법적/보안상 위험하면 즉시 멈추고 안전한 대안을 제안한다.

### 3. Claudeception 상태 직렬화 및 스토리지 API
Fable 유출본의 `Claudeception` 섹션은 Artifacts 내부에서 API key를 제공하지 않고 Anthropic `/v1/messages` endpoint를 호출하는 런타임 보안 및 상태 관리 규격을 설명합니다.

#### 상태 직렬화와 재주입 (State Re-injection)
-  **무상태성(Stateless) 극복**: Claude는 기본적으로 API 호출 간에 메모리가 없으므로, 외부 호스트 아티팩트가 상태(appState)를 보존하고 매 request 호출 시마다 user content에 주입하여 상태를 유지합니다.
-  **상태 직렬화 스키마 규격**:
    ```typescript
    type StatefulArtifactRequest = {
      appState: Record<string, unknown>;
      conversationHistory: Array<{
        role: "user" | "assistant";
        content: string;
      }>;
      lastAction: {
        type: string;
        payload?: Record<string, unknown>;
      };
      responseContract: {
        updatedState: "object";
        actionResult: "string";
        availableActions: "array";
      };
    };
    ```

#### Artifact 영속성 스토리지 API (Persistent Storage)
-  **스토리지 API 스펙**: Stateful Artifact 앱 내에서 영속 저장을 위해 `window.storage.get`, `window.storage.set`, `window.storage.delete`, `window.storage.list`를 사용하며, 반환 형태는 `{key, value, shared}` 구조를 가집니다.
-  **제약 사항**: Published artifact 기준으로 20MB의 용량 제한이 적용되며, personal/shared storage 영역이 물리적으로 분리됩니다. 동시성 제어는 Last-write-wins 방식을 따릅니다.
-  **보안/인증**: API key를 아티팩트 코드에 노출하는 것은 엄격히 금지됩니다. 호스트 런타임이 사용자의 Claude 계정 인증을 바탕으로 인프라 단에서 요청을 중계 및 처리합니다. (내부 프록시 헤더 명칭이나 세션 토큰 스펙은 보안 사항으로 비공개입니다.)

### 4. allowedTools 와일드카드 및 샌드박스 권한 규격
공식 Agent SDK의 도구 권한 심사 엔진은 `deny -> ask -> allow` 순서로 룰을 평가하며, `deny`가 항상 최우선권을 가집니다. 이 제어는 모델 내부가 아닌 Claude Code CLI/SDK 단에서 수행됩니다.

#### 권한 와일드카드 규칙
-  **명령어 패턴**: `Bash(foo:*)`와 같이 특정 명령어 접두사(prefix) 패턴을 허용할 수 있습니다. 단, compound shell command(연결된 다중 명령)는 개별 서브 명령으로 쪼개져 각각 평가됩니다.
-  **MCP 도구**: `mcp__<server>__<tool>` 형태로 네이밍을 평가하므로, `allowedTools`에 `mcp__github__*` 형태로 와일드카드를 주어 신뢰 서버 도구를 자동 승인할 수 있습니다.
-  **경로 패턴**: 읽기/쓰기 경로 규칙(Read/Edit path rules)은 `.gitignore`와 유사한 glob 패턴 형식을 사용합니다. 단, allow의 unanchored glob은 제한됩니다.

#### bypassPermissions의 실체와 샌드박스 메커니즘
-  **bypassPermissions**: 이 옵션은 OS 수준의 안전한 샌드박스를 자동 구축하는 기능이 아니라, 단순히 **모든 도구 실행 시 사용자 권한 확인 프롬프트를 생략**하는 권한 우회 모드입니다. 따라서 공식 문서는 반드시 격리된 환경에서만 이 옵션을 활성화할 것을 강력히 권고합니다.
-  **OS 수준 샌드박스**: 실질적인 격리 장치는 운영체제 단에서 구현됩니다. macOS에서는 Seatbelt 샌드박스가 사용되며, Linux/WSL2 환경에서는 bubblewrap와 socat 프록시 결합을 사용합니다. 추가적으로 `@anthropic-ai/sandbox-runtime` 패키지를 통해 seccomp 필터링을 선택 적용할 수 있습니다. 네트워크 프록시는 TLS를 복호화하거나 내용을 검사하지 않고 터널링만 중계합니다.
-  **내부 ML Classifier**: Auto mode 구동 시 단순 룰 외에 transcript classifier 등이 조합되어 shell command, external fetch, project 외부 파일 조작의 파괴성 여부를 분류 단계(yes/no)와 추론 단계를 거쳐 평가합니다. (우회 가능한 세부 regex/keyword 룰셋은 비공개 영역입니다.)

### 5. Compaction 휴리스틱 및 5-Layer Pipeline
컨텍스트 윈도우가 한계에 다다르면 SDK는 대화 이력을 요약하여 공간을 확보하고 stream에 `compact_boundary` (type: "system", subtype: "compact_boundary") 메시지를 기록합니다.

#### 공식 컴팩션 및 CLAUDE.md 가이드라인
-  **요약 순서**: 토큰 압박 시 오래된 도구 출력(tool outputs)을 가장 먼저 지우거나 축소한 뒤, 대화 히스토리(conversation history) 요약 단계로 넘어갑니다.
-  **수동/자동 제어**: `DISABLE_AUTO_COMPACT=1`, `DISABLE_COMPACT=1` 환경변수가 존재하며, 수동 압축 명령어인 `/compact` 및 `PreCompact` hook이 지원됩니다.
-  **PreCompact Hook 스펙**:
    ```json
    {
      "hook_event_name": "PreCompact",
      "trigger": "manual | auto",
      "custom_instructions": "string | null"
    }
    ```
-  **CLAUDE.md 보존 지시어**: 요약 과정에서 핵심 컨텍스트 손실을 방지하기 위해 다음과 같은 지시어를 `CLAUDE.md`에 정의하여 주입합니다.
    ```markdown
    # Summary instructions

    When summarizing this conversation, always preserve:
    - Current task objective and acceptance criteria.
    - Files read, files modified, and why.
    - Test commands run and exact failures.
    - Decisions made and the reasoning behind them.
    - Open TODOs and blocked items.
    - User constraints, forbidden paths, and permission boundaries.
    ```

#### 비공식 5-Layer Compaction 파이프라인 분석
소스코드 정밀 디컴파일 연구를 통해 제안된 컴팩션 5단계 파이프라인의 후보 메커니즘입니다. (실제 가동 토큰 퍼센트 임계치와 내부 중요도 스코어링 공식, 요약 전용 백그라운드 모델 정보 등은 비공개 상태입니다.)
1.  **Budget reduction**: 개별 tool result 크기 제한 및 대용량 출력을 content reference나 요약으로 치환.
2.  **Snip**: 오래된 history segment를 통째로 잘라내고 boundary message를 삽입.
3.  **Microcompact**: 캐시 상태와 결합하거나 시간 기준의 미세 압축을 수행하여 pending cache edits 등을 처리.
4.  **Context collapse**: Read-time projection을 구축하여 transcript 원본은 append-only로 두고 메모리 상에 가상 뷰(virtual view)를 투사.
5.  **Auto-compact**: 최후의 수단으로 `compactConversation`을 실행하여 의미적 요약을 생성하고 `PreCompact` hook 실행 후 boundary + summary + retained messages로 스트림을 재구성. (비공식 코드상 포스트 컴팩션 예산은 약 50k tokens, 개별 파일/스킬당 5k tokens 제한이 보임.)

### 6. MCP 동적 라우팅 및 세션 관리
Fable 유출본의 MCP 라우팅 규칙과 공식 세션 관리 스펙입니다.

#### MCP 동적 라우팅 5단계
1.  **사용자 지정**: 사용자 발화에 특정 connector 이름이 포함되었으면 즉시 해당 connector 도구를 사용 허용.
2.  **직전 턴 선택**: 바로 직전 turn에서 사용자가 해당 connector를 명시적으로 선택했으면 사용 허용.
3.  **durable preference**: 아티팩트 첫 실행 또는 이전 세션에서 저장된 사용자 동의 preference가 있다면 직접 호출 허용. (preference는 published artifact의 local cache나 server-side account setting에 지속되나, 저장 포맷은 비공개임.)
4.  **자동 추천**: MCP App이 도움을 줄 수 있다면 `search_mcp_registry(keywords)`로 레지스트리를 검색한 후 `suggest_connectors`를 호출하여 사용자 동의 프롬프트를 띄움.
5.  **동의 거절 시**: 사용자가 제안을 무시했거나 명시적으로 None을 선택했다면, 동일한 제안을 반복하지 않고 일반 tool/browser/대화로 폴백함.

#### 공식 도구 세트 제어 및 세션 스키마
-  **도구 지연 로딩**: 대규모 MCP 도구 사용 시 컨텍스트 낭비를 최소화하기 위해 `tool_search`가 기본 활성화되며 필요한 도구 정의만 매 턴 동적으로 주입합니다.
-  **세션 영속성**: Claude Code CLI는 세션 상태를 `~/.claude/projects/` 디렉토리 하위에 JSONL 형태로 보존하여, resume/fork/checkpoint 기능을 통한 영속적인 세션 복원을 지원합니다.
