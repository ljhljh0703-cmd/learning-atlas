---
created: 2026-04-28
updated: 2026-04-28
type: learning
category: techniques
source: https://github.com/microsoft/graphrag
authors: Edge et al. (Microsoft Research, 2024)
tags: [graphrag, microsoft, leiden, community-detection, qfs, knowledge-graph, rag, vision-b]
---

# Microsoft GraphRAG — Query-Focused Summarization on Narrative Private Data

> Edge et al. 2024 (arXiv 2404.16130). 1M-token 정적 corpus 위에서 *holistic* 질문 ("주요 테마는?") 에 답하는 graph + community 기반 RAG.
> [Graphiti](zep-graphiti.md) 의 *부모* — Graphiti 의 community subgraph 가 본 작품에서 영감 받음.

---

## 1. 정체성 — 정확히 무엇인가

| 차원 | 정확한 위치 |
|------|-----------|
| 공식 명칭 | GraphRAG (Microsoft Research) |
| 분류 | **Query-Focused Summarization (QFS) on private narrative data** |
| 의미 | 정적 문서 corpus → entity KG → community 계층 → community summary → query 시 partial response × N → final response |
| 차별 대상 | naive RAG (top-k 벡터 검색) — corpus-wide *주제·테마* 질문에 약함 |
| 한 줄 | *"100만 토큰 문서 corpus 의 holistic 질문에, KG + Leiden community + map-reduce summary 로 답하는 RAG."* |

→ Naive RAG: "이 문서에서 X 가 어디에 등장하나?" (조회) → ✅
→ GraphRAG: "이 corpus 의 *주요 테마는*?" "X 와 Y 의 *전체 관계는*?" (holistic) → ✅

---

## 2. 논문 메타

- **arXiv**: 2404.16130 (제출 2024-04-24, 개정 2025-02-19)
- **저자**: Darren Edge 외 9명 (Microsoft Research)
- **PyPI**: `pip install graphrag`
- **License**: 데모 코드 (Microsoft 공식 지원 X — README 명시)
- **Blog**: microsoft.com/research/blog/graphrag-unlocking-llm-discovery-...

---

## 3. 파이프라인 (Indexing → Query)

### 3.1 Indexing

```
[원본 문서]
    ↓ chunk
[TextUnits] (분석 단위)
    ↓ LLM 추출
[Entities + Relationships + Key Claims]
    ↓ 그래프 구성
[Entity Knowledge Graph]
    ↓ Leiden 알고리즘
[Hierarchical Communities]
    ↓ bottom-up LLM summary
[Community Summaries (각 커뮤니티 + 그 구성원)]
```

**핵심 알고리즘**: **Leiden** (community detection 표준). 계층적 클러스터링 — 작은 군집들이 더 큰 군집으로 그룹화.
**비용**: ⚠️ "GraphRAG indexing can be an expensive operation" — README 자체 경고.

### 3.2 Query — 4 검색 모달리티

| 모달리티 | 용도 | 메커니즘 |
|---------|------|---------|
| **Global Search** | corpus-wide holistic 질문 ("주요 테마는?") | 모든 community summary → 각각 partial response → final response 합성 |
| **Local Search** | 특정 entity 중심 질문 | entity → 이웃 entity + 관련 개념으로 fan-out |
| **DRIFT Search** | local + community 컨텍스트 | local 검색 + 해당 community 정보 첨가 |
| **Basic Search** | fallback | 표준 top-k 벡터 검색 (naive RAG) |

→ **Global Search 가 GraphRAG 의 진짜 차별점**. Local/Basic 은 다른 RAG 시스템과 비슷.

---

## 4. Map-Reduce Summarization

```
Query Q
    ↓
[community1 summary] → LLM → partial response 1
[community2 summary] → LLM → partial response 2
    ...
[communityN summary] → LLM → partial response N
    ↓ 모두 합쳐서
LLM → final response
```

→ corpus 가 100만 토큰이라도 community 수가 N=수십~수백 이면 N 번의 LLM 호출 + 1 번의 합성으로 답 가능. *프롬프트 캐싱과 결합 시 비용 효율* (community summary 가 안 변하니까).

