---
created: 2026-06-22
updated: 2026-06-22
type: learning
tags: [pixel-art, sprite, signal-processing, game-dev, ai-pipeline, deterministic]
source: https://github.com/gykim80/perfectpixel-studio
authors: [gykim80]
year: 2026
category: technique
---

# PerfectPixel Studio — AI × 결정론적 후처리 스프라이트 파이프라인

> **한 줄 철학**: AI는 비결정론적이다. 하지만 후처리를 결정론적으로 만들면 입력이 불완전해도 출력은 항상 일정 품질로 수렴한다.
> **프로젝트**: `gykim80/perfectpixel-studio` — Go + Wails + React 데스크톱 앱. ⭐ 327.
> **hwigi-tower 적용 가능성**: 직접 사용 가능 (픽셀 게임 에셋 생성 자동화)

---

## A. 핵심 설계 철학 — "신호처리, 휴리스틱이 아니라"

AI 이미지 생성은 본질적으로 비결정론적. 프레임 수가 틀리고, identity drift가 생기고, 배경이 번진다.
PerfectPixel의 해법: **AI는 렌더링만, 품질·일관성·정밀도는 결정론적 후처리가 보장**.

```
[AI 생성] ─── 비결정론적 (흐릿함, 오차 있음)
              ↓
[결정론적 후처리 파이프라인] ─── 신호처리로 보정
              ↓
[게임 엔진 임포트 가능 품질] ─── 항상 일정
```

**AI 하네스 시사점**: 이 패턴은 스프라이트 뿐 아니라 모든 AI 출력에 적용 가능.
`비결정론적 생성 + 결정론적 Gate` = 신뢰할 수 있는 출력. [지식 하네스 레지스트리 — Knowledge Harness Registry](../methods/knowledge-harness-registry.md) §5 활성화 프로토콜의 철학적 근거.

---

## B. 4대 신호처리 기법

### B-1. YCbCr 색차 배경 제거

**문제**: RGB threshold는 같은 마젠타도 밝기에 따라 다르게 인식 → 그늘진 부분 잔류.
**해법**: RGB → YCbCr 변환 후 밝기(Y)는 버리고 색차 성분(Cb, Cr)만 사용.

```
왜 YCbCr인가:
- JPEG 4:2:0 subsampling이 luma(Y)는 보존, chrominance(Cb,Cr)는 압축 → YCbCr이 JPEG noise에 강건
- 배경 키: CbCr histogram의 최빈값(mode) — 평균이 아니라 mode라 gradient·noise에 안흔들림
- corner 우선 샘플링 → 캐릭터가 거의 없는 구역에서 배경색 추정
```

**추가 처리**:
- `soft alpha matting` — Hermite smoothstep으로 edge feathering
- `despill` — key 방향 색 번짐만 제거 (캐릭터 고유색 보존)
- `4-connectivity flood fill` — 내부 고립 배경 픽셀 제거 (캐릭터에 구멍 안 뚫림)
- `self-diagnostic fallback` — opaque·magenta residue 급증 시 순수 `#FF00FF`로 re-matte

**실측**: RGB threshold → 잔여 2,739px + halo 8,164px. YCbCr → 잔여 2px, halo 3,447px.

### B-2. Projection Profile + DP 최적 프레임 분할

**문제**: "6프레임 filmstrip" 요청해도 포즈가 불균등하고 팔이 옆 포즈와 닿음.
Equal split은 캐릭터 몸을 가로지름.

**해법**: OCR의 projection profile 기법 차용.

```python
# 세로 alpha projection: 각 column의 alpha 질량 합산
P[x] = sum(alpha(x, y) for y in all_rows)

# 포즈 사이 gutter = valley → valley 개수 = natural pose count

# 포즈가 붙어 valley 사라지면 → DP로 전역 최적 절단
cost = sum(P[cut]) + λ * (width - ideal)^2  # 최소화
```

