---
created: 2026-05-25
updated: 2026-06-16
type: learning
tags: [skill, agent-prompt, workflow, hard-gate, agents-md, design-md, methodology]
source: https://github.com/heygen-com/hyperframes/blob/main/skills/hyperframes/SKILL.md
category: method
---

# Hyperframes Skill 패턴 — 5-step 강제 워크플로우 + Hard Gate

> 출처: [Hyperframes — HTML→Video 결정론적 렌더링 프레임워크](../techniques/hyperframes.md) §"Skill 의 5-step 강제 워크플로우". `skills/hyperframes/SKILL.md` 의 운영 메타 패턴만 추출.
> 목적: 작가 vault 의 기존 SKILL 들(graphify, html-publish 등)에 차용 가능한 *행동 강제 프로토콜*.

관련 — [Hyperframes — HTML→Video 결정론적 렌더링 프레임워크](../techniques/hyperframes.md) (본체) · [Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](karpathy-guidelines.md) (Surface Assumptions 와 정합) · [Hermes Agent — Nous Research 자가개선형 에이전트 플랫폼](../techniques/hermes-agent.md) (skill 자가성장)

---

## 1. 핵심 아이디어

대부분의 SKILL.md 는 *지식*을 담는다 — "이런 게 있다, 이렇게 쓰면 된다". Hyperframes 의 SKILL.md 는 *행동 절차*를 담는다 — "*순서대로* 이걸 *먼저*, 그 다음 저걸 해라. 안 하면 실패".

차이 — **knowledge skill** vs **procedural skill**. Hyperframes 는 후자의 정수.

