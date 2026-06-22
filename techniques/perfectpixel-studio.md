---
created: 2026-06-15
updated: 2026-06-15
type: learning
tags: [pixel-art, sprite, signal-processing, chroma-matting, quantization, ai-orchestration, game-assets, go]
source: https://github.com/gykim80/perfectpixel-studio
authors: [gykim80]
year: 2026
category: technique
---

# PerfectPixel Studio — AI 스프라이트 후처리 파이프라인 해체

> **한줄**: 텍스트 설명 → base character → 8방향·100+ 모션 sprite sheet 를 생성하고, **AI 생성물을 결정론적 신호처리 후처리**(YCbCr 매팅 → projection-profile 분할 → centroid 정렬 → median-cut 양자화)로 게임용으로 다듬는 Go(Wails)/React 데스크톱 앱. 가치 = *후처리 알고리즘이 작가 게임 에셋 파이프라인에 직접 이식 가능*.
> **출처**: research-relay 충실(depth) 외주(GPT, 2026-06-15). ④Gate = vault Claude 가 chroma.go·quantize.go 핵심 상수/수식 **실제 코드 직접 대조 PASS**(환각 0). README 마케팅 주장은 *코드 미검증 = 별도 표기*.

## 후처리 파이프라인 (핵심 — 결정론적, 이식 대상)

AI 가 만든 horizontal filmstrip → 투명 스프라이트 프레임으로 변환하는 5단계. 모두 `internal/sprite/`.

### 1. 배경 제거 / 매팅 — `chroma.go:RemoveBackground(src image.Image) *image.NRGBA`
- **key 탐지**: corner/edge 샘플의 CbCr 히스토그램 mode 로 배경색 추정. magenta 샘플 12%+ 면 magenta cluster 를 key 로 확정.
- **YCbCr 매팅** (luma Y 는 key distance 에서 제외, chroma 거리만):
  ```go
  y  := 0.299*fr + 0.587*fg + 0.114*fb
  cb := (fb-y)*0.564 + 128
  cr := (fr-y)*0.713 + 128
  alpha := smoothstep(chromaIn, chromaOut, dist)   // chroma 거리 기반 alpha ramp
  ```
- **상수** [VERBATIM, 코드 대조 확인]:
  ```go
  chromaIn = 24.0   chromaOut = 72.0
  despillBand = 100.0   despillScale = 0.92   floodTol = 88.0
  ```
- **despill**: key chroma 벡터 방향 projection 만 감쇠.
- **flood fill**: image border 에서 시작, CbCr 거리 `<= floodTol` 인 4-neighbor connected 배경 alpha=0.
- **cleanup**: 고립 opaque pixel 제거 + 1px pinhole fill.
- **fallback** [VERBATIM 확인]: `if frac > 0.60 || magentaResidueFrac(out) > 0.025` → pure magenta `#FF00FF` 로 재매팅.

### 2. 프레임 분할 — `segment.go` (connected-component 아님, **vertical alpha projection profile**)
- projection: `P[x] = Σ_y α(x,y)` → box smoothing → content runs → minor runs drop.
- pose peak/width 로 natural pose split. 융합된 pose 는 `dpNCut` 으로 분리:
  - 비용 = cut column alpha mass + width regularization. `const lambda = 0.0015`, `minW := int(ideal * 0.45)`.
  - peak/eps: `eps := 0.045*mx`, `peakMin := 0.18*mx`, `dropMinorRuns(..., 0.20)`.
- natural pose count 반환 → expected 와 다르면 재생성 warning.

### 3. 프레임 추출/정렬 — `extract.go:ExtractFrames`
- 각 segment bbox crop → **alpha-weighted centroid** `cx = sumWX / sumW`.
- common baseline + common scale(**downscale-only**) → CatmullRom scaling.
- centroid 를 cell center 에 정렬: `left := int(float64(cellW)/2 - (g.cx-float64(g.minX))*scale + 0.5)`.

