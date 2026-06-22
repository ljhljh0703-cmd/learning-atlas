---
created: 2026-04-22
updated: 2026-06-16
type: learning
tags: [design-system, tooling, agent, frontend, tokens, google]
source: https://github.com/google-labs-code/design.md
category: method
---

> **2026-06-16 1차 출처 재대조(repo README)**: 본 페이지는 충실하나 alpha repo 변동으로 3곳 드리프트 정정 — lint 규칙 7→**9**(`missing-sections`·`unknown-key` 추가), CLI "3종"→**4종**, export 포맷 명칭 정밀화(json-tailwind v3 / css-tailwind v4 / dtcg), 라이선스 Apache-2.0 기재.

# DESIGN.md — 코딩 에이전트용 디자인 시스템 명세

*Google Labs (alpha)*

> **AI NPC blueprint와의 직결성: 없음.** 프로덕트(북켓몬, 슈퍼센트 포트폴리오 PDF, 게임 UI) 디자인 일관성 도구.
> 분류: method (도구), 적용성: 직접, 시급성: 중기.

토큰 + 산문을 한 파일에 묶어 **사람도 에이전트도 같은 진실을 본다**. CLAUDE.md가 코드 컨벤션을 잡듯, DESIGN.md는 시각 일관성을 잡는다.

---

## 한 줄 요약

> YAML frontmatter(토큰) + Markdown 본문(설계 근거)을 하나의 `DESIGN.md` 파일로 묶어 코딩 에이전트가 "왜 이 색을 썼는지"까지 일관되게 적용하도록 만든 포맷 + CLI.

---

## 핵심 개념

### 1. 이중 구조 = 핵심 차별화

```
---
name: Heritage
colors:
  primary: "#1A1C1E"
  tertiary: "#B8422E"      # "Boston Clay"
typography:
  h1: { fontFamily: Public Sans, fontSize: 3rem }
---

## Overview
Architectural Minimalism meets Journalistic Gravitas.

## Colors
- **Primary:** Deep ink for headlines.
- **Tertiary (Boston Clay):** sole driver for interaction.
```

- **YAML 토큰** = 정답 (normative)
- **Markdown 산문** = 왜 + 어떻게 적용 (rationale)

### 2. 기존과의 차이

| 비교 대상 | DESIGN.md의 차별점 |
|-----------|---------------------|
| W3C DTCG / Style Dictionary | 토큰만 vs **토큰 + 산문**. 자체 완결적 plain text |
| Tailwind config | 단일 생태계 종속 vs **양방향 변환** (Figma, DTCG, Tailwind 모두) |
| Figma variables | UI 도구 종속 vs **에이전트 친화 plain text** |

### 3. CLI 4종

```bash
npx @google/design.md lint DESIGN.md                          # 검증 (9개 룰)
npx @google/design.md diff a.md b.md                          # 토큰 변경/회귀 탐지
npx @google/design.md export --format css-tailwind DESIGN.md  # json-tailwind(v3) / css-tailwind(v4) / dtcg
npx @google/design.md spec                                    # 스펙을 에이전트 prompt에 주입용
```

### 4. 9개 lint 규칙 (repo 현행, 2026-06-16 대조)

| 규칙 | 검사 |
|------|------|
| `broken-ref` | `{colors.primary}` 미정의 참조 |
| `missing-primary` | primary 부재 |
| `contrast-ratio` | WCAG AA 4.5:1 미만 |
| `orphaned-tokens` | 정의했으나 미사용 |
| `token-summary` | 토큰 통계 |
| `missing-sections` | 필수 섹션 누락 |
| `missing-typography` | 색만 있고 폰트 없음 |
| `section-order` | 정해진 섹션 순서 위반 |
| `unknown-key` | 스키마에 없는 키 |

→ 에이전트가 디자인 일관성 위반을 **structured JSON**으로 즉시 받음. (심각도는 repo 버전별 변동 — error/warning/info 혼재, 채택 시 `lint` 출력으로 확인.)

