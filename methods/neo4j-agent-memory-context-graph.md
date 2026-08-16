---
created: 2026-06-28
updated: 2026-08-11
type: learning
tags: [method, graph-db, neo4j, agent-memory, context-graph, knowledge-graph, provenance]
source: https://www.youtube.com/watch?v=tcVK3ufL36E
authors: [공원나연 (박나연)]
year: 2026
category: method
---
에이전트 메모리를 context graph 3계층(대화·엔티티·추론)으로 모델링하는 입문 개념 — Neo4j 학습트랙의 실습 스캐폴드.

# Neo4j Agent Memory — Context Graph 기반 에이전트 메모리 입문

## 1. 한 줄 델타

> 에이전트 메모리는 *context graph* 로 모델링할 수 있다 — 대화 시퀀스 + 추출된 장기 엔티티/사실/선호 + 추론/툴콜 provenance, 세 계층이 연결된 그래프.

이건 grep+graphify 를 vector RAG 로 바꾸라는 근거가 *아니다*(헌법 §검색방법 grep/그래프>벡터 🔒 유지). [Graph DB / Neo4j — 지식 누적 노트 (학습 진행형)](graph-db-neo4j.md) 학습트랙의 구체적 *목표 스키마*를 주는 입문 자료다.

## 2. 개념 구분

| 개념 | 의미 | 역할 |
|---|---|---|
| Graph | 노드+엣지, 관계 우선 자료구조 | 무엇이 무엇과 연결됐나 |
| Knowledge Graph | 도메인 의미가 붙은 그래프 | 타입 있는 의미 관계 저장 |
| Context Graph | 현재 AI 작업용으로 슬라이스된 KG | 세션·사용자·권한·시간·작업에 맞는 *부분그래프*만 동적 조립 |

핵심 = **dynamic context assembly**. 큰 그래프를 통째로 LLM 에 넣지 않고, 에이전트가 필요한 현재 부분그래프를 짓는다.

## 3. 3계층 에이전트 메모리

- **단기(short-term)** — 활성 세션/대화. 메시지=노드, `NEXT_MESSAGE` 시퀀스, role/content/timestamp/session_id 속성. (≈ 세션 transcript·RETURN 로그의 그래프 네이티브 버전)
- **장기(long-term)** — 메시지에서 엔티티 추출 후 세션 너머 persist. 선호·사실·도메인 엔티티, SPO 관계. 온톨로지 **POLE+O**(Person/Object/Location/Event/Organization). 파이프라인: spaCy(빠른 일반) → GLiNER(도메인 어휘) → LLM fallback → merge/dedupe. (≈ 반복 노트/로그를 안정 노드로. **주의=entity resolution**: "Codex"가 agent/CLI/model/repo 중 뭔지 — 확신 merge 아니면 분리+ambiguity 연결)
- **추론(reasoning)** — 답이 아니라 *어떻게 도달했나*. 추론 트레이스·스텝·툴콜·쿼리·결과, provenance(왜 그 행동·무슨 근거). **≈ Hermes RETURN + Evidence Gate** — 작가 외부에이전트 워크플로우와 가장 직결.

## 4. 기존 노드와의 관계

- [Zep / Graphiti — Temporal Knowledge Graph for Agent Memory](../techniques/zep-graphiti.md) — 이론적으로 더 깊음(episodic/semantic/community 부분그래프, bi-temporal, invalidation, hybrid retrieval). 이 영상은 *productized 실습 입문*, Graphiti 는 *temporal 강참조*.
- graphify — vault 그래프 순회/합성 레이어. 이 자산이 "graphify 를 Neo4j Agent Memory 로 교체" 근거가 되면 안 됨. 비교축: graphify=현 vault lookup / Neo4j Agent Memory=영속 에이전트 세션·추론 메모리 *백엔드 패턴 후보*.
- [codebase-memory-mcp](codebase-memory-mcp.md) — 코드 콜그래프 정밀. 이 자산은 *agent-memory 도메인 모델* 추가(서로 다른 층).
- [Microsoft GraphRAG — Query-Focused Summarization on Narrative Private Data](../techniques/graphrag.md) — 검색 증강 그래프 (별개 계보).

## 5. 살릴 것 / 과장 금지

**살릴 것**: context graph=동적 부분그래프 / 메모리는 vector chunk 만 아닌 *관계 구조* 중요 / 3계층 분리 / 추론 메모리는 personalization 아닌 *프로세스 검증*에 유용 / entity resolution 명시·신중 / POLE+O 는 입문용(범용 아님, 커스텀 온톨로지 필요).

**entity resolution 을 *측정*하는 계약** <!-- 2026-08-11 codex-gate: Anthropic claude-cookbooks knowledge_graph --> — 위 §3 은 "확신 merge 아니면 분리" 로 *태도*를 정했다. 그 태도를 검사 가능하게 만드는 4항:
- **보존 불변식(conservation)** — raw alias 는 전건이 *정확히 하나의* cluster 에 귀속되거나 singleton 으로 남는다. resolver 가 못 붙인 이름은 **버리지 않고 singleton 으로 보존**한다(조용한 소실 금지).
- **under-merge ⟂ over-merge 를 따로 센다** — 파편화(같은 것이 갈림)와 정밀도 손상(다른 것이 합쳐짐)은 한 지표로 상쇄돼 서로를 숨긴다.
- **추출 성능과 resolution 성능을 분리** 측정한다. predicate 를 무시한 relation recall 은 *upper bound* 로만 표기한다.
- **증분 갱신은 영향 범위만** — 신규 문서는 새 entity 만 기존 canonical set 과 resolve 하고, source set 이 바뀐 entity 의 요약만 재생성한다.

