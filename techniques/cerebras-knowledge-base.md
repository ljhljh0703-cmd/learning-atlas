---
created: 2026-07-18
updated: 2026-07-18
type: learning
category: technique
source: https://www.cerebras.ai/blog/how-we-built-our-knowledge-base
authors: [hi_im_isaac_, learnwdaniel, gaozenghao]
tags: [retrieval, rag, hybrid-search, grep-vs-vector, knowledge-base, mcp, rrf, agent-harness]
---
<!-- Cerebras 사내 지식베이스 해체 — 하이브리드 검색 융합 스펙. vault §4·memora 선행 확인 + 유일 delta=융합 레시피 -->
# Cerebras Knowledge Base — 하이브리드 검색 융합 (grep 백본 + 벡터 보완)

*Cerebras ai/growth 팀 — 하루 15,000 질의, 3개월 운영 사내 KB. 엔지니어링 블로그(말미 리크루팅).*

Slack·GitHub·Jira·Docs 를 **단일 소스로 통합하지 않고** 각자 있는 곳에서 추출 → 단일 Postgres 테이블(embedding+요약+메타)로 통일한 프로덕션 지식베이스. vault 의 grep>벡터·distill-before-embed 철학을 **뒤늦게 실전 증명**해준 자료.

## 한 줄
> 검색은 단일 스코어를 신뢰하지 않는다 — full-text(정확 토큰) + 벡터(패러프레이즈) + IDF(신호/필러) + age-decay(신선도)를 **RRF 로 융합**하고, 원문이 아니라 **LLM 이 정규화한 요약+메타를 임베딩**한다.

## 진짜 delta (vault 신규 — 흡수분)
**하이브리드 검색 융합 스펙** (vault 에 구체 레시피가 없던 부분):
- **4-스코어 융합, 단일 스코어 불신**: `full-text search`(에러문자열·플래그·호스트명 등 정확 토큰 — "리터럴 에러 붙여넣으면 어떤 의미유사도도 이걸 못 이긴다") + `embedding`(어휘 안 겹치는 질문↔답 연결) + `IDF`(희귀 토큰 신호 분리, "sounds good thanks!" 는 IDF로 0점) + `age-decay`(오래된 Slack 답변 만료).
- **RRF (Reciprocal Rank Fusion)**: 문서마다 `weight/(60+rank)` 합산(smoothing 60). **합의 > 단일 강한 표** — 여러 retriever 상위에 뜬 문서가 하나에서만 1등인 문서를 이긴다.
- **distillation-before-embed**: 원문 트랜스크립트 미임베딩. LLM 이 `한줄 질문·요약·해결·코드참조`를 추출→그것만 임베딩. "정규화 시 정확도 유의미 상승."
- **bursting**: 같은 작성자 연속 메시지(burst)를 스레드 토픽 prepend 해 개별 임베딩. 게이트 = IDF≥4.0 & ≥200자 & 반응有.
- **planner→executor→synthesizer + context 확장 rerank**: LLM planner 가 도구 선택(search_slack·search_code=ripgrep·who_knows) → 병렬 fan-out → RRF+소형 reranker(0~10, top-10) → **인접 섹션 붙여 복원**(evidence packet).
- **MCP = LLM-free 좁은 primitive**: 검색층은 "질문에 답하라" 엔드포인트가 아니라 원자적 retrieval 도구를 노출, Claude Code 가 오케스트레이터. 검색층은 LLM 결정에 의존 않고 서빙.

## 선행 확인 (vault 가 이미 앞선 것 — 재흡수 X)
- **§4 grep>벡터**: Cerebras 결론 = "둘 다, 융합 — full-text(=grep)가 정확토큰 백본, 벡터는 패러프레이즈 보완." ⚠️ **vault §4 불변** — 본 노트는 §4 를 뒤집지 않는다. vault 는 벡터 RAG 미도입 상태 유지, 본 스펙은 *쿼리 가능 KB 구축 시(PK-007)* 참조 청사진일 뿐 채택 강제 아님. [Is Grep All You Need? — 에이전트 검색에서 grep vs 벡터 RAG (arXiv 2605.15184)](agentic-search-grep-vs-vector.md)의 "검색법보다 하네스 설계가 지배"가 Cerebras MCP 설계로 실증됨.
- **distill-before-embed**: [Memora — 추상화·구체성 조화 메모리 표현](memora-harmonic-memory.md)(raw 직접인덱싱 X, 요약층)·gbrain 이 이미 보유한 원리. Cerebras = 프로덕션 증명.
- **evidence packet(fan-out→rerank→context 복원)**: vault 의 search_design→packet 패턴과 동형.

## 한계
- 사내 엔지니어링 블로그, 자체보고·미검증(벤치마크 수치 0, 리크루팅 목적). 단 기법은 표준(HNSW·RRF·Anthropic Contextual Retrieval)에 부합해 신뢰도 높음.

## 연결
- [Is Grep All You Need? — 에이전트 검색에서 grep vs 벡터 RAG (arXiv 2605.15184)](agentic-search-grep-vs-vector.md) — 검색법<하네스 설계. 본 노트 MCP primitive 설계가 그 실증
- [Memora — 추상화·구체성 조화 메모리 표현](memora-harmonic-memory.md) — distill-before-embed 3층 메모리 원리
- park-registry PK-007 — 원격 Sub-brain 전초기지: 본 스펙이 쿼리 가능 KB 청사진
- CLAUDE.md §4 — grep>벡터 (불변, 본 노트는 프로덕션 데이터포인트)

## 다음 학습 후보
- **CocoIndex** — Cerebras 가 40GB+ 코드레포 증분 임베딩에 쓴 오픈소스 프레임워크
- **Anthropic Contextual Retrieval** — chunk 에 문맥 prepend, 본 노트 bursting 의 선행
- **RRF 원논문** (Cormack et al., SIGIR 2009) — 융합 랭킹 정본
