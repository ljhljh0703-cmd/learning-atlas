---
created: 2026-06-20
updated: 2026-06-28
type: learning
tags: [code-intelligence, knowledge-graph, mcp, tree-sitter, lsp, agent-tool, graph-db]
source: https://github.com/DeusData/codebase-memory-mcp
authors: [DeusData]
year: 2026
doi: arXiv:2603.27277
category: method
---

# codebase-memory-mcp

코드 레포지토리를 지식 그래프로 인덱싱해 AI 에이전트에 구조적 코드 이해를 제공하는 MCP 서버. 순수 C, 단일 정적 바이너리, 의존성 0. 14 MCP 도구, 158개 언어, MIT.

arXiv 논문 결과: 실제 31개 레포 평가 — 답변 품질 83%, file-by-file 대비 토큰 10× 절감, 도구 호출 2.1× 절감.

**분류**: methods/ — 도구 (코드 레포 분석용)

---

## 기존 vault와의 위치

- [CodeGraph — AI 코딩 에이전트용 코드 지식 그래프 MCP 서버](codegraph.md) — 같은 도메인(코드 지식 그래프 MCP). 우리 세션에 이미 설치돼 있음. codebase-memory-mcp는 대조군/보완 도구.
- graphify — 다른 도메인 (vault 마크다운 노트 그래프). README도 "similar in spirit to graphify's `graphify-out/`"라고 명시.

**도입 판단**: 이미 codegraph 있음 → felt-need 검증 후 결정. 지금은 개념/delta 흡수.

---

## 핵심 구조

```
src/
  main.c              MCP stdio 서버 + CLI + install/update/config
  mcp/                14 MCP 도구 (JSON-RPC 2.0, 세션 감지, 자동 인덱스)
  store/              SQLite 그래프 (노드·엣지·순회·검색·Louvain)
  pipeline/           다단계 인덱싱 (structure→definitions→calls→HTTP→config→tests)
  cypher/             Cypher 쿼리 렉서·파서·플래너·실행기
  watcher/            백그라운드 자동 동기화 (git polling, 적응형 인터벌)
  foundation/         플랫폼 추상화 (threads, filesystem, memory)
internal/cbm/         tree-sitter 문법 158종 (vendored, 바이너리 컴파일)
```

인덱스: `~/.cache/codebase-memory-mcp/` (SQLite WAL 모드, ACID 안전). 팀 공유 아티팩트 `.codebase-memory/graph.db.zst` 레포에 커밋 가능.

---

## 2계층 분석 파이프라인 (가장 중요한 아키텍처)

```
[모든 158개 언어] Tree-sitter pass (신택틱, 빠름)
    → 정의·호출·임포트 추출
        ↓
[9개 언어] Hybrid LSP pass (타입 인지, tree-sitter 위에 추가)
    → CALLS·USAGE·RESOLVED_CALLS 엣지를 타입 정보로 정밀화
```

**왜 Hybrid LSP가 필요한가**: tree-sitter만으로는 `user.profile.display_name()` → `Profile.display_name` (3 모듈 거리) 해석 불가. import 그래프·제네릭·상속·stdlib 타입 추적이 안 됨.

**Hybrid LSP 구현**: tsserver/pyright/gopls/Roslyn/rust-analyzer의 타입 해결 알고리즘을 경량 C로 재구현해 바이너리에 임베딩. 언어 서버 프로세스 불필요.

| 언어 | LSP 계층이 처리하는 것 |
|------|----------------------|
| Python | imports·제네릭·`@property`·SQLAlchemy/Pydantic·isinstance 타입 좁히기 |
| TypeScript/JS/JSX/TSX | 제네릭·JSX 컴포넌트·`.d.ts`·메서드 체이닝 반환 타입 |
| PHP | 네임스페이스·trait·late-static-binding·PHPDoc |
| C# | global usings·record·LINQ·`var` 추론 |
| Go | 패키지별 cross-file 레지스트리·제네릭·embedded struct |
| C/C++ | 매크로·`typedef`·템플릿·auto 추론 |
| Java | 클래스 계층·오버로드·람다·JDK stdlib |
| Kotlin | extension function·scope function·data class |
| Rust | trait·`impl`·UFCS·derive 매크로 |

---

## 번들 시맨틱 검색 (API 키 0)

Nomic `nomic-embed-code` 임베딩 (40K 토큰, 768d int8)을 바이너리에 컴파일. Ollama도 Docker도 API 키도 불필요.

**11-signal 복합 스코어링**: TF-IDF, RRI, API/Type/Decorator 시그니처, AST 프로파일, 데이터 플로우, Halstead-lite, MinHash, 모듈 근접도, 그래프 확산.

