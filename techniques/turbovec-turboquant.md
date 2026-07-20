---
created: 2026-07-18
updated: 2026-07-18
type: learning
tags: [vector-search, quantization, turboquant, ann, local-rag, simd, grep-vs-vector, wheel-reuse]
source:
  - https://github.com/RyanCodrai/turbovec
authors: [Ryan Codrai, Google Research (TurboQuant)]
year: 2026
category: technique
---

<!-- turbovec — train-free 벡터 양자화 인덱스(TurboQuant). vault는 grep>벡터라 park, 작가 벡터 프로젝트/솔루션 착수 시 꺼내는 레퍼런스 -->

# turbovec — TurboQuant 기반 로컬 벡터 인덱스

> **왜 이 노트**: 작가 "나중에 Vector 기반 프로젝트/솔루션 제안할 때 응용." vault 자체는 §4 grep>벡터라 안 쓰지만, **작가가 외부에 벡터 솔루션을 만들 때 바퀴 재발명 없이 꺼낼 레퍼런스**. ([메타데이터 기반 앱 아키텍처 (ERPNext/Frappe DocType 골격)](metadata-driven-app-architecture.md)와 같은 "필요 시 골격" 성격.)

## 한 줄 요약

> **학습(train) 없이 벡터를 16배 압축하면서 FAISS보다 빠른** 로컬 ANN 엔진(Rust+Python, MIT). 10M 문서 float32 31GB → 4GB, air-gapped RAG 가능. 핵심 = *데이터를 안 보고*(data-oblivious) 양자화하는 TurboQuant.

## 핵심 메커니즘 — data-oblivious 양자화 (train 단계 X)

```
① Normalize        길이 제거, 단위 방향만
② Random rotation  직교행렬 적용 → 좌표가 Beta 분포 따름  ← 데이터 안 봐도 분포 앎 = train-free 핵심
③ TQ+ calibration  첫 add 시 per-coord quantile 맞춤(shift/scale)
④ Lloyd-Max quant  precomputed 최적 버킷(2-bit=4 / 4-bit=16)
⑤ Bit-packing      1536d 2-bit = 384B (vs float32 6144B)
⑥ Length-renorm    per-vector 보정 스칼라로 내적 추정 unbias
```

- **검색 커널**: SIMD(NEON/AVX-512BW/AVX2) + nibble 룩업 + **SIMD 내부 필터**(id allowlist/bitmask, over-fetch 0).
- **online ingest**(rebuild 없음, 추가 즉시 인덱싱) · **stable external IDs**(IdMapIndex, O(1) 삭제) · LangChain/LlamaIndex/Haystack/Agno drop-in · 순수 로컬.
- 벤치: R@1 FAISS +0.2~1.9(OpenAI d=1536/3072) · M3 Max에서 FAISS FastScan +10~19% · 압축 16x(2-bit)/4x(4-bit).

## 🔀 이미 수용한 지점과의 delta (⚠️ vault 철학과 정면)

| turbovec | vault 기존 결정 | delta |
|---|---|---|
| 벡터 ANN 검색 최적화 | 헌법 §4 **grep>벡터, 벡터 RAG 미도입**([Is Grep All You Need? — 에이전트 검색에서 grep vs 벡터 RAG (arXiv 2605.15184)](agentic-search-grep-vs-vector.md)) | ⚠️ 철학적 상충 — vault는 벡터를 *안 쓰기로* 결정 |
| train-free·4GB·로컬·air-gapped | vault 벡터 기피 이유 = 오프라인·속도·그래프 미편입·자산 통합 불가 | ⭐ 오프라인·속도·메모리를 해소 → 도입 장벽 하락(단 그래프·자산 미편입은 미해결) |
| 벡터가 재표현 개념 매칭 | [Memora — 추상화·구체성 조화 메모리 표현](memora-harmonic-memory.md) cue anchors / `concept-dedup` 구멍 | 같은 구멍의 *다른 해법*(임베딩 vs 명시 앵커) |

→ **turbovec는 §4를 뒤집지 않는다.** [Is Grep All You Need? — 에이전트 검색에서 grep vs 벡터 RAG (arXiv 2605.15184)](agentic-search-grep-vs-vector.md) 근거(*"하네스 설계가 검색법보다 점수를 지배"*)는 불변 — turbovec는 *검색법* 최적화지 하네스 아님. 갱신되는 건 "벡터를 켤 때의 실무 비용"뿐.

## 🔬 한계·비판

- 저차원(d=200) margin 좁음 · x86 2-bit는 FAISS(VBMI)에 ~8% 뒤짐 · Lloyd-Max distortion = 정보이론 하한 **2.7배**(renorm 전).
- 벤치 100K/10M 특정 · TurboQuant=Google 알고리즘(turbovec=구현체) · 결국 **인프라(infra-0 축)** — vault 내부 도입은 의존성·복잡도 증가.
- **근본 미해결**: vault가 벡터를 안 쓰는 진짜 이유 = *grep+wikilink 그래프가 이미 충분 + 벡터가 vault 자산·그래프에 미편입*. turbovec는 이걸 안 풀어줌.

## 🌿 시너지 가지뻗기 (park — 명명 트리거)

> [학습→반영 루프 (Absorb-to-Apply)](../narrative/학습→반영 루프.md): 즉시 반영 X. **park + 트리거 2종**:

1. ⭐ **작가 Vector 기반 프로젝트/솔루션 제안 시** (작가 명시 트리거) — 로컬·저메모리·train-free·air-gapped 벡터 검색이 필요하면 **turbovec가 1순위 후보**(FAISS 대비 압축·속도·online ingest 우위). 외부 제품/RAG 솔루션에 바퀴 재발명 없이 채택. → [메타데이터 기반 앱 아키텍처 (ERPNext/Frappe DocType 골격)](metadata-driven-app-architecture.md)(정형앱)·remote-subbrain-outpost-plan(기업 솔루션)과 같은 "필요 시 골격" 큐.
2. **vault §4 재검토 트리거 발동 시** — "graphify로 해결 안 되는 컨텍스트 문제 식별" 시(reference §Zotero/NotebookLM 트리거와 동급 신중). concept-dedup(재표현 매칭)에서 [Memora — 추상화·구체성 조화 메모리 표현](memora-harmonic-memory.md) cue anchors로 부족하면 벡터 백업. **단 §4 = LOCKED 헌법, 도입은 HITL.**

## 선행 관점
vault는 "벡터 미도입"을 *검증된 선택*(§4)으로 유지. turbovec는 그 선택을 뒤집는 게 아니라 **재평가 문턱값을 갱신**하는 재료 — "벡터가 이제 train-free·4GB·air-gapped면 도입 조건이 바뀌었나?"를 물을 때의 근거. 근본(하네스 지배·그래프 우위)은 불변이라 vault가 여전히 앞섬.

## 관계
- [Is Grep All You Need? — 에이전트 검색에서 grep vs 벡터 RAG (arXiv 2605.15184)](agentic-search-grep-vs-vector.md) — vault 검색 철학(turbovec의 대척점·재검토 근거).
- [Memora — 추상화·구체성 조화 메모리 표현](memora-harmonic-memory.md) — 재표현 매칭의 대안 해법(cue anchors vs 임베딩).
- [MinSync — 증분 벡터 인덱싱 기법 (경량 흡수 + 응용 대비 기록)](minsync-incremental-indexing.md) / [CocoIndex — Incremental Data Pipeline for AI Agents](cocoindex.md) — 증분 인덱싱 인접.
