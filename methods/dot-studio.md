---
created: 2026-05-03
updated: 2026-05-03
type: learning
category: methods
source: https://github.com/dance-of-tal/dot-studio
tags: [dot-studio, dance-of-tal, opencode, multi-agent, choreography, package-manager-for-agents, urn]
---

# DOT Studio + Dance of Tal — Figma-style Choreography for AI Agents

> dance-of-tal 가족: `dot` CLI = "AI 에이전트 패키지 매니저 (npm 비유)" + `dot-studio` = Figma 같은 시각 저작 GUI.
> Both MIT, Node.js 20+, npm 글로벌 설치. Studio 는 OpenCode 실행 엔진 위에 얹힌 GUI 레이어.

## 1. 정체성 (가족 두 repo)

| repo | 역할 | 패키지 |
|------|------|--------|
| dance-of-tal/dance-of-tal | `dot` CLI — *"npm for AI agents"* | `npm i -g dance-of-tal` |
| dance-of-tal/dot-studio | Figma-style canvas GUI on top of `dot` | `npm i -g dot-studio` |

`dot-studio` 는 OpenCode 를 sidecar 로 가지고 자동 시작 (포트 43102). `.opencode/` 디렉토리가 자동 생성 — 사용자는 직접 편집 X.

## 2. 4 핵심 빌딩 블록

| 블록 | 정의 | 우리 식 비유 |
|------|------|-------------|
| **Tal** | base identity + behavior + instruction layer | [Generative Agents (Park et al. 2023) — AI NPC의 성경](../techniques/generative-agents.md) persona + [Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](karpathy-guidelines.md) BEHAVIOR.md |
| **Dance** | 재사용 가능 skill / capability 패키지 | Claude Code skill, [Diagram-Design Skill — Editorial 다이어그램을 자동화한 Claude Code skill](diagram-design-skill.md) 류 |
| **Performer** | Tal + Dance + model + MCP config 결합한 runnable agent | NPC 인스턴스 (예: 마타이오스) |
| **Act** | 다중 performer choreography (협업 워크플로우) | [OASIS: Open Agent Social Interaction Simulations with One Million Agents](../techniques/oasis.md) mini 버전 (10명 미만 깊이 협업) |

멘탈 모델:
```
Tal + Dance + model + tools = Performer
Multiple Performers + choreography = Act
```

→ 단일 framework 가 아닌 *컴포지션 단위* 분리. Tal 은 누구인가, Dance 는 무엇을 할 줄 아나, Performer 는 누가 무엇으로 무장해서 일하나, Act 는 그들이 어떻게 협업하나.

## 3. Act 의 구조 (가장 흥미로운 부분)

| 필드 | 의미 |
|------|------|
| `participants` | 참여 performers |
| `relations` | 누가 누구와 조정 가능한가 |
| `actRules` | 전체 공유 규약 |
| `subscriptions` | wake-up 신호 — teammate message / shared board key / tag / runtime event |

**핵심**: `subscriptions` 가 multi-agent 비동기 조율의 *명시적 추상*. Park+2023 의 town simulation 보다 *깨우기 메커니즘* 이 명확.

Act 의 두 표현:
- **canvas 버전**: 저작·레이아웃용 (사람이 보는 것)
- **runtime 버전**: 실행·협업 정의 (Studio 가 projection)
- **thread state**: 런타임 history (Act asset 자체 X)

## 4. URN (Uniform Resource Name) 표준

모든 리소스는 `kind/@owner/stage/name` 형식:
- `tal/@acme/identity/reviewer`
- `dance/@acme/skills/code-review`
- `performer/@acme/workflows/reviewer`
- `act/@acme/workflows/review-flow`

→ npm-style 패키지 네임스페이스를 agent 영역에 이식. 공유·재사용·버전 관리에 적합.

## 5. CLI / 진입

```bash
npm install -g dot-studio
dot-studio /path/to/project          # 워크스페이스 열기
dot-studio open . --no-open          # 헤드리스
dot-studio open . --act act/@acme/workflows/review-flow  # 특정 Act 로드
dot-studio doctor                    # 진단
```

기본 포트 43100 (Studio), 43101 (dev API), 43102 (OpenCode sidecar). 충돌 시 위로 스캔.

## 6. Studio Assistant

Canvas 안에서 *직접 편집* + *Studio Assistant 보조* 두 모드. Assistant 가 Tal/Dance/Performer/Act 를 자연어로 scaffold·update.

→ 직접 편집 = 정밀 제어, Assistant = 빠른 broad change. Karpathy #2 (Simplicity) 와 정합 — 둘 다 갖되 명확히 구분.

## 7. Discord 통합

Discord bot 이 Studio workspace 의 performer / Act participant 와 chat 가능. **단 chat surface 만** — 저작·편집·발행 X. 런타임 surface 와 저작 surface 분리 깔끔.

## 8. 우리 시스템과 비교

