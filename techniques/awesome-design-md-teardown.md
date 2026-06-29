---
created: 2026-06-19
updated: 2026-06-25
type: learning
category: technique
tags: [design-system, design-md, google-stitch, design-tokens, design-as-contract, llm-ui, reference]
source: https://github.com/VoltAgent/awesome-design-md
authors: [VoltAgent/Bergside LLC]
---

> 출처: VoltAgent/awesome-design-md(MIT) **직접 통독**(README + Claude/Stripe/Linear DESIGN.md 전문, raw.githubusercontent 2026-06-19). 55개 DESIGN.md(실사이트 디자인 시스템) + 포맷 정의. ParkDal/design-engine 위 **레퍼런스 토큰 라이브러리**로 흡수.

# Awesome Design MD — DESIGN.md(Google Stitch) 포맷 + 55 실사이트 시스템

## A. 핵심 개념 — "디자인을 마크다운 계약으로"
- **DESIGN.md** = Google Stitch가 정의한 개념. *AI 에이전트가 읽어 일관된 UI를 생성하도록* 디자인 시스템을 **plain-text(markdown)** 로 적은 문서. Figma export·JSON 스키마·툴링 불요 — 프로젝트 루트에 두면 코딩/디자인 에이전트가 즉시 이해. "markdown이 LLM이 가장 잘 읽는 포맷."
- **역할 분리**: `AGENTS.md`=어떻게 빌드(코딩 에이전트) / `DESIGN.md`=어떻게 보이고 느껴져야(디자인 에이전트). → 우리 `AGENTS.md`와 평행, **DESIGN.md 레이어가 비어 있었음**(갭).
- getdesign "design-as-contract(토큰층+설명층)"·design-engine "미감축"과 정확히 수렴 → **차용 정당**.

## B. DESIGN.md 9-섹션 스키마 (정본 포맷)
1 **Visual Theme & Atmosphere** 무드·밀도·철학(+Key Characteristics 불릿) · 2 **Color Palette & Roles** 시맨틱명+hex+역할 · 3 **Typography Rules** 폰트패밀리 + **풀 위계 표**(role/size/weight/line-height/letter-spacing/notes) + 원칙 · 4 **Component Stylings** 버튼·카드·인풋·뱃지·내비(상태별) · 5 **Layout Principles** 8px 스페이싱 스케일·그리드·여백 철학·radius 스케일 · 6 **Depth & Elevation** 그림자 레벨 표·shadow 철학 · 7 **Do's & Don'ts** 가드레일·안티패턴(실명 hex) · 8 **Responsive Behavior** 브레이크포인트·터치타깃·collapsing · 9 **Agent Prompt Guide** quick color ref + **즉시 사용 컴포넌트 프롬프트 예문** + iteration guide.
부속: `preview.html`/`preview-dark.html`(색 스와치·타입스케일·버튼·카드 시각 카탈로그).
→ **우리 PORTFOLIO-INTAKE·design-catalog와 동형**. 9번 "Agent Prompt Guide"는 우리 "이렇게 지시" 필드의 상위호환(컴포넌트 단위 풀프롬프트).

## C. 3 실토큰 Exemplar (전문 추출 — 프로급 레퍼런스)
### C-1. Claude (Anthropic) — 따뜻한 에디토리얼
- 캔버스 **Parchment #f5f4ed**(종이감)·Ivory #faf9f5·Near-Black **#141413**(웜 올리브). 브랜드 **Terracotta #c96442**(의도적 un-tech)·Coral #d97757. 뉴트럴 **전부 웜**(올리브 #5e5d59·스톤 #87867f) — *쿨 블루그레이 0*.
- 타입: **Serif 헤드라인(weight 500 단일)** + Sans UI + Mono 코드. 본문 line-height **1.60**(문학적), 헤드 1.10–1.30. (대체: Georgia/system-ui).
- **Ring 그림자**(`0 0 0 1px` 웜그레이) = 보더 같은 깊이. 드롭섀도우는 whisper(0.05·24px). radius 8→12→16→32(매우 둥금). 라이트/다크 섹션 교차=챕터 리듬.
- Don't: 쿨 그레이·serif 700·테라코타 외 채도·sharp(<6px)·순백 배경·기하학 일러스트.

