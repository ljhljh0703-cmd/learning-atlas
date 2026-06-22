---
created: 2026-06-18
updated: 2026-06-18
type: learning
tags: [tool, design-system, ui-skills, skill-routing, deslop, motion-performance, accessibility, must-never-rules, design-engineering]
source: https://github.com/ibelick/ui-skills
authors: [ibelick]
year: 2026
category: method
---

# UI Skills — Design Engineer용 라우팅 + MUST/NEVER 교정 게이트 skill 모음 (ibelick)

*GitHub repo clone 통독(1.2M, MIT, Astro 사이트 ui-skills.com) · ibelick(motion-primitives·prompt-kit 저자) · 형제 [UI/UX Pro Max — 제품타입→디자인시스템 자동추천 reasoning DB 스킬 (NextLevelBuilder)](ui-ux-pro-max-skill.md) 과 **상보 대비** — ux-pro-max=추천 DB / ui-skills=교정 게이트*

"Design Engineer 를 위한 skill". `npx ui-skills start` 가 에이전트를 *작업에 맞는 최소 UI skill set 으로 라우팅*한다. 핵심 학습 = ① **ui-skills-root 라우팅 레이어**("smallest useful context, prefer 1 never >3")가 vault RTK·Progressive Disclosure·하네스 "최소 컨텍스트" 의 외부 확증 ② **baseline-ui 등 MUST/SHOULD/NEVER 규칙 + `/skill <file>` 리뷰모드**(violations 인용→why 1줄→concrete fix)가 vault done-gate·강제 규율 4부 골격·[스펙→프롬프트 Closed-loop — 스펙 변경이 프롬프트 자동 최적화로 흐르는 파이프라인 (NAVER, 정영훈·김규철·박세)](spec-to-prompt-closed-loop.md) text gradient 의 *디자인 코드 구현체*.

---

## 한 줄 요약

> UI 작업 전 "가장 작은 유용한 skill 1개"만 라우팅해 로드(RTK), 각 skill 은 MUST/NEVER 규칙 + `/skill <file>` 리뷰모드(어디가·왜·어떻게 고쳐라)로 AI 생성 UI slop 을 교정. = vault RTK + done-gate + text gradient 의 디자인 도메인 구현.

---

## 구조 (2계층 + 큐레이션 레지스트리)

### 1. `ui-skills-root` = 라우팅 레이어 (메타 skill)
- Protocol: UI 작업인지 판단 → 아니면 `no skill needed` → 카테고리 식별 → CLI 검사 → **최소 유용 skill set 선택** → 선택분만 로드 → 구현.
- Selection Rules: **1개 선호 / 2개는 두 각도 필요 시 / 3개는 광범위 리뷰만 / 절대 3개 초과 X**. topic→stack→specificity 순, 구체 skill 우선.

### 2. 개별 skill (5종, 동일 패턴)
- **baseline-ui** — "AI 생성 UI slop 방지" opinionated baseline. MUST/SHOULD/NEVER 규칙(Stack·Components·Interaction·Animation·Typography·Layout·Performance·Design 8섹션).
- **fixing-motion-performance** — 렌더링 파이프라인(composite/paint/layout) 기반 애니 성능 규칙 9우선순위.
- **fixing-accessibility** — accessible names·keyboard·focus/dialogs·semantics·forms·announcements·contrast 9카테고리.
- **fixing-metadata** — correctness/dup·title/desc·canonical·social cards·structured data 8카테고리.
- 공통 형식: `우선순위 표 + quick reference(카테고리별 규칙) + tool boundaries(critical: 라이브러리 임의 마이그레이션 금지) + common fixes(before/after 코드) + review guidance`.
- **리뷰모드**: `/skill <file>` → violations(정확한 라인/스니펫 인용) + why(1문장) + concrete fix(코드 수준).

### 3. `registry.ts` = 외부 skill 큐레이션 (111개)
- topic 분류(accessibility·motion·systems·visual·interaction·performance·craft·taste·typography·color·3d·frontend·frameworks…)로 외부 저자 skill 라우팅. 저자: addyosmani·antfu·anthropics·microsoft·emilkowalski·dimillian·nextlevelbuilder([UI/UX Pro Max — 제품타입→디자인시스템 자동추천 reasoning DB 스킬 (NextLevelBuilder)](ui-ux-pro-max-skill.md) 저자) 등. = UI skill 생태계 인덱스.

---

## 확증 — vault 기존 자산과 정합 (재서술 X)

- **ui-skills-root "smallest useful context, prefer 1 never >3"** → vault RTK·Progressive Disclosure·외부 코딩 에이전트 Lookup Protocol "token-minimal flow". **강한 확증**(독립 도구가 같은 토큰 규율 도달).
- **MUST/NEVER + 리뷰모드(violations→why→fix)** → done-gate + 강제 규율 4부 골격(superpowers 차용) + [스펙→프롬프트 Closed-loop — 스펙 변경이 프롬프트 자동 최적화로 흐르는 파이프라인 (NAVER, 정영훈·김규철·박세)](spec-to-prompt-closed-loop.md) text gradient("어디를 어떻게"). 디자인 코드용 구현체.
- **그라데이션/퍼플 금지·accent 1개/뷰** → [UI/UX Pro Max — 제품타입→디자인시스템 자동추천 reasoning DB 스킬 (NextLevelBuilder)](ui-ux-pro-max-skill.md) 산업별 anti-pattern + design-fit-not-personality(인격 라벨 금지) 원칙.
- **transform/opacity만·200ms·prefers-reduced-motion·off-screen pause** → 모션 규칙 확증 + obsidian-no-infinite-css-animation 메모리(루프 애니 오프스크린 정지) 일치.
- **registry 외부 skill 큐레이션** → vault skill-curator(통합·archive) 인접.

