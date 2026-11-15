---
created: 2026-06-14
type: learning
tags: [getdesign, design-system, ai-native-design, context-injection, style-replication]
category: technique
---

# getdesign.md AI 디자인 시스템 분석 보고서

> ✅ **확정(confirmed) 2026-06-14** — 세션 내 ③Gate 통과 + 작가 수용. (외부 미검증 세부는 본문 표기 유지.)

## 1. getdesign.md 아키텍처 및 DESIGN.md 스키마 명세

### 1.1 개요

`getdesign.md`는 Apple, Vercel, Stripe, Claude, Figma, Linear, Nike 등 공개 웹사이트의 시각 언어를 `DESIGN.md`라는 마크다운 디자인 계약으로 정리한 컬렉션입니다.

핵심 모델은 다음과 같습니다.

```text
공개 브랜드 웹사이트
→ 시각 패턴 분석
→ DESIGN.md 추출
→ 프로젝트 루트에 설치
→ AI coding agent가 읽음
→ HTML/CSS/React 컴포넌트 생성
```

이는 Figma 파일, 이미지 보드, JSON 토큰 파일이 아니라 LLM이 직접 읽기 좋은 자연어와 토큰 혼합 문서로 디자인 시스템을 전달한다는 점이 핵심입니다.

### 1.2 DESIGN.md 표준 구조

공개 저장소 기준 `DESIGN.md`는 다음 섹션을 가집니다.

```text
1. Visual Theme & Atmosphere
2. Color Palette & Roles
3. Typography Rules
4. Component Stylings
5. Layout Principles
6. Depth & Elevation
7. Do's and Don'ts
8. Responsive Behavior
9. Agent Prompt Guide
```

실제 파일은 대체로 다음 구조를 따릅니다.

```markdown
---
version: alpha
name: <brand>-design-analysis
description: <one-line style summary>
colors:
  primary: "#..."
  canvas: "#..."
  ink: "#..."
typography:
  hero-display:
    fontFamily: ...
    fontSize: ...
    fontWeight: ...
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.pill}"
---

## Overview
## Colors
## Typography
## Layout
## Elevation & Depth
## Shapes
## Components
## Responsive Behavior
## Do's and Don'ts
## Agent Prompt Guide
```

즉, `DESIGN.md`는 다음의 두 층으로 구성됩니다.
*   기계가 해석하기 쉬운 토큰 레이어(Frontmatter-like token layer).
*   디자이너의 의도와 제약 조건을 담은 설명 레이어(Explanatory design rationale layer).

토큰 레이어는 기계가 바로 CSS 변수로 바꾸기 쉽습니다. 설명 레이어는 에이전트가 "왜 이렇게 그려야 하는지"를 이해하게 돕습니다.

### 1.3 AI 라우팅 적합성

`DESIGN.md`가 AI-native인 이유는 다음과 같습니다.

| 속성 | Figma/이미지 기반 | DESIGN.md 기반 |
|---|---|---|
| 입력 형식 | 시각/좌표 중심 | 텍스트/토큰 중심 |
| LLM 적합성 | 낮음, 별도 해석 필요 | 높음 |
| 코드 변환 | 추론 비용 큼 | CSS/컴포넌트로 직접 변환 가능 |
| 스타일 일관성 | 이미지 참조 의존 | 명시적 규칙 의존 |
| 자동화 | 플러그인/Export 필요 | curl/npx/copy 가능 |

핵심은 디자인을 그림이 아니라 계약(Contract)으로 전달한다는 점입니다.

### 1.4 브랜드 예시

#### Apple

Apple `DESIGN.md`는 다음 특징을 강조합니다.
*   프리미엄 여백(Premium white space).
*   SF Pro 계열 타이포그래피.
*   시네마틱 제품 이미지(Cinematic product imagery).
*   단일 Action Blue 계열 CTA.
*   장식적 그라디언트 배제.
*   제품 사진 중심의 full-bleed tile.

에이전트가 Apple 스타일을 구현할 때 중요한 규칙은 다음과 같습니다.
*   UI chrome은 숨기고 제품 이미지를 중심에 둡니다.
*   CTA는 파란 pill 버튼으로 제한합니다.
*   그림자(Shadow)는 카드가 아니라 제품 이미지에만 사용합니다.

