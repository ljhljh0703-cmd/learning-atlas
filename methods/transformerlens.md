---
created: 2026-04-22
updated: 2026-04-22
type: learning
tags: [AI, LLM, mech-interp, tool, transformerlens, hooks]
source: https://github.com/TransformerLensOrg/TransformerLens
category: method
---

# TransformerLens — mech-interp 실습 라이브러리

*Neel Nanda (creator), Bryce Meyer (maintainer)*

[Emotion Concepts and their Function in a Large Language Model](../techniques/anthropic-emotions-2026.md) · [Activation Steering — 추론 시점 행동 조작](../techniques/activation-steering.md) · [Persona Vectors — 캐릭터 특성을 벡터로 모니터링/조작](../techniques/persona-vectors-2025.md) 모두를 직접 손으로 재현할 수 있게 해주는 도구.
이론에서 실험으로 넘어가는 다리.

---

## 한 줄 요약

> open-source LLM의 내부 활성화를 **읽고/저장하고/수정하는** Python 라이브러리. hook 기반으로 임의 layer/위치에서 개입 가능.

---

## 핵심 기능

### 1. 모델 로드 + 통일된 API

```python
from transformer_lens import HookedTransformer
model = HookedTransformer.from_pretrained("gpt2-small")  # 또는 llama, qwen 등
```

다양한 모델 패밀리를 **같은 hook 이름 체계**로 다룸 → 코드 재사용성 ↑.

### 2. Activation Caching

```python
logits, cache = model.run_with_cache(tokens)
cache["resid_pre", 5]  # 5번 layer residual stream
cache["pattern", 3, "attn"]  # 3번 layer attention pattern
```

→ 모든 hidden state가 **이름으로 즉시 접근**.

### 3. Hooks (개입의 핵심)

```python
def steering_hook(activation, hook):
    activation += coefficient * steering_vector
    return activation

model.run_with_hooks(
    tokens,
    fwd_hooks=[("blocks.5.hook_resid_post", steering_hook)]
)
```

→ activation steering · ablation · patching 모두 hook 한 줄로.

### 4. 지원 작업

| 작업 | 함수/패턴 |
|------|----------|
| Activation 추출 | `run_with_cache` |
| Steering | `fwd_hooks` |
| Ablation (zero/mean) | hook에서 0/평균 대체 |
| Activation Patching | 다른 입력의 cache 값 주입 |
| Logit Lens | unembedding을 중간 layer에 적용 |

### 5. 적용 범위

- **best fit**: ≤ 9B 모델, 복잡한 실험
- 큰 모델 (70B+) 은 nnsight 등이 더 적합

---

## 학습 자원

