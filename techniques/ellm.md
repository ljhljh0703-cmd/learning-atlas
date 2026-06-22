---
created: 2026-05-03
updated: 2026-05-03
type: learning
tags: [AI, LLM-inference, CPU, KV-cache, long-context, system-architecture, on-device]
source: https://github.com/lucienhuangfu/eLLM
category: technique
---

# eLLM — CPU 만으로 GPU 보다 빠른 long-context LLM 추론

*Yaguang Huangfu (The Hong Kong Polytechnic University), Rust, 346★ / 35 fork (2026-05-03), v0.1.0-alpha (2026-04-06)*

GPU 가 LLM 추론의 default 라는 통념을 정면 반박. **장문맥(100K~1M token)** 추론에서 단일 CPU 서버 (Xeon 6982P-C, $14K) 가 H20×8 ($220K) 노드를 end-to-end 로 따라잡거나 추월할 수 있다는 시스템 디자인 논문 + 구현체.

> 정직한 판단: AI NPC blueprint **레이어 5 (배포/추론 인프라)** 직접 연결. 직접 적용 — **중간** (비전 A 단일 플레이어 + 긴 NPC 메모리에 잠재 후보). 시급성 — **중기** (alpha 단계, 모델 weight 미연결, 2026 후반 본격 검토 가치).

---

## 한 줄 요약

> "GPU 의 작은 메모리 / 큰 병렬성" 대신 "CPU 의 *큰 메모리 + 큰 캐시* / 적당한 컴퓨트" 를 활용 — 정적 사전 할당으로 동적 오버헤드 0, 단일 패스 Prefill 로 장문맥에서 GPU 추월.

---

## 핵심 개념

### 1. Space-for-time 철학 (전체 디자인 원칙)

CPU 서버는 "큰 메모리 + 큰 L3 캐시 + 적당한 컴퓨트". 이 프로필에 맞춰 추론을 **사전 할당 가능 + 직접 주소 가능 + 재사용 가능** 한 파이프라인으로 재설계. 런타임 오버헤드를 메모리 비용으로 지불.

### 2. Elastic 정적 컴퓨팅 그래프

기존 정적 그래프는 고정 shape 만 지원 (가변 길이엔 zero-padding 낭비). 동적 그래프는 매 토큰마다 재구성 — CPU 가 graph management + execution 을 동시에 부담해 80 layer × 12K 노드 = 983K 노드 traversal 비용 발생.

해법: **dimension-first 레이아웃**. 동일 logical 좌표 → 동일 메모리 주소. 한 번 컴파일된 단일 그래프가 가변 입력 길이 모두 지원.

### 3. Static-shape KV cache (non-paged)

vLLM 의 paged KV cache 안티패턴 분석:
- 페이지 매핑 → 포인터 chasing → TLB miss
- 128-token chunk 가 partial fill (예: 50 token) → 전체 block 로딩 후 underutilized
- chunk 간 fragmentation, 동기화

eLLM: **고정 shape 텐서 사전 할당** (max_batch × max_seq × hidden), 좌표 기반 직접 인덱싱. 1M token KV = 327.7 GB → CPU 3TB 메모리는 받아냄, A100 4대 합 (≈320GB) 는 못 받음.

### 4. Head-by-head attention (FlashAttention 적용)

Prefill 의 기본 단위 = "단일 토큰 × 단일 KV head". 한 head 의 모든 토큰 계산을 끝낸 뒤 다음 head 로 이동.

> CPU 코어는 적지만 (~128) L3 캐시가 GPU L2 대비 **8.4×** 크다 (504 MB vs 60 MB). 한 head 를 캐시에 상주시킨 채 재사용 — 캐시 residency가 기존 병렬 패턴 대비 **2~3 차수** 향상.

LLaMA3-70B GQA: 64 query head × 8 shared KV head → 8 KV head 만 L3 에 한 번 로드, query 64 head 는 코어 병렬. 누적 출력 벡터는 CPU 레지스터 잔류.

### 5. 거대 차원 텐서 = 사실상 무경계 KV

GPU: VRAM 한계 → prompt 를 chunk 분할 → chunk 마다 model parameter 재로딩 → 누적 I/O 폭증.
eLLM: 1M token Prefill 을 **단일 패스**. parameter 한 번만 로드.

---

## 수치적 결과

### 단문맥 Decode (완료, Qwen3-Coder-30B-A3B FP16, batch=1, prompt=128/256/512)

