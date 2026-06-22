---
created: 2026-06-16
updated: 2026-06-16
type: learning
tags: [design-system, grid, typography, editorial, swiss-style, portfolio, vignelli, muller-brockmann]
category: technique
source: https://github.com/alexmcdonnell-airtable/hyperagent-public-skills
authors: [Massimo Vignelli, Josef Müller-Brockmann]
---

> 출처: hyperagent-public-skills(alexmcdonnell-airtable) `vignelli-canon`·`muller-brockmann-grid` skill JSON **전문 직접 파악**(clone 후 documentation 통독, 2026-06-16). 원리=공개 디자인 정전. ParkDal `_tokens.css` 위 **규율 레이어**(토큰="무엇", canon="어떻게 절제"). ※ 1차 WebFetch 요약본은 부실해 폐기·재작성.

# Editorial Grid Design Canon — Vignelli + Müller-Brockmann (전문)

## A. Vignelli Canon (Massimo Vignelli, *The Vignelli Canon*)
> 명제: **"디자인은 하나의 규율 — 스타일보다 위. 창의성은 지식의 뒷받침이 필요하다."** 규칙은 새장이 아니라 도구 가방.

### A-1. Intangibles (그리기 전에 결정 — 12)
1. **Semantics** 의미 먼저 — 주제·역사·송신/수신자 조사 → 본질 추출.
2. **Syntactics** 관계 통제 — 그리드·서체·헤드/본문/이미지 관계. "God is in the details."
3. **Pragmatics** 설명 없이 스스로 이해되게. "복잡함은 사랑하되 복잡화는 싫다."
4. **Discipline** 무질서 0. "품질은 있거나 없거나."
5. **Appropriateness** "사물이 무엇이 되고 싶은지 들어라" — 문제의 *특정성*.
6. **Ambiguity(좋은)** 의미의 복수성을 양념으로.
7. **Design Is One** 한 규율 통달 → 무엇이든 설계. 스타일은 규율의 하위.
8. **Visual Power** 강함은 *스케일 대비*(거대 헤드 vs 작은 본문)·weight, 시끄러움이 아님.
9. **Intellectual Elegance** 매너 아닌 *정신*의 우아함(저속의 반대).
10. **Timelessness** 원색·원형·트렌드 초월 타이포. "명료·단순·영속."
11. **Responsibility** 자신/클라이언트(수단의 경제)/대중.
12. **Equity** 오래된 마크=집단 문화. **교체 말고 정련.**

### A-2. Tangibles (구체 규칙)
- **그리드** = 정보의 조직. 5 정규: **2×4·5×4·3×6·6×6·4×8**(columns×modules). 좁은 외곽 margin=긴장 / 넓으면=평온. 좁은 gutter(≈1줄). 용지 DIN A 선호.
- **타이포**: 평생 6서체(Garamond·Bodoni·Century Expanded·Futura·Times·**Helvetica**[house]). "타입이 아니라 타입으로 *무엇을 하느냐*." **공간·weight·정렬로 구분**, novelty 서체 X. **flush-left 기본, justified 금지**(중앙=비문·초대장만). **페이지당 2 사이즈, heading ≈ 2×body**(예 10/20). 컬럼폭별 size/leading: 8/9·9/10·10/11(≤70mm) / 12/13·14/16(≤140mm) / 16/18·18/20(이상). **rulers 2pt(major)·0.5~1pt(minor), 타입은 ruler에 매달림.**
- **색 = 식별자(Chromotype), 장식 X**. 원색(빨/파/노) 기본. 식별에선 색이 곧 정체성.
- **여백 = 주인공**. "흰 것이 검은 것을 노래하게 한다." 채우지 말 것.
- **레이아웃**: 출판물=영화적 객체(*시퀀스* 설계). **"레이아웃이 보이면 나쁜 레이아웃."** identity↔diversity 균형. 단순 모듈 비율(1→2→3).
- **palette(hex)**: vermilion `#F04E23` · signal blue `#0039A6` · signal yellow `#FFCC00` · ink `#0A0A0A` · warm paper `#F4F1EA` · white `#FFFFFF`.
- **self-critique 거부**: 2 사이즈 초과·justified·장식적 색·보이는/잡다한 레이아웃·novelty 서체.
- 신조: *"I love systems and despise happenstance."*

## B. Müller-Brockmann Grid (Josef Müller-Brockmann, *Grid Systems*)
> "그리드는 보장이 아닌 도구 — 쓰는 법은 연습이 필요한 기술." 핵심: 대부분 틀리는 *load-bearing 웹 엔지니어링*까지.

### B-1. Discipline
- **객관적 질서** — 시스템(에고 아님)이 페이지를 조직.
- **모듈 그리드** — 컬럼+행 모듈, 일관 gutter, 정의된 margin. 텍스트/이미지가 *온전한 모듈* 점유. 흔한 field 수 8/20/32. 웹 기본 = **12컬럼 + 8px baseline**, 행 보이려면 6×6/4×8.
- **baseline 그리드(신성)** — **leading = baseline 정수배**, 모든 요소 스냅 → 마주보는 컬럼·이미지가 정렬.
- **타이포** — grotesque sans(Akzidenz/Helvetica; 웹 Inter/Helvetica Now/Archivo). **flush-left ragged-right**. 적은 사이즈, 큰 스케일 점프로 위계. **큰 숫자/데이터 시그니처**.
- **palette** — 순백 종이·near-black ink·**단일 accent(빨강 canonical)**. warm-cream "Claude look" 회피, **blue/purple gradient 절대 금지**(하우스 룰).

