---
created: 2026-04-25
updated: 2026-06-16
type: learning
tags: [llm, npc, communication-game, werewolf, theory-of-mind, multi-agent, emergent-behavior]
source: https://github.com/xuyuzhuang11/Werewolf
category: technique
authors: "Yuzhuang Xu, Shuo Wang, Peng Li, Yang Liu 외"
year: 2024
---

# Werewolf LLM (Xu et al. 2023, Tsinghua)

> Exploring Large Language Models for Communication Games: An Empirical Study on Werewolf
> arXiv:2309.04658v2 (2024-05) · Yuzhuang Xu, Shuo Wang, Peng Li, Yang Liu 외 — Tsinghua
> 코드: https://github.com/xuyuzhuang11/Werewolf

> ⚠️ 이전 분류 오류: "한국 저자" 표기는 잘못이었음. Tsinghua 중국 팀 논문. 그래도 게임×LLM 멀티에이전트 통신 게임 연구의 대표격이라 Tier 2 핵심 유지.

---

## 한 줄

7인 늑대인간 게임을 **frozen GPT-3.5**로 플레이. 4-component prompt + 비-파라미터 경험 학습. **trust / confrontation / camouflage / leadership** 4대 전략 행동이 사전 프로그래밍 없이 **자발 emergent**.

## 핵심 도전 3가지

1. **Context length 제한** — 통신 게임은 history 의존인데 다 못 넣음
2. **복잡 추론** — 타 플레이어 의도 추론 + 의사결정
3. **Fine-tuning 비현실적** — 시간/데이터 비용 → tuning-free 필요

## 4-component Prompt 구조 (Fig. 2)

| Part | 내용 |
|------|------|
| 1 | 게임 규칙 + 역할 묘사 + human prior |
| 2.1 | 최근 K=15 messages (Freshness) |
| 2.2 | rule-matching으로 추출한 informative messages (Informativeness) |
| 2.3 | reflection R (Completeness) |
| 3 | experience pool에서 추출한 suggestion |
| 4 | CoT prompt |

## Reflection by Answering Questions (핵심 트릭)

전체 history를 못 넣으니 **질문-답변으로 압축**:
1. 사전 정의 질문 셋에서 L=5개 LLM이 선택
2. 자유 질문 M=2개 추가 생성
3. 각 질문에 대해 Sentence-BERT(`multi-qa-mpnet-base-cos-v1`)로 short-term memory에서 top-T 메시지 검색
4. LLM이 답변 생성 → 모아서 reflection R 합성

→ context 한계 우회하면서 historical info 압축.

## 비-파라미터 경험 학습

**Experience Pool:**
- 라운드 종료 시 모든 에이전트의 (response, reflection, score) 튜플 저장
- score = 승자 1000-T_max, 패자 T_max (빨리 이기거나 천천히 지면 고득점)

**Suggestion 추출 시 함정:**
- 전체 sub-set 쓰면 성능 **악화** — "승자 경험은 다 좋다"가 거짓이라서
- **lowest score = 거의 확실히 나쁨** + **median 근처 = 좋을 확률 높음**
- 이 둘만 추출해서 LLM에 "나쁜 거 G0랑 좋은 후보들 {G1...Gn} 차이 찾아라" 프롬프트
- → 실수 회피 + 좋은 행동 모방 동시 학습

## 결과

10/20/30/40 라운드 experience pool 비교 (50 라운드 평가):
- 10~20 라운드: 승률 + duration 모두 향상 (효과 명확)
- 30~40 라운드: 불안정 — 경험 늘수록 단조 향상 X
- **이유 추정:** 늑대인간(experience pool 미사용) 성능도 동시에 변함 — multi-LLM 게임에서 "한 쪽 고정 baseline" 가정 자체가 깨짐

→ **Multi-agent 시스템에서 학습 평가의 근본 난점** 노출.

## 4대 Emergent Strategic Behaviors

| 행동 | 정의 | 예시 |
|------|------|------|
| **Trust** | 공통 목표 가정 + 증거 기반 신뢰 | 자기에게 불리한 정보 자발 공유, 공동 고발 |
| **Confrontation** | 상대 진영 행동 | 늑대 야간 공격, 낮 고발, 가드 보호 |
| **Camouflage** | 정체 은닉 / 오도 | "I'm a villager" (실제 늑대), 마녀가 villager 행세 |
| **Leadership** | 타 플레이어 행동 유도 | "seer야 정체 밝혀줘"로 주의 분산 |

**Trust Relationship Table** 시각화 — 시간 경과로 신뢰 자발 증가, 20-rounds 경험 사용 시 양방향 신뢰 더 빠르게 형성.

### 결정적 검증: 역할 이름을 무관하게 바꿔도 동일 행동 emergent

"werewolf" → "pretty girl" 로 바꿔도 같은 전략 출현. **훈련 데이터 의존 아님 = 진짜 emergent**.

→ ⚠️ 단, [Clever Hans or N-ToM? (Shapira et al. 2023) — LLM 사회 추론 능력의 진실](clever-hans-ntom.md) 관점에서 봐도 robust한 발견인지 더 검증 필요. (다른 분포 변형은 안 했음)

