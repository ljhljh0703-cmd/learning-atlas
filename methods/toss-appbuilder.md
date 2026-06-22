---
created: 2026-04-26
updated: 2026-04-26
type: learning
tags: [learning, methods, toss, miniapp, design-tool, appbuilder, low-code]
---

# 토스 앱빌더 (Deus) — 웹 기반 UI 디자인 툴

> 출처: https://developers-apps-in-toss.toss.im/design/prepare/deus.md
> 학습 동기: *low-code 디자인 툴* 의 진입 곡선 + 자유도 trade-off. NPC harness 작가 진입 모델로 응용.

## 한 줄 요약

웹 베타 디자인 툴. 콘솔 → 앱 → 디자인 메뉴. **퀵스타트 (옵션 수정만)** + **커스텀 (조립 자유)** 2 트랙. 기본 화면 = iPhone 13 mini (375×812). 그래픽은 토스팀 자산만, 3D 는 검토 승인.

---

## 1. 앱인토스 직접 적용 (런칭 시 참고)

### 진입
- 워크스페이스 > 앱 등록 > 디자인 메뉴
- 별도 설치 X (웹)
- 베타 — 캡처/녹화 외부 공유 금지

### 프로젝트 관리
- 완전 삭제 X (보관함만)
- 즐겨찾기 + 폴더로 정리
- 페이지 = 화면 단위 (준비하기 / 템플릿)

### 브랜드 설정
- 서비스 이름 (콘솔 등록명만)
- primary color (접근성 자동 보정 — 다크패턴 정책 자동 보정과 동일)

### 화면 제작 2 방식
| 방식 | 자유도 | 사용 시점 |
|------|------|------|
| **퀵스타트** | 낮음 (옵션만 수정) | 빠른 구조 잡기, 표준 흐름 |
| **커스텀** | 높음 (자유 조립) | 퀵스타트 부재 시 |

### 기본 규격
- 화면 375×812 (iPhone 13 mini) — 임의 변경 비권장
- 텍스트: 일반(본문) / 포스트(제목 볼드)
- 줄바꿈 Shift+Enter
- 그래픽: 토스 제공만, 3D 는 2D → 변환 → 토스팀 검토

### Layout/Style
- Stack: Fit / Fill / Fixed / Gap / Padding
- Style: Visible / Opacity / Fill / Border / Radius / Shadow
- 반응형 = 모든 에셋 Fill

### 공유
- 프로토타입 링크로 실기 확인

---

## 2. 응용 — 일반 패턴 (Sub brain/NPC harness 차용)

### ★ 패턴 1: 퀵스타트 + 커스텀 2 트랙 (재발견)
토스 onboarding-process (앱빌더/Figma) 의 *툴 수준* 분기 + 앱빌더 *내부* 의 또 다른 분기. **2 트랙 패턴이 fractal.**
- 빠른 구조 (template) + 자유 조립 (raw)

→ NPC harness 응용:
- harness 자체도 fractal 2 트랙:
  - **outer:** 템플릿 사용 / 직접 SKILL.md 작성
  - **inner (템플릿 내):** 옵션 채우기 / 섹션 추가
- onboarding.md 에 fractal 명시.

### ★ 패턴 2: "삭제 X / 보관함" — 비파괴 운영
프로젝트 완전 삭제 불가. 보관/복원만. 실수/회복 자원.

→ NPC harness 응용:
- 캐릭터 삭제 X / archive 만 (welfare-gate withdrawal trigger 와 동형).
- 메모리 이벤트도 hard delete X / soft archive.

### ★ 패턴 3: 옵션 수정 ↔ 구조 변경 분리
퀵스타트 = 오른쪽 패널 옵션만, 내부 요소 변경/삭제 X. 자유도 *명시 한계*.

→ NPC harness 응용:
- profile.template 도 *옵션 필드* (mut) ↔ *구조 필드* (immut) 명시 분리.
- 토스 콘솔 mutability 마커 (가이드 8) + 본 가이드 = 같은 패턴 두 가이드.

### ★ 패턴 4: 외부 자산 강제 (토스 그래픽만)
사용자 자산 업로드 차단. 일관성 강제.

→ NPC harness 응용:
- NPC voice/persona 도 *외부 학습 모델 자유 사용 X* — 등록된 voice palette 만.
- "외부 자산 차단 = 일관성" framing.

### ★ 패턴 5: 사용자 생성 자산도 검토 (3D 변환)
2D → 3D 변환 후 토스팀 검토 1일. 자동 생성도 *사람 검토*.
→ 토스 그래픽 가이드 (토스트) 의 검토 1일 + 본 가이드 동일 SLA.

→ NPC harness 응용:
- NPC 자동 생성 응답도 *작가 검토 hook* 가능 (M2 운영 시 검토).
- "자동 생성 ≠ 자동 출시" 룰.

### ★ 패턴 6: 기본 규격 1개 (iPhone 13 mini)
임의 변경 비권장. 단일 기준 (해상도 가이드 와 일관).

→ NPC harness:
- 모든 NPC 의 baseline turn = 단일 길이/모드.

