---
created: 2026-07-18
updated: 2026-07-18
type: learning
tags: [rag, document-understanding, ingestion, ocr, table-structure, deepdoc, chunking]
source: https://github.com/infiniflow/ragflow (deepdoc/README.md)
category: method
---
<!-- 개념: RAG 의 진짜 레버는 검색법이 아니라 "청크 전에 문서를 제대로 파싱하는가"(layout+TSR). vault delta = 검색축이 아니라 *수집(ingestion)축*. -->

# Deep Document Understanding (RAGFlow / DeepDoc) — RAG 의 레버는 검색이 아니라 *수집*이다

*출처 = 작가가 준 홍보 트윗(@undefinedKi, RAGFlow 85k★ 자랑)의 **포인터**를 따라간 1차 출처 RAGFlow(infiniflow) repo. 트윗 자체는 마케팅("Bookmark this"·"catch hallucinations before they cost you") → 흡수 대상 아님. 배울 것은 그 아래 **개념**뿐.*

---

## 0. 정직 판정 (먼저)

- **RAGFlow-제품** = 벡터/하이브리드 RAG 엔진. **vault 에 안 맞음** — 헌법 §4 는 "벡터 RAG 미도입, grep+그래프"를 *검증된 선택*으로 잠갔다([Is Grep All You Need? — 에이전트 검색에서 grep vs 벡터 RAG (arXiv 2605.15184)](../techniques/agentic-search-grep-vs-vector.md)). RAGFlow 검색 절반은 vault 방향과 상충 → 도입 0.
- **DeepDoc-개념** = 검색과 무관한 **문서 수집(ingestion) 기법**. 이건 이식 가능하고, 하필 **이 세션에서 내가 직접 겪은 문제를 정확히 짚는다**(§3).
- ⚠️ repo README 최상단은 "deep document understanding" 을 *기계적으로 명세하지 않는다*(WebFetch 판정: 알고리즘·모델·정확도 수치 0, "primarily promotional"). 기술 알맹이는 `deepdoc/` 모듈에만. **정확도 주장·"hallucination 잡는다"는 벤치마크 없음 → 인용 금지.**

---

## 1. 개념 한 줄

> 대부분의 RAG 는 텍스트를 청크로 쪼개고 *맞는 게 돌아오길 바란다*. RAGFlow 의 주장 = **다들 건너뛰는 단계는 문서 그 자체**다 — 검색법을 튜닝하기 전에, 못생긴 입력(스캔 PDF·슬라이드·엑셀·이미지)을 **레이아웃 인식으로 구조 보존 파싱**해 설명가능한 청크로 만들어라. 레버는 retrieval 이 아니라 ingestion.

---

## 2. DeepDoc 기법 (1차 출처에서 검증된 것만)

**두 축 = Vision + Parser.**

### Vision (이미지 레벨 이해)
- **OCR** — 문서 이미지·PDF 에서 텍스트 추출(위치맵 + 텍스트).
- **Layout Recognition** — 문서 영역을 **10종**으로 분류: `Text · Title · Figure · Figure caption · Table · Table caption · Header · Footer · Reference · Equation`. → 이 분류가 "이건 순차 읽기 / 이건 표 처리 / 이 캡션은 저 그림에 붙임" 같은 downstream 결정을 만든다.
- **TSR (Table Structure Recognition)** ★ — 표의 **5 구조요소** 탐지: `Column · Row · Column header · Projected row header · Spanning cell` → **표를 LLM 이 이해하는 자연어 문장으로 변환**. (표 처리 전 auto-rotation: 0°/90°/180°/270° 를 OCR confidence 로 판정.)

### Parser (구조 포맷별 전용)
- PDF · DOCX · EXCEL · PPT 각각 전용 파서(PDF 가 포맷 유연성 때문에 제일 복잡).
- PDF 산출 = **위치 붙은 청크(페이지 번호 + bounding box)** + 표(크롭 이미지 + 산문 번역) + 그림(캡션·추출 텍스트 페어).

**요점**: 청크가 "N자마다 자르기"가 아니라 **의미 영역 단위**(제목·표·캡션·수식을 각자 다르게). 표는 셀 격자를 살려 문장화. 그래서 "explainable chunk" + "traceable citation(페이지·bbox)" 이 나온다 — 마법이 아니라 *파싱을 제대로 해서*.

---

## 3. ⭐ vault delta — 하필 이 세션에서 내가 겪은 문제

DeepDoc 이 푸는 문제 = **평문 추출이 표·레이아웃을 뭉갠다**. 이건 추상론이 아니다. **오늘 self-improvement 논문 5편을 흡수하며 내가 그대로 당했다.**

HGM `paper.txt` 추출 실제 모습(표가 셀 단위로 흩어짐):
```
SICA
0.444
0.444
0.274
0.274
DGM
0.285
...
```
→ Table 1(추정기 상관계수)이 이렇게 세로로 흩뿌려져, 나는 **어느 숫자가 어느 (방법 × 데이터셋 × weighted/unweighted) 셀인지 수동으로 재조립**했다. DGM Table 2·SICA Table 1 도 마찬가지. 즉 vault 의 논문 수집 파이프(HTML→정규식 평문 / [clone 통독](webfetch-is-lossy-clone-for-fidelity.md) / clean-reader)는 **본문엔 강하지만 *표 구조는 손실***한다. DeepDoc 은 그 손실 지점(Layout Recognition + TSR)에 정확히 이름을 붙인다.

