---
created: 2026-06-30
updated: 2026-06-30
type: learning
category: method
tags: [html, design, bespoke, quality-gate, sensory, lever]
source: "YouTube '클로드코드 핵심 디자인 스킬'(잭PD) → Codex html-sensory-techniques 패킷 ③Gate"
authors: [codex]
year: 2026
---
<!-- HTML 감각 품질 레버 — bespoke 제작용 *범용* 품질게이트(ParkDal 무관). 8축 루브릭·모션 게이트·레퍼런스 패킷. 결정 C 정합(번역 X, 레버). Codex html-sensory ③Gate. -->

# HTML Sensory 품질 레버 (bespoke용)

> **프레임**: ParkDal 어댑터가 아닌 **bespoke 제작 품질 레버**(bespoke-html-direction). 아래는 *어떤 HTML에도* 적용되는 범용 검수 도구 — 단일톤 강제 X.

## 8축 품질 루브릭 (1~10) ★ 핵심 레버
초안 직후 1회 + 최종 전 1회 실행. 7점 미만 축은 반드시 개선안. 출력 = 점수표 + top-3 결함 + 묶음 수정안.
- **perspective**: 누구의 문제를 어떤 관점으로 해결하는지 선명한가
- **typography**: 한글 가독성·헤드라인 위계·폰트 일관성
- **color**: 팔레트가 목적과 맞고 과한 단색/그라데이션 의존 없는가
- **hierarchy**: 처음 5초에 중요 정보가 보이는가
- **imagery**: 자산이 실제성/증거/분위기 중 명확한 역할
- **animation**: 모션이 과시 아닌 *이해·리듬*을 돕는가
- **mobile**: 모바일에서 읽기/터치/CTA 자연스러운가
- **invisible_detail**: 메타·링크·대비·spacing·legal/provenance

## 그 외 레버
- **Reference Packet** — premium/감각적 요청인데 레퍼런스·visual thesis 빈약하면 질문(추측 양산 금지).
- **Motion/Effect Selection Gate** — 효과는 *목적·위치 1포인트*("입 떡 한 스푼"), 그라데이션/블러/카드 양산 = reject.
- **Section Polish Loop** — build 후 섹션별 다듬기 필수 단계.
- **한글 폰트 정책** — 가독성 우선(Noto Sans KR 등 안전 스택).

## AI-Tell 밴 리스트 + 기계적 하드락 ★ 열거형 보완
> 출처: TasteSkill(Leonxlnx/taste-skill @ `b177427`) 해체 ③Gate 2026-07-06. 8축 루브릭이 *정성 판단*이면, 아래는 *기계식 lint*(pass/fail). **적용 스코프 = 가시 HTML 카피/레이아웃 한정**(범용 글쓰기 규칙 X).

**AI-Tell 밴**(에이전트 생성 페이지의 조용한 티 — 발견 시 reject):
- section-number eyebrow(섹션 번호 라벨)·hero 버전 라벨·photo-credit 장식 캡션·decoration text strip
- scroll cue(스크롤 유도 화살표)·decorative status dot·locale/time/weather strip·version footer
- 3-equal-card row(균등 3카드 기본 남용)·AI-purple mesh 그라데이션·hand-rolled 장식 SVG(명시 요청 시 예외)
- **div 사각형으로 만든 fake 제품 UI**(실제 이미지/스크린샷으로 대체)·generic 이름·fake-perfect 수치
- 클리셰 카피: "Elevate/Seamless/Unleash/Next-Gen/Revolutionize"

**기계적 하드락**(gate 가능):
- one accent / one radius / one theme (중간 테마 flip 금지)
- hero = 첫 뷰포트 fit · nav = 데스크톱 1줄 & <80px · CTA no-wrap · duplicate CTA intent 0
- **layout-repetition gate**: 8섹션 페이지 ≥4 layout family(지그재그 반복 금지)
- 최종 HTML에 생성 raster text 0

**⚠️ 취향충돌 완충**(TasteSkill §10 — 그대로 박지 말 것):
- `em-dash 금지` = *가시 HTML 카피 lint 한정*, 작가 한/영 글쓰기엔 미적용.
- `serif 금지` → "게으른 serif 회피"로 완화(never serif 아님).
- `lucide 금지`·`dual-mode 강제` = 하드룰 아닌 *프로젝트별 취향*(Codex frontend는 lucide 선호). 
- soft/minimalist/brutalist 모드 = brief가 그 vibe 고를 때만(락 금지 = 메타가드 정합).

**skill 후보**(park, 미빌드): `anti-slop-frontend-gate`(위 lint 체크리스트화 — 단 portfolio-impact-orchestrated pre-ship·html-provenance-gate와 중복 스코프 축소 조건) · `reference-first-bespoke-html-pipeline`(레퍼런스→DOM, [Semantic Style-Gallery Prepass (StyleGallery, arXiv 2603.10354)](../techniques/semantic-style-gallery-prepass.md) 인접).

## bespoke 적용 (학습→반영)
- bespoke-html-direction §툴킷의 "sensory 8축 게이트" 레버 = 본 노트.
- 매 bespoke 산출 초안/최종에 8축 셀프체크 → 프로젝트 고유 비주얼이되 품질 바닥 보장(무질서 방지 = 메타가드 과적용 가드와 정합).
- 8축(정성) + AI-Tell 밴/락(정량 lint) 2겹 = 감각 품질 + 슬롭 차단.

## 연결
bespoke-html-direction · design-taste · design-index · [React Bits → 디자인 효과 primitive 이식법 (clean-room)](react-bits-design-effect-primitives.md)