### 5. 섹션 표준 순서

Overview → Colors → Typography → Layout → Elevation → Shapes → Components → Do's and Don'ts

→ 누락 가능, 그러나 **있다면 이 순서**.

### 6. 관용성 (interpretability over strictness)

- 모르는 섹션/토큰 이름 = **보존**
- 모르는 컴포넌트 속성 = warning + 수용
- 중복 섹션만 error
- → 포맷이 자연스럽게 진화 가능

---

## 공식 스펙 상세 (spec.md — research-relay ④Gate 검증 2026-06-16)

> origin: external_ai (via gpt), confirmed_by: user. vault Claude 가 spec.md 1차 재대조로 핵심 구조 전건 일치 확인(8섹션·스키마 키·Dimension·{path}·consumer behavior). 통합 DESIGN.md 빌드 토대.

### YAML 토큰 스키마 (top-level 키)
```
version      # optional, 현재 "alpha"
name         # required
description  # optional
colors:      map<string, Color>
typography:  map<string, Typography>
rounded:     map<string, Dimension>
spacing:     map<string, Dimension | number>
components:  map<string, map<string, string | tokenRef>>
```
- **Color**: 유효 CSS color string — hex·named·rgb/rgba·hsl/hsla·hwb·**oklch/oklab/lch/lab**·color-mix. WCAG 대비 검사 위해 내부 sRGB 변환(원포맷 보존).
- **Typography 속성**: fontFamily·fontSize·fontWeight·lineHeight·letterSpacing·fontFeature·fontVariation.
- **Dimension 단위**: `px·em·rem` 만.
- **token reference**: `{path.to.token}` (예 `{colors.primary}`). components 안에서 `{typography.label-md}` 같은 composite 참조 허용.

### Canonical 섹션 = **8개** (공식, 순서 고정)
Overview(alias *Brand & Style*) → Colors → Typography → Layout(alias *Layout & Spacing*) → Elevation & Depth → Shapes → Components → Do's and Don'ts.
- ⚠️ **"Visual Theme" 섹션은 공식에 없음**. [awesome-design-md — 브랜드별 DESIGN.md 69종 레퍼런스 컬렉션](awesome-design-md.md)의 "9섹션"은 VoltAgent *확장*(Responsive Behavior·Agent Prompt Guide 추가, Overview→Visual Theme 개명) — 공식과 구분.
- 권장(non-normative) 토큰명: colors `primary/secondary/tertiary/neutral/surface/on-surface/error` · typography `headline-*/body-*/label-*` · rounded `none/sm/md/lg/xl/full`.

### Consumer Behavior (unknown content)
unknown 섹션=보존(error X) · unknown color/typography 토큰=값 valid면 accept · unknown spacing=string store · unknown component 속성=accept+warning · **중복 섹션 heading=error/reject**.

### export 파생 경로 (통합 DESIGN.md 핵심)
- `export --format css-tailwind` → Tailwind v4 `@theme{}` + CSS 변수 namespace `--color-* / --font-* / --text-* / --leading-* / --tracking-* / --font-weight-* / --radius-* / --spacing-*` → **html `_tokens.css` 파생 출발점**.
- `export --format dtcg` → W3C DTCG `tokens.json` → **ppt `tokens.json` adapter 중간표준**(ppt 내부 스키마는 별도 정의 필요).
- `export --format json-tailwind`(=`tailwind`) → Tailwind v3 `theme.extend` JSON.
- 원문 우선순위(token=normative / prose=context) → **DESIGN.md=SSOT, `_tokens.css`·`tokens.json`=파생물**(직접 편집 X, 재생성).

## 내 생각 — 적용 관점

### 직접적 연결: **없음 (NPC blueprint)** / **높음 (프로덕트)**

블루프린트 어디에도 안 들어감. 그러나:

| 적용 후보 | 이유 |
|----------|------|
| bookemon 프론트엔드 | 크로스팀 협업 — FE/AI 사이 토큰 합의 문서화 |
| 슈퍼센트 포트폴리오 PDF | 다이어그램/표 색 일관성을 lint로 보장 |
| 향후 게임 UI | NPC와 무관하게 게임 자체 UI |
| Sub brain Obsidian theme | 위키 자체의 시각 정체성 (장기 후보) |

### 개념적 수확

1. **CLAUDE.md ↔ DESIGN.md 짝**:
   - CLAUDE.md = 코드 행동 명세 (이 위키에 이미 있음)
   - DESIGN.md = 시각 행동 명세
   - → "에이전트 협업의 두 축" 패턴 확립
2. **토큰 + 산문 = "설계 의도까지 살아있는 문서"**:
   - 내 위키의 vision/blueprint 이중 구조와 같은 발상
   - 토큰(정답) ↔ 산문(왜) = blueprint(어떻게) ↔ vision(왜)와 동형
3. **lint를 "원칙의 자동 검사"로**:
   - 디자인 lint는 일종의 미적 PDCA Check
   - 동일 패턴이 글쓰기/세컨드브레인에도 적용 가능 (관계 맺지 않은 페이지 = orphaned-tokens 비유)

### 갤럽 강점 연결

traits "전략" — 여러 도구를 평가해 최적 조합. CLAUDE.md + DESIGN.md를 짝으로 운용 = 두 채널 동시 거버넌스.

---

## 열린 질문

- DESIGN.md가 한국어 폰트 시스템(웹폰트, OTF 가변폰트)에 충분한가
- Obsidian의 Markdown 시스템과 frontmatter 충돌 없이 공존하는가 (양쪽이 frontmatter 사용)
- alpha 단계 — 1.0 전 깨질 가능성: 지금 채택의 위험 vs 학습 가치
- DTCG export로 다른 디자인 도구로 넘기는 워크플로우의 실효성
- 게임 엔진(Unity/Unreal)에서 DTCG를 받는 어댑터 존재 여부

---

## 다음 학습 후보

- **W3C DTCG (Design Tokens Format Module)** — DESIGN.md가 호환 표적으로 삼는 표준
- **Style Dictionary** — Amazon이 만든 토큰 빌드 시스템, 비교 학습
- **Tailwind theme config** — 가장 광범위한 토큰 채택 사례
- **shadcn/ui 토큰 체계** — 에이전트 친화 컴포넌트 + 토큰 결합 사례
- **Figma → tokens.json 워크플로우** — 디자이너 ↔ 에이전트 양방향 파이프라인

---

## 적용 아이디어

### 단기 (지금)
- 슈퍼센트 포트폴리오용 미니 DESIGN.md 작성 시도 (Heritage 톤 참고)
- bookemon FE에 DESIGN.md 도입 검토 (PoC 단계라 비용 적음)

### 중기
- Obsidian Sub brain theme의 시각 정체성을 DESIGN.md로 명시 (창작자 정체성의 시각 확장)
- 슈퍼센트 합격 시 첫 90일 도구 후보로 보유

### 장기
- 게임 UI 프로젝트에서 CLAUDE.md + DESIGN.md 짝 운용
- "Design system as natural language program" 글/실험

---

## 연결된 페이지

- [DESIGN.md 컴포저 — 레버 조립 템플릿](design-md-composer.md) — 본 포맷으로 레버 조립하는 실전 템플릿
- [Autoresearch — Karpathy의 자동 연구 루프](autoresearch-karpathy.md) — "natural language program" 패턴의 형제 (CLAUDE.md / program.md / DESIGN.md 가족)
- bookemon — 적용 후보 1순위
- index — 위키의 메타 도구 컬렉션

---

## 출처

- 저장소: <https://github.com/google-labs-code/design.md>
- npm: `npm install @google/design.md`
- 영감: [W3C Design Tokens Format Module](https://tr.designtokens.org/format/)