#### Vercel

Vercel은 다음 특징으로 요약됩니다.
*   흑백의 정밀함(Black and white precision).
*   Geist 폰트 활용.
*   개발자 플랫폼 톤앤매너.
*   단색 레이아웃(Monochrome layout).
*   억제된 대비(Restrained contrast).

에이전트 구현 방향은 다음과 같습니다.
*   불필요한 장식 요소를 제거합니다.
*   여백과 선형 그리드로 정보 구조를 시각화합니다.
*   검정/흰색 대비와 Geist 계열 폰트를 사용합니다.

#### Stripe

Stripe는 다음 특징을 가집니다.
*   보라색 그라디언트(Purple gradients).
*   무게감 300의 우아함(Weight-300 elegance).
*   프리미엄 핀테크 UI.
*   부드러운 기술 마케팅 레이아웃(Soft technical marketing layout).

에이전트 구현 방향은 다음과 같습니다.
*   그라디언트를 핵심 배경이나 hero 영역의 장치로 사용합니다.
*   금융 서비스의 신뢰감을 위해 과도한 장식보다 정제된 계층 구조를 유지합니다.

---

## 2. AI 에이전트 실시간 스타일 복사 및 자동화 프로세스

### 2.1 기본 자동화 시나리오

가장 단순한 사용 흐름은 다음과 같습니다.

```bash
npx getdesign@latest add stripe
```

그 후 프로젝트 루트에 `DESIGN.md`를 배치하고, AI 에이전트에게 다음과 같이 지시합니다.

```text
Read DESIGN.md before modifying UI.
Use its colors, typography, spacing, component rules, and do/don't constraints.
Do not invent a new visual system unless explicitly requested.
```

### 2.2 curl 기반 수집 시나리오

raw GitHub 경로가 확인되는 경우 다음처럼 가져올 수 있습니다.

```bash
mkdir -p .design-sources/getdesign

curl -L \
  https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/stripe/DESIGN.md \
  -o .design-sources/getdesign/stripe.DESIGN.md

cp .design-sources/getdesign/stripe.DESIGN.md DESIGN.md
```

브랜드만 바꿔 반복 가능합니다.

```bash
BRAND=vercel

curl -L \
  "https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/${BRAND}/DESIGN.md" \
  -o "DESIGN.md"
```

### 2.3 browser-use / Chrome DevTools 기반 시나리오

동적 페이지에서 raw 경로를 모를 경우 다음과 같이 동작합니다.
1.  `getdesign.md`에 접속합니다.
2.  브랜드명을 검색합니다.
3.  `/<brand>/design-md` 페이지에 진입합니다.
4.  Usage 섹션을 확인합니다.
5.  Download `DESIGN.md` 버튼을 탐색합니다.
6.  다운로드 URL 또는 raw GitHub URL을 추출합니다.
7.  `DESIGN.md`로 저장합니다.
8.  `preview.html` / `preview-dark.html`이 있으면 같이 저장합니다.

에이전트 프롬프트 예시는 다음과 같습니다.

```text
Use browser automation only to locate the brand DESIGN.md and preview files.
Do not scrape arbitrary copyrighted media assets.
Extract only design tokens, layout rules, component descriptions, and public CSS-like values.
Save the result to DESIGN.md.
Then generate _tokens.css and _slots.css from the token layer.
```

### 2.4 로컬 적용 파이프라인

```text
DESIGN.md
→ parse tokens
→ _tokens.css
→ _slots.css
→ component templates
→ preview render
→ visual QA
→ final HTML/CSS
```

권장 파일 구조는 다음과 같습니다.

```text
project/
├── DESIGN.md
├── styles/
│   ├── _tokens.css
│   ├── _slots.css
│   └── theme.css
├── components/
│   ├── Button.html
│   ├── Card.html
│   └── Hero.html
└── preview/
    └── design-preview.html
```

### 2.5 DESIGN.md → CSS 변수 변환 규칙

입력값 예시:

```yaml
colors:
  primary: "#0066cc"
  canvas: "#ffffff"
  ink: "#1d1d1f"

spacing:
  xs: 8px
  md: 17px
  section: 80px
```

출력값 예시:

