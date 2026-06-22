---
created: 2026-04-25
updated: 2026-04-25
type: learning
tags: [role-playing, llm, fine-tuning, persona, npc, wang-2023, character-ai]
source:
  - https://arxiv.org/abs/2310.00746
  - ../../../raw/papers/2023-wang-role-llm.pdf
  - https://github.com/InteractiveNLP-Team/RoleLLM-public
category: technique
---

# RoleLLM (Wang et al. 2023) — 캐릭터 단위 역할극 LLM 표준화

> **AI NPC blueprint와의 직결성: 높음.** [Generative Agents (Park et al. 2023) — AI NPC의 성경](generative-agents.md) 가 "행동·기억" 의 성경이라면, RoleLLM은 "**말투·캐릭터 지식**" 의 성경. 두 논문이 직교 보완.
> 분류: technique (방법론 + 데이터셋), 적용성: 직접, 시급성: 즉시.

**저자**: Zekun Moore Wang 외 16인 (Beihang University 주축, 한·중·홍콩·스위스 다국적)
**arXiv**: 2310.00746v3 (2023-10, v3 2024-06) / **코드+데이터**: `InteractiveNLP-Team/RoleLLM-public`

---

## 한 줄 요약

100명 캐릭터(95 EN + 5 ZH) × 168,093 샘플의 **RoleBench** 데이터셋 + 4단계 파이프라인(프로파일 → Context-Instruct → RoleGPT → RoCIT). LoRA로 fine-tune한 **RoleLLaMA-7B가 GPT-4 기반 RoleGPT를 role-specific knowledge에서 능가** (38.1 vs 32.3, GPT-4 Win Rate 55.8%).

---

## 4단계 파이프라인

### 1. Role Profile Construction
- **100 캐릭터** (95 EN + 5 ZH)를 **916 EN scripts + 24 ZH scripts** 에서 GPT-4 보조로 선별
- 30개 role category, 20개 script category
- 프로파일 = `role description + catchphrases + structured dialogues`

### 2. Context-Instruct (지식 추출)
- 프로파일 segment 분할
- LLM이 각 segment에 대해 **Q-Confidence-A triplet** 생성 (Q+A만이 아니라 **신뢰도 + 근거** 포함이 핵심)
- Confidence 점수 → 저품질·환각 필터링
- 결과: 캐릭터당 ~400 candidates

### 3. RoleGPT (말투 elicitation)
- **few-shot DIALOGUE engineering** (≠ prompt engineering)
- 형식: `<im_start>system ... <im_end> <im_start>user {Q1} <im_end> <im_start>assistant {A1} ...`
- BM25로 프로파일에서 top-5 유사 dialogue pair 검색 → few-shot demo로 주입
- GPT-4가 audited (캐릭터 인지도 검증)

### 4. RoCIT (Role-Conditioned Instruction Tuning)
- **LoRA** 기반 (LLaMA-7B 영어 / ChatGLM2-6B 중국어)
- system instruction 방식 (retrieval augmentation 대안과 비교 → 시스템 instruction 승리)
- 학습 응답 + special token만 supervise

---

## 핵심 설계 원칙

### Speaking Style Imitation 두 축

| 축 | 정의 | 예시 (Pirate) |
|----|------|--------------|
| **Lexical Consistency** | 캐치프레이즈·관용구 | "matey", "ahoy", "aweigh" |
| **Dialogic Fidelity** | 통사·어조 | colloquial, gruff, adventurous tone |

### 두 종류 지식

| 종류 | 정의 | Iron Man 예시 |
|-----|------|--------------|
| **Script-Based Knowledge** | 대본에 명시된 사건·기억 | 동굴에서 1대 슈트 제작 |
| **Script-Agnostic Knowledge** | 캐릭터의 일반 전문성 | 사업가 leadership, 기술 전문성 |

→ 내 NPC 설계: **bible/canon = script-based**, **세계관 일반 지식 = script-agnostic** 으로 직접 매핑.

---

## 핵심 실험 결과

### RoleLLaMA-7B vs RoleGPT (GPT-4)

| 지표 | RoleGPT (GPT-4) | RoleLLaMA-7B | 비고 |
|------|----------------|--------------|------|
| CUS (말투) | **57.6** | 32.9 / 37.5 (13B) | GPT-4 우세 |
| RAW (정확성) | **53.2** | 37.6 / 47.9 (13B) | GPT-4 우세 |
| **SPE (역할 지식)** | 32.3 | **38.1** | **LoRA 7B가 GPT-4 능가** |
| GPT-4 Win Rate | — | **55.8%** | RoleLLaMA가 더 자주 선호 |
| Human Win Rate | — | **52.0%** | 인간도 RoleLLaMA 더 선호 |

→ **작은 모델 + 잘 짠 데이터 > 큰 모델 + 프롬프트** 의 정석 사례.

### Prompting 전략 (GPT-4 평가, Win Rate)

| 방식 | Win Rate | Avg Ranking |
|------|---------|------------|
| Zero-shot prompt | 9.3% | 2.4 |
| Few-shot prompt engineering | 29.8% | 1.9 |
| **Few-shot dialogue engineering** | **63.3%** | **1.5** |

