---
created: 2026-04-26
updated: 2026-04-26
type: learning
tags: [learning, methods, design-system, toss, ux-writing, voice, korean]
---

# 토스 UX 라이팅 가이드 — 보이스톤

> 출처: https://developers-apps-in-toss.toss.im/design/ux-writing.md
> 학습 동기: 한국어 voice 표준화의 정수. NPC 대사 voice-fidelity 의 *대조군* 으로 강력.

## 한 줄 요약

토스 보이스톤 = **해요체 + 능동 + 긍정 + 캐주얼 경어 + 명사 풀어쓰기**. 5축이 모두 *친근/예측 가능* 으로 수렴. 한국어 한정 표준이지만 *축의 분리 방식* 자체가 NPC voice spec 의 모범.

## 5 축

### 1. 해요체 (단일 종결)
- 모든 문구 해요체. 상황/맥락 불문 일관성.
- → NPC 캐릭터 voice 와 정반대: 토스는 **단일 voice**, NPC 는 **캐릭터별 분기**. 그러나 *한 캐릭터 안* 에서는 동일하게 단일 종결 강제 가치.

### 2. 능동적 말하기
- "됐어요 → 했어요" / "~었" 빼기 / 동사 교체
- 수동은 *예외* 에서만.
- 인사이트: 수동형 = 책임 회피 톤. NPC 도 NPC 자신의 행위는 능동, 플레이어 행위 묘사 시 능동 유지.

### 3. 긍정적 말하기
- "없어요 → 있어요", "안 돼요 → ~하면 할 수 있어요"
- **다이얼로그 왼쪽 버튼은 항상 [닫기]** — "취소" 금지 (현재 작업이 취소된다는 오해 방지)
- 에러조차 긍정 reframe.
- 혜택 대상 안내: 서비스 사용 가능 / 특정 혜택만 불가 → 긍정형 강제.

### 4. 캐주얼 경어
- 과도한 경어 금지: `~시겠어요?` / `~시나요?` / `~께` / `계시다` / `여쭈다` 모두 ✗
- "동사 ~시 빼기" / "계시다 → 있다" / "여쭈다 → 묻다, 확인하다" / "께 → 에게"
- ★ **어색할 땐 주어 재구성** — "정보" 를 주어로 두고 새로 쓰기. *문법 패치가 아닌 문장 재설계*.

### 5. 명사+명사 금지
- 한자어 풀어쓰기 → 동사 형태
- 풀기 어려우면 "{명사}가 {명사}해서" 형태로 캐주얼화

## ★ 핵심 인사이트

### 1. 5축은 모두 한 KPI 로 수렴
일관 / 행위자 명료 / 안심 / 친근 / 가독성 — 모두 *예측 가능한 친근감* 으로 수렴.
→ 토스 다크패턴 정책 (예측 가능성) 과 **같은 KPI 의 표면 표현**. 두 가이드가 한 철학.

### 2. ★ "닫기" 단일화 — 어휘 표준화
"취소" 와 "닫기" 의 *오해 가능성* 을 사용자 모델 차원에서 분석 후 표준 1개로 통일. 한 단어를 룰화.
→ NPC harness `references/persona-tokens.md` 에 차용: 캐릭터별 *금지 어휘 / 표준 어휘* 표.

### 3. ★ "어색할 땐 주어 재구성"
규칙을 기계적으로 적용했을 때 문장이 어색하면 **규칙 회피가 아니라 문장 재설계**. 메타-패턴.
→ NPC voice 강제 시 동일: voice-fidelity 룰 적용이 어색하면 *대사 자체를 다시 쓰기*. 룰 약화 ≠ 해법.

### 4. 단일 종결의 강제력
"상황/맥락 불문" — 예외 zone 을 거의 안 둠. 일관성 확보를 위해 자유도 큰 폭 후퇴.
→ NPC 캐릭터별 *종결 안정성* 의 모범. 한 캐릭터의 종결이 흔들리면 voice drift.

