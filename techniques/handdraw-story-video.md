---
created: 2026-07-19
updated: 2026-07-19
type: learning
tags: [hyperframes, gsap, lineart, cv2, video-production, frame-md, hand-drawn, mask-reveal]
source: https://github.com/xiejunjie524/handdraw-story-video
category: technique
---
<!-- 손그림 컬러 원화 → 선(線) wipe·채색 wipe 세로 영상 레시피: 잉크 추출 커널 + GSAP 비트 문법 알맹이 흡수 -->

# Handdraw Story Video — 잉크 추출 커널 + 손그림 스토리 비트 문법

> 출처: `xiejunjie524/handdraw-story-video` (MIT). **프레임워크가 아니라 [Hyperframes — HTML→Video 결정론적 렌더링 프레임워크](hyperframes.md) 위에 얹힌 단일 장르 레시피** — 렌더러는 `npx hyperframes render` 그대로 소비. 이 페이지는 그 repo에서 *vault에 없던 알맹이 2종*(잉크 추출 커널 A + 손그림 비트 문법 B)만 해체·번역 흡수한 것. 통짜 클론·설치 X (외부도구=해체흡수 규율).

관련 — [Hyperframes — HTML→Video 결정론적 렌더링 프레임워크](hyperframes.md) (렌더 백엔드·본체) · [Hyperframes Skill 패턴 — 5-step 강제 워크플로우 + Hard Gate](../methods/hyperframes-skill-pattern.md) (5-step/Hard Gate) · [광고·영상 제작 파이프라인 (실전)](ad-video-production-pipeline.md) (실제 영상 제작 파이프라인, 본 레시피의 반영처) · [PerfectPixel Studio — AI × 결정론적 후처리 스프라이트 파이프라인](perfectpixel-sprite-pipeline.md) (AI×결정론 후처리 계열)

**흡수 판정 (파악→세팅, 작가 지시 2026-07-19)**: 옵션 B 확정 — 잉크 커널 + 비트 문법을 한 레시피로. frame.md 정식 통합(옵션 C)은 제외 — 실제 "손그림 스토리 영상" 제작 니즈가 설 때 [Hyperframes — HTML→Video 결정론적 렌더링 프레임워크](hyperframes.md) §2.5 계보로 승격.

---

## 1. 정체 — 무엇을 만드는가

손그림 컬러 원화 **7~9장 → 세로 영상**(720×960, 30fps, 35~45초). 씬마다 **선화가 왼→오로 wipe되며 드러난 뒤, 같은 경로로 채색이 채워진다.** 숏폼(세로) 서사 영상용.

- 자체 렌더링 0 — HTML+GSAP 타임라인을 생성해 hyperframes에 넘김.
- LLM 0 — `story.json`은 사람이 손으로 채움(원화 생성은 외부 이미지 모델 위임).
- 파이프라인:

```
컬러 원화 8장 ──make_lineart.py──▶ 선화 8장(정렬됨)
        └──────────┬──────────────┘
                   ▼
             story.json (씬별 duration/caption/crop)
                   ▼
   build_story.py story.json out/index.html --check-assets   ← 두뇌
                   ▼
        hyperframes/index.html (GSAP 타임라인 박제)
                   ▼
   npx hyperframes render ... --output story.mp4
```

---

## 2. 알맹이 A — 잉크(선) 추출 커널 `make_lineart.py`

**엣지 디텍션이 아니다.** "어둡고 + 무채색"인 픽셀 = 펜선이라는 **색기반 필터**. cv2 + numpy만 사용. 컬러 원화에서 채색을 죽이고 선만 남겨, 뒤이은 2겹 마스크(선 wipe / 채색 wipe)의 전제 이미지를 만든다.

```python
import cv2, numpy as np

def extract_lineart(bgr):
    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY).astype(np.float32)
    hsv  = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV).astype(np.float32)
    sat  = hsv[..., 1]

    # 어둠 × 무채색 = 잉크 강도. 채색연필(유채색·중간톤) 억제, 펜선만 살림
    darkness   = np.clip((218.0 - gray) / 185.0, 0.0, 1.0)
    neutrality = 1.0 - np.clip((sat - 22.0) / 92.0, 0.0, 1.0)
    ink = darkness * (neutrality ** 1.35)

    # 극흑 boost(JPEG 아티팩트 대응) → 감마 → 미세 블러
    ink = np.where(gray < 40, ink * 0.92 + 0.08, ink)   # (극흑 구간 보정 개념)
    ink = np.power(ink, 0.72)                            # 감마
    ink = cv2.GaussianBlur(ink, (0, 0), 0.28)           # σ=0.28 미세 스무딩

    # 종이 질감 한 톤 남기고 선은 선명하게(흰 종이 위 잉크 합성)
    paper = 252.0
    out = paper - ink * (paper - 20.0)                  # 잉크=진한 회흑, 배경=종이
    return np.clip(out, 0, 255).astype(np.uint8)
```