### 4. 품질 점수 — `score.go:ScoreFrames` (0~100)
- 벌점: frame count mismatch 최대(`-35 - 10*diff`), `-13*errors`, `-3*warnings`, motion<0.01 시 `-12`, IdentityHash<0.55 시 `-10`.
- **dHash**: `9×8` grayscale differential hash, adjacent frame hamming 평균으로 identity 유사도.

### 5. 팔레트 양자화 — `quantize.go`
- `BuildSharedPalette(frames []*image.NRGBA, maxColors int) []rgb`: 전체 frames **shared median-cut** 팔레트(프레임별 X → 플리커 방지).
- 근접색 merge: `const mergeThresh = 600 // 채널당 ≈8`, weighted average 흡수.
- 거리(perceptual 가중) [VERBATIM 확인]: `return 2*dr*dr + 4*dg*dg + 3*db*db`.
- `ApplyPalette`: **dithering 없이** nearest 치환, alpha `<128` 투명 / 그 외 `255`(binary alpha).

## AI 오케스트레이션 아키텍처

- **provider 추상화** (최소 공통면 = generate + validate):
  ```go
  type Provider interface {
      GenerateImage(ctx context.Context, prompt string, refImages [][]byte, aspectRatio string) ([]byte, error)
      ValidateKey(ctx context.Context) error
  }
  ```
  - 구현: Gemini(`gemini-3-pro-image`) · OpenRouter(`google/gemini-3-pro-image-preview`) · fal.ai(`fal-ai/nano-banana-pro`) · BytePlus(`seedream-4-0-250828`).
  - base character 참조 = `refImages [][]byte` 로 주입.
- **self-correcting 루프**: generate → matte → extract → inspect → corrective regenerate, README 기준 **최대 3 pass**. ⚠ app-level retry loop 함수·best-candidate scoring 위치는 **코드 미확인**(README 주장).
- **모션 프리셋**: `PresetInfo{Name, Label, Category, Action, Frames, FPS, Loop, Hint}` slice 가 frontend/backend single source.

## 제품 / UX (구조)
- 워크플로우: description+style → base character → motion preset 선택/custom → optional 8방향 → preview/feedback regen → export.
- export 구조: `sprite-sheet.png` + `.json`(Aseprite 호환) + `manifest.json` + `frames/<state>/` + `gif/` + `apng/`.

## ⚠ 코드 미검증 (README 마케팅 주장 — 사실로 흡수 X)
- "37.5% 비용 절감"(8방향 = 5 생성 + 3 미러) — **미러 mapping 구현 파일 미확인**.
- "100+ motion presets" — `Presets` slice 존재는 확인, 전체 개수 직접 count 미확인.
- figure before/after 수치(2,739→2px, σ 27.2→0.2 등) — README claim 만.
- style option(pixel/chibi/cartoon) 의 실제 타입·prompt 삽입 방식 — 코드 미확인.

## 학습→반영 루프 반영 backlog
- **게임 에셋 파이프라인**: `RemoveBackground`(YCbCr 매팅+despill+flood)·`segmentStrip`(projection profile+DP cut)·`ExtractFrames`(centroid 정렬) = AI 생성 스프라이트 후처리에 *가장 직접 이식 가능*. → [픽셀아트 게임 에셋 제작 심화](pixel-art-game-assets.md) 갱신 시 "AI 생성물 결정론 후처리" 절 보강 후보. 트리거: 게임 에셋 AI 생성 도입 시.
- **shared median-cut + binary alpha + no-dither** = 픽셀아트 룩 유지 양자화 레시피 → [픽셀아트 제작 기법 + 연구](pixel-art-techniques.md) 보강 후보.
- **AI 오케스트레이션**: provider "generate+validate" 최소면 추상화 + "검사결과→correction prompt" pure function 분리 = 작가 다중 AI 운영 범용 패턴(순수 지식, 강제 반영처 없음 — 참고만).
