---
created: 2026-06-08
updated: 2026-06-08
type: learning
tags: [frontend, landing-page, motion, css-animation, intersection-observer, pixel-art, i18n, ui-architecture]
source:
  - https://comnyang.com/
authors: [Comnyang (projact)]
year: 2026
category: technique
---

# Comnyang 랜딩 Teardown — "무라이브러리 모션" 아키텍처

*comnyang.com 의 raw `index.html` / `styles.css`(44KB) / `script.js`(21KB) 직접 분석. WebFetch 는 403, `curl + UA` 로는 200.*

> **한 줄 결론**: 고급 "모션감" 랜딩이 GSAP·Lenis·Three.js·프레임워크 **전부 0** 으로 구현됨. 비결은 ① 미리 렌더한 mp4 루프 ② IntersectionObserver 재생 예산 ③ 순수 CSS transition/`@keyframes`. 라이브러리 ≠ 모션.

관련: [프리미엄 UI/UX 심리학 전략 (Premium Design Methods)](../methods/premium-ui-ux-strategies.md) (심리/전략 층) · [SPD UI Clean-Room — 5개 클래스의 *역할*만](spd-ui-clean-room.md) (픽셀 UI 역할 분리) · [awesome-design-md — 브랜드별 DESIGN.md 69종 레퍼런스 컬렉션](../methods/awesome-design-md.md)

---

## 0. 스택 실측 (놀랍도록 얇음)

| 로드 | 역할 |
|---|---|
| `styles.css` 44KB | 100% 수기 CSS |
| `script.js` 21KB | 바닐라 JS, `"use strict"`, **외부 의존성 0** |
| `i18n.js` | 자체 EN/KO/JA |
| Google Fonts · lemon.js · tally · TikTok pixel | 폰트·결제·분석 (모션 무관) |

→ 모션 라이브러리가 **하나도 없다.** 아래 패턴들이 그 공백을 메운다.

---

## 1. ⭐ 모션 = mp4 루프 + 재생 예산 (가장 전이 가치 큼)

고양이 15종 모션은 전부 **미리 렌더한 정사각 mp4 루프**다. 실시간 렌더 0.

```html
<div class="motion-stage motion-video-stage">
  <video autoplay muted loop playsinline preload="metadata">
    <source src="assets/video/1-eye-follow.mp4" type="video/mp4">
  </video>
</div>
```

15개 + hero 비디오를 동시 autoplay 하면 브라우저가 죽는다. 그래서 **HTML `autoplay` 는 사실상 폴백이고, 실제 제어를 JS 가 뺏어온다** — "보이는 것만 재생":

```js
function initVideoPlaybackBudget() {
  const videos = Array.from(document.querySelectorAll("video"));
  videos.forEach(v => { v.muted = true; v.pause(); });   // 일단 전부 정지

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => e.isIntersecting ? e.target.play() : e.target.pause());
  }, { rootMargin: "160px 0px", threshold: 0.08 });       // 진입 직전 미리 재생

  videos.forEach(v => observer.observe(v));

  document.addEventListener("visibilitychange", () => {    // 탭 숨기면 정지(배터리)
    if (document.hidden) videos.forEach(v => v.pause());
  });
}
```

**핵심 디테일**:
- `rootMargin: "160px"` → 뷰포트 진입 *직전* 재생 시작 → 끊김 제거
- `threshold: 0.08` → 8%만 보여도 켬
- `visibilitychange` → 백그라운드 탭 전체 정지
- `play().catch(()=>{})` → 자동재생 정책 거부 시 조용히 무시

> **내게 없던 지점**: "스크롤하면 콘텐츠가 살아 움직인다"의 정체 = 마법 아님. IntersectionObserver play/pause. 영상·캔버스·Lottie 다수 배치 시 그대로 차용.

---

## 2. 레이아웃 — 순수 CSS Grid (motions 섹션)

```css
.motion-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));  /* minmax(0,..)=오버플로 방지 */
  gap: 24px;
}
@media (max-width: 1100px) { .motion-grid { grid-template-columns: repeat(2, minmax(0,1fr)); } }
@media (max-width: 880px)  { .motion-grid { grid-template-columns: 1fr; } }
```

