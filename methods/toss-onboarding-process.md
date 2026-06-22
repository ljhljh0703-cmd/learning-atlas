---
created: 2026-04-26
updated: 2026-04-26
type: learning
tags: [learning, methods, toss, miniapp, process, onboarding, review]
---

# 토스 앱인토스 — 서비스 오픈 프로세스

> 출처: https://developers-apps-in-toss.toss.im/intro/onboarding-process.md
> 학습 동기: 출시까지 5단계 프로세스 + 4단계 검수의 *분업 구조*. NPC harness "3 게이트" 모델 검증.

## 한 줄 요약

**5단계 (시작/디자인/개발/검수/출시) + 4단계 검수 (운영/기능/디자인/보안), 평균 2~3일.** 게임은 추가 등급 심의 강제. 디자인 툴 2종(앱빌더/Figma) 으로 진입 다양화.

---

## 1. 앱인토스 직접 적용 (런칭 시 참고)

### 5단계 출시 흐름
1. **시작하기** — 콘솔 등록
2. **디자인** — 앱빌더 (전용 웹 툴, TDS 라이브러리 포함) 또는 Figma
3. **개발** — SDK 2.x 강제 (1.x 2026-03-23 이후 업로드 차단), API 사용 시 mTLS 인증서 필수
4. **검수** — 4단계 (아래)
5. **출시** — 이메일 통보 → 콘솔 '출시하기'

### 4단계 검수 (평균 2~3일)
| 단계 | 범위 |
|---|---|
| 운영 검수 | 앱 정보 / 노출 정보 / 서류 |
| 기능 검수 | 토스 앱 내 정상 동작 |
| 디자인 검수 | UI 가이드 준수 |
| 보안 검수 | 개인정보 / 보안 |

### 게임 추가 의무
- **등급 심의 강제** — 게임물관리위원회 또는 자체등급분류사업자(앱스토어/플레이스토어/원스토어/Microsoft Store) 경유.

### 기술 강제
- SDK 2.x (1.x deprecation 일정 명시)
- mTLS 양방향 인증서 (파트너사 ↔ 앱인토스 서버)

---

## 2. 응용 — 일반 패턴 (Sub brain/NPC harness 차용)

### ★ 패턴 1: 4단계 검수 = 직교 차원 분리
운영 / 기능 / 디자인 / 보안 — 4 차원이 *서로 겹치지 않음*. 한 검수자가 한 차원만 책임.
- 단일 reviewer 가 모든 차원 보면 cognitive overflow → 차원별 분리.

→ npc-eval 매핑:
| 토스 검수 | NPC eval 등가 |
|---|---|
| 운영 | profile metadata 정합 |
| 기능 | dialogue 동작 (응답 생성/메모리 쓰기) |
| 디자인 | voice-fidelity (캐릭터 voice 일관) |
| 보안 | welfare-gate + 사용자 보호 (메타 누출/조작 금지) |

→ npc-eval `references/eval-axes.md` 신설 검토. 4 차원 분리.

### ★ 패턴 2: 명시적 deprecation 일정
SDK 2.x 마이그레이션, 2026-03-23 차단. **날짜 + 동작 + 대안** 3종 명시.

→ NPC harness 변경 정책:
- BEHAVIOR.md / persona-tokens 변경 시 *날짜 + 영향 + 마이그레이션 경로* 명시.
- "급격한 룰 변경 금지" 룰 자체 차용.

### ★ 패턴 3: 평균 SLA 공개 (2~3일)
검수에 *시간 약속*. 작가 (파트너사) 가 일정 계획 가능.

→ NPC harness 운영:
- npc-eval cycle 의 평균 시간 측정 + 명시. "1 turn 평가 평균 X초" 같은 SLA.
- M1 운영 시 도입.

### ★ 패턴 4: 디자인 진입 2종 (앱빌더 / Figma)
- *낮은 진입* (앱빌더 — 웹, 설치 X, TDS 내장)
- *높은 자유* (Figma — 전문 도구)
- 두 트랙 병행 = 사용자 숙련도 spectrum 모두 흡수.

→ NPC harness onboarding 응용:
- 작가 진입도 2 트랙: *템플릿 기반 (낮은 진입)* + *직접 작성 (높은 자유)*.
- skills/npc-harness `templates/` 가 이미 존재 → onboarding.md 에 두 트랙 명시 가치.

### ★ 패턴 5: 외부 인증 위임 (게임 등급 심의)
플랫폼이 직접 검증 안 함 → *공인 기관 위임*. 책임 외부화 + 표준 활용.

→ NPC welfare 응용:
- AI welfare 기준은 자체 정의 X — Anthropic Welfare 가이드 / Long·Sebo·Chalmers 등 *외부 표준 인용*.
- 우리 welfare-gate.md 가 이미 이 패턴. 의식적으로 강화.

### 패턴 6: mTLS = 양방향 신뢰
일방향 인증 (서버만 검증) 이 아닌 양방향. *파트너사도 plat 을 검증할 수 있음.*

