---
created: 2026-06-08
updated: 2026-06-08
type: learning
tags: [pixel-art, color-ramp, hue-shifting, dithering, anti-aliasing, readability, svg, game-art]
source:
  - https://makegames.tumblr.com/post/42648699708/pixel-art-tutorial
  - https://pinnguaq.com/learn/pixel-art/pixel-art-2-core-techniques-in-graphicsgale/
  - https://saint11.art/blog/glossary/
  - https://www.slynyrd.com/blog/2018/1/10/pixelblog-1-color-palettes
  - https://lospec.com/palette-list
authors: ["Derek Yu", "Pinnguaq", "Pedro Medeiros (saint11)", "SLYNYRD", "Kopf & Lischinski", "Gerstner et al."]
year: 2011
doi: 10.1145/2010324.1964994   # Depixelizing Pixel Art (대표 논문)
category: technique
---

<!-- 픽셀아트 제작 기법 + 연구 정리. GPT 1차 외주(research-relay) → Claude Gate → 흡수. SVG/코드 픽셀아트 생성 관점 중심. -->

# 픽셀아트 제작 기법 + 연구

> **한 줄**: 픽셀아트 "조악함 vs 프로"를 가르는 건 ① 제한 팔레트 + **컬러 램프** ② **hue shifting** ③ 안티에일리어싱 ④ readability(실루엣 우선) ⑤ 일관된 광원. 출처: GPT 1차 외주(research-relay) → Gate 통과 흡수. 자기지식 코어가 아닌 외부 지식 — origin 표기됨.

작가 적용 맥락: 래스터 툴(Aseprite) 없이 **SVG(`<rect>` 격자 + `shape-rendering:crispEdges`)·코드로 픽셀아트 생성**. 빌더 반영은 html-publish GUIDE §13. 관련: [Comnyang 랜딩 Teardown — "무라이브러리 모션" 아키텍처](comnyang-landing-teardown.md)(픽셀 모션·하드섀도우) · [SPD UI Clean-Room — 5개 클래스의 *역할*만](spd-ui-clean-room.md)(픽셀 UI 역할분리) · **libgdx-rogue-os**(픽셀 게임 — actor/enemy 아트 차단 OQ-007/004, 본 학습이 에셋 가이드 기반).

---

## 1. 핵심 기법 (9종)

| 기법 | 핵심 | 실전 규칙 | SVG/코드 적용 |
|---|---|---|---|
| **Color ramp** | 재질별 명도 계단 색 묶음 | 작은 아이콘 = 재질당 **3~5톤**(base + dark 1~2 + light 1~2). 너무 비슷한 색·과한 그라디언트 금지 | `ramp[]` 인덱스 → 셀별 `<rect fill>` |
| **Hue shifting** | ramp에서 명도뿐 아니라 **색상각도 이동** | 그림자=차갑게(보라/남색), 하이라이트=따뜻하게(노랑). SLYNYRD 사례 +20°/swatch(강한 상한, 표준 아님). saturation은 중간톤서 peak | HSL ramp 생성기 `h+=8~20°`, `l+=`, `s=curve(i)` → HEX |
| **Anti-aliasing** | 경계에 중간색 1px로 계단 완화 | 곡선 kink에 중간색. **투명/가변 배경 아이콘은 외곽 AA 금지**(halo) — 내부 경계만 | 내부 edge 계단에만 ramp 중간색 rect |
| **Dithering** | 두 색 패턴 섞어 중간색·질감 | 2×2 checker=50%, 4×4 Bayer=16단계. **과하면 노이즈** — 면적 충분한 그림자에만 | `(x+y)%2`/Bayer matrix → 두 ramp색 선택 |
| **Readability/실루엣** | 작은 크기서 외곽 형태·큰 명암이 먼저 읽힘 | 순서: ①단색 silhouette →②outline →③큰 shadow/highlight →④내부 디테일 | binary mask 먼저 → 외곽 outline → 내부 |
| **Sub-pixel anim** | 좌표 이동 없이 색·edge 변화로 미세 움직임 | silhouette 이동 최소, edge/shadow 색 전환으로 호흡 | 정지 아이콘엔 낮음. `<animate fill>` |
| **Clustering/orphan** | 의도 없는 1×1 고립 픽셀 제거 | orphan = 단독 1px. AA/하이라이트/particle 아니면 2px+ cluster로 병합 | connected-component, size=1 비-whitelist 병합 |
| **Selout(선택 외곽선)** | outline을 조명·주변색에 맞춤 | light-facing edge=1 step 밝게, shadow edge=어둡게. **배경 불특정이면 contrast 우선**(어두운 outline 유지) | outline normal·`dot(normal,light)` |
| **Light consistency** | 가상 광원 1개 고정, 반대면 음영 | 기본 **upper-left**. 하이라이트는 직접광만. **pillow shading(중심부만 밝게) 금지** | `lightDir=(-1,-1)` 고정, top-left=highlight ramp |