→ **GPT-4 같은 dialogue-tuned 모델은 prompt 보다 dialogue 형식으로 demo 줘야** 효과 7배. **반드시 기억할 것.**

### System Instruction vs Retrieval Augmentation

| 방식 | RoleLLaMA SPE | RoleGLM SPE |
|------|--------------|------------|
| Retrieval aug | 36.7 | 25.3 |
| **System instruction** | **38.1** | **34.1** |

→ 캐릭터 정보가 **모델 가중치에 들어가야** 가장 강함. retrieval은 noise 도입.

### Context-Instruct vs Retrieval (지식 주입)

| 방식 | SPE |
|------|-----|
| w/o context-instruct | 21.4 |
| Retrieval aug | 19.1 (역효과!) |
| **w/ Context-Instruct** | **38.1** |

→ Retrieval은 **noisy script** 환경에선 오히려 distractor. Fine-tuning이 정답.

---

## RoleBench (데이터셋)

| 항목 | 값 |
|------|----|
| 전체 샘플 | 168,093 |
| Instruction 수 | 23,463 |
| 일반-목적 (general) | 147,609 / 2,979 |
| 역할-특화 (role-specific) | 20,484 / 20,484 |
| 영어 / 중국어 roles | 95 / 5 |
| Role categories | 30 |
| Script categories | 20 |

**품질 검증** (100 샘플 인간 평가):
- 100% — 지시에 응답함
- 84% — 캐릭터 말투/성격 반영
- 77% — 정확하고 우아하게 캐릭터 체현

**예시:**
> Role: Dr. Hannibal Lecter
> Instruction: Determine the length of the item in the given list: [apple, banana, cherry].
> Response: "Three, my dear. The list contains an apple, a banana and a cherry. Quite the charming little selection of fruits, isn't it?"

→ **일반 task에 캐릭터 voice 입히기**의 모범 답안. NPC가 게임 안 task(인벤토리 정렬 등)를 캐릭터답게 처리하는 방식.

---

## 내 생각 — NPC blueprint 보완 지점

### A. [Generative Agents (Park et al. 2023) — AI NPC의 성경](generative-agents.md) 와의 직교 보완

| 영역 | Park+2023 | Wang+2023 (RoleLLM) |
|-----|----------|---------------------|
| 행동·일정 | ✅ Memory/Reflection/Planning | ❌ |
| 말투·voice | ❌ (instruction-tuned 후유증으로 모두 비슷한 말투) | ✅ Lexical + Dialogic |
| 캐릭터 지식 | ❌ (description 한 단락만) | ✅ Script-Based + Script-Agnostic |
| 사회·창발 | ✅ | ❌ |
| 멀티 캐릭터 | 25명 동시 | 100명 개별 |
| 지속 시뮬 | ✅ (2 game days) | ❌ (단일 응답) |

→ **두 논문을 합쳐야 완전한 NPC**: Park의 메모리·계획 위에 RoleLLM의 voice·canon. ai-npc-blueprint 에 두 논문을 **양대 기둥**으로 명시.

### B. [Persona Vectors — 캐릭터 특성을 벡터로 모니터링/조작](persona-vectors-2025.md) 가 RoleLLM의 한계를 뚫는다

RoleLLM의 약점 = **각 캐릭터마다 LoRA를 따로 학습** (RoleLLaMA-Hannibal, RoleLLaMA-Pirate...). 100명 = 100 LoRA.

→ Persona vector 방식은 **하나의 모델 + 캐릭터별 벡터** 만 바꾸면 됨. RoleBench로 persona vector를 추출하는 후속 연구가 자연스러운 다음 단계.

### C. **dialogue engineering 7배 효과**의 일반화

GPT-4가 in-context learning을 **dialogue history modeling으로 trade-off** 했다는 관찰 (Fu et al., 2022) → 모든 GPT 계열 NPC 프롬프팅에서 **반드시 ChatML 형식 dialogue** 로 demo 제공해야 함.

내 hyunsoo-bot 도 이 원칙 적용 안 됐을 가능성 — 점검 필요.

### D. Confidence-with-rationale가 환각 막는다

Q-A pair 만 생성시키면 환각·불완전성 빈발 → **Q-Confidence-A triplet** + 근거 요구가 품질 향상. NPC 백스토리 자동 생성에도 그대로 이식 가능 (LLM이 "이 사건은 영화에서 명시적/추론적/비명시적" 자가평가).

### E. Script-Based / Script-Agnostic 분리의 운영적 가치

내 캐릭터들에 대해 두 분류 적용:
- **현수**(소설 hyunsoo-bot) : Script-Based = 트레이딩 패배 경험 등 / Script-Agnostic = 시장 일반론
- **초파리 인물**들도 같은 분리 가능

→ 백스토리 작성·체크 워크플로우의 표준 골격.

### F. RoleLLaMA가 Character.AI를 이긴다