---

## 진짜 새것 (vault delta)

1. **★MUST/SHOULD/NEVER 규칙 + `/skill <file>` 리뷰모드** — html-publish lint(색상 차단)보다 넓은 *UI 코드 품질 게이트*. 리뷰 출력(violations 인용→why→concrete fix)이 spec-to-prompt text gradient 의 **디자인 코드 실전 형식**. baseline-ui = "deslop" 강제 baseline(스택 무관 원칙 多).
2. **★렌더링 파이프라인 기반 모션 성능 규칙** — composite/paint/layout 글로서리 + 9우선순위(never patterns→mechanism→measurement→scroll→paint→layers→blur→view transitions→tool boundaries). vault 모션 지식의 체계화. FLIP·scroll-timeline·blur ≤8px 등 구체.
3. **라우팅 레이어 skill 패턴**(ui-skills-root) — "최소 컨텍스트 선택" 을 *메타 skill 로 명시화*. vault Lookup Protocol 의 디자인 도메인 인스턴스 + skill 라우팅 형식.
4. **topic 기반 외부 skill 레지스트리**(111개) — UI skill 생태계 큐레이션 인덱스 구조.

---

## 한계·미검증 (격상 금지)

- **React/Tailwind/motion.react 스택 편향**: baseline-ui 가 Tailwind·`motion/react`·`cn`·Base UI 전제. 작가 html-publish(single-file HTML/PPT)엔 *원칙만 부분 적용*, 코드 규칙 직접 이식 X.
- **품질 정량 검증 없음**: 규칙은 ibelick 의 opinionated 큐레이션. 외부 벤치 없음(단 저자 신뢰도 높음 — motion-primitives 등).
- **registry 111개 = 링크 인덱스**: 각 외부 skill 품질은 개별 미검증(rawUrl 참조만).

---

## 반영 (학습→반영 루프)

- ✅ **design-index 등재** (2026-06-18) — ui-ux-pro-max(추천 DB) 와 *상보*(교정 게이트)로 포지셔닝.
- 🟡 **html-publish GUIDE §13 레지스트리 🟡 backlog 등재 완료 (2026-06-18)**: baseline-ui MUST/NEVER 중 *스택 무관 원칙*(transform/opacity·z-index 스케일·empty state·accent 1개·그라데이션 금지) + 모션 성능 9규칙 = 2행 등재. 실제 `_slots.css` 코드 적용은 작가 새 제품군/UI 작업 시 트리거(HITL, React/Tailwind 코드 이식 X — 원칙만 레버).
- 🔗 **라우팅 확증**: ui-skills-root = vault RTK·Lookup Protocol 외부 확증 — 신규 룰 X, 원칙 정당화.
- 🔗 **리뷰모드 = text gradient 디자인 구현**: [스펙→프롬프트 Closed-loop — 스펙 변경이 프롬프트 자동 최적화로 흐르는 파이프라인 (NAVER, 정영훈·김규철·박세)](spec-to-prompt-closed-loop.md) 와 cross-ref(평가신호 "어디를 어떻게").
- ❌ **억지 반영 금지**: React/Tailwind 스택 규칙을 single-file HTML 빌더에 직접 이식 X. 원칙만 레버 창고로(레버형 유동).

---

## 다음 학습 후보

- **registry 외부 skill 선별 통독** — emilkowalski(모션)·addyosmani(perf)·anthropics 등 고신뢰 저자 skill 개별 흡수 후보.
- **motion-primitives / prompt-kit** (ibelick) — 같은 저자 컴포넌트 라이브러리, 모션 구현체.
- **Base UI** — baseline-ui 가 권장하는 새 primitive 시스템(Radix 후속).

---

## 연결된 페이지

- [UI/UX Pro Max — 제품타입→디자인시스템 자동추천 reasoning DB 스킬 (NextLevelBuilder)](ui-ux-pro-max-skill.md) (형제 UI skill — 추천 DB ↔ 본 페이지 교정 게이트, 상보) · design-index (디자인 자산 허브) · html-publish GUIDE (§13 반영처)
- [스펙→프롬프트 Closed-loop — 스펙 변경이 프롬프트 자동 최적화로 흐르는 파이프라인 (NAVER, 정영훈·김규철·박세)](spec-to-prompt-closed-loop.md) (text gradient = 리뷰모드 동형) · [Superpowers 해체분석 (obra/superpowers)](superpowers-teardown.md) (강제 규율 4부 골격) · [Editorial Grid Design Canon — Vignelli + Müller-Brockmann (전문)](../techniques/editorial-grid-design-canon.md) · [프리미엄 UI/UX 심리학 전략 (Premium Design Methods)](premium-ui-ux-strategies.md)
- *(RTK·레버형 유동·design-fit-not-personality·obsidian-no-infinite-css-animation = 작가 운영 메모리, 본 학습이 외부 확증)*