**Banding 회피**(추가): 비슷한 명도 1px 평행 반복이 의도치 않은 띠를 만듦 → 같은 계단 여러 ramp에 겹치지 말 것.

---

## 2. 색·팔레트

- **램프**: 아이콘 재질당 3~5톤 = base + dark 1~2 + light 1~2.
- **hue shift 예시**(SLYNYRD): 9 swatch/ramp, +20°/swatch, 밝을수록 brightness↑, saturation 중간 peak. *표준 아님 — 작가 workflow 사례*. 작은 아이콘은 1~2 step 차이 우선, +8~20° 시작.
- **팔레트 고르기**: 색 보존(비슷한 색 합침). 배경 다양한 카드 아이콘은 *공통 outline색 1 + 공통 highlight색 1 + material ramp 1~2* 우선. 전체 8~15색.
- **검증 팔레트 seed**: [PICO-8](https://lospec.com/palette-list/pico-8)(16색), [Endesga 32](https://lospec.com/palette-list/endesga-32)/[64](https://lospec.com/palette-list/endesga-64), [Lospec Palette List](https://lospec.com/palette-list)(HEX/ASE/GPL 다운로드).

---

## 3. 연구·논문 (참고 — 생성·변환·업스케일)

| 논문 | 저자/연도 | 핵심 | 작가 적용성 |
|---|---|---|---|
| **Depixelizing Pixel Art** (DOI 10.1145/2010324.1964994) | Kopf & Lischinski 2011 | 픽셀아트→해상도 독립 벡터(대각 ambiguity 해소, spline contour) | rect 아이콘→부드러운 SVG path 변환 시. *crisp 보존엔 rect 유지가 나음* |
| **Pixelated Image Abstraction** | Gerstner et al. 2012 (DOI 미확인) | 이미지→저해상 픽셀+축소 팔레트 자동 추상화 | 사진·원화를 아이콘 seed로 줄이는 전처리 |
| **Deep Unsupervised Pixelization** (DOI 10.1145/3272127.3275082) | Han et al. 2018 | unpaired, GridNet/PixelNet/DepixelNet | 이미지→픽셀아트 ML. "aliasing-aware" 아이디어 |
| **Make Your Own Sprites** (DOI 10.1145/3550454.3555482) | Wu et al. 2022 | aliasing-aware + cell-controllable pixelization | 규칙적 cell grid 변환 품질 기준 |
| **SD-πXL** (arXiv:2410.06236) | Binninger & Sorkine-Hornung 2024 | prompt/image + H×W + palette n → quantized pixel art (score distillation) | text/image→팔레트 제한 아이콘 생성(오프라인 단계로 분리) |
| GAN sprite 2종 (arXiv:2208.06413 / AIIDE 2022) | Coutinho & Chaimowicz 2022 | Pix2Pix sprite 생성 + palette/histogram loss 한계 | 캐릭터 방향 전환용. *정적 아이콘 우선순위 낮음* |

*Voxify3D(arXiv:2512.07834)는 3D→voxel — 순수 2D 아이콘엔 간접.*

---

## 4. "조악함 → 개선" 체크리스트 (16×16 아이콘 기준)

1. 캔버스·색 수 고정 — 전체 8~15색, 재질 ramp 3~5톤
2. **단색 silhouette 먼저** → outline → 큰 명암 → 디테일
3. 광원 벡터 1개 고정(기본 upper-left): top-left=highlight, bottom-right=shadow
4. straight ramp 피하고 **hue shift**(작은 아이콘은 1~2 step 우선)
5. 비슷한 색 합치기(outline/shadow/highlight 공통색 재사용)
6. **orphan 1px 제거**(AA/하이라이트 의도 아니면)
7. AA는 내부 경계 곡선 kink에만(투명 배경 외곽 AA 금지 — halo)
8. selout — 밝은 edge outline 1 step 밝게(배경 분리 우선이면 어두운 outline 유지)
9. dithering은 면적 충분한 그림자에만(16px서 과하면 노이즈)
10. **SVG 출력 = integer `<rect>` + `shape-rendering="crispEdges"`**, raster는 CSS `image-rendering: pixelated`

---

## 5. 빌더 적용 (§13 — Sub-brain SVG 아이콘에)

현재 데모 아이콘(`raw/assets/images/_pixel-demo/*.svg`)이 조악한 원인 = **ramp 빈약(2~3톤, hue shift 0) + 광원 불일치 + AA/selout 0**. 적용 순서:
1. **팔레트 모듈** — 재질별 5톤 ramp(hue shift 포함)를 상수로. 청록 보석 예: `#163a5c→#1f7a8c→#3fd4c0→#a8f0dc→#d0f8ec`(어두울수록 남색, 밝을수록 연두).
2. **광원 upper-left 일관** — 모든 아이콘 top-left 밝게, bottom-right 어둡게.
3. **selout** — outline을 darkest ramp색으로(검정 X), 광원면은 1 step 밝게.
4. (선택) 코드 lint — orphan(size=1)·banding(1px 3셀+ 평행) 경고. → 향후 `wiki-graph-lint` 류 패턴.

→ 정본 레지스트리: html-publish GUIDE §13에 "픽셀아트 기법 → SVG 아이콘 ramp/광원/selout" 등재.

---

## 6. 추가 학습 후보 (GPT 1차 미커버 — 2차 research-relay 토픽)

✅ **2차 흡수 완료(2026-06-09)**: 1~5 + 디더링 심화 → [픽셀아트 게임 에셋 제작 심화](pixel-art-game-assets.md) (research-relay 2차). 아래는 원래 후보 목록(이력):

1차는 *개요·기법·논문 인덱스* 수준. 게임 에셋 제작까지 가려면 아래가 빠졌다 — research-relay 2차 라운드 후보:

1. **픽셀 애니메이션** — frame timing, walk/idle/attack cycle, smear frame, pixel squash&stretch. (1차는 sub-pixel만 다룸. 게임 *액터* 핵심.)
2. **타일셋·오토타일** — 47-blob/Wang tiles, seamless, 던전 맵 타일링. (libgdx-rogue-os 맵용.)
3. **2D 라이팅·노멀맵 픽셀** — dynamic light, normal map sprite, ambient occlusion. (게임 분위기.)
4. **픽셀 폰트·UI** — bitmap font, 가독 픽셀 HUD. → [SPD UI Clean-Room — 5개 클래스의 *역할*만](spd-ui-clean-room.md) 연결.
5. **AI 생성 픽셀 실전 워크플로우** — SD-πXL/ControlNet/Retro Diffusion 등으로 *게임 에셋 대량* 생성 + 후보정. (1차는 논문 메타만. 실전 파이프라인 필요.)
6. **디더링 패턴 + 색 심화** — Bayer/blue-noise 패턴 라이브러리, 팔레트 조화·색조 이론.

## 7. 반영 백로그 (vault·빌더·게임)

| 대상 | 액션 | 상태 |
|---|---|---|
| **공용화 (토대)** | pixel-art-production-spec 신설 — 팔레트 5톤 ramp·광원·lint 를 *환경 독립 SSOT* 로. html(SVG/Python)+게임(libgdx/Java) 공유 | ✅ 2026-06-09 |
| **게임** | libgdx-rogue-os-art-guide 신설 — 스펙→actor/enemy/tile/UI, clean-room 결합, Codex 핸드오프. *실 에셋·decision 은 작가/Codex* | 🟡 가이드 완료, OQ-007/004 차단 대기 |
| html 빌더 | 데모 SVG 가 스펙 팔레트 준수(html-publish GUIDE §13). ramp 헬퍼·lint 코드 = SVG 자동생성 도입 시(현재 수작업이라 보류) | 🟡 표준 등재 |
| 아이콘 | 해상도 옵션(16→24/32), 작가 정체성 6영역 모티프 확장 | 🟡 후보 |
| 논문 심화 | Depixelizing / SD-πXL 1~2편 paper-study 깊이 학습 | 🟡 후보 |

---

## 출처·신뢰도

**확실**(1차 출처): SVG `<rect>`/`shape-rendering`/`image-rendering`(MDN 공식), 논문 6편(프로젝트·arXiv·DOI 페이지), AA·dither·selout·banding 정의(Derek Yu·Pinnguaq·saint11).
**불확실**(GPT §7 정직 표기): hue shift 표준각도(없음 — +20°는 SLYNYRD 사례), orphan 자동제거 휴리스틱(코드 생성용), Pixelated Image Abstraction DOI(미확인), Voxify3D 최종 proceedings.

전체 출처: 본 노트 frontmatter `source` + GPT RETURN §6(30개 URL). 리서치 경로: research-relay 첫 인스턴스.
