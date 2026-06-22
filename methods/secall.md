---
created: 2026-04-22
updated: 2026-04-22
type: learning
tags: [tooling, search, obsidian, rust, mcp, second-brain, hybrid-search, korean-nlp]
source: https://github.com/hang-in/seCall
category: method
---

# seCall — AI 에이전트 세션을 위한 로컬 퍼스트 검색 엔진

*hang-in / Rust / AGPL-3.0 / v0.3.3 (2026-04-17 기준)*

> **AI NPC blueprint와의 직결성: 없음.** Sub brain 운용 도구로서의 직결성: **매우 높음**.
> 분류: method (도구), 적용성: 직접, 시급성: 단기.

내가 매일 쓰는 Claude Code + Gemini + ChatGPT 세션이 **불투명한 JSONL로 흩어져 있는 문제**를 정확히 정조준한다. Sub brain의 `wiki/` ↔ `raw/` 2계층 구조를 그대로 차용한 동족 프로젝트.

---

## 한 줄 요약

> Claude Code / Codex / Gemini / claude.ai / ChatGPT 세션을 SQLite FTS5 BM25 + Ollama BGE-M3 벡터 + RRF로 하이브리드 검색하고, 결과를 **Obsidian 호환 2계층 볼트** (raw/sessions + wiki + graph)로 저장하는 Rust CLI + MCP 서버 + REST + Obsidian 플러그인.

---

## 핵심 관찰

### 1. Sub brain과 동형(同形) 구조

| 항목 | seCall vault | 내 Sub brain |
|------|-------------|-------------|
| 원본 보관 | `raw/sessions/YYYY-MM-DD/` | `raw/` (이미 존재) |
| AI 생성 지식 | `wiki/projects/`, `wiki/topics/`, `wiki/decisions/` | `wiki/projects/`, `wiki/learnings/`, `wiki/thoughts/` |
| 그래프 | `graph/graph.json` | Obsidian native graph |
| 백링크 | `[[]]` | `[[]]` |
| frontmatter | `summary`, `host`, `session_type` | `created/updated/type/tags/source` |
| 변경 이력 | `secall log YYYY-MM-DD` | `wiki/log.md` (수동) |

→ **CLAUDE.md의 Ingest 워크플로우를 도구화한 것이 정확히 seCall**. 같은 발상의 두 구현.

### 2. 검색 파이프라인 = 진짜 핵심

- **BM25**: SQLite FTS5 + 한국어 형태소 (Lindera ko-dic / Kiwi-rs)
- **벡터**: Ollama BGE-M3 (1024차원) + usearch HNSW
- **RRF (k=60)** + **세션당 최대 2턴 다양성 강제** — 한 세션이 결과 독점하는 문제 해결
- **LLM 쿼리 확장** (`--expand`)

→ qmd(Tobi Lütke) 계보. Karpathy LLM Wiki 사상의 검색층.

### 3. 멀티 에이전트 통합 모델

`Session → Turn → Action` 단일 모델로 5종 파서 정규화:
Claude Code (JSONL), Codex CLI (JSONL), Gemini CLI (JSON), claude.ai (ZIP), ChatGPT (ZIP).

→ 내가 쓰는 **Claude+Gemini 분업** (professional에 명시) 양쪽 로그를 같은 인덱스에 합칠 수 있음.

### 4. 위키 백엔드가 플러그인

```bash
secall wiki update --backend claude|codex|ollama|lmstudio|gemini
```

→ "위키 자동 생성" 기능을 **로컬 LLM (Ollama/LM Studio)** 으로도 돌릴 수 있음. 토큰 비용 0.

### 5. `secall sync` = 통합 오케스트레이션

`git pull → reindex → ingest → wiki → graph → git push`

세션 종료 시 PostToolUse hook으로 자동 실행 가능. **CLAUDE.md의 "log.md 업데이트" 단계를 자동화**.

### 6. 세션 분류 (regex)

```toml
ingest.classification.rules
pattern = "^# Wiki Incremental Update Prompt"
session_type = "automated"
```

→ "위키 자동 업데이트 세션"은 임베딩 스킵 + 검색 결과 제외. **메타 세션이 검색을 오염시키지 않는다**.

### 7. Knowledge Graph

