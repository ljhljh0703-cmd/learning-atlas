---
created: 2026-07-13
updated: 2026-07-13
type: learning
category: method
title: "NameThat UI 해체분석 — 모호한 UI 묘사를 구현 언어로 바꾸는 Lexicon Adapter"
source: "https://namethatui.com/"
tags:
  - ui-ux
  - design-engine
  - ui-lexicon
  - prompt-engineering
  - accessibility
---
<!-- NameThat UI 해체 — 모호한 시각 묘사→canonical UI명→anatomy→스택별 API→구현/디버그 prompt 역조회 구조. 신규 skill 아닌 Design Engine 앞단 조건부 Lexicon Adapter. 데이터 수입=라이선스 불명으로 PARK. -->

# NameThat UI 해체분석

## 한 줄 결론

**NameThat UI에서 먹을 것은 56개 설명문이 아니라 `모호한 말 → 정확한 UI 후보명 → anatomy → 스택별 API → 구현/디버그 prompt → 공식 검증` 변환 구조다.**

이를 기존 디자인·에셋 스킬과 따로 노는 새 skill로 만들지 않고, 기존 Design Engine과 UI 교정 체계 **앞단의 조건부 Lexicon Adapter**로 둔다.

## Honest Assessment

| 판정 | 대상 | 이유 |
|---|---|---|
| **APPLY** | 역조회 방식, entry schema, prompt/debug anatomy, 공식검증 Gate | 기존 Sub-brain에 없는 실질 delta |
| **PILOT** | `namethatui.com` live lookup | in-domain 검색은 유용하지만 신생·비권위·telemetry 존재 |
| **PARK** | provenance를 갖춘 소규모 `ui-lexicon` 데이터 | 라이선스·저자·유지보수 이력 확인 전 대량 수입 금지 |
| **REJECT** | 56개 prompt/921개 dictionary 일괄 복제, SSOT화, accessibility authority화 | 라이선스 불명·구체 오류·API drift·coverage 편향 |

### 맛 평가

- **아주 맛있는 부분:** “저거”, “팝업 뒤 검은 거”, “움직이는 동그라미” 같은 말을 구현 가능한 명사로 바꾼다.
- **덜 익은 부분:** 2026-07-11 등록된 매우 신생 도메인이고 저자·라이선스·privacy/terms가 공개되어 있지 않다.
- **독이 될 수 있는 부분:** prompt를 그대로 실행하면 framework semantics나 accessibility 예외를 놓칠 수 있다.
- **사용자 방향성과의 연결:** 포트폴리오 UI, 게임 툴/에디터 UI, macOS·Electron 도구 수정에서 재질문과 엉뚱한 전체 재디자인을 줄인다. 게임 sprite/visual asset 생성 자체와는 별개다.

## 1. Fetch — 무엇을 실제로 확인했나

2026-07-13 기준 사이트맵의 60개 경로를 전부 확인했다.

- 패턴 entry 56개
  - macOS 31
  - Web 25
- 가이드 2개
  - AppKit vs SwiftUI
  - Swift vs Electron
- AppKit↔SwiftUI 번역표 1개, 63행
- 루트 index 1개
- sitemap 경로 60/60 HTTP 200
- 대표 page, 현재 검색 bundle, schema payload, semantic search를 직접 검사

정밀 수치:

| 단위 | 수량 |
|---|---:|
| aliases | 207 |
| 공개 fuzzy descriptions | 301 |
| 숨은 추가 search phrases | 614 |
| API mappings | 234 |
| anatomy parts | 180 |
| related edges | 198 |
| implementation prompts | 56 |
| debug prompts | 56 |
| pocket dictionary definitions | 921 |

원시 근거는 외부 workspace의 `work/site-inventory.json`, `work/source_status.tsv`, `work/semantic-search-probes.json`, `work/pages/`에 있다.

## 2. Categorize — 이건 무슨 도구인가

NameThat UI는 다음 중 앞의 두 가지다.

1. **역방향 UI 사전:** 이름을 검색하는 사전이 아니라 보이는 모습/행동을 묘사해 이름을 찾는다.
2. **AI 요청 정규화기:** 찾은 이름에 anatomy, API 후보, 구현 prompt, debug checklist를 붙인다.
3. 디자인 추천 엔진: **아님.** 어떤 스타일이 제품에 맞는지 결정하지 않는다.
4. 접근성 권위 소스: **아님.** 유용한 힌트는 있지만 공식 spec보다 우선할 수 없다.
5. screenshot recognizer: **아님.** site 자체는 이미지를 받지 않는다.
6. game/sprite asset generator: **아님.** 시각 에셋을 생성하지 않는다.