> ⚠️ **검증 뉘앙스 (2026-06-28 clone)**: `vendored/nomic/code_vectors.bin` 실재 확인. 단 이건 **토큰 벡터 lookup 테이블**이지 런타임 트랜스포머 추론이 아니다 — "시맨틱"의 실체는 위 11-signal 융합이고 nomic 벡터는 그중 1신호. 즉 신경망 임베딩 검색이라기보다 **그래프·통계 신호 융합**. 강점이지만 "AI 임베딩" 워딩은 살짝 부풀려진 것. (cold-verify-before-adopt)
>
> ✅ **외부 검증 (2026-06-28, arXiv 2605.15184 [Is Grep All You Need? — 에이전트 검색에서 grep vs 벡터 RAG (arXiv 2605.15184)](../techniques/agentic-search-grep-vs-vector.md))**: "에이전트 검색에서 grep이 벡터 RAG보다 일반적으로 높은 정확도" 실증. → 이 도구가 순수 벡터에 안 기대고 grep/lexical/그래프 **11-signal 융합**을 핵심 엔진으로 둔 게 *약점이 아니라 검증된 옳은 설계*. 위 caveat은 "과장 워딩" 지적일 뿐, *설계 자체는 외부 ground-truth와 정합*. (단 논문 뉘앙스 = "검색방법 < 하네스 설계" — 도구 가치의 본질은 PreToolUse hook 같은 *하네스 통합*.)

---

## 팀 공유 그래프 아티팩트

`.codebase-memory/graph.db.zst` = zstd 압축 SQLite 스냅샷. 레포에 커밋하면 팀원이 재인덱싱 스킵.

- **Best tier**: `zstd -9` + index strip + `VACUUM INTO` (명시적 `index_repository` 시)
- **Fast tier**: `zstd -3` (watcher 증분 업데이트)
- `.gitattributes` `merge=ours` 자동 설정 → 바이너리 merge 충돌 없음

---

## 14 MCP 도구

| 카테고리 | 도구 |
|---------|------|
| 인덱싱 | `index_repository`, `list_projects`, `delete_project`, `index_status` |
| 쿼리 | `search_graph`, `trace_path`, `detect_changes`, `query_graph`, `get_graph_schema`, `get_code_snippet`, `get_architecture`, `search_code` |
| 기타 | `manage_adr` (아키텍처 결정 기록 CRUD), `ingest_traces` (런타임 트레이스 → HTTP_CALLS 엣지 검증) |

`get_architecture` = 언어·패키지·라우트·hotspot·클러스터·ADR 한 번에 반환.

**Cypher-like 쿼리** (`query_graph`): read-only openCypher 서브셋. `MATCH`, `WHERE`, `RETURN`, `WITH`, `UNION`, `CASE`, 변수 길이 경로 `[*1..3]`, `EXISTS { }`, 집계 함수.

---

## 그래프 데이터 모델

**노드**: `Project`, `Package`, `Folder`, `File`, `Module`, `Class`, `Function`, `Method`, `Interface`, `Enum`, `Type`, `Route`, `Resource`

**엣지 (주요)**: `CALLS`, `IMPORTS`, `DEFINES`, `IMPLEMENTS`, `INHERITS`, `HTTP_CALLS`, `ASYNC_CALLS`, `EMITS`, `LISTENS_ON`, `DATA_FLOWS`, `SIMILAR_TO` (MinHash+LSH), `SEMANTICALLY_RELATED`

**Infrastructure-as-code**: Dockerfile·K8s·Kustomize가 `Resource`/`Module` 노드로 인덱싱. `IMPORTS` 엣지로 오버레이 연결.

---

## 11 에이전트 자동 감지

`install` 명령 한 번으로 설치된 에이전트 전부 자동 설정:

| 에이전트 | 설정 파일 | Hooks |
|---------|----------|-------|
| Claude Code | `.claude/.mcp.json` + 4 Skills | PreToolUse (Grep/Glob) |
| Codex CLI | `.codex/config.toml` + `AGENTS.md` | SessionStart |
| Gemini CLI | `.gemini/settings.json` + `GEMINI.md` (외부 도구 지원 표) | BeforeTool + SessionStart |
| Antigravity | `.gemini/config/mcp_config.json` + `AGENTS.md` (외부 도구 지원 표) | SessionStart |
| OpenCode | `opencode.json` + `AGENTS.md` | — |
| Aider, KiloCode, VS Code, Zed, OpenClaw, Kiro | 각 설정 파일 | — |

**Claude Code PreToolUse hook**: `Grep`/`Glob` 인터셉트 → indexed 심볼 매칭 시 `search_graph` 결과를 `additionalContext`로 inject. 항상 exit 0 (non-blocking). `Read`는 인터셉트 안 함 (read-before-edit invariant 보호).

---

## codegraph vs codebase-memory-mcp delta