### B-2. 웹에서 그리드를 진짜로 만들기 (엔지니어링)
- **2.1 단일 진실** — 모든 그리드 파라미터를 `:root` CSS 변수(`--cols/--gutter/--margin/--bl/--lh/--maxw`). 콘텐츠와 overlay가 *같은 변수* 읽음.
- **2.2 overlay는 콘텐츠와 *같은 박스* 안** (←#1 버그) — 중앙 max-width 콘텐츠 + full-width overlay sibling이면 `--maxw` 초과 뷰포트서 컬럼 어긋남("위에 슬쩍 얹힘"). `.guides`를 같은 `.wrap` 안에, `left/right=var(--margin)` + 동일 `repeat(var(--cols),1fr)`.
- **2.3 subgrid band로 컬럼 라인 배치** — 각 band가 전 컬럼 span + `grid-template-columns:subgrid`, 자식은 `grid-column:<start>/<end>`. 눈대중 X.
- **2.4 수직 리듬 잠금** — line-height는 **px 정수배**(큰 타입에 unitless 금지=박스가 그리드 이탈). 모든 margin/padding=baseline 배수. **미디어 높이=leading 배수**(상·하 모두 라인에).
- **2.5 토글**(버튼+`G`키) — 번호 컬럼 필드+baseline+margin 라인 overlay. *실제 그리드를 보여주는 게 데모.*
- **2.6 OPTICAL ALIGNMENT — 박스 아닌 *잉크*** (←미묘 버그) — 큰 헤드라인은 letterform side-bearing 때문에 박스가 라인에 맞아도 잉크가 어긋나 보임. 런타임 canvas `measureText().actualBoundingBoxLeft`로 marginLeft 보정(폰트별 상이 — 실폰트 로드 후 측정). **box-on-grid ≠ ink-on-grid.**

### B-3. Verify (믿지 말고 측정) — Puppeteer 4종
여러 폭(>·< `--maxw`, 예 1440/1180/900)에서: ① 컬럼 준수(양 edge 셋 다 — span 끝은 gutter 먼쪽) ② overlay 일치 ③ baseline modulo ④ optical ink(요소별 자기 컬럼 라인). clean = `col=0 overlay=0 baseline≤4 ink=0 → PASS`. 신조: *"토글해 측정 못 하는 그리드는 무드보드지 시스템이 아니다."*

## C. 포트폴리오 적용 (ParkDal + canon)
- ParkDal `monochrome` 팔레트(흑백+빨강) = MB white/near-black/Swiss-red(`#e4002b`)·Vignelli ink/paper와 동형.
- ParkDal `--space-*` 8px = baseline 8px lock. leading/margin/미디어높이를 8 배수로.
- ParkDal 6-level headline → **실제론 2~3 레벨만**(Vignelli 절제) + flush-left 고정.
- 컨테이너 ParkDal base 1080/wide 1280 ≈ MB maxw, 본문 narrow 680.
- accent 단일·CTA/링크/1포인트(Vignelli "식별자" + ParkDal accent 일치).
- 큰 헤드라인엔 optical ink 보정(B-2.6) 적용 검토.

## D. 교차 production 함정 (4 스킬 공통 — html-publish·ad-storyboard에도 적용)
- **Helvetica→Noto/Calibri 래스터 함정**: headless 렌더(cairosvg/Chromium)서 `Helvetica/Arial/sans-serif` 스택이 조용히 Noto Sans(둥근 휴머니스트=Calibri 느낌)로 폴백 → grotesque 깨짐. **Liberation Sans 또는 임베드 Helvetica/Arimo TTF**로 렌더, `fc-match`로 검증, 1장은 눈으로 확인.
- **이미지 publish 함정**: sandboxed iframe(PublishWebpage류)은 thread-scoped `/api/files/...` 인증 불가 → 이미지마다 공개 게시 후 public URL 사용(broken-image 방지).
- **code→image→reality 파이프라인**: 타입/다이어그램을 *코드로* 먼저(정확한 grotesque=진실원본) → 이미지 모델(GPT Image 2)에 reference로 + 프롬프트에 서체 명시·드리프트 금지. 레퍼런스 폰트가 틀리면 모델이 충실히 *틀린 폰트* 재현 → 프롬프트 탓 말고 레퍼런스 고칠 것.
- **타입 주인공이면 영상생성 회피**: Veo 등은 프레임마다 letterform 드리프트 → 정지컷/웹 스크린캡처로.
- **🚫 하드룰**(brand-book+MB 공통): **blue/purple gradient 금지**(indigo→cyan→magenta "AI-native aurora mesh" = 모두가 쓰는 un-designed 기본값). warm-cream+serif "Claude look"·flat gray SaaS 미니멀도 회피. 차원 원하면 claymorphism/chrome/hi-vis flat/maximalist.
