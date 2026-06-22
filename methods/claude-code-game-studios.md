---
created: 2026-05-03
updated: 2026-05-03
type: learning
tags: [claude-code, agent-harness, game-dev, hierarchy, workflow, unity, hwigi-tower]
source: https://github.com/Donchitos/Claude-Code-Game-Studios
category: method
---

# Claude Code Game Studios — Claude Code 를 게임 스튜디오로 변환하는 49 agent 템플릿

*Donchitos, Shell, **17.0k★ / 2.5k fork** (2026-05-03), 2026-02-12 시작 (~3개월만에 17K) — Claude Code 게임 개발 harness 의 사실상 표준 후보*

Claude Code 단일 세션을 "Director (Opus) → Lead (Sonnet) → Specialist (Sonnet/Haiku)" **3 tier 49 agent 스튜디오 위계** + 72 slash skill + 12 hook + 11 path-scoped rule 로 구조화. 단순 agent 모음이 아니라 **위계 기반 delegation/escalation 프로토콜** 까지 명세.

> 정직한 판단: AI NPC blueprint 직접 매핑 X. **hwigi-tower (비전 A) 의 hwiglija-tower-AGENTS / Codex 워크플로우 와 동족 — 직접 *대체* 후보 아니라 *패턴 수확* 후보.** 시급성 — 중기 (Flick 마감 D-15 동안엔 도입 X, 마감 후 검토). **Karpathy #2 위반 위험 ★★★** — 49 agent 통째로 import 는 명백한 과복잡.

---

## 한 줄 요약

> "솔로 개발자를 위한 Claude Code 기반 가상 스튜디오" — 자율 X, **collaborative protocol** (Ask → Options → Decide → Draft → Approve), 사용자 결정권 보존, 위계는 *escalation 경로* 로만 작동.

---

## 핵심 개념

### 1. 3 tier 위계 + delegation 룰

```
Tier 1 — Directors (Opus, 비전 수호자)
  creative-director · technical-director · producer

Tier 2 — Department Leads (Sonnet, 도메인 소유)
  game-designer · lead-programmer · art-director · audio-director
  narrative-director · qa-lead · release-manager · localization-lead

Tier 3 — Specialists (Sonnet/Haiku, 실무)
  gameplay-programmer · ai-programmer · network-programmer · ui-programmer
  systems-designer · level-designer · economy-designer · technical-artist
  sound-designer · writer · world-builder · ux-designer · prototyper
  performance-analyst · devops-engineer · analytics-engineer
  security-engineer · qa-tester · accessibility-specialist
  live-ops-designer · community-manager · ...
```

**룰 4 종 (메타 발상)**:
1. **Vertical delegation** — 위→아래만 binding
2. **Horizontal consultation** — 동급은 상의는 가능, 결정 권한 X
3. **Conflict resolution** — 의견 충돌은 *공통 부모* 까지 escalation (디자인 = creative-director, 기술 = technical-director)
4. **Domain boundaries** — 자기 도메인 외 파일 수정 금지 (명시 위임 전엔)

### 2. Engine 특화 agent set

| Engine | Lead | Sub-specialist |
|--------|------|----------------|
| Godot 4 | godot-specialist | GDScript / Shaders / GDExtension / C# |
| **Unity** | **unity-specialist** | **DOTS/ECS · Shaders/VFX · Addressables · UI Toolkit** |
| Unreal 5 | unreal-specialist | GAS · Blueprints · Replication · UMG/CommonUI |

→ hwigi-tower 가 Unity 라 unity-specialist 4 종 직접 관련.

### 3. 72 slash skill — 7-phase pipeline

`docs/workflow-catalog.yaml` 가 단일 진실 소스. 카테고리별 (총 72):
- **Onboarding**: `/start` `/help` `/project-stage-detect` `/setup-engine` `/adopt`
- **Game Design**: `/brainstorm` `/map-systems` `/design-system` `/quick-design` `/review-all-gdds` `/propagate-design-change`
- **Architecture**: `/create-architecture` `/architecture-decision` `/architecture-review` `/create-control-manifest`
- **Stories & Sprints**: `/create-epics` `/create-stories` `/dev-story` `/sprint-plan` `/sprint-status` `/story-readiness` `/story-done` `/estimate`
- **Reviews**: `/design-review` `/code-review` `/balance-check` `/scope-check` `/perf-profile` `/tech-debt` `/gate-check` `/consistency-check`
- **QA**: `/qa-plan` `/smoke-check` `/soak-test` `/regression-suite` `/test-flakiness` `/test-evidence-review`
- **Release**: `/release-checklist` `/launch-checklist` `/changelog` `/patch-notes` `/hotfix` `/day-one-patch`
- **Team Orchestration** (multi-agent 협업): `/team-combat` `/team-narrative` `/team-ui` `/team-release` `/team-polish` `/team-audio` `/team-level` `/team-live-ops` `/team-qa`

