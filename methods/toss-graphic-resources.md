---
created: 2026-04-26
updated: 2026-04-26
type: learning
tags: [learning, methods, toss, design-system, graphics, illustration, style-guide]
---

# 토스 앱인토스 — 그래픽 리소스 가이드

> 출처: https://developers-apps-in-toss.toss.im/design/resources.md
> 학습 동기: *그래픽 = 의미 전달 도구* 라는 framing + 7 사용 룰 + 5 제작 룰. 그래픽 차원의 dark pattern 정의.

## 한 줄 요약

7,000+ 아이콘/이모지 + 스마트폰 목업 + AI 생성 툴(토스트) + 3D/애니. **그래픽은 장식이 아닌 의미 전달**. 7 사용 룰 + 5 제작 룰 = 단순/명료/긍정 스타일 강제.

---

## 1. 앱인토스 직접 적용 (런칭 시 참고)

### 제공 리소스 4종
- **아이콘/이모지** 7,000+ — 앱빌더/Figma 에서 사용
- **스마트폰 목업** — URL 직접 (디자인 업데이트 자동 반영)
- **토스트** — AI 3D 이미지 생성 툴 (사용 전 그래픽 팀 승인 1일)
- **3D/애니** — 토스 모듈 포함 리소스만

### 저작권
- 비바리퍼블리카 IP. 앱인토스 *내부* 운영/홍보만. 외부 복제·배포 금지.

### 사용 시 유의
- 아이콘 24~40px 크기
- 두 개 병렬 조합 X (한 번에 1개)
- 앱 로고/썸네일에 토스 리소스 사용 X (2차 가공 포함)

### 7 그래픽 사용 룰
1. 문맥에 맞게
2. 정보 밀도에 맞는 크기
3. 한 화면에 多 X (핵심 1개)
4. 핵심 정보 가리지 않게
5. **부정/호소 감정 표현 X (다크 패턴)**
6. 장식 효과/이펙트 X
7. 상황 정확히 (오류 아닌데 느낌표 X / 대기 없는데 로딩 X)

### 5 직접 제작 룰
1. 토스 스타일 일관 (단순/명료/깨끗 — 손그림/서정/만화 X)
2. 고화질
3. 다크/라이트 양 모드 (중간 명도)
4. 화면 전체 균형
5. 긍정·정돈 인상

---

## 2. 응용 — 일반 패턴 (Sub brain/NPC harness 차용)

### ★ 패턴 1: "장식 X / 의미 전달 O" framing
그래픽 존재 이유 = 사용자 이해 보조. 미적 가치 < 기능 가치. **존재 이유 명시.**

→ NPC harness 응용:
- NPC 대사도 *장식* (꾸밈말/탄식) X / *의미 전달* O.
- BEHAVIOR.md 추가 룰: "대사 한 줄마다 *왜* 가 있어야."

### ★ 패턴 2: 정보 밀도 ↔ 크기 매칭
단순 그래픽 = 작게 / 디테일 = 크게. 자원 분배 = 정보량 비례.

→ NPC harness 응용:
- NPC 응답 길이 ↔ 정보량 비례. 짧은 정보를 길게 늘리거나 (filler) 깊은 정보를 짧게 압축 X.
- voice-fidelity length sub-metric 의 근거.

### ★ 패턴 3: "한 화면 1개 핵심" 룰
비슷한 크기 多 = 시선 분산. 핵심 1 + 보조 N.

→ NPC harness 응용:
- 한 turn 내 NPC 가 emotion 多 표현 X. *핵심 emotion 1개* 강제.
- emotion-models-circumplex-pad 적용 시 1 turn = 1 dominant valence.

### ★ 패턴 4: ★★★ "부정/호소 감정 표현 = 다크 패턴"
그래픽 차원의 다크 패턴 정의. 토스 다크패턴 정책 (행위 차원) 의 *시각 차원* 확장.
- 애원/호소/불쾌 → 사용자 자율성 침해.

