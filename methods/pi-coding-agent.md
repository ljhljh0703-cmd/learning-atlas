---
created: 2026-05-27
updated: 2026-05-27
type: learning
tags: [coding-agent, cli, harness, extensions, skills, typescript, badlogic]
source: https://github.com/earendil-works/pi/tree/main/packages/coding-agent/docs
---

<!-- pi 코딩 에이전트 CLI (earendil-works) — 미니멀 코어 + TypeScript 확장 모델 학습 노트 -->

> ⚠️ **임시 (provisional)** — Claude 가 작성, 작가 컨펌 전. 사실 검토 후 `status: confirmed` 로 전환.

# pi 코딩 에이전트 CLI

[earendil-works/pi](https://github.com/earendil-works/pi) (55k★, 2026-05 기준) 의 `packages/coding-agent` docs 정리. badlogic (Mario Zechner, libgdx 창시자) 의 *미니멀 + self-extensible* 코딩 에이전트 harness.

## 한 줄 요약

> 작은 코어 + TypeScript 확장 + Agent Skills 표준 + 세션 트리 + 멀티프로바이더. Claude Code / Codex CLI 의 *대안 harness* 이자 *재료*.

## 포지셔닝 — Claude Code / Codex CLI 와의 차이

| 축 | Claude Code | Codex CLI | **pi** |
|---|---|---|---|
| 코어 사이즈 | 닫힌 큰 코어 | 닫힌 중간 | **작은 코어** (의도적) |
| 확장 모델 | hooks / skills / commands | AGENTS.md + 제한적 | **TypeScript 확장 (jiti, 무컴파일)** + skills + commands + 테마 + 패키지 |
| 스킬 표준 | 독자 형식 | 독자 형식 | **[Agent Skills 표준](https://agentskills.io/specification)** 준수 (관대 모드) |
| 타 harness 스킬 호환 | X | X | **`~/.claude/skills`, `~/.codex/skills` 직접 로드** |
| 프로바이더 | Anthropic 전용 | OpenAI 전용 | **다중** (Anthropic / OpenAI / Google / Copilot 구독 + API 키) |
| 세션 구조 | 선형 | 선형 | **트리** (`/tree`, `/fork`, `/clone`, 브랜치 요약) |
| 컨텍스트 파일 | CLAUDE.md | AGENTS.md | **AGENTS.md + CLAUDE.md 양쪽 호환** |
| 프로그램 통합 | SDK 부분 | 제한 | **SDK + RPC (stdin/stdout JSONL) + JSON event stream** 3 종 |

## 차용 가능한 *고유* 메커니즘

### 1. Agent Skills 표준 + cross-harness 호환
- pi 는 [agentskills.io](https://agentskills.io) 표준 구현 (단 `name == 디렉토리명` 규칙은 관대 — *공유 스킬 디렉토리에 부적합* 이라는 이유로 의도적 위반)
- settings.json 의 `skills: ["~/.claude/skills", "~/.codex/skills"]` 로 작가의 글로벌 스킬 무수정 재사용
- 작가 시사점: [Hermes Agent — Nous Research 자가개선형 에이전트 플랫폼](../techniques/hermes-agent.md) §8 자가성장 스킬 + Apify Agent Skills 패턴과 *직접 정합*. 본 vault `~/.claude/skills/` 의 graphify·verify·loop·schedule 등이 *별도 harness 에서도 그대로 동작*

### 2. TypeScript 확장 (jiti 런타임, 무컴파일)
- `~/.pi/agent/extensions/*.ts` 자동 발견, `/reload` 핫 리로드
- 이벤트 가로채기 + 커스텀 도구 + 커스텀 UI + 세션 영속 상태 + 슬래시 커맨드 + 단축키 모두 한 모듈에서
- 작가 시사점: Claude Code hooks 보다 *프로그래밍 가능성* 훨씬 높음. 시간 가치 ÷ 학습 비용 = ?

### 3. 세션 트리 (`/tree`)
- 대화가 *선형* 이 아니라 *트리* — 임의 노드로 점프해 분기, 버린 가지는 자동 요약
- `/fork` (이전 사용자 메시지에서 새 세션) vs `/clone` (현재 활성 브랜치 복제) 구분
- 작가 시사점: design-journal 의 *기각된 매력* 메타데이터 보존과 동일 사상. 본 vault 의 결정 분기 추적 패턴이 *대화 레벨* 로 내려간 사례

### 4. RPC 모드 (stdin/stdout JSONL)
- 프로세스 통합용. `--mode rpc` 로 다른 도구가 pi 를 *서브에이전트* 로 운용
- 작가 시사점: Codex / Claude Code 를 외부에서 *제어* 하는 표준 인터페이스 (`Hermes` / `OpenHands` 와 결합 가능성)

### 5. pi 패키지 시스템
- 확장 + 스킬 + 프롬프트 템플릿 + 테마를 *npm/git* 으로 배포 (`pi install npm:@foo/bar` / `git:github.com/user/repo@v1`)
- `package.json` 의 `pi.skills` 엔트리로 스킬 자동 등록
- 작가 시사점: [Apify Agent Skills](apify-agent-skills.md) + [Hyperframes — HTML→Video 결정론적 렌더링 프레임워크](../techniques/hyperframes.md) (14 skills + 5 종 agent-first 운영) 의 *배포 백본* 후보

### 6. 공급망 hardening (별도 정책)
- `save-exact=true` + `min-release-age=2` (같은 날 의존성 릴리스 자동 회피)
- `package-lock.json` 을 *ground truth* 로, `--ignore-scripts` 기본
- 매주 `npm audit --omit=dev` + `npm audit signatures --omit=dev` 자동
- 작가 시사점: *AI 코딩 에이전트* 가 npm 생태 공격면이 큰 만큼 본 패턴은 [보안 및 DB 아키텍처 가이드라인 (Security & DB Guidelines)](security-db-guidelines.md) 후속 검토 자료

### 7. OSS 세션 공개 문화 (`pi-share-hf`)
- `/share` 로 세션을 *비공개 GitHub gist* + 공유 가능한 HTML 링크
- `pi-share-hf` 로 [Hugging Face](https://huggingface.co/datasets/badlogicgames/pi-mono) 데이터셋 공개 — *진짜 작업* 의 도구 사용·실패·복구 trajectory 를 *벤치마크 대안* 으로 축적
- 작가 시사점: [Hermes Agent — Nous Research 자가개선형 에이전트 플랫폼](../techniques/hermes-agent.md) §trajectory 학습과 동일 사상. AI NPC 학습 데이터 후보 (단 *작가 자신의* vault 작업은 비공개 유지)

## 관련 (cross-link)

- [Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](karpathy-guidelines.md) — pi 의 "minimal core, extend by composition" 사상은 #2 Simplicity 와 정합
- [Everything Claude Code (ECC) — 에이전트 harness 성능 최적화 시스템](everything-claude-code.md) — Claude Code harness 성능 시스템과 *대조군*
- [OpenAI Codex CLI — 로컬 에이전틱 코딩 엔진](openai-codex-cli.md) · [Codex CLI Prompting — 내재화 노트](codex-cli-prompting.md) — Codex CLI 와 직접 비교
- [free-claude-code — Claude Code를 대체 LLM 프로바이더로 라우팅하는 프록시](free-claude-code.md) — LLM 프로바이더 라우팅 프록시 (pi 의 다중 프로바이더와 다른 접근)
- [Harness AI 스타터팩: 에이전트 설계 표준 (Starter Pack)](harness-starter-pack.md) — harness 4 대 원칙
- [Apify Agent Skills](apify-agent-skills.md) — Agent Skills 표준의 또 다른 구현
- [Hermes Agent — Nous Research 자가개선형 에이전트 플랫폼](../techniques/hermes-agent.md) — 자가개선 스킬 + 멀티플랫폼 게이트웨이
- [Ouroboros — Spec-First Agent OS](ouroboros.md) — 멀티 모드 사고 (pi 확장으로 구현 가능)
- [AI Employee Obsidian Stack — 파운더 운영 자동화 5피스 (2026-05-15 archive)](ai-employee-obsidian-stack.md) — Obsidian + AI 자동화 스택의 *터미널 harness* 대안
- [CodeGraph — AI 코딩 에이전트용 코드 지식 그래프 MCP 서버](codegraph.md) — pi 확장으로 codegraph MCP 연동 자연스러움
- [Warp Terminal — 에이전틱 터미널 환경](warp-terminal.md) · [browser-harness — LLM 에 Chrome CDP 직결, 에이전트가 스스로 자라는 thin harness](browser-harness.md) — 다른 에이전틱 환경

## 작가에게 *지금* 의미

본 학습 archive 의 본 페이지 외 즉시 action 0 (Karpathy #3 외과적). 후속 평가 트리거:

1. **Claude Code 의 hooks 한계 부딪힐 때** → pi 의 TypeScript 확장 모델로 *재구현 가능성* 평가
2. **Codex CLI 가 OpenAI 종속으로 불편할 때** → pi 의 다중 프로바이더 + RPC 모드 검토
3. **세션 분기 빈번해질 때** (예: 게임 디자인 multiple-branch 디벨롭) → `/tree` 시도
4. **vault 스킬을 *다른 harness 에서도* 쓰고 싶을 때** → pi 가 가장 자연스러운 진입점

## docs 디렉토리 풀 인덱스 (참고)

`packages/coding-agent/docs/` 28 파일 — 본 페이지가 *고유 차별점* 위주, 풀 reference 가 필요하면 원본 직참:

- 운영: index, quickstart, usage, providers, settings, keybindings, sessions, compaction
- 확장: extensions (97KB — 가장 두꺼움), skills, prompt-templates, themes, packages, models, custom-provider
- 통합: sdk (33KB), rpc (35KB), json, tui (29KB), session-format
- 플랫폼: windows, termux, tmux, terminal-setup, shell-aliases
- 기타: development