따라서 이름은 `UI Lexicon Adapter`가 가장 정확하다.

## 3. Extract — 핵심 설계

### 3.1 한 entry가 하는 일

```text
fuzzy phrase
  → canonical candidate name + aliases
  → named anatomy parts
  → framework/API candidates
  → implementation prompt
  → failure-mode debug prompt
  → confusable/related patterns
```

데이터 모양은 다음 축으로 일반화할 수 있다.

```text
concept_id
platform/surface
canonical_name
plain_aliases
anatomy_parts
semantics_role
framework_names
confusable_with
when_to_use
prompt_fragment
debug_checks
source_url
verified_at
```

`source_url`과 `verified_at`이 없는 행은 구현 authority로 승격하지 않는다.

### 3.2 prompt가 쓸 만한 이유

단순히 정의문을 명령형으로 바꾼 게 아니다. 좋은 entry는 다음을 묶는다.

- 표준 후보명
- 실제 framework symbol
- 보여야 할 state/interaction
- native 또는 ARIA semantics
- 유사하지만 다른 control과의 경계

debug prompt는 흔한 failure mode를 먼저 열거하고 실제 symptom을 뒤에 붙이는 구조다. anatomy part마다 더 작은 prompt 조각도 있어, 전체 컴포넌트를 재생성하지 않고 한 부분만 지목할 수 있다.

### 3.3 대표적으로 잘 된 항목

- **Form Field:** label, placeholder, helper, error를 분리하고 `aria-describedby`, `aria-invalid`를 연결한다.
- **Dialog / Drawer / Sheet:** 서로 비슷해 보이는 surface를 위치가 아니라 modal behavior, inert background, dismiss/focus 조건으로 나눈다.
- **Popover / Dropdown / Tooltip:** trigger, 허용 콘텐츠, keyboard model, dismissal로 구분한다.
- **Menu Bar Extra:** status icon/button, menu, popover-like window를 AppKit/SwiftUI 용어로 나눈다.
- **Drag & Drop:** grip, resize handle, insertion line, target highlight, preview를 서로 다른 anatomy로 취급한다.

## 4. 검색 해체

### 4.1 로컬 fuzzy search

현재 client는 대략 다음 우선순위로 검색한다.

```text
name 1.00
fuzzy 0.90
hidden phrases 0.85
aliases 0.75
part name 0.60
tagline 0.45
description 0.20
```

threshold는 0.35이고 전체 문구 일치를 토큰 일치보다 더 세게 반영한다. 로컬 상위 8개를 낸다.

### 4.2 semantic fallback

질의가 3자 이상이고 로컬 confidence가 0.8보다 낮으면 700ms 후 전체 질의를 `/api/search`로 전송한다. 서버 구현은 비공개다.

Sanitized 실측:

| 묘사 | top result | 판정 |
|---|---|---|
| “popup 뒤 어두운 투명 층” | Scrim | 적중 |
| “점 세 개로 more actions” | Overflow Menu | 적중 |
| “Mac clock 옆 app icon” | Menu Bar Extra | 적중 |
| “hierarchy 여는 작은 화살표” | Stepper 1위, Disclosure Triangle 2위 | 후보 검토 필요 |
| “적 머리 위 체력바” | Progress Indicator 계열 | domain miss |

한국어 일반 UI 질의도 scrim/menu-bar-extra/overflow는 1위 적중했다. 그러나 게임 UI처럼 coverage 밖인 질의에도 abstain하지 않고 후보를 낸다.

**해석:** search score는 정답 확률이 아니다. 플랫폼·domain Gate가 먼저다.

### 4.3 Privacy Gate

검색어, 결과 수, miss, 선택, 이전 질의와 page view가 `/api/log`로 전송될 수 있고 Cloudflare analytics도 로드된다.

금지 입력:

- 비공개 프로젝트/기능명
- repo path, code, token, internal URL
- 사용자·고객·회사 식별자
- 공개 전 제품 화면의 고유 문구

필요하면 screenshot을 AI가 먼저 **일반화된 외형·기능·위치 문구**로 바꾼 뒤 그 문구만 조회한다.

## 5. Reflect — 어디까지 믿을 수 있나

### 5.1 맞는 예도 있다