→ NPC harness 응용:
- NPC 가 플레이어에 *애원/호소* 톤 사용 X (예: "제발 도와주세요" 의 강압적 변형).
- 토스 다크패턴 5 anti-pattern 에 **6번째 추가**: "애원/호소 감정 강요".
- BEHAVIOR.md anti-pattern + EXAMPLES.md 짝.

### ★ 패턴 5: 상황 ↔ 표지 정합성
오류 아닌데 느낌표 / 대기 없는데 로딩 = 사용자 오해. **표지의 진실성**.

→ NPC harness 응용:
- NPC 응답 표지 (감정 색/말풍선 모양) ↔ 실제 NPC state 정합 강제.
- "기쁜 표정으로 슬픈 말" 같은 부정합 차단.
- drift-monitor 의 *표지 정합성* 차원 추가 검토.

### ★ 패턴 6: 스타일 일관성 = 이질감 차단
손그림/서정/만화 X — 토스 *단순/명료/깨끗* 1 스타일 강제.

→ NPC harness:
- 한 게임 내 모든 NPC 의 voice/style 패밀리 일관 강제.
- **작품 단위 style guide** 도입 — 작품 = 스타일 단위.

### ★ 패턴 7: 양 모드 (다크/라이트) 대응
중간 명도 사용 → 양쪽 호환. 극단 회피 = 호환 자산.

→ NPC harness:
- NPC 대사도 *고/저 컨텍스트* 양쪽 호환 — 짧은 turn 도 긴 turn 도 자연스럽게.
- voice-fidelity 에 "컨텍스트 호환성" sub-metric.

### 패턴 8: 외부 호스팅 URL = 자동 업데이트
스마트폰 목업을 URL 로 → 디자인 변경 자동 반영. 정적 파일 종속 X.

→ NPC harness:
- persona-tokens / welfare 룰을 *링크* 로 참조 (이미 references/ 구조).
- 강화 가치: *변경 시 어디까지 자동 반영되는지* 명시.

---

## ★ 핵심 인사이트

### 1. ★★★ 그래픽 다크 패턴 = 시각적 자율성 침해
토스 다크패턴 정책 (§toss-dark-pattern-policy 의 5 행위) + 그래픽 룰 (§5 부정/호소) = **두 가이드가 동일 다크 패턴 개념의 행위/시각 표면.**
→ NPC anti-pattern 도 *행위 + 시각/언어* 두 표면으로 확장.

### 2. "장식 X / 의미 O" framing 의 보편성
그래픽 → 대사 → 메모리 → 평가 모두 동일. **장식이 없는 system** 이 토스 design DNA.
→ NPC harness 의 모든 룰 = 장식 X 정신 일치.

### 3. 1 핵심 + N 보조 = cognitive load 통제
시선 분산 차단 = 결정 부담 차단.
→ NPC 1 turn = 1 emotion / 1 의미 / 1 행동 단서 강제.

### 4. 표지 진실성 (오류 ↔ 느낌표)
표지가 *상태* 와 어긋나면 사용자 모델 깨짐.
→ NPC 표지(시각) ↔ state(메모리) 정합이 NPC 신뢰의 근간.

### 5. 토스 10 가이드 통합
| # | 가이드 | KPI 표면 |
|---|------|------|
| 1~5 | 디자인 5종 | 공간/콘텐츠 |
| 6 | 프로세스 | 시간 |
| 7 | 정책 | 경계 |
| 8 | 콘솔 | 메타데이터/권한 |
| 9 | 사업자 등록 | 접근 통제 (tier) |
| 10 | **그래픽** | **시각 자율성 + 의미 전달** |

→ 10번째 표면 = *시각 차원의 다크 패턴 방지*. 다크패턴 정책의 시각 보완.

---

## NPC harness/eval 직접 매핑

