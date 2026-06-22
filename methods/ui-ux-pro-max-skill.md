---
created: 2026-06-18
updated: 2026-06-18
type: learning
tags: [tool, design-system, ui-ux, skill, bm25, reasoning-engine, anti-patterns, design-tokens]
source: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
authors: [NextLevelBuilder]
year: 2026
category: method
---

# UI/UX Pro Max — 제품타입→디자인시스템 자동추천 reasoning DB 스킬 (NextLevelBuilder)

*GitHub repo 직접 clone 통독(16M, MIT) · v2.5.0 · 멀티플랫폼 설치형 AI 스킬(Claude/Cursor/Codex/Gemini 등 18종, `uipro-cli`)*

UI/UX 디자인 의사결정을 **CSV 데이터베이스 + BM25 검색 + 조건부 reasoning rule**로 자동화한 Claude Code 스킬. "뷰티 스파 랜딩 만들어줘" → 161개 제품타입 reasoning rule 매칭 → 스타일(67)·색팔레트(161)·폰트페어(57)·랜딩패턴·anti-pattern·pre-delivery 체크리스트를 한 번에 조립해 design system 출력. 작가 도메인(html-publish 빌더·design-index·게임UI)의 *레버 창고*(design-flexible-template-not-lock)로 직접 유용 — 단 ParkDal 단일톤 SSOT 와 결이 달라 빌더 즉시개조 아닌 *선택적 차용*.

---

## 한 줄 요약

> 제품타입을 키워드로 던지면 데이터 기반 reasoning engine 이 스타일·색·폰트·패턴·anti-pattern·체크리스트를 조립해 완성된 design system 을 출력 — "단일 프롬프트에 디자인 지식 욱여넣기" 대신 *원자 카탈로그(CSV) + 조건부 룰* 구조.

---

## 핵심 개념

### 1. 데이터 카탈로그 (CSV 14종, 6,461행)
- `ui-reasoning.csv`(161 rules) — **핵심**. 컬럼: `UI_Category`·`Recommended_Pattern`·`Style_Priority`·`Color_Mood`·`Typography_Mood`·`Key_Effects`·**`Decision_Rules`(JSON 조건)**·`Anti_Patterns`·`Severity`.
- `styles.csv`(67 styles) — Keywords·Colors·Effects·Best For·**Do Not Use For**·Light/Dark·Performance·A11y·AI Prompt Keywords·CSS Keywords·**Implementation Checklist**·**Design System Variables**.
- `colors.csv`(161) — **shadcn semantic token 풀세트**(Primary/On Primary/Secondary/Accent/Background/Card/Muted/Border/Destructive/Ring) — 제품타입 1:1 매핑.
- `ux-guidelines.csv`(99) — Category·Issue·Platform·Do·Don't·**Code Example Good/Bad**·Severity.
- `typography.csv`(57) — Heading/Body Font·Mood·Google Fonts URL·CSS Import·Tailwind Config. + design/draft/google-fonts/icons/charts/landing/products/react-performance.

### 2. Reasoning Engine (`design_system.py` 1148줄)
1. `_multi_domain_search` — product/style/color/landing/typography **5개 도메인 병렬 BM25 검색**.
2. `_find_reasoning_rule` → `_apply_reasoning` — 제품 카테고리 매칭 후 **`Decision_Rules` JSON 조건 파싱**(예: `{"if_ux_focused":"prioritize-minimalism","if_data_heavy":"add-glassmorphism"}`).
3. `_select_best_match` — Style_Priority 키워드로 BM25 결과 중 best 선택.
4. `generate` — pattern+style+colors+typography+effects+**anti_patterns** 조립.

### 3. BM25 검색 (`core.py` 262줄)
- 표준 BM25 구현(tokenize·idf `log((N-freq+0.5)/(freq+0.5)+1)`·k1/b 정규화). CSV 도메인별 검색. 토큰 최적화 출력(300자 truncate).

### 4. Master + Overrides 영속화 패턴
- `--persist` → `design-system/MASTER.md`(전역 SSOT) + `design-system/pages/<page>.md`(페이지별 오버라이드, *Master 대비 deviation 만*).
- 계층 검색: 페이지 빌드 시 `pages/<page>.md` 먼저 → 있으면 override, 없으면 MASTER. = vault SSOT+위성 패턴의 디자인 버전.

### 5. Anti-pattern + Pre-delivery Checklist
- 산업별 회피 명시(예: **뱅킹에 "AI purple/pink gradient" 금지**, 웰니스에 harsh animation 금지).
- Pre-delivery: SVG 아이콘(이모지 금지)·cursor-pointer·hover transition 150-300ms·대비 4.5:1·focus 가시·reduced-motion·반응형 4브레이크포인트.

---

## 확증 — vault 기존 자산과 정합 (재서술 X)