### 4. Path-scoped rules (자동 적용)

| Path | 강제 사항 |
|------|-----------|
| `src/gameplay/**` | data-driven 값, delta time, UI 참조 금지 |
| `src/core/**` | hot path zero-alloc, thread safety, API 안정성 |
| `src/ai/**` | 성능 budget, debuggability, 데이터 driven 파라미터 |
| `src/networking/**` | server-authoritative, versioned message, 보안 |
| `src/ui/**` | 게임 상태 소유 X, localization-ready, 접근성 |
| `design/gdd/**` | **8 섹션 강제, formula 포맷, edge case** |
| `tests/**` | 네이밍·커버리지·fixture |
| `prototypes/**` | 완화 표준 + README 강제 + hypothesis 기록 |

### 5. 12 hooks (자동 검증)

- `validate-commit.sh` — hardcoded value, TODO 포맷, JSON 유효성, GDD 섹션 검사
- `validate-push.sh` — protected branch 경고
- `validate-assets.sh` — naming convention, JSON 구조
- `detect-gaps.sh` — 신규 프로젝트 감지 → `/start` 추천, code 있는데 design doc 없으면 경고
- `pre-compact.sh` / `post-compact.sh` — compaction 전후 `active.md` 보존·복원
- `log-agent.sh` / `log-agent-stop.sh` — subagent audit trail
- `session-stop.sh` — `active.md` → session log 아카이브 + git activity 기록

### 6. Collaborative ≠ Autonomous (명시)

저자가 강조: **자율 시스템 아님**. 5단계 프로토콜:
1. **Ask** 질문 먼저
2. **Present options** 2-4 옵션 + pros/cons
3. **You decide** 사용자 결정
4. **Draft** 산출물 표시
5. **Approve** 승인 후에만 작성

→ [Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](karpathy-guidelines.md) #1 (Surface Assumptions) 의 시스템화. 3-AI 분업의 "외부 LLM 디벨롭 워크플로우" (CLAUDE.md §) 와 동형.

### 7. Review intensity 선택

`production/review-mode.txt` 에 `full` (모든 director gate) / `lean` (phase gate 만) / `solo` (없음) 설정. 또는 skill 별 `--review solo` 오버라이드.

---

## 기술 스택 / 사용법

```bash
# 1) clone or use as template
git clone https://github.com/Donchitos/Claude-Code-Game-Studios.git my-game
cd my-game

# 2) Claude Code 세션 시작
claude

# 3) /start — 4 진입점 분기 (no idea / vague concept / clear design / existing work)
> /start
```

**전제**: Claude Code, Git, jq (선택), Python 3 (선택). Windows Git Bash 검증, macOS/Linux 호환 (POSIX).

**소화 비용**: 49 agent + 72 skill + 12 hook + 11 rule + 39 template = 단일 세션에 **모두 로딩되는 게 아님** (skill 은 호출 시, agent 는 위임 시). 그러나 settings.json hook 12개는 매 세션 활성.

---

## 내 생각 — hwigi-tower / Sub brain 적용 관점

### 직접 도입성: 낮음 (★ 명시)

**도입 X 이유**:

1. **3-AI 분업 구조 충돌** — 본 위키의 Claude (SSOT) / Gemini (디벨롭) / Codex (코드) 분업이 이미 *작가 의사결정 워크플로우* 까지 정의됨 (CLAUDE.md §). Game Studios 의 49 agent 위계가 *Claude 단일 세션* 안에 들어가도록 설계 — Gemini / Codex 가 끼어들 자리 없음.
2. **SSOT 패턴 충돌** — hwiglija-tower-gdd 가 권위, 6 종 위성 분리 (AGENTS / tone-bible / design-brief / agenda / journal / progress). Game Studios 는 *agent 가 GDD/ADR 자동 생성* 전제 — 우리 SSOT update protocol §0 4단계와 마찰.
3. **49 agent = Karpathy #2 위반** — Flick 마감 (D-15) 동안 도입 = 명백 과복잡. Codex AGENTS.md 단일 진실로도 충분히 진행 중.
4. **GDD 섹션 자동 강제** — 우리 GDD 는 작가 비전 우선, 프레임워크가 8 섹션 강제는 비전 침해 위험.