카드 1장 구조(15회 반복): `번호표(.motion-tag) + 제목 → 1:1 비디오 스테이지 → 설명`.

```css
.motion-stage { aspect-ratio: 1 / 1; overflow: hidden; }   /* 정사각 강제 */
.motion-video { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
```

> `minmax(0, 1fr)` 은 grid 자식이 내용물 때문에 1fr 을 넘기는 고질버그를 막는 *반드시 알아야 할* 관용구.

---

## 3. ⭐ 픽셀풍 "하드 섀도우" 디자인 토큰 (사이트 정체성)

블러 0 의 오프셋 박스섀도우 = 레트로 게임 UI "들리는" 질감. **사이트 전역에서 반복**:

```css
:root { --shadow: 4px 4px 0 0 #ffffff; }   /* blur 0 → 픽셀 느낌 */

.motion-card {
  border: 2px solid var(--fg);
  transition: transform .18s ease, box-shadow .18s ease;
}
.motion-card:hover {
  transform: translate(-3px, -3px);          /* 좌상단으로 들림 */
  box-shadow: 6px 6px 0 0 var(--fg);         /* 그림자가 커지며 부상감 */
}
```

호버 마이크로 인터랙션이 전부 CSS `transition` 한 줄. JS 불필요.

---

## 4. `@keyframes` + `steps()` = 도트 애니메이션 (8종)

부드러운 보간 대신 **`steps(1)` 로 똑딱 끊어** 2프레임 GIF 느낌을 낸다 — 픽셀아트 정체성.

```css
/* 발바닥이 좌/우로 0.42초마다 깜빡 → 2프레임 스프라이트 */
.paw-left  { animation: checkout-paw-left  .42s steps(1, end) infinite; }
.paw-right { animation: checkout-paw-right .42s steps(1, end) infinite; }
@keyframes checkout-paw-left  { 0%,49.99%{opacity:1} 50%,100%{opacity:0} }
@keyframes checkout-paw-right { 0%,49.99%{opacity:0} 50%,100%{opacity:1} }
```

기타: `buy-pulse`(구매버튼 섀도우 호흡 6↔8px) · `tag-wobble`(가격표 ±4deg 흔들) · `paw-bounce`(translateY+opacity) · `ticker`(40s linear 무한 가로스크롤) · `blink-hint`(점멸).

> **핵심**: `animation-timing-function: steps(N)` 이 "도트가 똑딱거리는" 질감의 트릭. ease 쓰면 미끄덩해서 픽셀감 죽음.

---

## 5. 분위기를 만드는 "값싼" CSS 레이어 (이미지 0)

전역 `position: fixed` 오버레이 2장으로 CRT 모니터 질감 + 격자 배경을 만든다. 비용 거의 0.

```css
/* CRT 스캔라인 */
.scanlines {
  position: fixed; inset: 0; pointer-events: none; z-index: 1;
  background: repeating-linear-gradient(to bottom,
    transparent 0, transparent 2px, rgba(255,255,255,.02) 3px, transparent 4px);
  mix-blend-mode: overlay;
}
/* 가장자리로 페이드되는 격자 */
.grid-bg {
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background-image:
    linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: radial-gradient(ellipse at center, black 40%, transparent 90%);
}
```

z-index 레이어링: `grid-bg(0) → scanlines(1) → 콘텐츠(2)`. `pointer-events:none` 으로 클릭 통과.

**색 규칙**: 흑백 + **포인트 컬러 단 하나** `--accent-pop: #ffd23f`(고양이 눈 노랑). 절제가 프리미엄감 ([프리미엄 UI/UX 심리학 전략 (Premium Design Methods)](../methods/premium-ui-ux-strategies.md) §노이즈 제거와 정합).

---

## 6. ⭐ 한·영 혼용 폰트 정렬 (내게 직접 필요한 지점)

작가는 한국어+영어 사이트를 만든다. comnyang 은 **`size-adjust` 로 영문 픽셀폰트의 cap-height 를 한글 폰트 글자높이에 강제 정렬**한다 — 혼용 시 영문이 작아 보이는 고질병 해결:

