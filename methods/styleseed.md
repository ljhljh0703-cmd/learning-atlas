---
created: 2026-07-19
updated: 2026-07-19
type: learning
tags: [design, ai-design-engine, frontend, design-system, reference-compiler, methodology]
source: https://github.com/bitjaru/styleseed
category: method
---
<!-- StyleSeed(bitjaru) 해체 흡수 — 외부 AI 디자인-메서드 엔진. 델타=아키텍처(문법/어댑터/컴파일러/2중게이트), 74개 디자인규칙은 saturation 이라 요약만. -->

# StyleSeed — "AI가 강한 UI/UX 디자이너처럼 판단하게" 만드는 디자인-메서드 엔진

*bitjaru · MIT · v3.0.0 · Claude Code/Codex 플러그인*

코딩 에이전트가 *하나의 정해진 룩*이 아니라 *정해진 판단 프로세스*를 갖게 하는 엔진. "coherent ≠ distinctive" — 일관성만으론 여전히 "AI가 만든 티"가 나므로, 제품의 *기능적 job*에 맞는 문법을 골라 적용하고 코드·픽셀 2중 게이트로 드리프트를 잡는다.

---

## 한 줄 요약

> 디자인을 **고정된 룩이 아니라 고정된 판단 절차**로 본다 — `핵심 불변식 × 산출물 job별 문법 × 표면 어댑터 × 도메인 × 페이지타입 × 취향 프로파일 × 프로젝트 락`으로 매 화면을 합성하고, 코드게이트(`ss-score`)+픽셀게이트(`ss-verify`)로 검증.

---

## 핵심 아키텍처 (= 진짜 델타)

> ⚠️ 흡수 규율 — DESIGN-LANGUAGE.md 74개 시각 규칙(색/간격/타입/섀도우)은 **작가 기존 자산과 delta ≈ 0**(HIG/Material/Refactoring UI 재포장, feedback_design_norm_material_saturated 판정 그대로). 아래는 그 규칙집이 아니라 *규칙을 조직하는 방식*만 추출한다.

### 1. 3층 분리 — 고정 판단 / job별 문법 / 프로젝트 선택
"일관성이 하나의 보편 미학으로 붕괴"하지 않게 3층을 분리. 소비자-금융 홈·운영 콘솔·에디토리얼·커머스 상세는 *다른 job*이라 *다른 문법*이 필요하다는 게 헌법(`PRODUCT-PRINCIPLES.md`).

**Authority order** (충돌 시): ①핵심 불변식 → ②output grammar → ③surface adapter → ④도메인/페이지 → ⑤취향 프로파일 → ⑥design lock → ⑦skins/components → ⑧score/verify. *락은 persistence이지 permission이 아니다* — 임의값은 위반을 정당화 못 하고 가장 가까운 유지문법으로 fallback.

### 2. Output Grammar — *브랜드가 아니라 job으로* 선택 (8종)
`consumer-service / operations-console / technical-instrument / editorial-reading / commerce-conversion / institutional-service / expressive-marketing / sequential-story`. "Toss는 한 문법의 증거일 뿐 StyleSeed의 기본 룩이 아니다" — 각 문법은 12축 계약(user job·attention·composition·density·type·color·surface·imagery·nav/action·states/motion·responsive·characteristic tells)을 채운다.

### 3. Reference-to-Ruleset Compiler ⭐ (가장 이식가치 높은 델타)
스크린샷·URL·Figma·무드보드 → **프로젝트 로컬 문법**으로 컴파일. 목적은 *클로닝이 아니라 반복가능한 디자인 결정의 복원*. 9단계 파이프라인(Ingest→Observe→Measure→Classify→Cluster→Resolve→Abstract→Compile→Validate). 각 축마다 `결정·증거ID·confidence(high/med/low)·허용범위·반례` 기록. **Validate = 레퍼런스에 없던 화면을 1개 만들어 검증** — 원본 화면만 재현하면 추상화 실패로 간주. 단일 레퍼런스는 전 축 low confidence 태깅. 로고·독점 일러스트·트레이드마크 배열 복사 금지, 접근성은 레퍼런스 결함을 오버라이드.