- 결정적 엣지 (LLM 불필요): `belongs_to`, `by_agent`, `uses_tool`, `same_project`, `same_day`
- 시맨틱 엣지 (Gemini/Ollama): `fixes_bug`, `modifies_file`, `introduces_tech`, `discusses_topic`
- MCP `graph_query` (BFS, 3홉)

→ Obsidian native graph보다 **세션 간 관계**를 풍부하게 추출.

### 8. MCP 서버

```json
{ "mcpServers": { "secall": { "command": "secall", "args": ["mcp"] } } }
```

→ Claude Code 내부에서 `recall`, `wiki_search`, `graph_query` 도구 즉시 사용. **이전 세션을 현재 세션에서 검색**.

---

## 내 생각 — 적용 관점

### 정직한 평가

**도입해야 한다.** 다음 이유에서:

1. **문제가 실재함** — 나도 이미 Claude Code 세션 100개+ 보유. 그 안의 사고/결정/디버깅이 검색 불가능 상태.
2. **2계층 vault가 Sub brain과 호환** — 충돌 없음. seCall vault를 별도 디렉토리에 두고, 의미 있는 토픽만 손으로 Sub brain `wiki/`로 승격하는 운영 가능.
3. **한국어 NLP 내장** — 다른 도구는 거의 없음.
4. **MCP 통합** — Claude Code에서 `recall`로 과거 세션 즉시 조회.

### 위험 / 검토 사항

| 위험 | 대응 |
|------|------|
| **AGPL-3.0** | 개인 사용/사내 사용 무관. 내가 수정/배포 시에만 viral. 도구로만 쓰면 무위험. |
| **vault 디렉토리 충돌** | Sub brain의 `raw/`와 seCall `vault/raw/sessions/`가 의미 다름. **seCall vault는 분리** (`~/Obsidian/seCall-vault/`) 권장. |
| **macOS Apple Silicon 빌드** | Rust 1.75+ + Ollama 필요. 빌드 자체는 안정. |
| **Ollama 미설치 시** | BM25만으로 동작 — 도입 진입 비용 낮음 |
| **세션 수집 권한** | `~/.claude/` 등 자동 감지. 민감한 세션은 ingest 전에 필터링 검토 필요. |
| **alpha~beta 단계** | v0.3.3, 활발히 개발 중. 깨질 가능성 있음 — Sub brain의 단일 진실 소스를 **seCall에 의존시키지 말 것**. |

### 운영 모델 제안 (Sub brain과의 분업)

```
Claude Code 세션 ──┐
Gemini CLI 세션 ───┼──► seCall vault (검색용 캐시, 휘발 가능)
ChatGPT export ────┘            │
                                │ 의미 있는 발견만
                                ▼
                       Sub brain wiki/ (영속, 손으로 큐레이션)
```

**원칙: seCall은 "기억", Sub brain은 "정체성".**
- seCall = 거대한 RAW + 자동 위키 (검색·발견)
- Sub brain = 큐레이션된 학습·성찰·정체성 (단일 진실 소스)

### 도입 단계 제안

1. **단기 (이번 주)**: `cargo install --path crates/secall` → `secall init` → 기존 Claude Code 세션 ingest → BM25만으로 검색 체험
2. **중기 (이달 내)**: Ollama + BGE-M3 추가, MCP hook 등록, `secall log` 일기 자동화
3. **장기**: 의미 있는 토픽 발견 시 → Sub brain `learnings/` 또는 `reflections/`로 손수 승격하는 의식(ritual) 정착

### 개념적 수확

1. **2계층 vault 패턴의 외부 검증**
   - 내가 직관으로 만든 `raw/` ↔ `wiki/` 구조가 **외부에서 동일하게 도달** (Karpathy LLM Wiki 계보).
   - → 이 구조가 우연이 아니라 "AI 시대 개인 지식관리"의 자연스러운 형태일 가능성.
2. **"세션 = 자산" 명제**
   - AI와의 대화는 휘발성으로 다뤄왔는데, seCall은 그것을 **인덱싱 가능한 자산**으로 본다.
   - → [Autoresearch — Karpathy의 자동 연구 루프](autoresearch-karpathy.md)의 "LLM에 대화한 모든 것을 기억시키는" 비전과 같은 줄.
