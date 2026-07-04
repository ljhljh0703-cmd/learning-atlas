---
created: 2026-06-30
updated: 2026-06-30
type: learning
category: technique
tags: [game-design, ai-gamedev, harness, product-studio, external-product, reference-study]
source: "Tesana 'Muranyi-3' 공식 런칭 블로그 (외부 제품) → Codex muranyi-3-teardown 패킷 ③Gate"
authors: [tesana, codex]
year: 2026
---
<!-- Tesana Muranyi-3(프롬프트→게임 AI 모델) 런칭 블로그 해체. ⚠️ 모델 비공개·차용 가치=제품/스튜디오 하네스 패턴(성능수치 아님). game-design M6 보강 후보. Codex teardown ③Gate. -->

# Muranyi-3 (Tesana) — 프롬프트→게임 product/studio 하네스 스터디

> **⚠️ ③Gate 정직성**: Tesana "Muranyi-3" = 외부 상용 제품(모델카드·벤치·아키텍처 **비공개**). 차용 가치 = *비공개 모델 성능 아님* → **프롬프트→playable game을 끌어올리는 product/studio 하네스 패턴**. 마케팅 수치("90% errors solved·70% quicker·5x")는 **검증 안 됨·박제 금지**. code editor 기능은 본문(live) vs HTML 주석(coming-soon) **모순 → 보수 판정**. 외부 제품 블로그라 패턴만 clean-room 차용(원문 박제 X).

## 차용 가능 하네스 패턴 5종 (Agent=Model+Harness 확증)

1. **Bug frequency ledger → Proactive gate** — 빈발 버그를 카탈로그화 → 생성 *전* 사전 게이트로 차단(사후 수정 아님).
2. **project_state 연속성** — `project_state.md` 식 세션 간 상태 이어받기(Dual-Track progress 등가).
3. **Visual·animation smoke gate** — 코드 통과뿐 아니라 *시각/애니메이션 발현* 확인(reachability의 게임 버전).
4. **Data-driven logic contract** — 게임 로직을 코드 아닌 데이터로(룰↔렌더 분리, [KFC 오통파이터 웹게임 기술 해체](campaign-advergame-teardown.md) delta 정합).
5. **Latency budget** — 생성·빌드 파이프라인 latency 예산.

## vault 정합 (중복·보강)

- **game-design M6**(Template/Debug 자가진화)와 **80% 중복** — bug ledger→proactive gate = M6 "Debug 누적→done-gate 승격"과 동형.
- **신규 delta**: visual/animation smoke gate · build latency budget · project_state 연속성(명시적 ledger 형태).
- **[OpenGame — 프롬프트 하나로 플레이 가능한 웹게임을 짓는 자가진화 에이전트 프레임워크](opengame.md)**(프롬프트→웹게임 자가진화)와 같은 문제공간의 *상용 제품 사례*.

## 반영 (학습→반영) — 작가 "보강해" 2026-06-30
- ✅ **game-studio-pipeline-brief §2 보강 완료**: 4 ledger(bug-frequency→proactive gate·visual/animation smoke·project_state 연속성·build latency budget) = ③Produce·④Verify 강화. 수치 미검증 가드 포함.
- dispatch-builder 게임 디스패치 done-gate에 visual/animation smoke 추가 검토(이미 Playwright reachability 보유 — 중복 점검 후, 미적용).

## 연결
game-domain-prep · game-design · [OpenGame — 프롬프트 하나로 플레이 가능한 웹게임을 짓는 자가진화 에이전트 프레임워크](opengame.md) · game-studio-pipeline-brief · [KFC 오통파이터 웹게임 기술 해체](campaign-advergame-teardown.md)
