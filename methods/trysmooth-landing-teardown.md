---
created: 2026-06-12
updated: 2026-06-12
type: learning
tags: [teardown, html-publish, css, markup, micro-interaction, landing-page]
source: https://www.trysmooth.ai/ko
category: method
---

# trysmooth.ai 랜딩 해체분석 (Trysmooth Teardown)

> **한줄**: 실시간 AI 미팅 비서 서비스의 다크 SaaS 랜딩 페이지 UI/UX 해체 및 ParkDal Design System(PDD) 이식 매핑 가이드.
> **분석 방식**: 시맨틱 흐름과 시각 에셋 관찰 기반의 clean-room 분석.

---

## 1. DOM 구조 분석 (Semantic Markup Snapshot)

전체 페이지 흐름은 `Header → Hero → Social Proof → Problem → Features → Security → Pricing → FAQ → Closing CTA → Footer`로 연결되어 신뢰와 행동을 유도하는 전형적인 SaaS 전환 설계입니다.

### 핵심 구조 마크다운 레이아웃
```html
<body>
  <header class="site-header">
    <a class="brand" href="/">
      <img src="/logo.png" alt="Smooth AI logo">
    </a>
    <nav class="site-nav" aria-label="Primary">
      <a href="#features">기능</a>
      <a href="#pricing">가격</a>
      <a href="#faq">FAQ</a>
      <a class="button button-primary" href="/signup">무료로 시작하기</a>
    </nav>
  </header>
  <main>
    <!-- 1. Hero: H1, CTA, 데모 영상 배치 -->
    <section class="hero section-dark">
      <p class="eyebrow">글로벌 전문가들을 위해 설계된 미팅 AI</p>
      <h1>영어 미팅, 지금 즉시 잘 하게 해드림.</h1>
      <p class="hero-copy">영어 미팅 중에 켜두기만 하세요.</p>
      <a class="button button-cta" href="/signup">무료로 시작하기</a>
      <figure class="hero-demo">...</figure>
    </section>

    <!-- 2. Social Proof: testimonial 카드 그리드 -->
    <section class="social-proof">
      <h2>외국계 직장인, 해외 유학생들을 위한 영어 미팅 치트키.</h2>
      <div class="testimonial-grid">...</div>
    </section>

    <!-- 3. Problem: 문제점 제시 (이모지 동반 카드 3종) -->
    <section class="problem">
      <p class="eyebrow">문제점</p>
      <h2>영어 미팅, 괴로우시죠?</h2>
      <div class="pain-card-grid">...</div>
    </section>

    <!-- 4. Features: During(실시간)/After(기록) 분할 그리드 -->
    <section id="features" class="features">
      <section class="feature-group" data-phase="during">
        <h3>During 실시간 보조</h3>
        <article class="feature-panel">...</article>
      </section>
      <section class="feature-group" data-phase="after">
        <h3>After 미팅 노트 및 피드백</h3>
        <article class="feature-card">...</article>
      </section>
    </section>

    <section id="pricing" class="pricing">...</section>
    <section id="faq" class="faq">...</section>
  </main>
</body>
```

---

## 2. CSS 토큰 설계 및 PDD 매핑 전략

Smooth AI는 블랙/차콜 기반 다크 테마에 네온 그린 액센트 컬러를 사용합니다. PDD에 이식할 때는 임의 색상 하드코딩을 배제하고 다음과 같이 매핑합니다.

### PDD 변수 매핑 테이블
*   **배경색 (`--s-bg`)**: PDD의 다크 모드 배경 토큰 `--p-color-bg-deep`으로 매핑.
*   **카드배경 (`--s-card`)**: PDD의 `--p-color-card-bg`로 매핑.
*   **네온 그린 액센트 (`--s-accent`)**: PDD 시스템의 공통 액센트 토큰인 `--p-color-accent` 또는 성공 의미의 `--p-color-success`로 흡수.

### 이식용 CSS 변수 정의
```css
:root {
  --s-bg: oklch(12% 0.01 260);
  --s-card: oklch(20% 0.01 260);
  --s-card-2: oklch(24% 0.01 260);
  --s-text: oklch(96% 0.004 260);
  --s-border: oklch(100% 0 0 / 0.12);
  --s-accent: var(--p-color-accent); /* PDD 시스템 토큰 매핑 */
  --radius-lg: 32px;
  --ease-smooth: cubic-bezier(.16, 1, .3, 1);
  --duration-base: 250ms;
}
```

### 레이아웃 스타일
```css
.testimonial-grid, .pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}
.testimonial-card {
  background: linear-gradient(180deg, var(--s-card), var(--s-card-2));
  border: 1px solid var(--s-border);
  border-radius: var(--radius-lg);
  padding: clamp(20px, 2.4vw, 32px);
}
@media (max-width: 900px) {
  .testimonial-grid, .pricing-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## 3. 마이크로 인터랙션 및 애니메이션

### FAQ 아코디언 컴포넌트
```html
<div class="faq-list">
  <button class="faq-trigger" aria-expanded="false">
    <span>자주 묻는 질문 제목</span>
    <span class="faq-icon" aria-hidden="true"></span>
  </button>
  <div class="faq-panel" hidden>
    <p>답변 내용...</p>
  </div>
</div>
```
```css
.faq-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 0;
  color: var(--s-text);
  background: transparent;
  border: 0;
  border-bottom: 1px solid var(--s-border);
  cursor: pointer;
}
.faq-icon {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background:
    linear-gradient(var(--s-text), var(--s-text)) center / 14px 2px no-repeat,
    linear-gradient(var(--s-text), var(--s-text)) center / 2px 14px no-repeat;
  transition: transform var(--duration-base) var(--ease-smooth);
}
.faq-trigger[aria-expanded="true"] .faq-icon {
  transform: rotate(45deg);
}
```

### 스크롤 리빌 (Intersection Observer)
```javascript
const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  }
}, { threshold: 0.18 });

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
```

---

## 4. 에셋 배치 모델링 (Responsive Asset)

데스크톱과 모바일용 일러스트/이모지 크기가 상이하므로, 반응형 이미지 처리를 위해 `<picture>` 태그를 활용해 뷰포트별 최적화를 집행합니다.

```html
<picture>
  <source media="(max-width: 640px)" srcset="/freeze-emoji-mobile.png">
  <img class="emoji-asset" src="/freeze-emoji.png" alt="대기 화면 이모지" loading="lazy">
</picture>
```

---

## 5. Sub-brain 빌더용 재사용 슬롯 매핑 테이블

| 슬롯명 | 원본 기능 대응 | PDD 빌더 이식명 |
|---|---|---|
| 헤더 | 상단 스티키 메뉴 | `top-anchored-nav` |
| 히어로 | 제품 타이틀 + CTA + 비디오 | `hero-fullbleed` |
| 입증벽 | 사용자 리뷰 카드 그리드 | `quote-wall` |
| 문제 제기 | 고통 포인트 3종 카드 | `problem-card-grid` |
| 기능 분석 | 실시간/사후 기능 레이아웃 | `subfeature-grid` |
| 요금제 | 가격 플랜 3종 카드 | `pricing-card-grid` |
| FAQ | 아코디언 질문 리스트 | `accordion-faq` |
| 마감 CTA | 최종 클릭 유도 섹션 | `closing-headline` |
