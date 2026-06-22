---
created: 2026-04-26
updated: 2026-04-26
type: learning
tags: [learning, methods, design-system, toss, resolution, miniapp, game]
---

# 토스 앱인토스 해상도 가이드

> 출처: https://developers-apps-in-toss.toss.im/design/resolution.md
> 학습 동기: 미니앱(특히 게임) 풀스크린 설계의 *기준 해상도 + 스케일링* 철학. NPC 게임 미니앱 출시 시 직접 적용.

## 한 줄 요약

**디바이스별 대응 X / 기준 해상도 1개 + 스케일링 O**. 논리/에셋 해상도 분리, 1x+2x 두 그룹, 데이터 기반 70~80% 커버리지로 long-tail 무시. 풀스크린·Safe Area 강제.

---

## 1. 앱인토스 직접 적용 (1차 목적)

### 풀스크린 강제 5종 (게임 미니앱 출시 조건)
- 콘텐츠 화면 완전 채움
- 웹뷰 여백/반투명 영역 0
- 회전 시 비율 깨짐/레터박스 0
- 노치/카메라홀/Dynamic Island = Safe Area 처리
- 스케일링 시 에셋 품질 저하 0

### 권장 기준
- **논리 해상도**: 세로 360×640~420×740 / 가로 640×360~740×420 중 1개
- **에셋 해상도**: 1x + 2x (3x 는 그래픽 중요 시만)
- **테스트 기기**: 3~5종 (다른 비율 2~3 + Safe Area 큰 1 + 작은 화면 1)

### 데이터 근거
- 트래픽 70~80% = 가로 800~900 / 세로 360~420 viewport
- 나머지는 long-tail → 무시 합리화

### 권장하지 않는 방식 4종
- 디바이스 모델별 논리 해상도
- 실제 픽셀 기준 UI/좌표
- 과한 에셋 그룹
- 해상도별 다른 레이아웃

---

## 2. 응용 — 일반 패턴 (Sub brain/NPC harness 차용)

### ★ 패턴 1: "기준 1개 + 스케일링" 메타 원칙
- **다양성 → 분기 대응** 이 아니라 **다양성 → 단일 기준 + 변환** 으로 환원.
- 차원 폭증 (디바이스 N×해상도 M) 을 1차원으로 압축.

→ NPC harness 적용:
- 캐릭터 voice 도 *플레이어 N명 × 상황 M개* 분기 대신 **캐릭터 1개 voice 기준 + 상황별 스케일링** 으로 설계.
- voice-fidelity 룰이 곧 "논리 해상도".

### ★ 패턴 2: 두 층위 분리 (논리 vs 물리)
- 논리 해상도 = *의미/로직 좌표계* / 에셋 해상도 = *물리 표현 품질*
- 두 층 독립 변경 가능.

→ Sub brain 적용:
- NPC profile = *논리* (캐릭터 motivation/voice spec) / dialogue 출력 = *물리* (실제 토큰)
- 두 층 독립으로 관리 → profile 변경 없이 출력 품질만 조정 가능.

### ★ 패턴 3: 데이터 기반 80/20 정당화
- "70~80% 트래픽 커버" 라는 *측정값* 으로 long-tail 절단을 정당화.
- 추측 기반 완벽주의 회피.

→ Sub brain 적용:
- npc-eval 메트릭 cap (P1=3) 도 동일 정신.
- "모든 edge case 대응" 대신 "주 흐름 80% 커버" framing.
- 작가 결정 시 "측정값 없이 long-tail 추가 X" 룰.

### 패턴 4: 테스트 기기 3~5종 — 표본 커버리지
- 차원별 극단값 (비율/Safe Area/크기) 1개씩 → 적은 표본으로 넓은 커버.
- 모든 조합 X.

→ npc-eval ensemble (5+1) 와 동형:
- 모델 family 다양성 = 토스 "기기 비율 다양성"
- 적은 N 으로 차원 커버.

### 패턴 5: 안티-패턴의 명시적 열거
- "권장하지 않는 방식 4종" 을 *명시적으로* 적음 → 작가가 *왜 이 길이 막혔는지* 학습.
- 토스 다크패턴 정책과 동일 형식.

→ BEHAVIOR.md anti-pattern 섹션의 표준 형식: **금지 + 결과** 짝.

---

## ★ 핵심 인사이트