→ NPC harness:
- 작가 ↔ harness 도 양방향: harness 가 작가에게 "이 입력 거절" 가능 (welfare-gate), 작가도 harness 결정 거부 가능 (override). **양방향 거부권**.

---

## ★ 핵심 인사이트

### 1. "5단계 + 4단계 검수" = 표준 lifecycle
대부분의 plat 출시 lifecycle 의 모범. 작가 → 콘텐츠 → 검증 → 게시.

### 2. ★ 검수의 직교 차원화
4 차원이 직교 → 검수자 cognitive load 낮춤 + 누락 위험 낮춤. **단일 종합 검수보다 4 분할이 강함.**

### 3. SDK deprecation 패턴
명시 일정 + 마이그레이션 가이드 + 강제 차단. 변경의 *예측 가능성* 보장.

### 4. 토스 6 가이드 통합
| # | 가이드 | KPI 표면 |
|---|------|------|
| 1 | 브랜딩 | 혼동 방지 |
| 2 | 다크패턴 | 자율성 |
| 3 | UX 라이팅 | 친근/예측 |
| 4 | 해상도 | 일관 렌더 |
| 5 | 개요 | 콘텐츠/chrome 분업 |
| 6 | **프로세스** | **lifecycle 예측 가능성** |

→ 6번째 표면 = *시간축 예측 가능성*. 5개는 공간/형태 축, 6은 시간 축. 토스 design DNA 의 시간 차원 추가.

---

## NPC harness/eval 직접 매핑

| 토스 프로세스 요소 | NPC harness 등가 | 위치 |
|---|---|---|
| 5단계 lifecycle | NPC 캐릭터 라이프사이클 (profile→dialogue→eval→archive) | ai-npc-game 프로젝트 |
| 4 검수 차원 | npc-eval 4 axes (metadata/function/voice/welfare) | npc-eval references/ |
| 게임 등급 심의 | AI welfare 외부 표준 인용 | welfare-gate.md (강화) |
| SLA 2~3일 | npc-eval cycle 평균 시간 명시 | M1 운영 |
| 앱빌더+Figma 2 트랙 | 템플릿+직접 작성 2 트랙 | onboarding.md |
| SDK deprecation | persona-tokens 변경 정책 | versioning 룰 |
| mTLS 양방향 | 작가 ↔ harness 양방향 거부권 | welfare-gate (override 명시) |

---

## 즉시 적용 후보

### 1. ★★★ npc-eval 4 axes 분리
운영/기능/디자인/보안 → metadata/function/voice/welfare 로 npc-eval 룰 차원 분리. ml-intern REVIEW.md 의 P0/P1/P2 와 *직교* 관계 (severity vs axes).

### 2. ★★ 작가 onboarding 2 트랙 명시
templates/ (낮은 진입) + 직접 SKILL.md (높은 자유) 를 onboarding.md 에 명시.

### 3. ★ 양방향 거부권 명시
welfare-gate.md 에 "harness → 작가 거절 + 작가 → harness override" 양방향 명시.

---

## 비교 — 토스 6 가이드 통합

| 차원 | 가이드 1~5 | 프로세스 (6) |
|------|---|---|
| 축 | 공간/형태/콘텐츠 | 시간/lifecycle |
| 강제력 | 출시 차단 | 일정 + deprecation |
| 차원 분리 | 단일 KPI | 4 직교 검수 차원 |
| 데이터 | 트래픽 (해상도) | SLA (2~3일) |
| Sub brain 차용 | 룰/어휘/분업 | **4 axes / 2 트랙 onboarding / 양방향 거부권** |

---

## 제한·주의

- 게임 등급 심의는 한국 법규 종속. AI NPC 게임 한국 출시 시 직접 적용.
- SDK 2.x 세부는 실제 런칭 시 별도 학습.
- 평균 2~3일 SLA 는 토스 사정 — 우리 npc-eval 측정값과 무관.
- 앱빌더 = 토스 자체 자산. 우리는 직접 사용 불가.

---

## 연결

- 토스 6종 세트: [토스 앱인토스 — 플랫폼 개요](toss-overview.md) (분업) · [토스 앱인토스(Apps in Toss) 미니앱 브랜딩 가이드](toss-miniapp-branding.md) · [토스 앱인토스 다크패턴 방지 정책](toss-dark-pattern-policy.md) · [토스 UX 라이팅 가이드 — 보이스톤](toss-ux-writing.md) · [토스 앱인토스 해상도 가이드](toss-resolution.md)
- 4 axes 적용 대상: `skills/npc-eval/references/` (eval-axes.md 신설)
- 양방향 거부권 적용: `skills/npc-harness/references/welfare-gate.md`
- 동형 검수 게이트: [Hugging Face ml-intern — 자율 ML 엔지니어 에이전트 아키텍처](ml-intern.md) (REVIEW.md severity)
- 출시 lifecycle 적용: ai-npc-game (M1~M4 일정)