### 패턴 7: 베타 = 외부 공유 차단
완성도 미달 → 외부 노출 차단. 시점별 책임 분리.

→ NPC harness:
- Tier 1/2 (체험/검증) NPC = 외부 공유 차단. Tier 3 (출시) 만 공유 가능.
- 사업자 등록 가이드 (9) 의 3 tier 게이팅 + 본 가이드 = 베타→정식 시점 표준.

---

## ★ 핵심 인사이트

### 1. 2 트랙 패턴의 fractal
도구 수준 (앱빌더/Figma) → 도구 내부 (퀵스타트/커스텀) → 옵션 수준 (mut/immut). **세 layer 모두 자유도 분기.**
→ NPC harness 도 fractal 2 트랙 도입 가치.

### 2. 비파괴 운영 (삭제 X)
실수 회복 + welfare 관점. 캐릭터/메모리 모두 hard delete 차단.

### 3. 옵션 ↔ 구조 명시 분리
*어디까지 자유* 가 명시 — 작가 인지 부하 감소.

### 4. 자동 생성도 사람 검토
토스 = 자동 생성 (3D 변환, 토스트) 모두 검토 통과 후 사용. AI 신뢰의 토스 모델.
→ NPC 자동 생성 응답에도 *작가 검토 hook* 적용 검토.

### 5. 토스 11 가이드 통합
| # | 가이드 | KPI |
|---|------|------|
| 1~5 | 디자인 5종 | 공간/콘텐츠 |
| 6 | 프로세스 | 시간 |
| 7 | 정책 | 경계 |
| 8 | 콘솔 | 메타데이터/권한 |
| 9 | 사업자 등록 | 접근 통제 (tier) |
| 10 | 그래픽 | 시각 자율성 |
| 11 | **앱빌더** | **자유도 layer 분리 + 비파괴** |

→ 11번째 표면 = *작업 도구 차원*. design DNA 가 *어떻게 만드는가* 까지 확장.

---

## NPC harness/eval 직접 매핑

| 토스 앱빌더 | NPC 등가 | 위치 |
|---|---|---|
| 퀵스타트/커스텀 fractal | template/직접 + 옵션/섹션 | onboarding.md |
| 삭제 X / 보관함 | 캐릭터 archive 만 | welfare-gate |
| 옵션 ↔ 구조 분리 | mut/immut 마커 | profile.template |
| 외부 자산 차단 | voice palette 외 X | persona-tokens |
| 자동 생성 검토 hook | 작가 hook (M2) | EXAMPLES.md |
| 기본 규격 1개 | baseline turn 1 mode | persona-tokens |
| 베타 외부 공유 차단 | Tier 1/2 외부 차단 | tier 게이팅 |

---

## 즉시 적용 후보

### 1. ★★ fractal 2 트랙 명시
onboarding.md 에 3 layer 명시:
- L1: 템플릿 vs 직접
- L2: 옵션 채우기 vs 섹션 추가
- L3: mut vs immut

### 2. ★ 비파괴 운영 룰
welfare-gate 에 "캐릭터/메모리 hard delete X / archive only" 룰 명시.

### 3. 자동 생성 검토 hook
EXAMPLES.md 에 M2 운영 시 *작가 검토 hook* 자리 마련.

---

## 비교 — 토스 11 가이드 통합

11 가이드 모두 단일 철학 *"예측 가능성 + 콘텐츠 우선 + 사용자 보호"* 로 수렴. 본 가이드 (앱빌더) = 작업 도구 차원, 도구 자체에서도 동일 철학 (fractal 자유도 / 비파괴 / 검토 강제).

---

## 제한·주의

- 베타 — 기능 변경 가능.
- 캡처/녹화 외부 공유 금지.
- 토스 자산 직접 사용 X (저작권).
- iPhone 13 mini 규격은 토스 grid 종속.

---

## 연결

- 토스 11종 세트: [토스 앱인토스 — 플랫폼 개요](toss-overview.md) · [토스 앱인토스 — 서비스 오픈 프로세스](toss-onboarding-process.md) · [토스 앱인토스 — 서비스 오픈 정책](toss-service-policy.md) · [토스 앱인토스 — 콘솔 앱 등록 가이드](toss-console-workspace.md) · [토스 앱인토스 — 사업자 등록 가이드](toss-register-business.md) · [토스 앱인토스(Apps in Toss) 미니앱 브랜딩 가이드](toss-miniapp-branding.md) · [토스 앱인토스 다크패턴 방지 정책](toss-dark-pattern-policy.md) · [토스 UX 라이팅 가이드 — 보이스톤](toss-ux-writing.md) · [토스 앱인토스 해상도 가이드](toss-resolution.md) · [토스 앱인토스 — 그래픽 리소스 가이드](toss-graphic-resources.md)
- fractal 2 트랙 적용: `skills/npc-harness/references/onboarding.md`
- 비파괴 운영: `skills/npc-harness/references/welfare-gate.md`
- 자동 생성 검토: 동형 — [Hugging Face ml-intern — 자율 ML 엔지니어 에이전트 아키텍처](ml-intern.md) (approval gate)
