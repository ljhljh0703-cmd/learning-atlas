---
created: 2026-05-17
updated: 2026-06-17
type: learning
tags: [agent-architecture, open-source, self-improving, multi-platform, nous-research]
---

# Hermes Agent — Nous Research 자가개선형 에이전트 플랫폼

> ⤳ vault 적용: hermes-loop — 본 에이전트의 *Procedural memory(스킬 자가생성)* 패턴을 작가 vault 의 외부 AI⇄Vault⇄Skill 성장 회로로 배선함.

Nous Research 가 공개한 **MIT 라이선스 self-improving AI agent**. 핵심 특징은 *스킬 자가 생성*, *멀티플랫폼 메시징 게이트웨이*, *벤더 락인 없는 모델 추상화* — 200+ 모델 (OpenAI/Anthropic/OpenRouter/NVIDIA NIM/HF/custom) 을 단일 인터페이스로 다룸. $5 VPS 부터 Modal/Daytona 서버리스까지 배포 가능.

repo: `github.com/NousResearch/hermes-agent` · 언어: Python 88% / TypeScript 9%

---

## 1. 아키텍처 5계층

```
┌─ Gateway Layer ───────────────────────────────┐
│  Telegram · Discord · Slack · WhatsApp ·      │
│  Signal · Email · CLI · TUI · Web — 단일 게이트웨이 │
└───────────────────────────────────────────────┘
┌─ Agent Core (agent/) ─────────────────────────┐
│  context_engine · prompt_builder · trajectory │
│  + LLM adapters (anthropic/bedrock/gemini/…)  │
│  + credential_pool · tool_guardrails · redact │
└───────────────────────────────────────────────┘
┌─ Tools Layer (tools/, 60+ 파일) ──────────────┐
│  파일·브라우저·코드실행·검색·미디어·메모리·     │
│  Discord·MS Graph·Feishu·HomeAssistant 등     │
└───────────────────────────────────────────────┘
┌─ Skills Layer (skills/) ──────────────────────┐
│  카테고리 폴더 25+ (creative · devops ·       │
│  research · red-teaming · domain · …)         │
│  agentskills.io 오픈 표준 호환                 │
└───────────────────────────────────────────────┘
┌─ Memory & Learning ───────────────────────────┐
│  Procedural (스킬 자가개선) · User Modeling   │
│  (Honcho dialectic) · Recall (FTS5 + LLM 요약)│
└───────────────────────────────────────────────┘
```

## 2. 디렉토리 핵심

| 디렉토리 | 역할 |
|---------|------|
| `agent/` | LLM 어댑터, 컨텍스트 엔진, 프롬프트 빌더, trajectory 추적, 신용/안전 가드 |
| `tools/` | 60+ 도구 파일 — 카테고리별로 file/browser/code-exec/search/media/memory/integration/security |
| `skills/` | 25+ 카테고리 폴더의 plug-in 스킬 라이브러리 |
| `gateway/` | 멀티 플랫폼 메시징 추상화 (CLI/TG/Discord/Slack/WA/Signal/Email) |
| `plugins/`, `providers/` | LLM provider · plugin LLM 통합 |
| `cron/` | 스케줄링 — 자율 정기 실행 |
| `acp_adapter/`, `acp_registry/` | Agent Communication Protocol (멀티 에이전트 RPC) |
| `mcp_serve.py` | Hermes 자체를 MCP 서버로 노출 |
| `batch_runner.py`, `trajectory_compressor.py` | **트레이닝 데이터 파이프라인** — 차세대 tool-calling 모델 학습용 trajectory 대량 생성 + 컨텍스트 압축 |

## 3. 메모리 3종 (계층 분리)

| 종류 | 메커니즘 | 효과 |
|------|---------|------|
| **Procedural** | 사용 중 스킬 자가 생성·개선 | 반복 작업 → 영구 스킬화 |
| **User modeling** | Honcho dialectic 영구 프로필 | 크로스세션 사용자 이해 |
| **Recall (semantic)** | SQLite FTS5 세션 검색 + LLM 요약 | 과거 대화 횡단 회상 |