작가 vault 의 SKILL 들은 현재 대부분 knowledge 중심 (graphify 등). 본 패턴 도입 시 *작업 품질의 일관성*이 올라감 (Karpathy #1·#4 강화).

---

## 2. 5-Step 강제 워크플로우

```
1. Discovery (이해)
   ↓
2. Design System (스타일 SSOT 확인) ← Hard Gate
   ↓
3. Prompt Expansion (의도 grounding)
   ↓
4. Plan (구조 선언)
   ↓
5. Layout Before Animation (정적 → 동적)
```

### Step 1 — Discovery (이해)
*"For open-ended requests, establish audience, platform, priority, and variation preferences before committing to direction."*

- 청중·플랫폼·우선순위·변형 선호 *먼저 확정*
- 작가 vault 적용 — html-publish 라면 "용도(포트폴리오/이력서/강연)·청중·길이·톤" 우선 질문
- Karpathy #1 (Surface Assumptions) 의 도메인 특화 버전

### Step 2 — Design System (스타일 SSOT 확인) ⚠️ Hard Gate
*"Read `design.md` if it exists (exact source of truth). Otherwise: pick a named style from `visual-styles.md`, use the design picker tool, or fall back to `house-style.md`."*

> **Hard Gate**: "Before writing ANY composition HTML — verify you have a visual identity. If you're reaching for #333, #3b82f6, or Roboto, you skipped it."

핵심 — *어떻게* 가 아니라 *어디 봐야 하나* 를 강제. 기본값 fallback 차단 (환각 색·폰트 차단).

작가 vault 적용 — DESIGN.md 신설 후 작가 SKILL 들이 *반드시 그 파일 먼저 read*. 없으면 fallback 정책 명시 (예: html-publish 의 기존 가이드).

### Step 3 — Prompt Expansion (의도 grounding)
*"Run per `references/prompt-expansion.md` to ground intent against brand values and house style, producing a consistent intermediate spec."*

- 사용자 한 줄 요청 → 브랜드·하우스 스타일에 grounding 된 *중간 스펙* 으로 확장
- 작가 vault 적용 — 외부 LLM 디벨롭 워크플로우(당시 Gemini)의 *Agenda 큐* 등가 (옵션 3-4 제시 + Pillar 정합 점검)

### Step 4 — Plan (구조 선언)
*"Declare what, structure (scenes/tracks), rhythm (fast-fast-SLOW pattern), timing, layout, and animation approach **before** coding."*

- 코드 작성 *전에* 구조 명시
- 작가 vault 적용 — 큰 작업은 TaskCreate / 작은 작업은 1-2줄 의도 선언 후 진행

### Step 5 — Layout Before Animation (정적 → 동적)
*"Build static HTML+CSS for the hero frame (maximum visibility moment) first. Position all elements where they should land when fully visible. Only then add GSAP entrance/exit tweens."*

- 최종 상태 *먼저* 정적으로 완성. 그 다음 *진입 모션* 만 추가
- 패러다임 — CSS = 최종 상태 SSOT, 애니메이션 = "그 상태로 가는 여정" 만 기술
- 작가 vault 적용 — 글쓰기에도 동형. "*결론·핵심 메시지 먼저 박제 → 그 다음 도입·근거*" 패턴.

---

## 3. Hard Gate 패턴 일반화

`skills/hyperframes/SKILL.md` 가 보여준 Hard Gate 의 일반형:

```
[Hard Gate 템플릿]
  Before <action>, verify you have <SSOT artifact>.
  If you're reaching for <common default>, you skipped it.
```

예시 — Hyperframes:
- action = "writing ANY composition HTML"
- SSOT artifact = "a visual identity (design.md)"
- common default = "#333, #3b82f6, or Roboto"

### 작가 vault 차용 후보 Hard Gate

| Skill | Hard Gate 후보 |
|---|---|
| `html-publish` | "Before writing HTML, verify DESIGN.md (or visual-styles.md) read. Default to #f0f / 8px / Helvetica = skipped." |
| `graphify` | "Before querying, verify graphify-out/ exists. Reaching for grep/Read first = skipped." |
| (가칭) `application-essay` | "Before drafting essay, verify strategy.md (해당 회사). 자기소개서 일반론 = skipped." |
| (가칭) `archive-paper` | "Before writing techniques/ entry, verify category (techniques vs methods). 둘 다 fit 같으면 = 분리 안 한 채 임시 작성 후 사용자 컨펌." |

→ 본 Hard Gate 들은 작가 컨펌 후 각 SKILL 에 박제. 본 문서는 *카탈로그* 일 뿐.

---

## 4. 적용 우선순위

| # | 차용 | 우선순위 | 트리거 |
|---|---|---|---|
| 1 | DESIGN.md 신설 (vault 시각·문서 SSOT) | 🔴 선행 의무 | 본 패턴 작동 전제 |
| 2 | 기존 SKILL 에 Step 2 (Design System 의무 read) 추가 | 🟡 #1 완료 후 | html-publish 부터 시작 |
| 3 | Hard Gate 표현 도입 | 🟢 점진 | 작가 cherry-pick |
| 4 | 5-step 전체 위계 적용 | 🟢 신규 SKILL 부터 | 기존 SKILL 강제 변환 X |

---

## 5. 검증 기준 (이 패턴 차용했는지 판별)

| 질문 | Yes 조건 |
|---|---|
| SKILL 작동 시 *첫 행동* 이 read 인가? | Step 2 Design System 또는 등가 SSOT read |
| 사용자 한 줄 요청에 즉시 *코드/문서 작성* 하는가? | ❌ — Step 1·3 의 grounding 거쳐야 함 |
| 기본값 (회색 #333, 16px 등) 으로 *조용히* fallback 하는가? | ❌ — Hard Gate 가 차단해야 함 |
| 최종 상태 *먼저* 그리고 진입 추가하는가? (글이든 코드든) | ✅ |
| 사용자가 "다시 해" 라고 했을 때 *어느 step 누락* 인지 명명 가능한가? | ✅ — 5-step 위계가 진단 도구 역할 |

---

## 6. 한계 / 부적합 케이스

- ❌ 단발 작업 — "이 한 줄 고쳐" 류엔 5-step 과잉
- ❌ 명확한 SSOT 가 없는 도메인 — Step 2 fallback 정책이 약하면 작동 X
- ❌ 작가 직접 작성 (사람) 작업 — 본 패턴은 *AI 에이전트* 행동 강제용. 사람에겐 가이드라인.

---

## 7. 출처

- [hyperframes/skills/hyperframes/SKILL.md](https://github.com/heygen-com/hyperframes/blob/main/skills/hyperframes/SKILL.md)
- [Hyperframes — HTML→Video 결정론적 렌더링 프레임워크](../techniques/hyperframes.md) §"Skill 의 5-step 강제 워크플로우"
- [Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](karpathy-guidelines.md) (Surface Assumptions, Goal-Driven Execution 정합)
