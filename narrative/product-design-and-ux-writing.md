---
created: 2026-04-22
updated: 2026-04-22
type: learning
tags: [product-design, UX, UX-writing, design-system, craft, primer]
category: discipline-primer
---

# 프로덕트 디자인 & UX 라이팅 — 학습 정리

자기 학습용 primer. "이미 한 일 정리"가 아니라 **앞으로 체계적으로 적용하기 위한 지식 지도**.
DESIGN.md 학습이 촉발한 확장. 창작자 정체성 + AI NPC + 프로덕트 기획의 교차점.

> 공부 진행하며 갱신하는 살아있는 문서. 실전 경험이 쌓이면 개별 페이지로 분화.

---

## 한 줄 요약

> 프로덕트 디자인 = 사용자의 목적을 제품이 이루도록 만드는 통합 행위. UX 라이팅 = 그 경험의 **언어 표면**을 다루는 세부 전문. 창작자에게는 **소설/시 언어와 다른 경제**의 글쓰기.

---

## 1. 프로덕트 디자인의 범위

### 1.1 인접 개념 구분

| 용어 | 초점 |
|------|------|
| UI Design | 화면의 시각적 외형 |
| UX Design | 사용 흐름·감정 |
| **Product Design** | 문제 정의부터 출시·운영까지 전 과정 |
| Service Design | 디지털 + 오프라인 접점 모두 |
| Interaction Design | 상태/전이/피드백 |

→ 프로덕트 디자이너는 "**제품이 풀어야 할 문제**"부터 관여. UI/UX의 상위 개념이 아니라 **횡단** 역할.

### 1.2 하위 전문 영역

- UX Research (인터뷰, 사용성 테스트, 에스노그래피)
- Information Architecture (IA) — 구조/분류/내비게이션
- Interaction Design — 흐름, 상태, 마이크로 인터랙션
- Visual Design — 타이포, 색, 그리드, 레이아웃
- **UX Writing / Content Design** — 언어 표면
- Prototyping — 피그마, 코드, 종이
- Design Systems — 토큰, 컴포넌트, 가이드라인

### 1.3 핵심 프레임워크

| 프레임워크 | 요지 |
|----------|------|
| **Double Diamond** (British Design Council) | Discover → Define → Develop → Deliver. 확산 ↔ 수렴 반복 |
| **Jobs-To-Be-Done (JTBD)** | "사용자가 어떤 **일**을 하려고 이 제품을 고용하는가" — Clayton Christensen |
| **HEART metrics** (Google) | Happiness · Engagement · Adoption · Retention · Task success |
| **Design Thinking** (IDEO) | Empathize · Define · Ideate · Prototype · Test |
| **Lean UX** (Gothelf) | 가설 → MVP → 검증의 빠른 사이클 |

### 1.4 디자인 시스템의 위치

DESIGN.md ([DESIGN.md — 코딩 에이전트용 디자인 시스템 명세](../methods/design-md.md))가 정답지 역할 — 토큰 + 산문을 묶어 **에이전트까지 읽는** 최신 형태.

| 시대 | 형태 |
|------|------|
| 2000s | PDF 가이드라인 |
| 2010s | Sketch/Figma 라이브러리 |
| 2020s | W3C DTCG, Tailwind config |
| 2025~ | **DESIGN.md 계열** — 에이전트 네이티브 |

→ 내 시대의 디자인 시스템 = "**AI 에이전트가 일관되게 시공할 수 있는 명세**".

---

## 2. UX 라이팅

### 2.1 정의와 이웃 구분

| 용어 | 차이 |
|------|------|
| **UX Writing** | 제품 화면 안의 모든 문자 (버튼, 에러, 공상태, 툴팁, 입력 힌트, 온보딩) |
| Content Design | UX 라이팅 + 구조/IA까지 확장 — Sarah Richards 주도 용어 |
| Copywriting | 설득/마케팅 문구 — **감정 반응**이 목표 |
| Technical Writing | 정확·완전 — **이해**가 목표 |

→ UX 라이팅은 **행동을 유도하면서 마찰을 줄이는 것**이 본질. 감정도 이해도 수단.

### 2.2 4 원칙 (Google UX Writing Playbook — 업계 표준 가까움)

1. **Clear** — 모호성 없음
2. **Concise** — 한 글자도 더 안 쓰기
3. **Useful** — 사용자 다음 행동을 돕는가
4. **(+) Human / On-brand** — 브랜드 목소리 일관

### 2.3 다루는 화면 요소

