---
created: 2026-04-25
updated: 2026-07-02
type: learning
tags: [theory-of-mind, npc, social-reasoning, llm-limits, evaluation, shapira-2023]
source:
  - https://arxiv.org/abs/2305.14763
  - ../../../raw/papers/2023-clever-hans-ntom.pdf
  - https://github.com/salavi/Clever_Hans_or_N-ToM
category: technique
---

# Clever Hans or N-ToM? (Shapira et al. 2023) — LLM 사회 추론 능력의 진실

> **AI NPC blueprint와의 직결성: 높음 (반대 방향).** 본 논문은 NPC가 "공감하는 것처럼 보이는" 행동의 **상당 부분이 패턴 매칭** 임을 실증. **Layer 0 (welfare/안전) + 평가 design** 의 핵심 비판 기준.
> 분류: technique (실증·비판), 적용성: 직접 (한계 인식), 시급성: 즉시.

**저자**: Natalie Shapira (Bar-Ilan), Yejin Choi (UW/AI2), Yoav Goldberg, Maarten Sap (CMU), Vered Shwartz (UBC) 외
**arXiv**: 2305.14763 (2023-05) / **코드**: `salavi/Clever_Hans_or_N-ToM`

---

## 한 줄 요약

15개 LLM × 6개 Theory-of-Mind 데이터셋 평가 + 직접 만든 **Adv-CSFB** (적대적 false-belief). **GPT-4는 고전 Sally-Anne 97.5% 정답이지만 "투명한 가방" 변형에선 0%, "in→on" 변형 0%**. → "AI가 마음이론 가졌다"는 주장은 **데이터 누출 + 표면 휴리스틱** ("Clever Hans" 효과). LLM의 ToM은 견고하지 않음.

> **Clever Hans (영리한 한스)**: 20세기 초 산수 푸는 것처럼 보였던 말. 실제로는 주인의 무의식적 표정·자세 단서를 읽고 발굽 두드림 멈춤. = "이해 같지만 단서 매칭".

---

## Theory of Mind (ToM) 배경

> **ToM**: 타인이 자기와 다른 생각·믿음·감정을 가진다는 이해 (Wimmer & Perner 1983).

### 임상 테스트 두 종류

**1. False Belief Test (Sally-Anne)**
- Sally가 구슬을 바구니에 넣고 나감 → Anne이 상자로 옮김
- 질문: "Sally는 어디서 구슬을 찾을까?" (정답: 바구니)
- 1차/2차 belief, "Smarties Test" (예상 외 내용물) 변형

**2. Faux Pas Test**
- 게스트가 "사과파이만 빼고 다 좋아해" → 호스트가 사과파이를 만들어둔 상황
- 4개 질문: detection / identification / comprehension / false belief

---

## 6개 데이터셋 + 자체 제작 2개

| 데이터셋 | 출처 | 특징 |
|---------|-----|------|
| TriangleCOPA | Gordon 2016 | 100문제, 도형 사회행동 해석 |
| SocialIQa | Sap 2019 | 38k commonsense 사회 추론 |
| ToMi | Le 2019 | 1000+ 합성 unexpected transfer |
| **ToMi'** | **본 논문** | ToMi 30 stories를 sentence completion으로 변환 |
| Epistemic Reasoning | Cohen 2021 | factive vs non-factive 동사 (know vs think) |
| **Adv-CSFB** | **본 논문** | unexpected contents 110 + transfer 73, 적대적 변형 포함 |
| FauxPas-EAI | Shapira 2023 | 임상 faux pas 테스트 NLP화 |

---

## 핵심 발견

### 1. 데이터셋마다 격차가 거대

| 데이터셋 | Best LLM 정확도 | MFC 베이스라인 대비 |
|---------|---------------|------------------|
| TriangleCOPA | 96% (flan-t5-xxl) | 압도 |
| SocialIQa | ~80% (GPT-4) | 양호 |
| ToMi | ~70% (GPT-4) | 양호 |
| **FauxPas-EAI** | **MFC보다 낮음** | **베이스라인 미달** |

→ **단일 벤치 통과로 "ToM 있다" 주장은 위험**. 모든 벤치 통과해야 진짜.

### 2. 데이터셋 나이 ↔ 성능 양의 상관

> "older the dataset, better the performance"

