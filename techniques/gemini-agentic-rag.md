# Gemini Agentic RAG & Sufficient Context Implementation

---
created: 2026-06-09
updated: 2026-06-14
type: learning
tags: [rag, agentic-rag, sufficient-context, vertex-ai, cross-corpus, multi-hop]
source:
  - Sufficient Context: A New Lens on Retrieval Augmented Generation Systems (arXiv:2411.06037)
  - Fact, Fetch, and Reason: A Unified Evaluation of Retrieval-Augmented Generation (arXiv:2409.12941)
  - RAG Engine Cross Corpus Retrieval - Gemini Enterprise Agent Platform Docs
  - REST Resource: projects.locations.ragCorpora - Google Cloud Docs
  - Unlocking dependable responses with Gemini Enterprise Agent Platform’s Agentic RAG (Google Research Blog)
authors:
  - Sufficient Context: Hailey Joren, Jianyi Zhang, Chun-Sung Ferng, Da-Cheng Juan, Ankur Taly, Cyrus Rashtchian
  - FRAMES: Satyapriya Krishna, Kalpesh Krishna, Anhad Mohananey, Steven Schwarcz, Adam Stambler, Shyam Upadhyay, Manaal Faruqui
  - Agentic RAG blog: Cyrus Rashtchian, Da-Cheng Juan
  - Google Cloud Docs: Google Cloud
year: 2024–2026
category: paper-bundle
proposed_by: external_ai (via gpt)
confirmed_by: user
confirmed_date: 2026-06-09
status: confirmed
---

## 0. 개요 및 분류
- **분류**: `technique`
  - Sufficient Context는 RAG 검색 결과의 “답변 가능성”을 판정하는 평가/제어 기법이고, Gemini Agentic RAG는 이 판정을 retrieval loop·routing·synthesis에 연결하는 구현 방법론이다.
- **한줄 정의**: `query-context pair`가 답변에 충분한지 LLM autorater로 판정하고, 부족하면 누락 슬롯·검색 힌트를 만들어 재검색/라우팅을 반복한 뒤, 충분한 근거가 있을 때만 합성하는 RAG 방어 패턴이다.

## 1. 보존 필수 원문 [VERBATIM]

### 1.1 Sufficient Context Assessment Prompt Template
- **원문 위치**: `Sufficient Context` (arXiv:2411.06037) PDF Appendix C.1 (pp.21–22) 및 GitHub `hljoren/sufficientcontext` README.
- **핵심 앵커**: “Sufficient Context: 1 IF the CONTEXT is sufficient to infer the answer to the question”
- **구성 요소**: 
  - Role: expert LLM evaluator.
  - Input: `QUESTION`, `REFERENCES`, timestamp placeholder `<TIMESTAMP>`.
  - Criterion: `Sufficient Context`를 `1`(추론 가능) 또는 `0`(불가능)으로 판정.
  - Required reasoning: step-by-step questions, implicit assumptions, math/arithmetic requirements.
  - Required output: `### EXPLANATION` followed by `### EVALUATION (JSON)`.
  - 1-shot example: Roald Dahl’s Guide to Railway Safety / British Railways Board / ceased to exist in 2001 / output `{"Sufficient Context": 1}`.
  - Runtime placeholders: `<question>`, `<context>`.

### 1.2 Sufficient Context Few-shot/Rule Examples
- **Few-shot 구성**: Gemini 1.5 Pro (1-shot) 기반 autorater가 최고 성능을 달성함.
- **Few-shot 내용**: Roald Dahl’s Guide to Railway Safety가 British Railways Board에 의해 출판되었고, context가 British Railways Board의 운영 기간 `1963 to 2001`을 제공하므로, “publisher가 언제 존재를 멈췄는가”라는 질문에 `2001`을 추론 가능하다고 판단하는 positive example.
- **수치적 근거 (Table 1 p.4)**:
  - Gemini 1.5 Pro 1-shot autorater: F1 `0.935`, Accuracy `0.930`, Precision `0.935`, Recall `0.935`, No GT Answer `✓`.
  - Gemini 1.5 Pro 0-shot autorater: F1 `0.878`, Accuracy `0.870`, Precision `0.885`, Recall `0.871`.
  - FLAMe fine-tune PaLM 24B: F1 `0.892`, Accuracy `0.878`, Precision `0.853`, Recall `0.935`.

### 1.3 Vertex AI RAG Engine Corpus Description Schema/Config
- **공식 API 스펙 (REST Resource `projects.locations.ragCorpora`)**:
  - `RagCorpus` schema fields:
    - `name`: string, output only.
    - `displayName`: string, required, max 128 UTF-8 characters.
    - `description`: string, optional, the description of the RagCorpus (Routing 핵심 필드).
- **Cross Corpus Retrieval 요구 사항**:
  - corpus 생성 시 `description` 설정 필수. **(생성 후 수정 불가)**
  - Strategic planning agent(Gemini-powered)가 user query와 corpus descriptions를 비교하여 **Targeted Routing**을 수행함.

