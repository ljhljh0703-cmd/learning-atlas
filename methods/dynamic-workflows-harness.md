---
created: 2026-06-15
updated: 2026-06-15
type: learning
tags: [claude-code, agent-harness, orchestration, subagents, workflow, dynamic-workflows]
source: https://claude.com/blog/a-harness-for-every-task-dynamic-workflows-in-claude-code
authors: [Anthropic]
year: 2026
category: method
---

# Dynamic Workflows — 작업마다 하네스 (Claude Code)

> ⚠️ **provisional** — 작가 명시 컨펌 전(R-04 자가박제 정정 2026-06-15). Gemini 교차검증 반영: `code.claude.com` 피싱 주장은 **환각(WebFetch 반박)**, sources URL 정당 / 이식성·세션 한계 정정.

Anthropic 공식 발표. 코딩에 최적화된 *단일 기본 하네스* 대신, Claude Code 가 작업마다 **자기 하네스를 즉석에서 직접 작성**(JavaScript 워크플로 파일)해서 격리 컨텍스트의 전문 서브에이전트를 오케스트레이션하는 기능. [Everything Claude Code (ECC) — 에이전트 harness 성능 최적화 시스템](everything-claude-code.md)·[고성능 AI 오케스트레이션 및 명령 표준 (Advanced Orchestration)](advanced-ai-orchestration.md)·[Harness AI 스타터팩: 에이전트 설계 표준 (Starter Pack)](harness-starter-pack.md)이 *커뮤니티/문서 레벨*로 하던 걸 런타임 네이티브로 끌어올린 것. 작가 북극성 agent-harness(RSI)와 직결.

## 푸는 문제 — 단일 하네스 3대 열화

- **Agentic laziness** — 부분 완료해놓고 "끝났다" 선언
- **Self-preferential bias** — 자기 산출물을 검증 시 편애
- **Goal drift** — 요약 누적되며 원래 제약·요구 소실

