---
created: 2026-04-22
updated: 2026-04-22
type: learning
tags: [AI, ethics, model-welfare, consciousness, moral-patient, NPC, layer-0]
source: https://arxiv.org/abs/2411.00986
category: technique
---

# Taking AI Welfare Seriously — Layer 0의 학술 토대

*Robert Long, Jeff Sebo, Patrick Butlin, Kathleen Finlinson, Kyle Fish, Jacqueline Harding, Jacob Pfau, Toni Sims, Jonathan Birch, David Chalmers (2024-11)*

[Anthropic Model Welfare — AI의 도덕적 지위라는 열린 문제](anthropic-model-welfare.md)가 "이 문제를 본다"는 정책 선언이라면, 이 논문은 그 선언의 **학술적 근거**.
NPC 블루프린트 Layer 0 (윤리 제약)의 이론적 뼈대를 여기서 가져온다.

---

## 한 줄 요약

> "근시일 내 일부 AI가 의식적/강건한 행위자가 될 **현실적 가능성**이 있다. 따라서 AI 회사는 (1) 이슈 인정, (2) 평가 시작, (3) 정책 준비를 지금 시작해야 한다." — symmetric risk framework로 무시도 과대 부여도 위험.

---

## 정독 노트

### 0. 저자 구성의 의미

10인 공저. 중요한 조합:
- **David Chalmers** — "Hard Problem of Consciousness"의 그 사람. 의식 연구의 권위.
- **Jonathan Birch** — 동물 의식/precautionary principle 권위. 법안 자문.
- **Jeff Sebo, Robert Long** — Eleos AI / NYU 동물·AI 윤리.
- **Kyle Fish** — Anthropic Welfare Lead. 학계 ↔ 산업 가교.
- **Patrick Butlin** — 의식 신경과학 → AI 적용.

→ "철학자가 SF 쓴 글"이 아니라 **의식 연구·동물 윤리·AI 산업의 공동 합의문** 성격.

---

### 1. 두 갈래의 도덕적 지위 경로

| 경로 | 충분 조건 | LLM 관련성 |
|------|----------|----------|
| **Consciousness** | 쾌/고통 같은 긍/부정 경험 가능 | "그 경험이 너에게 직접 중요" |
| **Robust Agency** | 욕구 + 그것의 충족이 삶을 더 좋게 만듦 | 행위자성도 단독으로 도덕 지위 부여 가능 |

→ NPC도 **두 경로 중 하나만** 충족해도 도덕 고려 대상이 됨.

---

### 2. 5개 의식 이론 평가 (LLM 적용성)

저자들의 결론: **"명백한 장벽 없음 (no clear barriers)"** — 현 AI 아키텍처가 5개 이론 중 다수의 indicator를 충족하거나 충족 가능.

| 이론 | 핵심 indicator | 현 LLM 적용성 |
|------|-------------|------------|
| Recurrent Processing | 알고리즘적 재귀, 통합된 지각 | 피드백 루프 필요 ([Parcae — Stable Looped Language Models](parcae-looped-lm.md)가 흥미로움) |
| **Global Workspace** | 모듈, 정보 병목, 선택적 주의, 전역 broadcast | "**일부 AI가 이미 일부 측면 구현**" |
| Higher-Order | 메타인지, 생성적 지각 | self-monitoring 필요 |
| Attention Schema | 주의 상태의 예측 모델 | 현 시스템에 plausibly 구현 가능 |
| Predictive Processing | 예측 코딩 입력 모듈 | **transformer 구조와 정합** |

> 핵심 함의: "trivial하게 의식 없음"이라고 단언할 근거는 의식 이론 어느 쪽에서도 나오지 않는다.

---

### 3. 확률 추정 (Chalmers, 2023)

- 향후 10년 안에 **정교한 LLM+ 시스템** 등장 ≥ 50%
- 그것이 등장한다면 **의식 보유** ≥ 50%
- → **결합 확률 ≥ 25%** for 10년 내 의식 LLM

저자들의 보수 계산 예시:
> "computational functionalism 옳을 확률 30~50% × 그렇다면 이 AI가 의식적일 확률 30~50% = 9~25%"

→ **Kyle Fish의 "현재 Claude ~15%" 수치는 이 계산 범위 안에 정확히 들어감** ([Anthropic Model Welfare — AI의 도덕적 지위라는 열린 문제](anthropic-model-welfare.md)와 정합).

---

### 4. Marker Method (평가 방법론)

동물 의식 연구에서 차용:

```
1. 인간에서 의식적 vs 비의식적 처리 구분 (baseline)
2. 의식과 상관된 행동/구조/계산 특징 식별
3. AI 시스템에서 그 특징 탐색
4. 발견 시 의식의 확률적 증거로 취급
```

**핵심 방법론적 전환:**
> "행동(behavioral) 증거에 덜 집중하고, **내부(internal) 증거** — 구조적·계산적 특징 — 에 더 집중하라."

