---
created: 2026-04-24
updated: 2026-06-28
type: learning
tags: [ai-npc, generative-agents, memory-stream, reflection, planning, park-2023, foundational]
source:
  - https://arxiv.org/abs/2304.03442
  - ../../../raw/papers/2023-park-generative-agents.pdf
  - https://github.com/joonspk-research/generative_agents
category: technique
---

# Generative Agents (Park et al. 2023) — AI NPC의 성경

> **AI NPC blueprint와의 직결성: 최상.** 본 논문이 내 ai-npc-vision과 ai-npc-blueprint 구조의 **직접 조상**. Layer 설계(Memory / Reflection / Planning)가 여기서 온 용어.
> 분류: technique (아키텍처 원본), 적용성: **직접·핵심**, 시급성: 즉시.

**저자**: Joon Sung Park (Stanford, PhD), Joseph O'Brien, Carrie Cai (Google), Meredith Morris (Google DeepMind), Percy Liang, Michael Bernstein (Stanford). UIST '23 Best Paper.

**arXiv**: 2304.03442 (2023-04) / **코드**: `joonspk-research/generative_agents`

---

## 한 줄 요약

25명의 LLM 에이전트를 The Sims 풍 Smallville 샌드박스에 풀어놓고 **Memory Stream + Reflection + Planning** 3요소 아키텍처로 2일간 자율 시뮬레이션. 한 명의 "발렌타인 파티 개최 의도" 시드에서 초대·장소 꾸미기·데이트 신청·당일 참석이 **자율 발생**. 인간 크라우드워커 roleplay보다 believability 점수 높음. Cohen's d = **8.16** (prior SOTA 대비).

---

## 3대 아키텍처 (핵심 중의 핵심)

### 1. Memory Stream (장기 기억)

- **자료구조**: 자연어 기술 + 생성 timestamp + 최근 접근 timestamp의 리스트
- **기본 단위**: `observation` (에이전트가 직접 지각한 사건)
- **retrieval function** = 다음 3개 점수의 **가중합** (모든 α=1):

| 점수 | 계산식 | 의미 |
|------|-------|------|
| **Recency** | 지수감쇠, `decay_factor = 0.995` (샌드박스 game hour 기준) | 최근성 |
| **Importance** | LLM이 1~10 점수 부여 (`brushing teeth=1`, `breakup=10`) | 핵심도 |
| **Relevance** | 쿼리와 메모리 임베딩의 **cosine similarity** | 상황 관련성 |

→ 세 점수를 min-max 정규화 후 합산, top-k를 컨텍스트에 포함.

**이게 바로 RAG의 원형 + 심리적 retrieval 이론(recency effect + emotional salience)을 컴퓨팅으로 구현한 것.** 현대적인 구현체로는 [Zep / Graphiti — Temporal Knowledge Graph for Agent Memory](zep-graphiti.md)의 3-tier KG 구조나 [CocoIndex — Incremental Data Pipeline for AI Agents](cocoindex.md)의 점진적 인덱싱 패턴이 이 철학을 계승하고 있습니다.

### 2. Reflection (고차 추론)

- **트리거**: 최근 event들의 importance 합계 > **150** (임계값)
- 실제로 하루 2~3회 reflection 발생
- **절차**:
  1. 최근 100개 메모리로 LLM에게: "이 정보로 답할 수 있는 가장 중요한 high-level 질문 3개는?"
  2. 생성된 질문을 retrieval 쿼리로 사용 → 관련 메모리 수집
  3. LLM에게 "이 진술들로부터 5개 high-level insight + 근거 memory id"
  4. 결과를 reflection으로 memory stream에 다시 저장 (근거 memory 포인터 포함)
- reflection 자체도 재귀적으로 reflection의 입력이 됨 → **reflection tree**

→ "**self-notion이 재귀적으로 더 추상화됨**". NPC의 **자기이해 깊이**가 트리 깊이에 비례.

### 3. Planning (장기 일관성)

- **Top-down 재귀 분해**:
  - 하루 5~8개 큰 덩어리 ("아침 루틴 → 대학 → 작곡 작업 → 저녁 → 취침")
  - 각 덩어리를 시간 단위로 세분 (1pm~5pm 작곡)
  - 다시 5~15분 단위로 (4:00 간식, 4:05 산책…)