**DP vs connected-component**: CC는 두 포즈를 한 blob으로 보지만 DP는 alpha 질량 최소 지점을 찾아 *정확히* expected개로 분리 + 팔다리 최소 절단.

**실측**: equal split → 절단선 8/8이 캐릭터 관통. projection+DP → 관통 0/8.

### B-3. Alpha-Weighted Centroid 정렬

**문제**: bbox 중심 기준 정렬 → 팔을 뻗으면 bbox가 쏠려 torso가 반대로 밀림 → 재생 시 캐릭터 jitter.

**해법**: alpha-weighted centroid(질량 중심)를 cell 중앙에 맞춤.

```
cx = Σ(x · α) / Σα
cy = Σ(y · α) / Σα
```

**왜 안정적인가**: 면적이 큰 torso가 centroid를 지배 → 팔다리 자세와 무관하게 torso 위치 고정.
추가: 공통 scale(CatmullRom interpolation, downscale만) + baseline offset(점프 궤적 보존).

**실측**: bbox 중심 → 질량중심 σ = 27.2px. centroid → σ = 0.2px (135배 안정).

### B-4. 공유 팔레트 양자화 + 픽셀 그리드 스냅

**문제**: AI의 "픽셀아트"는 fake — anti-aliasing·gradient 섞여 색이 수천 가지.
프레임별 양자화는 flicker 유발.

**해법**:
```
1. 전 프레임에서 색 수집 → median-cut으로 shared palette 추출 (프레임별 X)
2. 색 거리: 2Δr² + 4Δg² + 3Δb²  (인간 시각 녹색 민감도 반영)
3. unfake: 동일색 run length의 최빈값으로 실제 픽셀 block 크기 추정
4. grid snap: 공유 grid에서 각 block → dominant color로 채움
5. identity 검사는 양자화 전 원본에 수행 (민감도 보존)
```

**실측**: raw → 색 7,834가지·흐릿한 경계. 처리 후 → 색 12가지·또렷한 도트 격자.

---

## C. Self-Correcting Closed Loop (3회 자동 재시도)

단순 재시도가 아닌 **측정 기반 보정**.

```
생성 → 검사 → 점수화 → 보정 힌트 주입 → 재생성 (최대 3회)
                ↓
          best candidate 보관 (절대 빈손 X)
```

**Best-candidate 채점**:
```
score = Found * 100 - errors * 10
→ 완벽하면 즉시 반환, 아니면 3회 후 best 반환
```

**측정 기반 retry hint 예시**:
> "직전 결과는 7개 포즈로 읽혔지만 정확히 6개가 필요하다. canvas를 6개 균등 column으로 나눠라…"

**AI 하네스 시사점**: 이것이 agent-harness-rsi 의 "Goal-Driven Execution(#4)" 게임 에셋 버전.
검증 기준을 수치로 정의 → 자동 루프 가능.

---

## D. Identity & 품질 채점 공식

```
100점 시작
− (35 + 10 · |Found − Expected|)  : 프레임 수 정확도 (최대 감점)
− 13 · errors − 3 · warnings
− 12  : motion presence < 0.01 (사실상 정지 애니메이션)
− 10  : dHash identity < 0.55 (구조 붕괴)

등급: excellent(≥85) / good(≥70) / fair(≥50) / poor
```

**2축 identity 검증**:
- `64-bin RGB color histogram` intersection similarity — 색상 일관성, batch drift 검출
- `dHash perceptual hash` 9×8 grayscale — 구조 민감·색 불변 (histogram이 못 잡는 silhouette 변화)
- `motion presence` — 프레임이 너무 같으면(사실상 정지) 경고 (임계값 0.01 = 실측 기반)

---

## E. 8방향 세트 37.5% 비용 최적화

