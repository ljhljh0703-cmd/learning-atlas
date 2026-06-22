---
created: 2026-06-17
updated: 2026-06-17
type: learning
tags: [design-system, template, tokens, frontend, composer, method]
source: https://github.com/VoltAgent/awesome-design-md
category: method
---

# DESIGN.md 컴포저 — 레버 조립 템플릿

> **원칙**: 한 브랜드 톤을 *박제하지 않는다*. [awesome-design-md — 브랜드별 DESIGN.md 69종 레퍼런스 컬렉션](awesome-design-md.md) 72종은 *부품 창고*. 매 작업마다 아래 레버를 돌려 필요한 값을 꺼내 조립한다. 스키마·레버 = 고정(권위), 값 = 유동(authority-with-flexibility).
> 포맷 정본은 [DESIGN.md — 코딩 에이전트용 디자인 시스템 명세](design-md.md) (YAML 토큰 + 산문 8섹션). 본 노트는 그 위의 *조립 레이어*.

---

## 한 줄 요약

> 디자인 결정을 7개 레버로 분해 → 각 레버에서 "어느 브랜드의 접근"을 꺼낼지 고름 → 빈 DESIGN.md 스켈레톤에 채움 → `lint` → `export css-tailwind` 로 `_tokens.css` 파생. 매번 다른 조합 가능.

---

## 7개 레버 (디자인 결정 = 노브 돌리기)

각 레버는 *상호 독립*. 자유롭게 섞는다 (예: Linear 의 다크 사다리 + Notion 의 파스텔 카드 + WIRED 의 각진 0px = 새 조합).

### L1. Surface mode (캔버스 명도 전략)
| 옵션 | 본보기 | 값 단서 |
|---|---|---|
| Light-dominant (순백) | Apple · WIRED · Stripe · Vercel · Coinbase · Tesla · BMW · Nike · Renault · Wise | canvas `#fff` + off-white(`#f5f5f7`) 1~2단 |
| **Warm cream (비-순백)** | Mastercard(`#F3F0EE` putty) · Starbucks(`#f2f0eb`) · BMW(cream-tint) | 흰색 대신 "연차보고서 종이" 느낌 — 온기 |
| Dark-dominant | Linear(`#010102`) · Spotify(`#121212`) · Ferrari(`#181818`) · Binance · Kraken(`#101114`) · Lamborghini(`#000`/`#202020`) · Revolut · SpaceX(`#000`) | 근흑, **순흑 회피**(단 자동차/aero 럭셔리는 의도적 `#000` 사용 — Bugatti·Lambo·SpaceX) |
| Alternating chapters | Apple(타일) · PlayStation(흑/백/블루 3챕터) · NVIDIA(흑 히어로/백 본문) | 색 변화가 곧 섹션 구분선 |

