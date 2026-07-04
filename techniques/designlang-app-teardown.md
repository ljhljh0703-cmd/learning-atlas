---
created: 2026-06-13
updated: 2026-06-13
type: learning
tags: [design-system, landing-page, teardown, bento-grid, dark-theme, typography]
category: technique
---

<!-- designlang.app 랜딩 페이지의 프리미엄 레이아웃, 그래디언트 노이즈, Bento Grid 디자인 분석서입니다. -->

# 디자인 해체 — designlang.app 랜딩 페이지 (Landing Teardown)

> **한줄**: 다크 모드 배경 속에서 강렬한 Molten-Orange 포인트 컬러와 노이즈 그래디언트, 정보 밀도가 높은 Bento Grid를 조화롭게 구성한 개발자 친화적 랜딩 디자인.
> **핵심 감성**: 프리미엄 다크 스킨, Fraunces serif와 Mono 폰트의 대비, 6:3:1 HSLTailored 배색이 제공하는 신뢰성과 첨단 기술 바이브.

---

## 1. 비주얼 정체성 및 타이포그래피 (Visual Identity & Typography)

### 1) 컬러 팔레트 (6:3:1 원칙 준수)
*   **Dominant (60%)**: 심해의 어둠을 표현한 칠흑색 (`#120F17`). 어둡지만 차갑지 않은 난색 조의 다크 백그라운드를 베이스로 설정.
*   **Supporting (30%)**: 미색 크림화이트 (`#F3F1EA`)와 다크그레이 계열을 사용하여 서브 타이포그래피 및 경계선 구성.
*   **Accent (10%)**: 용융된 오렌지 빛깔의 **Molten-Orange** (`#FF4800`)를 픽셀, 포인터, 핵심 CTA 버튼에 일관되게 주입하여 시선 유도.

### 2) 타이포그래피 대비
*   **세리프의 격조**: 로고 워드마크 및 핵심 H1 표제어는 Fraunces 계열의 클래식한 세리프 폰트를 사용하여, 도구가 가지는 기술적 엄밀함 속에 우아한 장인 정신(Craftsmanship) 감성을 주입.
*   **모노의 엄밀성**: CLI 명령어 설명 및 Bento Grid 내부의 수치 정보들은 고정폭 폰트(Geist Mono 계열)를 배치하여 코딩 도구로서의 사용성 극대화.

---

## 2. 레이아웃 구조 분석 (Layout Hierarchy)

### 1) Grainient Hero 섹션
*   **배경 그래디언트 노이즈**: 단순 컬러 채우기가 아닌, 다채로운 그래디언트 기저 위에 미세한 그레인(Grain/Noise) 텍스처를 얹은 **Grainient** 효과를 배경(`grainient-container`)으로 활용하여 시각적 질감과 프리미엄 무드를 한껏 끌어올림.
*   **TUI(Terminal UI) 모조 시연**: 2컬럼 레이아웃 우측에 터미널 가동 스크립트 실행 로그(`tui-out`)를 모사 렌더링하여, 사용자가 리포트를 열기 전에 도구의 동작 프로세스를 본능적으로 인지하게 스캐닝 설계함.
*   **원클릭 복사 버튼**: `$ npx designlang stripe.com` 명령 컴포넌트를 원터치 복사 카드(`copycmd`)로 구성하여 랜딩 즉시 전환 유도.

### 2) Bento Grid 섹션
*   **구조적 모듈화**: 9가지 기능과 11개 플랫폼을 바둑판 형태로 집약하여, 시선의 피로도를 줄이면서 다채로운 기술 사양을 효과적으로 시각화.
*   **미니 인터랙션 아티팩트**:
    *   **DTCG tree**: 토큰 상속 및 계층 구조(Primitive ➔ Semantic ➔ Composite)를 CSS 들여쓰기와 라인 렌더링으로 가볍게 가시화.
    *   **Remediation Tile**: 대비 만족 기준(fail ➔ AA PASS)을 실물 타일 스왑 애니메이션 형태로 제공하여 명암비 가이드 직관화.
    *   **Brand book PDF Cover**: 미니멀한 3D 느낌의 가이드북 표지를 벡터 디자인하여 심미적 깊이 확보.

### 3) Reddit 소셜 프루프 (Reddit Stream Grid)
*   **소셜 피드 3컬럼 스태킹**: 실제 r/ClaudeAI 등 커뮤니티의 생생한 개발자 리뷰 반응을 레딧 오리지널 컴포넌트 스타일(`rdt-card`)로 박아 신뢰성 확보.
*   **비대칭 배치**: 카드들의 세로 높이를 다르게 구성하여 지루함을 배제하고 스크롤 텐션을 부여함.

---

## 3. Sub-brain 이식 및 응용 포인트 (Takeaways)

1.  **MOLTEN ORANGE 테마 프리셋**: 우리가 배포할 포트폴리오나 웹 아티팩트에 `#120F17`과 `#FF4800`의 배색 조합을 6:3:1 테마로 차용하여 극적인 대비와 프리미엄 감성 묘사.
2.  **Bento Grid 정보 설계 패턴**: 여러 기술 스택이나 장기 프로젝트의 산출 사양을 일렬로 나열하지 않고, 핵심 요소들을 아기자기한 미니 카드(Interactive tile) 형태로 모듈화하는 Bento 아키텍처 수용.
3.  **TUI/CLI 시뮬레이션 카드 활용**: CLI 스크립트(예: nightly-updater 등)의 사용성을 보여줄 때, 영리하게 터미널 아웃풋 창을 HTML 컴포넌트로 모사하여 랜딩 상단에 배치하는 기법 도입.