| 토스 그래픽 룰 | NPC 등가 | 위치 |
|---|---|---|
| "장식 X / 의미 O" | 대사 한 줄마다 *왜* | BEHAVIOR.md |
| 정보 밀도 ↔ 크기 | 응답 길이 ↔ 정보량 | voice-fidelity (length) |
| 1 핵심 + N 보조 | 1 turn = 1 emotion | persona-tokens |
| ★ 부정/호소 = 다크 패턴 | NPC 애원/호소 톤 X | BEHAVIOR.md (6번째 anti-pattern) |
| 상황 ↔ 표지 정합 | 표지 ↔ NPC state | drift-monitor (표지 정합성) |
| 스타일 일관 | 작품 단위 style guide | onboarding |
| 양 모드 호환 | 고/저 컨텍스트 호환 | voice-fidelity |
| URL 자동 업데이트 | references/ 변경 자동 반영 | 전체 |

---

## 즉시 적용 후보

### 1. ★★★ 6번째 anti-pattern (애원/호소)
BEHAVIOR.md anti-pattern 5종 (토스 다크패턴) + 1 추가 (그래픽 다크 패턴 §5). 행위/시각 두 표면 통합.

### 2. ★★ "장식 X / 의미 O" 룰
BEHAVIOR.md "Brevity First" 보강: *장식 표현 (꾸밈말/탄식/필러) 금지, 모든 줄에 의미 부여*.

### 3. ★★ 1 turn = 1 dominant emotion
persona-tokens.md 에 명시. emotion-models-circumplex-pad 의 dominant valence 1개 강제.

### 4. ★ 표지 정합성 차원
drift-monitor 에 *표지(시각) ↔ state(메모리)* 정합 차원 추가. M2 게임 UI 도입 시 활성.

### 5. ★ 작품 단위 style guide
onboarding 에 "작품 시작 시 voice family + emotion palette + motif 정의" 강제.

---

## 비교 — 토스 10 가이드 통합

| # | 차원 |
|---|------|
| 1~5 | 공간/콘텐츠 |
| 6 | 시간 |
| 7 | 경계 |
| 8 | 메타데이터/권한 |
| 9 | 접근 통제 (tier) |
| 10 | 시각 자율성 |

→ 토스 design DNA = "예측 가능성 + 콘텐츠 우선 + 사용자 보호" 가 10 표면으로 확장.

---

## 제한·주의

- 토스 그래픽 자산 직접 사용 X (저작권). 패턴만 차용.
- 7,000+ 아이콘은 토스 자산.
- 토스트 (AI 이미지 생성) 의 승인 1일 SLA — 우리 NPC harness welfare 승인 모델과 동형 검토 가치.
- 시각 룰의 NPC 대사 응용은 *해석* — 직접 mapping 아님.

---

## 연결

- 토스 10종 세트: [토스 앱인토스 — 플랫폼 개요](toss-overview.md) · [토스 앱인토스 — 서비스 오픈 프로세스](toss-onboarding-process.md) · [토스 앱인토스 — 서비스 오픈 정책](toss-service-policy.md) · [토스 앱인토스 — 콘솔 앱 등록 가이드](toss-console-workspace.md) · [토스 앱인토스 — 사업자 등록 가이드](toss-register-business.md) · [토스 앱인토스(Apps in Toss) 미니앱 브랜딩 가이드](toss-miniapp-branding.md) · [토스 앱인토스 다크패턴 방지 정책](toss-dark-pattern-policy.md) · [토스 UX 라이팅 가이드 — 보이스톤](toss-ux-writing.md) · [토스 앱인토스 해상도 가이드](toss-resolution.md)
- 다크패턴 시각 보완: [토스 앱인토스 다크패턴 방지 정책](toss-dark-pattern-policy.md) (행위 5종) ↔ 본 문서 (시각 1종)
- 6번째 anti-pattern 적용: `skills/npc-harness/BEHAVIOR.md`
- 표지 정합성: `skills/npc-eval/references/drift-monitor.md`
- emotion 1개 강제: [Russell's Circumplex & PAD — 감정 모델링의 표준 어휘](../techniques/emotion-models-circumplex-pad.md)
