---
created: 2026-06-12
updated: 2026-06-12
type: learning
tags: [teardown, html-publish, pixel-art, markup, micro-interaction, commerce]
source: https://comnyang.com
category: method
---

# Comnyang 랜딩 해체분석 (Comnyang Teardown)

> **한줄**: 데스크톱 픽셀 캐릭터 컨셉의 미니멀 커머스 랜딩 페이지 UI/UX 해체 및 PDD 이식 가이드.
> **분석 방식**: 15개 픽셀 모션 리스트, 커머스 요금 레이아웃, steps() 애니메이션 원본 모델 정밀 대조.

---

## 1. DOM 구조 분석 (Semantic Markup Snapshot)

전체 페이지 흐름은 `Hero → Pricing/Purchase → Feature Mood Grid → Social Links → Pricing 반복 → Footer → Sticky Bottom CTA`로 구성되어 캐릭터 감성과 실질적인 구매 전환 유도가 밀접하게 결합되어 있습니다.

### 핵심 구조 마크다운 레이아웃
```html
<body>
  <header class="site-header" id="top">
    <a class="brand" href="/" aria-label="Comnyang home">
      <span class="brand-mark" aria-hidden="true">▣</span>
      <span class="brand-text">COMNYANG</span>
    </a>
    <nav class="language-nav" aria-label="Language">
      <a href="/kr">KR</a>
    </nav>
    <nav class="action-nav" aria-label="Primary">
      <a href="#download">DOWNLOAD</a>
      <a class="button button-dark" href="#buy">BUY NOW ▸</a>
    </nav>
  </header>
  <main>
    <!-- 1. Hero: H1 타이포그래피 + 픽셀 데모 스테이지 -->
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-copy">
        <h1 id="hero-title">A PIXEL CAT THAT LIVES ON YOUR DESKTOP.</h1>
        <p>Comnyang follows your cursor, reacts to every keystroke, and nudges you to stretch.</p>
        <ul class="tag-row" aria-label="Product tags">
          <li>AI agent work-status reactions</li>
        </ul>
      </div>
      <figure class="hero-stage" aria-label="Pixel cat desktop demo">
        <div class="desktop-label">~/desktop</div>
        <div class="pixel-cat" aria-hidden="true"></div>
      </figure>
    </section>

    <!-- 2. Purchase: 1치 구매 안내 + Lemon Squeezy 체크아웃 카드 -->
    <section class="purchase-section" id="buy" aria-labelledby="purchase-title">
      <div class="purchase-copy">
        <p class="terminal-label">~/desktop</p>
        <h2 id="purchase-title">ONE CAT. READY FOR YOUR DESKTOP.</h2>
        <ul class="check-list">
          <li>All features included</li>
        </ul>
      </div>
      <aside class="checkout-card" aria-label="Comnyang checkout summary">
        <div class="price-row">
          <span class="price-currency">$</span>
          <span class="price-main">3</span>
          <span class="price-decimal">.90</span>
        </div>
        <div class="support-box">
          <h3>SUPPORT THE DEVELOPER</h3>
        </div>
        <a class="button button-buy" href="#">BUY COMNYANG</a>
      </aside>
    </section>

    <!-- 3. Mood Grid: 15개 픽셀 모션 기능 소개 카드 -->
    <section class="mood-section" id="motion" aria-labelledby="mood-title">
      <div class="mood-grid">
        <article class="mood-card">
          <span class="mood-index">01</span>
          <h3>CUSTOM FUR PATTERN</h3>
          <p>Give Comnyang the same markings as your real cat.</p>
        </article>
      </div>
    </section>
  </main>
</body>
```

---

## 2. CSS 토큰 설계 및 PDD 매핑 전략

Comnyang은 황색/크림 계열의 픽셀 캐릭터 미감을 지니고 있습니다. PDD로 이식 시에는 하드코딩을 배제하고 아래와 같이 표준 변수로 바인딩합니다.

### PDD 변수 매핑 테이블
*   **배경색 (`--c-bg`)**: PDD의 라이트 모드 배경 토큰 `--p-color-bg-base` 또는 테마별 크림색 팔레트로 매핑.
*   **글자색 (`--c-ink`)**: PDD의 잉크 컬러 `--p-color-text-base`로 매핑.
*   **강조색 (`--c-accent`)**: PDD 시스템의 공통 액센트 토큰 `--p-color-accent`로 매핑.

### 이식용 CSS 변수 정의
```css
:root {
  --c-bg: oklch(94% 0.025 86);
  --c-ink: oklch(17% 0.018 75);
  --c-panel: oklch(98% 0.015 86);
  --c-accent: var(--p-color-accent); /* PDD 시스템 토큰 매핑 */
  --font-display: "Arial Black", "Impact", system-ui, sans-serif;
  --font-mono: var(--p-font-mono); /* PDD 모노 폰트 매핑 */
  --ease-pixel: steps(2, end);
  --ease-out: cubic-bezier(.22, 1, .36, 1);
  --shadow-card: 0 20px 0 oklch(17% 0.018 75 / 0.12);
}
```

---

## 3. 마이크로 인터랙션 및 애니메이션

### 픽셀 스프라이트 Steps 애니메이션
```css
@keyframes cat-idle {
  0%, 100% {
    transform: translateX(-50%) translateY(0) scale(1);
  }
  50% {
    transform: translateX(-50%) translateY(-8px) scale(1.02, .98);
  }
}

@keyframes cat-wiggle {
  0%, 100% {
    transform: translateX(-50%) rotate(0deg);
  }
  25% {
    transform: translateX(-50%) rotate(-3deg);
  }
  75% {
    transform: translateX(-50%) rotate(3deg);
  }
}

.hero-stage:hover .pixel-cat {
  animation: cat-wiggle .36s var(--ease-pixel) infinite;
}
```

### 카드 Hover 및 하드 박스섀도우 효과
```css
.mood-card {
  position: relative;
  min-height: 280px;
  border: 3px solid var(--c-ink);
  border-radius: var(--radius-lg);
  background: var(--c-panel);
  box-shadow: 0 8px 0 var(--c-ink);
  transition: transform var(--duration-base) var(--ease-out),
              box-shadow var(--duration-base) var(--ease-out);
}
.mood-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 0 var(--c-ink);
}
```

---

## 4. Sub-brain 빌더용 재사용 슬롯 매핑 테이블

| 슬롯명 | 원본 기능 대응 | PDD 빌더 이식명 |
|---|---|---|
| 헤더 | 브랜드 + 언어 네비게이션 | `top-commerce-nav` |
| 히어로 | 캐릭터 전용 데스크톱 스테이지 | `hero-character-desktop` |
| 요금제 카드 | 3.9달러 + 후원 체크아웃 카드 | `checkout-card-lite` |
| 기능 그리드 | 15개 픽셀 모션 카드 | `mood-feature-grid` |
| 소셜 스트립 | Instagram / Threads / X | `social-link-strip` |
| 구매 반복 | 페이지 하단 전환 재호출 | `closing-commerce-repeat` |
| 고정 CTA | 하단 고정 스티키 바 | `sticky-bottom-cta` |
| 푸터 | 약관 + 라이센스 리셋 링크 | `footer-legal-grid` |
