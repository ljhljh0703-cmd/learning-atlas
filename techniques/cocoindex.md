---
created: 2026-05-03
updated: 2026-05-03
type: learning
category: techniques
source: https://github.com/cocoindex-io/cocoindex
tags: [cocoindex, incremental-indexing, etl, rag, mcp, codebase-context, agent-memory]
---

# CocoIndex — Incremental Data Pipeline for AI Agents

> cocoindex-io/cocoindex, Apache 2.0, PyPI `cocoindex` (v1 preview), Python 3.10-3.13 + Rust core.
> 슬로건: "Your agents deserve fresh context. Stop prompting. Start specifying" 류 — 정확히는 *"target = F(source)"* declarative ETL 모델.
> 핵심: **Δ (delta) 만 재처리** — 변경된 source 또는 변경된 transformation code 만 재실행, 나머지는 캐시.

## 1. 정체성

| 차원 | CocoIndex 의 위치 |
|------|------------------|
| 분류 | Live agent context 인프라 (incremental ETL/RAG pipeline) |
| 영감 비유 | "React for data engineering" — declarative state-driven |
| 멘탈 모델 | Target = F(Source). 사용자는 *원하는 target 상태* 만 선언, 엔진이 sync 유지 |
| 차별점 | 8 source 카테고리 → incremental engine → 6 target store. 모든 단계 lineage 추적 (target dot → source byte) |
| 한 줄 | "코드와 데이터가 변할 때마다 그 변경분만 재처리하는 production-grade RAG/벡터/그래프 인덱싱 엔진." |

## 2. 아키텍처

```
8 sources                  incremental engine                 6 targets
[Codebases]                                                  [Relational DB]
[Meeting Notes]                                              [Data Warehouse]
[Web / APIs]      →    @coco.fn(memo=True)      →            [Vector DB]
[File / Blob]          F: Source → Target                    [Graph DB]
[Databases]                                                  [Message Queue]
[Message Queues]                                             [Feature Store]
[Image / Video]    
[Voice / Transcripts]
```

**Memo decorator**: `@coco.fn(memo=True)` 로 hash(input) + hash(code) 캐시. 코드 또는 데이터 둘 중 하나라도 변경 시에만 재실행.

**CLI**:
```python
import cocoindex as coco
from cocoindex.connectors import localfs, postgres
from cocoindex.ops.text import RecursiveSplitter

@coco.fn(memo=True)
async def index_file(file, table):
    for chunk in RecursiveSplitter().split(await file.read_text()):
        table.declare_row(text=chunk.text, embedding=embed(chunk.text))

@coco.fn
async def main(src):
    table = await postgres.mount_table_target(PG, table_name="docs")
    table.declare_vector_index(column="embedding")
    await coco.mount_each(index_file, localfs.walk_dir(src).items(), table)

coco.App(coco.AppConfig(name="docs"), main, src="./docs").update_blocking()
```

처음 실행 = full backfill. 재실행 = 변경된 파일만 re-embed.

## 3. 4가지 핵심 속성

| 속성 | 의미 |
|------|------|
| Sub-second fresh | source 변경 → 1초 안에 target 반영 |
| 10x cheaper at scale | 10,000-row corpus 의 0.1% delta 만 재처리, 99.9% 캐시 |
| Explainable by default | target 의 모든 vector/row/node 가 source byte 까지 lineage 추적 가능. 디버그·감사·규제 친화 |
| Production-grade | Rust core, retry, exponential back-off, dead-letter queue, no-data-loss 보장 |

## 4. CocoIndex-Code (flagship) — AI 코딩 에이전트 직접 통합

별도 product 로 **MCP server** 제공. Claude Code / Cursor / 기타 MCP-aware 에이전트가 *모든 repo 내용을 즉시* 인지.

| 기능 | 효과 |
|------|------|
| AST-aware 청킹 | 함수·클래스 단위 의미 보존 |
| Live call graph | symbol·vector·chunk 모두 commit 마다 갱신 |
| Δ-only 재인덱싱 | 80-90% cache hit 주장 |
| Token 효율 | turn 당 70% 토큰 절감 주장 |
| Blast radius 분석 | 한 함수 변경의 영향 범위 |
| 지원 언어 | Python, TypeScript, Rust, Go |

→ Claude Code · Codex CLI 같은 도구의 codebase 인식이 약하면 (대형 repo) 본 MCP 가 직접 해결.

## 5. 8 source × 6 target 매트릭스 (실제 connector 가용성)

연결 가능 예시 (전체는 docs 참조):
- localfs / S3 / Google Drive (file/blob)
- Postgres / MySQL (relational)
- Kafka / StreamNative / Confluent (message queue)
- Neo4j / Kuzu / SurrealDB (graph)
- pgvector / LanceDB / Qdrant (vector)
- 파이프라인 자체는 OpenAI / Gemini 등 LLM 호출 ops 도 포함(외부 도구 사실) (예: HN trending 의 Gemini 2.5 Flash 토픽 추출)