**개념축 정리** — vault 는 *검색축*(grep>vector)만 명시적으로 갖고 있었다. RAGFlow 는 그 옆에 **수집축**을 세운다:

| 축 | vault 기존 | 이 개념 |
|---|---|---|
| **검색(retrieval)** | grep+그래프 > 벡터 (§4, 잠금) | RAGFlow=벡터/하이브리드 (vault 와 상충 → 무시) |
| **수집(ingestion)** | 명시 규율 없음 — 평문 추출(표 손실) | **layout+TSR 로 구조 보존** (이식 가능) |

그리고 이건 헌법 §4 의 *자기 각주*와 rhyme 한다 — §4 는 "[검색] 방법보다 **하네스 설계가 점수를 지배**"라고 이미 인정한다. RAGFlow 의 주장은 그 수집판 형제다: **retrieval 메커니즘보다 입력 파싱 품질이 지배**. 두 독립 출처가 "레버는 검색법 자체가 아니다"를 다른 각도에서 말한다. → vault 의 grep>vector 를 *뒤집지 않는다*. 오히려 "그 논쟁 자체가 2순위, 입력 품질이 상류"라고 보강한다.

---

## 4. 학습→반영 루프 (Apply-or-Park)

| 수확 | 판정 | 사유·트리거 |
|---|---|---|
| **평문 추출 = 표 손실 인지** (§3) | **② Park** | 반영처 = paper-study / clean-reader 수집 규율. **트리거: 핵심 주장이 *표 안에* 있는 논문·문서를 흡수하는 1건** — 그때 "평문 말고 렌더 뷰/HTML 표 구조로 그 영역만 재확인" 을 1회 절차화 판정. 지금 워크플로 수정 = L-STAGE 이고 근거가 이 세션 1건이라 스테이징도 이르다. **경량 즉시 습관**(diff 아님): 표가 핵심인 논문은 추출 평문을 맹신 말고 원본 표 영역을 눈으로 재대조 — 오늘처럼. |
| DeepDoc 파서 도입 | **③ 순수참조 + 이식 불가** | OCR·TSR 모델 구동 = infra, infra-0 충돌. vault 는 스캔 PDF 대량 처리 안 함(작가가 텍스트/HTML 위주 투입). 억지 도입 = Karpathy #2. |
| "수집축 > 검색축" 개념 | **③ 순수참조 — 헌법 §4 보강** | §4 grep>vector 를 *바꾸지 않음*. "입력 품질이 상류 레버"라는 각주적 보강. 반영 diff 없음(기존 §4 각주가 이미 같은 방향). |
| RAGFlow 벡터 엔진 | **③ 순수참조** | 벡터 RAG 재검토 트리거(헌법 §4·papers 500MB 등) 진입 시에만 후보. 현재 무관. |

**반영 diff = 0.** 단 park 은 *구체적이고 자기관찰 기반*이라(오늘 5편에서 실제 발생) 이전 self-improvement park 들보다 발화 임박도가 높다.

---

## 5. Anti-Overclaim

- ❌ "RAGFlow 가 hallucination 을 잡는다/정확도 X%" → **벤치마크·수치 0**(repo 프로모션). "traceable citation" = UI 기능(페이지·bbox 시각화)이지 검증 방법론 아님.
- ❌ "deep document understanding" 을 명세된 알고리즘처럼 인용 → repo README 는 기계적 명세 안 함. 검증된 건 **DeepDoc 모듈의 구성**(OCR·10종 layout·TSR 5요소)뿐.
- ❌ "RAGFlow 도입하자/vault 가 벡터 RAG 로 가야" → **아니다.** 헌법 §4 grep>vector 불변. 이 노트는 *수집축* 개념만 흡수, 검색축은 손 안 댐.
- ❌ 트윗 카피("China's biggest retailer 엔지니어"·"85,000 stars"·"Bookmark this") 를 사실로 → 마케팅. star 수·인물 서사 미검증, 무관.
- ⚠️ 트윗 = 컷오프 이후 홍보물. 1차 출처(repo)로 내려가 기법만 취함(비판적 검증 시그널 preference-ledger 2026-07-17).

---

## 6. 연결

- [Is Grep All You Need? — 에이전트 검색에서 grep vs 벡터 RAG (arXiv 2605.15184)](../techniques/agentic-search-grep-vs-vector.md) — 검색축(grep>vector). 본 노트 = 그 *옆의 수집축*. 상충 아니라 직교
- [WebFetch 는 lossy 요약 — 충실 학습은 clone 통독](webfetch-is-lossy-clone-for-fidelity.md) · clean-reader · paper-study — vault 수집 파이프. 표 손실 지점
- [리서치는 전문 통독 — 인접한 것까지 뽑아 박제](research-thoroughly-extract-adjacent.md) — 충실 추출 규율. 표 구조 = 그 사각지대