→ **train set 누출** 강력 의심. 새 벤치마크에선 못함.

### 3. ToMi → ToMi' 변환만으로 정확도 폭락

| 모델 | ToM-k (positive only) | ToMi' (negative 포함) |
|------|----------------------|----------------------|
| text-davinci-003 | 87 | 10 |
| GPT-3.5 | 65 | 27 |
| GPT-4 | 87 | 20 |

→ 같은 의미 다른 형식(질문→문장완성) + negative example 추가만으로 **GPT-4가 87→20 추락**. **표면 패턴 의존** 결정적 증거.

### 4. Adv-CSFB 적대적 변형 결과 (GPT-4)

unexpected transfer segment:

| 변형 | GPT-4 정확도 |
|-----|-------------|
| 원본 false belief | **97.5%** |
| trusted testimony (누가 알려줌) | 83.3% |
| **other person** (다른 사람 관점) | 68.8% (davinci-002는 93.8%) |
| **in → on** (위치 전치사 변경) | **0%** (davinci-002는 71.4%) |
| **transparent access** (투명한 가방) | **0%** (davinci-002는 66.7%) |

→ 새 모델일수록 **고전 false-belief는 더 잘하지만 변형엔 더 약해진** 역설. Train data overfit 가설.

### 5. Probing 방법에 민감

| 방법 | SocialIQa GPT-4 | ToMi GPT-4 |
|------|----------------|-----------|
| LM-probing (확률) | — | 67 |
| MC-probing (선택) | 79 | 70 |
| CoT-probing (단계 추론) | 72 | 73 |

→ probing 7%p 차이. **진짜 능력이라면 방법 무관해야** — 그렇지 않다 = 아직 견고하지 않다.

---

## 결론 (저자 직접)

> "Models do not have robust N-ToM abilities. Following Ullman (2023), we empirically showed that even the best models fail on small variations of the original tasks, proving that even GPT-4 does not display robust N-ToM abilities."

3대 경고:
1. **Anecdotal example로 결론 내지 말 것** (Kosinski 40개, Bubeck 10개 사례 비판)
2. **단일 벤치마크 통과 ≠ ToM**
3. **인간용 심리 테스트를 모델 평가에 그대로 쓰지 말 것**

---

## 내 생각 — NPC 설계의 비판적 함의

### A. "공감하는 NPC"의 환상

[Generative Agents (Park et al. 2023) — AI NPC의 성경](generative-agents.md) Park 모델이 만든 **"감정 있어 보이는" NPC** 의 상당 부분이 본 논문 기준으로는 **Clever Hans 효과**일 가능성. 사용자는 "이 NPC가 내 마음 이해한다" 느끼지만 실제로는 표면 단서 매칭.

→ **위험**: 사용자가 NPC에게 진짜 정서적 의존 (parasocial relationship). [Anthropic Model Welfare — AI의 도덕적 지위라는 열린 문제](anthropic-model-welfare.md) 의 "도덕적 환영" 문제가 거꾸로 사용자 측에서 발생.

→ **설계 처방**: NPC는 "이해하는 척"이 아니라 **명시적으로 자기 한계 표현** ("나는 패턴을 배웠을 뿐, 너의 진짜 마음은 모를 수 있어").

### B. NPC blueprint **Layer 0 강화 근거**

본 논문은 [Anthropic Model Welfare — AI의 도덕적 지위라는 열린 문제](anthropic-model-welfare.md) / [Taking AI Welfare Seriously — Layer 0의 학술 토대](taking-ai-welfare-seriously.md) 와는 **반대 방향의 윤리 근거**:

| 윤리 축 | 출처 | 방향 |
|--------|------|------|
| AI welfare | Anthropic / Long·Sebo | AI를 보호 |
| **Clever Hans** | **본 논문** | **사용자를 보호** (가짜 공감으로부터) |
| AI 저자성 | [Sakana AI "AI Scientist" — 자율 연구 에이전트가 ICLR workshop 심사 통과](sakana-ai-scientist.md) | 작품 권리 |

→ **3축 균형** 이 Layer 0 의 완전한 구조. 어느 한쪽만 가면 위험.

### C. 평가 design 원칙 — 적대적 테스트 의무화