### 그러나 *패턴 수확* 가치: 높음

**즉시 수확 가능 (도입 0, 발상만)**:

| 발상 | 본 위키 어디로 흡수 |
|------|---------------------|
| **3 tier delegation + escalation 룰 4종** | 3-AI 분업의 "권한 분리" 표를 *escalation 경로* 추가로 보강. 충돌 시 작가 (= 공통 부모) 까지 escalation — 이미 함의됨, *명시화* 필요 |
| **Path-scoped rules** | hwigi-tower hwiglija-tower-AGENTS 에 path 별 룰 (Scripts/Combat, Scripts/UI, Scripts/AI) 추가 — Codex 가 자동 적용. 현재 단일 AGENTS.md 라 도메인 룰 fuzzy |
| **`/team-*` orchestration** | `team-combat` 같이 *주제별 multi-agent 동시 호출* 패턴. 현재 우리는 Claude/Gemini 순차 호출만. mirofish-lab 디벨롭 큐를 `team-mirofish` 형태로 묶으면 작가 prompt 1번 → Gemini 가 multi-perspective 동시 처리 |
| **`/detect-gaps` hook** | 신규 프로젝트에서 design doc 없이 code 있을 때 경고. Sub brain 에 hook 추가 — `applications/<company>/strategy.md` 없이 essay 작성 중이면 작가에게 경고 |
| **Review intensity 설정 (full/lean/solo)** | hwigi-tower 작업의 "긴급 fix vs 큰 결정" 구분 — 작은 수정엔 SSOT 4단계 skip 허용, `--review solo` 같은 명시적 오버라이드 |
| **`/scope-check` skill** | Flick 마감 D-15 같은 시점에 자동 호출 가치. "현재 작업이 출품 critical path 인가" 자동 판정 — Karpathy #2 강제 |
| **Collaborative 5단계 (Ask→Options→Decide→Draft→Approve)** | 이미 우리 hwiglija-tower-design-agenda 패턴이 동형. 명시화 가치는 있음 |
| **`active.md` + pre/post-compact hook** | 세션 압축 전후 컨텍스트 보존 — 본 위키 3-AI 분업의 "토큰 절감" 원칙과 직결. Sub brain 에도 도입 후보 |
| **hooks (12 종) 발상** | Sub brain 본체에 적용 — `validate-commit.sh` 가 frontmatter 누락 검사, `detect-gaps.sh` 가 SSOT 위성 누락 감지 |

### 도입 시점 가설 (마감 후 검토 사항)

- **Flick 마감 (2026-05-18) 이후** 검토 — 절대 그 전 X
- **Unity specialist 4 종 (DOTS · Shaders · Addressables · UI Toolkit)** 만 *발췌* 해서 hwiglija-tower-AGENTS 의 도메인 룰로 흡수 — 49 agent 통째 도입은 X
- **`/team-*` 패턴** mirofish-lab 의 다중 토픽 동시 디벨롭에 가장 가능성 높음 (단일 토픽 → 다 토픽)
- **path-scoped rules** 만이라도 hwigi-tower repo `AGENTS.md` 에 즉시 흡수 가능

### 17K★ 의미 분석

3개월에 17K★ = Claude Code 게임 개발 harness 의 *현 표준 후보*. 솔로 개발자가 "structure 부재로 spaghetti 짜는 문제" 가 광범위 — 본 위키도 같은 문제 인식해서 이미 SSOT/위성 패턴으로 풀고 있음. *발견의 우선순위 자체는 옳음*, 우리가 더 일찍 풀었음.

비교:
| 우리 | Game Studios | 일치도 |
|------|--------------|--------|
| 3-AI 분업 (Claude/Gemini/Codex) | 단일 Claude 49 agent | 다른 해법, 같은 문제 |
| SSOT + 6 위성 | GDD + ADR 자동 생성 | 다른 해법, 같은 문제 |
| 작가 의사결정 5단계 | Ask→Options→Decide→Draft→Approve | **동일** |
| 권한 분리 표 | 3-tier delegation + escalation | **동일** |
| Karpathy 4원칙 메타 | MDA · SDT · Flow · Bartle 메타 | 둘 다 학술 grounding |

### 창작자 정체성 연결