| 기능 | codegraph (기존) | codebase-memory-mcp (신규) |
|------|-----------------|---------------------------|
| Hybrid LSP | 미확인 | ✅ (9개 언어, 타입 해결) |
| 번들 시맨틱 검색 | 미확인 | ✅ (Nomic 임베딩, API 키 0) |
| 팀 공유 아티팩트 | ❌ | ✅ (`.db.zst` git 커밋) |
| Cross-repo intelligence | ❌ | ✅ (`CROSS_*` 엣지) |
| ADR 관리 | ❌ | ✅ (`manage_adr`) |
| IaC 노드 | 미확인 | ✅ (Dockerfile·K8s·Kustomize) |
| 3D 시각화 UI | ❌ | ✅ (localhost:9749, UI 바이너리) |
| 언어 수 | 미확인 | 158 (tree-sitter 전부 vendored) |
| 퍼포먼스 공개 | ❌ | ✅ (arXiv 2603.27277, 83% 품질) |

→ **Hybrid LSP + 번들 임베딩** 이 두 가지가 가장 큰 기술 delta.

---

## 성능 수치 (arXiv 기반)

| 지표 | codebase-memory-mcp | file-by-file 비교 |
|------|--------------------|--------------------|
| 토큰 절감 | ~3,400 (5 구조 쿼리) | ~412,000 |
| 답변 품질 | 83% (31 레포) | — |
| 도구 호출 | 2.1× 절감 | — |
| Linux 커널 인덱싱 | 3분 (28M LOC, 75K 파일) | — |
| Cypher 쿼리 | <1ms | — |
| `trace_path` (depth=5) | <10ms | — |

---

## 검증 보강 (2026-06-28, clone 통독)

초판(2026-06-20)은 README 기반 — delta 표에 "미확인" 다수. 이번에 repo를 직접 clone·통독해 사실 검증([WebFetch 는 lossy 요약 — 충실 학습은 clone 통독](webfetch-is-lossy-clone-for-fidelity.md)):

- **실재·본격 확인**: `src/` 61,334줄 C (15개 모듈: cypher·semantic·store·pipeline·mcp·watcher·traces·ui·git·simhash 등), vendored tree-sitter 160 파서. `semantic.c` 58KB. vaporware 아님.
- **벤치마크 = self-reported**: `docs/BENCHMARK.md` 방법론은 투명(63언어×12문항·PASS/PARTIAL/FAIL·N/A 제외·실제 OSS repo·Q10 properties=PARTIAL로 약점도 정직). **단 도구 저자 자체 채점**(독립 평가 아님). arXiv 83%/10×/2.1× 주장은 본문 미검증(컷오프 後 논문).
- **시맨틱 검색 과장**: 위 §"번들 시맨틱 검색" 경고 참조 — 번들 임베딩은 lookup 테이블, 11-signal 융합이 실엔진.
- **Cypher 엔진 자체 구현 확인**: `src/cypher/` lexer→parser→planner→executor. openCypher 읽기 서브셋을 C로 구현, 미지원 구문은 빈 결과 대신 `unsupported …` 에러.

## 학습→반영 루프

**반영처 3곳:**

1. **[CodeGraph — AI 코딩 에이전트용 코드 지식 그래프 MCP 서버](codegraph.md)** — codebase-memory-mcp를 대조군으로 병기. Hybrid LSP·번들 임베딩이 delta. 도입 felt-need 체크 시 비교 기준. (도구 *교체*는 작가 결정 — R-04, 헌법 §외부도구정책. 자동반영 X.)
2. **[Graph DB / Neo4j — 지식 누적 노트 (학습 진행형)](graph-db-neo4j.md) / graph-db-learning-brief** 🆕 — 이 repo는 작가 Neo4j 학습의 **production 참조 구현체**: ① "Cypher 쿼리 엔진을 C로 어떻게 만드나"(`src/cypher/`) ② 그래프 알고리즘 실물(Louvain 커뮤니티·MinHash+LSH near-clone·graph diffusion·dead-code `NOT EXISTS{}`) ③ graphify와 같은 "입력→그래프→질의" 철학의 다른 구현 = 대조 학습. 면접 talking 자산. → 작가 Phase 진행 시 §2 시드로 인출.
3. **agent-harness** — PreToolUse hook으로 `Grep`/`Glob` 인터셉트 + structured context inject 패턴. H-14 OBSERVE(검증 증거 채증 매체) 보강 후보. `Read`는 건드리지 않음 = read-before-edit invariant 존중.

**도입 트리거**: codegraph로 해결 안 되는 타입 추론 문제 명확히 발생 시 OR cross-repo 분석 필요 시.

---

## 도입 검토 — CodeGraph 비교 셋업 (2026-06-28, 작가 승인 설치)

