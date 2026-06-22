---
created: 2026-04-25
updated: 2026-04-25
type: learning
tags: [llm, inference, on-device, memory-optimization, deployment, sparsity]
---

# LLM in a Flash (Alizadeh et al. 2023, Apple)

> LLM in a flash: Efficient Large Language Model Inference with Limited Memory
> arXiv:2312.11514v3 (2024-07) · Alizadeh, Mirzadeh, Belenko, Khatamifard, Cho, Del Mundo, Rastegari, Farajtabar — Apple

> ⚠️ 파일명 `apple-llm-reasoning.pdf` 오해. 이 논문은 **reasoning 비판이 아닌 on-device 추론 최적화**.

## 한 줄

DRAM이 모델보다 작을 때 weight를 **flash에 저장**하고 토큰마다 selective load. **windowing + row-column bundling**으로 모델 사이즈의 절반 DRAM에서 **CPU 4x, GPU 20x 가속**.

## 문제 정의

- LLM 7B param = 14GB (FP16) → 스마트폰 못 올림
- 표준 전략: 전체 모델 DRAM 로드 → 한계
- 양자화 alone 부족
- → **flash 저장 + on-demand DRAM 전송**

플래시 = 100GB 가능, DRAM = ~10GB. 대신 flash 대역폭 ~1GB/s vs DRAM ~100GB/s.

## 핵심 인사이트

### 1. ReLU 활성 sparsity

OPT/Falcon FFN layer는 ReLU 후 **>90% 0**. → 전체 weight 중 활성 neuron만 필요.

**Selective Persistence:**
- attention weights (모델의 ~1/3) = DRAM 상주
- FFN 비-sparse 부분만 동적 로드

### 2. Low-rank Predictor

다음 토큰의 활성 neuron을 **저차원 예측기**로 미리 판단. False positive는 0 근처 (영향 미미), false negative 적음. 0-shot 성능 거의 무손실:

| Task | OPT 6.7B | with Predictor |
|------|----------|----------------|
| Arc Easy | 66.1 | 66.2 |
| Arc Challenge | 30.6 | 30.6 |
| HellaSwag | 50.3 | 49.8 |

### 3. Sliding Window Technique

최근 k=5 토큰의 active neuron만 DRAM 캐시 → 새 토큰마다 **차이만 로드** (s_agg(k+1) - s_agg(k)).
Aggregated neuron usage는 k 증가에 따라 slope 감소 → 큰 윈도우 = 적은 incremental.

### 4. Row-Column Bundling

FFN i번째 col(up proj) + i번째 row(down proj)이 같은 neuron에서 활성. **함께 저장 → chunk 2배** 읽기. flash random read는 chunk 클수록 throughput ↑ (32KiB 이상에서 sequential 근접).

## 결과

DRAM = 모델 절반일 때:
- Llama 2-7B (CPU): naive 2250ms → ours **700ms** (~3.2x)
- OPT-6.7B (CPU): naive ~1000ms → ours ~450ms (~2.2x)
- OPT-6.7B (GPU): naive 3100ms → ours ~100ms (~20x)

전체 모델 사이즈의 **2배 큰 모델**도 실행 가능.

## 한계

1. **ReLU sparsity 의존** — Llama2 같은 SwiGLU 모델은 별도 fine-tuning (ReLU 전환) 필요
2. **Predictor 학습 비용** — layer별 4시간 (A100) × num_layers
3. **순차 토큰 가정** — batch inference에서는 sliding window 효과 ↓
4. **현대 LLM은 SwiGLU/GeGLU 우세** — sparsity가 자연 발생 안 함
5. **모델 정확도 약간 감소 가능** (table 1 HellaSwag 0.5pt)

---

## 내 NPC 블루프린트 함의

### A. NPC를 게임에 탑재하는 deployment 답

[Generative Agents (Park et al. 2023) — AI NPC의 성경](generative-agents.md) / [Werewolf LLM (Xu et al. 2023, Tsinghua)](werewolf-llm.md) 은 클라우드 GPT-4/3.5 기반. **실제 게임 상품화** 시 critical:
- 콘솔/PC 게임 = VRAM 제약 (8~24GB)
- 모바일 게임 = DRAM 4~8GB
- → 7B~13B NPC LLM을 on-device 띄우려면 이 논문 기법 필수

### B. Layer 5 (deployment) 의 답안

블루프린트에서 미정이었던 **"실제 어떻게 배포하는가"** 답:
- attention weight DRAM 상주 (캐릭터 일관성 유지)
- FFN sparsity 활용 selective loading
- 캐릭터 persona vector (cf. [Persona Vectors — 캐릭터 특성을 벡터로 모니터링/조작](persona-vectors-2025.md)) 도 DRAM 캐시 후보

### C. NPC dialogue의 sliding window 자연 정합

NPC 대화는 본질적으로 토큰 순차 생성. sliding window k=5 패턴이 그대로 적용. 게임 실시간 응답 (< 100ms) 요건과 정합.

### D. "Steam에 출시 가능한 NPC" 가능성 시사

이 기법 + LoRA persona ([RoleLLM (Wang et al. 2023) — 캐릭터 단위 역할극 LLM 표준화](role-llm.md)) + 양자화(GGUF/MLX) → 7B NPC가 8GB 모바일에서 **실시간 응답**. 내 NPC 비전이 "클라우드 기반 데모" 단계 넘어 **상품 단계**로 이동하는 핵심 enabler.

### E. ⚠ 한계 인지

- ReLU 의존이 큼 → 현대 LLM (Llama3, Qwen2.5)에 그대로 적용 X
- Apple MLX 생태계 외 호환성 제한
- 5년 후 NPU/AI accelerator로 우회 가능성 (이 논문이 transitional 일 가능성)

### F. 비전 ↔ 현실 다리

ai-npc-vision 의 "플레이어와 관계 형성하는 존재"가 **현실의 게임 빌드**에 들어가려면 이런 추론 최적화가 선행. 비전은 멋져도 모바일 못 돌면 의미 없음. **deployment 제약을 비전 단계부터 고려해야** — 이 논문이 그 안내자.

---

## 연결

- 블루프린트: ai-npc-blueprint Layer 5 (deployment) 핵심
- 비전: ai-npc-vision (상품화 가능성)
- 음성층 호환: [RoleLLM (Wang et al. 2023) — 캐릭터 단위 역할극 LLM 표준화](role-llm.md) (LoRA persona + on-device)
- persona lock: [Persona Vectors — 캐릭터 특성을 벡터로 모니터링/조작](persona-vectors-2025.md) (DRAM 상주 후보)
- 행동층: [Generative Agents (Park et al. 2023) — AI NPC의 성경](generative-agents.md) (클라우드 → on-device 이식)
- 게임 디자인: [Mafia Game Refinement (Ri et al. 2022, JAIST)](mafia-game-refinement.md) (실시간 응답 = E_p 곡선 핵심)