| 요소 | 핵심 질문 |
|------|----------|
| Button label | 동사형? 결과 지향? ("저장" vs "저장하기" vs "변경사항 저장") |
| Error message | 원인 + 해결 + 재시도 경로 |
| Empty state | 상황 설명 + 첫 행동 유도 |
| Onboarding | "지금 당장 할 필요"만 |
| Tooltip / Helper | 본문으로 올리지 못한 부연 |
| Confirmation | 되돌릴 수 있는가 / 없는가 명시 |
| Input hint | 형식 예시, 제약 |
| 404 / offline | 브랜드 목소리가 가장 드러나는 곳 |

### 2.4 Voice vs Tone

- **Voice** = 브랜드의 **고정된 성격** (친근함·정중함·기술적 정확성 등)
- **Tone** = 상황별 **조절** (오류 시 차분, 성공 시 축하)

→ 성격(voice)은 PAD 좌표 고정, 감정(tone)은 상황 따라 이동. [Russell's Circumplex & PAD — 감정 모델링의 표준 어휘](../techniques/emotion-models-circumplex-pad.md) 어휘와 구조 동형.

### 2.5 핵심 인물 / 교재

| 인물 | 대표작 |
|------|--------|
| **Kinneret Yifrah** | *Microcopy: The Complete Guide* — 업계 바이블 |
| **Torrey Podmajersky** | *Strategic Writing for UX* — O'Reilly |
| **Nicole Fenton + Kate Kiefer Lee** | *Nicely Said* |
| **Sarah Richards** | *Content Design* — GOV.UK 방법론 |
| **John Saito** (전 Dropbox/Google) | Medium 글 다수 — "Write microcopy" |
| **Nielsen Norman Group** | UX writing 아티클 연재 |

### 2.6 패턴 예시

| ❌ | ✅ | 이유 |
|----|----|------|
| "오류가 발생했습니다" | "비밀번호를 찾을 수 없어요. 다시 입력해 주세요." | 원인 + 다음 행동 |
| "확인" (파일 삭제 전) | "영구 삭제" | 결과 지향 |
| "아이템을 불러오는 중..." | "책 정보를 가져오고 있어요" | 도메인 구체성 |
| "구독 해지 완료" | "아쉽지만 다음에 또 만나요. 구독이 해지됐어요." | 감정 + 사실 |

---

## 3. AI 시대의 프로덕트 디자인 · UX 라이팅

### 3.1 새 축: LLM 생성 UX 카피

- 버튼/에러 문구를 **정적 사전**에서 **런타임 생성**으로 이동 가능
- 장점: 개인화, 톤 맞춤
- 위험: 일관성 파괴, 환각, 브랜드 voice drift
- → **persona vector** / **Persona.md** 기반의 voice 고정 + tone 상황 제어 하이브리드 ([Persona Vectors — 캐릭터 특성을 벡터로 모니터링/조작](../techniques/persona-vectors-2025.md) · [Emotion Concepts and their Function in a Large Language Model](../techniques/anthropic-emotions-2026.md))

### 3.2 NPC 대화 = UX 라이팅의 극한 사례

- 기존 UX 라이팅: **정적 텍스트** (사전 작성)
- NPC 대화: **동적 생성** + **긴 일관성**
- → 4 원칙(clear/concise/useful/human)이 여전히 유효하되, **human/on-brand**가 가장 어려움
- → ai-npc-blueprint Layer 2와 정확히 겹침

### 3.3 DESIGN.md 짝으로서의 "COPY.md" 가능성 (가설)

- CLAUDE.md = 코드 행동
- DESIGN.md = 시각 행동
- **COPY.md (또는 VOICE.md)** = 언어 행동? 
- 토큰: voice 속성 (formality 0~1, warmth 0~1, brevity 0~1) + 상황별 tone
- 산문: 예시 페어 (❌/✅), 금지 표현
- → 개인적 실험 후보

### 3.4 창작자 정체성과의 관계

| 축 | 소설 | UX 라이팅 |
|----|------|-----------|
| 목표 | 독자의 경험/감정 | 사용자의 행동 완수 |
| 길이 | 무제한 | 극단적 압축 |
| 반복 독해 | 가능 | 금지 (한 번에 읽혀야) |
| 작가 존재감 | 드러남 | 숨음 (브랜드 voice로) |

→ **같은 글쓰기 근육의 다른 운동**. 소설가의 '장면 경제'가 UX 라이팅의 '화면 경제'로 이식 가능.
→ values "탐미주의 + 강렬함" 이 UX 라이팅에서는 **한 문장의 미감**으로 수렴.

---

## 4. 학습 로드맵 (자기용)

### 4.1 단기 (1~2주)

- [ ] Google UX Writing Playbook 정리 노트
- [ ] Kinneret Yifrah *Microcopy* 핵심 장 발췌
- [ ] John Saito 에세이 상위 10편
- [ ] 자주 쓰는 앱(토스, 당근, 배민 등) UX 라이팅 케이스 10건 수집

### 4.2 중기 (1~2개월)

- [ ] Torrey Podmajersky *Strategic Writing for UX* 통독
- [ ] GOV.UK content design 가이드 정리
- [ ] Nielsen Norman Group UX writing 아티클 정독
- [ ] Voice/Tone 프레임워크 샘플 2~3종 분석 (Mailchimp, Slack 등)

### 4.3 장기

- [ ] 프로덕트 디자인 포트폴리오에 UX 라이팅 섹션 분리
- [ ] "COPY.md" 실험 — 개인 프로젝트에서 voice token 도입
- [ ] AI NPC 대화를 UX 라이팅 원칙으로 감사하는 프레임워크 작성

---

## 5. 적용 후보 (내 프로젝트)

| 프로젝트 | 어디에 적용 |
|---------|-------------|
| bookemon | 빈 상태 ("아직 추천받은 책이 없어요"), 추천 이유 문구 톤, 에러 문구 — F-01/F-04 |
| hyunsoo-bot | Persona.md를 voice token + tone map으로 정식화 |
| 슈퍼센트 포트폴리오 | 각 프로젝트 페이지 캡션·한 줄 정체 — UX 라이팅 감사 1회 |
| 향후 게임 UI | 메뉴/시스템 메시지 + NPC 대사 = 같은 voice 체계 |
| Sub brain 자체 | Obsidian 내 자주 쓰는 짧은 문구 일관성 (템플릿 heading 등) |

---

## 6. 열린 질문

- 한국어 UX 라이팅의 **존대/반말 축**이 Voice/Tone 프레임워크에 어떻게 들어가나 (영어권 교재는 부재)
- LLM 생성 카피의 QA 자동화 — clear/concise 자동 측정 가능한가
- UX 라이터와 AI 프로덕트 기획자의 역할 경계 — 슈퍼센트 같은 조직에선 어떻게 나뉘는가
- 소설가의 직관 vs 사용성 테스트 데이터 — 내 안에서 어떻게 화해시키나
- 게임 UI 텍스트(아이템 설명, 스킬 tooltip 등)가 UX 라이팅 이론으로 설명 가능한가 — 업계에서 어느 정도 연구됐나

---

## 7. 다음 학습 후보

- **Mailchimp Content Style Guide** (공개) — Voice/Tone 모범 사례
- **GOV.UK Style Guide** — 공공 서비스 content design의 표준
- **Microsoft Writing Style Guide** — 기술 문서 ↔ UX 라이팅 중간지대
- **토스 디자인 블로그 / 당근 팀 블로그** — 한국어 UX 라이팅 현장
- **"Content Design" (Sarah Richards)** — GOV.UK 방법론 정식 서적
- **"Writing is Designing" (Metts & Welfle)** — 디자이너·라이터 협업 관점
- **Design System 심화** — Material Design 3, Apple HIG, shadcn/ui

---

## 8. 연결된 페이지

- [DESIGN.md — 코딩 에이전트용 디자인 시스템 명세](../methods/design-md.md) — 이 primer의 직접 촉발 (디자인 시스템의 현대적 형태)
- ai-npc-blueprint — Layer 2 (대화)가 UX 라이팅의 극한
- [Persona Vectors — 캐릭터 특성을 벡터로 모니터링/조작](../techniques/persona-vectors-2025.md) · [Emotion Concepts and their Function in a Large Language Model](../techniques/anthropic-emotions-2026.md) — voice/tone의 기계적 토대
- [Russell's Circumplex & PAD — 감정 모델링의 표준 어휘](../techniques/emotion-models-circumplex-pad.md) — voice(고정) vs tone(가변) 구조 동형
- bookemon · hyunsoo-bot — 적용 후보
- 초파리 — 소설가 정체성과의 연결점
- values — 탐미주의가 UX 라이팅으로 수렴
- goals — 만류귀종 비전의 한 축

---

## 메모

- 이 페이지는 **자기 학습용 primer**. 실전 적용/경험이 쌓이면:
  - 별도 `me/` 역량 페이지로 분화 (실전 사례 포함)
  - 또는 `thoughts/product-design-approach.md` 철학 페이지로 분화
- 현재는 "지식 지도" 단계.
