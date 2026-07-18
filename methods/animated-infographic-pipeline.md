---
created: 2026-07-14
updated: 2026-07-14
type: learning
category: method
tags: [animated-infographic, css-animation, svg, html, gif, ffmpeg, hyperframes, motion-design, editorial-system-map]
source: "Codex RETURN 2026-07-14 animated-infographic-pipeline (SHA256 asset e8dd5ee3…, RETURN 2e501ded…, sources 6/6 HTTP 200) — ③Gate PASS (vault Claude). + 2026-07-14 X 레퍼런스 델타(Editorial System Map 아키타입, 작가 당일 확인): https://x.com/akshay_pachaar/status/2076748259377516782 — clean-room 흡수(정보 문법·모션 메커니즘만; DailyDoseofDS 폰트·아이콘·배치·색값 복제 금지). 원본 직접 fetch=X auth wall(HTTP 402) 차단, 작가 확인 델타 반영."
---
<!-- 움직이는 한 장 인포그래픽을 HTML/CSS/SVG 정본으로 짓고 MP4/GIF로 파생하는 제작 파이프라인 (Codex ③Gate PASS, 콘텐츠 파일럿 전 skill 자가승격 금지). -->

> ⚠️ **임시(provisional)** — Codex 외부 산출 ③Gate PASS 후 methods 승격. 작가 명시 컨펌 전이며, skill 승격은 실제 콘텐츠 파일럿 1건 통과 후에만 판단한다. 자가승격 금지.

# Animated Infographic Pipeline — 움직이는 한 장을 HTML 정본으로 만드는 법

> **결론: GIF부터 만들지 않는다. 한 장의 인포그래픽을 레이어형 HTML/SVG 장면으로 만들고, CSS 모션을 얹은 다음 MP4를 품질 정본으로 렌더하고 GIF를 공유용 파생본으로 만든다.**

> **두 아키타입 (모션 철학이 반대 — 한 화면에서 섞지 않는다)**
> - **A. Organic Pamphlet** — 팜플렛이 "숨쉰다". 3층 상시 호흡(ambient/explanatory/emphasis), ~8초 루프. 감성·소개·포폴 히어로용. **본 문서 §0–10의 기본 서술 = A.**
> - **B. Editorial System Map** — 시스템·데이터 흐름을 편집디자인 격자에서 *읽히게* 하는 정적 다이어그램. 화면 95% 정적, 5%만 경로·노드로 의미 전달. 2~4초 짧은 루프. 시스템·파이프라인 설명용. **정의 = §3.5.** (2026-07-14 X 레퍼런스 델타, clean-room 흡수.)

## 0. 정직한 판단

- 분류: **방법론·제작 파이프라인**.
- 적용성: **높음**. 포트폴리오 설명도, 제품 구조도, 연구 요약, 게임 시스템 소개, AI NPC 아키텍처 설명에 반복 사용 가능하다.
- AI NPC 직접 레이어: 특정 레이어 기술은 아니지만, 시스템·기억·행동 흐름을 한 장에서 설명하는 표현 자산으로 유효하다.
- 신규성: `implementation or packaging delta`. Sub-brain에는 [Hyperframes — HTML→Video 결정론적 렌더링 프레임워크](../techniques/hyperframes.md)의 결정론적 HTML→Video, bespoke HTML, [모션 품질 게이트](html-sensory-quality-levers.md)가 이미 있다. 신규 델타는 이를 **한 장짜리 팜플렛 인포그래픽 + GIF 파생**에 맞춰 좁힌 실행 계약과 스타터다.
- 이번 자산은 실제 스타터 HTML, 렌더러, 정지 이미지, MP4, GIF까지 실행 검증했다.

## 1. 핵심 구조

```text
[내용 한 줄]
    ↓
[정적 팜플렛 완성]
    ↓
[의미 단위 레이어 분해]
    ↓
[Ambient / Explanatory / Emphasis 모션]
    ↓
[HTML/CSS/SVG live master]
    ↓
[결정론적 frame seek]
    ↓
[MP4 master] → [GIF / still 파생]
```

