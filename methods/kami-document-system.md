---
created: 2026-06-16
updated: 2026-06-16
type: learning
tags: [document-generation, resume, portfolio, design-system, kami, weasyprint, job-hunting]
category: method
source: https://github.com/tw93/Kami
authors: [tw93]
---

<!-- tw93/Kami 운영 teardown — AI 에이전트용 문서 생성 시스템(이력서·포폴·슬라이드·백서 등 9종). ParkDal 부모, 작가 취업 직결. 기존 kami-design-system(철학)의 운영 보강. -->

> 출처: `tw93/Kami` v1.7.4 **clone 전문 통독**(2026-06-16, SKILL.md 535 + references 8종 + tokens). 기존 kami-design-system은 *디자인 철학*만 — 본 페이지는 *운영 실체*(9 문서타입·이력서 전략·writing 품질바·14 다이어그램). **Kami = ParkDal의 부모**(tokens 일치), **diagram-design([Diagram-Design Skill — Editorial 다이어그램을 자동화한 Claude Code skill](diagram-design-skill.md)) 크레딧**. 🎯 **작가 취업 직결**(이력서/포폴 생성 + 한국어 템플릿 존재). 방법론만 흡수(코드 clean-room).

# Kami (紙) — AI 문서 생성 시스템 운영 teardown

> "紙·かみ — the paper your deliverables land on." 9종 문서를 하나의 디자인 언어(warm parchment·single ink-blue·serif)로. Kaku(코드)·Waza(습관)·**Kami(문서)** 삼부작.