### 4. Surface Adapters (5종) — *메서드는 렌더러 독립*
`product-ui / social-carousel / slide-deck / document-report / single-frame`. "StyleSeed는 판단·문법·시각언어를 결정, 어댑터는 캔버스·세이프존·렌더러·에셋규칙·export·표면QA를 결정." 예: `sequential-story` 문법 + `carousel-build` 스킬이 인스타 1080×1440·크롭·PIL 렌더를 소유. 급변하는 플랫폼 치수를 시각 문법에 박지 않는다.

### 5. 2중 게이트 — 소스 정확성 ≠ 렌더 품질
- `ss-score`: 구현 증거 읽기(토큰·계층·상태·시맨틱·coherence·문법 tells)
- `ss-verify`: **렌더 후 픽셀 검사**(실제 초점 지배·타입 로딩·균형·광학 리듬·반응형·상태 렌더)
- 둘 다 빌드 루프로 복귀. *게이트는 디자인 엔진이 아니다* — 합성된 메서드가 제품, 게이트는 드리프트 탐지 보조.

### 6. Design Lock = `STYLESEED.md`
"디자인 결정이 채팅 메모리에만 살아서 드리프트한다"는 #1 실패를 프로젝트 락 파일로 봉쇄. **매 프롬프트 재독** 의무. bounded 선택만 저장(도메인·어댑터·문법·스킨·primary action·폰트·radius·motion seed·type scale·signature move). 팔레트 모드 발명·접근성 waive·혼합시스템 합법화 불가.

### 7. 부수 어휘집
- **Motion**: 5 seed(Spring/Silk/Snap/Float/Pulse) × 5 컨텍스트 = 25 recipe. "make it bouncy"→Spring 자연어 매핑. 스킨별 default seed. → design-taste 8축 중 motion 축과 직접 대응.
- **Aesthetic Profiles** 6종(swiss/editorial/technical/warm-dtc/minimal-mono/brutalist-lite): grammar와 별개인 *조율된 미학 좌표*(mood 단어 아님).
- **20 스킬**(`ss-setup/reference/build/score/verify/review/lint/tokens/motion/restyle/copy/a11y/...`) + 32 shadcn 프리미티브 + 16 패턴 + 8 스킨.

---

## 내 생각 — 냉정 평가 (긍정 프레이밍 배제)

### 직접 적용성: **중간~높음 (단, 코드 자산은 낮음 / 방법론은 높음)**

- **높음 — 방법론 델타**: reference-compiler·grammar-by-job·2중게이트·authority-order는 작가 디자인 시스템에 이식 가능한 *구조*다. 특히 컴파일러는 작가의 레퍼런스처럼 구현 계약의 *증거→룰(클론 아님)* 정식 프로토콜이 될 수 있다.
- **낮음 — 코드 자산**: components/(shadcn+React+Tailwind v4)·scaffold(Vite+React)는 작가 bespoke-html(바닐라 HTML→Adobe Express export/정적)과 스택 불일치 → **이식 불가, 개념만**.

### 한계·비판 (흡수 규율 ①)
1. **DESIGN-LANGUAGE 2858줄/74규칙 = 대부분 재포장**. Refactoring UI·Material 3·HIG·WCAG의 재서술 — 작가 8축+ui-ux-pro-max 팔레트와 **delta 0**. 이 파일을 흡수하면 학습 트레드밀. *아키텍처만* 취한다.
2. **8 grammar의 실증 미검증**. "independent evidence + counterexamples + regression" 요구는 *열망*이고, solo·v3.0.0·데모 주도라 8 문법이 실제로 distinct·transferable한지 경험적 입증 부재. promotion rule은 문서상 존재하나 통과 이력 불명.
3. **"AI가 만든 티" 프레이밍은 마케팅적**. 단 그 밑의 관찰(coherent≠distinctive, one-focal-point, generic-indigo 금지)은 타당. 규칙 15/14가 알맹이.
4. **개인화·학습 부재** — 정적 룰 엔진. 사용자 피드백을 축적해 취향으로 성장하는 루프가 없다.