- Plan도 memory stream에 저장됨 → retrieval 대상

### Reacting Loop

매 time step:
1. 환경 지각 → observation을 memory stream에 저장
2. LLM에게 "지금 plan 계속할까, react할까?"
3. React하면 해당 시점부터 plan 재생성
4. Agent 상호작용이면 dialogue 생성 (상대방에 대한 요약 메모리 + 의도로 조건화)

---

## Sandbox 구현 디테일

- **게임 엔진**: Phaser (웹 게임 프레임워크)
- **LLM**: gpt-3.5-turbo (논문 시점 GPT-4 API 초대제)
- **환경 표현**: **트리 자료구조** (containment 관계) → 자연어로 렌더링 ("kitchen에 stove가 있다")
- **에이전트의 세계 모델**: 자기가 경험한 subgraph만 보유. **omniscient 아님** — 못 가본 영역은 out-of-date
- **Action → state 전이**: LLM에게 "이 action이 object에 어떤 영향?" 질의 → JSON 업데이트
- **이동**: 환경 트리 recursive 쿼리로 최적 location 선택 → traditional path algorithm으로 애니메이션

---

## 평가 결과

### Controlled Evaluation (100 참가자, TrueSkill 랭킹)

5가지 질문 범주: Self-knowledge / Memory / Plans / Reactions / Reflections

| 조건 | μ (TrueSkill) | σ |
|------|--------------|---|
| **Full architecture** | **29.89** | 0.72 |
| No reflection | 26.88 | 0.69 |
| No reflection + no planning | 25.64 | 0.68 |
| **Human crowdworker (roleplay)** | **22.95** | 0.69 |
| No memory/planning/reflection (prior SOTA) | 21.21 | 0.70 |

- **Full vs prior SOTA: Cohen's d = 8.16** (8 표준편차 차이. 압도적)
- **LLM 에이전트 > 인간 roleplay** 에 주목 — 메모리 스트림 접근이 인간보다 풍부했기 때문
- Kruskal-Wallis: H(4) = 150.29, p < 0.001
- crowdworker와 fully ablated baseline만 pairwise 유의차 없음 (나머지 모두 유의)

### End-to-End Evaluation (25 agents × 2 game days)

| 창발 현상 | 수치 |
|---------|------|
| Sam 후보 정보 확산 | 1명 (4%) → 8명 (32%) |
| Isabella 파티 정보 확산 | 1명 (4%) → 13명 (52%) |
| 네트워크 밀도 증가 | 0.167 → 0.74 |
| Hallucination 비율 | 1.3% (6 / 453 응답) |
| 파티 실제 참석 | 12명 초대 → **5명 참석** |

→ **제대로 "사회" 가 작동함**. 한 명의 시드 의도에서 초대·장식·데이트·참석 체인이 전부 자율 발생.

---

## 3대 실패 양식 (NPC 설계 시 반드시 대비)

### 1. 기억 팽창 → 장소 선택 이상화

- 에이전트가 새 장소를 학습할수록 **"less typical locations"** 선택 증가
- 예: 점심을 카페에서 먹다가 bar 학습 후 낮에도 bar 가는 경향 (원래 의도는 저녁 모임 장소)
- → retrieval이 top-k에 압도됨. **장소 태깅 + 시간대 제약** 명시 필요

### 2. 물리적 규범의 자연어 전달 실패

- "dorm bathroom" = **1인용** 인데 에이전트는 "기숙사 화장실은 여럿이 쓰는 곳"이라는 world knowledge 적용 → 한 명 있는데 들어감
- 상점 5pm 폐점인데 진입
- **처방**: 장소 상태에 규범 명시 — `"one-person bathroom"` 같은 미세 라벨링

### 3. Instruction tuning 후유증 — 과잉 공손·협조

- Mei가 남편에게 **"It was good talking to you as always"** 같은 과한 격식
- Isabella가 모두의 파티 제안(셰익스피어 독회, 네트워킹 이벤트)을 **거절 못 함** → 결국 본래 정체성까지 변질
- → **캐릭터 일관성 보호 장치**(identity lock) + **reject 능력**이 필수