```css
:root {
  --color-primary: #0066cc;
  --color-canvas: #ffffff;
  --color-ink: #1d1d1f;

  --space-xs: 8px;
  --space-md: 17px;
  --space-section: 80px;
}
```

컴포넌트 토큰 예시:

```yaml
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.pill}"
    padding: 11px 22px
```

출력값 예시:

```css
.btn-primary {
  background: var(--color-primary);
  color: var(--color-on-primary);
  border-radius: var(--radius-pill);
  padding: 11px 22px;
}
```

### 2.6 에이전트 프롬프트 가이드

```text
Before UI generation:
1. Read DESIGN.md.
2. Extract the brand's visual thesis in one sentence.
3. Extract colors, type scale, radius, spacing, elevation, component rules.
4. Generate _tokens.css first.
5. Generate _slots.css second.
6. Implement components only using declared tokens.
7. Run a visual consistency pass:
   - Are there undeclared colors?
   - Are there undeclared shadows?
   - Are fonts consistent?
   - Are radii consistent?
   - Does layout match the brand's density?
8. If drift is detected, revise CSS before adding more components.
```

### 2.7 Drift 방지 검사 항목

*   **Color**: 모든 색상은 `DESIGN.md` colors에 존재하는지 확인하고, 임의 hex 값이 새로 생성되지 않았는지 검증합니다.
*   **Typography**: hero, body, caption 계층이 `DESIGN.md`와 일치하는지 확인하고, font-weight가 과장되지 않았는지 검증합니다.
*   **Layout**: spacing scale을 벗어나지 않았는지 확인하고, grid/section rhythm이 설명과 일치하는지 검증합니다.
*   **Components**: button, card, input 상태가 `DESIGN.md`와 일치하는지 확인하고, hover, focus, active 상태가 누락되지 않았는지 검증합니다.
*   **Anti-pattern**: `DESIGN.md`의 don't 규칙을 위반하지 않았는지 최종 검증합니다.

---

## 3. 심층 탐구 (Deep Inquiry)

### 멘탈 모델

`getdesign.md`의 멘탈 모델은 디자인 시스템을 시각적 산출물이 아니라 LLM이 이해하기 쉬운 텍스트 기반 계약 문서로 정립하는 데 있습니다.

기존의 디자인 전달 방식은 다음과 같습니다.
```text
디자이너 → Figma → 개발자 → CSS 구현
```

반면 `getdesign.md`가 제시하는 방식은 다음과 같습니다.
```text
브랜드 웹사이트 → DESIGN.md → AI coding agent → UI 코드
```

이 모델에서 `DESIGN.md`는 단순 스타일 가이드를 넘어섭니다. 시각적 정체성, 디자인 토큰, 컴포넌트 문법, 레이아웃 철학, 금지 규칙, 에이전트용 프롬프트를 포함합니다. 즉, `DESIGN.md`는 LLM의 시각적 상상력을 올바른 방향으로 제약하는 "로컬 헌법" 역할을 수행합니다.

### 논리적 맹점

1.  **텍스트-렌더링 간극**: 마크다운은 디자인의 감성이나 분위기를 텍스트로 잘 전달하지만, 픽셀 단위의 정밀한 렌더링을 보장하지 않습니다. 에이전트가 "premium whitespace" 등의 표현을 임의로 다르게 해석할 경우 UI의 일관성이 흔들릴 수 있습니다.
2.  **컴포넌트 상태 누락**: `DESIGN.md` 내에 hover, focus, active, disabled 상태에 대한 명확한 기술이 부족할 경우 에이전트가 스타일을 임의 보간(interpolation)하는 문제가 발생합니다.
3.  **브랜드 모방의 법적/윤리적 경계**: 공개된 CSS 속성과 패턴을 참고하는 것을 넘어 특정 브랜드와 혼동 가능한 수준으로 복제할 경우 저작권 이슈가 발생할 수 있습니다. 에이전트는 항상 "Stripe-inspired"와 같이 변환하여 표현해야 합니다.
4.  **이미지 자산의 부재**: Apple 스타일의 핵심은 고품질 제품 사진입니다. 토큰 시스템이 완벽하더라도 실제 이미지 자산이 뒷받침되지 않으면 시각적 완성도가 급격히 하락합니다.
5.  **Layout Drift**: 토큰은 일치하지만 레이아웃 밀도가 깨지는 현상입니다. Vercel 토큰을 썼음에도 둥근 장식적 카드를 배치하거나, Stripe 색상을 썼음에도 단순 SaaS 템플릿 레이아웃이 적용되는 등의 괴리가 발생할 수 있습니다.