→ 반영처 = Myth Atlas 의 동명이인·이명 병합 Gate + 소규모 gold triple 회귀셋(⏸️ Atlas 레인 후순위, 작가 지시 2026-08-11). 인용 게시물의 `graph engineering 1000배` 소문·인사 뉴스는 버림(추천 정본과 첨부 article 불일치 = 게시물 자체 신뢰도 하락 근거).

**결정 추적 계약 — `explicit` ⟂ `inferred` 는 다른 edge 다** <!-- 2026-08-13 codex-gate: semantica-agi/semantica pin 7bf7474 --> — §3 의 *추론 계층*은 "어떻게 도달했나"를 남기라고만 했다. Semantica 코드가 그 계층의 **함정을 실증**한다: 같은 저장소가 두 종류의 인과를 한 이름 아래 둔다.
- `add_causal_relationship()` + `get_causal_chain()` = **사람이 명시한** typed edge 를 따라간다.
- `trace_decision_causality()` = **같은 엔티티를 공유하고 시간이 앞선** 결정을 potential cause 로 *추정*한다.

후자는 시간적 선행 + 공동 엔티티일 뿐 **인과 증명이 아니다**. 따라서 결정 노드를 그래프로 남길 때 `origin: explicit | inferred` 를 edge 속성으로 **강제**하고, inferred 는 자동으로 `CAUSED` 로 승격되지 않는다. `inference_method`·`confidence`·`reviewer` 를 함께 단다.

```text
DecisionNode: id · actor · input_snapshot_refs[] · evidence_refs[]
              rule_or_model_version · reasoning_summary · outcome · confidence
              valid_time · recorded_time · supersedes
Edges: SUPPORTED_BY · CAUSED · INFLUENCED · PRECEDENT_FOR · SUPERSEDED_BY
       (+ origin · inference_method · confidence · reviewer)
```

이건 vault 가 이미 다른 표면에서 지키는 규율의 그래프판이다 — §5.7 *"AI 가 추론한 취향 = candidate only, 작가 결정으로 박제 금지"* · lessons *"'없음' 은 주장이지 관측이 아니다"*. **독립 수렴이지 새 규율이 아니다.** 파일럿 성공 기준 = 모든 결정이 최소 1개 immutable evidence snapshot 에 연결 · 같은 input+rule version 의 replay 동일 · `CAUSED` edge 100% 가 명시 근거 또는 human approval 보유 · superseded 는 삭제 아닌 valid/recorded time 구분.

⛔ **가져오지 않은 것**: "오픈소스 Palantir" 등가 주장(포지셔닝 문구) · Semantica 스택 도입(기본 의존성 42 + optional 46 = 과도) · release note 의 `production-ready`/`100% coverage`(255 test file·4476 test function 은 실재 확인했으나 **기본 CI 가 pytest 를 호출하지 않고** 조사 세션도 pytest 미설치로 미실행) · "전체 파이프라인 결정론적"(추출·ontology 생성 모듈엔 선택적 LLM 경로 있음). 🅿️ **Semantica 도입 자체 = PARK** — 트리거는 park backlog 참조.

**과장 금지**: 현 vault lookup(grep+map+graphify) 보다 낫다고 주장 X / "지금 Neo4j 도입" 결정 X(개념 영상, 1/3) / 자동추출 엔티티를 Gate 전 진실 취급 X / Graphiti 와 동일시 X / Decoding AI 기사 주장은 미검증(링크 200 만 확인).

## 6. 응용

**A. 학습트랙 스키마 스케치** (Cypher 연습 scaffold, 최종 아님):
```text
(:Session)-[:HAS_MESSAGE]->(:Message)-[:NEXT_MESSAGE]->(:Message)
(:Message)-[:MENTIONS]->(:Entity)
(:User)-[:PREFERS]->(:Preference)
(:Fact)-[:ABOUT]->(:Entity)
(:Message)-[:HAS_REASONING_TRACE]->(:ReasoningTrace)-[:HAS_STEP]->(:Step)-[:USED_TOOL]->(:Tool)
```

**B. Hermes RETURN → graph 매핑** (backlog 후보):

| 현재 산출물 | graph 메모리 대응 |
|---|---|
| RETURN.md | session-level manifest |
| Evidence 명령 | tool call/result 노드 |
| Gate status | verification edge/status |
| skill candidate | 추출 패턴 노드 |
| user approval | confirmed decision edge |

> 열린 질문 — RETURN/Evidence 이력을 *human-readable markdown SSOT 를 약화시키지 않으면서* graph-backed audit layer 로 만들 수 있나? (구현 결정 전 영상 2/3·3/3 대기 권장)

**C. 포트폴리오** — 작가는 이미 그래프형 Obsidian vault 운영 + graphify 분석 → Neo4j 실습 트랙 + agent memory 구체 유스케이스(단기/장기/추론)로 취업 서사 강화.

## 7. 출처

- 영상: https://www.youtube.com/watch?v=tcVK3ufL36E (공원나연, 2026-06-22, 23:28, 한국어. 3강 시리즈 1편)
- Codex 가 yt-dlp 한국어 자막 + 설명란 링크 4개(전부 200) 실측 + `neo4j-labs/agent-memory` README·`create-context-graph` 도메인 카탈로그 1차 확인 후 추출. vault Claude ③Gate 재검증 통과(인용 노드 5종 실재, grep>vector 헌법 준수 확인).
- 1차 출처: https://github.com/neo4j-labs/agent-memory · https://create-context-graph.dev/docs/reference/domain-catalog
