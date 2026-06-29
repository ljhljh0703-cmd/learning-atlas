---
created: 2026-05-24
updated: 2026-05-24
type: learning
tags: [mcp, code-graph, tree-sitter, sqlite, claude-code, cursor, codex, hermes, ai-coding, dev-infra]
source: https://github.com/colbymchenry/codegraph
category: method
---

<!-- CodeGraph (colbymchenry) - tree-sitter + SQLite 기반 코드 지식 그래프 MCP 서버. AI 코딩 에이전트의 토큰·tool call 절감 도구. -->

# CodeGraph — AI 코딩 에이전트용 코드 지식 그래프 MCP 서버

*Colby McHenry (colbymchenry) · MIT · TypeScript · ~19.9k★ · 100% local · npm `@colbymchenry/codegraph`*

tree-sitter 로 소스코드 AST 를 파싱해 함수·클래스·라우트를 노드, 호출·상속·import 를 엣지로 SQLite 에 박제. AI 에이전트 (Claude Code · Cursor · Codex CLI · opencode · **Hermes Agent**) 가 grep/glob/Read 로 코드베이스를 *탐색* 하는 비용을 *사전 인덱스 조회* 로 대체.

---

## 한 줄 요약

> 코드베이스를 **미리** AST → SQLite 그래프로 만들어두고, AI 에이전트가 *파일을 읽지 않고도* `codegraph_explore` 한 번에 관련 코드를 받게 한다 — 평균 *35% 저렴 · 70% 적은 tool call · 49% 빠름* (7 개 OSS 코드베이스, 4-run median).

---

## 핵심 개념

### 1. Pre-Indexed Knowledge Graph (사전 인덱스)

`codegraph init` 시 프로젝트 전체를 tree-sitter 로 파싱 → `.codegraph/codegraph.db` (SQLite + FTS5) 에 저장.
- **노드**: function · class · method · route · symbol
- **엣지**: calls · imports · extends · implements · references
- **resolution 단계**: 함수 호출 → 정의, import → 소스 파일, 클래스 상속, 프레임워크 패턴 (route → handler) 까지 정적 해결

### 2. Framework-aware Routes (14 프레임워크)

`urls.py`·`@app.get`·`@RestController` 등 라우팅 패턴을 인식해 URL → handler 엣지를 자동 생성.
Django · Flask · FastAPI · Express · NestJS · Laravel · Drupal · Rails · Spring · Gin/chi/gorilla/mux · Axum/actix/Rocket · ASP.NET · Vapor · React Router · SvelteKit.

### 3. 9 종 MCP Tools

| 도구 | 용도 |
|---|---|
| `codegraph_search` | 심볼 이름 검색 (FTS5) |
| `codegraph_context` | task 기반 관련 코드 컨텍스트 자동 구성 |
| `codegraph_callers` / `codegraph_callees` | 호출자/피호출자 추적 |
| `codegraph_impact` | 심볼 변경 시 영향 반경 |
| `codegraph_node` | 단일 심볼 상세 |
| `codegraph_explore` | **여러 관련 심볼의 source + 관계 맵을 한 번에** (메인 도구) |
| `codegraph_files` | 인덱스된 파일 구조 |
| `codegraph_status` | 인덱스 헬스 |

### 4. Auto-Sync (Native OS File Events)

FSEvents (macOS) / inotify (Linux) / ReadDirectoryChangesW (Windows) 로 변경 감지 → 2초 debounce → 증분 sync. *zero-config*.

### 5. 19+ 언어 지원

TS/JS · Python · Go · Rust · Java · C# · PHP · Ruby · C/C++ · Swift · Kotlin · Scala · Dart · Svelte · Vue · Liquid · Pascal/Delphi · Lua · Luau.

### 6. 사용 패턴 — Explore Agent 위임 (Claude Code 한정)