→ [Zep / Graphiti — Temporal Knowledge Graph for Agent Memory](zep-graphiti.md) 의 bi-temporal KG 와 비교 흥미. Hermes 는 FTS5+LLM 요약으로 **더 가벼움** (KG 구축 비용 X), Zep 은 **더 정밀** (edge invalidation 가능). Hermes 의 선택은 *VPS 운용 비용 최소화* 우선순위로 읽힘.

## 4. Tools 카테고리 (60+ 도구)

| 카테고리 | 대표 도구 |
|---------|----------|
| File | `file_operations`, `path_security`, `file_state` |
| Browser | `browser_cdp_tool`, `browser_camofox` (자동화), `browser_supervisor` |
| Code/Exec | `code_execution_tool`, `terminal_tool`, `cronjob_tools` |
| Search | `session_search_tool`, `x_search_tool` |
| MCP | `mcp_tool`, `mcp_oauth_manager` — *Hermes 가 MCP 클라이언트이자 서버* |
| Multi-agent | `mixture_of_agents_tool`, `delegate_tool` |
| Media | `tts_tool`, `neutts_synth`, `vision_tools`, `image_generation_tool`, `video_generation_tool` |
| Memory | `memory_tool`, `tool_result_storage`, `checkpoint_manager` |
| Productivity | `todo_tool`, `kanban_tools`, `skill_manager_tool` |
| Integration | MS Graph, Feishu (Doc/Drive), HomeAssistant, Discord |
| Security | `tirith_security`, `osv_check`, `skills_guard`, `approval`, `interrupt` |
| Skill mgmt | `skills_hub`, `skills_sync`, `skill_provenance`, `skill_usage` |

→ *agentskills.io* 와 *skill_provenance/skill_usage* 의 조합이 핵심 — **스킬 출처 추적 + 사용 분석**이 자가개선 루프의 신뢰 기반.

## 5. 의미 — 작가 시스템에 시사하는 점

### 5.1 멀티플랫폼 게이트웨이 패턴
Hermes 는 한 에이전트를 9 채널 (TG/Discord/Slack/WA/Signal/Email/CLI/TUI/Web) 에 동시 노출. → 작가의 [AI Employee Obsidian Stack — 파운더 운영 자동화 5피스 (2026-05-15 archive)](../methods/ai-employee-obsidian-stack.md) 5피스 스택과 직접 비교 가능. Hermes 가 **메시징 다양성** 강점, 작가 스택이 **Obsidian vault 중심성** 강점.

### 5.2 자가개선 스킬 vs 정적 SKILL.md
- 작가 현재: `~/.claude/skills/graphify/SKILL.md` 등 *정적 스킬* (수동 작성)
- Hermes: 사용 중 *동적 스킬 생성·개선* + provenance/usage 추적

→ **즉시 차용 후보**: skill usage analytics 패턴 (어떤 스킬이 언제 호출됐는지 로그). 작가 vault 의 skill-sync-strategy 보강 가능.

### 5.3 Trajectory 압축 — Nous 의 차별점
`batch_runner.py` + `trajectory_compressor.py` 는 *모델 학습용 데이터 생성 파이프라인*. Hermes 는 단순 에이전트가 아니라 **차세대 tool-calling 모델 학습 인프라**이기도 함 → Nous Research 의 *Hermes 모델 시리즈* 와의 피드백 루프 존재.

→ [Autoresearch — Karpathy의 자동 연구 루프](../methods/autoresearch-karpathy.md), [Sakana AI "AI Scientist" — 자율 연구 에이전트가 ICLR workshop 심사 통과](sakana-ai-scientist.md) 와 같은 *밤새 자율 루프* 패턴이지만 Nous 는 **모델 학습 측면**에 집중.

### 5.4 MCP 양방향 (client + server)
Hermes 는 MCP 클라이언트 (`mcp_tool`) 이자 자기 자신을 MCP 서버 (`mcp_serve.py`) 로 노출. → 작가가 Hermes 를 Claude Code 에서 MCP 로 호출 가능. *실험 후보*.