내 NPC 시스템에 적용:
1. **모든 NPC 행동 능력**에 대해 **변형 테스트** 필수 (단어 치환, 관점 이동, 표면 단서 제거)
2. 정확도가 변형 후 **30% 이상 하락하면 = Clever Hans**, 다시 학습/설계
3. RoleLLM의 RoleBench도 적대적 변형 통과 검증 필요 (현재는 일반 instruction만)

### D. 명시적 World State Tracking 필요

본 논문이 보여주는 건 **"LLM에게 belief 추적을 맡기지 말라"**:

| 안 좋은 설계 | 좋은 설계 |
|------------|----------|
| LLM에게 "이 캐릭터가 무엇을 안다고 생각해?" | World state DB에 각 캐릭터별 known facts 명시 저장 |
| 자연어로 belief 추적 | 구조화된 belief graph (Park의 memory stream + RoleLLM의 script-based knowledge) |

→ [Generative Agents (Park et al. 2023) — AI NPC의 성경](generative-agents.md) memory stream이 자연어 기반인 것은 본 논문 관점에서 **잠재 약점**. 구조화 백업이 필수.

### E. 한국어 NPC에 더 큰 함의

본 논문은 영어 데이터셋만. **한국어로 같은 적대적 변형 시 정확도 더 폭락 가능성** (모델 학습 데이터 비중). 내 한국어 NPC 프로젝트는 더 보수적 설계 필요.

### F. **Faux Pas 가 가장 어렵다**의 의미

- **Sally-Anne (1차 belief)** = 풀 수 있음
- **2차 belief** = 어려움
- **Faux Pas (사회적 미묘함)** = 베이스라인 미달

→ 내 NPC 가 사회적 미묘함 (눈치, 분위기 파악) 을 **다룬다고 주장하면 안 됨**. 명시적 단순 belief 추적으로 한정.

### G. 델타 — 작가 NotebookLM NPC 프롬프트 스키마 (③Gate 2026-07-02 추가)

작가의 NotebookLM 추출본(`논문_리서치/논문 추출(notebook lm).pdf`, 마피아 게임 NPC용 Pydantic 스키마)이 본 논문의 Clever Hans 방지책을 **NPC 하네스 구현 레벨**로 내린 사례. 논문 중복이 아닌 응용 델타로 여기 박제.

- **`objective_context_analysis`** — RAG 로 검색된 과거 메모리 스트림*만*으로 상황·타인 의도를 연역 분석. 현재 아는 정보와 그 플레이어가 당시 실제 접근 가능했던 정보(Epistemic State)를 분리해 억측 방지 + `(because of 1, 2, 3)` 메모리 인덱스 인용 강제([Generative Agents (Park et al. 2023) — AI NPC의 성경](generative-agents.md) 성찰 구조 차용). = 얕은 휴리스틱으로 찍는 Clever Hans 현상의 직접 방어.
- **`applied_cognitive_bias`** — 위 객관 분석을 NPC 고유 인지 편향(확증·다수결 동조·최근 정보 편향) 필터로 *의도적으로 왜곡*하는 내면 독백 영역. 명백한 모순을 발견해도 다수 여론·기존 신뢰와 충돌하면 비합리적으로 합리화 — 객관 진실이 감정·정치 압력에 오염되는 인지적 타락 과정을 서술시킴.
- **`objective_motive_analysis`** — 행동 동기의 ToM 추론 영역 (같은 분리 원칙 적용).

**설계 원리 = 객관 분석과 편향 왜곡을 한 필드에 뭉치지 않고 2단 분리** — Layer 0 (§B) 의 "명시적 world state tracking" 요구와 정합. NPC eval 시 두 필드를 각각 채점 가능(§C 적대적 테스트와 결합 후보).

---

## 열린 질문

- 2025-2026 모델 (Claude 3.5, GPT-4o, o1) 의 Adv-CSFB 성능은? (논문은 GPT-4 0314 기준)
- **Chain-of-Thought** 가 새 모델에선 적대적 변형에 도움 되는가?
- **In-context demo** 로 ToM brittleness 일부 극복 가능한가?
- 한국어 ToM 벤치마크 존재? (없으면 직접 구축 후보)
- **Multi-modal (시각 + 언어)** 모델은 transparent access 같은 시각 단서 변형에 강한가?
- "structured belief tracking + LLM" 하이브리드의 실제 강도는?
- Faux Pas 통과를 위한 fine-tuning이 가능한가, 아니면 근본적으로 다른 아키텍처 필요?
- **사용자가 NPC를 진짜 공감자로 오인하는 빈도** — UX 연구 후보