## 2. 원자적 주장 (Atomic Claims)
1. Sufficient Context 논문은 RAG 실패를 “모델의 컨텍스트 소화 실패”와 “검색된 컨텍스트 자체의 정보 부족”으로 분리해 분석한다. (arXiv:2411.06037 PDF §1)
2. `Sufficient Context`는 ground-truth answer(정답 기준) 없이 `Q`(질문)와 `C`(컨텍스트)만으로 판정 가능한 binary signal이다. (arXiv:2411.06037 Table 1)
3. context가 incomplete, inconclusive, contradictory이거나 specialized knowledge가 누락되었을 때 insufficient로 판정한다. (arXiv:2411.06037 PDF §3.1)
4. FRAMES 벤치마크(FramesQA)는 824개 multi-hop question으로 구성되며, 각 질문은 2–15개 Wikipedia article 정보를 요구한다. (arXiv:2409.12941 §2)
5. FRAMES 벤치마크 실험 결과, Vanilla RAG(58.68%) 대비 Cross-Corpus Agentic RAG는 `90.1%`, Single-Corpus Agentic RAG는 `93.61%` 정확도를 보였다. (Google Research Blog chart)
6. FRAMES single-step RAG의 실패 원인 중 약 80%는 numerical, tabular, post-processing 카테고리에 집중된다. (arXiv:2409.12941 §3.1)
7. multi-step RAG는 query diversity 부족으로 인해 잘못된 방향으로 재검색을 진행하고 자가교정하지 못하는 문제를 겪는다. (arXiv:2409.12941 §3.2)
8. RAG Engine Cross Corpus Retrieval은 Orchestrator/Router, Planning Agent, Retrieval Engine, Reasoning Agent, LLM Generator로 구성된다. (Google Cloud Docs "System Architecture")

## 3. 구조 및 메커니즘 (Conceptual Flow)

### 3.1 Sufficient Context 분류기 작동 알고리즘
1. **입력**: `QUESTION` + `REFERENCES` + `<TIMESTAMP>` 수집.
2. **분석**: Query가 요구하는 answer slot 분해, implicit assumption 도출, 산술/시간 연산 요건 추출.
3. **충분성 판정**: plausible answer를 infer할 수 있으면 `{"Sufficient Context": 1}`, 불완전/모순이 있으면 `{"Sufficient Context": 0}`.
4. **피드백 생성 (Reasoning Agent)**: insufficient일 때 context에서 빠진 missing pieces를 분석하고, 다음 재검색을 위한 hints/feedback query를 생성하여 Query Rewriter로 전달.

### 3.2 FRAMES 5대 추론 유형별 RAG 실패 및 Query Decomposition
1. **Numerical Reasoning (수치 연산)**:
   - *실패*: 속도/수치 비교 시 하나의 값만 retrieve하거나 단위 변환/비율 계산 누락.
   - *Decomposition*: [두 속도 값 각각 식별] -> [개별 속도 수치 검색] -> [비율 연산 및 반올림].
2. **Tabular Reasoning (표 구조 해석)**:
   - *실패*: 표 내부의 복잡한 row/column 라벨을 오독하거나 텍스트 청킹 중 표 구조가 유실되어 꼬임.
   - *Decomposition*: [조직/팀의 대상 식별] -> [해당 팀/선수의 성적 테이블 검색] -> [행/열 레이블 매칭 검증] -> [정밀 스탯 추출].
3. **Multiple Constraints (다중 제약 조건)**:
   - *실패*: 제약 조건 A, B 중 하나만 만족하는 후보를 오답으로 도출 (Intersection 연산 실패).
   - *Decomposition*: [제약 A 만족하는 위치/값 탐색] -> [해당 바운더리 내 제약 B 후보 추출] -> [교집합 검증 및 단일해 도출].
4. **Temporal Reasoning (시계열 및 전후 관계)**:
   - *실패*: 기준 시점(reference year)을 놓치거나 "N년 전/후" 연산 후 타겟 테이블 조회를 생략함.
   - *Decomposition*: [특정 사건의 발생 연도 식별] -> [목표 시간 차감/합산 계산] -> [해당 연도의 수상자/사건 검색].
5. **Post-Processing (후처리)**:
   - *실패*: 검색된 정보의 가공 단계(예: 연도를 로마 자모로 변환, 순위 가공 등)에서 최종 변환 오류.
   - *Decomposition*: [국가/대상 식별] -> [설립연도 검색] -> [N년 합산] -> [최종 포맷 변환].

### 3.3 Vertex AI RAG Engine Targeted Routing 흐름
1. User Query가 인입되면 Planning Agent가 쿼리를 쪼개고 `RagCorpus.description`과 semantic matching을 수행.
2. Planner가 특정 query part를 매칭되는 corpus로 targeted routing하여 naively 전체를 훑지 않도록 함.
3. `AskContexts` API를 통해 Reasoning Agent가 sufficiency를 판정하여 루프를 재트리거하거나, LLM Generator가 최종 답변을 동기식으로 합성하여 반환.

## 4. 분석 및 평가 (Risk & Commentary)
- **Novelty**: 단순히 에이전트 여러 개를 붙인 RAG가 아니라, **Sufficient Context 판정 결과가 피드백 루프를 타고 재검색을 유도하는 제어 구조**를 상용 API 레벨로 제품화했다는 점이 핵심이다.
- **한계점**: 
  - **Mutable 불가한 Metadata**: RAG corpus의 routing 핵심 신호인 `description`이 생성 후 수정 불가(immutable)하므로, 메타데이터 관리 실패 시 RAG 전체가 불통되는 위험이 있다.
  - **Inference Latency**: FRAMES baseline 실험 기준 multi-step planning(5 iterations)은 최소 6번의 순차적 LLM call을 요구하므로, 비용 및 latency 트레이드오프가 극심하다.

## 5. 출처 논문 및 문서
- **Sufficient Context**: *Hailey Joren et al.*, "Sufficient Context Awareness" (arXiv:2411.06037) - ICLR 2025.
- **FRAMES**: *Satyapriya Krishna et al.*, "FRAMES: Factuality, Retrieval, and Reasoning Evaluation" (arXiv:2409.12941).
- **Google Cloud Platform Docs**: Vertex AI Agent Platform - RAG Engine docs.