- Apple 공식 문서는 `MenuBarExtra`를 system menu bar에 남는 persistent control로 설명하며, `.window` style을 popover-like window로 정의한다.
- MDN과 W3C APG는 modal dialog의 top layer/inert background/focus containment/Escape behavior를 설명하며 NameThat의 dialog 핵심과 대체로 맞는다.
- Form Field의 실제 label과 description/error 연결은 실무적으로 유용하다.

### 5.2 그대로 복사하면 안 되는 예도 있다

1. **Radix Toggle Group:** NameThat은 Radix primitive와 `radiogroup/radio/aria-checked`를 한 prompt에 묶는다. Radix 공식 문서는 이를 pressed two-state button 집합으로 설명한다. 실제 DOM semantics를 확인해야 한다.
2. **Combobox:** 주요 role은 담지만 editable autocomplete 유형, popup의 Tab 순서 등 APG 조건을 충분히 전달하지 않는다.
3. **Tabs:** 좌우 이동과 activation을 단순화한다. APG는 즉시 activation을 panel preload/latency 조건과 연결하고 manual mode와 vertical orientation도 둔다.
4. **Marquee:** hover pause와 reduced motion만으로 WCAG의 pause/stop/hide 요구가 자동 충족되지는 않는다.
5. **API freshness:** 번역표의 `.toolbarOverflowMenu`는 현재 Apple 문서에서 Beta다. site에는 version warning이 없다.

따라서 entry의 API/prompt는 **implementation candidate**, Apple/W3C/MDN/library docs는 **verification authority**다.

## 6. Connect — Sub-brain과 비교한 실제 delta

### 이미 있는 것

| 기존 자산 | 이미 담당하는 역할 |
|---|---|
| `wiki/learnings/product-design-and-ux-writing.md` | UI/UX/Product 구분, microcopy surface |
| `wiki/learnings/methods/ui-ux-pro-max-skill.md` | UI 패턴/스타일 추천 데이터 |
| `wiki/learnings/methods/ui-skills-ibelick.md` | correction, accessibility, quality Gate |
| `wiki/learnings/methods/frontend-design-skill-selection-matrix.md` | surface와 framework routing |
| `wiki/design-taste.md` | taste, semantic interaction, system fit |
| `wiki/learnings/methods/spec-to-prompt-closed-loop.md` | spec→prompt→verification loop |
| `wiki/projects/design-engine-brief.md` | 추천·교정·미감·검증 통합 |

### 없던 것

1. 모호한 시각 묘사에서 canonical UI 후보명을 찾는 **reverse lookup**
2. 컴포넌트 전체가 아니라 수정할 **anatomy part** 이름 지정
3. alias와 **confusable-with** 경계
4. 일반어를 AppKit/SwiftUI 또는 HTML/ARIA/library symbol로 바꾸는 **framework translation**
5. 후보명에 붙는 **implementation/debug prompt fragment**

이 다섯 가지가 이번의 real delta다.

## 7. 유기적 배치 — 따로 놀지 않게 붙이는 법

### 제안 파이프라인

```text
사용자 묘사 또는 screenshot 관찰
  → 민감정보 제거 + target surface/stack 잠금
  → NameThat형 Lexicon Adapter로 후보명/anatomy 추출
  → 기존 repo/component 존재 여부 확인
  → Apple/W3C/MDN/library 공식 문서 검증
  → Design Engine의 추천·교정·미감·검증 축
  → 기존 UI skill의 accessibility/render Gate
  → 구현 및 evidence
```

### 소유권

- **Lexicon Adapter:** “이걸 뭐라고 부르지?”만 해결한다.
- **frontend selection matrix:** 어떤 surface/stack인지 결정한다.
- **Design Engine:** 무엇을 선택하고 어떻게 다듬을지 결정한다.
- **ui-skills-ibelick:** accessibility/quality 교정과 Gate를 소유한다.
- **asset/image/sprite skills:** 시각 에셋 생성·편집을 소유한다. Lexicon Adapter가 이를 대체하거나 자동 호출하지 않는다.

### 배치 후보 — Vault Claude Gate 후에만

1. `wiki/design-index.md` UI/UX 절에 live reference 링크와 privacy/authority 경계 추가
2. `frontend-design-skill-selection-matrix`에서 surface/stack 분류 후 조건부 lookup hook 추가
3. provisional Design Engine 내부에 독립 실행 skill이 아닌 `ui-lexicon` adapter/data contract 추가
4. 소규모 고빈도 항목만 공식 출처와 `verified_at`을 붙여 수기 축적