가장 중요한 규칙은 **Layout Before Animation**이다. Hyperframes도 정적 HTML/CSS를 최종 상태의 SSOT로 두고, 그 뒤에 진입·활동 모션을 얹는다. 공식 가이드 역시 plain HTML+CSS와 paused timeline, frame-accurate rendering을 권한다. ([Hyperframes 공식 가이드](https://github.com/heygen-com/hyperframes/blob/main/docs/guides/open-design-hyperframes.md))

## 2. 원본 일러스트 조건

### 가장 좋음 — SVG/Figma/Illustrator

다음처럼 의미 단위 그룹으로 분리한다.

```html
<svg viewBox="0 0 1200 900">
  <g id="background">...</g>
  <g id="route-lines">...</g>
  <g id="hero-object">...</g>
  <g id="accent-particles">...</g>
  <g id="labels">...</g>
</svg>
```

텍스트는 가능하면 HTML 또는 SVG text로 유지한다. 이미지 안에 글자를 구워 넣으면 수정·반응형·접근성이 약해진다.

### 가능 — PNG/JPG 한 장

CSS는 한 장 안의 개별 물체를 이해하지 못한다. 다음 전처리가 필요하다.

1. 움직일 대상 3~7개를 투명 PNG/WebP 레이어로 분리한다.
2. 대상이 빠진 자리는 인페인팅으로 배경을 복원한다.
3. 원본 비율을 유지한 absolute layer로 다시 쌓는다.
4. 빛·먼지·선·화살표는 SVG/CSS 레이어로 새로 만든다.

전체 그림을 흔드는 것보다 머리카락, 구름, 빛, 흐르는 선, 손짓처럼 작은 일부만 움직여야 “팜플렛이 살아난다”는 인상이 난다.

## 3. 모션을 유기적으로 보이게 하는 3층

| 층 | 역할 | 예시 | 강도 |
|---|---|---|---|
| Ambient | 장면의 호흡 | blob drift, 먼지, 아주 작은 card float | 낮음·상시 |
| Explanatory | 관계 설명 | 화살표 흐름, path draw, orbit, bar fill | 중간·순차 |
| Emphasis | 핵심 강조 | 한 번의 pulse, 숫자 변화, marker sweep | 한 시점에 하나 |

“유기적”은 랜덤하게 많이 움직이는 것이 아니다. **서로 다른 위상과 완만한 easing을 가진 작은 움직임들이 같은 메시지를 돕는 상태**다.

권장 8초 루프:

- 0.0–1.5초: 전체 구조를 읽게 둔다.
- 1.5–4.5초: 연결선·경로가 의미를 설명한다.
- 4.5–6.5초: 핵심 하나만 강조한다.
- 6.5–8.0초: 처음 상태로 복귀한다.

## 3.5 아키타입 B — Editorial System Map (정적 우세·경로 tracer)

> **아키타입 A(Organic Pamphlet)와 분리한다.** A는 "팜플렛이 숨쉰다"(3층 상시 호흡·8초)인 반면, B는 시스템·데이터 흐름을 편집디자인 격자에서 *읽히게* 하는 정적 다이어그램이다. 모션 철학이 반대이므로 섞지 않는다. §3의 3층 모션·8초 루프는 B에 적용하지 않는다.

### 정보 문법 (information grammar)

- **가로 레인(horizontal lanes)** — 단계·계층·파이프라인을 좌→우 레인으로 분리(입력→처리→출력 등). 레인 1개 = 의미 축 1개.
- **고정 그리드(fixed grid)** — 노드·라벨을 편집 격자에 스냅. 자유 배치 금지 — 정렬·간격이 위계를 만든다.
- **제한 팔레트(restricted palette)** — 2~3색 + 중립 배경. 색은 장식이 아니라 상태·분류 인코딩(활성/비활성·데이터 종류).
- **노드 + 경로(nodes + paths)** — 박스/원 = 처리 단계, 연결선 = 데이터 흐름. 관계가 곧 콘텐츠다.

### 모션 메커니즘 (A와 정반대 — 정적 우세)

- **화면 95% 정적, 의미 전달 5%만 움직임.** 움직임은 *한 가지 관계*를 짚는 데만 쓴다.
- **경로 tracer** — 연결선을 따라 흐르는 점/대시로 "데이터가 이 경로로 흐른다"를 신호. `stroke-dashoffset` seek(§4.2 패턴 재사용, 단 상시 흐름이 아니라 한 번 훑고 멈춤).
- **노드 활성화** — tracer가 도달한 노드만 순간 하이라이트(테두리·채도 변화). 동시에 여러 노드 반짝임 금지.
- **2~4초 짧은 루프** — A(8초 호흡)보다 짧고 목적적. 한 흐름을 한 번 짚고 리셋.
- **금지(hard)**: 카메라 이동(pan/zoom)·glow·장식성 움직임·상시 ambient drift. B에선 "살아있게" 하려는 움직임 자체가 노이즈다. (§9 안티패턴 "장식 과잉"의 B 특화 강화.)

### Clean-room 흡수 계약

- 참조(DailyDoseofDS 계열 편집 다이어그램, [X @akshay_pachaar](https://x.com/akshay_pachaar/status/2076748259377516782), 작가 2026-07-14 확인)에서 **폰트·아이콘·구체 배치·색값 복제 금지.**
- 흡수 대상 = *정보 문법(레인·그리드·제한 팔레트·노드·경로)* 과 *모션 메커니즘(tracer·노드 활성화·정적 우세)* 뿐. 시각 identity는 프로젝트 팔레트로 새로 짓는다(bespoke-html-direction 정합).
- `MOTION-SPEC.md`에 아키타입(A/B)을 명시하고, B면 위 금지 목록을 STOP 항목으로 박는다.

### A/B 선택 기준

| 축 | A. Organic Pamphlet | B. Editorial System Map |
|---|---|---|
| 대상 | 감성·소개·포폴 히어로 | 시스템·데이터·파이프라인 설명 |
| 움직임 | 3층 상시 호흡(ambient 우세) | 정적 95% + 경로/노드 5% |
| 루프 | ~8초 | 2~4초 |
| 금지 | 과잉 장식 | 카메라 이동·glow·ambient drift |

## 4. CSS/SVG 구현 패턴

### 4.1 SVG 변환 기준 고정

```css
.moving-svg-part {
  transform-box: fill-box;
  transform-origin: center;
  animation: float 8s ease-in-out infinite;
}
```

`transform-box`는 SVG 요소의 transform reference box를 정한다. 브라우저별 중심점 오해를 줄이기 위해 명시한다. ([MDN transform-box](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-box))

### 4.2 흐르는 경로

```html
<path class="route" pathLength="100" d="..." />
```

```css
.route {
  fill: none;
  stroke-dasharray: 8 13;
  animation: route-flow 4s linear infinite;
}
@keyframes route-flow { to { stroke-dashoffset: -42; } }
```

`pathLength="100"`으로 정규화하면 화면 크기가 달라도 dash 리듬이 덜 깨진다.

### 4.3 작은 호흡

```css
@keyframes breathe {
  0%, 100% { transform: scale(1); }
  45% { transform: scale(1.035); }
  60% { transform: scale(.995); }
}
```

크기 변화는 3~5% 안에서 사용한다. 큰 확대·축소는 팜플렛보다 광고 배너처럼 보이기 쉽다.

### 4.4 접근성

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
  }
}
```

`prefers-reduced-motion`은 사용자가 비필수 움직임을 줄이도록 설정했는지 감지하는 표준 기능이다. ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion))

## 5. GIF 렌더의 핵심 — 재생이 아니라 seek

벽시계에 맡겨 화면을 녹화하면 프레임 드리프트와 로드 타이밍 차이가 생긴다. 각 프레임에서 CSS 애니메이션의 시간을 직접 고정한다.

```js
document.getAnimations().forEach((animation) => {
  animation.pause();
  animation.currentTime = captureTimeMs;
});
```

그 뒤 Headless Chrome이 0ms, 125ms, 250ms처럼 정해진 시점을 캡처한다. 이 방식은 Sub-brain의 [Hyperframes](../techniques/hyperframes.md) Frame Adapter 사상과 동일하다: “N번째 프레임에서 화면이 정확히 어떻게 보여야 하는가?”

더 큰 영상·다중 씬이면 Hyperframes를 사용한다. 공식 CLI는 HTML을 lint·preview·MP4 render하며 CSS/GSAP 등 seekable animation adapter를 지원한다. ([Hyperframes](https://github.com/heygen-com/hyperframes))

## 6. MP4 → GIF

GIF는 최대 256색이라 그라데이션과 투명도가 손실되고 파일도 커진다. 따라서 MP4를 먼저 만들고 GIF를 파생한다.

```bash
ffmpeg -i master.mp4 \
  -filter_complex \
  "fps=8,scale=800:-1:flags=lanczos,split[a][b];
   [a]palettegen=max_colors=128:stats_mode=diff[p];
   [b][p]paletteuse=dither=bayer:bayer_scale=3" \
  -loop 0 output.gif
```

FFmpeg의 `palettegen`과 `paletteuse` 필터를 사용해 영상 전용 팔레트를 만든다. ([FFmpeg filter docs](https://ffmpeg.org/ffmpeg-filters.html))

권장값:

- 정보형 GIF: 800~960px 폭, 8~15fps, 64~128색.
- 품질 정본: H.264 MP4, 원본 해상도.
- 웹 삽입: 가능하면 MP4/WebM을 쓰고 GIF는 메신저·README 호환용으로만 둔다.

## 7. 자산 계약

```text
animated-infographic/
├── index.html              # live master, inline SVG 가능
├── MOTION-SPEC.md          # 목적·타이밍·강도·STOP
├── render.sh               # deterministic capture + FFmpeg
├── assets/                 # 분리된 SVG/PNG/WebP 레이어
└── renders/
    ├── still.png
    ├── master.mp4
    └── preview.gif
```

완료 조건:

1. 애니메이션을 꺼도 정보가 모두 읽힌다.
2. 각 움직임의 설명 목적을 한 문장으로 말할 수 있다.
3. 0초·중간·마지막 프레임에 잘림·누락·검은 합성이 없다.
4. 루프 경계에서 눈에 띄는 점프가 없다.
5. reduced-motion과 화면 밖 정지가 작동한다.
6. MP4·GIF 프레임 수·재생시간이 스펙과 일치한다.

## 8. 검증된 실행형 스타터 (Codex 산출)

- source: `starter/index.html`
- motion contract: `starter/MOTION-SPEC.md`
- renderer: `starter/render.sh`
- still: `starter/renders/animated-infographic-still.png`
- MP4: 1200×900, 8fps, 64 frames, 8.000s.
- GIF: 800×600, 64 frames, 8.010s.
- 내용: “관찰 → 구조 → 리듬 → 파생”을 한 장의 팜플렛 구조로 표현.
- 위치(vault 밖, 절대룰 #6): `~/Documents/Codex/2026-07-14/animated-infographic-pipeline/starter/`. SHA256SUMS.txt 전건 OK.

## 9. 안티패턴

- GIF 편집기에서 레이어를 직접 복제하며 정본을 잃는 방식.
- 모든 요소가 흔들리거나 반짝이는 장식 과잉.
- 정적 상태에서는 의미가 없고 모션을 봐야만 이해되는 구조.
- `left/top/width/height`를 계속 애니메이션해 layout cost를 만드는 방식.
- 한 장의 PNG 내부 물체를 CSS가 자동으로 분리해 줄 것이라는 가정.
- GIF를 품질 정본으로 보관하는 방식.
- 무한 루프를 화면 밖에서도 계속 실행하는 방식.

## 10. 다음 파일럿 (skill 승격 전제)

실제 자산 1건으로 검증할 때는 다음 중 하나가 적합하다.

1. AI NPC의 `Memory → Reflection → Plan → Action` 한 장 구조도.
2. Sub-brain의 `Source → Gate → Apply → Eval` 운영 팜플렛.
3. 포트폴리오 프로젝트의 문제→설계→구현→검증 한 장 요약.

첫 파일럿에서는 **새 디자인 시스템을 만들지 말고**, 실제 내용 1건과 레퍼런스 1개를 잠근 뒤 스타터의 텍스트·레이어·팔레트만 교체한다.

## 11. 출처 (전건 HTTP 200, source_status.tsv)

- [Hyperframes repository](https://github.com/heygen-com/hyperframes)
- [Hyperframes Open Design guide](https://github.com/heygen-com/hyperframes/blob/main/docs/guides/open-design-hyperframes.md)
- [MDN — Using CSS animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations)
- [MDN — transform-box](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-box)
- [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40media/prefers-reduced-motion)
- [FFmpeg Filters Documentation](https://ffmpeg.org/ffmpeg-filters.html)

## 관계

- 정본 계보: [Hyperframes — HTML→Video 결정론적 렌더링 프레임워크](../techniques/hyperframes.md)(결정론적 HTML→Video)·[Hyperframes Skill 패턴 — 5-step 강제 워크플로우 + Hard Gate](hyperframes-skill-pattern.md)(5-step 강제 워크플로우)의 좁힌 인스턴스. bespoke-html-direction 주 경로·[HTML Sensory 품질 레버 (bespoke용)](html-sensory-quality-levers.md) 감각 레버와 정합.
- 학습→반영 루프: 반영처 = 빌더/HTML 산출. **파킹** — skill 자가승격은 실제 콘텐츠 파일럿 1건 통과 후. 가설 스테이징 = .incubator/animated-infographic-pipeline.
- Gate 계보: hermes-loop ③Gate·④Promote · codex-gate(발견·게이트).