| 차원 | DOT (Tal/Dance/Performer/Act) | 우리 |
|------|-------------------------------|------|
| 페르소나 정의 | Tal (identity layer) | tone-bible + GDD §5 NPC 명세 |
| Skill 패키지 | Dance (재사용 가능) | Claude Code skills, [Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](karpathy-guidelines.md) 류 |
| Runnable agent | Performer (Tal + Dance + model + MCP) | hwigi-tower 의 마타이오스 = NPC 인스턴스 |
| 다중 협업 | Act (subscriptions, relations) | mirofish-lab 의 OASIS Reddit clone |
| 패키지 네임스페이스 | URN `kind/@owner/stage/name` | 없음 (우리는 wiki 페이지명만) |
| 시각 편집 | Figma-style canvas | Obsidian Graph (수동) |
| 실행 엔진 | OpenCode sidecar | Codex (게임), MiroFish 자체 (시뮬) |

## 9. 우리 비전과의 매핑

### 비전 A (hwigi-tower) — 미적용
- NPC 1명, choreography 필요 X
- Unity 환경이라 OpenCode 실행 불가
- 단 **Tal / Dance 분리 컨셉** 은 마타이오스 정의 정밀화에 차용 가능

### 비전 B (mirofish-lab) — 부분 보완
- 1000+ 대규모 emergence 는 [OASIS: Open Agent Social Interaction Simulations with One Million Agents](../techniques/oasis.md) 가 우월
- **10명 미만 깊이 Act** 는 dot-studio 가 더 적합 (서로 다른 단위)
- mirofish-lab EXP-001 (100 agents) 후 *깊이 보완* 필요 시 dot-studio 별도 EXP 검토

### Sub brain 자체 — 미적용
- visual canvas = Obsidian Graph 가 담당
- DOT 의 캔버스 모델은 *agent choreography* 용, 위키 시각화 X

## 10. 차용 가능한 패턴 (도구 도입 X, 개념만)

| 패턴 | 차용처 | 효과 |
|------|--------|------|
| **Tal / Dance 분리** | hwigi-tower tone-bible | 마타이오스를 *identity (μάταιος)* + *skills (회상·균열·붕괴 발화)* 로 명시 분리. 음역 A 가 이미 부분 분리, 명시화 가치 있음 |
| **URN 네임스페이스** | mirofish-lab 페르소나·시드 명명 | `persona/@nemotron/korean-gamers/100` 같은 표준. EXP 누적 시 검색·재사용 효율↑ |
| **Act 의 subscriptions** | mirofish-lab 결과 분석 | wake-up 패턴 = 어떤 시그널이 어떤 agent 를 깨웠나 측정. emergence 추적 지표 |
| **runtime / 저작 surface 분리** | 모든 우리 워크플로우 | design-brief (저작) vs progress.md (runtime) 가 이미 같은 패턴. 명시화 가치 |

## 11. 마감 D-15 기준 평가

- **직접 도입 ❌** — Node 20+ 환경 + OpenCode 학습 + Studio Assistant 사용법 = 마감 임박엔 과잉
- **패턴 차용 🟡** — Tal/Dance 분리만 1 줄로 흡수 가능 (tone-bible 갱신)
- **마감 후 검토 후보** — mirofish-lab EXP 누적 시 깊이 협업 (10 명 미만 Act) 단위 도입

## 12. 동족 도구 비교

| 도구 | 단위 | 시각화 | 우리 적용 |
|------|------|--------|----------|
| [OASIS: Open Agent Social Interaction Simulations with One Million Agents](../techniques/oasis.md) | 1000+ social media agents | 없음 (코드/dashboard) | mirofish-lab 본체 |
| [Ouroboros — Spec-First Agent OS](ouroboros.md) | 1 사용자 × 9 minds (단일 작업) | 없음 (CLI) | 흡수 완료 (Mode 매핑) |
| **dot-studio** | 10명 미만 Act × 깊이 협업 | Figma-style canvas | mirofish-lab 보완 후보 |
| OpenAI Agents SDK | Python multi-agent | 없음 | 미사용 (Python only) |
| LangGraph | 그래프 기반 multi-agent | 부분 (LangSmith) | 미사용 |

→ DOT 의 자리: *깊이 (10 명 이하) × 시각 저작*. OASIS 와 직교, 보완 관계.

## 13. 출처

- Repo (Studio): github.com/dance-of-tal/dot-studio (MIT)
- Repo (CLI): github.com/dance-of-tal/dance-of-tal (MIT)
- npm: `dot-studio`, `dance-of-tal`
- 실행 엔진: github.com/opencode-ai/opencode
- 학습 일자: 2026-05-03
- 트리거: 작가 학습 요청 ([Ouroboros — Spec-First Agent OS](ouroboros.md) / [CocoIndex — Incremental Data Pipeline for AI Agents](../techniques/cocoindex.md) 직후 동족 도구 탐색)
