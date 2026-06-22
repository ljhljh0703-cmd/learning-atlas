---
created: 2026-04-24
updated: 2026-04-24
type: learning
tags: [tooling, claude-code, agent-harness, skills, instincts, memory, continuous-learning, security]
source: https://github.com/affaan-m/everything-claude-code
category: method
---

# Everything Claude Code (ECC) — 에이전트 harness 성능 최적화 시스템

*Affaan Mustafa / MIT / v1.10.0 (Apr 2026) / Anthropic Hackathon Winner*

> **AI NPC blueprint와의 직결성: 없음.** Claude Code 일상 작업 생산성 도구로서의 직결성: **매우 높음**.
> 분류: method (도구/프레임워크), 적용성: 직접, 시급성: 단기.

140K★ / 21K fork / 170+ contributor. 단순 config 팩이 아니라 **skills + instincts + memory + security + research-first development**을 통합한 에이전트 harness. 10개월 이상 실제 프로덕트 빌드에서 숙성.

---

## 한 줄 요약

> Claude Code (와 Codex / Cursor / OpenCode / Gemini) 위에 **38 agents + 156 skills + 72 commands + rules + hooks**를 얹어서 토큰 최적화, 메모리 영속, 지속 학습, 보안 스캔, 검증 루프를 시스템화한 Anthropic 해커톤 우승작.

---

## 핵심 구성 요소

### 1. Agents (38종) — 위임 전문 서브에이전트

planner / architect / tdd-guide / code-reviewer / security-reviewer / build-error-resolver / e2e-runner / refactor-cleaner / doc-updater / chief-of-staff / loop-operator / harness-optimizer 등

언어별 리뷰어/빌드 리졸버: typescript, python, go, rust, java, kotlin, cpp, pytorch 등

### 2. Skills (156종) — 기본 워크플로우 서피스

**범용:**
- `continuous-learning-v2` — instinct 기반 학습 (신뢰도 점수)
- `iterative-retrieval` — 서브에이전트 점진 컨텍스트 축소
- `strategic-compact` — 수동 compaction 제안
- `eval-harness`, `verification-loop` — 검증 루프
- `search-first` — 코딩 전 리서치
- `cost-aware-llm-pipeline` — LLM 비용 최적화, 모델 라우팅
- `content-hash-cache-pattern` — SHA-256 해시 캐싱
- `regex-vs-llm-structured-text` — "언제 regex, 언제 LLM" 결정 프레임
- `autonomous-loops` — 자율 루프 패턴 (순차, PR 루프, DAG)
- `plankton-code-quality` — write-time 코드 품질 훅

**도메인:**
- 백엔드/프론트엔드/데이터베이스/마이그레이션 패턴
- `videodb` — 영상/음성 ingest·검색·편집·생성·스트림
- `investor-materials`, `investor-outreach` — 피치덱, 펀딩 아웃리치
- `market-research`, `article-writing`, `content-engine`
- `liquid-glass-design`, `foundation-models-on-device` — iOS 26 + Apple 온디바이스 LLM

**언어별:**
- Django, Laravel, Spring Boot, Perl, Swift, Kotlin, Rust, C++, Go patterns

### 3. Commands (72 legacy shims)

`/plan`, `/tdd`, `/e2e`, `/code-review`, `/build-fix`, `/refactor-clean`, `/verify`, `/checkpoint`, `/learn`, `/learn-eval`, `/evolve`, `/prune`, `/instinct-{status,import,export}`, `/multi-{plan,execute,backend,frontend,workflow}`, `/orchestrate`, `/sessions`, `/harness-audit`, `/loop-{start,status}`, `/quality-gate`, `/model-route`, `/pm2`

### 4. Rules — 항상 지킬 가이드라인

12개 언어 생태계별로 분리:
- `common/` — 언어 불문 원칙 (coding-style, git-workflow, testing, performance, patterns, hooks, agents, security)
- `typescript/`, `python/`, `golang/`, `swift/`, `php/`, `java/`, `kotlin/`, `rust/`, `cpp/`, `perl/`

### 5. Hooks — 트리거 기반 자동화

- `memory-persistence/` — 세션 lifecycle 훅으로 컨텍스트 자동 save/load
- `strategic-compact/` — compaction 제안
- `ECC_HOOK_PROFILE=minimal|standard|strict` + `ECC_DISABLED_HOOKS`로 런타임 제어

### 6. NanoClaw v2 — 모델 라우팅 + 세션 관리