이 reference lookup은 디자인 실행 skill이 아니므로 기존 “최대 2개 design skill” 제한과 경쟁시키지 않는 편이 맞다.

### 왜 standalone skill이 아닌가

- 이름을 찾은 뒤에도 기존 추천·교정·검증 단계가 반드시 필요하다.
- standalone으로 만들면 router와 authority가 중복된다.
- site coverage가 macOS/Web에 치우쳐 global UI skill로 부르기 어렵다.

**[Skill candidate] 없음 — 기존 Design Engine의 조건부 reference adapter로 흡수하는 것이 더 안전하다.**

## 8. 실전 사용법

### 호출 조건

다음 중 하나일 때만 쓴다.

- “그 점 세 개”, “팝업 뒤 검은 것”처럼 이름이 불명확하다.
- screenshot에서 한 부분만 고쳐야 한다.
- AppKit/SwiftUI/Electron/Web 사이 용어가 섞인다.
- popover/dropdown/tooltip, switch/checkbox/radio처럼 혼동이 잦다.

다음에는 건너뛴다.

- 정확한 component/API를 이미 알고 있다.
- 게임 HUD, iOS, Android, Windows 전용 패턴이다.
- sprite, icon, material, character, environment asset를 생성하려는 일이다.

### 7단계

1. **Surface/stack 잠금:** web/native macOS/Electron, AppKit/SwiftUI/React 등을 먼저 확인한다.
2. **Sanitize:** 화면을 외형+동작+위치의 일반 문장으로 바꾸고 고유명사를 지운다.
3. **Candidate lookup:** 상위 1개를 정답으로 확정하지 말고 1~3개 후보와 confusable 항목을 본다.
4. **Repo truth:** 실제 코드에 어떤 component/library가 이미 있는지 찾는다.
5. **Official check:** 해당 stack의 현재 공식 문서에서 semantics/API/version을 확인한다.
6. **Prompt enrich:** 이름만 붙이지 말고 아래 공식을 채운다.
7. **Gate:** keyboard, focus, screen reader, responsive state, visual render와 회귀를 검증한다.

### prompt 공식

```text
[surface/stack]
+ [canonical component candidate]
+ [target anatomy part]
+ [desired state/behavior]
+ [native/ARIA semantics]
+ [existing repo file/component]
+ [do-not-confuse boundary]
+ [done evidence]
```

예:

```text
Web/React의 기존 modal component에서 dialog 뒤의 scrim(::backdrop)만 조정한다.
dialog 자체의 크기와 콘텐츠는 바꾸지 않는다. showModal 기반 modal semantics,
Escape, focus return, inert background를 유지한다. 기존 component를 재사용하고
keyboard check와 before/after render로 완료를 증명한다.
```

NameThat이 공급하는 것은 `scrim`, `::backdrop`, 혼동 경계까지다. repo 위치, 제품 의도, 스타일 판단, 완료 증거는 기존 파이프라인이 공급한다.

## 9. 사용자 작업에 대한 우선순위

### P0 — 지금 흡수

- 모호한 UI 말→후보명→공식검증 routing
- anatomy 단위 수정 요청
- implementation prompt와 debug prompt 분리
- confidential query 차단
- out-of-domain 결과는 abstain/수동 분류

### P1 — 작은 파일럿

세 건으로 시험한다.

1. 포트폴리오 Web UI 수정 1건
2. macOS/SwiftUI/AppKit 또는 Electron 도구 UI 수정 1건
3. game HUD negative control 1건

측정:

- top-3 후보 적중률
- clarification turn 감소
- 잘못된 전체 component 재생성 횟수
- 공식문서 교차검증률 100%
- 민감 질의 0건
- keyboard/a11y/render Gate 결과

### P2 — 조건부 데이터화

저자·라이선스·운영 이력이 확인되고 P1이 유용성을 증명한 뒤에만 소규모 provenance glossary를 검토한다. site dataset bulk import는 계속 금지한다.

## 10. 안티 오버클레임 경계

- “AI가 screenshot에서 UI를 자동 식별한다”라고 쓰지 않는다.
- “accessibility-compliant prompt”라고 보증하지 않는다.
- “모든 UI platform을 포괄한다”라고 쓰지 않는다.
- search score를 confidence probability로 부르지 않는다.
- `robots.txt` 허용을 재사용 license로 해석하지 않는다.
- live site가 계속 유지되거나 데이터가 안정적일 것이라 가정하지 않는다.
- macOS/Web 용어를 게임 HUD taxonomy로 재사용하지 않는다.