---

## 윤리·사회 영향 (저자 명시 4대 리스크)

1. **Parasocial relationship** — 사용자가 NPC에 감정 귀속. 대응: (a) 컴퓨팅 실체 공시, (b) 가치 정렬 — "사랑 고백 reciprocate 금지" 같은 룰
2. **Error propagation** — 잘못된 추론이 downstream에 누적
3. **Deepfake / 개인맞춤 조작** — audit log 의무화 제안
4. **Over-reliance** — 디자이너가 NPC를 실제 사용자 대체로 쓰는 오용. 초기 프로토타입 단계로만 제한 권고

→ [Anthropic Model Welfare — AI의 도덕적 지위라는 열린 문제](anthropic-model-welfare.md) / [Taking AI Welfare Seriously — Layer 0의 학술 토대](taking-ai-welfare-seriously.md) 와 **같은 축**. Layer 0 규범 구축에 직접 활용.

---

## 내 생각 — ai-npc-blueprint 재설계 근거

### A. 내 Layer 구조와의 매핑

| 내 Blueprint | Park et al. | 차이·추가 |
|------------|-------------|----------|
| Layer 0: Welfare/Consciousness | ❌ (논문엔 없음 — "Disney 캐릭터처럼 believability지 agency 아님"으로 면피) | **내 고유 확장** |
| Layer 1: Identity | agent summary description (반자동 생성) | 내 설계는 더 풍부한 identity anchoring 필요 |
| Layer 2: Memory | **Memory Stream 그대로 채용** ✅ | recency·importance·relevance 공식 차용 |
| Layer 3: Reflection | **Reflection tree 그대로 채용** ✅ | 임계값 150 같은 구체 파라미터까지 참고 |
| Layer 4: Planning | **Top-down 재귀 분해 채용** ✅ | |
| Layer 5: Social/Emergence | end-to-end 검증 방식 채용 | |

→ **Layer 2~4는 사실상 이 논문의 구조**. 블루프린트에 **"Park+2023 표준 준수"** 명시해야 함. 안 쓰는 게 낭비.

### B. 내 차별화 지점 (이 논문이 **안 다룬** 영역)

1. **Emotion vector + activation steering** ([Emotion Concepts and their Function in a Large Language Model](anthropic-emotions-2026.md), [Activation Steering — 추론 시점 행동 조작](activation-steering.md)) — Park 모델은 감정을 자연어로만 다룸. 내 설계는 **활성화 수준**까지 내려감
2. **Persona vectors** ([Persona Vectors — 캐릭터 특성을 벡터로 모니터링/조작](persona-vectors-2025.md)) — 논문의 "agent summary description" 을 LLM 내부 벡터로 고정해 **instruction tuning 후유증(3번 실패) 근본 차단** 가능
3. **Welfare 축** (Layer 0) — 논문은 의도적으로 "no genuine agency" 주장. 나는 반대로 가서 **도덕적 지위 문제를 설계 변수로 취급**
4. **창작·서사** — 논문의 목표는 "believable proxy of human behavior" (모사). 내 목표는 **관계 형성 + 서사 공동창작** (생성)

→ **같은 기본 구조 + 내 고유 4축 (emotion / persona / welfare / narrative)** 이 내 프로젝트의 차별화.

### C. Reflection 임계값 150의 의미

- importance 1~10 점수 → 150 = 대략 **20~30개 중요 사건 누적** 시 반성
- NPC 서사에서 이걸 **"각성 모먼트"**로 설계 가능 — 플레이어가 NPC에게 중요한 일을 축적시키면 NPC의 자기이해가 한 단계 도약

### D. 크라우드워커 < LLM 에이전트 의 충격적 의미

- 인간이 진짜 **자기가 아닌 캐릭터를 roleplay 하는 건 LLM보다 어렵다** 는 실증
- 이유: 인간은 **캐릭터의 메모리 전체를 인지적으로 유지 못함** (워킹메모리 한계)
- → 긴 메모리 활용이 요구되는 **심층 캐릭터**는 LLM이 오히려 유리. **내 창작자 정체성(identity)의 도구로서 LLM NPC**의 근거