## 6. 우리 프로젝트 매핑

### 6.1 hwigi-tower (비전 A)
- 직접 적용: 거의 없음. 단일 Unity 프로젝트, source 데이터가 13 회차 reflection + 5 메모리 파편 = cocoindex 임계 미달
- **간접 가능**: cocoindex-code MCP server 를 hwigi-tower repo 에 도입 → Codex 의 codebase 인식 개선 (현재 Unity-Skills 로 부분 해결 중). **마감 D-15 임박이라 도입은 마감 후 검토 권장**
- 예상 효과: turn 당 토큰 70% 절감 주장이 사실이면 *D-021 의 토큰 비용 관리* 와 직접 정합

### 6.2 mirofish-lab (비전 B)
- 직접 적용: 부분 가능. 시뮬레이션 결과·페르소나·시드 자료를 vector/graph DB 에 indexing 시 cocoindex 패턴 차용 가능
- **단**: MiroFish 자체가 GraphRAG + Zep 으로 indexing 내장. 중복 우려. EXP-001/002 결과 보고 결정
- **재사용 가능 패턴**: incremental Δ-only 가 시뮬레이션 *반복 실행* 시 비용 절감 (같은 시드로 modeling 만 변경 시 캐시 hit)

### 6.3 Sub brain 자체
- **흥미로운 가능성**: 위키 ~200 페이지가 1000+ 으로 누적되면 cocoindex-code 패턴으로 *내 위키* 위에 incremental semantic index 구축 가능
- 현재는 [seCall — AI 에이전트 세션을 위한 로컬 퍼스트 검색 엔진](../methods/secall.md) 의 hybrid 검색 + Obsidian 자체 검색으로 충분
- 임계: 1000+ 페이지 또는 작가가 매일 위키 검색 비용을 체감할 때
- 그 시점 도래 시 [Microsoft GraphRAG — Query-Focused Summarization on Narrative Private Data](graphrag.md) vs cocoindex 비교 후 선택

## 7. CocoIndex vs 학습한 다른 도구

| 도구 | 영역 | 동적성 | 우리 적용 |
|------|------|--------|-----------|
| [Microsoft GraphRAG — Query-Focused Summarization on Narrative Private Data](graphrag.md) | 정적 corpus QFS | 정적 (배치 인덱싱) | ❌ 임계 미달 |
| [Zep / Graphiti — Temporal Knowledge Graph for Agent Memory](zep-graphiti.md) | 동적 agent memory KG | 동적 (실시간 fact) | mirofish-lab v2 |
| **cocoindex** | 동적 source → target ETL | 동적 (Δ-only) | **cocoindex-code MCP 가 가장 유망** |
| [OASIS: Open Agent Social Interaction Simulations with One Million Agents](oasis.md) | 시뮬레이션 엔진 | 동적 (timestep) | mirofish-lab 본체 |

CocoIndex 의 자리: **데이터 신선도 인프라**. 다른 셋이 *무엇을* 한다면 cocoindex 는 *그것을 항상 최신으로 유지*.

## 8. 차용 가능 vs 흡수 (마감 고려)

### 즉시 (마감 D-15)
- ❌ 도입 X — Python 환경 + Postgres + 서비스 운용 비용 vs hwigi-tower 마감 압박

### 마감 후 검토 우선순위
1. **cocoindex-code MCP server** — Codex / Claude Code 의 hwigi-tower repo 인식 강화. 토큰 70% 절감 주장 검증 우선
2. **mirofish-lab incremental 패턴** — EXP-001/002 결과 indexing 시 차용
3. **Sub brain 위키 자체 indexing** — 1000+ 페이지 도래 시

### 흡수한 개념 (즉시 반영)
- **Target = F(Source) 멘탈 모델** — design-brief 의 컨텍스트 snapshot 도 같은 패턴 (SSOT 변경 시 brief 재생성 = "Δ-only")
- **Memoization 패턴** — Codex 가 같은 작업 반복 시 hash 기반 캐시 활용 권장 ([Codex CLI Prompting — 내재화 노트](../methods/codex-cli-prompting.md) §6 컴팩션과 결합)
- **Lineage 가시화** — progress.md 의 Files 항목에 *원본 트리거 결정 (D-NNN)* 도 명시하면 lineage 추적 강화 (적용 보류, 마감 후)

## 9. 출처

- Repo: github.com/cocoindex-io/cocoindex (Apache 2.0)
- Site: cocoindex.io
- PyPI: cocoindex (v1 preview, --pre 필요)
- 학습 일자: 2026-05-03
- 트리거: 작가 학습 요청, [Ouroboros — Spec-First Agent OS](../methods/ouroboros.md) 직후 비교 학습
