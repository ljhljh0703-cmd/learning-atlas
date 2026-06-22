---
created: 2026-04-26
updated: 2026-04-26
type: learning
tags: [learning, methods, toss, miniapp, console, workspace, registration]
---

# 토스 앱인토스 — 콘솔 앱 등록 가이드

> 출처: https://developers-apps-in-toss.toss.im/prepare/console-workspace.md
> 학습 동기: 등록 단계의 *입력 필드 명세* + 권한·검수 모델. 응용 가치는 권한 모델과 메타데이터 명세 표준에 집중.

## 한 줄 요약

회원가입(만 19세 + 본인 토스 계정) → 워크스페이스(사업자당 1개) → 멤버 초대(관리자/구성원 2 권한) → 앱 등록(기본정보 + 카테고리/노출 + 게임 등급분류) → 검토 1~2일.

---

## 1. 앱인토스 직접 적용 (런칭 시 참고)

### 회원/워크스페이스
- 만 19세 + 본인 토스앱 로그인
- 사업자당 워크스페이스 1개, 이름 중복 X
- 비사업자 가능 (단, 수익화/토스 로그인 불가)
- 대표관리자 = 약관 동의 + 멤버 초대 권한

### 권한 3 layer
- **대표관리자** — 위임 가능, 사업자 인증 필요
- **관리자** — 모든 권한
- **구성원** — 공동 작업만, 초대/설정 X

### 앱 등록 필드 (기본 정보)
| 필드 | 규격 | 수정 |
|------|------|------|
| 앱 로고 | 600×600 PNG, 배경 필수 | O |
| 앱 이름 | 한글 권장, 영문 15자 이내 명사형 | O |
| **appName** | `intoss://` 형식 | ★ X (등록 후 수정 불가) |
| 사용 연령 | 만 19세 이상만 | — |
| 고객센터 | 이메일/연락처/채팅 주소 | O |

### 카테고리 및 노출
- **썸네일** 1100×800 PNG, 핵심 화면, 텍스트 과다 X
- **부제** — 검색 결과 노출, 비속어/느낌표 X
- **상세 설명** — 토스 홈 광고 선정 근거. *서비스 접속→행동→결과* 흐름으로 작성
- **앱 검색 키워드** — 사용자 예측
- **스크린샷** — 세로 636×1048 (3장), 가로 1504×741 (1장)

### 비게임 vs 게임
- 비게임: 대/중/소분류 카테고리 + 동일 중분류 중복 X
- 게임: **리더보드 정책 + 게임물 등급분류 증명 강제**

### 게임 등급분류 (★ 한국 법규)
2 경로:
1. **스토어 출시 기반** — 마켓 URL + 자체등급분류 게임물 정보 (등록자명/분류일자/번호/이용등급/내용정보) + 대표자 인감/사인 + 플레이 화면 4장 (스토어 2 + 앱인토스 2)
2. **게임물관리위원회 직접 심의** — 등급분류증명서 PDF + 동일 정보 입력

→ 등록자명 ≠ 사업자명이면 반려. 소명 자료 (등기부등본 등) 필수.

---

## 2. 응용 — 일반 패턴 (Sub brain/NPC harness 차용)

### ★ 패턴 1: 권한 3 layer 표준
대표관리자 / 관리자 / 구성원 — 책임 / 운영 / 작업 3 분리.

→ NPC harness 응용:
- 작가 (대표관리자) / harness 운영 (관리자) / 자동 system (구성원).
- welfare-gate override 권한도 작가 only — 권한 layer 명시 가치.

### ★ 패턴 2: 불변 필드 명시
**appName 등록 후 수정 불가** — 타 시스템 종속이라 변경 불가능. 사전 경고로 risk 흡수.

→ NPC harness 응용:
- 캐릭터 ID / persona-vector seed 같은 *불변 필드* 명시.
- profile.template 에 "★ 불변 — 한 번 정한 뒤 수정 X" 마커 도입.

### ★ 패턴 3: "수정 가능" 명시
- 워크스페이스 이름: 수정 가능
- 앱 이름: 수정 가능
- appName: 수정 불가
**필드별 mutability** 명시 — 작가의 안전감 확보.

→ NPC profile 모든 필드에 mutability 마커 (mut/immut) 도입 검토.

### ★ 패턴 4: 다단계 분류 (대/중/소)
비게임 카테고리 = 3 layer hierarchy. 동일 중분류 중복 X = 다양성 강제.

→ NPC harness:
- 캐릭터 분류도 hierarchy: 작품 → role → archetype.
- 동일 archetype 다중 등록 X (어뷰징 방지).

### ★ 패턴 5: "행동 흐름" framing 의 상세 설명
"서비스 접속 → 행동 → 결과" 흐름으로 풀어쓰기 강제. 정적 묘사 X.

→ NPC profile 응용:
- 캐릭터 설명을 *상황 → NPC 반응 → 결과* 흐름으로 작성.
- profile.template 에 "행동 흐름" 섹션 추가.