| 시스템 | TPOT (ms/token) |
|--------|-----------------|
| eLLM (CPU) | **32.94 / 33.01 / 33.13** |
| SGLang (CPU baseline) | 52.50 / 52.47 / 52.71 |

→ **1.6× speedup, 38% latency 감소** (CPU 끼리 비교). 단문맥에선 GPU 가 여전히 우위라 GPU 비교 생략.

### 장문맥 (2026-05 말 예정, Qwen3-Coder-480B-A35B, prompt=100K, batch=10)

- eLLM: chunk 1M 으로 단일 패스
- GPU baseline: chunk 10K × 100 chunk 분할 처리

저자 주장 (실측 진행 중): Prefill 에서 GPU 추월 예상. 근거 — 반복 parameter 로딩 제거, KV layout locality, chunk 동기화 비용 0.

### 하드웨어 비교 (Table 2 + README)

| | CPU (Xeon 6982P-C) ×1 | GPU (H20) ×8 |
|---|---------------------|--------------|
| FP16 TFLOPS (matrix) | 250 | 296 (단일 컴퓨트는 비슷) |
| L3/L2 캐시 | 504 MB | 60 MB |
| 메모리 | 3 TB | 0.141 TB |
| 비용 | **$14,000** | $220,000 |

---

## 기술 스택 / 사용법

```
하드웨어: Intel Xeon 4세대+ (AMX 지원) 또는 EPYC, DDR5
소프트웨어: Rust 코어, vLLM API 호환
모델: Qwen3 시리즈, MiniMax M2.5 (현재)
한계: alpha 단계 — randomly initialized weights, attention/tokenization 미포함, 모델 산출물 reference 와 불일치 (operator-level 만 검증 완료)
```

저자가 직접 명시한 sweet spot:
1. **Open Claw (computer-use agent)** — skill 동적 로드, 긴 컨텍스트 추론, 짧은 tool-call 출력. 작은 batch + 인터랙티브.
2. **Code copilot** — cross-file/module 코드 한 번에 Prefill.
3. **RAG 장문서** — 외부 KB 를 long context 로 직접 주입.
4. **Deep Research** — 다단계 retrieval, 시간이 길어도 무방.

---

## 내 생각 — AI NPC 관점

### 직접적 연결: 중간 (비전 A 잠재 후보)

**비전 A (hwiglija-tower-gdd / ai-npc-game) — 잠재 후보**:
- 단일 플레이어 게임 → batch=1 (eLLM sweet spot)
- NPC 의 누적 memory stream + 환경 ledger 를 long context 로 (10K~100K token 가능)
- GPU 없는 가정용 PC 에 배포 가능 — 게이머의 Ryzen/Core i9 + 64GB DDR5 만으로 NPC 추론
- 단점: 현 alpha 라 2026 말~2027 초 production 가능성

**비전 B (mirofish-lab / [OASIS: Open Agent Social Interaction Simulations with One Million Agents](oasis.md)) — 부적합**:
- 1M agent 동시 시뮬레이션 → 대규모 batch 필요
- eLLM 은 batch 작을 때 이점, batch 크면 GPU 우위
- OASIS 의 GPU cluster 패턴 유지가 합리적

**중요 차별점 vs [LLM in a Flash (Alizadeh et al. 2023, Apple)](llm-in-a-flash.md)**:
| 도구 | 타깃 | 메모리 전략 |
|------|------|-------------|
| Apple llm-in-a-flash | 모바일/엣지 | flash + sliding window |
| eLLM | 데스크톱/서버 CPU | DDR5 + L3 캐시 잔류 |

**둘은 자매 — on-device LLM 의 두 갈래**. NPC 게임 배포 시:
- 모바일 NPC → llm-in-a-flash
- PC NPC → eLLM
- 클라우드 NPC (저비용) → eLLM 멀티소켓 NUMA

### 개념적 수확: 높음 — Static Pre-allocation Pattern

이 논문의 진짜 메타 발상:

> **"동적 메모리 관리는 작은 비용이지만 *고빈도* 라 누적되면 지배적이다. 정적 사전 할당으로 그 빈도 자체를 0 으로."**

이 패턴은 LLM 추론을 넘어 일반화 가능:
- **NPC 게임 perception layer** — 매 프레임 dynamic state 직렬화 대신 max-shape 텐서 사전 할당, 좌표 인덱싱 ([video-use — 영상을 *읽는* 에이전트 스킬](../methods/video-use.md) 의 packed.md 와 같은 발상의 구조 버전)
- **시뮬레이션 trace 저장** — [OASIS: Open Agent Social Interaction Simulations with One Million Agents](oasis.md) 의 1M agent 결과 ledger 를 dimension-first 로
- **위키 schema** 자체가 이미 같은 발상 — 매 entry 마다 frontmatter 슬롯 미리 정해놓음