- **semantic token 구조**(161 color = shadcn 토큰) → parkdal-design-system-spec 통합 토큰 SSOT + html-publish `_tokens.css`. 동형.
- **pre-delivery 색상/품질 게이트** → html-publish `lint.py`(하드코딩 색상 차단, 2026-06-13). 확증+확장(a11y·touch·모션 축).
- **Master+Overrides** → vault SSOT+위성 문서 패턴. 동형.
- **"디자인 지식을 원자 카탈로그로"** → 레버형 유동 템플릿 원칙(단일 박제 X). 이 repo = 그 레버 창고 구현체.

---

## 진짜 새것 (vault delta)

1. **★제품타입(161)→디자인 reasoning DB** — vault 는 ParkDal 단일톤 SSOT + 레퍼런스 teardown 다수지만, *제품 카테고리별 체계적 추천 룰셋 + JSON 조건부 분기*는 없음. "레버형 유동 — 독립 레버로 분해" 원칙을 *데이터로 구현*한 사례.
2. **산업별 anti-pattern 룰셋** — "뱅킹=AI gradient 금지" 식 *맥락 의존 금지축*. vault 디자인 가드(주로 일반 원칙)의 산업 특화 확장.
3. **확장 pre-delivery checklist** — html-publish lint(색상)보다 넓은 a11y/touch/모션/반응형 체크 항목 카탈로그.
4. **BM25 로컬 검색 + CSV 카탈로그 구조** — graphify(그래프) 와 다른 *경량 키워드 랭킹* 도구 패턴. 외부 의존 0(Python만).

---

## 한계·미검증 (격상 금지)

- **App UI(iOS/Android/RN) 편향**: SKILL.md 가 "Scope notice: App UI, not desktop-web" 명시. 작가 html-publish(웹/PPT/포스터)엔 부분만 적용.
- **README 마케팅 톤**: PayPal 후원·스타히스토리 등 홍보 섞임. 데이터/코드 자체는 충실.
- **품질 정량 검증 없음**: "161 rules·67 styles" 수치는 카탈로그 규모일 뿐, 추천 품질의 외부 벤치 없음. BM25 단순 키워드 매칭이라 *의미 추론은 LLM 몫*(엔진은 후보 제공).

---

## 반영 (학습→반영 루프)

- ✅ **design-index 등재** (2026-06-18) — 디자인 자산 군에 "제품타입→시스템 reasoning DB" 외부 도구로 포지셔닝.
- 🟡 **html-publish GUIDE §13 레지스트리 🟡 backlog 등재 완료 (2026-06-18)**: ① 산업별 anti-pattern 가드 ② 확장 pre-delivery checklist(a11y/touch/모션) = 2행 등재. 작가 ParkDal 단일톤 SSOT 건드리는 빌더 개조라 *즉시반영 X* — 실제 코드 적용은 HITL. 트리거 = 작가가 새 제품군 디자인(취업 포트폴리오 variant·게임UI) 시.
- 🟡 **도구 설치 = 작가 결정**: `uipro-cli init --ai claude` 로 설치 가능(MIT, Codex/Gemini 도 지원). 단 작가 디자인 워크플로우는 html-publish 빌더가 SSOT — 중복 도구 도입은 felt-need 검증 후(cold-verify-before-adopt).
- ❌ **억지 반영 금지**: ParkDal 통합톤과 이 repo "다양한 톤 자동추천"은 철학이 다름 — 카탈로그를 *레버 창고*로 참조하되 단일톤 SSOT 를 흔들지 않음(레버형 유동 원칙).

---

## 다음 학습 후보

- **shadcn/ui MCP** — SKILL.md 가 통합 언급(컴포넌트 검색/예시). 작가 빌더에 컴포넌트 레이어 추가 시.
- **BM25 vs graphify** — 경량 키워드 랭킹 ↔ 그래프 시맨틱 검색 도구 대조(vault 검색 인프라 포지셔닝).
- **design-system MASTER.md 패턴** — 작가 ParkDal SSOT 를 이 계층 검색 프롬프트 형식으로 재구성 가치 검토.

---

## 연결된 페이지

- design-index (디자인 자산 허브) · parkdal-design-system-spec (통합 토큰 SSOT — semantic token 동형) · html-publish GUIDE (빌더 §13 반영처)
- [Editorial Grid Design Canon — Vignelli + Müller-Brockmann (전문)](../techniques/editorial-grid-design-canon.md) · [프리미엄 UI/UX 심리학 전략 (Premium Design Methods)](premium-ui-ux-strategies.md) (디자인 지식 인접) · [충실 추출 — Manavarya09/design-extract (designlang)](../techniques/design-extract.md) (디자인 추출 도구 인접)
- *(레버형 유동 원칙 = 이 repo 가 레버 창고 구현체 / 도구 도입 전 냉정 검증 — 둘 다 작가 운영 메모리)*