## 6. Karpathy 4 원칙 관점 평가

| 원칙 | Hermes 의 입장 |
|------|---------------|
| #1 Surface Assumptions | tool_guardrails + approval 워크플로우 → 명시적 안전성 |
| #2 Simplicity First | ❌ 60+ 도구 25+ 스킬 카테고리는 *kitchen-sink*. 단순성보다 *완비성* 지향 |
| #3 Surgical Changes | skill_provenance 로 변경 추적 → 외과적 변경 *가능* (인프라 제공) |
| #4 Goal-Driven | trajectory 추적 + recall 로 목표 검증 메커니즘 보유 |

→ Hermes 는 *플랫폼* 이지 *미니멀 도구* 가 아님. 작가 스택에 통째 도입은 #2 위배. **부분 차용** (skill analytics, 멀티 게이트웨이 패턴) 이 적합.

## 7. 결론

Hermes 는 **Nous Research 가 차세대 tool-calling 모델 학습 인프라로 공개한 에이전트 플랫폼**. 단순 ChatGPT 클라이언트가 아니라 *데이터 생성·자가개선·멀티채널 노출* 의 풀스택.

작가 시스템에 직접 도입할 컴포넌트는 없지만, **3 가지 패턴**은 차용 가치:
1. Skill provenance + usage analytics (→ skill-sync-strategy 보강)
2. Recall = FTS5 + LLM 요약 (→ [Zep / Graphiti — Temporal Knowledge Graph for Agent Memory](zep-graphiti.md) 대안, 비용 1/10)
3. Trajectory 압축 (→ [Autoresearch — Karpathy의 자동 연구 루프](../methods/autoresearch-karpathy.md) 야간 루프의 컨텍스트 절감)

차후 [AI Employee Obsidian Stack — 파운더 운영 자동화 5피스 (2026-05-15 archive)](../methods/ai-employee-obsidian-stack.md) 의 §2.1 자동 transcript ingest 가 unblock 되면, Hermes 의 `cron/` + `gateway/` 아키텍처를 *참고 구현* 으로 재방문할 가치 있음.

---

## 8. 자가성장 메커니즘 — Dual Loop + Deterministic State Machine

Hermes 의 "self-improving" 은 **두 개의 분리된 루프 + 결정론적 상태 전이 + provenance 격리**의 합성. 추상 슬로건이 아니라 *실제 구현*이 명확함.

### 8.1 Loop A — Foreground Skill Creation (반응형)

에이전트가 *대화 중* 다음 4 조건에서 스킬을 생성 (문서 verbatim):

1. "After completing a complex task (**5+ tool calls**) successfully"
2. "When it hit errors or dead ends and **found the working path**"
3. "When the user **corrected its approach**"
4. "When it discovered a **non-trivial workflow**"

→ 트리거는 휴리스틱이지 schedule 이 아님. LLM 이 자기 trajectory 를 보고 *판단해서* `skill_manage(action="create")` 를 호출.

### 8.2 Loop B — Background Curator (주기형, *분리된 LLM fork*)

**`agent/curator.py`** 가 본체. 본 모듈이 자가성장의 *진짜 엔진*.

**트리거 게이트 3 단계**:
| 조건 | 기본값 |
|------|--------|
| Curator enabled in config | — |
| 마지막 실행 후 경과 (`interval_hours`) | **7 일** |
| 에이전트 idle 시간 (`min_idle_hours`) | **2 시간** |

→ CLI 세션 시작 시 + gateway cron-ticker 가 주기 체크. **사용자 작업 방해 X** (idle 보장).

**Phase 1: Deterministic Transitions** (LLM 호출 X)
```
active ──30d idle──▶ stale ──60d idle──▶ archived (~/.hermes/skills/.archive/)
   ▲                     │
   └────── 재사용 시 reactivate ──┘
```
- `stale_after_days` (default 30), `archive_after_days` (default 90)
- Pinned 스킬은 절대 이동 X