### 블루프린트 연결

- **Layer 5 (배포/추론 인프라)** — 직접 매핑. NPC 추론을 GPU 없이 가정용 CPU 로.
- **Layer 1 (메모리/perception)** — Static KV cache 패턴이 NPC memory store 설계에 적용 가능 (Generative Agents memory stream 을 paged 가 아닌 static array 로)

### 창작자 정체성과의 연결

> "GPU 가 default 다" 같은 통념을 인프라 차원에서 의심한다. 이 사고방식 자체가 [Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](../methods/karpathy-guidelines.md) #1 (Surface Assumptions) 의 시스템 엔지니어링 버전.

상용 NPC 게임은 "AI 추론 = 클라우드 API" 가정에 묶여있음 (지연·비용·프라이버시 모두 약점). eLLM 가설이 맞다면 — 게이머 PC 로컬에서 직접 NPC 추론 = 비전 A 의 *기술적 가능성* 을 한 단계 끌어올림.

---

## 한계와 회의 지점

1. **alpha 단계의 진실** — 현재 실험은 randomly initialized weight, attention/tokenization 미포함. operator-level 만 검증. 모델 산출물 정합성 미달성. 장문맥 GPU 비교 실험은 *예측* 만, 실측 미공개 (2026-05 말 예정).
2. **batch=1 sweet spot 의 양면** — 게임에 좋지만 multi-tenant 서비스엔 약점.
3. **"328GB KV per user"** — 1M token 단일 사용자 시나리오라 게이머 PC 64~128GB 로는 100K~200K token 대까지만 현실적.
4. **AMX 의존** — Xeon 4세대+ 만 적용. AMD EPYC 동급, ARM (Apple M-series) 적용 미지수.
5. **Rust 신생 — 생태계** vLLM/SGLang 대비 매우 작음. NPC 통합 시 자체 wrapping 필요.

---

## 다음 학습 후보

- **Open Claw (computer-use agent)** — eLLM 저자가 명시한 sweet spot 워크로드. browser-use 가족과 연결되어 본 위키 [video-use — 영상을 *읽는* 에이전트 스킬](../methods/video-use.md) · browser-use 클러스터의 인프라 짝.
- **AMX (Intel Advanced Matrix Extensions)** — eLLM 성능의 하드웨어 근거. 명세 + 실제 throughput 한계 파악 시 주장 검증 가능.
- **SGLang CPU backend / llama.cpp 비교** — eLLM 의 baseline. 1.6× speedup 의 정직한 평가는 baseline 깊이 이해 후에야 가능.
- **GraphRAG long-context vs eLLM full-context** — [Microsoft GraphRAG — Query-Focused Summarization on Narrative Private Data](graphrag.md) 는 retrieval 로 컨텍스트 *축소*, eLLM 은 *모두 받아냄*. 두 전략의 trade-off 분석 가치.
- **NUMA multi-socket scaling** — 저자가 "future work" 로 언급. 4× Xeon 노드의 NPC inference farm 설계 가능성.

---

## 연결된 페이지

- [LLM in a Flash (Alizadeh et al. 2023, Apple)](llm-in-a-flash.md) — Apple 의 자매 on-device 전략 (모바일 갈래, eLLM 은 데스크톱/서버 갈래)
- [Generative Agents (Park et al. 2023) — AI NPC의 성경](generative-agents.md) — NPC memory stream 을 static KV 로 매핑하는 아이디어 후보
- ai-npc-blueprint — Layer 5 배포 인프라 직접 후보
- [Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](../methods/karpathy-guidelines.md) — Surface Assumptions 의 시스템 엔지니어링 instance
- [video-use — 영상을 *읽는* 에이전트 스킬](../methods/video-use.md) · [CocoIndex — Incremental Data Pipeline for AI Agents](cocoindex.md) — "정적 surface + 동적 호출" 패턴 family
- [Microsoft GraphRAG — Query-Focused Summarization on Narrative Private Data](graphrag.md) — retrieval-축소 vs full-context 추론의 대안 전략
- [OASIS: Open Agent Social Interaction Simulations with One Million Agents](oasis.md) / mirofish-lab — 비전 B 부적합 분석 근거
- hwiglija-tower-gdd — 비전 A 잠재 적용 후보
