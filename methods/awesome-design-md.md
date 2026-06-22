---
created: 2026-04-22
updated: 2026-06-16
type: learning
tags: [design-system, tooling, agent, frontend, tokens, awesome-list, reference]
source: https://github.com/VoltAgent/awesome-design-md
category: method
---

> **2026-06-16 1차 출처 재대조(repo)**: 컬렉션 증가로 정정 — **69→73종**, 카테고리 8→**10**(`Retro Web (Nostalgia)` 2 추가, `Media & Consumer Tech` 11→12). 9섹션 스키마(Responsive Behavior·Agent Prompt Guide 포함)·엔트리 3파일 구성·MIT = 확인 일치.

# awesome-design-md — 브랜드별 DESIGN.md 69종 레퍼런스 컬렉션

*VoltAgent 큐레이션 (MIT)*

> **AI NPC blueprint와의 직결성: 없음.** [DESIGN.md — 코딩 에이전트용 디자인 시스템 명세](design-md.md) 학습의 실전 보완.
> 분류: method (레퍼런스 컬렉션), 적용성: 직접, 시급성: 중기.

[DESIGN.md — 코딩 에이전트용 디자인 시스템 명세](design-md.md)가 "어떻게 쓰나"라면, 여기는 **"세계 일류 브랜드가 쓰면 이렇게 나온다"** 의 69개 예시집.

---

## 한 줄 요약

> 실제 공개 사이트(Apple, Stripe, Linear, Notion, 페라리, BMW 등 69종)의 시각 정체성을 **즉시 copy-paste 가능한 DESIGN.md**로 추출해 놓은 큐레이션. 확장된 9개 섹션 스키마 제안 포함.

---

## 핵심 관찰

### 1. 확장된 9개 섹션 (Google 기본 8개 + 확장)

| # | 섹션 | Google 기본 대비 |
|---|------|--------|
| 1 | Visual Theme & Atmosphere | = Overview |
| 2 | Color Palette & Roles | = Colors + semantic role |
| 3 | Typography Rules | = Typography |
| 4 | Component Stylings | = Components |
| 5 | Layout Principles | = Layout |
| 6 | Depth & Elevation | = Elevation |
| 7 | Do's and Don'ts | = Do's and Don'ts |
| 8 | **Responsive Behavior** | **신규** — breakpoints, touch targets |
| 9 | **Agent Prompt Guide** | **신규** — 바로 쓸 수 있는 prompt 스니펫 |

→ 9번이 중요: DESIGN.md를 **에이전트 소비 관점**으로 완성.

### 2. 컬렉션 구성 (73개 / 10 카테고리 — 2026-06-16 현행)

10개 카테고리 (+ Retro Web 2 · Media 12):
- AI & LLM Platforms (Claude, Cohere, ElevenLabs, Mistral, Ollama, Replicate, VoltAgent, xAI 등 12)
- Developer Tools & IDEs (Cursor, Expo, Lovable, Raycast, Superhuman, Vercel, Warp 7)
- Backend/DB/DevOps (ClickHouse, HashiCorp, MongoDB, PostHog, Sanity, Sentry, Supabase 등 8)
- Productivity/SaaS (Cal.com, Intercom, Linear, Mintlify, Notion, Resend, Zapier 7)
- Design/Creative (Airtable, Clay, Figma, Framer, Miro, Webflow 6)
- Fintech/Crypto (Binance, Coinbase, Kraken, Mastercard, Revolut, Stripe, Wise 7)
- E-commerce (Airbnb, Meta, Nike, Shopify, Starbucks 5)
- Media/Consumer (Apple, IBM, NVIDIA, Pinterest, PlayStation, SpaceX, Spotify, Verge, Uber, Vodafone, WIRED 11)
- Automotive (BMW, Bugatti, Ferrari, Lamborghini, Renault, Tesla 6)

### 3. 각 엔트리 구성

```
[brand]/
  DESIGN.md           ← 에이전트가 읽는 것
  preview.html        ← 색 스와치, 타입 스케일, 버튼 프리뷰
  preview-dark.html   ← 다크 모드 프리뷰
```

→ 텍스트 스펙 + **즉시 시각 검증**이 같이 제공됨.

### 4. 중요한 언어적 단서

repo 설명이 명시:
> `AGENTS.md` (코딩 에이전트) ↔ `DESIGN.md` (디자인 에이전트)

→ [프로덕트 디자인 & UX 라이팅 — 학습 정리](../narrative/product-design-and-ux-writing.md)에서 가설로 놓은 "COPY.md / VOICE.md" 구도와 **같은 계보의 사고**.
→ 즉, 에이전트 협업의 "스펙 파일 가족" 개념이 업계에서 이미 형성 중.

### 5. Google Stitch 맥락

