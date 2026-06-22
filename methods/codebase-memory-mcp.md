---
created: 2026-06-20
updated: 2026-06-20
type: learning
tags: [code-intelligence, knowledge-graph, mcp, tree-sitter, lsp, agent-tool]
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
| Gemini CLI | `.gemini/settings.json` + `GEMINI.md` | BeforeTool + SessionStart |
| Antigravity | `.gemini/config/mcp_config.json` + `AGENTS.md` | SessionStart |
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

## 학습→반영 루프

**반영처 2곳:**

1. **[CodeGraph — AI 코딩 에이전트용 코드 지식 그래프 MCP 서버](codegraph.md)** — codebase-memory-mcp를 대조군으로 병기. Hybrid LSP·번들 임베딩이 delta. 도입 felt-need 체크 시 비교 기준.
2. **agent-harness** — PreToolUse hook으로 `Grep`/`Glob` 인터셉트 + structured context inject 패턴. H-14 OBSERVE(검증 증거 채증 매체) 보강 후보. `Read`는 건드리지 않음 = read-before-edit invariant 존중.

**도입 트리거**: codegraph로 해결 안 되는 타입 추론 문제 명확히 발생 시 OR cross-repo 분석 필요 시.
