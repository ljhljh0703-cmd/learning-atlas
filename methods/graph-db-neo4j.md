---
created: 2026-06-18
updated: 2026-06-18
type: learning
tags: [graph-db, neo4j, cypher, graph-theory, gds, learning-notes, in-progress]
category: method
source: https://neo4j.com/docs/
---

# Graph DB / Neo4j — 지식 누적 노트 (학습 진행형)

> ⚠️ **in-progress** · 설계·로드맵 SSOT = graph-db-learning-brief. **본 노트 = 지식 누적처**(작가 공부 발판 + 작가가 알아낸 것 쌓는 곳). 아래 "시드 지식"은 vault Claude 사전지식 — *작가 공부로 검증·심화 대상*(맹신 X). 작가 발견은 §"작가 학습 입력"에 누적 → vault Claude ③Gate 후 본문 승격.

---

## 0. 학습 발판 (시드 지식 — 출발점, 작가가 공부로 확장)

### 0.1 graph theory 최소 어휘 (Phase 0)
- **노드(node/vertex)** = 개체. **엣지(edge/relationship)** = 노드 간 연결.
- **방향성**: directed(→, 작가 wikilink 같은 단방향) vs undirected. **가중치**: weighted(엣지에 수치).
- **속성(property)** = 노드/엣지에 붙는 key-value. **label/type** = 노드/엣지 분류.
- **degree** = 노드에 연결된 엣지 수(작가 graphify god node ≈ 高 degree/centrality). **path** = 노드 잇는 엣지 시퀀스.
- **property graph**(Neo4j: 노드·엣지에 속성/label) ↔ **RDF**(triple store: subject-predicate-object, SPARQL). 작가 vault ≈ property graph.

### 0.2 Neo4j 핵심 개념 (Phase 1)
- 데이터 = **노드(label·속성) + 관계(type·방향·속성)**. 스키마 유연(schema-optional).
- 쿼리 = **Cypher**(SQL의 graph 판). 시각적 패턴 매칭: `(a)-[:REL]->(b)`.
- **Neo4j Desktop**(로컬 GUI 무료) 또는 **Docker**(`neo4j:latest`)로 로컬 실행. Browser UI로 쿼리 시각화.

### 0.3 Cypher 치트시트 (Phase 1 — 작가 직접 실행하며 체득)
```cypher
// 생성
CREATE (n:Note {title: '첫 노트', type: 'learning'})
// 멱등 생성/병합 (적재 시 핵심 — 중복 방지)
MERGE (n:Note {path: 'wiki/me/identity.md'})
  ON CREATE SET n.title = 'identity'
// 관계 생성
MATCH (a:Note {path:'A.md'}), (b:Note {path:'B.md'})
MERGE (a)-[:LINKS_TO]->(b)
// 조회 (패턴 매칭)
MATCH (a:Note)-[:LINKS_TO]->(b:Note) WHERE a.type = 'project' RETURN a, b
// 경로
MATCH p = shortestPath((a:Note {title:'identity'})-[:LINKS_TO*]-(b:Note {title:'graphify'})) RETURN p
```
키워드: `CREATE`/`MERGE`/`MATCH`/`WHERE`/`RETURN`/`SET`/`DELETE`/`WITH`. 패턴 `()` 노드 `[]` 관계 `->` 방향 `*` 가변길이.

### 0.4 GDS (Graph Data Science) — graphify 재현 (Phase 4)
- **PageRank/Betweenness** = centrality → **god node**(graphify 등가).
- **Louvain/Leiden** = community detection → 클러스터(graphify community 등가).
- **Dijkstra/shortestPath** = 최단경로.
→ Phase 4 검증 = graphify가 주던 god nodes를 Neo4j GDS PageRank로 재현·대조.