→ 독립 컨텍스트 서브에이전트로 분리 = fresh context 유지 + 추론 교차오염 차단. ([Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](karpathy-guidelines.md) #4 검증 기준·[SCA-Gate & Spike 1A RAG Failure Defense Specification](sca-gate-specification.md) 정신과 동형.)

## 메커니즘 (공식 docs 검증)

- 워크플로 = 서브에이전트 오케스트레이션 **JS 스크립트**. Claude 가 작성, 런타임이 *백그라운드 격리 환경*에서 실행 (세션은 계속 응답 가능). 중간결과는 *script variables*에 머물고 Claude 컨텍스트엔 최종답만 들어옴 → goal drift 방어의 기계적 근거.
- **트리거**: 프롬프트에 `ultracode` 키워드 / `/effort ultracode`(매 작업 자동 워크플로) / "use a workflow" 자연어. (v2.1.160 전 키워드는 `workflow`.) 작가의 기존 메모 "/loop·/goal"은 블로그 보조 개념 — 실제 진입은 ultracode.
- **런타임 제한**: 동시 16 agents / run 당 총 1,000 agents (runaway 방지). 단계별 다른 모델 라우팅 가능(비용 제어).
- 세션 *내* 재개 가능(완료 agent는 캐시 결과 반환). 명시적 rename/save 없이 종료하면 다음 세션 fresh — 단 **named session 은 `claude --resume <name>` 으로 컨텍스트·워크플로 재개 가능**(교차검증 정정 2026-06-15; WebFetch 공식 docs = resume/continue/fork 확인).
- 저장: `/workflows`에서 `s` → `.claude/workflows/`(repo 공유) or `~/.claude/workflows/`(개인) → `/<name>` 커맨드화. `args` 전역으로 입력 전달.
- 요구: Claude Code v2.1.154+, 유료 플랜. bundled = `/deep-research`(web fan-out→cross-check→claim voting→cited report).

## 7대 패턴 — 이식성 등급 (외주 운영 핵심)

⚠️ "7패턴"은 *블로그/커뮤니티 프레이밍*이지 공식 고정 taxonomy가 아니다(④Gate 확인). 공식 docs는 primitives(routing·parallelization·orchestrator-workers·evaluator-optimizer·agent loop + adversarial review)를 서술. 아래는 그 위에 매핑한 해체 + **외부 AI 텍스트 디스패치 이식성 등급**(작가 주력이 외주라 가장 중요):

| 패턴 | 이식성 | 작가 시스템 대응 |
|---|---|---|
| Classify-and-act | 🟢 구조 이식독립※ | 분류기→전용 프롬프트 2단 디스패치. dispatch-builder 모델 라우팅 |
| Adversarial verification | 🟢 구조 이식독립※ | 생성≠검증 프롬프트 분리 = hermes-loop ③Gate |
| Generate-and-filter | 🟢 구조 이식독립※ | 다수 초안→루브릭 선별 |
| Tournament | 🟢 구조 이식독립※ | pairwise judge + 점수표 ([고성능 AI 오케스트레이션 및 명령 표준 (Advanced Orchestration)](advanced-ai-orchestration.md) 병렬) |
| Fan-out-and-synthesize | 🟡 부분 이식 | N프롬프트 분할+수동 병합 가능. 병렬 실행·결과 변수는 런타임 의존 |
| Loop until done | 🟡 부분 이식 | 반복은 텍스트 가능. 자동 재실행·테스트·상태유지는 런타임 의존 |
| Root-cause investigation | 🟡 부분 이식 | 독립 조사 프롬프트는 이식. 격리 worktree·자동 cross-check는 런타임 의존 |

→ 🟢 4종은 (2026-06-15 평가 당시) 외부 AI(Codex/Antigravity/GPT)에 그대로 디스패치 가능 판정 — 현행 외주 로스터 = Codex/GPT(CLAUDE.md §4, Antigravity RETIRED). 🟡 3종은 "런타임 자동화"만 빠지고 *수동 오케스트레이션*으로 근사.

> ※ **이식성 한계 (교차검증 정정 2026-06-15)**: 🟢 는 프롬프트 *구조*가 모델독립 이식 가능하다는 뜻이지 *실행 정확도*까지 모델독립은 아니다. 특히 Tournament·Generate-and-filter 의 다수 후보 비교/평가는 LLM 지능(context length·self-enhancement/position bias 제어)에 의존 — **구조는 이식, 실행 품질은 모델 종속**. = agent-harness Layer A(행동·구조는 하네스로 이식, 깊은 추론은 모델 내재) 명제와 정합. "완전 모델독립"은 과장이었음.

**이식 불가(런타임 전용)**: JS script 실행·`/workflows` 진행 UI·pause/resume·캐시된 완료 agent·save-as-command·16/1000 agent 제한·worktree 격리. → 외부 위탁 시 "프롬프트 분리·컨텍스트 분리·수동 파일 격리(브랜치/patch 규칙)"로만 근사.

## 디스패치 골격 (🟢 4종 — 외주 프롬프트 빌딩블록)

- **Classify-and-act**: 역할=Router / 입력=`{request, routes, constraints}` / 검증=route 1개+confidence+fallback / 정지=confidence≥threshold면 실행, else clarify
- **Adversarial verification**: 역할=Builder→Verifier→Resolver / 입력=`{draft, rubric, must_not_violate, evidence}` / 검증=rubric별 pass/fail+severity / 정지=blocking 0 or handoff
- **Generate-and-filter**: 역할=Generator[K]→Judge→Finalizer / 입력=`{task, K, quality_bar, rubric}` / 검증=후보별 score+reject 사유 / 정지=top score≥threshold or 재생성
- **Tournament**: 역할=Candidate[K]→PairwiseJudge→Ranker / 입력=`{candidates, pairwise_rubric, tie_break}` / 검증=A/B 표+position-swap / 정지=champion or top-2 tie 보고

## Claude Code 기능 연결

- Subagents / 격리 Worktrees / Skills(워크플로 배포) / `ultracode` 트리거·`/deep-research` bundled / 단계별 모델 라우팅 / `/workflows` 관리·승인

## 근거 연구 (③Gate 검증 — arXiv 실재 확인)

- **LLM-as-a-Judge / MT-Bench** (Zheng+ 2023, arXiv:2306.05685) — pairwise judge·편향(position/verbosity/self-enhancement). → Adversarial·Generate-filter·Tournament 근거
- **Self-Consistency** (Wang+ 2022, arXiv:2203.11171) — 다중 path 샘플→일관 답. → Fan-out·Generate-filter
- **Self-Refine** (Madaan+ 2023, arXiv:2303.17651) — generator/evaluator/refiner 반복. → Loop·Adversarial
- **Multiagent Debate** (Du+ 2023, arXiv:2305.14325) — 독립 agent 논쟁 검증. → Adversarial·Root-cause
- **Tree of Thoughts** (Yao+ 2023, arXiv:2305.10601) — 후보 탐색·평가·backtracking. → Generate-filter·Tournament·Loop
- **SelfCheckGPT** (Manakul+ 2023, arXiv:2303.08896) — 샘플 불일치 기반 환각 탐지. → Fan-out·Adversarial·Root-cause

## 핵심 교훈

- 토큰 大량 소모 → *복잡·고가치* 작업에만. 전통적 코딩엔 보통 과잉
- 패턴별 *상세* 프롬프팅이 결정적
- `/loop`(반복)·`/goal`(완료 강제)와 결합
- classifier 모델 라우팅 → 작업 복잡도별 지능 할당 최적화
- 채팅만 보는 판정자(judge)에게는 "테스트 통과"만으론 불충분 — proof가 판정자 컨텍스트에 실제로 붙어야 "완료"가 claim이 아니라 proof가 된다(cf. exm7777 X Article — Fable Loop Library, via Codex teardown 2026-07-06). RETURN 증거·Codex 최종보고 관행과 동일 원리.

## 작가 시스템 응용 (2026-06 당시 — 외부 AI 운영 Codex/Antigravity 중심 · 현행 = Codex)

핵심 통찰: 패턴 추출 자체가 agent-harness RSI 의 "특정 모델 능력에서 모델 독립 하네스 추출"과 정확히 같은 작업. JS 런타임은 Claude Code 전용 — 이식성은 위 §"7대 패턴 이식성 등급" 표 참조(🟢 4종 즉시 이식, 🟡 3종 수동 근사, 런타임 전용 기능은 불가).

- **dispatch-builder에 7패턴 슬롯 주입** — 디스패치 작성 시 "이 외주는 7패턴 중 무엇인가?" 명시. Fan-out(여러 Codex 병렬)·Adversarial(Codex 산출을 별도 AI 가 루브릭 검증)·Generate-and-filter(다수 초안 후 선별).
- **hermes-loop ③Gate = Adversarial verification 의 작가판** — 외부 AI(당시 Codex/Antigravity — 현행 Codex) 산출을 *생성한 AI 와 다른 컨텍스트*가 검증하는 게 self-preferential bias 차단. 이미 운영 중인 패턴의 이론 근거 보강.
- **dual-track-review Goal drift 방어** — progress/memory 분리 운영이 요약 누적 소실 방어와 동형. `/goal` 등가 = SSOT decisions 박제.
- **격리 worktree = [Forge Spec-Gate (why-was-fable-banned) — 차용 해체](forge-spec-gate.md) worktree-accept** — 헌법 §Dual-Track #6 이미 차용한 패턴. 외부 Codex 헤드리스 실행의 안전 격리와 일치.

학습→반영 루프 반영처: dispatch-builder(7패턴 슬롯)·hermes-loop(③Gate 이론 근거). 상세 backlog 는 log 참조.

## 교차 검증 (당시 Gemini — Adversarial verification 인스턴스)

✅ **완료 (2026-06-15, Gemini → vault Claude ④Gate 선별)**. self-preferential bias 차단 위해 생성자(GPT+Claude)와 다른 컨텍스트(당시 Gemini)가 독립 검증.

- ✅ **confirm**: 7패턴=블로그 프레이밍(공식 taxonomy 아님)·근거 논문 6건 arXiv 실존·메커니즘(16/1000·script variables·저장경로) 일치.
- ⚠️ **정정 반영**: 자가박제(status confirmed→provisional, R-04)·이식성 과장(🟢 "완전 모델독립"→구조독립※, 실행은 모델의존=Layer A)·세션 fresh(named session `--resume` 재개).
- ❌ **기각 — Gemini 환각**: `code.claude.com` = "2026 초 피싱/맬웨어 도메인" 주장은 **거짓**. vault Claude WebFetch 직접 확인 = 정상 공식 Agent SDK docs(agent loop·permission 7모드·compaction·SDK 코드). Layer C 정본 [Claude Code 런타임 내부 (Layer C)](claude-code-runtime-internals.md) 출처 정당.
- **🔑 메타 교훈**: *검증자(Adversarial)도 환각한다*. 검증자의 강한 주장(특히 "피싱/보안")일수록 1차 출처로 재-③Gate 필수. = 본 페이지가 서술한 패턴의 자기적용(self-preferential bias 차단)이 검증자에게도 적용됨. [Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](karpathy-guidelines.md) #1.

채점 누적: EVAL (GPT↔Gemini A/B).
