---
created: 2026-04-26
updated: 2026-04-26
type: learning
tags: [learning, methods, toss, miniapp, business, tier, gating]
---

# 토스 앱인토스 — 사업자 등록 가이드

> 출처: https://developers-apps-in-toss.toss.im/prepare/register-business.md
> 학습 동기: *기능 게이팅* 의 tier 모델. 비사업자/개인사업자/법인사업자 3 단계로 기능 차등 제공.

## 한 줄 요약

사업자 등록은 *선택*. 단 수익화/인증 6 기능 (토스로그인/비즈월렛/프로모션/인앱광고/인앱결제/토스페이) 은 사업자 강제. **3 tier 게이팅** 으로 진입 장벽 ↓ + 책임 영역 ↑.

---

## 1. 앱인토스 직접 적용 (런칭 시 참고)

### 3 Tier 기능 매트릭스
| Tier | 가능 | 불가 |
|------|------|------|
| 비사업자 | 미니앱 출시, 세그먼트, 푸시/알림, 게임 프로필/리더보드, 공유 리워드 | 6 수익화 기능 전부 |
| 개인 사업자 | 위 + 6 수익화 기능 | — |
| 법인 사업자 | 위 + 6 수익화 기능 | — |

### 등록 서류
- **법인 본인:** 사업자등록증 + 등기부등본
- **법인 대리:** + 법인 인감증명서, 위임장, 대리인 신분증
- **개인 본인:** 사업자등록증
- **개인 대리:** + 개인 인감증명서, 위임장, 대리인 신분증

### 제약
- 등기부등본 **발급일 기준 3개월 이내**
- 사업자 업종 = 미니앱 서비스 업종 일치 강제
- **부가가치세 면세 사업자 등록 불가**
- 검토 1~2일

---

## 2. 응용 — 일반 패턴 (Sub brain/NPC harness 차용)

### ★ 패턴 1: Tier 기반 기능 게이팅
*검증 수준* 별 기능 차등. 진입 장벽 낮은 tier (출시 가능) + 책임 큰 tier (수익화).
- 비사업자도 *체험* 가능 → 진입 마찰 0
- 수익화는 *책임* 동반

→ NPC harness 응용:
- **Tier 1 (체험):** template 만 사용한 캐릭터 — 자동 검증, 즉시 동작
- **Tier 2 (작가 검증):** 본인 작성 + welfare-gate 통과 — eval cycle 1회
- **Tier 3 (출시):** 5+1 ensemble 통과 + 작가 final review — 게시 가능

### ★ 패턴 2: 자격 만료 (3개월)
등기부등본 신선도 강제 — *시점 신뢰* 보장. 오래된 증빙은 무효.

→ NPC harness 응용:
- persona-vector 측정값 *유효 기간* 도입 (예: M1 운영 시 30일).
- voice-fidelity baseline 도 시점별 재측정.

### ★ 패턴 3: 일치 강제 (업종 ↔ 서비스)
사업자 업종과 미니앱 서비스 *일치* 강제. 두 메타데이터 정합성.

→ NPC harness 응용:
- profile.archetype ↔ dialogue 실측 voice 일치 강제.
- 불일치 시 drift-monitor 자동 flag (이미 구현 방향과 일치 — 강화).

### ★ 패턴 4: 면세 사업자 차단
세금 신고 불가 → 정상 운영 불가. *세금* 이라는 외부 시스템 의존성 차단 사유.

→ NPC harness 응용:
- 외부 시스템 (LLM API, persona-vector storage 등) 의존성 *명시 차단 조건*.
- 의존 외부 시스템 SLA 미달 시 자동 운영 중지 룰.

### ★ 패턴 5: 본인 vs 대리 서류 차등
본인 = 최소 / 대리 = +위임장 +인감 +신분증. 권한 위임의 *증빙 비용* 명시.

→ NPC harness 응용:
- 작가 본인 = 단순. 작가 대리 (collaborator) = +위임 명시 + 검증 자료.
- M2 협업 모드에 명시.

### 패턴 6: 서비스 출시 후 사후 점검
"출시 이후 위반 확인 시 → 안내 후 운영 중지" — *연속 검증*.

→ NPC harness:
- 출시 후 NPC 도 주기적 welfare audit. 한 번 통과 ≠ 영구 통과.

---

## ★ 핵심 인사이트