```
8방향 중:
- 5방향: AI 직접 생성 (north, south, east, northwest, northeast)
- 3방향: 좌우 대칭 미러 파생 (west ← east, southwest ← southeast, ...)

비용: 5/8 = 62.5% → 37.5% 절감
일관성: 미러된 방향은 origin 방향과 정확히 같은 캐릭터 보장
```

정면(south) 스트립을 다른 방향 생성 시 **motion reference**로 전달 → 포즈 일관성 유지.

---

## F. 내보내기 형식 (게임 엔진 임포트용)

```
<character>/
├── sprite-sheet.png      # 모든 상태 프레임 아틀라스
├── sprite-sheet.json     # Aseprite 호환 JSON (Phaser/Unity/Godot 임포터)
├── manifest.json         # 상태·프레임·FPS·루프 + foot pivot + 프레임별 trim
├── frames/<state>/       # 상태별 개별 프레임 PNG
├── gif/<state>.gif       # 미리보기 GIF
└── apng/<state>.png      # 풀 알파 APNG (GIF의 1-bit 투명도 보완)
```

**foot pivot**: manifest.json에 포함 → 게임 엔진이 캐릭터 발 위치를 기준으로 정렬 가능.

---

## G. 지원 AI 프로바이더

| 프로바이더 | 기본 모델 | 환경변수 |
|-----------|----------|---------|
| Gemini (기본) | `gemini-3-pro-image` | `GEMINI_API_KEY` |
| OpenRouter | `google/gemini-3-pro-image-preview` | `OPENROUTER_API_KEY` |
| fal.ai | `fal-ai/nano-banana-pro` | `FAL_KEY` |
| BytePlus | `seedream-4-0-250828` | `BYTEPLUS_API_KEY` |

---

## H. hwigi-tower 적용 가능성

| 필요 에셋 | PerfectPixel 적용 방식 |
|-----------|----------------------|
| 회귀자 캐릭터 애니메이션 | 텍스트 설명 → 100+ 동작 프리셋 |
| 8방향 이동 스프라이트 | 8방향 세트 자동 생성 (5+3 미러) |
| 픽셀아트 일관성 | 공유 팔레트 + grid snap |
| 게임 엔진 임포트 | Aseprite JSON + manifest.json → Unity/Godot |

**실행 방법**:
```bash
git clone https://github.com/gykim80/perfectpixel-studio.git
cd perfectpixel-studio
cp .env.example .env  # GEMINI_API_KEY 입력
./dev.sh              # Wails 개발 모드 (Go 1.25 + Node 18 필요)
```

---

## I. 학습→반영 루프

**즉시 반영**:
- hwiglija-tower-gdd — §에셋 파이프라인에 PerfectPixel 언급 (스프라이트 자동생성 도구)
- [Aseprite 자동화 — 픽셀아트 에디터의 헤드리스 CLI·Lua 스크립팅 (AI 게임 에셋 파이프라인 표면)](../methods/aseprite-automation.md) — PerfectPixel이 Aseprite JSON 출력 → 연결 링크 추가

**설계 철학 반영** (하네스 설계):
- "AI 비결정론 + 결정론적 Gate = 신뢰 출력" 패턴 → [지식 하네스 레지스트리 — Knowledge Harness Registry](../methods/knowledge-harness-registry.md) §0 개념에 인용 가능

**백로그**:
- hwigi-tower 에셋 생성 시 PerfectPixel 실제 사용 검토 (Go + Wails 환경 설치 후)

---

## 연결

[Aseprite 자동화 — 픽셀아트 에디터의 헤드리스 CLI·Lua 스크립팅 (AI 게임 에셋 파이프라인 표면)](../methods/aseprite-automation.md) · [insane-search 해체 분석 — 포기를 모르는 웹 접근 아키텍처](../methods/insane-search.md) · hwiglija-tower-gdd · [지식 하네스 레지스트리 — Knowledge Harness Registry](../methods/knowledge-harness-registry.md) · agent-harness-rsi