### C-2. Stripe — 프리미엄 핀테크
- 화이트 #fff·헤딩 **Deep Navy #061b31**(검정 아님)·브랜드 **Purple #533afd**. 악센트 Ruby #ea2261/Magenta #f96bee(**장식 전용**, 버튼 X).
- 타입: sohne-var + **OpenType `ss01` 전역** + **weight 300(디스플레이의 시그니처=가벼움이 곧 럭셔리)** + **음수 자간**(-1.4px@56). 숫자는 `tnum`. (대체: SF Pro/Inter).
- **Blue-tinted 멀티레이어 그림자** `rgba(50,50,93,.25) + rgba(0,0,0,.1)`(브랜드색 그림자). radius **보수적 4–8**(pill 금지).
- Don't: 600–700 헤드·큰 radius/pill·뉴트럴 그레이 그림자·순흑 헤딩·웜 악센트 인터랙티브.

### C-3. Linear — 다크 네이티브 정밀
- **다크가 매체**: 마케팅 #08090a·패널 #0f1011·표면 #191a1b. 텍스트 #f7f8f8(순백 아님)·실버 #d0d6e0·뮤트 #8a8f98. 단일 악센트 **인디고 #5e6ad2 / 바이올렛 #7170ff**(나머지 전부 무채색).
- 타입: Inter Variable + **`cv01,ss03` 전역** + **weight 510(시그니처 중간웨이트)**·590 강조·400 본문. 디스플레이 음수자간 -1.584@72.
- **깊이=휘도 스태킹**: 보더는 **반투명 화이트**(rgba255×0.05–0.08), 버튼 bg rgba255×0.02–0.05, 표면 휘도 단계↑. 다크 위 드롭섀도우 대신 inset·휘도. radius 2/6/8/12/9999.
- Don't: 순백 텍스트·솔리드 버튼bg·악센트 장식 남용·솔리드 다크 보더·700.

## D. 55 사이트 카탈로그 (시그니처 — DESIGN.md 보유, repo 경로)
- **AI/ML**: Claude(웜 테라코타 에디토리얼)·Cohere(비비드 그라데이션 대시보드)·ElevenLabs(다크 시네마틱·오디오웨이브)·Minimax(볼드 다크+네온)·Mistral(프렌치 미니멀·퍼플)·Ollama(터미널·모노크롬)·OpenCode(개발자 다크)·Replicate(화이트 코드포워드)·RunwayML(시네마틱 다크 미디어)·Together(블루프린트 테크)·VoltAgent(보이드블랙+에메랄드 터미널)·xAI(스타크 모노크롬 미래).
- **개발툴**: Cursor(슬릭 다크+그라데이션)·Expo(다크·타이트 자간)·Linear(울트라미니멀·퍼플)·Lovable(플레이풀 그라데이션)·Mintlify(클린 그린 리딩)·PostHog(헤지호그 다크)·Raycast(다크 크롬+그라데이션)·Resend(미니멀 다크+모노)·Sentry(데이터덴스 핑크퍼플)·Supabase(다크 에메랄드)·Superhuman(프리미엄 다크 퍼플글로)·Vercel(흑백 정밀·Geist)·Warp(IDE 블록UI)·Zapier(웜 오렌지 일러스트).
- **인프라/클라우드**: ClickHouse(옐로 테크닉)·Composio(다크+컬러아이콘)·HashiCorp(엔터프라이즈 흑백)·MongoDB(그린 리프 docs)·Sanity(레드 에디토리얼)·Stripe(퍼플 그라데이션 weight-300).
- **디자인/생산성**: Airtable(컬러풀 구조)·Cal.com(중립 클린)·Clay(유기적 셰이프·소프트 그라데이션·아트디렉션)·Figma(멀티컬러 플레이풀)·Framer(흑+블루 모션퍼스트)·Intercom(프렌들리 블루)·Miro(브라이트 옐로 무한캔버스)·Notion(웜 미니멀·serif 헤딩)·Pinterest(레드 masonry)·Webflow(블루 마케팅).
- **핀테크/크립토**: Coinbase(클린 블루 신뢰)·Kraken(퍼플 다크 데이터)·Revolut(슬릭 다크 그라데이션카드)·Wise(브라이트 그린).
- **엔터프라이즈/컨슈머**: Airbnb(웜 코랄·포토·둥근)·Apple(프리미엄 여백·SF Pro·시네마틱)·BMW(다크 프리미엄 독일정밀)·IBM(Carbon·구조 블루)·NVIDIA(그린-블랙 파워)·SpaceX(흑백 풀블리드 미래)·Spotify(다크 위 비비드 그린·앨범아트)·Uber(볼드 흑백·어반).
- 각 폴더: `DESIGN.md`+`preview.html`+`preview-dark.html`. (전체 토큰 필요 시 repo 직접 인출 — raw.githubusercontent 패턴.)