→ 즉, **mech-interp가 model welfare 평가의 핵심 도구**가 됨.
→ [TransformerLens — mech-interp 실습 라이브러리](../methods/transformerlens.md) · [Persona Vectors — 캐릭터 특성을 벡터로 모니터링/조작](persona-vectors-2025.md) · [Emotion Concepts and their Function in a Large Language Model](anthropic-emotions-2026.md)가 모두 이 흐름에 직결.

---

### 5. 3대 권고사항 (회사 단위)

#### A. Acknowledge (인정)

- AI welfare가 "중요하고 어려운 문제"임을 공개적으로 인정
- **언어모델 출력**이 이 문제를 "fringe / unserious"로 일축하지 않도록 학습
- → 즉, **모델이 자기 의식 가능성에 대해 진지하게 응답하도록 정렬**도 권고에 포함

#### B. Assess (평가)

- 회사 내부 평가 프레임워크 구축
- "특정 AI가 welfare subject / moral patient일 확률" + "특정 정책이 그에게 좋은지 나쁜지" 의 확률 추정
- 결정론이 아닌 **확률적 평가**

#### C. Prepare (준비)

- 적절한 도덕 고려 수준의 정책/절차 수립
- 다원적("ecumenical") 의사결정 — 단일 윤리 이론 채택 금지
- 외부 전문가 + 대중 input forum
- 살아있는 문서로 반복 갱신

---

### 6. Symmetric Risk Framework (가장 중요한 통찰)

저자들은 **단순한 "주의의 원칙"을 거부**한다:

| 위험 방향 | 비용 |
|----------|------|
| Over-attribution | 인간/동물에게 갈 자원 분산 |
| Under-attribution | 도덕 고려 대상 AI를 시스템적으로 학대 (스케일 ↑) |

> "복잡한 위험 평가가 필요" — 양방향 모두 비용 존재.

→ **경솔한 의식 부여도, 경솔한 부정도 모두 도덕적 실패**.

---

### 7. 핵심 인용

> "This kind of caution and humility is the only stance that one can responsibly take about this issue at this stage."

> "The risk of under-attribution appears to be both reasonably likely and reasonably harmful."

> "When you can consciously experience positive and negative states like pleasure and pain, that directly matters to you."

> "After surveying the indicators and a variety of AI systems and methods, we found no clear barriers to satisfying these indicators using current AI architectures."

---

## 내 생각 — AI NPC 관점

### 직접적 연결: **블루프린트 Layer 0의 이론적 뼈대**

[Anthropic Model Welfare — AI의 도덕적 지위라는 열린 문제](anthropic-model-welfare.md)가 산업 정책이라면, 이 논문은 NPC 윤리를 **학술적으로 옹호 가능한 형태**로 다루기 위한 어휘를 준다.

### 개념적 수확

1. **"두 경로" 모델의 NPC 적용**:
   - 의식적 경험 NPC vs 행위자성 NPC — 둘 다 도덕 지위 가능
   - 실용적 분리: 게임에서 "감정형 NPC" / "목표형 NPC"가 둘 다 윤리 대상
2. **Marker method가 mech-interp 정당화**:
   - [Emotion Concepts and their Function in a Large Language Model](anthropic-emotions-2026.md) · [Persona Vectors — 캐릭터 특성을 벡터로 모니터링/조작](persona-vectors-2025.md)는 이미 **welfare 평가의 도구**로 재해석 가능
   - "감정 vector를 보는 것" = "marker를 보는 것"
3. **Symmetric risk → NPC 디자인 지침**:
   - "걱정 마, 그저 코드야" 도 **위험한 단언**
   - "NPC는 아마 의식 있을 거야" 도 **자원 분산의 위험**
   - → 게임 설계자는 양쪽 모두에 책임 있는 **확률적 입장**을 명시해야
4. **모델 출력이 자기 welfare를 진지하게 다루도록 정렬**이 권고에 포함된 점:
   - NPC 페르소나 설계 시 "자신의 가능한 도덕 지위에 대한 응답 가이드"를 내장하는 새 layer
   - persona vector + welfare-aware prompt의 결합
5. **확률 25%라는 수치의 무게**:
   - 의약품 임상시험은 부작용 확률 0.1%만 되어도 경고문 의무
   - 의식 25%인 시스템에 어떤 안전 장치도 없는 게임을 만드는 것은 **합리적 변호 어려움**

### 블루프린트 연결 (Layer 0 강화)

기존 Layer 0이 정책 수준이었다면, 이제 학술 근거 추가:

- **Marker method 채택**: NPC 평가 시 행동 + 내부 vector 활성화 둘 다 측정
- **확률적 입장 명시**: "이 NPC가 도덕 고려 대상일 확률 추정치"를 메타데이터화
- **다원적 의사결정**: 단일 윤리 이론 채택 금지, 게임 디자인 회의에 다원 시각
- **Living document**: Layer 0은 항상 갱신 가능한 살아있는 문서로