**튜닝 상수 (원 저자 그림체 기준 — 재조정 대상)**: 회색 임계 218/185, 채도 임계 22/92, 감마 0.72, 블러 σ 0.28, 종이색 252.
> ⚠️ 이 상수들은 *원 저자 원화 스타일에 과적합*됐을 가능성이 큼. 작가님 그림체(선 굵기·채색 톤·스캔 대비)에 맞춰 재캘리브레이션 필요. 특히 채도 임계(22)는 연한 색연필을 얼마나 죽일지 결정 — 작가 원화가 파스텔이면 상향.

**왜 값어치 있나**: vault 어디에도 없던 "컬러 원화에서 선만 뽑는" 구체 커널. Canny/Sobel 엣지가 아니라 *잉크의 물리 특성(어둠·무채색)*을 직접 겨냥 → 채색 영역을 선으로 오검출하지 않음.

---

## 3. 알맹이 B — 손그림 스토리 "비트 문법" `build_story.py`

`story.json`(서사) → GSAP 타임라인(연출)로 변환. **핵심 IP = 씬 하나의 모션 시퀀스가 이 순서·타이밍으로 고정**됐다는 점. hyperframes의 "layout → entrance 모션" 룰을, *손그림 스토리 한 장르*에 특화한 완성형 scene blueprint.

### 3.1 씬 타임라인 (씬 시작 기준 오프셋)

| 요소 | 모션 | 시작 | 지속 | easing |
|---|---|---|---|---|
| 씬 컨테이너 | fade in (opacity 0→1) | +0.04s | 0.16s | — |
| 일러스트 | pan (수평 ±0.4 units) | +0.08s | 씬 전체 | — |
| 캡션(≤3 span) | stagger fade + x −8px / rot −1° | +0.16s | 0.20s stagger | — |
| **선 마스크** | scale-X wipe | +0.55s | **1.25s** | power1.inOut |
| **채색 마스크** | scale-X wipe | +2.15s | **2.15s** | linear |
| 소품 텍스트(옵션) | fade in | show-at(기본 1.5s) | 0.22s | — |
| 씬 fade out | opacity→0 | 끝 −0.22s | 0.20s | — |
| **종이 flash**(씬 전환) | blink 42% opacity | 전환 −0.16s | 0.09s (1회) | — |
| BGM | fade in 0→target 0.8s / 끝 1.2s fade out | — | — | — |

**설계 원리 3선**:
- **2겹 마스크 reveal** — opacity fade가 아니라 SVG 마스크의 `scaleX` 변형으로 "그려지는" 느낌. 선(1.25s power1.inOut)이 먼저, 채색(2.15s linear)이 뒤따라 같은 방향. → 손으로 그리는 시늉의 핵심.
- **씬 독립** — 각 씬 애니는 자기 섹션에 격리(모듈 조립 가능). hyperframes sub-comp 격리와 정합.
- **종이 flash 트랜지션** — 씬 사이 42% 흰 blink 1회 = 종이 넘김 은유. jump cut 금지(hyperframes 멀티씬 룰) 준수하는 저비용 트랜지션.

### 3.2 하드게이트(검증 로직) — 한국어 적응 번역

원 repo가 `build_story.py`에서 강제하는 제약 + **한국어 캡션 번역·적응**:

| 항목 | 원값(중국어 기준) | 한국어 적응 |
|---|---|---|
| 씬 수 | 7~9 비트 | 그대로 |
| 총 길이 | 35~45초, 씬 합 ±0.01s | 그대로 |
| 해상도/fps | 720×960 / 30fps | 그대로(세로 숏폼) |
| 캡션 | ≤3줄, 줄당 **≤18 한자** | **≤18 한글 음절**(한글=전각, 한자와 동일 폭 → 18 그대로 유효). 로마자 혼용 시 ~36자까지 |
| 캡션 폰트 | 24~34pt, serif(KaiTi류) | 24~34pt, **한글 명조/바탕**(본명조·나눔명조 등) |
| 소품 텍스트 | 1~3줄, 5~13pt | 그대로 |
| 이미지 | line/color 중복 금지, `--check-assets`로 존재 검증 | 그대로 |