**Phase 2: LLM Consolidation Review** (forked auxiliary model)
- `_run_llm_review()` 가 **별도 AIAgent fork** 를 띄움 (메인 대화와 격리)
- 입력: agent-created 스킬 전체 + 각 스킬의 view/use/patch 카운트 (`_render_candidate_list()`)
- 프롬프트 `CURATOR_REVIEW_PROMPT` 가 시키는 일:
  1. **Prefix cluster 식별** — 이름이 비슷한 narrow 스킬 묶음 찾기
  2. **Class-level umbrella 로 통합** — 3 전략 중 선택:
     - 기존 broad 스킬에 patch 로 흡수
     - 신규 umbrella 스킬 생성 + 좁은 것들 demote
     - 좁은 스킬을 umbrella 의 `references/` / `templates/` / `scripts/` 로 강등
  3. **Stale 클러스터 archive 선언**

**불변 invariants** (프롬프트가 강제):
> "DO NOT delete any skill. Archiving is the maximum destructive action."

→ **삭제 불가, 최악도 archive 폴더 이동** (복구 가능). 작가가 skill-sync-strategy 에 적용할 핵심 안전 패턴.

### 8.3 Provenance 격리 — `tools/skill_provenance.py`

**ContextVar 기반 origin 구분**:
```python
_write_origin = ContextVar("skill_write_origin", default="foreground")
# 값: "foreground" | "background_review"
```

- Foreground (Loop A) 에서 생성된 스킬 = *사용자 의도* 가 섞인 결과물
- Background (Loop B fork) 에서 생성된 스킬 = *curator 자율 생성*

→ **Curator 는 자기가 만든 것만 통합/archive**. 사용자 수동 작성 스킬, hub 설치 스킬, repo 번들 스킬은 절대 손대지 않음. *권한 경계가 코드 레벨에서 강제됨*.

### 8.4 산출물 — Auditability

매 curator run 마다:
| 파일 | 용도 |
|------|------|
| `run.json` | 기계 판독 — consolidated/pruned 리스트, tool call 카운트, 상태 전이 |
| `REPORT.md` | 인간 판독 — archive 위치, 복구 방법 |
| `cron_rewrites.json` | cron 작업의 스킬 참조 자동 갱신 기록 |

`_reconcile_classification()` 의 우선순위:
> declared absorption (skill_manage delete 인자) > model intent (YAML 파싱) > tool-call audit 휴리스틱 > fallback pruned

→ **3 중 검증** — LLM 말만 믿지 않고 실제 tool call 로그와 교차 확인.

### 8.5 안전 장치 종합

| 장치 | 효과 |
|------|------|
| Idle 게이트 (2h) | 사용자 작업 방해 X |
| Interval 게이트 (7d) | 과잉 mutation 방지 |
| First-run 지연 | 업그레이드 직후 즉시 변경 X (seed `last_run_at`) |
| Forked agent | 메인 대화 컨텍스트 오염 X |
| Provenance 격리 | 사용자/번들/hub 스킬 보호 |
| Archive only | 삭제 불가, 복구 가능 |
| Pinned skill | 작가가 잠근 스킬은 curator + 에이전트 모두 차단 |
| Dry-run mode | `hermes curator run --dry-run` 으로 미리보기 |
| `paused` 플래그 | `.curator_state` 에서 일시정지 가능 |

### 8.6 작가 시스템에 시사하는 점

작가 현재 `~/.claude/skills/` 는 **수동 작성 + 정적**. Hermes 패턴을 *축소판으로* 적용한다면:

| Hermes 요소 | 작가 적용안 |
|------------|------------|
| Foreground trigger 4 조건 | Claude 가 5+ tool call 작업 완료 후 자체적으로 "스킬화 제안" 1줄 출력 (= 휴리스틱 nudge) |
| Provenance ContextVar | 스킬 파일 frontmatter 에 `origin: agent_generated \| user_authored` 필드 |
| Stale 30d / Archive 90d | 작가 vault `last_used` 추적 (현재 없음 — usage tracking 부재가 약점) |
| Forked review LLM | Gemini 가 야간에 `~/.claude/skills/` 의 *agent_generated* 만 통합 (Claude SSOT 권한 분리와 일관) |
| Archive-only invariant | 절대 차용 — 삭제는 작가 권한, AI 는 archive 까지만 |
| `cron_rewrites.json` | 작가 vault 의 wikilink 일괄 갱신 hook |

