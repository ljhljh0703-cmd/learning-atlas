---
created: 2026-06-16
updated: 2026-06-16
type: learning
tags: [html, presentation, slides, deck, design-system, presenter-mode, speaker-notes]
category: technique
source: https://github.com/lewislulu/html-ppt-skill
authors: [lewis]
---

<!-- lewislulu/html-ppt-skill 현행 전문 teardown — HTML 슬라이드 덱 스튜디오. 토큰 테마·레이아웃·애니·canvas FX·presenter mode+逐字稿. 아카이브된 구 로컬라이즈 대체. -->

> 출처: `lewislulu/html-ppt-skill` **현행 clone 전문 통독**(2026-06-16, SKILL.md + references 6종 + assets). MIT. ⚠️ vault 구 기록 .archive/html-ppt-skill(2026-05-19 로컬라이즈)은 *얇고 일부 환각*(존재하지 않는 `ppt:create`/`convert`/`re-skin` CLI 지어냄) — 본 페이지가 정확판. 실제 설치는 `npx skills add https://github.com/lewislulu/html-ppt-skill`.

# HTML PPT Studio (html-ppt) — 현행 teardown

> "One theme file = one look. One layout file = one page type. One animation class = one entry effect." 순수 static HTML/CSS/JS(CDN 웹폰트만), 빌드 0, 토큰 기반.

## 1. 아키텍처 (토큰 중심)
- **`assets/base.css`** = 토큰 + primitive(에딧 금지). 모든 테마가 같은 변수 오버라이드: `--bg/-soft·--surface/-2·--border·--text-1/2/3·--accent/-2/3·--good/warn/bad·--grad/-soft·--radius*·--shadow*·--font-sans/-display`.
- **테마 = 토큰 오버라이드 CSS 1파일**(~200줄 이하). `<link id="theme-link">` href 교체 또는 `data-themes="a,b,c"` + **T 키** 순환. → ParkDal `_tokens.css` 팔레트 스왑과 *동일 사상*(design-index).
- **`runtime.js`**(960줄) = 키보드 내비(←→/Space/Home/End)·T(테마)·A(애니)·F(풀스크린)·O(오버뷰 그리드)·**S(presenter)**·N(노트)·`#/N` 딥링크·`?preview=N`(단일 슬라이드 chrome 제거).
- 슬롯: `.deck-header/.deck-footer/.slide-number`/progress bar 제공. 1 `.slide`=1 논리 페이지, `.slide.is-active`만 표시.
- 토큰 강제: 슬라이드 마크업에 raw hex 금지(`var(--text-1)` O, `#111` X) — html `lint.py`·ParkDal anti-pattern과 동일 규율.

## 2. 카탈로그 (규모)
- **36 테마** — 그룹: Light&calm(minimal-white·editorial-serif·xiaohongshu-white·solarized-light·catppuccin-latte) / Bold(sharp-mono·neo-brutalism·bauhaus·swiss-grid·memphis-pop) / Cool-dark(catppuccin-mocha·dracula·tokyo-night·nord·gruvbox·rose-pine·arctic-cool) / Effect-heavy(glassmorphism·aurora·blueprint·terminal-green) / v2(corporate-clean·pitch-deck-vc·academic-paper·japanese-minimal·engineering-whiteprint·magazine-bold·news-broadcast·midcentury·retro-tv·cyberpunk-neon·vaporwave·y2k-chrome).
- **31 레이아웃**(`templates/single-page/*.html`, 데모 데이터 포함) — opener(cover·toc·section-divider)·text(bullets·two/three-column·big-quote)·data(stat-highlight·kpi-grid·table·chart-bar/line/pie/radar=Chart.js)·code(code=highlight.js·diff·terminal)·diagram(flow·arch·process-steps·mindmap=SVG)·plan(timeline·roadmap·gantt·comparison·pros-cons·todo)·visual(image-hero·image-grid bento)·closer(cta·thanks). 표준 클래스: `.kicker/.eyebrow/.h1/.h2/.lede/.card(-soft/-outline/-accent)/.grid.g2/g3/g4`.
- **27 CSS 애니**(`data-anim`, 슬라이드 진입마다 재트리거) — fade-up/down/left/right·rise-in·drop-in·zoom-pop·blur-in·glitch-in·typewriter·neon-glow·shimmer·gradient-flow·stagger-list·counter-up·path-draw·morph·parallax-tilt·card-flip-3d·cube-rotate-3d·page-turn-3d·perspective-zoom·marquee·kenburns·confetti·spotlight·ripple. (`prefers-reduced-motion` 자동 비활성.)
- **20 canvas FX**(`data-fx`, 슬라이드 진입 시 live·이탈 시 cleanup, 테마색 read) — particle-burst·confetti-cannon·firework·starfield·matrix-rain·**knowledge-graph(force-directed 28노드)**·neural-net·constellation·orbit-ring·galaxy-swirl·word-cascade·letter-explode·chain-react·magnetic-field·data-stream·gradient-blob·sparkle-trail·shockwave·typewriter-multi·counter-explosion.
- **15 full-deck**(8 실사례 추출 + 7 시나리오 scaffold) — xhs-white-editorial·graphify-dark-graph·knowledge-arch-blueprint·hermes-cyber-terminal·obsidian-claude-gradient·testing-safety-alert·xhs-pastel-card·dir-key-nav-minimal / pitch-deck·product-launch·tech-sharing·weekly-report·xhs-post(3:4 810×1080)·course-module·**presenter-mode-reveal**. (각 `.tpl-<name>` 스코프 CSS — 공존 가능. SKILL 자체 "14↔15" self-drift 있음.)