설치 시 `~/.claude/CLAUDE.md` 에 자동 주입되는 instruction:
- **메인 세션에서 `codegraph_explore` / `codegraph_context` 직접 호출 금지** (대용량 소스 반환 → 메인 컨텍스트 오염)
- 항상 Explore subagent 스폰 후 그쪽에서 호출
- 메인은 *lightweight* tool 만 직접 사용 (`search`/`callers`/`callees`/`impact`/`node`)
- **`.codegraph/` 없을 때 자동 init 제안 X** (2026-06-14, Option B): 도구 README 의 "초기화 안 됐으면 init 권유" 자동 패턴은 우리 HITL 정신과 충돌 → *작가 명시 요청 시에만* `codegraph init`. 자동 권유 금지.

→ 우리 Sub-brain CLAUDE.md 와 *완전 정합*: 메타 행동 원칙 #2 (Simplicity / 컨텍스트 절감) + Explore 에이전트 분리 패턴.

---

## 벤치마크 (정확한 수치)

> 작가가 적은 *"도구 호출 92% 줄고 탐색 71% 단축"* 은 부정확. 정확한 README 수치:

7 개 OSS (VS Code · Excalidraw · Django · Tokio · OkHttp · Gin · Alamofire), 4-run median, Claude Opus 4.7 + Claude Code v2.1.145 headless.

| 지표 | 평균 절감 | 최대 절감 (Tokio) | 최소 절감 (Gin, 150 파일) |
|---|---|---|---|
| Cost | **35%** | 52% | 17% |
| Tokens | **59%** | 81% | 23% |
| Time | **49%** | 63% | 34% |
| Tool calls | **70%** | **89%** | 19% |

핵심 관찰:
- **대형 코드베이스일수록 효과 증폭** (VS Code 10k 파일에서 72% 적은 tool call). 소형 (Gin 150 파일) 에선 grep 이 이미 싸서 마진 감소.
- **WITH 시**: agent 가 `codegraph_context` 1 회 → `codegraph_explore` 1 회로 답 마무리, *zero file read* 가 빈번.
- **WITHOUT 시**: subagent fan-out + grep/find/Read 폭주.

---

## 기술 스택 / 사용법

```bash
# 설치 (Node 불필요 — 번들 런타임)
curl -fsSL https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.sh | sh
# 또는
npx @colbymchenry/codegraph

# 프로젝트 초기화
cd ~/Downloads/AI\ Game/hwigi-tower
codegraph init -i        # interactive (Claude Code/Codex/Cursor MCP 자동 등록)

# CLI 직접 사용 (디버그용)
codegraph search "Agent"
codegraph callers "PerformAction"
codegraph impact "RewardCalculator" --depth 2
codegraph status

# 제거 (역방향)
codegraph uninstall      # 에이전트 MCP 설정 제거
codegraph uninit         # 프로젝트 .codegraph/ 제거
```

설정은 *zero* — `.gitignore` 자동 준수, 1MB 초과 파일 skip, 확장자 기반 언어 자동 감지.

---

## 내 생각 — Sub-brain / AI Game 트랙 관점

### 트랙별 직접 연결도