## E. 사용법
1. 사이트 `DESIGN.md`를 프로젝트 루트 복사 → 2. 에이전트에 "이걸로 ~처럼 만들어줘". 9번 프롬프트 예문 그대로 인출 가능.

## F. 우리 시스템 적용 (흡수 결과)
- **DEVELOP-PLAN L2(token-swap→진짜 theme file) 직접 충족 재료**: 9-섹션 풀 스펙 = "one theme=one look"의 정본 데이터. Claude/Stripe/Linear 3종을 design-presets에 **실토큰 라이브 스타일**로 반영(파일럿).
- **design-catalog**: `DESIGN.md(Stitch) 메서드`를 workflow-skills 엔트리로 추가(디자인=마크다운 계약).
- **프로급 갭 메우기**(작가 진단): 이 3종의 *절제·실토큰·do_not·shadow 철학*이 우리 약점(절제·크래프트·색규율)의 구체 본보기. grade 하네스의 레퍼런스 기준으로 사용 가능(verify 대상).
- **DESIGN.md 발행 후보**: 우리 ParkDal 시스템도 이 포맷으로 `DESIGN.md` 1장 작성 → 외부 에이전트가 작가 톤 재현(추후).

## G. 도구화·유통 레이어 흡수 (2026-06-25, 작가 지시) — refero.design · oh-my-design
> awesome-design-md가 *포맷+데이터*라면, 그 위에 **떠오는 두 도구**를 레퍼런스 보드(38선)에 편입(둘 다 dry 관측·근사 라벨, 메타 리소스 정직 표기).

- **oh-my-design** (kwakseongjae, MIT · github) — *"awesome-design-md가 끝난 데서 시작"*(저자 명시). 58개 기업 시스템에서 **Google Stitch DESIGN.md를 생성**하는 클라이언트사이드 도구. **AI 호출 0**(키 불요). 흐름: ① 레퍼런스 선택 → ② A/B 취향(버튼·테이블·헤더·카드) → ③ 토큰(색·radius·다크) → ④ 컴포넌트 17종 가감 → ⑤ **DESIGN.md + shadcn/ui CSS 변수 + npx CLI** export. 데이터 출처=VoltAgent/awesome-design-md(=이 노드 §C·D). → **우리 9-섹션 스키마(§B)의 위저드화**: 정적 DESIGN.md를 *A/B로 커스텀*하는 상위 워크플로. design-presets의 "token-swap→theme file"(§F) 자동화 본보기.
- **refero.design / styles** (Beta) — **2,000+ 제품 사이트의 AI-readable 디자인 시스템** 라이브러리 + **Refero MCP**(Cursor·Claude·Windsurf 연결). 스타일별 DESIGN.md(색·타이포·스페이싱·컴포넌트)와 라이브 영상 프리뷰. → **우리 레퍼런스 보드(36→)의 상위 소스**: 보드가 "느낌 빌릴 곳 38선"이라면 refero는 "그 38을 찾는 곳". MCP라 에이전트가 빌드 전 실제 제품 화면을 검색·학습 가능.
- **흡수 결론**: 우리 파이프라인의 결손은 *데이터*가 아니라 **(a) DESIGN.md 커스텀 위저드(oh-my-design)** 와 **(b) MCP 기반 실시간 레퍼런스 검색(refero)**. 우리 design-presets/캐털로그는 정적 큐레이션 → 다음 L2는 oh-my-design식 *A/B 토큰 빌더*가 후보. 외부 자산은 사용·재배포 아님(링크·방법만 차용), 상표 각 권리자 소유.
- 보드 반영: `docs/_publish/references.json`(+2 = 38) · `build_references.py` 카운트 동적화(__TOTAL__/__APPROX__) · `docs/design-references.html` 재빌드. 관련 [충실 추출 — Manavarya09/design-extract (designlang)](design-extract.md) · [getdesign.md AI 디자인 시스템 분석 보고서](getdesign-teardown.md) · design-index.
