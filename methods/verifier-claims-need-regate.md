---
created: 2026-06-15
updated: 2026-06-18
type: learning
tags: [method, verification, adversarial, hallucination, gate, operating-principle]
category: method
---

# 검증자의 주장도 환각이다 — 강한 주장은 1차 출처로 재-Gate

*작가 운영 원칙 (메모리 → 그래프 승격 2026-06-18). AI 교차검증 운용 시 상시 적용.*

Adversarial verification(생성자≠검증자)으로 외부 AI(Gemini·GPT·다른 Claude)에게 교차검증을 시킬 때, **검증자의 주장 ≠ 진실**. 특히 "이 출처는 피싱/맬웨어다", "보안 위험" 같은 *강한 주장*일수록 그대로 믿고 vault 에 반영하기 전에 **1차 출처(WebFetch 공식 docs 등)로 직접 재-③Gate** 한다.

---

## Why

2026-06-15 Gemini 가 [Dynamic Workflows — 작업마다 하네스 (Claude Code)](dynamic-workflows-harness.md) 교차검증에서 `code.claude.com` 을 "피싱 도메인"이라 단언 → WebFetch 직접 확인 결과 정상 공식 Agent SDK docs 였음(환각). 맹신했다면 Layer C 정본 [Claude Code 런타임 내부 (Layer C)](claude-code-runtime-internals.md)(code.claude.com 11개 출처)을 훼손할 뻔. **검증자도 환각한다** — dynamic-workflows 가 서술한 self-preferential bias 차단을 *검증자 자신에게* 적용해야 함. [Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](karpathy-guidelines.md) #1(가정 표면화) 정확한 사례.

## How to apply

1. 검증자 리포트를 받으면 **valid 적발은 선별 반영**하되
2. 가장 강하거나 파괴적인 주장(출처 무효·삭제·보안)은 **반드시 1차 출처 1~2건으로 재확인 후에만 적용**
3. 전수 재검증은 토큰 낭비 — *강한 주장만* 표적 재-Gate
4. 정본 훼손 방향 변경은 특히 보수적으로

---

## 연결된 페이지

- hermes-loop (③Gate — 본 원칙이 검증자 단계에 적용) · [Dynamic Workflows — 작업마다 하네스 (Claude Code)](dynamic-workflows-harness.md) (사고 발생 맥락) · [Claude Code 런타임 내부 (Layer C)](claude-code-runtime-internals.md) (훼손 위험 정본)
- [Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](karpathy-guidelines.md) (#1 가정 표면화)
- [리서치는 전문 통독 — 인접한 것까지 뽑아 박제](research-thoroughly-extract-adjacent.md) · [WebFetch 는 lossy 요약 — 충실 학습은 clone 통독](webfetch-is-lossy-clone-for-fidelity.md) — 학습 충실성 운영 원칙 3종의 자매(검증자 재-Gate / 흡수 깊이 / 출처 충실). 셋 다 "외부 입력을 그대로 믿지 말고 1차로 검증·통독하라"의 다른 국면
