---
created: 2026-05-05
updated: 2026-06-16
type: learning
tags: [architecture, subquadratic, long-context, llm, ssa, rag-killer]
source: https://subq.ai/introducing-subq
category: technique
---

# SubQ 및 SSA 아키텍처: 초거대 컨텍스트의 실현 (Subquadratic Intelligence)

본 문서는 전통적인 Transformer의 $O(n^2)$ 복잡도 한계를 극복하고 선형 스케일링($O(n)$)을 실현한 **SubQ** 모델과 그 핵심인 **SSA (SubQ Sparse Attention)** 아키텍처에 대한 분석 및 아카이브입니다.

---

## 1. 개요: 무엇이 다른가?
**SubQ**는 "Efficiency is Intelligence"라는 철학 하에 개발된 **완전한 서브쿼드라틱(Fully Subquadratic)** 언어 모델입니다.

*   **기존 한계**: 표준 Transformer는 입력 길이가 길어질수록 연산량이 제곱으로 증가하여 수백만 토큰 처리가 사실상 불가능함.
*   **SubQ 솔루션**: 수학적 설계를 근본적으로 재정의하여 연산량을 **선형(Linear)**으로 유지하면서도 성능(Accuracy)을 유지함.

## 2. SSA (SubQ Sparse Attention) 아키텍처
SSA는 SubQ 모델의 핵심 연산 메커니즘으로, 다음과 같은 기술적 특징을 가집니다.

*   **선형 스케일링 ($O(n)$)**: 컨텍스트 길이에 비례하여 연산이 증가함. 1,200만 토큰 처리 시 기존 모델 대비 어텐션 연산량을 약 **1,000배** 절감함.
*   **압도적 속도**: FlashAttention 대비 **52배 빠른** 어텐션 속도를 기록함.
*   **수학적 재설계**: 단순히 층을 줄이는 방식이 아닌, 토큰 간 상호작용 방식을 수학적으로 재설계하여 "Frontier-level"의 정확도를 보존함.

## 3. RAG vs SubQ (Long-Context)
SubQ는 현재 지배적인 기술인 RAG(검색 증강 생성)를 '기술적 한계로 인한 임시 방편(Workaround)'으로 정의합니다.

| 비교 항목 | 전통적 RAG | SubQ (Massive Context) |
| :--- | :--- | :--- |
| **데이터 처리** | 문서를 쪼개서(Chunk) 일부만 검색 | **전체 코퍼스**를 컨텍스트에 직접 로드 |
| **일관성** | 검색 품질에 의존, 맥락 단절 발생 | 전체 지식을 한 번에 조망, 깊은 추론 가능 |
| **복잡도** | 복잡한 임베딩/검색 파이프라인 필요 | 단순 데이터 주입만으로 해결 |
| **추론 능력** | 흩어진 정보 간의 관계 파악에 취약 | 1,200만 토큰 내 모든 관계를 완벽 파악 |

## 4. 기술적 우위 (Benchmark)
*   **RULER 128K**: 95%의 정확도를 기록 (Claude Opus 4.6 및 GPT-4o-mini 압도).
*   **MRCR v2**: 여러 조각의 정보를 조합하여 추론하는 능력이 최상위권임.
*   **연산 효율**: 기존 어텐션 메커니즘 대비 **63% 적은 연산량**으로 동일 결과 도출.

---

## 💡 Sub-brain (Goal 0) 적용 인사이트
SubQ의 등장은 우리가 추구하는 **LLM Wiki의 상위호환**에 다음과 같은 시사점을 줍니다.

1.  **RAG-less Wiki**: 지식의 양이 수백만 단어 수준이라면, 복잡한 인덱싱 없이 **전체 위키를 하나의 컨텍스트**에 밀어넣는 것이 훨씬 더 정확한 답변을 보장함.
2.  **전체 맥락 파악**: "내 전체 삶의 기록(위키) 중에서 상충하는 신념 3가지를 찾아줘"와 같은, 전체를 훑어야 하는 고난도 질문 처리에 최적화됨.
3.  **경제적 운영**: 컨텍스트가 길어져도 비용과 속도가 유지되므로, 위키가 비대해져도 AI의 성능 저하가 없음.

---

## 참고 자료
*   [SubQ 공식 소개: Introducing SubQ](https://subq.ai/introducing-subq)
*   [RULER 벤치마크 데이터](https://github.com/hsiaoyetgun/RULER)