### ★ 패턴 6: 외부 증빙 강제 (게임 등급)
게임물관리위원회 = 외부 권위. 플랫폼 내부 검증으로 부족.
→ 토스 service-policy §5 (외부 인증 위임) 와 동형 강화.

### 패턴 7: 세로/가로 규격 분리
스크린샷 세로 3장 / 가로 1장 — 미니앱 형태별 분리.
→ NPC dialogue 샘플도 *short/long* 분리 등록 (1x/2x 에셋과 동형).

### 패턴 8: 이미지 규격 표준화
600×600 / 1100×800 / 636×1048 / 1504×741 — *모두 PNG, 표준 규격*.
→ NPC harness 자산 (캐릭터 일러스트 등) 도 표준 규격 1종 강제.

---

## ★ 핵심 인사이트

### 1. ★ "불변 필드" 의 명시
appName 같은 한 번 정하면 못 바꾸는 필드를 *사전 경고* 로 처리. risk 를 시점 분리.

### 2. 권한 3 layer = 책임/운영/작업 분리
대표관리자가 *책임* 만 짊어지고 위임 가능. NPC harness 작가도 책임만.

### 3. 카테고리 hierarchy = 분류 통제
대/중/소 + 중복 X → 검색 어뷰징 방지. 토스 service-policy §3 어뷰징 방지의 카테고리 차원.

### 4. "행동 흐름" framing
정적 명사 묘사 X / *동적 행위* 묘사 O. UX 라이팅 §2 능동 강제와 일치.

### 5. 토스 8 가이드 통합
| # | 가이드 | KPI |
|---|------|------|
| 1~5 | 디자인 5종 | 공간/콘텐츠 |
| 6 | 프로세스 | 시간 |
| 7 | 정책 | 경계 |
| 8 | **콘솔 등록** | **메타데이터 명세 + 권한 모델** |

→ 8번째 표면 = *어떻게 등록하는가* 의 운영 차원. 메타데이터 표준이 추가 차용 가치.

---

## NPC harness/eval 직접 매핑

| 토스 콘솔 요소 | NPC 등가 | 위치 |
|---|---|---|
| 권한 3 layer | 작가/harness/system 3 layer | welfare-gate override 권한 |
| appName 불변 | 캐릭터 ID / persona-vector seed | profile.template 마커 |
| 필드별 mutability | profile 필드 mut/immut | profile.template |
| 카테고리 3 hierarchy | 작품→role→archetype | onboarding |
| 상세 설명 행동 흐름 | 캐릭터 *상황→반응→결과* | profile.template 섹션 |
| 외부 증빙 (게임 등급) | AI welfare 외부 표준 | welfare-gate framing |
| 검토 1~2일 SLA | npc-eval cycle SLA | M1 운영 |

---

## 즉시 적용 후보

### 1. ★★ profile.template mutability 마커
모든 필드에 mut/immut 표시. immut 필드는 등록 시점 *경고*.

### 2. ★★ 캐릭터 설명 "행동 흐름" framing
profile.template 에 "상황→반응→결과" 섹션 추가.

### 3. ★ 권한 3 layer 명시
welfare-gate.md 에 작가 (책임) / harness 운영 (관리) / system 자동 (작업) 권한 분리 명시.

### 4. 자산 규격 표준화
NPC 일러스트/UI 자산 표준 규격 1종 정의 (M2 게임 출시 시).

---

## 비교 — 토스 8 가이드 통합

| # | 가이드 | 차원 | 강제력 |
|---|------|------|------|
| 1~5 | 디자인 5종 | 공간/콘텐츠 | 콘솔/룰 |
| 6 | 프로세스 | 시간 | SLA |
| 7 | 정책 | 경계 | 출시 차단 |
| 8 | 콘솔 등록 | 메타데이터/권한 | 필드 검증 |

→ 토스 design DNA 8 표면 모두 단일 철학 "예측 가능성 + 콘텐츠 우선 + 사용자 보호" 로 수렴.

---

## 제한·주의

- 콘솔 자체 사용법은 실제 런칭 시.
- 사업자 인증/대표관리자 위임 절차는 비즈 차원.
- 게임 등급분류 = 한국 법규. 글로벌 출시 시 재검토.
- 이미지 규격 (600×600 등) 은 토스 grid 종속.

---

## 연결

- 토스 8종 세트: [토스 앱인토스 — 플랫폼 개요](toss-overview.md) · [토스 앱인토스 — 서비스 오픈 프로세스](toss-onboarding-process.md) · [토스 앱인토스 — 서비스 오픈 정책](toss-service-policy.md) · [토스 앱인토스(Apps in Toss) 미니앱 브랜딩 가이드](toss-miniapp-branding.md) · [토스 앱인토스 다크패턴 방지 정책](toss-dark-pattern-policy.md) · [토스 UX 라이팅 가이드 — 보이스톤](toss-ux-writing.md) · [토스 앱인토스 해상도 가이드](toss-resolution.md)
- 권한 3 layer 적용: `skills/npc-harness/references/welfare-gate.md`
- profile mutability: `skills/npc-harness/templates/npc-profile.template.md`
- 게임 등급 적용: ai-npc-game (한국 출시 시)