## 1. 9 문서 타입 + 결정 트리
resume·one-pager·long-doc(백서)·letter·portfolio·slides·equity-report·changelog·landing-page. 각 CN/EN/**KO** 템플릿(`*-ko.html`, best-effort). 결정 트리(길이→타입): ≤1p 투자/리쿠르터=one-pager·≤1p 격식서신=letter·**1.5~2p 커리어+프로젝트=resume**·3~6p 비주얼=portfolio·6~15p 논증=long-doc·발표=slides·재무=equity-report·랜딩=landing-page. 2칸 둘 다 맞을 때만 1줄 질문.

## 2. 🎯 이력서 전략 (resume-writing.md — 취업 핵심)
- **3-part bullet**: Role(무엇/왜/내 위치, 동사 X) / Actions(결정·기법, 문장당 1접근) / Impact(*정량 결과만*, 없으면 scope=팀크기/유저수). 자가체크: Impact를 소리내 읽어 "process(개선했다)" 아닌 "result(p95 800→120ms)"여야.
- **Impact 공식**(품질바): **Action + Scope + Measurable Result + Business Outcome**. 모든 bullet은 강한 과거동사 시작(designed/led/reduced), "Responsible for"·"Helped" 금지. before/after("X→Y") > "Z% 개선". 정밀수치($280K) > 반올림($300K).
- **Ownership 보정표**(과장 금지): owner/lead > drove/led > coordinated > module owner > contributed > implemented. *모든 줄 "主導" 금지* — owner급 + 좁고 구체적 기여 섞여야 신뢰.
- **Timeline 3-step arc**(연대기 아님, 판단 진화): Foundation(초기 제약)→Inflection(최적화 대상 바뀐 결정)→Present(정착한 운영방식). "이벤트 나열 X, 판단·스코프 변화."
- **🌟 AI 엔지니어 이력서**(작가 직결): AI를 *엔지니어드 시스템*으로 — eval gate·feedback loop·**harness**·regression check·context boundary·rollback path. human/AI 분업 명시(인간=scope/tradeoff/risk, AI=구현/수리/분류). 기법 metric 연결(pass rate·hallucination↓·iteration). 진화: prompt craft→context eng→tool orchestration→automated validation. **회피**: 모델명 나열·"AI로 50%↑"(baseline 없이)·API데모를 agent platform 포장·팀성과를 개인성과로·赋能/抓手 류 buzzword.
  - → 작가 libgdx-rogue-os-case-study("신뢰하되 검증" AI-native pipeline)·agent-harness·③Gate가 *정확히 이 가이드의 모범 사례*. 이력서에 그대로 매핑 가능.
- **메트릭 카드 4종 선택**: time 1 + scale 1 + results 2. **2페이지 정확**, 각 83~95% 채움·차이 <12%p. density 튜닝(프로젝트 3~6개별 font-size/line-height 표). `--check-resume-balance` 검증.

## 3. Writing 품질바 (writing.md — 전 문서)
- **핵심 4원칙**: ①Data over adjectives("얼마나?" 못 답하면 쓰지 마라) ②**Judgment over execution**(주니어=한 것, 미들=어떻게, *시니어=왜 그 결정+무엇을 옳게 예측*) ③Distinctive phrasing(업계 클리셰 X, 직접 발화) ④Honest boundaries(안 한 건 주장 X, 모르는 수치 발명 X).
- **타입별 core rule**: resume=Action+Scope+Result+Outcome / portfolio=문제·stakes로 시작(역할명 아님)·결정점 2~3개 tradeoff / slides=제목이 *완결 단언문*(topic label 아님)·eyebrow≠title / equity=variant perception(시장이 틀린 것) / one-pager=30초 파악 / letter=1문장 목적+1문장 ask.
- **Term annotation 반감기**: 용어 주석은 8~10p/10slide 후 만료, 재등장 시 짧게 재표기.

## 4. Anti-patterns (anti-patterns.md, 48개 — 초안 검수 체크리스트)
6 범주: Content Emptiness(형용사더미·heading 재서술·vague 시간) / Metric Fabrication(가짜 정밀·차트-텍스트 불일치·발명 baseline) / Structure Mimicry(결과 없는 bullet·ask 없는 one-pager·label 슬라이드) / Visual Excess(accent 3색+·insight 없는 차트제목·장식 아이콘) / Source Gaps(미검증 버전·날짜 없는 "latest") / Tone Contamination(赋能/leverage buzzword·破折号 남발·CJK fallback 누락). **pre-ship 체크리스트**(writing.md 말미)로 매 초안 점검.

## 5. 다이어그램 (diagrams.md, 14종 — [Diagram-Design Skill — Editorial 다이어그램을 자동화한 Claude Code skill](diagram-design-skill.md) 크레딧)
architecture·flowchart·quadrant·bar/line/donut·state-machine·timeline·swimlane·tree·layer-stack·venn·candlestick·waterfall. **self-contained HTML+inline SVG**(Mermaid/JS/빌드 0). 규율: **모든 좌표/너비/gap ÷4**(anti-slop floor)·focal 1~2개(`#1B365D` stroke+`#EEF2F7` fill, 나머지 neutral)·complexity 4/10(노드>9=두 다이어그램)·chevron arrow(filled triangle X)·**WeasyPrint marker orient 미지원→수동 chevron path**. "잘 쓴 문단이 이 다이어그램보다 덜 가르치나? 아니면 그리지 마라." 데이터→차트 자동선택 트리. → [Editorial Grid Design Canon — Vignelli + Müller-Brockmann (전문)](../techniques/editorial-grid-design-canon.md)·diagram-design과 동일 Swiss editorial 혈통.

## 6. 운영 메커니즘
- **brand-profile**(`~/.config/kami/brand.md`) 4계층: A 플레이스홀더 치환·B 세션 디폴트·C 비주얼(--brand/logo)·D 습관노트. precedence: **explicit prompt > editorial judgment > habit > frontmatter > built-in**. 6 guardrail(profile=fallback·varied surface·silent).
- **출력 파이프라인**(production.md): 기본 WeasyPrint HTML→PDF / PPTX(`slides.py`, 편집 필요 시만) / Marp(.md 요청 시). **CJK 폰트 함정**(미설치 시 fallback→레이아웃 붕괴, `ensure-fonts.sh`)·rgba/shadow 금지(solid hex)·22 known pitfalls.
- **검증 스크립트**: `build.py --verify`(빌드+페이지수+폰트)·`--check-density`(여백 스캐너 60~80% 목표)·`--check-resume-balance`·`--check-placeholders`·`--check`(CSS 위반).
- 폰트: EN=Charter, **KO=Source Han Serif K**(`-ko` 템플릿), CN=TsangerJinKai02, JA=YuMincho. 1 페이지 1 serif.
- tokens: parchment `#f5f4ed`·ivory `#faf9f5`·brand `#1B365D`·brand-tint `#EEF2F7`·near-black `#141413`·warm grays(olive `#504e49`/stone `#6b6a64`). **단일 accent, cool blue-gray 배제.**

## 7. vault 적용
- **🎯 작가 취업 (최우선)**: Kami로 *이력서·포트폴리오 직접 생성 가능*(KO 템플릿). resume-writing §2 + AI 엔지니어 가이드를 resume-design-system·libgdx-rogue-os-case-study와 결합 → 작가 AI-native 경력(harness·③Gate·hermes)을 Impact 공식으로 서술. **단기 목표 직격**(goal-hierarchy).
- **ParkDal 혈통 확정**: Kami = kami-design-system 철학 + 본 운영. ParkDal은 Kami+DESIGN.md 융합 파생. 토큰·invariant 동일.
- **다이어그램**: Kami 14종 ÷4·focal 규율 = [Editorial Grid Design Canon — Vignelli + Müller-Brockmann (전문)](../techniques/editorial-grid-design-canon.md)·diagram-design 통합. 발표/문서 다이어그램에 인출.
- **writing 품질바 + anti-patterns 48** = 모든 외부 공개 문서(이력서·포폴·블로그·지원서) 검수 게이트. juhyeong-voice(작가 문체)와 상보(품질바=구조/논증, juhyeong=톤).
- clean-room: 방법론·토큰·규율만. 템플릿/스크립트 코드 복제 X(필요 시 `npx skills add` 또는 직접 설치).
