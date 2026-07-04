---
created: 2026-07-04
updated: 2026-07-04
type: learning
tags: [agent-memory, retrieval, mcp, hooks]
source: https://github.com/jung-wan-kim/memory-bank
authors: [Jesse Vincent (upstream), jung-wan-kim (fork)]
year: 2026
category: method
---
<!-- Claude Code 대화 로그를 로컬 memory product로 묶은 memory-bank repo 해체 — 설치 대신 6개 패턴 추출(주입 안전 게이트가 핵심) -->
# memory-bank (conversation-memory layer) 해체

> ⚠️ 임시 — Codex 외주 해체(RETURN gate_pending) 기반. 작가 ③Gate 컨펌 전.

## 한 줄

`jung-wan-kim/memory-bank`(upstream `obra/episodic-memory` fork)는 Claude Code 대화 JSONL을 자동 수집→SQLite+sqlite-vec+FTS5 하이브리드 검색→LLM fact 추출→MCP 도구→세션 hook 주입까지 한 저장소에 묶은 **로컬 대화-기억 product**다. 연구적 새로움보다 *제품화 완성도*가 강점. **Sub-brain엔 설치하지 않는다** — 자동 injection이 vault의 provisional/confirmed/gate 권위 체계와 충돌하기 때문. 대신 *패턴만* 추출한다.

- 연구 새로움 3/10 · 제품화/운영통합 8/10 · Sub-brain 직접대체 3/10 · 작업 자산화 학습가치 8/10 (source-reported 자기평가, 미검증)
- clone HEAD: `90fbd3dcd84fbf0fc8e1fde971a8373e6b6735fc`

## 무엇인가

파이프라인: `sync → archive → parse(JSONL) → embed → SQLite/FTS/vector index → fact extract/consolidate → MCP tools → hook injection → analyze report → UI`.

- 원천 = `~/.claude/projects` (Codex/OpenCode source도 config로 부착 가능)
- CLI: `sync` / `search` / `stats` / `analyze`
- MCP 9종: `search` `read` `search_facts` `search_ontology` `ask_avatar` `trace_fact` `graph_stats` `cross_project_insights` `explore_graph` (annotation이 read-only/idempotent 쪽 — 검색 도구가 write처럼 굴지 않게 분리)
- Hook: SessionStart(background sync/consolidation) · SessionEnd(fact extract/export) · **UserPromptSubmit(`inject-context.sh`)**
- 임베딩 기본 모델 `Xenova/multilingual-e5-small` (e5 `query:`/`passage:` prefix 규칙)

## 추출할 6(+3) 패턴

Sub-brain이 가져갈 것은 repo 자체가 아니라 아래 패턴이다.

1. **하이브리드 검색 (FTS5 BM25 + vector) + embedding_version 게이트**
   - vector semantic search만 믿지 않고 FTS5/BM25를 exact-keyword backstop으로 병행 — vector miss·오탈자·정확 키워드를 보완.
   - 임베딩 모델이 바뀌면 old/new vector를 섞지 않는다. `embedding_version`을 query filter에 포함(모델 교체 시 vector-space 혼합 방지).
   - source-reported 성능(미검증): 예전 `LIKE` full-scan p50 3,178ms / p95 14,459ms → FTS5 BM25 전환 후 p50 2.9ms / p95 72.9ms. 저장소 self-report(`docs/perf-report-2026-06-14.md`), 독립 벤치 아님.

2. **Fact lifecycle (요약 노트가 아님)**
   - fact는 category(`decision`/`preference`/`pattern`/`knowledge`/`constraint`) · scope(project/global) · confidence(threshold 0.7) · revision · active/inactive flag · source exchange(provenance)를 가진다.
   - ranking = confirmation count + recency + scope bonus 혼합. `trace_fact`로 근거 대화까지 되돌아감(provenance-first recall).
   - → 단순 "요약 저장"과 명확히 구분. 출처 없는 memory는 오염원.

3. **한국어 fact 임베딩** — 영어 fact 옆에 `fact_kr`를 병행 저장해 한국어 query matching 보강. 한국어 작가에게 직접 유의미.

4. **Non-blocking hooks** — sync/extract/inject는 실패해도 exit 0으로 빠져 원 세션을 막지 않는다. memory 인프라가 본작업을 절대 깨지 않게.

5. **Deterministic coverage `analyze`** — "내 대화 분석해줘"를 LLM 감상으로 끝내지 않고 conversations/sessions/exchanges/projects/date-range/fact coverage/summary coverage를 *수치*로 audit. 자산화 판단을 vibes가 아닌 숫자로.

