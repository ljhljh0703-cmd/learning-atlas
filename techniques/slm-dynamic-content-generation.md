---
created: 2026-06-07
updated: 2026-06-07
type: learning
tags: [slm, npc-dialogue, modular-memory, local-ai, persona, libgdx-rogue-os]
source:
  - https://arxiv.org/abs/2511.10277
authors: [Martin Braas, Lukas Esterle]
year: 2025
doi: arXiv:2511.10277
category: technique
---

<!-- Fixed-Persona SLMs with Modular Memory (Braas & Esterle 2025) 학습 노트 — libgdx-rogue-os NPC 대화 -->

# Fixed-Persona SLMs with Modular Memory — 소비자급 하드웨어 다중 NPC 대화

*Martin Braas, Lukas Esterle (arXiv:2511.10277, 2025)*

소형 언어 모델(SLM)의 **성격(persona)은 LoRA 로 고정**하고 **캐릭터별 기억·세계관은 외부 벡터 메모리로 분리**해, 모델을 다시 로드하지 않고도 소비자급 기기에서 다중 NPC 대화를 굴리는 아키텍처. DistilGPT-2 / TinyLlama-1.1B / Mistral-7B-Instruct 를 평가.

> 📝 **이 파일의 내력**: 2026-06-07 초안(Gemini)은 제목을 "High-Quality Dynamic Game Content via SLM"으로 *오기재*하고 'NPC 대화'를 '로그라이크 콘텐츠 생성'으로 프레이밍했다. 본 개정에서 실제 제목·프레이밍으로 교정. 수치는 원논문 전문 검증 결과 정확.

---

## 한 줄 요약

> persona 가중치는 고정하고 캐릭터별 컨텍스트 DB 만 런타임에 0.012~0.027초로 스왑하면, Mistral-7B 급 단일 모델 하나로 여러 NPC 의 *대화 맥락*을 소비자급 GPU 에서 분리 운용할 수 있다.

---

## 핵심 개념

### 1. Fixed Persona (LoRA 고정)
- 모델 자체에 캐릭터 성격·행동 제약을 LoRA 로 파인튜닝해 *박제*. 런타임에 persona 는 안 바뀜.

### 2. Modular Memory (외부 분리)
- 대화 내역·세계관 지식은 ChromaDB 등 외부 벡터 저장소로 격리. NPC 전환 = *메모리 DB 핸들만 교체*. 모델 reload 없음.

### 3. 평가 모델 변형
- **Oliver*(Mistral-7B 기반, 최고 품질) · Casper*(중형) · Jack*(소형, DistilGPT-2/TinyLlama 급)**. 접미 S=주력 변형, Q=양자화.

---

## 수치 (원논문 전문 검증, 2026-06-07)

| 지표 | OliverS | CasperS | JackS |
|---|---|---|---|
| Factuality | **93%** | 55% | 16% |
| Context retention | **100%** | — | — |
| World-knowledge retrieval | **100%** | — | — |
| Fluency 오류 | **0건** | — | — |

| 효율 지표 | 값 |
|---|---|
| Memory swap latency | **0.012 ~ 0.027 s** |
| Memory retrieval latency | **< 0.042 s** |
| OliverS TTFT (첫 토큰) | 0.1145 s |
| OliverS 전체 응답 latency | **5.49 s** |
| CasperS / Jack latency | 1.91 s / ~0.8 s |
| OliverQ latency | 34.58 s |
| VRAM (Oliver / Casper / Jack) | ~4.2 GB / ~807 MB / ~130 MB |
| 디스크 (OliverS / OliverQ) | 15.93 GB / 3.9 GB |
| 메모리 DB 크기 | 3.92 MB / 8.98 MB |

---

## 내 생각 — libgdx-rogue-os 적용 관점

### Honest Assessment
- **레이어**: NPC 대화/기억 레이어 (전투 AI 아님)
- **적용 가치**: 개념 수확 (직접 이식엔 무게가 큼)
- **시급성**: 장기 (NPC 대화 기능은 코어 이후)

### 직접적 연결: 중간 (구조는 유효, 실시간성은 주의)
"모델 고정 + 캐릭터별 메모리만 교체"는 동행자·상인 NPC 대화에 그대로 쓸 만한 설계다. **메모리 스왑 0.03초**는 턴 사이 전환에 충분.

### ⚠️ 처참한 실패 시나리오 (가장 중요한 honest 포인트)
- **OliverS 전체 응답 5.49초**. TTFT(0.11초)만 보고 "빠르다"고 오해하면 안 됨 — *완결 대사 한 줄*에 5초+다. 턴제 메뉴형 대화엔 허용되나 **실시간 말풍선엔 부적합**. 모바일 온디바이스면 더 느려질 수 있음.
- VRAM ~4.2GB(Oliver) 는 모바일에서 과중 → 실배포는 Jack 급(130MB) + 품질 타협이거나 경량 서버 경유. 즉 "온디바이스 Mistral-7B" 는 비현실적, **소형 모델 또는 서버**가 현실해.

### 개념적 수확
- *persona 고정 / memory 분리* 의 분업은 [Generative Agents](generative-agents.md) 의 memory stream 을 SLM 예산에 맞춰 축소한 실용판. 우리 NPC 가 "과거 턴 사건(상인 살해 등)"을 외부 메모리로 들고 다니게 하는 근거.

---

## 열린 질문

- 5.49초 latency 를 턴 연출(애니메이션·타이핑 효과)로 가릴 수 있는 상한은?
- Jack 급(130MB, factuality 16%) 으로 *대화 품질*을 어디까지 끌어올려야 게임에 쓸 만한가 — 품질/비용 손익분기?

---

## 다음 학습 후보

- **원논문 §평가 방법론 정독** — factuality 93% 의 측정 프로토콜 (어떤 데이터셋·판정자)
- [Generative Agents (Park et al. 2023) — AI NPC의 성경](generative-agents.md) — memory stream 의 원형, 풀스케일 버전
- **llama.cpp Android JNI** — 온디바이스 SLM 실측 벤치

---

## 연결된 페이지

- libgdx-rogue-os — NPC 대화·동행자 기억 후보
- [Generative Agents (Park et al. 2023) — AI NPC의 성경](generative-agents.md) — memory + persona 의 학술 조상
- [Berlin Interpretation — 로그라이크 장르 정의의 사실상 표준](berlin-interpretation.md) — Non-modal 대화 UI 제약과의 긴장