본 위키 메타 행동 원칙 (Karpathy 4 원칙) 의 "Goal-Driven Execution" (#4) 의 게임 dev *완성형* 사례. 본 repo 가 *작가성* 보호하는 5단계 프로토콜을 명시화한 점이 [Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](karpathy-guidelines.md) 의 시스템화. 우리도 같은 발상에 도달했지만 *명시화 깊이* 는 본 repo 가 앞섬 — workflow-catalog.yaml 같은 단일 진실 소스 발상은 차용 가치.

---

## 한계와 회의

1. **단일 세션 가정** — Claude Code 1 세션에 49 agent 가 들어감. 컨텍스트 윈도우 압박. compact hook 으로 완화하지만 근본은 Claude Code의 한계
2. **자동 GDD 강제 = 비전 침해 위험** — 8 섹션 강제는 형식 우선, 내용 후순위 가능성. *템플릿* 라며 customizable 강조하지만 default 가 강함
3. **3 engine 모두 지원 = depth 부족 가능** — Unity 4 sub-specialist 가 Codex AGENTS.md 의 Unity-specific 깊이만큼 정밀할지 검증 필요
4. **17K★ 의 fork 비율** — 17K star vs 2.5K fork (15%) — 진짜 사용자 vs 흥미 star 분리 필요. Issue/Discussion 활성도 추가 조사 필요
5. **Donchitos 단일 maintainer** — sustainability 리스크. Anthropic 공식 대비 비공식

---

## 다음 학습 후보

- **`.claude/skills/start/` 실제 분기 로직** — 4 진입점 (no idea / vague / clear / existing) 의 prompt engineering. `/start` 단일 skill 만 분석해도 본 위키 [Ouroboros — Spec-First Agent OS](ouroboros.md) / 3-AI 분업의 진입점 설계 개선 후보
- **`workflow-catalog.yaml` 7-phase pipeline 전문** — 단일 진실 소스 패턴 검증. 본 위키의 9-phase pipeline (bkit) 와 비교
- **`unity-specialist.md` + 4 sub-specialist 본문** — hwigi-tower hwiglija-tower-AGENTS 도메인 룰 흡수 후보. *1주일 안* 발췌 검토 가능
- **bkit 9-phase pipeline 문서 (`/development-pipeline`) 재독** — 동족 framework 비교. bkit 가 단일 SaaS 빌드 vs Game Studios 가 단일 게임 빌드. 차이점 분석
- **agentic harness 비교 매트릭스** — bkit · Game Studios · [Everything Claude Code (ECC) — 에이전트 harness 성능 최적화 시스템](everything-claude-code.md) · [Ouroboros — Spec-First Agent OS](ouroboros.md) · [DOT Studio + Dance of Tal — Figma-style Choreography for AI Agents](dot-studio.md) 5 종. 복잡도/도메인 specialty/사용자 통제 권한 3 축
- **`/reverse-document` skill** — 기존 코드에서 design doc 역생성. Sub brain 의 raw 일기 → wiki 변환 패턴과 동형, 발상 차용 가치

---

## 연결된 페이지

- hwiglija-tower-AGENTS — Codex 브리프, Game Studios 의 unity-specialist 4종 발췌 흡수 후보
- hwiglija-tower-gdd — SSOT, Game Studios 자동 GDD 강제와 충돌 지점
- hwiglija-tower-design-agenda — Ask→Options→Decide→Draft→Approve 동형 패턴 이미 운영
- [Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](karpathy-guidelines.md) — Game Studios 가 #1·#2·#4 시스템화한 사례
- [Ouroboros — Spec-First Agent OS](ouroboros.md) — Nine Minds + Agent OS, 동족 harness
- [DOT Studio + Dance of Tal — Figma-style Choreography for AI Agents](dot-studio.md) — Figma-style multi-agent canvas, 동족
- [Everything Claude Code (ECC) — 에이전트 harness 성능 최적화 시스템](everything-claude-code.md) — Claude Code 본체 harness 강화 (skills/instincts/memory/security)
- [free-claude-code — Claude Code를 대체 LLM 프로바이더로 라우팅하는 프록시](free-claude-code.md) — Claude Code 라우팅 프록시 (도입 보류)
- [Codex CLI Prompting — 내재화 노트](codex-cli-prompting.md) — Codex 프롬프팅, 49 agent 와 단일 codex AGENTS.md 비교 base
- [Autoresearch — Karpathy의 자동 연구 루프](autoresearch-karpathy.md) — 자율 vs collaborative 의 양 끝
- mirofish-lab-design-agenda — `/team-*` 패턴 적용 가장 유력한 곳
- flick-challenge — Flick 마감 (2026-05-18), 그 전엔 도입 X