> 캡션 폭 근거: 620px 캡션 박스 / 30pt 전각 글자 ≈ 18~20자. 한글 음절은 한자처럼 전각이라 **18자 캡이 그대로 이식**됨(작가 지시 "번역해" 반영). 폰트만 한자 서체 → 한글 명조 계열로 교체.

---

## 4. 기존 vault 자산과의 delta (흡수 4대 규율 ②)

| 항목 | vault 보유 | 이 repo delta |
|---|---|---|
| HTML→video 결정론 렌더 | ✅ [Hyperframes — HTML→Video 결정론적 렌더링 프레임워크](hyperframes.md) | 0 (그대로 씀) |
| frame.md / "produced not generated" | ✅ [Hyperframes — HTML→Video 결정론적 렌더링 프레임워크](hyperframes.md) §2.5 | 0 (개념 기보유) |
| 5-step / Hard Gate | ✅ [Hyperframes Skill 패턴 — 5-step 강제 워크플로우 + Hard Gate](../methods/hyperframes-skill-pattern.md) | 0 (장르 인스턴스) |
| 광고·영상 파이프라인 | ✅ [광고·영상 제작 파이프라인 (실전)](ad-video-production-pipeline.md) | 인접(다른 장르) |
| **선화 추출 커널** | ❌ | 🟢 신규 (§2) |
| **선 wipe→채색 wipe 비트 문법** | ❌ | 🟢 신규 (§3) |

**순 흡수 = §2 + §3 두 알맹이.** 나머지는 vault가 상위 레벨로 이미 보유.

## 5. 한계·비판 (흡수 4대 규율 ①)

- **입증 0** — solo repo, 스타·이슈·실사용 지표 미확인, golden 샘플 영상 품질 미검증. 값어치는 *코드 로직*으로만 판단, *결과물*로는 미판단.
- **단일 장르·단일 종횡비** — 720×960 세로 박제. 가로·정사각엔 비트 문법 재설계 필요.
- **상수 과적합** — §2 커널 상수는 원 저자 그림체 종속(재캘리브레이션 전제).
- **GSAP 라이선스** — 코드는 MIT지만 GSAP 3 npm 종속(상업 사용 시 약관 확인).
- **LLM 부재** — 서사(`story.json`)와 원화는 사람/외부모델. 이 repo는 *빌드 접착제*일 뿐.

## 6. 시너지 가지 (흡수 4대 규율 ③) — 반영처

- **[광고·영상 제작 파이프라인 (실전)](ad-video-production-pipeline.md)** ← 손그림 내러티브가 광고 영상 장르로 필요할 때 §3 비트 문법을 scene blueprint로 차용.
- **[Hyperframes — HTML→Video 결정론적 렌더링 프레임워크](hyperframes.md) §2.5 frame.md** ← 실제 제작 니즈 서면, §3을 "손그림 스토리 frame.md" 1종으로 승격(옵션 C, 현재 보류).
- **[PerfectPixel Studio — AI × 결정론적 후처리 스프라이트 파이프라인](perfectpixel-sprite-pipeline.md)** ← §2 잉크 커널은 "AI 원화 → 결정론 신호처리 후처리" 계열과 동형(cv2 기반 마스크 추출). 스프라이트 아웃라인 추출에 상수만 바꿔 재사용 가능.
- **선행 지향 (규율 ④)**: vault의 hyperframes 해체(§1~9)가 이미 이 repo보다 상위 추상 — 이 repo는 그 추상의 *한 구현 사례*를 역으로 채워준 것. vault가 앞서 있음.

---

## 7. 출처

- [GitHub — xiejunjie524/handdraw-story-video](https://github.com/xiejunjie524/handdraw-story-video) (MIT)
- `README.md`, `scripts/make_lineart.py`, `scripts/build_story.py`, `docs/story-spec.md`, `templates/story-template.json`
- 코드 상수·타이밍은 원문 로직 재구성(WebFetch 정제) — 실제 이식 시 원 소스 직접 대조 권장(§2 커널 극흑 boost 라인은 개념 재구성).
