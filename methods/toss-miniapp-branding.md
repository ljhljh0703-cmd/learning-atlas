---
created: 2026-04-26
updated: 2026-04-26
type: learning
tags: [learning, methods, design-system, toss, branding, miniapp]
---

# 토스 앱인토스(Apps in Toss) 미니앱 브랜딩 가이드

> 출처: https://developers-apps-in-toss.toss.im/design/miniapp-branding-guide.md
> 학습 동기: 플랫폼 위에 얹히는 미니앱이 *호스트 브랜드와 혼동되지 않으면서도* 일관된 경험을 만드는 방법. 게임/서비스 입점 시 직접 적용 가능.

## 한 줄 요약

플랫폼(토스)와 입점 서비스의 **브랜드 분리** 가 가이드의 유일한 목적. 로고/이름/컬러는 강제 노출, 내비게이션·탭바는 호스트 통일 컴포넌트 강제. 자유도와 일관성의 경계가 명확.

## 핵심 원칙: "혼동 방지"

- 사용자가 **"이건 토스가 아니라 X 서비스"** 를 *분명하게* 인지하게 만드는 게 1차 목표.
- 동시에 **호스트 chrome (탭바/내비)** 은 토스의 형태를 따라가야 — 위치 감각 유지.
- → **콘텐츠 영역은 자유, chrome 영역은 강제** 라는 분업.

## 강제 노출 3종 (브랜드 정체성)

### 1. 브랜드 로고
- **600×600px 각진 정사각형** (둥근 모서리 금지)
- 라이트/다크 모드 양쪽에서 보이는 배경 필수
- 자체 배경 있는 로고는 600×600 영역에 꽉 차게
- 콘솔 업로드 + `granite.config.ts` `brand.icon` 동기화

### 2. 브랜드 이름
- 한글 권장 (`토스` ✓ / `Toss` ✗)
- 콘솔 + `brand.displayName` 동기화

### 3. 브랜드 컬러
- 기존 컬러 → 그대로
- 없으면 로고 최다 사용 색 (Color Thief 추천)
- **색 대비 미달 시 자동 보정** (플랫폼이 강제 개입)
- `brand.primaryColor` 6자리 헥스 (`#3182F6`)

→ 노출 지점: **전체탭, 혜택탭, 푸시, 알림, 내비게이션, 브릿지** — 사용자 동선 전반.

## 강제 통일 2종 (호스트 chrome)

### 내비게이션 바
- 앱인토스 **전용 컴포넌트** 제공
- 게임/비게임에 따라 별도 가이드 분기

### 탭바
- 필수 아님 — 쓰려면 **플로팅 형태 강제**
- 자체 UI를 써도 탭바만큼은 토스 제공 형태
- 이유: 토스 메인 하단 탭과 형태 겹치면 위치 혼동

## 설계 인사이트

### 1. ★ "혼동 방지" 라는 단일 목표
가이드 전체가 하나의 KPI(브랜드 식별)에 정렬. 디자인 가이드의 모범 — 규칙마다 *왜* 가 명확.
→ Sub brain 자체 룰 작성 시 차용: 규칙당 "이 규칙이 막는 혼동은 무엇인가" 한 줄.

### 2. ★ 콘솔 ↔ config 이중 입력의 의도
`brand.icon`/`brand.displayName`/`brand.primaryColor` 를 **콘솔에도, 코드에도** 입력시킴. 단일 진실 소스 원칙 위반처럼 보이지만:
- 콘솔 = 플랫폼 메타데이터 (탭/푸시에서 사용)
- config = 미니앱 런타임 (브릿지/버튼에서 사용)
- 두 컨텍스트가 분리된 시스템이라 동기화 강제가 더 안전

→ NPC harness 의 `welfare.yml` (런타임) ↔ 작가 콘솔 (메타) 분리 패턴과 동형.