### 기존 수용분과 delta (규율 ②)
작가는 이미 bespoke-html-direction(프로젝트별 팔레트)·design-taste(8축·팔레트추천·**개인화 원장**)·레퍼런스 계약 보유. StyleSeed와 목표("AI티 제거") 대량 중첩. **순 신규 = ①job별 문법 택소노미 ②reference-compiler 9단계+12축+confidence ③surface-adapter 통일 ④픽셀게이트 분리.**

### 시너지 가지뻗기 (규율 ③)
- **A. reference-compiler → reference-implementation**: "스크린샷처럼 구현" 트리거에 *12축 evidence+confidence 추출 + Validate(레퍼런스 밖 화면 1개 생성)* 프로토콜 이식. 클론 방지.
- **B. grammar-by-job → design-taste**: 팔레트 고르기 *전에* "이 산출물의 job은?"(consumer/ops/editorial/commerce/marketing/carousel) 1단계 추가 검토.
- **C. surface-adapter → 통일 검토**: SKILL·SKILL·bespoke-html을 "하나의 시각 판단 + 표면별 어댑터"로 볼지.
- **D. 픽셀게이트 → html-publish preflight**: 레거시 빌더 lint.py(코드)에 *렌더 후 픽셀 검사*(초점 지배·타입 로딩) 층 추가 검토.

### 선행 지향 — Sub brain 이 앞선 축 (규율 ④)
작가 design-taste의 **개인화 급식 루프**(피드백→원장→성장, [기억 성숙도 3층 (Memory Maturity 3-Layer)](memory-maturity-3layer.md) L1~L3)는 StyleSeed의 정적 엔진보다 *개인화 축에서 앞선다*. StyleSeed는 "모두에게 좋은 디자인", 작가 시스템은 "작가에게 맞춰 진화". 흡수 시 이 우위를 후퇴시키지 말 것 — StyleSeed 구조를 취하되 개인화 원장 위에 얹는다.

---

## 반영 판정 (학습→반영 루프)

**3-way = ②파킹+이름붙은 트리거** (즉시 diff 아님 — 위 A~D는 디자인 SSOT 구조 변경 = L-STAGE, 작가 결정 필요).

- 반영처: reference-implementation(A) · design-taste(B·D) · 어댑터 통일(C)
- 트리거: *작가가 다음 세션에서 A~D 중 승격 지시* 시 staged 패치화. 무지시 시 park.
- 순수참조분: DESIGN-LANGUAGE 74규칙 = 순수 지식(흡수만, 반영 X).

---

## 열린 질문

- reference-compiler 12축을 작가 레퍼런스 계약에 이식할 때, 작가 바닐라-HTML 스택에서 `.styleseed/rulesets/` 산출물(tokens.json·checks.md·reference-board.html)을 어떤 형태로 둘 것인가?
- job별 문법 8종이 작가 산출물(포폴·전자책·광고·게임 UI)에 실제로 매핑되는가, 아니면 웹앱 대시보드 편향인가? (grammar가 dashboard-heavy 의심)
- 픽셀게이트(`ss-verify`)의 "렌더 후 픽셀 검사"를 작가 환경에서 자동화할 실효 수단(Playwright 스크린샷+판정)이 있는가?

---

## 다음 학습 후보

- **Refactoring UI (Wathan/Schoger)** — StyleSeed color/spacing 규칙의 원천. 이미 흡수했으면 skip(트레드밀 가드).
- **Brad Frost — Atomic Design** — components/patterns 2층 구조의 근거. 작가 빌더 토큰/슬롯과 대조.
- **shadcn/ui 아키텍처** — "복사해 소유하는 컴포넌트" 모델. 작가 재사용 스킬 철학과 비교(단 React 스택).

---

## 연결된 페이지

- design-taste · bespoke-html-direction · reference-implementation
- [awesome-design-md — 브랜드별 DESIGN.md 69종 레퍼런스 컬렉션](awesome-design-md.md) (인접 디자인 방법론 노트)
- feedback_design_norm_material_saturated · feedback-no-learning-treadmill · feedback_absorption_discipline · feedback_cold_objective_evaluation
- [학습→반영 루프 (Absorb-to-Apply)](../narrative/학습→반영 루프.md) · [기억 성숙도 3층 (Memory Maturity 3-Layer)](memory-maturity-3layer.md)