```css
@font-face {
  font-family: "Born2bSporty FS";
  src: url("...born2bsporty-fs.woff2") format("woff2");
  size-adjust: 136%;   /* EN cap-height(67px)를 한글(91px)에 맞춤 @100px */
}
```

언어 전환은 **CSS 변수 스왑**으로 (JS 폰트 로직 0):

```css
html[lang="ko"] { --font-pixel: "Cafe24ProUp", ...; --font-mono: "Cafe24ProUp", ...; }
html[lang="ja"] { --font-pixel: "DotGothic16", ...; }
/* 단일 weight 한글 픽셀폰트의 브라우저 faux-bold 번짐 차단 */
html[lang="ko"] * { font-weight: normal !important; font-synthesis-weight: none; }
```

JS 는 `<html lang>` 만 바꾸고 `comnyang:langchange` 커스텀 이벤트 발행 → CSS 가 나머지를 처리.

---

## 7. 라이브러리 없는 실시간 인터랙션 (필요 시 차용)

mp4 로 대체되긴 했지만 코드엔 살아있는 패턴:

- **커서 추적 + 패럴랙스**: 마우스 위치 → `translate()`. SVG 내부(`obj.contentDocument`)의 body/eyes/shadow 를 시차계수(0.4 / 1.6 / -0.4)로 따로 움직여 깊이감. → 패럴랙스를 라이브러리 없이 `contentDocument` 직접 조작.
- **타이핑 반응**: 카드가 보일 때만 전역 `keydown` 리스닝(IntersectionObserver 로 on/off), 누를 때마다 좌↔우 발 SVG 스왑.
- **상태 = SVG 파일 스왑 + class 토글**. JS 는 좌표·타이머만, 시각은 CSS/SVG 가.

---

## 8. 재현 레시피 (이걸로 랜딩 골격 짜기)

1. 모션은 **mp4 루프로 미리 렌더** — 실시간 부담 0, 화질 완전 통제
2. **IntersectionObserver 로 보이는 비디오만 play/pause** (+`rootMargin` 선재생, `visibilitychange` 정지)
3. 레이아웃은 **CSS Grid `repeat(N, minmax(0,1fr))`** + 1~2단계 미디어쿼리
4. 호버/마이크로 인터랙션 = **CSS `transition` + 하드 박스섀도우 토큰**
5. 무한 디테일 = **`@keyframes` + `steps()`** (픽셀이면 필수)
6. 분위기 = `position:fixed` **scanlines/grid-bg** + `mix-blend-mode` (이미지 0)
7. 색은 **흑백 + 포인트 1색**
8. 한·영 혼용은 **`size-adjust` + `lang` 변수 스왑**
9. 실시간 추적은 **정말 필요할 때만** 바닐라 `translate()` + 시차계수

→ GSAP/Lenis 없이도 "살아있는" 페이지가 나온다는 실증. [프리미엄 UI/UX 심리학 전략 (Premium Design Methods)](../methods/premium-ui-ux-strategies.md) 의 심리 전략과 결합하면 전략(왜)+구현(어떻게) 한 쌍 완성.

---

## 9. 빌더 반영 현황 (학습→出力 다리)

본 teardown 은 *위키 노트로 끝나지 않고* html-publish 빌더에 실제 이식됨 (2026-06-08). 정본 레지스트리: GUIDE.md §13.

| 패턴 | 빌더 반영 | 상태 |
|---|---|---|
| 스크롤 진입 리빌 (§1) | `_slots.css .reveal` + `build.py` revealIO/js-gate | ✅ |
| 분위기 텍스처 (§5) | `_slots.css html[data-texture]` + `page.texture` yml | ✅ |
| 카드 미리보기 깊이 | `build.py parse_page` summary(2단락) | ✅ |
| `steps()` 도트 애니 (§4) | Pixel 아키타입(5번째) — `_slots.css html[data-archetype="pixel"]` steps() 깜빡 커서 + 하드섀도우 + `build_pixel()` | ✅ 2026-06-08 |
| `size-adjust` 한·영 정렬 (§6) | mono 한글=`Nanum Gothic Coding`(Google, 머신무관) + 오프라인 폴백 D2Coding `size-adjust` | ✅ 2026-06-08 (mono only, 견고화) |