repo가 "Google Stitch" 를 DESIGN.md 발상지로 명시 (<https://stitch.withgoogle.com/docs/design-md/overview/>).
→ Google의 AI UI 생성 도구가 DESIGN.md를 표준으로 채택 중. [DESIGN.md — 코딩 에이전트용 디자인 시스템 명세](design-md.md)의 맥락 보강.

---

## 내 생각 — 적용 관점

### 직접적 연결: **블루프린트 없음** / **실전 고가치**

당장 쓸 수 있는 자료. [DESIGN.md — 코딩 에이전트용 디자인 시스템 명세](design-md.md)가 이론이라면 이건 **치트 시트**.

### 고가치 활용 경로

1. **톤 리서치**:
   - 내가 원하는 느낌에 가까운 브랜드 찾기 → 그 DESIGN.md 구조/어휘 차용
   - 예: 북켓몬 = Notion(warm minimalism) + Airbnb(코럴 accent) 합성 후보
2. **슈퍼센트 포트폴리오**:
   - "editorial/gravitas" 톤 원한다면 WIRED, The Verge, 또는 Apple 참고
   - 한 브랜드 톤을 베껴서 각 섹션 일관화
3. **Agent Prompt Guide 섹션** 학습:
   - 업계가 실제로 에이전트에게 **무엇을 어떻게 지시하는가**의 샘플
   - "COPY.md" 실험 시 이 섹션 구조 차용 가능
4. **preview.html 템플릿**:
   - 내 DESIGN.md 작성 시 즉시 시각 검증 워크플로우의 표준
5. **경쟁 연구**:
   - Claude DESIGN.md를 읽으면 **Anthropic의 시각 정체성을 어떤 어휘로 기술하는지** 학습 가능 — 글쓰기 차원의 학습

### 개념적 수확

1. **"스펙 파일 가족"의 외연 확장**:
   - AGENTS.md (코딩) · DESIGN.md (시각) · ? (언어) · ? (윤리)
   - AI NPC 설계자 관점에서는 추가로 **PERSONA.md**(캐릭터), **ETHICS.md**(Layer 0) 후보
   - → ai-npc-blueprint 레이어별 스펙 파일 구상 가능 (장기 실험)
2. **브랜드 시각 정체성 = 텍스트 표현 가능**:
   - 페라리의 "Chiaroscuro black-white editorial with Ferrari Red" 같은 1줄이 **전체 톤 지시**
   - → UX 라이팅의 voice 기술 방식과 동형 — "형용사 + 대비 + 단 하나의 accent"
   - [프로덕트 디자인 & UX 라이팅 — 학습 정리](../narrative/product-design-and-ux-writing.md) 4.2 Voice vs Tone과 연결

### 갤럽 강점 연결

traits "전략" — 69개 옵션 비교·조합 판단. 이런 큐레이션 리소스의 수확률이 가장 높은 강점 프로필.

---

## 열린 질문

- 69개 중 **한국 브랜드 부재** — 토스/당근/네이버 DESIGN.md는 누가 만드나
- DESIGN.md는 CSS 기반 웹이 원점인데, **게임 UI**에 적용 시 얼마나 손실되나
- 추출된 토큰이 원 브랜드의 실제 design system을 얼마나 충실히 반영? (CSS 역공학의 한계)
- values 탐미주의와 가장 가까운 브랜드 1~3종 식별 → 향후 기준점
- Stitch/Google의 DESIGN.md 표준이 1.0 안정화되면 이 레퍼런스들이 어떻게 업데이트되나

---

## 다음 학습 후보

- **Google Stitch 전체 문서** — DESIGN.md의 공식 원점
- **AGENTS.md 스펙** — 코딩 에이전트용 자매 포맷 (awesome-claude-agents 등)
- **Mailchimp / GOV.UK Content Style Guide** — UX 라이팅의 같은 종류 큐레이션
- **Material Design / Apple HIG / IBM Carbon** — 전통적 design system과의 비교
- **shadcn/ui, Radix Themes** — 코드 레벨 디자인 시스템의 현재 표준
- **한국 브랜드 톤 분석** (토스·당근·라인) — 한국어 voice 어휘 형성 출발점

---

## 적용 아이디어

### 단기 (지금)
- 슈퍼센트 포트폴리오: Apple + WIRED + Notion DESIGN.md 세 개 읽고 **한 브랜드 톤 차용** → draft.md 시각 일관성 확보
- bookemon FE 톤 리서치: Notion(warm minimalism) + Airbnb(coral accent) 후보 검토

### 중기
- 북켓몬 전용 DESIGN.md 초안 (Stitch 스펙 기반) + preview.html 시각 검증
- 개인 포트폴리오 사이트 가진다면 WIRED/Verge 계보의 editorial 톤 실험

### 장기
- ai-npc-blueprint 레이어별 스펙 파일 가족화 실험: `NPC-PERSONA.md`, `NPC-VOICE.md`, `NPC-ETHICS.md`
- 한국어 권 DESIGN.md 레퍼런스 3~5종 직접 제작/기여 (오픈소스 기여 후보)

---

## 연결된 페이지

- [DESIGN.md 컴포저 — 레버 조립 템플릿](design-md-composer.md) — 72종을 레버로 꺼내 조립하는 유동 템플릿 (단일 브랜드 박제 X)
- [DESIGN.md — 코딩 에이전트용 디자인 시스템 명세](design-md.md) — 포맷 스펙 (이론)
- [프로덕트 디자인 & UX 라이팅 — 학습 정리](../narrative/product-design-and-ux-writing.md) — 같은 영역의 primer
- [Autoresearch — Karpathy의 자동 연구 루프](autoresearch-karpathy.md) — "natural language as program" 계보
- bookemon — 적용 후보
- traits — 큐레이션 수확에 유리한 강점

---

## 출처

- 저장소: <https://github.com/VoltAgent/awesome-design-md>
- 웹: <https://getdesign.md/>
- 원점 (Google Stitch): <https://stitch.withgoogle.com/docs/design-md/overview/>
- 라이선스: MIT