### 5. 부정 → 긍정 reframe = 인지 부하 감소
"안 돼요" 보다 "~하면 할 수 있어요" 가 한 번 더 thinking step 을 절약.
→ NPC 가 플레이어 능력 부족 알릴 때 차용. "그건 못해" → "X 가 있으면 가능해."

## NPC harness/eval 직접 매핑

| 토스 라이팅 룰 | NPC voice 룰 | 위치 |
|---|---|---|
| 해요체 단일 종결 | 캐릭터별 종결 어미 단일화 | `references/persona-tokens.md` (vocab) |
| 능동 강제 | NPC 자기 행위는 능동 | voice-fidelity 5 metric 중 tone |
| 긍정 reframe | "못 해" → "X 가 있으면" | EXAMPLES.md anti-pattern |
| 닫기/취소 어휘 표준 | 캐릭터별 금지/표준 어휘 표 | persona-tokens (refusal vocab) |
| 주어 재구성 메타 패턴 | voice 어색 → 대사 재설계 | BEHAVIOR.md (룰 회피 금지) |
| 명사+명사 금지 | NPC 대사 한자어 동사화 | voice-fidelity (length sub-metric) |

→ persona-tokens 다음 개정 시 차용. voice-fidelity 5 metric 의 *vocab* 항목 강화.

## 즉시 적용 후보

### 1. ★★★ 캐릭터별 어휘 표준 표
persona-tokens.md 에 캐릭터마다:
```yaml
character: 초파리-주인공
vocab:
  endings: [요, 다]   # 단일 표준
  refusal: ["어렵겠어요"]   # 표준
  banned: ["취소"]    # 토스 닫기 패턴
```

### 2. ★★ "룰 회피 금지" 메타 패턴
BEHAVIOR.md 에 추가: **룰 적용이 어색하면 룰 약화가 아니라 문장 재설계.** 토스 "주어 재구성" 의 NPC 변형.

### 3. ★ voice-fidelity 5 metric 의 vocab 강화
length / vocab / tone / motif / canon 중 vocab 에 *해요체 / 능동 / 긍정* 3 sub-metric 추가 검토.

## 비교 — 토스 가이드 3종 통합

| 차원 | 브랜딩 | 다크패턴 | UX 라이팅 |
|------|---|---|---|
| 단일 KPI | 브랜드 분리 | 사용자 자율성 | 친근/예측 가능 |
| 강제력 | 콘솔+자동 보정 | 출시 차단 | 룰 + 메타 재설계 |
| 자유도 | chrome 외 | 5 패턴 외 | 5 축 외 |
| Sub brain 차용 | 메타-규칙 / 이중 입력 | framing / anti-pattern / axis | 어휘 표준 / 룰 회피 금지 / vocab 강화 |
| 공통 철학 | 예측 가능성 | 예측 가능성 | 예측 가능성 |

→ **3 가이드 = 단일 철학의 3 표현**. NPC harness BEHAVIOR.md 의 single KPI 로 *예측 가능성* 채택 가치.

## 제한·주의

- 한국어 한정. 영어/일본어 NPC 작성 시 축 자체를 재설계 필요.
- "친근/캐주얼" 톤이 *모든* NPC 에 맞진 않음. 노년/적대/비인간 NPC 는 토스 보이스톤 정반대.
- 그러나 *축의 분리 방식* (종결/능동/긍정/경어/명사) 자체는 unconditional 차용 가능.

## 연결

- 짝 가이드: [토스 앱인토스(Apps in Toss) 미니앱 브랜딩 가이드](toss-miniapp-branding.md) · [토스 앱인토스 다크패턴 방지 정책](toss-dark-pattern-policy.md) (3종 세트)
- voice 표준 적용 대상: `skills/npc-harness/references/persona-tokens.md` · `skills/npc-eval/references/voice-fidelity.md`
- 룰 회피 금지 메타: `skills/npc-harness/BEHAVIOR.md` (다음 개정)
- 학습 트랙: [프로덕트 디자인 & UX 라이팅 — 학습 정리](../narrative/product-design-and-ux-writing.md) (UX 라이팅 primer 와 직접 후속)