### 기회비용 및 임계점

#### 실시간 탐색 방식 (Real-time Fetch)
*   **장점**: 최신 `getdesign.md` 저장소 현황을 즉각 반영하고, 브랜드 선택의 유연성이 높으며, 사용자 요청에 따라 실시간으로 신규 브랜드를 처리할 수 있습니다.
*   **단점/비용**: 네트워크 레이턴시가 발생하고, 원격 페이지의 DOM 구조 변화에 취약하며, LLM의 컨텍스트 윈도우를 소모하고 외부 의존성이 높아집니다.

#### 로컬 프리셋 방식 (Local Preset)
*   **장점**: 속도가 빠르고 네트워크 단절 상태에서도 안정적이며, CI 환경에서 동일하게 재현 가능하고 drift 검사가 용이합니다.
*   **단점/비용**: 원격 저장소의 업데이트 사항을 자동으로 추적하기 어렵고, 프리셋 폴더의 유지보수 비용이 증가합니다.

#### 권장 임계점 기준

| 상황 | 권장 전략 |
|---|---|
| 단발성 시안 생성 | 실시간 `getdesign.md` fetch 허용 |
| 반복 사용 브랜드 (3회 이상) | 로컬 프리셋(Local Preset)으로 승격 |
| 대외 공개 HTML/이력서 | 검증이 완료된 오디티드 프리셋(Audited Preset)만 사용 |
| 금융/보안/결제 성격 화면 | 실시간 fetch 금지, 정적 프리셋 고정 |

---

## 4. Sub-brain 이식 및 html-publish 결합안

### 4.1 전제

외부의 `DESIGN.md`를 CLAUDE.md나 ParkDalDesign.md에 바로 직접 병합해서는 안 됩니다. 외부 디자인 토큰은 항상 "시각 계약 후보" 형태로 staging 디렉토리에 격리되어야 합니다.

권장 파일 구조는 다음과 같습니다.
```text
wiki/inbox/design-sources/getdesign/
├── stripe.DESIGN.md
├── vercel.DESIGN.md
├── apple.DESIGN.md
└── _source-index.md

wiki/스테이징 영역
├── ParkDalDesign.getdesign-stripe.patch.md
├── ParkDalDesign.getdesign-vercel.patch.md
└── html-publish-theme-map.patch.md
```

### 4.2 Sub-brain 시각 계약 모델

ParkDalDesign.md를 상위 시각 헌법으로 고정하고, `getdesign.md`에서 수집한 토큰은 하위 테마 어댑터(Theme Adapter)로 매핑합니다.
```text
ParkDalDesign.md (시각 헌법)
→ local brand principles
→ getdesign adapter (테마 매핑)
→ _tokens.css (원자 토큰)
→ _slots.css (의미 슬롯)
→ html-publish template
```

외부의 물리적 브랜드를 그대로 복사하는 대신, ParkDalDesign.md의 의미적 규격에 맞게 변환합니다.
*   Stripe primary gradient → ParkDal accent-gradient 로 매핑.
*   Vercel monochrome precision → ParkDal 문서 및 기술 페이지 테마로 매핑.
*   Apple whitespace → ParkDal 포트폴리오 hero 모드로 매핑.

### 4.3 디자인 토큰 매핑 인터페이스

입력 메타데이터 예시:
```yaml
source:
  name: stripe
  file: DESIGN.md
  origin: getdesign.md
  fetched_at: 2026-06-14
```

중간 표현(Intermediate Representation) 예시:
```yaml
theme:
  id: stripe-inspired
  mood:
    density: low
    surface: gradient-light
    typography: elegant-technical
  colors:
    accent: "{source.colors.primary}"
    canvas: "{source.colors.canvas}"
    ink: "{source.colors.ink}"
  components:
    cta: "{source.components.button-primary}"
    card: "{source.components.card}"
```