**설치 완료 (안전모드)**: 작가 승인 → `install.sh --skip-config`로 **바이너리만** 설치(`install.sh` line 193 검증 — 침습적 `install -y` 스킵, 11에이전트 config·hook **미접촉**). 위치 `~/.local/bin/codebase-memory-mcp` v0.8.1(serverInfo 0.10.0). 체크섬 검증됨.

**MCP 등록**: `~/.claude.json` top-level `mcpServers`에 1줄 추가(CodeGraph와 동일 방식). 백업 `~/.claude.json.bak-2026-06-28`.
```json
"codebase-memory-mcp": { "type": "stdio", "command": "<local-path> "args": [] }
```
- MCP 핸드셰이크 직접 검증 ✅ — 14 도구 응답(index_repository·search_graph·query_graph·trace_path·get_code_snippet·get_graph_schema·get_architecture·search_code·list_projects·delete_project·index_status·detect_changes·manage_adr·ingest_traces).
- 현 세션 등록 3종: `tolaria`(vault)·`codegraph`(npm v0.9.3, `serve --mcp`, vault 이미 인덱싱 `.codegraph/codegraph.db` 122MB)·`codebase-memory-mcp`(신규).

**제거 방법**(되돌리기): `.claude.json`에서 `codebase-memory-mcp` 키 1줄 제거(백업으로 복원 가능) + `rm ~/.local/bin/codebase-memory-mcp`. config/hook은 애초에 안 건드려서 잔재 0.

---

## 병용 채택 — head-to-head 결론 (2026-06-28, 작가 확정) 🔒

**판정: 승자 택일 X → 강점 라우팅 병용.** [CodeGraph — AI 코딩 에이전트용 코드 지식 그래프 MCP 서버](codegraph.md) 와 역할이 겹치지 않고 다르다. 실측 = `world-of-claudecraft-renewed` 13파일(3,910 LOC) 동일 repo 양쪽 인덱싱.

| 축 | 승 | 근거(실측) |
|---|---|---|
| ① 타입/콜그래프 정확도 | **codebase-memory** | `movePlayer` 직접 callee 12개 정답 → codebase-memory 12/12(함수만) + transitive 폐포. CodeGraph 12 + 오탐 3(`GameState`/`Direction`/`MoveLogEntry`=타입참조), depth-1. |
| ② 토큰/속도 | **CodeGraph** | 다듬은 markdown + 코드 인라인. 인덱스 282노드/154ms. RTK 친화. (codebase-memory=1,688노드, 밀도높은 JSON, 무겁다.) |
| ③ Cypher 표현력 | **codebase-memory** 압승 | 가변길이 `[:CALLS*1..3]` 다중홉 도달성·복잡도(`transitive_loop_depth`) 쿼리 실동작. CodeGraph 쿼리언어 전무. |
| ④ 셋업 마찰 | 무승부 | CodeGraph=CLI init+index, repo에 `.codegraph/` 씀(+증분 `sync`). codebase-memory=MCP 단일호출, repo 무흔적. |

보너스 delta: codebase-memory만 `get_architecture`(Leiden 클러스터·layer·boundary) + 함수별 복잡도 메트릭 전량.

**역할 분담 (Tier)** — 진입점·일상 라우팅은 [CodeGraph — AI 코딩 에이전트용 코드 지식 그래프 MCP 서버](codegraph.md) §병용 라우팅(Tier 1) 참조.
- **codebase-memory = Tier 2 정밀 뇌 (에스컬레이션 전용)**: ① 리팩토링·큰 변경 직전 `get_architecture` + Cypher 다중홉 ② 성능 핫패스 `query_graph(transitive_loop_depth>=3 OR linear_scan_in_loop>=1)` ③ 오탐0 정밀 콜그래프 `trace_path depth=N` ④ **Neo4j 학습 실습**(Cypher 직접 연습 = graph-db 트랙 시드·면접 자산, [Graph DB / Neo4j — 지식 누적 노트 (학습 진행형)](graph-db-neo4j.md)) ⑤ cross-repo(`CROSS_*`).
- **주기 응용**: 코드세션 시작=CodeGraph `sync` / 큰 디스패치·리팩토링 직전 1회=codebase-memory `get_architecture`+영향 Cypher(dispatch-builder 사전검토 합류) / 주간 회고=복잡도 Cypher 1회(부채 추적).
- **가드**: 중복호출 금지(기본 CodeGraph 1회, 트리거 시만 Tier 2). 둘 다 deferred → 호출 안 하면 토큰 0. 벤치는 self-reported caveat 유지.

review_trigger: "더 큰 repo 실측 누적 후 / 한쪽이 다른쪽 강점 흡수(버전업) 시 / 더 나은 도구 출현 시 — 분담 재검토. (작가 방향: 계속 테스트하며 성장·더 나은 기술 상시 차용.)"