6. **⭐ Injection safety gate (가장 위험한 표면 = 핵심 교훈)**
   - `scripts/inject-context.js`가 사용자 prompt를 임베딩→관련 fact를 찾아 `📌 관련 과거 결정:` 블록으로 prompt에 주입한다. 강력하지만 **stale/wrong fact가 들어가면 Claude가 그걸 사실로 받아들인다.**
   - repo엔 주입 전 *authority-filter가 없다*. Sub-brain 적용 시 반드시 status(`gate_pending`/`confirmed`/`deprecated`)·confidence·recency·source·owner boundary를 injection 조건에 매핑해야 한다 → CLAUDE.md의 provisional/confirmed/owner 권위 체계와 결선.
   - 헌법 §"주입 표면(Injection Surface)/attention decay"와 직결 — *재노출 빈도로 규율을 살리는* 것과 *stale fact를 주입해 규율을 오염시키는* 것은 동전 양면. 자동 주입엔 반드시 게이트가 선행.

(추가 3: 7 scope isolation — project-scoped fact 보장량을 retrieval ranking에 둠 / 8 non-blocking과 별개로 session당 LLM call cap·spread sampling으로 비용 방어 / 9 provenance-first recall = `trace_fact`.)

## 한계 · Red Flags

- **Fork provenance** — GitHub는 `obra/episodic-memory` fork 표기, `package.json` author = Jesse Vincent. 흡수 시 원저자/현 owner 경계를 명시해야 함.
- **lockfile 없음** — 재현 install/test 감점. `npm test`는 clone에서 deps 미설치로 `vitest: command not found` 실패, 통과 미확인.
- **LLM-fact ≠ validated fact** — confidence threshold는 방어막이지 사실성 보증 아님.
- **parser tool_result 매칭 TODO** — 실행 provenance 완전하다고 말하면 안 됨.
- **Hue OS 공개면 격리 대상** — `ui/replacement-os.cjs`가 local terminal provider를 `spawn`, `vercel/hue-os`가 public tunnel proxy. `REPLACEMENT_OS_ACCESS_PASSWORD` 이 약한 하드코딩 기본값 + 4자리 auto-submit. 별도 threat model 전 기본 비활성.
- 성능·score 전량 repo self-report. 문서 drift(skill docs는 search/read 중심인데 README는 9 tool 주장) 가능.

## Delta (기존 Sub-brain 지식 대비)

- [codebase-memory-mcp](codebase-memory-mcp.md) = *코드베이스* 를 LSP/graph로 기억 / 본 노트 = *대화 로그* 를 기억. sibling(conversation-log memory).
- [Neo4j Agent Memory — Context Graph 기반 에이전트 메모리 입문](neo4j-agent-memory-context-graph.md) = Neo4j급 temporal KG(3층 agent memory) / memory-bank = SQLite+sqlite-vec+FTS5의 *로컬 운용성* 실용판. sibling(graph memory vs conversation-log memory).
- memory-bank의 진짜 delta = "메모리 구조 아이디어"가 아니라 **plugin/hook/MCP/skill까지 붙인 운영 통합**. 단, Sub-brain의 confirmed/provisional/gate_pending 권위 체계는 품지 못함.

## 학습→반영 (Absorb-to-Apply)

- **반영처 = Sub-brain 자신의 memory 등가물** — vault는 이미 `log.md`(=history/Progress) + `스테이징 영역/`(=Memory 등가) + `hot.md`(=현재 토픽)로 Dual-Track 등가 3중 구조를 갖는다(헌법 §Dual-Track). 위 6패턴은 그 구조를 개선할 *패턴 레퍼런스*로 park한다.
- **즉시 빌더/도구 변경 없음** — 억지 반영 X(Karpathy #2/#3). memory-bank 설치·MCP 상시화·자동 injection 도입 모두 미채택.
- 파킹 트리거: vault의 log/proposed-patches/hot 3중 구조에 *검색·audit·주입* 문제가 실측되면 위 패턴 중 해당분 재검토. 특히 어떤 형태로든 자동 fact 주입을 도입하려는 순간 = 패턴 6(injection safety gate) 선(先)적용 강제.

## 출처

- source: https://github.com/jung-wan-kim/memory-bank (commit `90fbd3d`)
- 해체 packet: `~/Documents/Codex/2026-07-04/memory-bank-analysis/outputs/` (RETURN + asset + source_status.tsv + SHA256SUMS). skill_candidate: `conversation-memory-system-teardown` (승인 대기).
