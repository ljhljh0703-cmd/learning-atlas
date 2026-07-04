---
created: 2026-06-30
updated: 2026-06-30
type: learning
category: technique
tags: [rsi, self-improvement, evaluator, gate, co-evolution, north-star]
source: https://arxiv.org/abs/2606.26294
authors: [Iacob et al. (Cambridge·NVIDIA·Flower Labs·MBZUAI·Inria)]
year: 2026
doi: arXiv:2606.26294
---
<!-- RQGM(arXiv 2606.26294) — 평가자까지 함께 진화시키는 자기개선 에이전트. 북극성 직결: "Gate/Verifier 자체를 안전하게 성장시키는 법". full-text 검증(로컬 PDF). ⚠️ preliminary preprint. Codex teardown ③Gate. -->

# Red Queen Gödel Machine — 평가자까지 같이 진화시키는 자기개선

> **⚠️ ③Gate 정직성**: arXiv 2606.26294 (2026-06-24, 컷오프 이후). **full-text 검증됨**(작가 로컬 PDF, SHA256 일치, Codex 추출 수치 전건 본문 trace = 환각 0). 단 **preliminary preprint** — 저자 자인 "work in progress·짧은 search horizon·장기 전역 수렴 미보장". GPT-5.5 의존·human grading 없음·anchor 약점. **장기 수렴 보장처럼 인용 금지.**

## 한 줄
RQGM = self-improving agent의 **고정 verifier 문제**를 풀기 위해, evaluator를 **epoch 단위로만 freeze/교체**하고 **ground-truth anchor + selective erasure**로 평가 드리프트를 통제하는 agent×evaluator **공진화 프레임**.

## 해결하는 문제 — 고정 평가자의 한계
기존 DGM/HGM 계열은 고정 benchmark/verifier 전제. 세 한계: ① benchmark 없는 작업(논문·증명 생성) ② 평가가 비싸고 느린 작업 ③ 평가 포화·보상 해킹(agent가 verifier 빈틈 학습). → 평가자도 개선돼야 하나, 그냥 바꾸면 search 보장이 깨짐.

## 핵심 개념 5종
1. **Controlled Utility Evolution** — evaluator 교체는 *epoch 경계에서만*(중간 변동 금지 → 탐색 안정).
2. **Learned Evaluator** — reviewer/grader/code-reviewer 역할 자체가 search 대상. generator뿐 아니라 evaluator도 같은 archive에서 개선(공유 인프라가 양쪽에 영향).
3. **Ground-Truth Anchor** — 평가 드리프트를 막는 고정 닻 데이터셋(CRAVE/IMO-Grading/APReS).
4. **Selective Erasure** ★ — evaluator 교체 시 *그 evaluator에 의존한 utility record만* 무효화, 독립 record는 보존. 전체 재평가 X, *다시 방문되는 node부터* 재평가.
5. **Adversarial Objective** — agent↔evaluator 적대적 목적(Red Queen = 서로 쫓는 공진화).

## 결과 (논문 claim — preliminary)
- Polyglot coding: held-out pass 71.7% (prior HGM-H 69.9%)
- Coding cost: code-reviewer 신호로 prior SOTA 대비 1.35~1.72x fewer tokens
- Paper writing: acceptance 21.8% → 38.8%(generalist)/40.5%(specialist), 1.78~1.86x

## 🌟 북극성 흡수 (vault 시스템에 붙는 델타)
vault는 Doer-Verifier로 *검증자 독립*까지 갔으나, **검증자 *개선*의 운영 프레임은 없었다**. RQGM이 그 빈칸을 채움:
- **Selective re-gate** = vault 언어로: **"Gate 기준이 바뀌면 그 기준에 의존해 pass된 판정만 재게이트"** (전체 기억 무효화 X, 의존성 있는 판정만 selective invalidation). [검증자의 주장도 환각이다 — 강한 주장은 1차 출처로 재-Gate](../methods/verifier-claims-need-regate.md)의 운영 확장.
- **hermes-loop / agent-harness Doer-Verifier의 다음 단계** = evaluator(③Gate 기준) 자체를 epoch 단위로 버전·동결·교체하는 프레임.
- **GateEvalSet-v0** = vault용 ground-truth anchor 데이터셋 후보(③Gate가 흔들릴 때 닻).

## 반영 (학습→반영) — ✅ MERGED 2026-06-30 (작가 "머지해")
- ✅ **hermes-loop §③.E Gate Evolution** 반영 — epoch freeze·anchor 우선·selective re-gate·HITL 승인.
- ✅ **agent-harness N-3.5 Verifier 개선** 반영 — anchor-gated(엄격해 보여서 X, anchor 성능 개선 시만).
- ✅ **gate-eval-set-v0** 신규 — ③Gate anchor 정답집(vault 실사건 시드: PASS·false accept·verifier 환각·latent bug·low-value reject).
- ✅ **incubator 스킬** evaluator-evolution-gate(provisional, 패치 merge 후 active 검토).

## 적용 금지
- 장기 전역 수렴 보장처럼 인용 X(preliminary). vault ③Gate를 *자동 진화*로 전환 X — anchor 없는 evaluator 자가변동은 보상해킹 위험.

## 연결
[Recursive Self-Improvement — "When AI builds itself" (Anthropic)](recursive-self-improvement.md) · hermes-loop · agent-harness · [Gnosis — 파인튜닝 없이 헌법·메모리·루프로 성장하는 자가개선 에이전트 (vault 아키텍처 수렴 ground-truth #5)](../methods/gnosis-self-improving-agent.md) · [검증자의 주장도 환각이다 — 강한 주장은 1차 출처로 재-Gate](../methods/verifier-claims-need-regate.md) · [Hermes Agent — Nous Research 자가개선형 에이전트 플랫폼](hermes-agent.md)