3. **"스펙 파일 가족"의 보강**
   - [awesome-design-md — 브랜드별 DESIGN.md 69종 레퍼런스 컬렉션](awesome-design-md.md)에서 본 AGENTS.md ↔ DESIGN.md 패턴.
   - seCall은 vault 자체에 `summary` 같은 frontmatter spec을 도입 — 같은 계열 사고.

### 갤럽 강점 연결

traits "전략" — 동족 도구 비교 후 **Sub brain과 분리 운용**이라는 비표준 운영 모델 도출. "수집·보관·발견" vs "정체성·큐레이션"을 분업.

---

## 열린 질문

- seCall vault를 Sub brain과 **같은 git repo 하위**에 두면 충돌 없이 관리 가능한가? (아마 가능, `.gitignore`로 분리)
- `secall log` 자동 일기와 내 reflections 수동 성찰의 관계 — 자동 생성을 성찰의 출발점으로 쓰는 워크플로우 가능?
- ChatGPT export ZIP에 과거 1~2년 분이 있다면 — 한 번에 ingest해서 **과거 사고의 고고학** 가능?
- LM Studio + 로컬 모델로 위키 자동 생성 시 품질이 Claude/Codex와 얼마나 차이? (토큰 0의 매력)
- MCP `graph_query`가 ai-npc-blueprint Layer 4 메모리 시스템 설계에 참고가 될 부분 있는가? (세션 간 관계 추출 알고리즘)

---

## 다음 학습 후보

- **Karpathy LLM Wiki gist** — seCall과 Sub brain 양쪽의 사상적 원점
- **Tobi Lütke qmd** — seCall 검색층의 직접 선조
- **graphify (Safi Shamsi)** — Knowledge Graph 사상의 원천
- **MCP 사양** — seCall이 노출하는 도구를 직접 구현해볼 수 있는 수준까지
- **rmcp (Rust MCP SDK)** — MCP 서버 구현 패턴 학습
- **BGE-M3 임베딩 모델** — 한국어 포함 다국어 임베딩 표준

---

## 적용 아이디어

### 단기
- 설치 + Claude Code 자동 ingest + BM25 검색 체험 (1시간)
- MCP hook 등록 → 다음 Claude Code 세션부터 `recall` 사용

### 중기
- Ollama BGE-M3 추가 → 시맨틱 검색
- `secall log` 자동 일기를 reflections 작성의 시드로 사용
- 세션 분류 규칙으로 "에이전트 메타 작업"과 "실제 사고" 분리

### 장기
- ChatGPT/claude.ai export로 **과거 1~2년 사고 고고학** 프로젝트
- seCall vault를 별도 git repo로 분리, 멀티 기기 동기화 (노트북 ↔ 데스크톱)
- 의미 있는 위키 페이지 발견 시 Sub brain `learnings/`로 승격하는 주간 ritual 정착
- (장기 가능성) seCall fork — Sub brain 스키마 (frontmatter 형식)에 맞는 어댑터 추가

---

## 연결된 페이지

- [Autoresearch — Karpathy의 자동 연구 루프](autoresearch-karpathy.md) — "natural language program" + "LLM이 모든 것을 기억" 사상의 형제
- [DESIGN.md — 코딩 에이전트용 디자인 시스템 명세](design-md.md), [awesome-design-md — 브랜드별 DESIGN.md 69종 레퍼런스 컬렉션](awesome-design-md.md) — "스펙 파일 가족" 패턴의 같은 계보
- professional — Claude+Gemini 분업 양쪽 로그를 합칠 수 있는 도구
- [프로덕트 디자인 & UX 라이팅 — 학습 정리](../narrative/product-design-and-ux-writing.md) — 검색 결과 UX (Obsidian 플러그인 뷰) 학습 후보
- index — Sub brain 자체의 메타 도구 컬렉션

---

## 출처

- 저장소: <https://github.com/hang-in/seCall>
- 라이선스: AGPL-3.0
- 영감 원천:
  - [Karpathy LLM Wiki gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
  - [Tobi Lütke qmd](https://github.com/tobi/qmd)
  - [graphify](https://github.com/safishamsi/graphify)
- 현재 버전: v0.3.3 (2026-04-17)
