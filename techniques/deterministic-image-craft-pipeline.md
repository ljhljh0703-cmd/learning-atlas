---
created: 2026-07-20
updated: 2026-07-20
type: learning
tags: [canvas, dithering, post-processing, retro-craft, anti-slop, ascii, halftone, signal-processing, teardown]
source: [https://www.ascii-magic.com/]
authors: [ascii-magic]
year: 2026
category: technique
---
<!-- ascii-magic.com 해체(read-only) — canvas 2D CPU로 이미지·영상을 힙한 레트로 크래프트로 만드는 재현 파이프라인. anti-AI-slop 결정론 미학. 적용 규율은 [HTML Sensory 품질 레버 (bespoke용)](../methods/html-sensory-quality-levers.md). -->

# 결정론적 이미지 크래프트 파이프라인 (Canvas 디더 + 후처리)

> **경계**: ASCII 렌더 *기본 골격*(`source → grid downsample → glyph ramp → renderer`)은 이미 [HTML Sensory 품질 레버 (bespoke용)](../methods/html-sensory-quality-levers.md) §ASCII 레버에 있다. **본 페이지는 그 위에 ASCII Magic이 더한 신규분 = 디더 엔진 + canvas CPU 파이프라인 구현 + 후처리 감각 스택**의 *재현 레시피*만 다룬다. *언제/어떻게 쓰나*(적용 규율)는 html-sensory 레버 페이지. 출처: `ascii-magic.com` read-only 해체(2026-07-20, 실제 번들 코드 검증).

## 왜 (포지셔닝 ▸ anti-AI-slop 힙 크래프트) ★작가 각도

작가 판정: **"비개발자 눈 돌아가는 요소. 짜치는 AI 슬롭이 아니라 굉장히 힙하고 멋있음."** — 이게 이 기술의 전략적 가치다. 생성형 AI 이미지가 흔해지며 *AI-slop*(반들반들 무개성)에 시선이 마모된 지금, **결정론적 신호처리 미학**(디더·CRT·스캔라인·하프톤)은 오히려 *크래프트감·의도·레트로 힙*으로 읽힌다. AI 0·GPU 0·서버 0라 재현·소유·통제도 완전. → 차별화 자산. (단 §한계의 남발 경고 필수 — 힙과 슬롭은 *절제*가 가른다.)

## 실제 기술 알맹이 (번들 코드 검증분)
"Magic"은 알고리즘 마법이 아니라 **폴리시 + 스타일 폭 + 후처리**의 마법. 코어는 교과서라 *그래서 재현이 쉽다*.

**파이프라인 (Canvas 2D, CPU-side — WebGL 아님):**
1. **다운스케일** — 소스(이미지/`<video>` 프레임)를 오프스크린 canvas에 격자 해상도로 축소. 셀 1 = 출력 단위 1.
2. **픽셀 리드백** — `ctx.getImageData(..., { willReadFrequently: true })`로 CPU에 픽셀 회수. ★이 옵션이 반복 리드백 최적화 = 실시간의 열쇠. GPU 셰이더 미사용 → 이식 장벽 0.
3. **셀→값 매핑** — 셀 휘도 계산 → 글리프 램프(` .:-=+*#%@`)·색·타일로 치환. `charset`·`threshold`·`brightness` 파라미터.
4. **디더링 (★신규 품질 레버)** — 램프/양자화 *직전*에 삽입. 제한 팔레트에서 그라데이션을 읽히게 만드는 결정론 기법:
   - **Bayer 4×4 (ordered)** — 타일링 임계값 매트릭스. 빠르고 규칙적 패턴(레트로 룩에 적합).
   - **Floyd-Steinberg (error diffusion)** — 양자화 오차를 이웃 픽셀로 확산. 더 유기적, 필름 그레인 느낌.
   - 둘 다 구현됨("new dither engine"의 정체). *디더 없는 램프 = 뭉갬, 디더 = 완성도*.
5. **출력** — 모노스페이스 `<pre>` 텍스트 또는 글리프를 표시 canvas에 재드로우. 색 모드 = 셀 색 샘플.
6. **후처리 감각 스택 (★신규)** — Vignette · Scan Lines · CRT Curvature · Chromatic Aberration · Bloom · Character Bloom · Film Grain · RGB Split · Halftone · Pixelate · Color Overlay. 4× 해상도 export.

**비디오** = 위 루프를 `requestAnimationFrame`으로 프레임마다 반복(별도 알고리즘 아님).

## 적용 트리거 + 체크리스트 (바로 꺼내 쓰는 용도)

**언제 인출** — HTML 페이지/포트폴리오에 힙한 레트로 flourish, 스크린샷 reveal, 스토리 비디오 스타일이 필요할 때. (적용 *규율*·게이트는 [HTML Sensory 품질 레버 (bespoke용)](../methods/html-sensory-quality-levers.md) — 여기는 구현 재료.)

- [ ] **무의존성 우선** — ASCII 텍스트 출력이면 `<pre>` + 사전렌더가 1순위. canvas는 영상·색·대형 grid·후처리 실필요 시만(html-sensory 레버 정합).
- [ ] **디더를 톤 레버로** — 색/글자 팔레트가 좁아 그라데이션이 뭉개지면 Bayer(규칙적 레트로) 또는 FS(유기적) 삽입. 양자화 *직전* 단계.
- [ ] **후처리는 1포인트만** — CRT/aberration/bloom/scanline은 *목적 있는 1포인트*로. **남발 = 슬롭**(아래 §한계). 반드시 html-sensory §Motion/Effect Gate 통과.
- [ ] **`willReadFrequently: true`** — 실시간/비디오면 필수. 안 주면 리드백이 느려 프레임 드랍.
- [ ] **license STOP** — ASCII art/FIGfont/원본 이미지 저작권을 라이브러리 license와 혼동 금지(기존 레버 경고 상속).

## 냉정 한계 (힙과 슬롭의 경계)
- **코어 알고리즘은 30년 된 교과서.** 코드에 **Sobel/DoG edge-detection 없음**(검증) → 요즘 "고급 방향성 ASCII"(Acerola류 `/ \ | _` 셰이더)는 *안 씀*. brightness-ramp + dither + halftone일 뿐. 주말 재현 가능 = 진입장벽 낮음 = *구현이 아니라 절제가 차별점*.
- **남발하면 즉시 슬롭이 된다.** CRT+bloom+aberration+grain을 다 켜면 "힙"이 "지저분한 데모"로 추락. 작가 각도("짜치지 않게")의 실행 = **효과 1~2개 목적 배치**. 이건 html-sensory §Motion/Effect Gate·AI-Tell 밴과 정확히 같은 규율.
- **브라우저 CPU 파이프라인** — 고해상도 비디오 실시간엔 부하. 격자 해상도 낮게, 후처리 최소로 예산 관리.

## 관계
- 적용 규율(빌더 참조점): [HTML Sensory 품질 레버 (bespoke용)](../methods/html-sensory-quality-levers.md) §ASCII 레버 + §결정론 후처리 스택 (본 해체로 확장)
- 철학적 쌍둥이: [PerfectPixel Studio — AI 스프라이트 후처리 파이프라인 해체](perfectpixel-studio.md)(AI 스프라이트 결정론 신호처리 — 여긴 AI조차 뺀 극단) · [Handdraw Story Video — 잉크 추출 커널 + 손그림 스토리 비트 문법](handdraw-story-video.md)(비디오 스타일 후보)
- 반영: [학습→반영 루프 (Absorb-to-Apply)](../narrative/학습→반영 루프.md) ①Apply — 후처리 스택·디더를 html-sensory 레버에 외과 편입 완료(2026-07-20)