### 0.5 GraphRAG 레이어 (Phase 5, 흡수 자산 연결)
- [Microsoft GraphRAG — Query-Focused Summarization on Narrative Private Data](../techniques/graphrag.md)(MS) = graph + LLM 검색. [Zep / Graphiti — Temporal Knowledge Graph for Agent Memory](../techniques/zep-graphiti.md) = temporal KG 에이전트 메모리. [CocoIndex — Incremental Data Pipeline for AI Agents](../techniques/cocoindex.md) = 증분 인덱싱.
- Neo4j는 vector index도 내장 → graph traversal + 임베딩 검색 결합 가능.

---

## 1. 학습 로드맵 (실행판 — brief §3 구체화)

| Phase | 공부할 것 | 자료(출발 포인터) | 작가 산출 → 나에게 |
|---|---|---|---|
| **0 어휘** | §0.1 graph theory·property graph vs RDF | Neo4j Graph Academy "Graph Theory" / 본 §0.1 | "내 vault를 graph 용어로 1문단" |
| **1 Neo4j 손에** | 설치·Cypher 기초(§0.3) | Neo4j Desktop + Graph Academy "Cypher Fundamentals"(무료) | 수동 노드5+링크 적재 스샷 |
| **2 모델링** | vault→graph schema | brief §4 B-1(초안 제공됨) | 확정 schema 다이어그램 |
| **3 파이프라인** | Python→Cypher 적재 | `wiki_graph_lint.py` 파서 재활용 | 전체 vault 적재 + broken link 쿼리 |
| **4 알고리즘** | GDS centrality·community(§0.4) | Graph Academy "GDS" | graphify god node ↔ PageRank 대조 |
| **5 GraphRAG** | graph+임베딩(§0.5) | Neo4j vector index 문서·[Microsoft GraphRAG — Query-Focused Summarization on Narrative Private Data](../techniques/graphrag.md) | "연결된 학습?" traversal 쿼리 |
| **6 이력서화** | 케이스 스터디 | html-publish 빌더·resume-brief | 포트폴리오 페이지 |

> 자료는 **Neo4j Graph Academy**(공식 무료 인터랙티브)가 1순위 — 설치+Cypher+GDS 코스 완비. 작가 공부 중 더 나은 자료 발견 시 §3에 제공.

---

## 2. 작가 학습 입력 (작가가 공부하며 알아낸 것 — 여기 누적)

> 작가가 Phase별 공부하며 발견·정리·질문한 것을 여기 append. vault Claude가 ③Gate(출처·정확성) 후 §0/본문 승격 + 로드맵 갱신.

- *(비어 있음 — 작가 Phase 0 시작 시 첫 입력)*

---

## 3. 작가가 제공할 자료·질문 (수신함)

> 작가가 "이 자료 봐" / "이거 막혔어" / "이 개념 흡수해" 줄 때 여기 기록 → paper-study 또는 직접 흡수.

- *(비어 있음)*

---

## 4. 열린 질문 / 막힌 곳

- ~~B-2 graphify ↔ Neo4j 역할 경계~~ **정리됨**(brief §4 B-2): graphify=휘발 즉석분석 / Neo4j=영속 쿼리백엔드, 보완. Phase 4서 god node↔PageRank 대조.
- vault 규모(수백 노트) 적재 성능·증분 갱신 → [CocoIndex — Incremental Data Pipeline for AI Agents](../techniques/cocoindex.md) 증분 패턴(Phase 3 참조).
- 기존 흡수 자산 Phase 연결 = brief §4 B-3 표(graphrag·zep-graphiti→P5, cocoindex→P3, codegraph→P2).

---

## 연결된 페이지
- graph-db-learning-brief(설계·로드맵 SSOT) · graphify(현 graph 도구·Phase 4 대조 기준) · [Microsoft GraphRAG — Query-Focused Summarization on Narrative Private Data](../techniques/graphrag.md)·[Zep / Graphiti — Temporal Knowledge Graph for Agent Memory](../techniques/zep-graphiti.md)·[CocoIndex — Incremental Data Pipeline for AI Agents](../techniques/cocoindex.md)(Phase 5 GraphRAG 참조) · resume-brief(Phase 6 자산화)