| 트랙 | 직접 연결 | 근거 |
|---|---|---|
| **hwiglija-tower** (Unity C#) | **🔴 즉시 도입** | C# Full support. Codex 가 Unity 코드 헤맬 때 token 폭주 — 본 도구로 차단. hwiglija-tower-AGENTS 의 Codex 운영 비용 직접 절감. |
| **Sub-brain repo 자체** (TS/JS/Python 빌더) | **🔴 즉시 도입** | `skills/html-publish/`·`workflows/`·빌더 스크립트의 코드 의존 그래프 미리 박제. Claude/Gemini 의 grep 폭주 감소. |
| **AI Game roadmap Phase 2-7** | 🟡 곧 | Unity ML-Agents 프로젝트 셋업 직후 첫 액션으로 `codegraph init`. Phase 1 결과물 (`Model Training/`) 부터 적용. |
| **com2us-2026 지원** | 🟢 낮음 | 지원 자료 자체엔 코드 적음. 단 RL 시뮬레이터 PoC 작성 시 합류. |

### 우선 도입 순서 (작가 직접 실행)

1. **Sub-brain repo** 부터 — 자기 자신의 도구를 먼저 (메타). `codegraph init` → MCP 자동 등록 → 본 세션부터 즉시 효과.
2. **hwigi-tower (Unity C#)** — Codex 운영 비용 직접 차단. Codex CLI 도 본 도구 native 지원.
3. **Model Training/** — Phase 1 Python 코드. Phase 2 진입 직전 적용.

### Sub-brain CLAUDE.md 정합성 점검

본 도구는 우리 헌법의 다음 § 와 정합:
- **§3-AI 분업** — Explore subagent 위임 패턴이 우리 운영 모델과 일치
- **메타 행동 원칙 #2 (Simplicity First)** — 토큰·tool call 절감 = Karpathy RTK
- **메타 행동 원칙 #3 (Surgical Changes)** — `codegraph_impact` 로 변경 반경 *사전* 확인 = surgical 의 도구화
- **AI 결정 origin §** — 본 도구가 자체 instruction 을 `~/.claude/CLAUDE.md` 에 주입함. 도입 시 그 주입 내용을 *작가 확인 후 confirmed* 처리 필요.

### graphify 와의 구분 (vault 내 기존 도구 vs 신규 도구)

| 항목 | graphify (이미 도입) | **CodeGraph (신규)** |
|---|---|---|
| 대상 | *모든 입력* (코드·MD·PDF·video → 의미 망) | **코드만** (소스코드 AST·call graph 특화) |
| 추출 | AST (tree-sitter) + **LLM 의미 레이어** (inferred relations) | AST (tree-sitter) **only** (static, no LLM) |
| 저장 | `graphify-out/` (vault 측 산출물) | `.codegraph/codegraph.db` (project 측 SQLite + FTS5) |
| 통합 | Claude Code skill 트리거 | **MCP 서버** (Claude/Cursor/Codex/opencode/Hermes 즉시) |
| Sub-brain 용도 | vault 전체 의미 망 (위키 페이지·코드·문서 cross-link) | 프로젝트 내 코드 탐색 가속 |
| 갱신 | manifest.json mtime 기반 증분 | OS native file event 자동 sync |
| 비용 절감 증명 | 정성적 ("의미의 망") | **정량 (35%/59%/49%/70% 평균)** |

**역할 분담** (충돌 없음):
- `graphify` = 위키/지식 의미 망 (위키 페이지 cross-link, PDF/MD/video 흡수)
- `codegraph` = 코드 탐색 가속 (실제 *코딩 세션* 의 token/시간 절감)

→ 두 도구는 *직교*. 동일 프로젝트에 둘 다 켜둬도 됨 (graphify-out/ 과 .codegraph/ 폴더 충돌 없음).

### Hermes Agent 와의 시너지

CodeGraph 가 명시적으로 **Hermes Agent** 를 1급 지원 대상으로 표기. 우리 vault 가 [Hermes Agent — Nous Research 자가개선형 에이전트 플랫폼](../techniques/hermes-agent.md) 의 self-improving skill 패턴을 차용한 만큼, *기술 적합도 高*. Hermes 스킬이 `codegraph_*` MCP 도구를 곧장 호출 가능.

### 개념적 수확

1. **사전 인덱스 + lightweight 조회 분리** — 우리 위키의 hot.md 구조와 동일 발상 (자주 쓸 컨텍스트 미리 압축). 코드에 동일 패턴 적용.
2. **Framework-aware static resolution** — LLM 없이 정적 분석만으로 URL→handler 까지 추적. *LLM 호출 비용 0* 으로 라우팅 의미 추출. on-device LLM (OQ-004) 비용 모델에 reference.
3. **Auto-sync debounce 2 초** — Codex/Claude 가 코드 수정 직후 *바로* 다음 호출 시 최신 그래프 — *살아있는 인덱스* 패턴. 우리 vault 도 매 작업 끝 hot.md 갱신과 같은 발상.
4. **벤치마크 정직성** — Gin (150 파일) 에서 19% 마진 인정 — *언제 효과 작은지* 까지 공개. Sakana 의 failure honesty 패턴과 같음. → SKILL.md failure-honesty.md 작성 시 reference.
5. **CLAUDE.md 자동 주입 + 사용 가이드** — 도구가 *자기 자신의 사용 규칙* 을 헌법에 박제. 우리 헌법의 *AI 결정 origin §* HITL 스테이징과 정확히 같은 문제 — 외부 도구가 헌법을 *수정* 하면 *우리* 가 *검토* 해야.

---

## 운영 정책 🔒 LOCKED 2026-05-24 (브리프 §8 #3·#4 박제)

> 출처: hwiglija-tower-operating-protocol-brief §4·§8 — Codex/Gemini 가 hwigi-tower 운영하며 실증한 정책.

- **사용 트리거 한정** — *core 런타임 임팩트* 작업 (코어 클래스 변경·import 분석·refactor 영향 반경·call graph 추적) 에만. *docs-only* · 단순 값 편집 · 오타 · UI 텍스트 변경엔 **사용 금지** (codegraph 호출 자체가 토큰 낭비).
- **Stale 인덱스 = 증거 X** — `codegraph status` 가 stale 표시 시 *그 결과를 implementation evidence 로 사용 금지*. 반드시 `codegraph sync` 또는 `codegraph index --force` 후 fresh 상태에서만 결론. stale 결과 사용은 *환각 위험* 과 동급.
- **`codegraph install --yes` 금지** (헌법 자동 주입 차단 — CLAUDE.md)
- **`.codegraph/` commit 금지** (gitignore 의무, vault 이미 적용)
- **세션 보고 라인** (외부 AI 의무): `[CodeGraph] used yes/no — <baseline, fresh/stale status, key findings>`

### 병용 라우팅 — CodeGraph = Tier 1 (일상 손) 🔒 LOCKED 2026-06-28

[codebase-memory-mcp](codebase-memory-mcp.md) 와 *승자 택일 아님 — 강점 라우팅으로 병용* (2026-06-28 head-to-head 실측, `world-of-claudecraft-renewed` 13파일 4축). 한 줄 분담: **CodeGraph = 일상 손(빠름·토큰경량·코드 인라인·vault 통합) / codebase-memory = 정밀 뇌(콜그래프 정확·Cypher·아키텍처 지도·복잡도 메트릭).**

- **CodeGraph 가 기본값 (Tier 1)** — 코딩 세션 중 모든 quick lookup: `codegraph_context`·`callers`·`callees`(한 방에 소스까지)·`codegraph_impact`(file+line 그룹 가독). 세션/코드 변경 후 `codegraph sync`.
- **codebase-memory 로 에스컬레이션 (Tier 2)** = 아래일 때만 → 상세 [codebase-memory-mcp](codebase-memory-mcp.md) §병용 채택. ① 리팩토링·큰 변경 직전 `get_architecture`(Leiden seam) + Cypher 다중홉 ② 성능 핫패스(`transitive_loop_depth>=3`) ③ 오탐0 정밀 콜그래프/transitive 폐포 ④ Neo4j 학습 실습 ⑤ cross-repo.
- **가드**: 같은 질문 두 도구 중복 호출 금지. 둘 다 deferred MCP → 호출 안 하면 토큰 0(상주비용 없음).
- review_trigger: "더 큰 repo 실측 누적 후 / 또는 한쪽이 다른쪽 강점을 흡수(버전업)해 분담이 무의미해질 때 / 또는 더 나은 코드그래프 도구 출현 시"

## 적용 시 주의 (Sub-brain 헌법 정합)

### 헌법 침입 차단 — HITL 스테이징 적용

`codegraph install` 시 `~/.claude/CLAUDE.md` 와 프로젝트별 `CLAUDE.md` 에 instruction 자동 주입 시도. 본 vault 의 CLAUDE.md 는 *큐레이션된 헌법* — 자동 주입 허용 시 R-04 (AI origin 무표기) 위반.

**권장 절차**:
1. `--print-config` 또는 `--no-permissions` 로 *드라이런* — 어떤 instruction 이 어디에 주입될지 확인
2. 주입 텍스트를 `wiki/스테이징 영역<date>.md` 로 *수동* 박제 → 작가 검토
3. 작가가 어느 § 에 어떤 형태로 통합할지 *명시* → Claude (본 AI) 가 헌법에 반영 + `proposed_by: external_tool, confirmed_by: user, status: confirmed` origin 표기

### 인덱스 격리

`.codegraph/codegraph.db` 는 *프로젝트 산출물* — `.gitignore` 에 추가 권장 (vault repo 에 SQLite binary 박제 X).

### graphify 와 폴더 충돌 점검

- `graphify-out/` (graphify) vs `.codegraph/` (codegraph) — 폴더명 다름, 충돌 X
- 단 두 도구가 동시에 동일 파일 watch 시 *순서 의존성* 발생 가능. 우선 `codegraph` 단독 도입 → 1 주 운영 후 graphify 병행 검토.

---

## 열린 질문

- **Unity C# Full support** 로 표기됐지만 *MonoBehaviour 라이프사이클* (`Start/Update/OnEnable` 등) 같은 Unity 특수 패턴까지 엣지로 추출하는가? — 직접 테스트 필요 (hwigi-tower 에서 검증).
- Claude Code v2.1.145 가 벤치마크 기준. 우리가 쓰는 Opus 4.7 / Sonnet 4.6 동일 효과 받는가? — 동일 모델 family 이므로 대체로 적용 가능 예상.
- `codegraph_explore` 가 *Korean comment* (한국어 주석) 도 의미 있는 컨텍스트로 반환하는가, AST 노드 이름 위주인가? — Unity C# 한국어 주석 비율 高 프로젝트에서 확인.
- D-053 (hwiglija-tower-design-agenda 토픽 13) **OpenHands Executive Limb** 의 검증 루프와 결합 가능한가 — codegraph_impact 로 *NPC 변경 영향 반경* 을 사전 계산해 검증 범위 제한 → Docker 검증 비용 절감?

---

## 다음 학습 후보

- **tree-sitter 자체** — AST 파싱 엔진의 동작 원리 (Cargo · WASM 빌드, query DSL). 향후 graphify·codegraph 둘 다 디버그 시 필수.
- **MCP (Model Context Protocol)** — Anthropic 표준. 우리 vault 의 mcp__tolaria__* 도구도 같은 프로토콜. CodeGraph 의 MCP 서버 구현이 reference.
- **SQLite FTS5** — 풀텍스트 검색의 표준. Sub-brain vault 자체에 FTS5 인덱스 도입 시 reference.
- **Code2Vec / Code2Seq** — 코드를 *벡터* 로 임베딩하는 방향. CodeGraph 는 *static graph* 차원, 보완재.

---

## 연결된 페이지

- graphify — 자매 도구 (vault 의미 망 vs 코드 탐색 가속, 직교)
- [Hermes Agent — Nous Research 자가개선형 에이전트 플랫폼](../techniques/hermes-agent.md) — CodeGraph 1급 지원 대상, 시너지 高
- ai-game-roadmap — Phase 2 진입 직전 도입 후보 (Model Training/ + Unity 프로젝트)
- hwiglija-tower-AGENTS — Codex 운영 비용 절감 1순위 적용 대상
- openhands — D-053 자가 검증 루프와 `codegraph_impact` 결합 가능성
- CLAUDE.md — 외부 도구의 헌법 자동 주입 차단 절차 (HITL 스테이징)

---

> 프로젝트 적용 brief: hwiglija-tower-codegraph-brief (CodeGraph 도입 사례).