모델 라우팅, skill hot-load, session branch/search/export/compact/metrics.

### 7. AgentShield — 보안 스캔

`/security-scan` 으로 1,282 tests, 102 rules 보안 감사.
공격 벡터, 샌드박싱, sanitization, CVE 대응.

### 8. ECC 2.0 alpha — Rust 제어평면

`ecc2/` 디렉토리. `dashboard`, `start`, `sessions`, `status`, `stop`, `resume`, `daemon` CLI.
로컬 빌드 가능, 아직 일반 릴리스 아님.

### 9. Dashboard GUI

Tkinter 데스크톱 앱. `npm run dashboard` 또는 `python3 ecc_dashboard.py`. 다크/라이트, 폰트 커스텀, 에이전트·스킬·커맨드·룰 탐색.

### 10. GitHub App

[github.com/marketplace/ecc-tools](https://github.com/marketplace/ecc-tools) — free/pro/enterprise 티어 (상업).

---

## 세 가지 핵심 아이디어 (진짜 수확)

### A. Instinct 시스템 — 지속 학습 프레임워크

**continuous-learning-v2**가 핵심.

```
세션 진행 → Stop hook → 패턴 추출 → confidence score → instinct DB
                                           │
                                           ▼
                                 pending → promoted → evolved (skill로)
```

- `/learn`, `/learn-eval` — 세션 중 패턴 추출
- `/evolve` — instinct 클러스터를 skill로 승격
- `/prune` — 만료된 pending instinct 삭제
- `/instinct-import`, `/instinct-export` — 팀 공유 가능

→ **"에이전트가 자기 학습한다"는 추상이 실제 파일/명령으로 구현됨.**

### B. Memory Persistence Hooks

Claude Code의 기본 세션은 종료 시 휘발. ECC는 SessionStart/Stop 훅으로 컨텍스트를 파일로 save/load.

→ 이게 **seCall의 동족 발상**. 다만 seCall = 검색/인덱스 중심, ECC = hook 중심.

### C. Research-First Development + Verification Loops

- `search-first` skill — 코딩 전 반드시 리서치
- `eval-harness`, `verification-loop` — 체크포인트 vs 지속 평가, grader 타입, pass@k 지표
- `/checkpoint`, `/verify` — 검증 상태 저장/실행

→ TDD 넘어서 **"에이전트가 자신의 작업을 의심한다"** 는 문화를 도구화.

---

## 정직한 평가

### 진짜 강점

1. **생태계 규모가 압도적** — 140K★, 170+ contributor, 10개월 숙성. 개인이 흉내 낼 수 없는 밀도.
2. **Anthropic 해커톤 우승** — 공식 검증.
3. **cross-harness** — Claude만이 아니라 Codex, Cursor, OpenCode, Gemini까지 동일 surface.
4. **선택적 설치** (v1.9) — manifest-driven, 필요한 것만.
5. **12개 언어 생태계 rules** — 내가 건드릴 모든 언어 포함.
6. **997+ 내부 테스트** — 하네스 자체 품질 관리.

### 진짜 약점 / 리스크

1. **복잡도 과잉 가능성** — 38 agents + 156 skills은 내 용도에 모두 필요하지 않음. **선택적으로 골라야 함.**
2. **학습 곡선 가파름** — Shorthand Guide → Longform Guide → Security Guide 세 개 다 읽어야 제대로 활용.
3. **하이프 경계 필요** — 140K★는 실제 장기 유용성과 다를 수 있음. "설치했다가 다 꺼버리는" 패턴 유의.
4. **Plugin vs 수동 설치 주의** — README에 명시: `/plugin install` 후 `install.sh --profile full` 돌리면 중복 설치로 런타임 이상.
5. **ECC Tools 상업 GitHub App** — 일부 기능은 유료. 어디가 OSS 경계인지 확인 필요.
6. **Rules 수동 복사 필요** — `rules/`는 플러그인이 자동 배포 못 함. 수동 복사.
7. **multi-* 명령은 별도 설치** (`npx ccg-workflow`) — 숨은 의존.

### "이것은 무엇의 반대인가"

- **free-claude-code** = 비용 절감 (모델 교체)
- **ECC** = 능력 증폭 (Claude는 그대로, harness 품질 올림)

→ **상보적.** 원칙상 병행 가능. 단 둘 다 복잡도 → 하나씩 도입 권장.

---

## 내 프로젝트 적용 구상

### 직접 연결 매트릭스

| 프로젝트/상황 | 적용 가능성 | 구체 |
|--------------|-----------|------|
| **Sub brain 일상 개발** | **매우 높음** | `memory-persistence` 훅 + `continuous-learning-v2` — seCall 발상과 동종, 그러나 hook 기반 |
| **슈퍼센트 지원 작업** | **부분적** | `article-writing`, `investor-materials` skill들이 에세이/포트폴리오에 직결 |
| **북켓몬 (팀 프로젝트)** | **높음** | `backend-patterns`, `database-migrations`, `api-design`, `postgres-patterns`, `eval-harness` |
| **hyunsoo-bot** | **중간** | `cost-aware-llm-pipeline`, `python-patterns`, `regex-vs-llm-structured-text` |
| **AI NPC blueprint** | **간접적** | skill 구조 자체가 NPC 행동 패턴 레이어링 설계 힌트 |

### 가장 강한 후보 3개

1. **`memory-persistence` 훅 도입**
   - seCall 도입 전 저비용 시작점.
   - 세션 컨텍스트를 자동으로 wiki/log.md 시드로 덤프.
2. **`search-first` skill 활성화**
   - 내 갤럽 "전략" 강점과 정합. 코딩 전 리서치 자동 강제.
3. **`article-writing` + `investor-materials` skill**
   - 슈퍼센트 에세이·포트폴리오에 즉시 적용.
   - "generic AI tone 없이 공급된 voice로 long-form" — 정확히 내 니즈.

### 주의해서 거를 것

- 38 agents 전부 설치 금지 — **선택적으로 5~10개만**
- `/multi-*` 류는 당분간 불필요 (`ccg-workflow` 별도 설치 필요)
- Dashboard GUI는 재미는 있지만 우선순위 낮음
- AgentShield 보안 스캔은 **북켓몬 서비스 배포 단계 전에 사용**하면 큰 가치

---

## 개념적 수확

### 1. "Skill"이 제1 워크플로우 surface

ECC는 명시적으로 **commands/ 를 legacy로 선언**하고 skills/로 이동 중. 이유: 스킬은 자연어 워크플로우 정의, 명령은 단발 호출. **재사용성·조합성 차이**.

→ 내 `workflows/paper-study.md` 같은 것이 정확히 skill 개념. 가는 방향 맞음.

### 2. "Instinct → Skill" 진화 파이프라인

pending instinct → promoted → evolved into skill. **학습이 자산화되는 경로가 파일 시스템으로 구현**. Karpathy autoresearch의 자동 실험 루프와 같은 DNA, 다만 "코드 실험"이 아니라 "작업 패턴 학습".

→ 내 Sub brain의 `learnings/` 과정을 자동화할 수 있는 방향 — "이번 주 발견 → 자동 skill 후보 제안".

### 3. Hook Profile 런타임 제어

`ECC_HOOK_PROFILE=minimal|standard|strict` — 같은 hook 세트를 **상황별 엄격도**로 제어. "개발 중 minimal, 배포 전 strict".

→ 내 AI NPC의 Layer 0 (윤리) 에도 적용 가능한 패턴. "캐주얼 게임 모드 vs 성인 서사 모드"의 윤리 엄격도 프로파일.

### 4. "Harness Audit"이 메타 작업

`/harness-audit`, `/quality-gate` — **도구 자체가 자기 도구를 감사**. [DESIGN.md — 코딩 에이전트용 디자인 시스템 명세](design-md.md) lint와 같은 "자동 PDCA Check" 계보.

### 5. Cross-Harness 설계 철학

같은 skill이 Claude Code / Codex / Cursor / OpenCode 모두에서 동작. **"특정 harness 의존 없는 개인 시스템"** 의 레퍼런스.

→ 내 Sub brain이 바로 이 원칙 — markdown + frontmatter로 에이전트 중립.

---

## 열린 질문

- ECC 설치 후 실제로 쓰는 skill은 몇 개일까? (20%의 법칙 추정: 156개 중 10~20개)
- `memory-persistence` hook이 seCall과 병행 가능한가? 파일 충돌 여부
- instinct DB 스키마는 seCall의 graph와 통합할 수 있는가?
- ECC의 `continuous-learning-v2`를 Sub brain `learnings/` 흐름에 이식 가능한가?
- AgentShield CVE 규칙 102개가 한국 개발 환경에서 얼마나 적합?
- `/harness-audit`이 내 CLAUDE.md 설정에 대해 뭐라고 말할지
- ECC 2.0 alpha (Rust) 이 안정화되면 Tkinter Dashboard는 사라질 것인가?

---

## 다음 학습 후보

- **Shorthand Guide + Longform Guide + Security Guide** — 본 repo README가 가리키는 3개 가이드 정독 (author X 글)
- **ECC continuous-learning-v2 스킬 파일 정독** — instinct 파일 구조·confidence scoring 알고리즘
- **ECC memory-persistence hook 코드** — 세션 컨텍스트 save/load 구현 세부
- **`search-first` + `skill-stocktake` 스킬** — 리서치 자동화 · 스킬 품질 감사 패턴
- **AgentShield 102 rules** — 에이전트 보안 취약점 카탈로그
- **Affaan Mustafa의 X (affaanmustafa)** — 저자의 실시간 사고
- **Claude Code Plugin 스펙** — plugin.json, marketplace.json 표준
- **ccg-workflow** — multi-agent orchestration 런타임 (별도 시스템)

---

## 적용 아이디어

### 단기 (이번 주, 설치 전 연구)
- Guide 3편 목차 훑기 (1시간)
- `memory-persistence` 훅 코드 한 번 읽기 (Sub brain 통합 가능성 판단)
- `article-writing` skill 파일 읽기 → 슈퍼센트 에세이에 수동 적용 (설치 없이 차용)

### 중기 (1개월, 선택적 설치)
- Plugin 설치 후 **10개 skill만 수동 활성화**:
  - memory-persistence, search-first, article-writing, continuous-learning-v2,
  - eval-harness, verification-loop, cost-aware-llm-pipeline, api-design,
  - database-migrations, security-review
- rules는 `common/` + `python/` + `typescript/` 만 복사
- 1주 체험 후 `/harness-audit` 돌려 유용성 측정

### 장기
- instinct DB → Sub brain `learnings/` 자동 승격 파이프라인 설계 (ritual 자동화)
- ECC + seCall 통합 가능성 실험: ECC hook이 세션 저장 → seCall이 인덱스
- 내 NPC 블루프린트에 "skill 레이어링" 사상 흡수: NPC 행동도 skills 카탈로그로 조합
- AgentShield 차용 — 북켓몬 서비스 배포 직전 필수 게이트

---

## 결론 — 도입 판정

**선택적 도입, 단계적.** free-claude-code와 달리 ECC는 **능력 증폭**이므로 내 프로덕트에 간접 편입 OK.

1. **지금 즉시**: 3개 Guide 읽기. 설치는 보류.
2. **슈퍼센트 작업 중**: `article-writing`, `investor-materials` skill 파일만 복사해서 수동 차용 (설치 안 함)
3. **슈퍼센트 끝난 후**: 10개 선별 skill + common/python/typescript rules 설치
4. **1개월 후**: instinct 기반 자동 skill 승격을 Sub brain과 통합 검토

**주의:** 156 skills 전부 설치하면 **내 작업이 ECC를 따라가는 역전** 발생. 큐레이션 의식적으로.

---

## 연결된 페이지

- [seCall — AI 에이전트 세션을 위한 로컬 퍼스트 검색 엔진](secall.md) — memory persistence 사상의 동종 (hook vs 인덱스)
- [free-claude-code — Claude Code를 대체 LLM 프로바이더로 라우팅하는 프록시](free-claude-code.md) — 대척점 (비용 절감 vs 능력 증폭)
- [Autoresearch — Karpathy의 자동 연구 루프](autoresearch-karpathy.md) — instinct 진화 파이프라인의 DNA 공유
- [DESIGN.md — 코딩 에이전트용 디자인 시스템 명세](design-md.md) — harness-audit과 같은 lint/audit 계보
- [프로덕트 디자인 & UX 라이팅 — 학습 정리](../narrative/product-design-and-ux-writing.md) — article-writing skill이 직결
- paper-study — skill 개념의 선행 실천
- ai-npc-blueprint — skill 레이어링 사상 흡수 후보
- professional — Claude Code 일상 작업 맥락

---

## 출처

- 저장소: <https://github.com/affaan-m/everything-claude-code>
- 라이선스: MIT
- npm: `ecc-universal`, `ecc-agentshield`
- GitHub App: <https://github.com/marketplace/ecc-tools>
- 저자: Affaan Mustafa (<https://x.com/affaanmustafa>)
- 가이드: Shorthand / Longform / Security (저자 X 포스트)
- 버전: v1.10.0 (2026-04 기준)