### 3. ★ 자동 보정 = 강제 개입의 우아함
컬러 대비 미달 시 자동 보정 — *사용자 보호* 와 *작가 자유* 의 충돌을 플랫폼이 우아하게 해소.
→ NPC harness 의 welfare-gate withdrawal trigger 와 동형: "원칙은 강제, 형태는 보존."

### 4. 600×600 각진 정사각형 — 형태 강제의 비용
브랜드 로고 형태 강제는 디자이너 자유를 제약하지만, *플랫폼 grid* 에서 일관 렌더링을 보장. 자유도/일관성의 trade-off 를 명시적으로 자유 쪽에서 후퇴.

### 5. 한글 권장 — 지역 정체성
`Toss` 보다 `토스` 권장 — 국내 사용자 인지를 우선. 글로벌 브랜드도 한국 시장에서는 한글 표기가 더 강한 식별. Sub brain 내 한국어 노트 우선 정책과 일치.

## 비교 — 다른 design system

| 차원 | 토스 미니앱 | Schematic | DESIGN.md (Google) | Awesome DESIGN.md |
|------|---|---|---|---|
| 목적 | 플랫폼-입점 분리 | editorial 다이어그램 | 에이전트용 디자인 명세 | 브랜드별 명세 큐레이션 |
| 강제력 | 높음 (콘솔 검증) | 중간 (skill 사용 시) | 명세만 | 참고 |
| 자유도 | chrome 외 자유 | 6 패턴 내 | 정의 가능 | N/A |
| Sub brain 차용 | "이 규칙이 막는 혼동은?" | progressive disclosure | brand spec 형식 | 다양성 비교 |

## 즉시 적용 후보

### 1. ★ 자체 룰 메타-규칙
모든 규칙에 **"이 규칙이 막는 혼동/오해는 무엇인가"** 1줄 강제.
→ `skills/npc-harness/BEHAVIOR.md`, `skills/npc-eval/BEHAVIOR.md` 다음 개정 시 추가 검토.

### 2. 작가 콘솔 ↔ harness config 이중 입력 인정
NPC profile 의 일부 필드 (캐릭터 이름, 1차 컬러, voice 샘플) 는 메타 + 런타임 양쪽 등록.
→ harness `references/profile-stage1` 다음 작성 시 패턴 차용.

### 3. 자동 보정 디자인
welfare/voice-fidelity 미달 시 **자동 보정 → 작가 알림** 흐름 (강제 차단보다 우아).
→ M1 운영 시 도입 검토. 지금은 hard gate 로 시작.

## 제한·주의

- 토스 내부 구현 가이드 (`granite.config.ts`, 콘솔) — Sub brain 직접 사용 가치 없음.
- 게임/비게임 분기 별도 문서 — 미니앱 직접 만들 때 필요. 지금 우리 NPC 게임은 미니앱 형태 아님.
- 600×600, 헥스 6자리 등 구체 수치는 토스 grid 종속 — 패턴만 추출.

## 연결

- 디자인 시스템 패턴: [Diagram-Design Skill — Editorial 다이어그램을 자동화한 Claude Code skill](diagram-design-skill.md) (progressive disclosure) · [DESIGN.md — 코딩 에이전트용 디자인 시스템 명세](design-md.md) (Google 명세 포맷) · [awesome-design-md — 브랜드별 DESIGN.md 69종 레퍼런스 컬렉션](awesome-design-md.md) (큐레이션)
- 동형 패턴: [Hugging Face ml-intern — 자율 ML 엔지니어 에이전트 아키텍처](ml-intern.md) (REVIEW.md "default bias: rigor" — 규칙당 *왜* 명시)
- 적용 대상: `skills/npc-harness/` · `skills/npc-eval/` 다음 개정
- 동기: 제품 디자인 학습 트랙 — [프로덕트 디자인 & UX 라이팅 — 학습 정리](../narrative/product-design-and-ux-writing.md)