### 1. ★ Tier 게이팅 = 진입/책임 분리의 정수
*무료 체험* + *유료 책임* 의 2 모드 표준. NPC harness 도 작가 입문 가능성 + 출시 작가 책임 분리.

### 2. 시점 신뢰 (3개월 유효)
정적 증빙도 *시간 경과* 로 무효. NPC voice/persona 도 동일 — 한 번 측정 ≠ 영구.

### 3. 메타데이터 정합성 강제
업종 ↔ 서비스 불일치 = 출시 차단. NPC profile ↔ dialogue 불일치 = drift.

### 4. 외부 의존성 명시 차단
면세 사업자 = 외부 (세금 시스템) 의존성 결함. 우리도 외부 LLM/storage 의존성 정의 필요.

### 5. 토스 9 가이드 통합
| # | 가이드 | KPI |
|---|------|------|
| 1~5 | 디자인 5종 | 공간/콘텐츠 |
| 6 | 프로세스 | 시간 |
| 7 | 정책 | 경계 |
| 8 | 콘솔 | 메타데이터/권한 |
| 9 | **사업자 등록** | **Tier 게이팅 + 시점 신뢰** |

→ 9번째 표면 = *접근 통제*. 단일 철학 "예측 가능성 + 콘텐츠 우선 + 사용자 보호" 에 *접근 차원* 추가.

---

## NPC harness/eval 직접 매핑

| 토스 사업자 등록 | NPC 등가 | 위치 |
|---|---|---|
| 3 tier 기능 매트릭스 | 캐릭터 3 tier (체험/검증/출시) | onboarding.md |
| 3개월 유효 | persona-vector 30일 재측정 | drift-monitor.md |
| 업종 ↔ 서비스 일치 | profile ↔ dialogue voice 일치 | drift-monitor (강화) |
| 면세 사업자 차단 | 외부 시스템 SLA 미달 차단 | welfare-gate (시스템 의존성 axis) |
| 본인 vs 대리 서류 | 작가 vs collaborator 검증 | M2 협업 모드 |
| 출시 후 사후 점검 | NPC 주기적 welfare audit | M1 운영 |

---

## 즉시 적용 후보

### 1. ★★★ 캐릭터 3 tier 게이팅 (Tier 1/2/3)
onboarding.md 에 명시:
- Tier 1 — template 기반, 자동 검증, 즉시
- Tier 2 — welfare-gate + eval 1 cycle
- Tier 3 — 5+1 ensemble + 작가 final review

### 2. ★★ persona/voice 시점 유효성
drift-monitor 에 baseline 재측정 주기 (30일) 추가.

### 3. ★ 외부 시스템 의존성 axis
welfare-gate 4 axis (welfare/사용자 보호/작가성/법적) 에 *시스템 의존성* 검토 추가.

---

## 비교 — 토스 9 가이드 통합

| # | 가이드 | 차원 |
|---|------|------|
| 1~5 | 디자인 5종 | 공간/콘텐츠 |
| 6 | 프로세스 | 시간 |
| 7 | 정책 | 경계 |
| 8 | 콘솔 | 메타데이터/권한 |
| 9 | 사업자 등록 | 접근 통제 (tier) |

→ 토스 design DNA 9 표면 완전 정렬.

---

## 제한·주의

- 한국 사업자 제도 종속. 글로벌 출시 시 별도.
- 면세 차단은 토스 정산 system 종속.
- 본인/대리 서류 세부는 실제 등록 시.
- *3 tier 게이팅* 패턴만 unconditional 차용.

---

## 연결

- 토스 9종 세트: [토스 앱인토스 — 플랫폼 개요](toss-overview.md) · [토스 앱인토스 — 서비스 오픈 프로세스](toss-onboarding-process.md) · [토스 앱인토스 — 서비스 오픈 정책](toss-service-policy.md) · [토스 앱인토스 — 콘솔 앱 등록 가이드](toss-console-workspace.md) · [토스 앱인토스(Apps in Toss) 미니앱 브랜딩 가이드](toss-miniapp-branding.md) · [토스 앱인토스 다크패턴 방지 정책](toss-dark-pattern-policy.md) · [토스 UX 라이팅 가이드 — 보이스톤](toss-ux-writing.md) · [토스 앱인토스 해상도 가이드](toss-resolution.md)
- 3 tier 게이팅 적용: `skills/npc-harness/references/onboarding.md`
- 시점 유효성 적용: `skills/npc-eval/references/drift-monitor.md`
- 외부 의존성: `skills/npc-harness/references/welfare-gate.md`