### 1. "단일 기준 + 변환" = 복잡도 관리의 정수
다양성을 *분기* 가 아닌 *변환* 으로 흡수. NPC harness 의 단일 voice + 상황 modulation 과 동형.

### 2. 측정 기반 long-tail 절단의 윤리적 명료성
"long-tail 무시" 가 무책임이 아니라 *책임 있는 trade-off* 임을 데이터로 정당화. 측정값 없이는 안 함.

### 3. 풀스크린 강제 = 몰입 우선
브랜딩/다크패턴/UX 라이팅 모두와 일관: **방해 요소 제거**. 토스 design system 의 4번째 KPI 표면.

### 4. 토스 4 가이드 통합 KPI
| 가이드 | 표면 | 통합 KPI |
|------|------|---------|
| 브랜딩 | 혼동 방지 | 예측 가능성 |
| 다크패턴 | 자율성 | 예측 가능성 |
| UX 라이팅 | 친근/예측 | 예측 가능성 |
| 해상도 | 일관 렌더 + 몰입 | 예측 가능성 |

→ **4 가이드 = 단일 철학 "예측 가능성" 의 4 표면.** 압도적으로 일관된 design system.

---

## NPC harness/eval 직접 매핑

| 토스 해상도 룰 | NPC 등가 | 위치 |
|---|---|---|
| 논리 해상도 1개 | 캐릭터 voice spec 1개 | persona-tokens.md |
| 에셋 1x+2x | dialogue 출력 short/long 2 모드 | EXAMPLES.md |
| 70~80% 커버리지 | npc-eval 주 흐름 80% target | BEHAVIOR.md |
| 3~5 테스트 기기 | 5+1 ensemble judge | ensemble-judge.md |
| 풀스크린 강제 | 캐릭터 in-character 강제 | welfare-gate (메타 누출 금지) |
| 권장하지 않는 4종 | anti-pattern 명시 형식 | BEHAVIOR.md |

---

## 즉시 적용 후보

### 1. ★★ 메타 원칙 — "분기 대신 변환"
BEHAVIOR.md 에 추가: **다양성 처리 시 N개 분기 대신 1개 기준 + modulation 우선.** 룰 폭증 방지.

### 2. ★★ 80/20 절단 정당화 룰
"long-tail 추가 시 측정값 인용 필수" — npc-eval 룰 추가에 적용.

### 3. ★ 두 층 분리 명세
NPC profile (논리) vs dialogue (물리) 분리를 persona-tokens 첫 문단에 명시.

---

## 비교 — 토스 4 가이드 통합

| 차원 | 브랜딩 | 다크패턴 | UX 라이팅 | 해상도 |
|------|---|---|---|---|
| 강제력 | 콘솔 검증 | 출시 차단 | 룰 + 재설계 | 풀스크린 강제 |
| 자유도 | chrome 외 | 5 패턴 외 | 5 축 외 | 기준 해상도 외 |
| 데이터 근거 | — | — | — | ★ 70~80% 트래픽 |
| 통합 KPI | 예측 가능성 | 예측 가능성 | 예측 가능성 | 예측 가능성 |

→ 해상도 가이드만 *측정 데이터* 명시. **데이터 기반 정당화** 가 추가 차용 가치.

---

## 제한·주의

- 게임 미니앱 한정 (풀스크린 강제). NPC 게임이 미니앱 형태로 출시될 때만 1차 적용.
- 360×640 등 구체 수치는 모바일 종속. NPC 게임이 PC/콘솔이면 수치 무관.
- "응용" 패턴 (단일 기준 + 변환, 80/20 절단, 두 층 분리) 은 unconditional 차용.

---

## 연결

- 토스 4종 세트: [토스 앱인토스(Apps in Toss) 미니앱 브랜딩 가이드](toss-miniapp-branding.md) · [토스 앱인토스 다크패턴 방지 정책](toss-dark-pattern-policy.md) · [토스 UX 라이팅 가이드 — 보이스톤](toss-ux-writing.md)
- NPC 응용 대상: `skills/npc-harness/references/persona-tokens.md` · `BEHAVIOR.md`
- 동형 ensemble: [Hugging Face ml-intern — 자율 ML 엔지니어 에이전트 아키텍처](ml-intern.md) (REVIEW.md P1 cap = 80/20 절단)
- AI NPC 게임 출시 시: ai-npc-game (미니앱 형태 검토 시 1차 적용)