출력 CSS 변수 예시:
```css
:root[data-theme="stripe-inspired"] {
  --pd-color-accent: #635bff;
  --pd-color-canvas: #ffffff;
  --pd-color-ink: #0a2540;
}
```

### 4.4 _tokens.css 설계

`_tokens.css` 파일은 원자(Atomic) 단위의 디자인 토큰만을 정의합니다.
```css
:root {
  --color-primary: #0066cc;
  --color-canvas: #ffffff;
  --color-ink: #1d1d1f;

  --font-display: "SF Pro Display", system-ui, sans-serif;
  --font-body: "SF Pro Text", system-ui, sans-serif;

  --radius-sm: 8px;
  --radius-lg: 18px;
  --radius-pill: 9999px;

  --space-xs: 8px;
  --space-md: 17px;
  --space-section: 80px;
}
```

### 4.5 _slots.css 설계

`_slots.css` 파일은 html-publish/GUIDE.md 템플릿의 의미적 슬롯을 실제 정의된 토큰과 바인딩합니다.
```css
.hero {
  background: var(--slot-hero-bg);
  color: var(--slot-hero-fg);
  font-family: var(--slot-hero-font);
}

.cta-primary {
  background: var(--slot-cta-bg);
  color: var(--slot-cta-fg);
  border-radius: var(--slot-cta-radius);
}

.card {
  background: var(--slot-card-bg);
  color: var(--slot-card-fg);
  border-radius: var(--slot-card-radius);
}
```

테마 적용 시 매핑 예시:
```css
:root[data-theme="apple-inspired"] {
  --slot-hero-bg: var(--color-canvas);
  --slot-hero-fg: var(--color-ink);
  --slot-hero-font: var(--font-display);
  --slot-cta-bg: var(--color-primary);
  --slot-cta-fg: var(--color-on-primary);
  --slot-cta-radius: var(--radius-pill);
}
```

### 4.6 html-publish 빌더 통합 파이프라인

html-publish/GUIDE.md 빌드 도구와 다음과 같이 유기적으로 통합합니다.
1.  사용할 테마(Theme)를 설정 파일에서 선택합니다.
2.  `DESIGN.md` 파일의 존재 여부와 무결성을 검사합니다.
3.  `DESIGN.md`로부터 `tokens.json`을 파싱하여 추출합니다.
4.  `tokens.json`을 기반으로 `_tokens.css` 파일을 빌드합니다.
5.  `slot-map.yaml`을 기준으로 테마별 `_slots.css` 파일을 연결하여 빌드합니다.
6.  대상 마크다운 문서를 HTML 템플릿에 맞추어 렌더링합니다.
7.  Visual QA Checklist 린터를 가동하여 hardcoded color나 drift 여부를 감시합니다.
8.  최종 아티팩트를 배포 및 발행합니다.

### 4.7 4-Gate 검증 시스템

외부의 디자인 스펙을 가져와 Sub-brain에 적용하기 전, 다음의 4가지 게이트를 통과해야 합니다.
1.  **Source Gate**: 소스 URL, fetched_at 시점 기록, 라이선스 상태, 상표 및 전유 로고의 미포함 여부를 검증합니다.
2.  **Token Gate**: 모든 색상 코드의 hex 유효성, WCAG 최소 대비비 기준 만족 여부, 폰트 폴백 제공 여부, 단위(unit)의 일관성을 검증합니다.
3.  **Brand Gate**: 특정 브랜드를 무단 복제하여 오인하게 만들 요소가 없는지 감시하고, 항상 독창적인 "inspired" 형태로 추상화되었는지 검증합니다.
4.  **Render Gate**: 데스크톱과 모바일 환경의 미리보기 렌더링을 확인하여 레이아웃 깨짐, overflow 발생 여부, 다크 모드 지원 품질을 검증합니다.

---

## 연결된 페이지
- [Editorial Grid Design Canon — Vignelli + Müller-Brockmann (전문)](editorial-grid-design-canon.md) · [HTML PPT Studio (html-ppt) — 현행 teardown](html-ppt-studio-teardown.md) · [NYT-discipline Data Visualization](nyt-data-viz.md) — Editorial Design Discipline 스택 자매(에디토리얼 그리드·발표 덱·데이터 비주얼)
- design-index — 디자인 시스템 허브