→ **즉시 차용 1건**: archive-only invariant + provenance 분리. *나머진 인프라 부담 큼*, 단계적.

### 8.7 한 줄 요약

> Hermes 자가성장 = **휴리스틱 트리거의 foreground 생성** + **idle-aware 주기적 background 통합** + **provenance ContextVar 로 권한 격리** + **결정론적 stale/archive 상태 머신** + **archive-only 불변식**의 합성.

추상 "self-improving AI" 가 아니라 *5 개 메커니즘의 엔지니어링 합성*. Karpathy #1 (Surface Assumptions) 모범 — 모든 mutation 의 *권한*, *시점*, *되돌림 경로* 가 코드에 명시.

---

## 9. 재방문 재확증 (2026-06-17)

작가 "원조 hermes 다시 보자" → 현행 소스(clone) 재대조. **§8 자가성장 = drift 0**: `agent/curator.py` docstring 이 페이지 §8.1~8.7 과 *그대로 일치*("inactivity-triggered, no cron daemon·forked aux agent·auto-transition·**never auto-deletes — only archives**·pinned bypass·**aux client never touches main session's prompt cache**"). → 작가 hermes-loop·skill-curator·Dual-Track 토대가 *권위 출처 현재 구현과 1개월 뒤에도 정합*(차용이 환각/구버전 아님 입증).

**신규 delta 3종** (페이지 작성 후 추가):
1. **core/optional 스킬 2단 분리** 🌟 — `skills/`(코어 73, 번들) vs **`optional-skills/`(100개, 20 카테고리: finance·gaming·health·payments·`dogfood`[Hermes 자기제작용]…)** opt-in 라이브러리. `optional-mcps/`(linear·n8n)도 동일. → 작가 skill 티어(active/stale/archived)에 *core ↔ optional/library* 축 추가 영감(skill-curator §반영).
2. **Routines 완전 실현** — `hermes-already-has-routines.md`: cron + webhook(GitHub events) + API trigger, 전부 자연어·any-platform. 작가 미도입 **자동화축이 권위 출처에선 완전체** → vault 미도입=infra-0 *선택*임을 재확인(6/28 phase2 입력, hot 예정점검).
3. **curator 성숙** — `hermes_cli/curator.py`(CLI) + `curator_backup.py` + 테스트 4종(activity·classification). 상태머신 강화.

> 변함없음: 5계층·메모리 3종·trajectory 압축·멀티플랫폼 게이트웨이·MCP 양방향. MIT.

---

## 관련 페이지
- hermes-loop — 본 에이전트 패턴을 vault 에 배선한 운영 워크플로우(정본). 본 페이지=외부 소스 아카이브, hermes-loop=작가 운영 회로 (별개 역할, 한 쌍)
- [Ouroboros — Spec-First Agent OS](../methods/ouroboros.md) — Nine Minds, 자가개선 루프 메타 프레임
- [AI Employee Obsidian Stack — 파운더 운영 자동화 5피스 (2026-05-15 archive)](../methods/ai-employee-obsidian-stack.md) — 작가 5피스 스택 (비교 대상)
- [Zep / Graphiti — Temporal Knowledge Graph for Agent Memory](zep-graphiti.md) — 정밀 메모리 KG (Hermes recall 의 대안)
- [Autoresearch — Karpathy의 자동 연구 루프](../methods/autoresearch-karpathy.md) — 야간 자율 루프 패턴
- skill-sync-strategy — 연결된 맥락 기반 스킬 전략
- [Sakana AI "AI Scientist" — 자율 연구 에이전트가 ICLR workshop 심사 통과](sakana-ai-scientist.md) — 자가 연구 에이전트 (비교)
