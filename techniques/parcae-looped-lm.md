---
created: 2026-04-21
updated: 2026-04-21
type: learning
tags: [AI, LLM, architecture, scaling-laws, looped-model, research]
source: https://github.com/sandyresearch/parcae
---

# Parcae — Stable Looped Language Models

*Sandy Research, Prairie et al.*

사전학습 아키텍처 연구. "파라미터를 늘리는 대신 **같은 레이어를 반복 통과**시켜 성능을 얻는다"는 발상.

---

## 한 줄 요약

> 동일한 Core 레이어를 **8번 루프**시켜 1.3B 파라미터로 2.6B 트랜스포머의 **87.5% 품질**을 달성. 관건은 학습 안정화.

---

## 핵심 개념

### 1. 루프(Looped) 아키텍처

```
입력 → [Prelude] → [Core] × 8회 반복 → [Coda] → 출력
              ↑___________|
```

- **Prelude**: 초기 처리
- **Core**: 재귀적으로 N번 통과 (recurrence depth)
- **Coda**: 최종 처리

일반 트랜스포머가 "레이어를 쌓아" 깊이를 얻는다면, 루프 모델은 **같은 레이어를 다시 통과**시켜 FLOPs를 얻는다.

### 2. 왜 불안정했는가 (선행 연구 문제)

루프 모델은 원래 학습이 매우 불안정했다. 논문의 진단:

> **Injection 파라미터의 spectral norm이 너무 컸기 때문.**

루프를 돌 때마다 활성값이 기하급수적으로 폭발하거나 소실되는 문제.

### 3. Parcae의 해법

- Injection 파라미터에 **spectral norm constraint** 적용
- 결과: 안정적 학습 + 이전 대비 perplexity 6.3% 개선

### 4. 스케일링 법칙 (새로운 발견)

> **"Compute-optimal training scales looping and data in tandem."**

- 기존(트랜스포머): 데이터와 파라미터 수를 함께 키움
- Parcae: 데이터와 **루프 깊이**를 함께 키우는 것이 최적

---

## 모델 라인업

| 크기 | 루프 깊이 | 학습 데이터 |
|------|----------|------------|
| 140M | 8 | FineWeb-Edu |
| 370M | 8 | FineWeb-Edu |
| 770M | 8 | FineWeb-Edu |
| 1.3B | 8 | FineWeb-Edu |

**핵심 결과:** 1.3B가 2.6B 트랜스포머 대비 87.5% 품질.

---

## 기술 스택 / 사용법

```python
pip install parcae-lm

import parcae_lm
model = parcae_lm.from_pretrained("SandyResearch/parcae-140m")
```

- Python 3.11+, PyTorch 2.4+
- nanochat, recurrent-pretraining, litgpt 기반

---

## 내 생각 — AI NPC 관점

### 직접적 연결: 낮음

Parcae는 **사전학습 연구**. NPC 개발자가 바로 쓰는 도구가 아님. 학습된 모델을 API로 부르는 현재 경로(HyperCLOVA/Gemini)를 대체하지 않음.

### 개념적 수확: 유의미

루프 아키텍처는 **"깊이를 파라미터 수가 아닌 compute로 얻는다"**는 설계 축을 준다. NPC 맥락에서 재해석하면:

1. **"Thinking Loop" 아이디어** — NPC가 응답 전 여러 번 내부 루프를 돌며 숙고하는 구조. 모델 크기는 작아도 "더 오래 생각"해서 캐릭터 일관성 확보.
2. **엣지/온디바이스 NPC** — 1.3B가 2.6B 품질이면 게임 클라이언트 로컬 추론 가능성↑. 서버 왕복 없이 NPC 구동.
3. **추론 시간 ↔ 품질 트레이드오프** — 플레이어가 기다릴 수 있는 장면(중요 대화)에서는 루프 깊게, 즉시 반응 필요 장면에서는 얕게.

### 블루프린트 연결

- ai-npc-blueprint Layer 2 (대화 시스템) — **기반 모델 선택지**로 기록
- 지금 당장 프로젝트에 적용할 건 아님. 2~3년 내 게임 로컬 NPC 모델 시대가 오면 재검토.

---

## 열린 질문

- 루프 모델은 **추론 시간**이 트랜스포머보다 길 것 같은데, 실제 지연시간은? (루프 8회 = 실질 8배 compute)
- 8 루프가 고정인가, 동적 루프(쉬운 토큰은 적게, 어려운 토큰은 많이)가 가능한가?
- 페르소나 같은 정성적 품질에서도 동일한 품질 우위를 보이는가? (논문은 perplexity 기준)

---

## 다음 학습 후보

- **Universal Transformers / ALBERT** — 루프/공유 레이어 선행 연구
- **Mixture of Depths** — 동적 compute 할당
- **Spectral norm regularization** 일반론 (GAN에서 나온 기법)

---

## 연결된 페이지

- ai-npc-blueprint — Layer 2 기반 모델 선택지
- [AI 엔지니어 NLP 부트캠프](../narrative/bootcamp-ai-nlp.md) — 트랜스포머 기초
- ai-npc-vision — 궁극적 적용 비전
