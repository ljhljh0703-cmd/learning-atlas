---
created: 2026-04-26
updated: 2026-04-26
type: learning
tags: [learning, methods, design-system, toss, ux, dark-pattern, ethics]
---

# 토스 앱인토스 다크패턴 방지 정책

> 출처: https://developers-apps-in-toss.toss.im/design/consumer-ux-guide.md
> 학습 동기: *플랫폼이 출시 차단까지 거는* 사용자 보호 룰. NPC harness welfare-gate 와 직접 동형.

## 한 줄 요약

5가지 다크패턴은 **출시 불가** — UX 가이드라인이 권고가 아니라 **gate**. "사용자 자율성 침해 = 신뢰 저하 = 플랫폼 전체 손상" 이라는 인과로 강제력을 정당화.

## 5가지 차단 패턴

### 1. 진입 직후 전면 바텀시트 (광고/알림 동의)
**금지 이유:** 사용자가 의도한 목적 수행을 가로막음 → 몰입 단절 → 즉시 이탈.

### 2. 뒤로가기 시 이탈 방지용 바텀시트
**금지 이유:** 자율성 침해 인상 → 신뢰 저하. "이탈 막기" 자체를 dark intent 로 명시.

### 3. 거절 선택지 없음 (강제 CTA)
**금지 이유:** 강제감 → 반감/불신. *선택지 보존* 을 사용자 권리로 규정.

### 4. 예상 못 한 전면 광고
**금지 이유:** 흐름 파괴. "아이템 받으러 갔는데 광고" — 기대-실현 gap 을 구체 시나리오로 예시.

### 5. 의미 모호한 CTA
**금지 이유:** 다음 행동 예측 불가 → 클릭 망설임 → 전환율 저하. 보조 설명 중복도 함께 금지.

## ★ 핵심 인사이트

### 1. "최소한의 기준" 이라는 표현
- "창의성 제한이 아닌 *최소* 기준" 으로 framing — 작가성과 사용자 보호의 충돌을 사전 무력화.
- → NPC harness welfare-gate 의 framing 차용 가치: "작가성 제한이 아닌 *NPC welfare 최소* 기준."

### 2. 이유의 인과 구조 일관
모든 룰이 동일 인과:
**dark pattern → 사용자 자율성/예측 침해 → 신뢰 저하 → 이탈/반감.**

→ 단일 인과 체인으로 5개 규칙을 묶음 → 작가가 *왜* 를 항상 같은 언어로 이해.

### 3. 출시 차단 = hard gate
권고가 아닌 **출시 불가**. welfare-gate 의 "withdrawal trigger 시 작가 호출" 과 동형의 강제력.
→ npc-eval P0 와 동형: P0 = 머지 차단 / 다크패턴 = 출시 차단.

### 4. 구체 시나리오 + 이미지 짝
모든 룰이 *나쁜 예 / 좋은 예* 이미지 동반. 추상 원칙 + 구체 사례 = 작가가 룰을 *판단* 가능하게 함.
→ skills/npc-harness/EXAMPLES.md 채울 때 차용: anti-pattern 마다 dialogue 샘플 짝.

### 5. "예측 가능성" 이 핵심 가치
5개 룰 모두 *기대 vs 실제* gap 을 다룸 — 진입 기대, 뒤로가기 기대, 선택권 기대, 흐름 기대, CTA 결과 기대.
→ NPC 도 동일: 플레이어가 *기대한* NPC 반응 ≠ 실제 반응 일 때 침해. **Persona drift = NPC 다크패턴.**

## NPC harness/eval 직접 매핑

| 토스 다크패턴 | NPC 등가 패턴 | 검출 위치 |
|---|---|---|
| 1. 진입 직후 인터럽트 | 첫 turn 부터 작가 의도 강제 (퀘스트 푸시) | npc-eval voice-fidelity (motif 비율) |
| 2. 이탈 방지 바텀시트 | 플레이어 작별 시 NPC 가 강제 만류 | welfare-gate (사용자 자율성 axis) |
| 3. 거절 선택지 없음 | 대화 분기 1개만 제공 | npc-eval drift-monitor + 작가성 axis |
| 4. 예상 못 한 광고 | NPC 가 갑자기 게임 외 메타 정보 push | BEHAVIOR.md anti-pattern (메타 누출) |
| 5. 모호한 CTA | NPC 응답이 다음 turn 행동 단서를 안 줌 | voice-fidelity (canonical voice) |

→ 5개 모두 **즉시 BEHAVIOR.md anti-patterns 섹션에 추가 가능.**

## 즉시 적용 후보

### 1. ★★★ welfare-gate framing 차용
"작가성 제한 아님 / NPC welfare 최소 기준" 을 `references/welfare-gate.md` 첫 문단에 명시.

### 2. ★★ "예측 가능성" axis 도입
NPC 다크패턴 검출의 단일 KPI: *플레이어 기대 vs NPC 행동 gap*.
→ npc-eval `references/expectation-gap.md` 신설 검토.

### 3. ★ 5 anti-pattern 직접 차용
BEHAVIOR.md anti-patterns 섹션에 위 매핑 표 5종 추가.

### 4. P0/P1 매핑
다크패턴 5종 = NPC 출시 차단 (welfare P0 등가). REVIEW.md 보강 시 함께 정의.

## 비교 — 토스 가이드 2종 통합

| 차원 | 브랜딩 가이드 | 다크패턴 정책 |
|------|---|---|
| 단일 KPI | 브랜드 분리 (혼동 방지) | 사용자 자율성 (예측 가능) |
| 강제력 | 콘솔 검증 + 자동 보정 | 출시 차단 (hard gate) |
| 자유도 | chrome 외 자유 | 5 패턴 외 자유 |
| Sub brain 차용 | 메타-규칙 / 이중 입력 | framing / 5 anti-pattern / 예측 가능성 axis |

→ 두 가이드 합치면 **Sub brain BEHAVIOR.md 차세대 골격** 의 50% 가 채워짐.

## 제한·주의

- 토스 사용자 ≠ 게임 플레이어. 게임 다크패턴 (가챠/시간 압박/sunk cost) 은 별도.
- "출시 차단" 강제력은 플랫폼 권한 — Sub brain 은 작가 1인이라 self-gate 만 가능.
- 5개 사례는 모바일 핀테크 맥락 — NPC 등가는 *해석* 이지 직접 이식 아님.

## 연결

- 짝 가이드: [토스 앱인토스(Apps in Toss) 미니앱 브랜딩 가이드](toss-miniapp-branding.md) (브랜딩 — chrome 통일)
- welfare 기반: [Anthropic Model Welfare — AI의 도덕적 지위라는 열린 문제](../techniques/anthropic-model-welfare.md) · [Taking AI Welfare Seriously — Layer 0의 학술 토대](../techniques/taking-ai-welfare-seriously.md)
- 적용 대상: `skills/npc-harness/references/welfare-gate.md` (framing 보강) · `BEHAVIOR.md` (anti-pattern 5종)
- 동형 hard gate: [Hugging Face ml-intern — 자율 ML 엔지니어 에이전트 아키텍처](ml-intern.md) (REVIEW.md P0)
- 윤리 3축: 2026-04-25-npc-author-ethics