---

## 5. 핵심 결과 (논문 abstract)

- 100만 토큰 범위 corpus 의 *global sensemaking* 질문에서:
  - **comprehensiveness** (포괄성) 향상
  - **diversity** (답변 다양성) 향상
  - 두 metric 모두에서 conventional RAG baseline 대비 substantial 향상
- 구체 수치는 본문 (제공된 abstract 에 없음, 추후 정독 필요)

---

## 6. GraphRAG vs Graphiti — 형제 비교

| 차원 | GraphRAG (Microsoft) | Graphiti ([Zep / Graphiti — Temporal Knowledge Graph for Agent Memory](zep-graphiti.md)) |
|------|---------------------|----------------------------|
| **Use case** | 정적 corpus QFS | 동적 agent memory |
| **데이터 변화** | 인덱싱 한 번 → 거의 안 변함 | 메시지 들어올 때마다 갱신 |
| **Community 알고리즘** | **Leiden** (정밀, 정적) | **Label Propagation** (동적 확장 친화) |
| **시간성** | 없음 (정적 문서 가정) | **Bi-temporal (T vs T')** + edge invalidation |
| **검색** | 4 모달리티 (Global/Local/DRIFT/Basic) | 3 search × 5 reranker |
| **저장소** | 자체 인덱스 | Neo4j |
| **비용** | ⚠️ indexing 비쌈 | ⚠️ LLM extraction 비쌈 |
| **목적 질문** | "이 corpus 의 주요 테마는?" | "이 agent 가 마지막으로 X 라고 한 게 언제?" |

→ **둘은 보완 관계**. Graphiti README 자체가 GraphRAG 영감을 명시 ([Zep / Graphiti — Temporal Knowledge Graph for Agent Memory](zep-graphiti.md) §3.3 community 인용 [4] 가 GraphRAG).
→ 학습 순서로 GraphRAG → Graphiti 가 자연스럽지만, 작가 시점에선 Graphiti 정독이 끝났으므로 GraphRAG 은 **차이점만** 깊이 보면 충분.

---

## 7. hwigi-tower (비전 A) 적용 평가

| 컴포넌트 | 21일 MVP | 사유 |
|---------|---------|------|
| 전체 도입 | ❌ | hwigi-tower 의 데이터는 *동적* (회차 누적) — GraphRAG 의 전제(정적 corpus) 와 부정합 |
| 메모리 파편 5 + reflection 13 의 KG 구축 | ❌ | 임계 미달 (수십 entity 미만). naive RAG 도 과잉 |
| Map-reduce summary 패턴 | ❌ | 1 NPC × 13 회차에 적용할 community 가 없음 |
| 4 search 모달리티 | ❌ | SQLite LIKE 로 충분 |
| Leiden 알고리즘 | ❌ | 군집할 entity 가 없음 |

→ **hwigi-tower 는 GraphRAG 의 *반대 케이스*** — 작은 동적 데이터. 도입 의미 없음.

---

## 8. 비전 B 적용 평가

### 8.1 OASIS 시뮬레이션 + GraphRAG (시뮬레이션 종료 후 분석)

OASIS 1000+ agents × 100 timesteps = corpus 형성 → GraphRAG 인덱싱 → "이 시뮬레이션의 *주요 사회적 동학은*?" 같은 holistic 질문 가능. **MiroFish 의 ReportAgent 가 정확히 이 패턴**인 것으로 추정 ([MiroFish + OASIS — 거대 시뮬레이션 세계 reference architecture](mirofish-oasis.md) services/report_agent.py).

### 8.2 시뮬레이션 *중* 메모리는 Graphiti, *종료 후* 분석은 GraphRAG

```
[시뮬레이션 진행]
    Graphiti (동적, 실시간 fact 갱신, edge invalidation)
       ↓
[시뮬레이션 종료, 데이터 freeze]
    GraphRAG (정적, 한 번 인덱싱, holistic 질문 답변)
```

→ **두 도구의 자연스러운 분업**. 비전 B 의 작품 구현 시 양쪽 다 도입 가치.

### 8.3 한국 고전 문학 시뮬레이션 (작가 비전)

홍루몽·무정 같은 한국 고전 corpus → GraphRAG 인덱싱 → *대안 결말 시뮬레이션 시드* 추출 → OASIS 페르소나 시드로 변환. MiroFish 의 *红楼梦 잃어버린 결말 시뮬레이션* 데모가 정확히 이 워크플로우.

---

## 9. Sub brain 자체 적용 가능성 (★ 미래 옵션)

작가의 위키가 누적되면 *작가 자신을 위한 holistic 질문* 가능:
- "내 위키에서 가장 자주 나타나는 주제는?"
- "내 AI NPC 비전이 시간에 따라 어떻게 진화했는가?"
- "내 가치관과 프로젝트 결정 사이의 일관된 패턴은?"

**현재**: Sub brain ≈ 200 페이지 — GraphRAG 임계 미달. naive RAG 또는 LLM full-context 로 충분.
**임계**: 1000+ 페이지 또는 1M+ 토큰 누적 시 검토. (현재 누적 속도 기준 ~1년 후)
**대안**: 그 전까지 [seCall](../methods/secall.md) 패턴 (하이브리드 검색) 으로 충분.

---

## 10. Prompt Tuning — 자산 가능성

GraphRAG 은 *prompt tuning guide* 를 별도 제공:
- Auto-tuning: 도메인 corpus 맞춤 prompt 자동 생성
- Manual tuning: entity extraction, relationship extraction, claim extraction 별도 튜닝

→ 이 prompt 들 자체가 [Zep / Graphiti — Temporal Knowledge Graph for Agent Memory](zep-graphiti.md) §14 의 5 prompt 처럼 **재사용 자산**. 비전 B 의 한국 corpus (홍루몽·무정 등) 처리 시 도메인 prompt 직접 작성 필요.

---

## 11. 한계·리스크

- ⚠️ **인덱싱 비용** — 100만 토큰 corpus = LLM 호출 수천 건. 솔로 실험엔 작은 corpus 부터 시작
- 정적 가정 — 데이터 변경 시 *재인덱싱* 필요 (Graphiti 의 dynamic extension 부재)
- "공식 Microsoft 지원 아님" — README 명시. 데모 수준 패키지
- Leiden 결과의 비결정성 (시드 고정 필요)
- domain-specific 튜닝 없으면 결과 약함 (README: "out of the box may not yield the best possible results")

---

## 12. 다음 학습 후보

| # | 학습 | 트리거 |
|---|------|-------|
| 1 | 논문 본문 정독 (구체 수치, 평가 데이터셋, baseline 상세) | 비전 B 첫 corpus 실험 직전 |
| 2 | Prompt tuning guide deep dive | 한국 corpus 적용 시 |
| 3 | Leiden 알고리즘 자체 학습 | community detection 이론 |
| 4 | LightRAG (Guo+2024) 비교 | GraphRAG 의 효율 개선 시도 |
| 5 | DRIFT search 메커니즘 상세 | local + global 균형 검색 |
| 6 | Sub brain 200→1000 페이지 도래 시 도입 검토 | 누적 임계 |

---

## 13. 출처

```bibtex
@misc{edge2024graphrag,
  title={From Local to Global: A Graph RAG Approach to Query-Focused Summarization},
  author={Edge, Darren and Trinh, Ha and Cheng, Newman and Bradley, Joshua and Chao, Alex and Mody, Apurva and Truitt, Steven and Larson, Jonathan},
  year={2024},
  eprint={2404.16130},
  archivePrefix={arXiv},
  primaryClass={cs.CL},
}
```

- Repo: github.com/microsoft/graphrag
- Docs: microsoft.github.io/graphrag
- 학습 일자: 2026-04-28
- 트리거: [Zep / Graphiti — Temporal Knowledge Graph for Agent Memory](zep-graphiti.md) 정독 후 — Graphiti 의 community subgraph 가 GraphRAG 영감이라는 사실 확인