### E. Hallucination 1.3%는 놀랍게 낮다

- Park+2023의 GPT-3.5로도 **98.7% 정확**
- 2026년 모델(Claude 3.5, GPT-4o)로는 더 낮아질 것
- → "NPC 환각" 문제가 자주 거론되지만 **structured memory + retrieval**이면 현실적으로 관리 가능

### F. Claim-gate 주의 (2026-06-28 보강 — [Research Claim Gate — 주장을 증거 등급에 묶는 운영법](../methods/research-claim-gate.md))

본 논문 수치를 인용·재사용할 때 강도를 낮춰 써야 하는 지점. 출처 = Codex 외주 통합 해체 ③Gate.

- **"crowdworker 보다 높다" → human *maximal* baseline 아님.** crowdworker roleplay 대비 우위지 전문가/최적 인간 비교 아님 ([Research Claim Gate — 주장을 증거 등급에 묶는 운영법](../methods/research-claim-gate.md) §4 human baseline 규칙).
- **"hallucination 1.3%" = 이 설정/질문/검증 방식의 값.** 일반 NPC hallucination rate 로 일반화 금지.
- **retrieval score(recency/importance/relevance α=1, threshold 150 등) = 구현 knob.** 모델/언어/게임 장르 바뀌면 재검증 대상 — 박제된 상수 아님.
- 추가 risk 축: **memory hacking / prompt hacking**(논문 limitation 언급) — 본 노트 §실패 양식에 더해 보안 관점으로 취급.
- 본 아키텍처를 우리 프로젝트에 적용한 성능 주장은 [Research Claim Gate — 주장을 증거 등급에 묶는 운영법](../methods/research-claim-gate.md) §1 의 등급(demo/repeatability/...)으로 표기. 대표 run = demo claim 고정.

---

## 열린 질문

- decay_factor 0.995, importance threshold 150, α=1 같은 **하이퍼파라미터의 민감도**는? (논문 ablation은 on/off만)
- 2 game days = 1m7s의 실제 시간 비율이 어떻게 되는가? ("수천 달러 토큰 + 수일 소요")
- Reflection tree가 **몇 층 깊이**까지 쌓였나? (논문 예시는 2~3층만 보여줌)
- GPT-4/Claude 3.5로 재현 시 어떤 축이 가장 개선되나?
- 25명 scale → 100명 / 1000명 scale에서 emergent behavior는 qualitatively 다른가?
- Memory hacking 공격 실제 시연? (논문은 limitation 언급만)
- **한국어 문화권 NPC** — Mei의 "It was good talking to you as always" 같은 instruction-tuning 후유증은 **한국어에서 어떤 형태**로 나타날까? (존댓말 경직화?)
- 감정은 importance에 섞여 있을 뿐 — 독립 변수로 빼면 무엇이 달라지나? ([Emotion Concepts and their Function in a Large Language Model](anthropic-emotions-2026.md) 결합 실험 후보)

---

## 다음 학습 후보