| 자료 | 특징 |
|------|------|
| [공식 docs](https://transformerlensorg.github.io/TransformerLens/) | API 레퍼런스 + Getting Started |
| [Callum McDougall 튜토리얼](https://github.com/callummcdougall/TransformerLens-intro) / [ARENA Ch1](https://learn.arena.education/chapter1_transformer_interp/02_intro_mech_interp/) | 연습문제 + 해답 + 다이어그램 — **추천 시작점** |
| [Neel Nanda YouTube](https://www.youtube.com/@neelnanda2469) | paper walkthrough + 라이브 연구 |
| [Main Demo Colab](https://colab.research.google.com/github/neelnanda-io/TransformerLens/blob/main/demos/Main_Demo.ipynb) | 실행 가능한 첫 노트북 |

---

## 내 생각 — 학습 도구 관점

### 직접적 연결: **방법론적 핵심**

[Emotion Concepts and their Function in a Large Language Model](../techniques/anthropic-emotions-2026.md) · [Activation Steering — 추론 시점 행동 조작](../techniques/activation-steering.md) · [Persona Vectors — 캐릭터 특성을 벡터로 모니터링/조작](../techniques/persona-vectors-2025.md) 모두 **TransformerLens 또는 동등 라이브러리에서 재현**된다.
즉, 위 세 학습을 "교양"이 아닌 "도구"로 만들려면 이 라이브러리.

### 학습 경로 (현실적)

| 단계 | 시간 | 목표 |
|------|------|------|
| 1 | 1일 | Main Demo Colab 따라치기 |
| 2 | 1주 | ARENA Ch1 1·2섹션 (intro + hooks) |
| 3 | 1주 | GPT-2 small에서 emotion 또는 persona vector 추출 재현 |
| 4 | 2주 | Qwen 2.5 7B 같은 한국어 가능 모델로 동일 실험 |
| 5 | open | hyunsoo-bot 시니컬함 trait 추출 시도 |

### 블루프린트 연결

- 직접 layer가 아니라 **모든 layer를 만지는 도구**
- 학습 완료 시 ai-npc-blueprint "검증된 것" 행에 일제히 격상 가능 (지금은 "학습" 상태)

### 갤럽 강점 연결

traits "전략" — 여러 경로 평가. TransformerLens는 prompt만으로 묶여 있던 사고 공간에 **활성화 조작이라는 새 축**을 더해줌.

---

## 열린 질문

- 한국어 모델(HyperCLOVA, Solar 등) 지원 범위
- M1/M2 Mac에서 7B 모델 메모리 한계
- ARENA 진도 어디까지 가야 emotion vector 추출이 자연스러운가
- 추출한 vector를 다른 라이브러리(vLLM 등) 추론 파이프라인에 통합하는 법

---

## 다음 학습 후보

- **nnsight** — 큰 모델용 대안
- **Pyvene** — 개입 실험 전용 라이브러리
- **SAELens** — Sparse Autoencoder + TransformerLens (개념 분리에 유용)
- **ARENA 전체 커리큘럼** — 체계적 mech-interp 학습 코스
- **Anthropic Model Welfare** (학습 큐 #5) — 도구로 무엇을 할 것인지의 윤리

---

## 적용 아이디어

### 단기 (이번 주)
- Main Demo Colab 1회 통과
- ARENA Ch1 첫 노트북 (intro_to_mech_interp) 끝내기

### 중기 (1개월)
- Qwen 2.5 7B 로컬 로드 → 간단한 감정 단어 contrast로 vector 추출 시도
- 추출한 vector를 동일 모델에 steering으로 다시 주입 → 출력 변화 정성 평가

### 장기
- hyunsoo-bot persona vector 추출 → 동일한 성격을 prompt 없이 강제할 수 있는지 검증
- 결과를 paper-write 워크플로우 후보로

---

## 연결된 페이지

- [Emotion Concepts and their Function in a Large Language Model](../techniques/anthropic-emotions-2026.md) — 이 도구로 재현 가능
- emotion-circuits — 감정 회로 개념의 실증 도구
- [Activation Steering — 추론 시점 행동 조작](../techniques/activation-steering.md) — hook으로 한 줄 구현
- [Persona Vectors — 캐릭터 특성을 벡터로 모니터링/조작](../techniques/persona-vectors-2025.md) — 추출 파이프라인의 기반 도구
- [Russell's Circumplex & PAD — 감정 모델링의 표준 어휘](../techniques/emotion-models-circumplex-pad.md) — 심리학 모델 좌표계 실험
- [Parcae — Stable Looped Language Models](../techniques/parcae-looped-lm.md) — 다른 mech-interp 인접 연구
- [Autoresearch — Karpathy의 자동 연구 루프](autoresearch-karpathy.md) — 자율 실험 루프와 결합 가능성
- ai-npc-blueprint — 학습 완료 시 여러 레이어 검증 격상

---

## 출처

- 저장소: <https://github.com/TransformerLensOrg/TransformerLens>
- 공식 docs: <https://transformerlensorg.github.io/TransformerLens/>
- Getting Started: [Mech-interp intro](https://transformerlensorg.github.io/TransformerLens/content/getting_started_mech_interp.html)
- Tutorial: [Callum McDougall TransformerLens-intro](https://github.com/callummcdougall/TransformerLens-intro)
- 코스: [ARENA Chapter 1](https://learn.arena.education/chapter1_transformer_interp/02_intro_mech_interp/)
- Neel Nanda 가이드: <https://www.neelnanda.io/mechanistic-interpretability/getting-started>