## 3. 🎤 Presenter Mode + 逐字稿 (가장 novel — 작가 강연 직결)
**S 키 → 독립 팝업 윈도, 4 magnetic 카드**: 🔵CURRENT·🟣NEXT(둘 다 *픽셀 완벽* iframe preview)·🟠SPEAKER SCRIPT(대자 逐字稿 스크롤)·🟢TIMER(경과+카운터+prev/next/reset). 카드 header 드래그 이동·우하단 핸들 리사이즈·localStorage persist.
- **픽셀 완벽 원리**: preview = 같은 deck HTML을 `?preview=N`로 로드 → runtime이 N 슬라이드만 chrome 없이 렌더 → *관객과 동일 CSS/테마/폰트/viewport*. 외층 `transform:scale()`로 1920×1080을 카드에 등비 축소.
- **무깜빡 동기**: iframe 1회 로드 후 `postMessage({type:'preview-goto',idx})` + 두 윈도 `BroadcastChannel` 양방향 翻页.
- 逐字稿는 `<aside class="notes">`(기본 `display:none`, S에서만). **presenter-only 텍스트를 슬라이드 가시영역에 두지 말 것**(룰).

### 逐字稿 작성 3 铁律 (전이 가능 — speaker note 일반 가이드)
1. **讲稿 아닌 "提示信号"** — 핵심어 `<strong>` 볼드 + 과도문 독립 단락(한눈에 이어받기).
2. **페이지당 150–300자**(2–3분/페이지). 50자=忘词, 500자=못 훑음.
3. **口语, 书면어 X** — 因此→所以·该方案→这个方案·然而→但是. 쓰고 *소리내 읽기*.
- 페이지 수 가이드: 30분=8–12·45분=12–16·1시간=16–22.

## 4. 워크플로 (authoring-guide)
청중·길이·언어·포맷·톤 확정 → 테마 선택(청중↔톤 매핑) → 아웃라인(cover→toc→divider→body→cta→thanks, 같은 레이아웃 연속 금지) → `new-deck.sh` scaffold → 레이아웃 복사+데이터 교체 → 애니 슬라이드당 1개 → 브라우저 검토(O/T/S) → `render.sh`(headless Chrome→PNG, 1920×1080 또는 小红书 3:4). **항상 템플릿서 시작**(blank 금지), 한·영 = `lang` + 영문 부제 weight 300 dim.

## 5. vault 적용 / 차용 후보
- **presenter mode + 逐字稿 3铁律** = 작가 *강연·기술공유* 직결. pptx-deck-builder·html-publish slide-stack에 逐字稿 가이드 차용 후보.
- **토큰 테마 스왑** = ParkDal 사상 확증(design-index). 36 테마 명명/그룹핑은 [Brand Tone References (아카이브 — 검증 토큰값)](brand-tone-references.md) 보강 참고.
- **canvas FX**(knowledge-graph·neural-net·matrix-rain) = 기술 발표·graphify viz 슬라이드 후보.
- **`?preview=N` 픽셀-완벽 preview 패턴** = "preview=관객과 동일 렌더" 일반 기법(html-publish preview에 응용 가능).
- **clean-room**: 카탈로그·패턴·아키텍처만 흡수. CSS/JS/템플릿 코드 복제 X(MIT지만 #2 #3 — 필요 시 npx 설치해 직접 사용).
- 포폴 경로 영향: 작가 포폴은 *HTML 페이지(Visual-Scroll)* 확정(design-index) — 본 덱 스튜디오는 *발표 덱* 별개 도구. 발표/강연 필요 시 인출.
- **Editorial Design Discipline 스택 자매**: [Editorial Grid Design Canon — Vignelli + Müller-Brockmann (전문)](editorial-grid-design-canon.md) · [getdesign.md AI 디자인 시스템 분석 보고서](getdesign-teardown.md) · [NYT-discipline Data Visualization](nyt-data-viz.md) (에디토리얼 그리드·외부 스펙 게이트·데이터 비주얼).
