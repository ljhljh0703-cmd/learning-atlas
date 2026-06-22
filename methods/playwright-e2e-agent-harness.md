---
created: 2026-06-17
updated: 2026-06-17
type: learning
tags: [AI, agent-harness, e2e-testing, playwright, self-healing, done-gate, ground-truth]
source: https://www.youtube.com/watch?v=wo0Rsh9hlTo
authors: [Naver]
year: 2026
category: method
---

# Playwright E2E 에이전트 하네스 — 테스트=실행가능 명세, trace=user-facing 증빙 매체 (Naver 발표)

*Naver 발표 · NotebookLM 외주 ④Gate grounding PASS(확실/불확실/소스 미언급 분리 일관) · vault 와 거의 전면 확증, 신규 vein=trace 관찰 매체 1축*

AI 가 코드를 빨리 쓰니 PR 이 폭증(227→3408건/9개월)했지만 사람이 일일이 받아 돌려보는 *검증이 병목*이 됐다. Naver 팀은 결정론적 **Playwright E2E 를 "센서"** 로 두고, **Planner/Generator/Healer 3-에이전트 자가치유 루프**로 이 병목을 풀었다. 학습 가치의 본체는 — vault 가 직접 도달한 done-gate·user-facing 증빙·하네스 명제를 *프로덕션 사례로 확증*하면서, vault 가 약했던 **"OBSERVE(관찰) 매체"를 구조화 trace 로 구체화**해준 것.

---

## 한 줄 요약

> "테스트 코드 = 에이전트를 위한 실행 가능한 명세서이자 결정론적 센서" — Playwright E2E 를 Planner/Generator/Healer 루프에 엮어 검증 병목을 자동화. 우리 agent-harness H-14·done-gate 의 *web 프로덕션 확증*.

---

## 확증 매핑 — 발표 개념 → vault 기존 자산 (재서술 X, 링크만 — #3)

1. **테스트=실행가능 명세**("한 벌이 가이드+센서 동시") → [Forge Spec-Gate (why-was-fable-banned) — 차용 해체](forge-spec-gate.md)(spec=test) + dispatch-builder 슬롯3 done-gate. 확증.
2. **테스트=센서, 만드는쪽(LLM)/평가쪽 분리** → agent-harness N-3(검증자 서브에이전트) + ③Gate 철학. 확증.
3. **결정론 > LLM 평가**("실행이 저렴", Evaluator 패턴보다) → done-gate "성공=`<shell>` exit 0" 머신체크. 확증.
4. **검증 병목**(코딩↑ 검증이 막힘) → vault 하네스 전체의 존재 이유. 확증.
5. **plan → 사람 검토 → code**(Planner 계획서 HITL) → 헌법 HITL + Plan mode + dispatch-builder 역면접. 확증.
6. **하네스 엔지니어링 = 인간 새 역량** → 북극성 명제(Agent=Model+Harness, [The New SDLC With Vibe Coding (Google / Addy Osmani)](google-new-sdlc-vibe-coding.md)) 자체. 확증.
7. **에이전트 MD·단일출처 문서·도메인 주입** → vault AGENTS.md 컨벤션 + 외부 코딩 에이전트 Lookup Protocol. 확증.
8. **자가 개선 루프**(계획→작성→오류수정 반복) → RSI ②Apply(agent-harness-rsi-brief). 확증.

---

## 진짜 새것 (vault delta)

1. **★Trace = 구조화 OBSERVE 매체** — Playwright trace(error context·DOM snapshot·network log·screenshot)를 에이전트가 `playwright trace` 스킬로 CLI 탐색해 원인분석→수정. vault 의 agent-harness H-14 RUN→OBSERVE→FIX→RERUN 에서 *OBSERVE 매체가 스크린샷 단독보다 구체화* = FIX 가 결정론 신호 기반. **→ H-14 보강처(2026-06-17 반영).**
2. **Planner/Generator/Healer 3-에이전트 분업**(MS Playwright agents) — 특히 Healer: CI 실패 시 trace ZIP 로컬 다운로드→분석→통과까지 재수정. "만드는쪽/평가쪽 분리"의 E2E 구현체.
3. **flaky 제거 3종** — ① 조건기반 대기(하드 `timeout` 금지) ② API 로 상태 선세팅해 각 갈래 시작점 격리(외부 API 는 page route 모킹) ③ **번인**(merge 전 같은 테스트 반복실행으로 flaky 선검출). vault 결정론 원칙의 E2E 실전 기법. **→ done-gate 차용(반영).**
4. **시멘틱 셀렉터**(CSS 대신 Role/Name) — 디자인 변경 내성. 소형.
5. **Critical User Flow 선별** — "전 분기 테스트는 비현실적"(빠른 환경에선 테스트가 깨지는 역효과) → 매출/UX-critical 플로우만 선택 자동화. vault reachability 게이트(FG-8/FG-10 "model proof 만으론 화면 발현 0") 와 동형 — *도달성-critical 만 증빙*.

---

## 한계·미검증 (격상 금지)

- **PR 지표 산술 모순**: "227→3408건 = 약 1.5배"는 오류(227→3408 ≈ **15배**). 발표자 구두 인용이라 **배수 표현 폐기, 원시 수치만 박제**(227→3408/9개월).
- **운영 지표(사실)**: 5개월간 37 라우트 자동화, 안정 브랜치 최근 CI 29회 연속 green·flaky 0.
- 사용 LLM 모델 구체명 = 소스 미언급(Claude 제작자 Boris Cherny 발언 인용은 함). 포기 조건(재시도 횟수 상한) = 소스 미언급. "비즈니스 가치 집중"의 정량 측정 = 소스 미언급(Critical User Flow 선별 예시만).

---

## 반영 (학습→반영 루프)

- ✅ **agent-harness H-14 보강** (2026-06-17) — web modality 의 OBSERVE 를 *구조화 trace CLI 탐색*으로 정밀화 + self-healing 루프 성립 조건 명시.
- ✅ **dispatch-builder 슬롯3 done-gate** (2026-06-17) — "브라우저 E2E modality(성공=`playwright test` exit 0) + flaky 가드 3종" 차용 라인.
- 🔗 **reachability 교훈 연결**: Critical User Flow 선별 = vault "도달성-critical 만 증빙"(FG-8/FG-10) 의 web 버전. 신규 룰 X — 개념 정합만.
- ❌ **확증분**(테스트=명세·센서·결정론·검증병목·HITL·하네스명제)은 이미 vault 보유 → 흡수만, 재서술 X.

---

## 연결된 페이지

- agent-harness (H-14 user-facing 증빙 — 본 페이지가 trace OBSERVE 매체 보강) · dispatch-builder (done-gate E2E modality) · [Forge Spec-Gate (why-was-fable-banned) — 차용 해체](forge-spec-gate.md) (spec=test)
- [browser-harness — LLM 에 Chrome CDP 직결, 에이전트가 스스로 자라는 thin harness](browser-harness.md) (browser-use CDP 자가치유 thin harness — *인접 다른 도구*, "에이전트가 도구 쓰며 도구 키움" 동형) · [The New SDLC With Vibe Coding (Google / Addy Osmani)](google-new-sdlc-vibe-coding.md) · [Factory AI — Droid 중심 "AI-native 개발 플랫폼" (vault 아키텍처의 업계 수렴 ground-truth #4)](factory-ai.md) (Agent=Model+Harness ground-truth 군)
- agent-harness-rsi-brief (자가개선 루프 = ②Apply)