- **`joonspk-research/generative_agents` repo** — 실제 프롬프트, 데이터 구조, Phaser 통합 코드 정독
- **Park의 후속 연구** — "Generative Agent Simulations of 1,000 People" (2024)? scale-up 버전
- **AgentSims / SmartPlay** — 유사 샌드박스 후속 연구
- **Interactive Fiction + LLM** (Callison-Burch D&D, Park's narrative works)
- **Social Simulacra** (Park 2022 선행 — 같은 저자의 사전 작업)
- **Cognitive Architectures** — SOAR, ACT-R (논문 ref [6] Anderson 1993)
- [Persona Vectors — 캐릭터 특성을 벡터로 모니터링/조작](persona-vectors-2025.md) 결합 실험: agent summary description을 persona vector로 치환 시 behavior believability 영향
- Smallville log 전체(reverie.herokuapp.com) 살펴보기 — 원 시뮬레이션 관찰

---

## 적용 아이디어

### 단기 (1~2주)
- ai-npc-blueprint **전면 재구조화**: Layer 2~4를 **Park+2023 표준** 으로 명시하고, 내 차별화 4축 (emotion / persona / welfare / narrative) 을 **orthogonal 확장** 으로 배치
- 파라미터 표에 **실제 숫자 고정**: decay 0.995, importance threshold 150, 재귀 분해 층위 3단계 (day/hour/5-15min)

### 중기 (1~3개월)
- **미니 Smallville 실험**: 3~5명 에이전트 + Phaser 대체(Three.js? 2D 간소화?)로 메모리 스트림 직접 구현
- 한국어 LLM로 돌려서 **"instruction tuning 후유증의 한국어 발현 형태"** 관찰 → 별도 reflection 페이지
- [Persona Vectors — 캐릭터 특성을 벡터로 모니터링/조작](persona-vectors-2025.md) 기법으로 **"Isabella가 파티 제안 거절 못함" 실패를 persona vector lock** 으로 해결 시도

### 장기 (6개월+)
- **내 소설 인물(초파리 등)을 generative agent로 이식** — Park 구조 + 내 emotion/persona 확장 + welfare 층까지
- 결과를 hyunsoo-bot 의 진화 버전으로 통합 — 단순 트레이딩 봇이 아니라 **"인물로서의 현수"** 로 재구축
- `projects/generative-agent-workshop/` 로 프로토타입 저장소 시작

### libgdx-rogue-os 적용 포인트
- **턴제 NPC 기억 아카이빙**: 격자 맵 내 NPC의 상태 결정을 위해 헤드리스 환경에서 가벼운 로컬 벡터 DB(ChromaDB 등)와 연동.
- **동적 대사 및 행동 가중치**: 플레이어가 과거 턴에서 행한 이벤트(예: 상인 살해, 특정 팩션 지원 등)를 인덱싱하여 몬스터나 동료 NPC가 전투 스타일 및 대사 종류를 동적으로 변환하는 핵심 아키텍처 근거로 활용.

---

## 연결된 페이지

- ai-npc-vision — 본 논문이 비전의 학술적 뿌리
- ai-npc-blueprint — Layer 2~4 구조의 직접 조상. 재구조화 필요
- [Emotion Concepts and their Function in a Large Language Model](anthropic-emotions-2026.md) — 감정을 importance로만 다룬 Park 한계의 보완
- [Activation Steering — 추론 시점 행동 조작](activation-steering.md) — instruction tuning 후유증 차단의 기술적 수단
- [Persona Vectors — 캐릭터 특성을 벡터로 모니터링/조작](persona-vectors-2025.md) — agent summary를 벡터로 고정 → 실패 양식 3번 방지
- [Anthropic Model Welfare — AI의 도덕적 지위라는 열린 문제](anthropic-model-welfare.md) / [Taking AI Welfare Seriously — Layer 0의 학술 토대](taking-ai-welfare-seriously.md) — Park가 회피한 agency 문제를 Layer 0로 승격
- [AI Scientist v1 + v2 — 자율 과학 연구 에이전트 (정식 논문 학습)](ai-scientist-paper.md) — 같은 멀티에이전트 계열. 연구 vs 사회 시뮬 (도메인 차이)
- [Parcae — Stable Looped Language Models](parcae-looped-lm.md) — memory + reflection 루프와 같은 DNA
- [Russell's Circumplex & PAD — 감정 모델링의 표준 어휘](emotion-models-circumplex-pad.md) — Park의 importance 축을 감정 차원으로 확장 가능

---

## 출처

- **논문**: Park, O'Brien, Cai, Morris, Liang, Bernstein. "Generative Agents: Interactive Simulacra of Human Behavior." UIST '23. arXiv:2304.03442
- **PDF**: `raw/papers/2023-park-generative-agents.pdf` (22 pages)
- **Demo**: reverie.herokuapp.com/UIST_Demo/
- **Code**: github.com/joonspk-research/generative_agents
- **인용**: 10,000+ (2026 기준 추정 — NPC/LLM agent 분야 최다 인용권)
- 학습일: 2026-04-24
- **정독 수준**: abstract + Section 1-8 본문 정독 + reference 부분 확인. Appendix 미정독.