## Camouflage vs Hallucination 구분

LLM이 거짓을 말할 때:
- **Hallucination**: 사실 추적 실패
- **Camouflage**: 게임 목표를 위한 **합리적 거짓** (저자 주장: 다수가 후자)

→ 부록 A.4에서 분류 기준 제시. **AI 거짓말이 전략적이면 hallucination이 아니다**라는 정의 — NPC 작가 입장에서 흥미로운 프레임.

---

## 내 NPC 블루프린트 함의

### A. Park+2023 보완: 통신 게임 도메인

[Generative Agents (Park et al. 2023) — AI NPC의 성경](generative-agents.md) 는 샌드박스 일상 시뮬레이션. Werewolf는 **incomplete information + 적대** 환경. 둘이 직교:

| 측면 | Park (sandbox) | Xu (werewolf) |
|------|----------------|---------------|
| 환경 | 협력적, 정보 공유 | 적대, 정보 은닉 |
| 핵심 능력 | believable 일상 | 전략적 추론 + 거짓말 |
| 학습 | reflection만 | reflection + cross-round experience |
| 평가 | TrueSkill (인간 평가) | 승률 + duration |

**블루프린트 적용:** NPC가 "어떤 게임 장르"에 들어가는지에 따라 두 모델을 선택/혼합. RPG = Park 우세, 사회 추리 게임 = Xu 우세.

### B. Reflection-by-Question은 직접 베낄 수 있는 패턴

내 NPC가 긴 게임 history 안에서 동작해야 한다면, "사전 정의 질문 셋 + 자유 질문 + Sentence-BERT 검색 + 답변 합성"을 그대로 차용. Park의 reflection (importance threshold 150)은 **언제** trigger할지에 집중, Xu는 **무엇을** 압축할지에 집중. 결합 가능.

### C. 경험 풀의 score 정의가 핵심 — 단순 승패 X

"승자 = 좋다"는 거짓. **median 근처 + lowest 둘만 추출**이 핵심 발견. 내 시스템에서 NPC가 자기 행동 학습 시 비슷한 비대칭 활용:
- "최악 회피" 신호는 강하다 (lowest score)
- "최고 모방" 신호는 약하다 (winner 편향)
- → median bracketing이 일반적 NPC RL에도 응용 가능?

### D. Multi-agent 평가 함정 = 내 시스템에도 적용

Xu가 "늑대 = 고정 baseline" 가정 깨진 걸 발견. **NPC 성능 측정 시 다른 NPC도 동시에 변화**. → 절대 점수 X, **상대 평가 + 환경 통제** 필수.

### E. 4 전략 행동 = NPC 자발 emergent의 증거

Trust, confrontation, camouflage, leadership — 모두 사전 코딩 없이 출현. ai-npc-vision 의 핵심 주장 ("플레이어와 관계 형성하는 존재")의 **실증 사례**. 단:
- ⚠️ [Clever Hans or N-ToM? (Shapira et al. 2023) — LLM 사회 추론 능력의 진실](clever-hans-ntom.md) 관점: 진짜 ToM인지, 패턴 매칭인지는 별개 검증 필요
- 역할명 변경 robustness 테스트는 강한 증거지만, **adversarial probe** (transparent access 등)는 안 함

### F. Camouflage 정의 = 작가성 관점 신선

"전략적 거짓 = hallucination 아님" 정의. 내 NPC가 거짓말할 때:
- 게임 목표 정렬되면 → 의도된 행동 (작가성)
- 무목적 거짓 → 결함 (hallucination)
→ [Anthropic Model Welfare — AI의 도덕적 지위라는 열린 문제](anthropic-model-welfare.md) 의 "AI가 거짓말하는 게 윤리적인가" 질문과 교차. **내 답: 게임 픽션 안에서는 OK, 사용자 정보 보호 경계는 명시**.

---

## 한계

1. **GPT-3.5만 평가** — GPT-4, Claude, 오픈소스 LLM 비교 없음
2. **50 라운드 → 통계 약함** — variance 큰 게임 결과
3. **40 라운드 경험 풀에서 성능 plateau/감소** — 학습 메커니즘 한계
4. **Theory of Mind 진위 미검증** — [Clever Hans or N-ToM? (Shapira et al. 2023) — LLM 사회 추론 능력의 진실](clever-hans-ntom.md) 의 adversarial probe 안 함
5. **인간 vs LLM 평가 미실시** — Park+2023과 달리 인간 비교 없음

---

## 연결

- 짝: [Generative Agents (Park et al. 2023) — AI NPC의 성경](generative-agents.md) (협력 sandbox vs 적대 통신게임)
- 평가 경계: [Clever Hans or N-ToM? (Shapira et al. 2023) — LLM 사회 추론 능력의 진실](clever-hans-ntom.md) (emergent ≠ 진짜 ToM 검증 필요)
- 음성층: [RoleLLM (Wang et al. 2023) — 캐릭터 단위 역할극 LLM 표준화](role-llm.md) (역할별 말투 — Werewolf 내 역할 5종에 적용 가능)
- 블루프린트: ai-npc-blueprint Layer 4 (사회/관계)
- 비전: ai-npc-vision (자발 행동 emergent 실증)