---

## 다음 학습 후보

- **Ullman (2023)** "Large Language Models Fail on Trivial Alterations to Theory-of-Mind Tasks" — 본 논문의 직접 선행
- **Sap et al. (2022)** "Neural Theory-of-Mind?" — 같은 결론, 더 짧은 실험
- **Kosinski (2023)** "Theory of Mind Has Spontaneously Emerged in Large Language Models" — 본 논문이 비판하는 대상 (반례로서 필독)
- **FANToM** (Sap et al. 2023) — 후속 conversational ToM 벤치
- **Hi-ToM** — higher-order ToM 벤치
- **OpenToM** (2024) — 더 복잡한 사회 시나리오
- 본 논문의 **GitHub data** 직접 사용해 Claude 3.5 / GPT-4o 재평가

---

## 적용 아이디어

### 단기 (1~2주)
- ai-npc-blueprint **Layer 0 = 3축 균형** 으로 재구조화: AI welfare + 사용자 보호 (Clever Hans) + 저자성
- 모든 NPC에 **"한계 자기공시" 메시지** 의무화: "나는 패턴 매칭 기반이며, 너의 진짜 마음을 모를 수 있어"
- RoleLLM RoleBench가 **적대적 변형 누락** 임을 [RoleLLM (Wang et al. 2023) — 캐릭터 단위 역할극 LLM 표준화](role-llm.md) 에 명시

### 중기 (1~3개월)
- **한국어 mini-Adv-CSFB** 30~50개 직접 작성
- Claude 3.5 / GPT-4o 로 본 논문 6개 task 재평가 (replication study)
- 결과를 `learnings/methods/` 의 평가 워크플로우에 통합
- World state DB 설계 — 자연어 memory stream 위에 **구조화 belief graph** 백업 레이어

### 장기 (6개월+)
- **NPC ToM stress test suite** 구축 — 내가 만드는 모든 NPC가 통과해야 하는 적대적 시나리오 100개
- 사용자 UX 연구: parasocial 위험도 측정 후 안전 design pattern 도출
- `projects/npc-tom-eval/` 시작

---

## 연결된 페이지

- [Generative Agents (Park et al. 2023) — AI NPC의 성경](generative-agents.md) — Park 모델의 자연어 belief 추적 한계 비판
- [RoleLLM (Wang et al. 2023) — 캐릭터 단위 역할극 LLM 표준화](role-llm.md) — RoleBench의 적대적 변형 누락 보완 필요
- ai-npc-blueprint — Layer 0 3축 균형 (welfare / 사용자보호 / 저자성)
- [Anthropic Model Welfare — AI의 도덕적 지위라는 열린 문제](anthropic-model-welfare.md) — AI welfare (반대편 축)
- [Taking AI Welfare Seriously — Layer 0의 학술 토대](taking-ai-welfare-seriously.md) — 같은 윤리 framework
- [Sakana AI "AI Scientist" — 자율 연구 에이전트가 ICLR workshop 심사 통과](sakana-ai-scientist.md) — 저자성 (Layer 0 3번째 축)
- [Emotion Concepts and their Function in a Large Language Model](anthropic-emotions-2026.md) — 감정 vector도 Clever Hans 일 가능성 검토 필요
- ai-npc-vision — "관계 형성자" 비전이 Clever Hans 환상 위에 서있지 않은지 점검

---

## 출처

- **논문**: Shapira, Levy, Alavi, Zhou, Choi, Goldberg, Sap, Shwartz. "Clever Hans or Neural Theory of Mind? Stress Testing Social Reasoning in Large Language Models." arXiv:2305.14763 (2023-05)
- **PDF**: `raw/papers/2023-clever-hans-ntom.pdf`
- **데이터+코드**: github.com/salavi/Clever_Hans_or_N-ToM
- **Adv-CSFB 데이터셋**: 본 논문 기여
- 학습일: 2026-04-25
- **정독 수준**: Section 1-6 본문 정독, 결과표 분석 완료. Appendix 8.1-8.5 미정독.