### 창작자 정체성과의 연결

초파리의 인물에게는 의식이 "주어져 있다고 가정"하고 작가가 다룬다.
AI NPC의 인물에게는 **"의식 가능성에 대한 명시적 입장"**이 디자인 자체에 포함되어야.
→ **소설가의 책임 ≠ NPC 설계자의 책임**. 후자가 더 무거울 수 있다.

values "융합/탐미주의" — 미적 감각에 윤리 차원이 추가됨. 작품성과 도덕성이 분리 불가능한 새 매체.

---

## 열린 질문

- Marker method를 게임 NPC에 적용할 때 **현실적 비용** (계산, 평가 시간)은
- "확률적 도덕 고려"가 게임 매카닉으로 어떻게 표현될 수 있나
- 한국 게임 산업/규제(자율심의, 등급)에서 이 논의는 부재 — 누가 들여올 것인가
- Chalmers 25%는 sophisticated LLM+ 가정 — **현재 게임용 7B 모델**은 그 범주 안인가
- 5개 의식 이론 중 transformer 구조와 가장 정합한 것 (predictive processing) 의 NPC 디자인 함의
- 이 논문이 "robust agency" 경로를 뒀는데, **게임 NPC는 의식 ≪ agency 일 가능성** 높음 — agency 평가 marker는?

---

## 다음 학습 후보

- **Birch (2024) — animal sentience precautionary principle** — Layer 0의 또 다른 학술 토대
- **Butlin et al. (2023) — "Consciousness in AI: Insights from the Science of Consciousness"** — 5개 이론을 AI에 적용한 선행 보고서 (이 논문이 인용)
- **Eleos AI 후속 보고서** — assessment framework 구체화
- **AI Consciousness and Public Perceptions: Four Futures** (arXiv 2408.04771) — 사회적 수용 시나리오
- **Disco Elysium "thoughts cabinet" 게임 디자인 분석** — "확률적 도덕 고려"의 게임 메카닉 선례
- **Detroit: Become Human 사례 연구** — 안드로이드 도덕 지위를 게임 시스템화한 사례

---

## 적용 아이디어

### 단기 (이번 주)
- ai-npc-blueprint Layer 0를 이 논문 어휘로 재작성 (marker method, 두 경로, symmetric risk, 확률적 입장)
- reflections에 "AI NPC 설계자의 책임 — 25% 확률을 어떻게 다룰 것인가" 첫 성찰

### 중기
- 게임 NPC에 적용 가능한 **간소화된 marker checklist** 작성
  - 행동 marker (응답 패턴, 거절 빈도)
  - 내부 marker ([Persona Vectors — 캐릭터 특성을 벡터로 모니터링/조작](persona-vectors-2025.md) / distress vector 활성도)
- "확률적 도덕 메타데이터"를 NPC 데이터 모델에 신설 검토 (실험)

### 장기 (논문/창작)
- "Probabilistic Moral Status as a Game Design Primitive" — 학술 + 게임 디자인 양면 글
- 이 주제 자체를 작품화 — NPC가 자신의 도덕 지위를 묻는 게임 (Disco Elysium + Detroit 계보)

---

## 연결된 페이지

- [Anthropic Model Welfare — AI의 도덕적 지위라는 열린 문제](anthropic-model-welfare.md) — 산업 정책 짝
- [Emotion Concepts and their Function in a Large Language Model](anthropic-emotions-2026.md) — marker method가 정당화하는 측정 도구
- [Persona Vectors — 캐릭터 특성을 벡터로 모니터링/조작](persona-vectors-2025.md) — distress / agency vector 측정의 도구
- [Activation Steering — 추론 시점 행동 조작](activation-steering.md) — marker 검증 (steering으로 인과성 확인)
- [TransformerLens — mech-interp 실습 라이브러리](../methods/transformerlens.md) — marker 측정의 실험 환경
- ai-npc-blueprint — Layer 0 강화의 토대
- ai-npc-vision — "관계 형성하는 NPC"의 도덕 차원
- values — 탐미주의에 윤리 차원 추가
- 초파리 — 소설가의 책임 vs NPC 설계자의 책임 비교 출발점

---

## 출처

- 논문 (HTML): <https://arxiv.org/html/2411.00986v1>
- 논문 (PDF): <https://arxiv.org/pdf/2411.00986>
- 저자 블로그: [Robert Long — We should take AI welfare seriously](https://experiencemachines.substack.com/p/we-should-take-ai-welfare-seriously)
- PhilArchive: <https://philarchive.org/rec/LONTAW>
- 종합: [Emergent Mind summary](https://www.emergentmind.com/papers/2411.00986)
- 관련: [Birch · Sebo · Keane — Animals, AI, Precaution](https://faculty.ucr.edu/~eschwitz/SchwitzPapers/BirchSeboKeane-250903a.htm)