Character.AI는 상용 서비스인데 RoleLLaMA-7B (open source, LoRA fine-tune) 가 GPT-4 평가에서 더 높은 점수. **상용 NPC 서비스의 기술 격차가 작다** = 내 직접 구축 가능성 시사.

---

## 열린 질문

- 100 캐릭터 × LoRA = 100 어댑터. **multi-LoRA serving** 의 실제 latency·메모리 부담?
- RoleBench의 한국어 부재 — 한국어 캐릭터 100명 구축의 cost는?
- Context-Instruct의 confidence threshold (filtering) 실제 값?
- RoleLLaMA-13B vs RoleLLaMA-7B 격차 (44.7 vs 36.2 avg) — scaling 곡선?
- v3 (2024-06)에서 추가된 내용? (v1과 비교)
- 모델이 자기 정체성 (LLaMA임)을 자발적으로 노출하는 빈도? (cleaning 단계 명시)
- **창의적 발화 vs 캐논 충실** trade-off — 이 데이터셋은 캐논만 학습. 창의성은?
- Persona drift가 긴 대화에서 발생하는가? (단일 turn만 평가)
- **음성 합성(TTS) 결합** 시 Dialogic Fidelity와 음성 톤의 상호작용?

---

## 다음 학습 후보

- **RoleBench 데이터셋 직접 검수** — `InteractiveNLP-Team/RoleLLM-public` clone, 한국어 캐릭터 추가 가능성 검토
- **Multi-LoRA serving** (S-LoRA, vLLM-LoRA) — 100 캐릭터 동시 서빙 기술
- **Character-LLM** (Shao et al. 2023) — 동시기 경쟁 연구
- **Ditto / CharacterEval** — 후속 캐릭터 벤치마크
- **Dungeons and Dragons as Dialog Challenge** (Callison-Burch et al. 2022) — 게임×LLM 직접 사례 (Park 논문에도 ref)
- [Persona Vectors — 캐릭터 특성을 벡터로 모니터링/조작](persona-vectors-2025.md) 와 RoleLLM 결합 실험 가능성
- **dialogue engineering** 의 Anthropic Claude 버전 — Claude는 다른 형식? (직접 실험 필요)

---

## 적용 아이디어

### 단기 (1~2주)
- ai-npc-blueprint 에 **"양대 기둥" 명시**: Park (행동) + Wang (voice/canon)
- 모든 캐릭터 프롬프트를 **few-shot dialogue engineering 형식**으로 통일 (ChatML)
- 내 캐릭터들 (현수, 초파리 인물) 의 **Script-Based vs Script-Agnostic 분류표** 작성

### 중기 (1~3개월)
- **한국어 캐릭터 RoleBench-mini** 구축 실험 — 5명 (현수 + 초파리 4인) × 200 instructions
- Context-Instruct 절차로 자동 생성 → 검수
- Open-source 한국어 모델 (Solar, Llama 한국어 포크) 에 LoRA fine-tune
- 결과 평가: GPT-4 기반 win rate

### 장기 (6개월+)
- [Persona Vectors — 캐릭터 특성을 벡터로 모니터링/조작](persona-vectors-2025.md) 활용해 **단일 모델 + 캐릭터 벡터** 로 위 작업 압축
- [Generative Agents (Park et al. 2023) — AI NPC의 성경](generative-agents.md) memory stream 결합 → "**현수가 발렌타인 파티에 가는**" 통합 에이전트 구축
- `projects/korean-roleplay-bench/` 시작

---

## 연결된 페이지

- [Generative Agents (Park et al. 2023) — AI NPC의 성경](generative-agents.md) — 직교 보완 양대 기둥
- ai-npc-blueprint — 본 논문이 voice/canon 축의 표준
- [Persona Vectors — 캐릭터 특성을 벡터로 모니터링/조작](persona-vectors-2025.md) — RoleLLM의 100 LoRA 한계 돌파 후보
- ai-npc-vision — 캐릭터 단위 NPC 비전의 학술적 검증
- hyunsoo-bot — dialogue engineering 형식 점검 필요
- 초파리 — Script-Based/Agnostic 분류 작업 후보
- [Emotion Concepts and their Function in a Large Language Model](anthropic-emotions-2026.md) — RoleLLM의 voice + emotion vector 결합 가능성
- [DESIGN.md — 코딩 에이전트용 디자인 시스템 명세](../methods/design-md.md) — DESIGN.md 형식이 캐릭터 bible 작성에도 응용 가능

---

## 출처

- **논문**: Wang, Peng, Que et al. "RoleLLM: Benchmarking, Eliciting, and Enhancing Role-Playing Abilities of Large Language Models." arXiv:2310.00746v3 (2024-06)
- **PDF**: `raw/papers/2023-wang-role-llm.pdf`
- **데이터+코드**: github.com/InteractiveNLP-Team/RoleLLM-public
- **저자 주축**: Beihang University (북경항공항천대), Zekun Moore Wang
- 학습일: 2026-04-25
- **정독 수준**: 본문 Section 1-5 + 결과표 정독. Appendix 미정독 (프롬프트 detail은 후속).
