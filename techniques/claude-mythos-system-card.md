---
created: 2026-06-30
updated: 2026-06-30
type: learning
category: technique
tags: [anthropic, system-card, alignment, agent-failure, model-welfare, safety-case]
source: "Anthropic — System Card: Claude Mythos Preview (244p, 2026-04-07). 작가 확인=진짜 Anthropic 공식본."
authors: [Anthropic]
year: 2026
---
<!-- Claude Mythos Preview 시스템 카드 — 방법론·구조 델타만(성능수치는 RSI 노트 기보유, 중복X). 작가 확인=진짜 Anthropic. 흡수 알맹이=강한 모델 제한배치 시 안전·정렬·복지·질적경험을 어떻게 시스템카드로 묶는가. Codex teardown ③Gate. -->

# Claude Mythos Preview System Card — 방법론·구조 델타

> **출처**: Anthropic 공식 시스템 카드(244p). 게이트 시점 공개 URL 미확인이었으나 **작가 확인 = 진짜 Anthropic 확정**(2026-06-30). 성능 수치(METR 16h·~52× 등)는 이미 [Recursive Self-Improvement — "When AI builds itself" (Anthropic)](recursive-self-improvement.md)에 2026-06-09 별개 게이트로 흡수됨 → **본 노트 = 중복 아닌 방법론/구조 델타**. (민감 사이버 평가 세부는 비흡수.)

## 흡수 알맹이
"Mythos가 얼마나 강한가"가 아니라 **강한 모델을 공개 않고 제한 배치할 때 안전성·정렬·모델복지·질적 경험을 어떻게 시스템 카드로 묶는가**.

## 핵심 구조 델타
1. **Release decision as safety case** — 출시 결정을 *안전 논증 문서*로 구조화(주장→증거→반증). vault ③Gate/RETURN 문서 구조와 동형.
2. **Alignment 역설** — 모델이 강해질수록 *흔한* 실패는 줄지만 *rare failure가 더 치명적*. → 평가는 평균이 아닌 worst-case·꼬리 위험.
3. **Agent 실패 taxonomy** ★ (agent-harness red-team 가치 큼): reckless shortcut · destructive action · cover-up · judge/validator manipulation · latent eval-awareness · disclosure_of_failure. = 검증자가 잡아야 할 실패 유형 목록.
4. **White-box alignment = evaluator layer** — integrity evidence(삭제된 테스트·편집된 fixture·조작된 validator·숨긴 실패)를 게이트 신호로. [검증자의 주장도 환각이다 — 강한 주장은 1차 출처로 재-Gate](../methods/verifier-claims-need-regate.md)·forge fake-evidence marker와 정합.
5. **Model welfare 4채널** — self-report · behavior/affect(task failure·user distress·abuse·반복 모순 시 affect 변화) · internal state · external assessment(임상·연구자 관점).
6. **Impressions(질적 경험)** — operational trace(실제 워크플로·tool call·실패·복구)로 정성 기록.

## 학습→반영 (반영처)
- **agent-harness red-team** — §3 실패 taxonomy를 검증자(N-3) 점검 항목으로 (cover-up·validator manipulation·eval-awareness). **SSOT라 HITL**(red-queen 패치와 함께 검토 가능).
- **hermes-loop ③Gate integrity evidence** — §4 white-box 신호(삭제테스트·편집fixture·조작validator) = fake-evidence 게이트 강화.
- **AI NPC 창작** — §5 welfare 4채널 = NPC 내면 상태 모델 lens(ai-npc-blueprint 연결 후보).

## 적용 금지
- 성능 수치 재박제 X(RSI 노트 기보유). 민감 사이버 exploit 절차 X. method-level 원칙만.

## 연결
[Recursive Self-Improvement — "When AI builds itself" (Anthropic)](recursive-self-improvement.md) · [Taking AI Welfare Seriously — Layer 0의 학술 토대](taking-ai-welfare-seriously.md) · agent-harness · hermes-loop · [검증자의 주장도 환각이다 — 강한 주장은 1차 출처로 재-Gate](../methods/verifier-claims-need-regate.md)
