---
created: 2026-04-28
updated: 2026-04-28
type: learning
category: techniques
source: https://arxiv.org/abs/2501.13956
authors: Rasmussen, Paliychuk, Beauvais, Ryan, Chalef (Zep AI, 2025)
tags: [zep, graphiti, knowledge-graph, agent-memory, temporal, bi-temporal, neo4j, generative-agents, vision-b]
---

# Zep / Graphiti — Temporal Knowledge Graph for Agent Memory

> Rasmussen et al. 2025 (arXiv 2501.13956). MemGPT 대비 DMR 94.8% vs 93.4%, LongMemEval +18.5% 정확도 / -90% 지연.
> **Zep** (commercial SaaS, getzep.com) ≠ **Graphiti** (오픈소스 엔진, github.com/getzep/graphiti). 학습 가치는 **Graphiti** 에 있다.

---

## 1. 정체성 — 정확히 무엇인가

| 차원 | 정확한 위치 |
|------|-----------|
| Zep | LLM agent memory **commercial SaaS** (getzep.com) |
| Graphiti | Zep 의 **오픈소스 엔진** (github.com/getzep/graphiti, Apache 2.0) — temporally-aware dynamic KG |
| 차별점 | bi-temporal model (T vs T') + edge invalidation + 3-tier hierarchical KG + 3 search × 5 reranker |
| 비교 대상 | MemGPT (DMR baseline 94.4%), [Microsoft GraphRAG — Query-Focused Summarization on Narrative Private Data](graphrag.md) (Microsoft), AriGraph, LightRAG |
| 근간 | Neo4j (그래프 DB), BGE-m3 (BAAI 임베딩+리랭킹), gpt-4o-mini (KG 구축) |

**한 줄**: *"non-lossy episodic + 추출 semantic + 군집 community 의 3층 KG 위에, 시간 두 축 (event T vs ingestion T') 과 fact invalidation 을 운용하는 LLM agent memory 엔진."*

---

## 2. 논문 메타

- **arXiv**: 2501.13956v1, 2025-01-20
- **저자**: Preston Rasmussen, Pavlo Paliychuk, Travis Beauvais, Jack Ryan, Daniel Chalef (전원 Zep AI)
- **선행 연구 인용**:
  - MemGPT (Packer et al. 2024) — 직접 비교 대상
  - GraphRAG (Edge et al. 2024, Microsoft) — community detection 영감
  - AriGraph (Anokhin et al. 2024) — episodic + semantic 분리 영감
  - Reflexion (Shinn et al. 2023) — 추출 시 hallucination 감소 기법 차용
  - LightRAG (Guo et al. 2024) — community search 패턴 비교

---

## 3. Graphiti 아키텍처 — 3층 KG

`G = (N, E, φ)` 에서 N = 노드, E = 엣지, φ: E → N × N (incidence 함수). 3 hierarchical tier:

### 3.1 Episode Subgraph (Gₑ) — non-lossy 원본

- **Episodic node** = 원본 입력 단위 (message / text / JSON)
- **Episodic edge** = episode → 그것에서 추출된 entity 노드를 연결
- 양방향 인덱스: semantic artifact ↔ source episode 추적 가능 (인용·근거 추적)
- **non-lossy** — 원본 손실 없음

### 3.2 Semantic Entity Subgraph (Gₛ) — 추출 사실

- **Entity node** = episode 에서 추출+해소된 엔티티 (1024-d 임베딩)
- **Entity (semantic) edge** = 두 엔티티 사이의 fact (관계)
- **Hyper-edge 지원** — 같은 fact 가 다른 episode 에서 여러 번 추출되면 멀티-엔티티 fact 모델링

### 3.3 Community Subgraph (G𝒸) — 고차 구조

- **Community node** = 강하게 연결된 엔티티들의 클러스터
- 군집 알고리즘 = **Label Propagation** (Leiden 아님 — 동적 확장 위해)
  - 신규 엔티티 1개 추가 시: 이웃 community 중 plurality 따라 즉시 흡수
  - 단점: drift 누적 → 주기적 전체 refresh 필요
- 각 community 는 LLM map-reduce summary 보유
- **Community name** 자체도 임베딩되어 코사인 검색 가능

→ 인지심리학의 *episodic memory* (사건) + *semantic memory* (개념) 분리 미러링.

---

## 4. Bi-Temporal Model — 핵심 차별점

대부분 KG는 시간을 단일 축으로 본다. Graphiti 는 **두 축**:

| 축 | 의미 |
|----|------|
| **T** (event timeline) | 사건이 *실제로 일어난* 시간 (대화 메시지의 t_ref) |
| **T'** (transactional timeline) | 데이터가 *시스템에 들어온* 시간 (DB 감사 표준) |

각 fact (edge) 는 **4 timestamp** 보유:

- `t'_created` — 시스템 생성 시각 (T')
- `t'_expired` — 시스템 무효화 시각 (T')
- `t_valid` — 사실이 참이 *되기 시작한* 시각 (T)
- `t_invalid` — 사실이 *거짓이 된* 시각 (T)

→ **상대 시간 표현 처리 가능** ("지난주", "두 달 전") — reference timestamp + LLM 추론으로 절대 시간 환산.

---

## 5. Edge Invalidation — fact 가 모순될 때

새 edge 추가 시 LLM 이 의미 유사한 기존 edges 와 비교 → 시간 겹침 + 모순 검출되면 기존 edge 의 `t_invalid` 를 invalidating edge 의 `t_valid` 로 설정.

→ "Alice 는 Bob 의 직장 동료" 후 "Alice 는 Bob 의 전 직장 동료" 입력 시: 첫 fact 가 invalidate 되고 timeline 위에 *기간* 만 남는다. **historical 관계 보존 + 현재 상태 분리** 동시 달성.

---

## 6. Memory Retrieval — f(α) = χ(ρ(φ(α)))

쿼리 α (string) → 컨텍스트 β (string) 의 3 단계 함수 합성:

### 6.1 Search φ (3 방식)

| 방식 | 검색 대상 | 의미 |
|------|----------|------|
| **φ_cos** (cosine semantic) | edges, entities, communities | 의미 유사 |
| **φ_bm25** (Okapi BM25 full-text) | 위와 동일 | 단어 일치 (Lucene) |
| **φ_bfs** (breadth-first search) | edges, entities | 컨텍스트 유사 (그래프 거리) ★ 그래프 RAG 의 핵심 |

→ 세 방식이 서로 다른 *유사도 차원* 을 잡는다. recent episodes 를 BFS seed 로 쓰면 *최근 언급 맥락* 을 회수 가능.

### 6.2 Rerank ρ (5 방식)

| 방식 | 비고 |
|------|------|
| RRF (Reciprocal Rank Fusion) | 다중 검색 결과 통합 표준 |
| MMR (Maximal Marginal Relevance) | 다양성 |
| Graph-based episode-mentions | 자주 언급된 fact 우선 |
| Node distance | 지정 centroid 와의 그래프 거리 |
| Cross-encoder (LLM) | 가장 정밀, 비용 최대 |

### 6.3 Construct χ — 텍스트 컨텍스트 조립

엣지에서 `(fact, t_valid, t_invalid)`, 엔티티에서 `(name, summary)`, 커뮤니티에서 `summary` 를 추출해 다음 템플릿:

```
FACTS and ENTITIES represent relevant context to the current conversation.
These are the most relevant facts and their valid date ranges. ...
format: FACT (Date range: from - to)
<FACTS>{facts}</FACTS>
These are the most relevant entities
ENTITY_NAME: entity summary
<ENTITIES>{entities}</ENTITIES>
```

---

## 7. 벤치마크 결과

### 7.1 DMR (Deep Memory Retrieval, MemGPT 의 벤치마크)

| Memory | Model | Score |
|--------|-------|------|
| Recursive Summarization | gpt-4-turbo | 35.3% |
| Conversation Summaries | gpt-4-turbo | 78.6% |
| MemGPT | gpt-4-turbo | 93.4% |
| Full-conversation | gpt-4-turbo | 94.4% |
| **Zep** | gpt-4-turbo | **94.8%** |
| Conversation Summaries | gpt-4o-mini | 88.0% |
| Full-conversation | gpt-4o-mini | 98.0% |
| **Zep** | gpt-4o-mini | **98.2%** |

→ DMR 자체가 *작은 벤치마크* (60 메시지, single-turn fact). 모던 LLM full-context 에 거의 풀림. 차별성 확인엔 부족.

### 7.2 LongMemEval (LME_s, 115k tokens 평균)

| Memory | Model | Score | Latency | Latency IQR | Avg Context Tokens |
|--------|-------|------|---------|------------|------|
| Full-context | gpt-4o-mini | 55.4% | 31.3s | 8.76s | 115k |
| **Zep** | gpt-4o-mini | **63.8%** | **3.20s** | **1.31s** | **1.6k** |
| Full-context | gpt-4o | 60.2% | 28.9s | 6.01s | 115k |
| **Zep** | gpt-4o | **71.2%** | **2.58s** | **0.684s** | **1.6k** |

→ **정확도 +18.5%, 지연 -90%, 컨텍스트 토큰 -98.6%**.

### 7.3 질문 유형별 (LME_s, gpt-4o)

| Question Type | Full-context | Zep | Δ |
|--------------|-------------|-----|---|
| single-session-preference | 20.0% | **56.7%** | **+184%** |
| single-session-assistant | **94.6%** | 80.4% | -17.7% ⚠️ |
| temporal-reasoning | 45.1% | **62.4%** | +38.4% |
| multi-session | 44.3% | **57.9%** | +30.7% |
| knowledge-update | 78.2% | **83.3%** | +6.5% |
| single-session-user | 81.4% | **92.9%** | +14.1% |

→ Zep 의 *진짜 강점*: temporal-reasoning, multi-session, single-session-preference (선호 추론).
→ *약점*: single-session-assistant (단순 1회 QA) — full-context 가 더 우월. **메모리가 늘 답이 아니다**.

---

## 8. 약점·한계 (논문 자체 인정)

- single-session-assistant -17.7%: 단순 QA 는 fresh context 가 더 나을 수 있음
- DMR 벤치마크 자체의 한계 (small-scale, single-turn)
- gpt-4o-mini 의 temporal 추론은 부족 — 작은 모델은 Zep 시간성 활용 약함
- 분산 인프라 (Zep 서비스) 의 네트워크 지연이 베이스라인과 비대칭
- Domain ontology 미사용 — fine-tuned KG extraction 모델 도입 시 추가 향상 가능
- 작은 모델 fine-tune for Graphiti prompts = 향후 과제

---

## 9. Park+2023 vs Zep/Graphiti 비교

| 차원 | Park (Generative Agents) | Graphiti |
|------|-------------------------|---------|
| 메모리 구조 | linear memory stream + reflection tree | hierarchical 3-tier KG |
| 시간성 | timestamp + recency decay | bi-temporal (T vs T') + edge invalidation |
| 추출 | reflection 자동 (importance > threshold) | episode → entity → community 3 단계 |
| 검색 | recency × importance × relevance | cosine + BM25 + BFS, 5 reranker |
| 모순 | 명시 처리 없음 | edge invalidation 로 자동 |
| 군집 | 없음 | Label Propagation community |
| 스케일 | 25 NPC | 분산 시스템 (production) |
| 인지심리 기반 | 부분적 | 명시적 (episodic + semantic 분리) |

→ **Graphiti = Park 의 production-grade 진화형**. 다만:
- Park 는 *NPC 인지/일상* 에 최적화 (planning, reflection tree)
- Graphiti 는 *fact retrieval* 에 최적화 (planning 미포함)

→ 이상적: Graphiti 메모리 위에 Park-style planning loop 얹기.

---

## 10. hwigi-tower 적용 평가

| 컴포넌트 | 21일 MVP | 사유 |
|---------|---------|------|
| Graphiti 직접 도입 | ❌ | Neo4j 의존 + 솔로 운영 부담 + D-005 on-device 위배 |
| 3-tier 분리 (episode/semantic/community) | ❌ | 메모리 파편 5 + reflection 13 = 임계 미달 |
| **Bi-temporal model 패턴** | 🟡 | reflections 테이블에 (t_valid, t_invalid) 추가 검토 가능. 마타이오스 *fact 가 무효화되는* 메커니즘 = D-019 망각 narrative 와 정합 |
| **Edge invalidation 패턴** | 🟡 | S3-S4 붕괴 단계의 어떤 메모리 파편이 invalidate 되는 연출에 응용 가능 |
| Search 3 방식 | ❌ | SQLite LIKE 로 충분 (회차 13개) |
| Construction prompts (Appendix) | ✅ | Codex 가 reflection 추출 prompt 작성 시 재사용 가능 (한국어 번역) |

→ **MVP 직접 도입 X, 패턴 차용은 가능**. 특히 **edge invalidation = 망각 narrative 의 *기술적 동치*** 라는 발견이 중요. 마타이오스가 회차 8 에 잊는 것 = `t_invalid` 가 회차 8 로 설정되는 것. *기술 한계 = in-game 진실* (Pillar P2) 의 강력한 표현.

---

## 11. 비전 B 적용 (OASIS + Zep/Graphiti)

[MiroFish + OASIS — 거대 시뮬레이션 세계 reference architecture](mirofish-oasis.md) 가 이미 Zep Cloud 사용 중. 그 의미를 정확화:

- MiroFish 의 1000+ agents 는 각자 episode 를 Graphiti 에 누적
- agent 간 사회적 *fact 가 서로 모순* 될 때 (예: A 가 B 를 신뢰 → B 가 A 를 배신 → A 의 신뢰 fact invalidate) edge invalidation 으로 자동 처리
- temporal-reasoning + multi-session 강점 = 시뮬레이션 timestep 누적 시 강력
- community detection = 자연스러운 *파벌 형성* 시각화

→ 비전 B 의 첫 실험 ([OASIS: Open Agent Social Interaction Simulations with One Million Agents](oasis.md) §10) 에서:
- 100 agents Reddit-clone 시뮬레이션
- 각 agent 의 의견 변화 = edge invalidation
- 파벌 형성 = community subgraph 자동 생성
- **Graphiti 자체 호스팅** 으로 Zep Cloud 비용 회피 가능 (Neo4j + Python 서버)

---

## 12. Graphiti 자체 호스팅 옵션

- Repo: `github.com/getzep/graphiti` (Apache 2.0)
- 의존: **Neo4j** (Community Edition 무료) + **OpenAI API** (또는 호환 모델)
- 임베딩: **BGE-m3** (BAAI, 무료 + 다국어)
- Reranking 모델 동일

→ 솔로 환경에서 Neo4j Docker 컨테이너 + Python 클라이언트 충분. v2 시점에 검토.

---

## 13. 다음 학습 후보

| # | 학습 | 트리거 |
|---|------|-------|
| 1 | Graphiti repo 직접 분석 (Cypher 쿼리, 데이터 모델) | OASIS 첫 실험 후 |
| 2 | LongMemEval 벤치마크 dataset 직접 탐색 | benchmark 설계 시 |
| 3 | AriGraph (Anokhin+2024) — 영감 출처 | KG world model 깊이 학습 시 |
| 4 | LightRAG (Guo+2024) — 비교 대상 | community 검색 대안 |
| 5 | ~~GraphRAG (Microsoft) deep dive~~ → ✅ 완료 [Microsoft GraphRAG — Query-Focused Summarization on Narrative Private Data](graphrag.md) (2026-04-28) — Graphiti 의 부모, 정적 corpus QFS 특화 |
| 6 | bi-temporal model 의 회계·DB 학술 배경 | 시간성 모델 이론 |
| 7 | 한국어 환경 BGE-m3 성능 측정 | 한국어 KG 구축 가능성 |

---

## 14. 재사용 자산 — Construction Prompts (논문 Appendix 6.1)

논문이 공개한 prompt 들 — 한국어 번역해서 hwigi-tower / B 갈래 모두 재사용 가능. 요지만:

### 14.1 Entity Extraction (6.1.1)
```
1. 화자/액터를 첫 노드로 항상 추출
2. CURRENT MESSAGE 의 명시적·암시적 엔티티
3. 관계·행동은 노드로 만들지 않음
4. 시간 정보 (날짜·시간·연도) 는 노드 X — 엣지 속성으로
5. 가능한 한 명시적 (full names)
6. 언급만 된 엔티티 X
```

### 14.2 Entity Resolution (6.1.2)
NEW NODE 가 EXISTING NODES 와 중복인지 LLM 판정. name + summary 동시 사용. 중복이면 `is_duplicate: true` + 통합 이름.

### 14.3 Fact Extraction (6.1.3)
```
1. 제공된 엔티티 *간* 의 fact 만 추출
2. fact 는 두 DISTINCT 노드 사이의 명확한 관계
3. relation_type = 간결한 ALL_CAPS (LOVES, IS_FRIENDS_WITH, WORKS_FOR)
4. 자세한 설명은 별도 fact 본문에
5. 시간성 고려
```

### 14.4 Fact Resolution (6.1.4)
NEW EDGE 가 EXISTING EDGES 와 중복 사실인지. 정확히 같지 않아도 "같은 정보" 면 중복.

### 14.5 Temporal Extraction (6.1.5)
```
- valid_at: 관계가 *시작된* 시각
- invalid_at: 관계가 *끝난* 시각
- ISO 8601 (YYYY-MM-DDTHH:MM:SS.SSSSSSZ)
- reference_timestamp 기준 상대 시간 환산
- 관련 사건에서 날짜 *추론 금지* — 명시된 것만
- 시간 미명시 → null
- 시간대 명시 없으면 UTC (Z)
```

→ 본 5 prompt 는 한국어 NPC reflection 파이프라인의 *직접 적용 가능 자산*. hwigi-tower W2-1 (~05-08) reflection 파이프라인 작업 시 Codex 가 인용.

---

## 15. 출처

```bibtex
@misc{rasmussen2025zep,
  title={Zep: A Temporal Knowledge Graph Architecture for Agent Memory},
  author={Rasmussen, Preston and Paliychuk, Pavlo and Beauvais, Travis and Ryan, Jack and Chalef, Daniel},
  year={2025},
  eprint={2501.13956},
  archivePrefix={arXiv},
  primaryClass={cs.CL},
}
```

- 논문 원본 PDF: `wiki/learnings/Zep Agent Memory 논문.pdf`
- Graphiti repo: github.com/getzep/graphiti (Apache 2.0)
- Zep service: getzep.com (commercial)
- 학습 일자: 2026-04-28
- 트리거: 작가가 PDF 추가 + [OASIS: Open Agent Social Interaction Simulations with One Million Agents](oasis.md) 학습 직후 (Zep 의 Graphiti 의존성을 정확화 필요)

## 연결된 페이지
- [Microsoft GraphRAG — Query-Focused Summarization on Narrative Private Data](graphrag.md) — Agent Memory·KG 시스템 자매(Graphiti 의 community subgraph 가 GraphRAG 영감 — graphrag 노트가 본 노트 정독 후 학습됨) · [Hermes Agent — Nous Research 자가개선형 에이전트 플랫폼](hermes-agent.md) — Hermes recall 의 정밀 메모리 대안
