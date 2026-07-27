---
created: 2026-06-30
updated: 2026-07-20
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
- **ASCII 텍스트 렌더 레버** (포트폴리오 flourish) — 이미지/영상을 ASCII로 변환하는 파이프라인 = `source → grid downsample → cell feature → [dither] → glyph ramp → renderer → export`. **포트폴리오 기본 = 무의존성 `<pre>`**(또는 pre-render); Canvas/WebGL은 영상·3D·색·대형 grid 실필요 시만. 적용 1순위 = 동적 ASCII 캐릭터(예: 커서 추적 고양이)·스크린샷의 짧은 ASCII reveal(full-site terminal은 과잉 → reject). **디더 단계**(양자화 직전 삽입) = 좁은 팔레트에서 그라데이션 뭉갬 방지: **Bayer 4×4**(규칙적 레트로) 또는 **Floyd-Steinberg**(유기적·그레인감). 디더 없는 램프 = 뭉갬, 디더 = 완성도. Canvas 실시간이면 `getImageData({willReadFrequently:true})` 필수. ⚠ **license STOP**: ASCII art/FIGfont/원본 이미지 저작권을 라이브러리 license와 혼동 금지. (출처: ascii-art topic 해체 ③Gate 2026-07-17 + `ascii-magic.com` 해체 2026-07-20 → 디더/후처리 확장. 구현 재현 레시피 = [결정론적 이미지 크래프트 파이프라인 (Canvas 디더 + 후처리)](../techniques/deterministic-image-craft-pipeline.md). 스킬화 `ascii-art-asset-pipeline`=실사용 2회 전 PARK.)
- **결정론 후처리 감각 스택** (레트로 크래프트) — CRT Curvature·Scan Lines·Chromatic Aberration·Bloom·Film Grain·RGB Split·Halftone·Vignette·Color Overlay를 canvas/CSS 레이어로 얹는 레트로 룩. **왜 힙한가**: AI-slop 시대에 결정론 신호처리 미학은 *크래프트감·의도*로 읽혀 비개발자 시선을 끈다(작가 각도 2026-07-20). **⚠ 남발 = 즉시 슬롭**: 반드시 위 §Motion/Effect Selection Gate 종속 — *목적 있는 1~2 포인트("입 떡 한 스푼")*만, 전체 켜기 = reject. AI-Tell 밴의 "과한 그라데이션/블러"와 같은 경계선 위에 있다(힙과 슬롭을 가르는 건 효과가 아니라 *절제*). 재현 레시피 = [결정론적 이미지 크래프트 파이프라인 (Canvas 디더 + 후처리)](../techniques/deterministic-image-craft-pipeline.md).
- **Visual Build Contract** — Reference Packet 확정 *후*, 구현 *전* 중간 실행 명세. `claim_lock`(검증된 주장·placeholder 금지·source_paths) + tokens/typography roles + composition + components(state/responsive) + assets(role/provenance/license/poster/fallback) + motion(budget/reduced-motion/concurrent-media-cap) + responsive viewports + verification(interaction/render/claim_parity). DESIGN.md(장기 시각 언어)의 대체 아님 — *이번 산출물의 실행 계약*. (출처: MotionSites 해체 ③Gate 2026-07-15. 컴파일러 스킬화는 player-trained-army-ai 식 PARK — 실파일럿 2건 전 신설 X.)

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

## 참고 후보 — Hallmark 해체 (외부 스킬, 비권위)
<!-- proposed_by: claude · status: candidate_reference · 2026-07-21 — Hallmark(Together AI/Nutlope, MIT, arXiv 아님/GitHub Nutlope/hallmark) 해체 흡수. 작가 "B" 지시. 규범 재포장(58게이트·pre-emit비평 등)은 vault [HTML Sensory 품질 레버 (bespoke용)](html-sensory-quality-levers.md)·bespoke-html-direction과 중복 → 미반영(delta 0). 아래 3개만 vault에 *없는* 것. 채택 결정 아님·판단 작가. -->
> ⚠️ Hallmark 규범 대부분(slop 게이트·자기비평·custom·study·honest-copy)은 vault가 이미 보유 → 안 가져옴. 아래 3개만 *vault에 없는* 훔칠 것. 고려 재료지 결정 아님. 설치 금지([외부 도구는 설치 말고 해체해 흡수 (Dissect, Don't Install)](dissect-not-install-external-tools.md)) — 메커니즘만.

1. **구조적 다양성을 프로젝트 메모리로 강제** ★ — Hallmark은 `.hallmark/log.json`에 매크로구조·테마·nav·footer를 기록하고 *직전 N개와 다른* 구조를 강제 회전. **vault 안티슬롭은 *한 산출물*의 슬롭은 막지만, "연속 산출물이 서로 다른 *구조*가 되게" 강제하는 메모리-회전은 없음.** "시각 다양성이 아니라 *구조* 다양성"이 진짜 차별점. → bespoke 반복 제작 시 *직전 매크로구조/레이아웃 회피* 규율 검토 가능.
2. **Component-scope ↔ Page-scope 라우팅** — 일상 요청 대부분은 *컴포넌트* 모양인데 페이지 장치(매크로구조·hero·footer)를 들이대면 과함. Hallmark은 스코프 감지 후 컴포넌트엔 8-state 데모 래퍼만 방출. → vault html 레버가 단일 컴포넌트 요청에 과발화하는지 점검 지점.
3. **Pre-flight 스캔 + 캐시** — 기존 프로젝트 토큰·폰트·프레임워크를 *설계 전에* 읽고 file:line 인용으로 보고("건드리기 전 뭘 봤나"=책임선), `.hallmark/preflight.json` 캐시. → "기존 시스템 채택" 규율의 형식화 후보.

⚠ 이식 주의: 21 매크로+20 테마+58 게이트 = 표면 과대(단순 요청엔 과잉). vault는 규범이 아니라 위 *메커니즘 3종*만 취함. 적용 여부·범위는 작가 판단. (출처: github.com/Nutlope/hallmark 해체 2026-07-21.)

## 연결
bespoke-html-direction · design-taste · design-index · [React Bits → 디자인 효과 primitive 이식법 (clean-room)](react-bits-design-effect-primitives.md)