### L2. Color strategy (액센트 수)
| 옵션 | 본보기 | 규율 |
|---|---|---|
| 단일 액센트 | Apple(#0066cc)·Linear(#5e6ad2)·Ferrari(#da291c)·Spotify(#1ed760)·Tesla(#3E6AE1)·BMW(#1c69d4)·Coinbase(#0052ff)·Kraken(#7132f5)·NVIDIA(#76b900)·Starbucks(#00754A)·Binance(#fcd535)·Lamborghini(#FFC000 골드)·Renault(#ffed00) | 인터랙션 전부를 한 색에. 압도적 다수 = 고급 신호 |
| 흑백 듀엣 (액센트 0) | WIRED · Bugatti(흑캔버스+백대문자) | 유채색은 인라인 링크만 |
| 검정 본문 + 시그널 1색 | Nike(#111 + 핑크 캠페인)·Mastercard(흑 CTA + 시그널 오렌지, consent 한정) | CTA는 검정, 액센트는 강조 순간에만 |
| 듀엣 + 그라데이션 | Vercel(cyan→magenta→amber)·Stripe(상단 메시)·PlayStation(골드 그라데) | 본체 무채색, 히어로에만 |
| 넓은 채도 팔레트 (의도적 다색) | Notion(파스텔 6종)·Revolut(코발트바이올렛+포화 제품색 다수)·Wise(green+orange+cyan)·Nike(pink/purple/teal) | *명확한 근거*(제품 다양성·캠페인)일 때만 |

### L3. Geometry (모서리 = 톤 가름)
| 옵션 | 본보기 | 값 |
|---|---|---|
| 각진 사각 (각짐·강철·진중) | WIRED · Lamborghini(0px, 각진 사각 비타협) | `rounded.none` 0px 전역 |
| 소프트 사각 | Notion(8/12px)·Linear(8/12px)·Kraken(12px) | pill 아님 |
| Pill (촉각적·앱스러움) | Apple · Spotify · Stripe · Starbucks(50px 풀pill 보편) · Coinbase(100px) | 버튼·검색 `9999px` |
| **초대형 라운드 (전부 둥글게)** | Mastercard(40/99/1000px — 스타디움·pill·원형)·Renault(46px)·Wise(24px)·Nike(18~30px) | 날카로운 모서리 = 서드파티 쿠키배너뿐 |

### L4. Display tracking (디스플레이 자간)
| 옵션 | 본보기 | 값 |
|---|---|---|
| 공격적 음수 | Linear(-3.0)·Revolut(-2.72)·Vercel(-2.4)·Coinbase(-2)·Mastercard(-2%) | "고급 산스" 거의 보편 신호 |
| 완만 음수 | Apple(-0.28~-0.37)·Stripe(-0.96)·Notion(-2~-0.5)·Binance(-1)·Starbucks(-0.16)·PlayStation(-0.1) | |
| **넓은 양수 + 대문자 (각·격식)** | Bugatti(+4px UPPER)·SpaceX(+1.6px)·Ferrari 버튼(+1.4)·Lamborghini(UPPER) | aero/럭셔리/모터스포츠 격식 신호 |
| 중립 | WIRED 본문·Tesla·BMW·Renault·NVIDIA(0) | 세리프/엔지니어드 산스는 자간 없이 비례로 |

### L5. Type pairing (글꼴 역할)
| 옵션 | 본보기 | 구성 |
|---|---|---|
| 세리프+세리프+산스 (잡지) | WIRED | 디스플레이 세리프 / 본문 세리프 / 라벨 산스 |
| 단일 산스 | Apple·Notion·Spotify·Ferrari·Tesla·BMW·Coinbase 대다수 | 한 가족, 웨이트로만 위계 |
| 산스 + 모노 | Vercel · Linear | 기술 라벨·코드에 모노 |
| **컨텍스트별 글꼴 전환** | Starbucks(본문 SoDoSans + Rewards 세리프 + Careers 손글씨 — 3컨텍스트) | 페이지 성격별로 글꼴 교체, *규율 있게* |
| **초중량 디스플레이** | Wise(weight 900 @64px)·Lamborghini(120px UPPER)·Nike(타워형 Futura 대문자) | 헤드라인이 "강철로 찍은" 무게 |
| 희귀 중간 웨이트 | Mastercard(본문 450·헤드 500)·Apple(300 에어리) | 400보다 부드럽게 |
| 본문 17px | Apple | 16px 관행 깨고 "읽는 속도" |

### L6. Depth (위계 만드는 법)
| 옵션 | 본보기 | 기법 |
|---|---|---|
| 헤어라인만 | WIRED | 1px 선, 그림자 0 |
| 위스퍼 그림자 | Kraken(`rgba(0,0,0,.03)`)·Starbucks(0.14/0.24)·Mastercard | 거의 안 보이는 lift |
| 제품 사진에만 그림자 1종 | Apple | `rgba(0,0,0,.22) 3px 5px 30px`, UI엔 0 |
| Surface 명도 사다리 | Linear(4단) | 다크에서 그림자 대신 표면 밝기로 lift |
| 소프트 카드 그림자 | Notion(5단계) | 라이트 카드 elevation |
| 무거운 그림자 | Spotify | `rgba(0,0,0,.5) 0 8px 24px` |
| 플로팅 시그니처 | Starbucks(Frap 원형 CTA)·Mastercard(플로팅 pill 내비) | 화면에 떠 있는 1개 강조 요소 |

### L7. Decoration (장식 시스템)
| 옵션 | 본보기 | |
|---|---|---|
| 무장식 | WIRED · Linear | 콘텐츠/스크린샷이 주인공 |
| 메시 그라데이션 | Vercel · Stripe · PlayStation | 유일 장식 |
| 일러스트 | Notion(스티키노트·메시 와이어) | |
| 풀블리드 시네마틱 사진/영상 | Apple · Ferrari · Bugatti · Lamborghini · BMW · Tesla · Nike(캠페인) · SpaceX(로켓 영상) | 자동차/commerce/aero 의 기본값 |
| 원형 크롭·궤도 | Mastercard(원형 인물·트레이스 오렌지 궤도) | 기하 자체가 장식 |

---

## 카테고리 클러스터 (창고 색인 — 같은 업종은 레버가 수렴)

같은 산업은 비슷한 레버를 고르는 경향. 작가 산출물 성격에 맞는 *클러스터부터* 뒤지면 빠르다.

- **자동차/모터스포츠** (7): Ferrari·Bugatti·Lamborghini·BMW·Tesla·Renault — 공통 = 풀블리드 차 사진(L7) + 단일/제로 액센트(L2) + 각짐 or 대문자 격식(L3·L4). 갈림 = Tesla/BMW(라이트·절제) ↔ Lambo/Bugatti(흑캔버스·대문자·각짐).
- **핀테크/크립토** (7): Stripe·Coinbase·Binance·Kraken·Revolut·Wise·Mastercard — 공통 = 신뢰형 단일 블루/퍼플 액센트 + tabular 숫자 타이포. 갈림 = Stripe/Coinbase(라이트·그라데) ↔ Binance/Kraken(다크) ↔ Mastercard(크림·초대형 라운드) ↔ Revolut/Wise(넓은 팔레트).
- **AI/개발자도구**: Claude·Linear·Vercel·Cursor·Warp 등 — 다크 캔버스 + 모노 + 공격적 음수 자간 경향.
- **commerce/소비자**: Nike·Apple·Spotify·Starbucks·PlayStation·NVIDIA — 사진/콘텐츠 우선 + 촉각 pill or 풀블리드.

→ 전체 73종/10카테고리 목록은 [awesome-design-md — 브랜드별 DESIGN.md 69종 레퍼런스 컬렉션](awesome-design-md.md). 특정 브랜드 실제 값은 repo `design-md/<brand>/DESIGN.md` 직접 조회.

---

## 빈 DESIGN.md 스켈레톤 (복붙)

```yaml
---
version: alpha
name: <project-name>
description: <레버 7개 선택 결과를 한 문장으로 — 예: "다크 캔버스(L1) + 단일 라벤더 액센트(L2) + 소프트 사각(L3) + 공격적 음수 자간(L4) + 산스+모노(L5) + surface 사다리(L6) + 무장식(L7)">

colors:
  primary: "<accent — L2 선택값>"
  on-primary: "#ffffff"
  ink: "<본문 텍스트>"
  ink-muted: "<2차 텍스트>"
  canvas: "<L1 캔버스>"
  surface-1: "<카드/패널>"
  hairline: "<1px 보더>"
  # semantic (필요 시): success / warning / error

typography:
  # L4·L5 반영. fontFamily 는 substitute 명시(아래 글꼴 대체표)
  display-xl: { fontFamily: <폰트>, fontSize: 80px, fontWeight: 600, lineHeight: 1.05, letterSpacing: <L4> }
  display-lg: { fontFamily: <폰트>, fontSize: 56px, fontWeight: 600, lineHeight: 1.10, letterSpacing: <L4> }
  headline:   { fontFamily: <폰트>, fontSize: 28px, fontWeight: 600, lineHeight: 1.20 }
  body:       { fontFamily: <폰트>, fontSize: 16px, fontWeight: 400, lineHeight: 1.50 }   # Apple식이면 17px
  caption:    { fontFamily: <폰트>, fontSize: 12px, fontWeight: 400, lineHeight: 1.40 }
  button:     { fontFamily: <폰트>, fontSize: 14px, fontWeight: 500, lineHeight: 1.20 }

rounded:
  # L3 선택: none=0 / soft=8~12 / pill=9999
  none: 0px
  md: 8px
  lg: 12px
  full: 9999px

spacing:    # 4px 또는 8px base 사다리
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  section: 80px

components:
  button-primary: { backgroundColor: "{colors.primary}", textColor: "{colors.on-primary}", typography: "{typography.button}", rounded: "{rounded.md}", padding: "10px 18px" }
  card:           { backgroundColor: "{colors.surface-1}", rounded: "{rounded.lg}", padding: "{spacing.lg}", border: "1px solid {colors.hairline}" }
  text-input:     { backgroundColor: "{colors.canvas}", textColor: "{colors.ink}", rounded: "{rounded.md}", border: "1px solid {colors.hairline}" }
---

## Overview
<L1·L2·L7 을 산문으로 — 분위기와 "왜">

## Colors
<각 색의 role + 왜 이 hex>

## Typography
<L4·L5 원칙. serif/sans 역할 경계>

## Layout
<spacing base, grid max-width, 반응형 breakpoint>

## Elevation & Depth
<L6 — 위계를 무엇으로 만드는가>

## Shapes
<L3 — radius 스케일과 용도>

## Components
<button / card / input … 토큰 ref 로만>

## Do's and Don'ts
<레버 선택의 비협상 규율 — 예: "액센트 2개 금지", "pill 금지">
```

> 공식 8섹션 순서: Overview → Colors → Typography → Layout → Elevation & Depth → Shapes → Components → Do's and Don'ts. (VoltAgent 확장: Responsive Behavior · Agent Prompt Guide 추가 가능.)

---

## 글꼴 대체표 (proprietary → open-source)

브랜드 폰트는 대부분 비공개. 꺼내 쓸 때 substitute:
- SF Pro / 커스텀 산스 (Apple·Linear) → **Inter** / Geist Sans (디스플레이 자간 -0.01em 추가)
- WiredDisplay (고대비 세리프) → **Playfair Display** 400
- BreveText (휴머니스트 세리프 본문) → **Lora** / Source Serif Pro
- 모노 (Vercel·Linear) → **Geist Mono** / JetBrains Mono

---

## 조립 5단계

1. **목적 선언** — 무엇에 쓸 산출물인가 (포트폴리오 PDF / 게임 UI / 발표 덱 / 웹). 용도가 레버를 제약한다 (design-fit-not-personality — 인격 라벨 X, 용도로 고름).
2. **레버 7개 돌리기** — L1~L7 각각 옵션 1개 선택. 본보기 브랜드의 *실제 값* 을 [awesome-design-md — 브랜드별 DESIGN.md 69종 레퍼런스 컬렉션](awesome-design-md.md) 창고(또는 repo `design-md/<brand>/DESIGN.md`)에서 꺼냄.
3. **스켈레톤 채움** — 위 YAML + 산문. 토큰 ref(`{colors.primary}`) 로만, 인라인 hex 금지.
4. **검증** — `npx @google/design.md lint DESIGN.md` (9규칙: broken-ref·contrast-ratio(WCAG AA 4.5:1)·orphaned-tokens·missing-sections 등).
5. **파생** — `export --format css-tailwind` → Tailwind v4 `@theme{}` → html-publish `_tokens.css` 출발점. `export --format dtcg` → `tokens.json`. **DESIGN.md = SSOT, 파생물 직접 편집 X(재생성)**.

```bash
npx @google/design.md lint DESIGN.md
npx @google/design.md export --format css-tailwind DESIGN.md   # → _tokens.css
npx @google/design.md export --format dtcg DESIGN.md           # → tokens.json
npx @google/design.md diff old.md new.md                       # 토큰 회귀 탐지
```

---

## 반영처 (학습→반영 루프)

- **html-publish** 빌더 `_tokens` / html-publish GUIDE §13 — export 산출물이 출발점
- **ParkDalDesign** 시각 계약 — 레버 선택이 계약과 충돌 안 하는지 대조
- **게임 UI** — proprietary 웹 토큰을 게임 엔진으로 옮길 때 손실 주의 (CSS 원점 한계)

## 연결된 페이지
- [DESIGN.md — 코딩 에이전트용 디자인 시스템 명세](design-md.md) — 포맷·CLI·lint 정본
- [awesome-design-md — 브랜드별 DESIGN.md 69종 레퍼런스 컬렉션](awesome-design-md.md) — 72종 부품 창고 (레버 본보기 출처)
- **슬라이드 변환**: DESIGN.md(웹용)→DESIGN.slides.md(슬라이드용) 매핑표 → [slides-grab](slides-grab.md) §"DESIGN.md → DESIGN.slides.md 전환 패턴" (top-nav→eyebrow strip·hero→cover·CTA→kicker text·pricing→드롭)
- [Brand Tone References (아카이브 — 검증 토큰값)](../techniques/brand-tone-references.md) — 전신(단일톤 선정, superseded). Ferrari/Linear ④Gate 검증 토큰값 아카이브
- html-publish GUIDE — 파생 토큰 소비처
- authority-with-flexibility · design-fit-not-personality — 운용 원칙

## 출처
- 컬렉션: <https://github.com/VoltAgent/awesome-design-md> (MIT)
- 포맷 원점: <https://github.com/google-labs-code/design.md> (Apache-2.0)