## 11. Suggest Next — 다음 학습 3개

1. **공식-spec 기반 UI semantics glossary:** W3C APG/HTML/Apple 문서로 고빈도 20개를 독립 검증한다.
2. **coverage 확장 연구:** iOS/UIKit, Android/Material, Windows/WinUI, game HUD를 동일 schema로 비교하되 별도 domain으로 유지한다.
3. **Lexicon Adapter eval:** top-k 정확도뿐 아니라 clarification 감소, wrong-component edit, accessibility 회귀를 측정하는 작은 harness를 설계한다.

## 12. 게이트 판정 (③Gate 2026-07-13 — Apply-or-Park)

- **✅ Apply (반영 완료):** 본 learning node = 방법(역조회 Lexicon Adapter) 흡수 정본. Codex 자산 SHA-256 `17e49b20…` 검증 일치, 라이선스/저자 미공개(FAIL/UNKNOWN)·구체 accuracy caveat 5종 정직 표기 확인.
- **🅿️ Park (반영처 있으나 미결정 — 작가 판정 대기):**
  - 기존 Design Engine 앞단 조건부 adapter 채택 + `frontend-design-skill-selection-matrix` 조건부 lookup hook — 해제 조건: Design Engine 정식화 시.
  - `design-index` UI/UX 절에 live reference 링크 + privacy/authority 경계 — 저위험이나 작가 OK 후 배선(반영처 = design-index).
  - P1 파일럿(포폴 Web + macOS 도구 + game HUD negative control 3건) — 실제 작업 발생 시.
- **❌ Reject / STOP:** 56 prompt·921 dictionary 일괄 복제 · site 결과를 UI/a11y SSOT 승격 · 민감 프로젝트명 검색 · sprite/image generator 자동 결선.
- **주의:** entry 의 API/prompt = *implementation candidate*, Apple/W3C/MDN/library 공식문서 = *verification authority* (이 경계 붕괴 금지).

## 연결

- [UI/UX Pro Max — 제품타입→디자인시스템 자동추천 reasoning DB 스킬 (NextLevelBuilder)](ui-ux-pro-max-skill.md) — UI 패턴/스타일 *추천* (Lexicon Adapter 는 명명만, 추천 아님).
- [UI Skills — Design Engineer용 라우팅 + MUST/NEVER 교정 게이트 skill 모음 (ibelick)](ui-skills-ibelick.md) — accessibility/correction *권위* 유지(Adapter 가 대체 X).
- [Frontend Design Skill Selection Matrix — surface 분류 → 최소 스킬 라우터](frontend-design-skill-selection-matrix.md) · design-index · design-taste — surface/stack routing·미감·배치 후보.
- [스펙→프롬프트 Closed-loop — 스펙 변경이 프롬프트 자동 최적화로 흐르는 파이프라인 (NAVER, 정영훈·김규철·박세)](spec-to-prompt-closed-loop.md) — spec→prompt→verification loop 결.
- [sprite-gen 해체 — component-row 스프라이트 아틀라스 생산 파이프라인 (hatch-pet 일반화판)](sprite-gen-skill.md) · [픽셀아트 게임 에셋 제작 심화](../techniques/pixel-art-game-assets.md) — 시각 에셋 생성 소유처(Adapter 와 자동 연결 안 함).

## Sources

- NameThat UI: https://namethatui.com/
- AppKit vs SwiftUI: https://namethatui.com/appkit-vs-swiftui
- Swift vs Electron: https://namethatui.com/swift-vs-electron
- Translation table: https://namethatui.com/translate
- Apple MenuBarExtra: https://developer.apple.com/documentation/swiftui/menubarextra
- Apple MenuBarExtraStyle: https://developer.apple.com/documentation/swiftui/menubarextrastyle
- W3C APG patterns: https://www.w3.org/WAI/ARIA/apg/patterns/
- W3C APG modal dialog: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- W3C APG combobox: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
- W3C APG tabs: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
- WCAG Pause, Stop, Hide: https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide
- MDN `showModal()`: https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal
- Radix Toggle Group: https://www.radix-ui.com/primitives/docs/components/toggle-group
- Verisign RDAP: https://rdap.verisign.com/com/v1/domain/namethatui.com

## Evidence

- `../work/2026-07-13-name-that-ui-source-mechanism-evidence.md`
- `../work/site-inventory.json`
- `../work/source_status.tsv`
- `../work/semantic-search-probes.json`
- `../work/pages/`
