---
created: 2026-07-17
updated: 2026-07-17
type: learning
tags: [spec-driven, traceability, requirements-quality, convergence, gate, coverage]
source: https://github.com/github/spec-kit
authors: [github]
year: 2026
category: method
---
<!-- GitHub Spec Kit 해체 — CLI 설치 Park, spec↔plan↔task↔code 무결성 게이트 3개만 흡수. codex teardown ③Gate 2026-07-17. -->

# Spec-Artifact Integrity Gate (spec↔plan↔task↔code 무결성)

> **한줄**: [github/spec-kit](https://github.com/github/spec-kit)(commit `e742b8`, 404 tests PASS·wheel PASS) 해체 = **선별 흡수 8/10, CLI 전역 설치는 Park**. vault 이미 보유(constitution·역면접·Plan Approval·SCA·RETURN/Gate)는 재도입 X. 진짜 신규 델타 = 산출물 *간* 무결성을 검사하는 게이트 3종.

## ✅ 흡수한 게이트 3 (구현 테스트와 분리된 "요구사항/추적성" 검사)
1. **Requirements Quality Gate** (`checklist`) — 코드가 아니라 *요구사항 문장 자체*를 검사(모호·검증불가·누락 판정). 구현 테스트 이전 단계.
2. **Cross-artifact Traceability/Coverage Gate** (`analyze`) — FR/SC ↔ plan ↔ task 교차 대조: requirement coverage %, orphan task, zero-coverage requirement, constitution conflict.
3. **Convergence Pass** (`converge`) — 구현 후 code ↔ intent 대조해 `missing / partial / contradicts / unrequested` 만 append(남은 일만 수렴, 전면 재작성 X).
- + agent별 adapter + hash-tracked install/status/rollback = 향후 multi-AI harness serving 구현 참고(설계 레벨).

## 🅿️ Park (도입 안 함)
`specify` CLI 전역 설치 · vault와 별도 constitution 생성 · 모든 작업에 spec/plan/tasks 강제 · community extension/preset 자동 설치 · 최대 5문항 UX 그대로 채택.

## ⚠️ Cautions (source에서 증명됨 — 인용 시 유지)
- **Spec Kit 사용 ≠ production-grade 보장**: core `tasks` 규칙은 테스트를 *명시 요청/TDD 요청 시에만* 생성.
- **문서형 governance도 drift**: repo own constitution은 CI를 Python 3.11~3.13/ubuntu·windows라 쓰지만 실제 workflow는 3.13/3.14·ubuntu/windows/macOS. (헌법도 검증 없이는 어긋난다.)
- **`/analyze` coverage는 비결정론**: LLM semantic mapping이라 ground truth 아님 → 명시 **ID/schema lint**로 보강 필수.

## 🅿️ Skill 승격 = PARK (파일럿 게이트, 무입증 신설 금지)
Codex 제안 skill `spec-artifact-integrity-gate`(자연어 의도→≤3 역질문→FR/SC/user-story spec→plan/tasks traceability→requirements-quality checklist→read-only cross-artifact analysis→Plan Approval→구현→code-intent convergence). **독립 skill vs dispatch-builder/agent-harness 흡수 = 미결.** agent-skill-quality-gate 규율(무입증 신설 금지) 적용.
- **승격 트리거(3요건)**: 다음 *중형+* 기능 1건에서 ① 질문 수 ≤3 ② P1 zero-coverage requirement = 0 ③ orphan task = 0 ④ 구현 후 P1 missing/contradicts = 0 을 실측한 뒤 승격 검토. + LLM coverage mapping의 결정론적 검증 형식(ID/schema lint) 파일럿 전 확정.

## 관계
- 자매 게이트: [Forge Spec-Gate (why-was-fable-banned) — 차용 해체](forge-spec-gate.md)(spec·test·worktree-accept) · [Research Claim Gate — 주장을 증거 등급에 묶는 운영법](research-claim-gate.md)(증거 등급) · dispatch-builder(역면접·슬롯). 본 노드 = 산출물 *간* traceability graph 검사(현 vault에 단일 절차 부재).
