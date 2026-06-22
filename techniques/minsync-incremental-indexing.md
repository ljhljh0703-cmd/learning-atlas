---
created: 2026-06-15
updated: 2026-06-15
type: learning
tags: [incremental-indexing, vector-db, deterministic-id, content-defined-chunking, mark-and-sweep, rag, graphify, rust]
source: https://github.com/NomaDamas/MinSync
authors: [NomaDamas]
year: 2026
category: technique
---

# MinSync — 증분 벡터 인덱싱 기법 (경량 흡수 + 응용 대비 기록)

> **한줄**: Git 없이 `manifest.json`(size+mtime+SHA-256)로 변경을 탐지하고, **변경 청크만 재임베딩** + `seen_token` mark-and-sweep 으로 stale 벡터를 제거하며, txn/cursor 로 crash-safe 재개하는 Rust CLI(LanceDB). 검색 알고리즘이 아니라 **"인덱스를 안전·저렴하게 최신 유지하는 runtime"**.
> **흡수 성격**: research-relay 충실 외주(GPT, 2026-06-15) → ④Gate **코드 직접 대조 PASS**(`id.rs`·`manifest.rs` VERBATIM 전건일치, 환각 0). **경량 흡수** — 우리 시스템(Graphify/agentic-RAG)에 *지금 당장의 구체 반영처는 빈약*(아래 §적용 판단). 전이 개념 2개를 흡수 코어로, 기술 코어는 *향후 응용처 발생 시 적용 가능한 수준*으로 압축 기록(작가 결정 2026-06-15: "응용할 수 있는 곳에 응용 가능하게 따로 기록").

## 흡수 코어 — 전이 가능한 개념 2개

1. **run-token mark-and-sweep (stale 회계)**
   - 매 sync 마다 `sync_token` 발급 → 처리한 doc 에 `seen_token` 기록 → 끝나면 *이번 토큰이 아닌* 벡터를 source/path 필터로 삭제. (`src/sync/indexer.rs`, `src/sync/mod.rs:sync`)
   - **왜 가치**: "변경분만 추가"는 쉬워도 *없어진 것 제거*가 어렵다. run-token 으로 "이번에 안 보인 것 = stale" 회계가 깔끔.

2. **content-addressed deterministic ID (안정 캐시 키)**
   - `doc_id = sha256(source_id \0 path \0 chunk_schema_id \0 chunk_type \0 content_hash \0 dup_index)` (`src/id.rs:compute_doc_id`, Gate VERBATIM 확인). 중복 청크는 `content_hash\0heading_path` 카운터로 `dup_index` 증가.
   - **왜 가치**: 같은 내용 = 같은 ID → 재임베딩 skip·diff explain·캐시 무효화 범위 국소화가 공짜. 임베딩이 비싼 모든 파이프라인의 범용 패턴.

## 기술 코어 (압축 — 후일 적용용 레퍼런스)

- **변경탐지**: `ManifestFileEntry{size, mtime_ns, content_hash}`. size+mtime 동일 시 SHA-256 재계산 skip(hash 재사용), 아니면 whole-file SHA-256. diff = content_hash 비교 → Added/Modified/Deleted. (`src/manifest.rs:scan_with_baseline,diff` — Gate 확인)
- **증분 임베딩**: 기존 doc_id 는 metadata(`seen_token`/path/heading) 만 update, **신규 doc_id 만 batch embed → upsert**. (`src/sync/indexer.rs:index_file`)
- **CDC 청킹**: FastCDC-style gear rolling hash. `max=max_chunk_size.max(64)`, `avg=(max/2).max(32)`, `min=(avg/4).max(16)`; avg 전 strict mask / avg 후 loose mask; UTF-8 boundary 보정. small edit 시 downstream 경계 보존 → 재임베딩 범위 국소화. (`src/chunker/cdc.rs`)
- **crash-safe 순서**: lock → (stale txn 제거) → txn 기록 → 처리 → store.flush → cursor 저장 → manifest 저장 → txn 제거. ⚠ rollback replay 아님 — stale txn 은 제거 후 현 manifest 기준 재처리. (`src/sync/mod.rs`, `src/state.rs`)
- **스토어**: LanceDB `documents` 테이블, cosine, score=`1-distance`. ANN index = rows≥256 build / delta≥10,000 optimize. 임베더 = OpenAI(`/v1/embeddings`) 또는 로컬 TEI(`/embed`). (`src/vectorstore/lancedb_store/*`)
- **CLI**: `init / sync[--full --dry-run] / query / status / check / verify[--fix] / watch`.

## 적용 판단 (왜 경량인가 — 정직)

- **vs graphify**: 이미 `--update`(변경 파일만) + `--watch` 보유 → "변경분 처리" 자체는 **중복**. Graphify 는 *그래프 추출*(graph.json)이지 벡터 인덱스 아님 → 임베딩/청킹/LanceDB 레이어 **비대응**. 글로벌 skill 블랙박스 → 코드 이식 X. **유일 전이 = run-token sweep *개념*** → Graphify stale 약점(`graphify-out/` 수동 재빌드)에 설계 아이디어로만(필요 여부는 Graphify 삭제 처리 방식 확인 후).
- **vs [Gemini Agentic RAG & Sufficient Context Implementation](gemini-agentic-rag.md)**: 우리 agentic-RAG 는 *학습 노트*(검색 충분성 판정·query decomposition)이지 우리가 돌리는 청킹/인덱싱 파이프라인이 아님 → chunk-ID/CDC 적용할 **실재 시스템 부재**.
- 결론: 코드 품질 우수하나 *지금* 우리 스택에 직접 반영처 없음. 학습→반영 루프 과적용 가드 발동 → 순수 지식 + **조건부 적용 후보**로 기록.

## 적용 트리거 (응용처 발생 시 재방문)

- 우리가 **자체 RAG/벡터 검색 레이어를 구축**할 때 → §흡수코어 2개 + 기술코어 직접 채택(deterministic ID·CDC·run-token sweep).
- **Graphify 내부 stale 처리**를 손댈 수 있게 될 때 → run-token mark-and-sweep 이식 검토.
- 임베딩 비용이 실측 부담이 되는 **대량 문서 인덱싱**이 vault 운영에 들어올 때.
