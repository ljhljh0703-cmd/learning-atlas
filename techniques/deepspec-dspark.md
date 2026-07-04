---
created: 2026-06-29
updated: 2026-06-29
type: learning
tags: [llm-serving, speculative-decoding, draft-model, inference, deepspec, dspark]
source: "https://github.com/deepseek-ai/DeepSpec"
authors: [DeepSeek-AI]
year: 2026
category: technique
---
<!-- DeepSpec/DSpark: speculative decoding용 draft model 훈련·평가 스택 (LLM 추론 가속, infra) -->

# DeepSpec / DSpark — speculative decoding draft-model 스택

> 출처: `deepseek-ai/DeepSpec` (clone commit `dd854392`, MIT, Python, repo 동봉 DSpark 논문). ③Gate PASS 2026-06-29 — 외부 Codex가 repo clone 통독 + 논문 `pdftotext` 추출 → vault Claude가 1차출처(repo+논문) 줄단위 재대조. **실질 수치(Table 1·% 개선·config·코드 ref·arXiv ID) 전건 verbatim 일치, 환각 0.** production 수치는 논문 내부 claim(독립 재현 X)으로 fence됨.

## 한 줄
LLM 추론에서 "draft는 더 길게, verify는 더 똑똑하게" — parallel draft backbone + 얕은 sequential(Markov) head + confidence 기반 verification trimming을 결합한 speculative decoding 훈련/평가 스택.

## Honest Assessment (작가 적용성)
- **이건 NPC "지능" 기술이 아니라 serving 가속 infra 기술이다.** 실시간 다중 NPC·동시 사용자 환경에서 latency/throughput 병목을 줄이는 쪽. ai-npc-blueprint Layer 2(대화 latency budget)·Layer 5(deployment capacity) 보조.
- **개념 수확 우선.** 직접 적용은 자체 LLM serving 운영 시에만 의미. 제약 큼 — default Qwen3-4B target cache ≈ **38TB**, 8GPU 전제, target별 재훈련 필요, production scheduler 미공개.

## 해결하는 문제 + 핵심 개념
Autoregressive LLM은 토큰마다 target forward → output length에 비례해 느림. Speculative decoding = 작은 draft가 여러 후보를 내고 target이 한 번에 검증(분포 보존). 두 병목과 DSpark의 해법:

1. **Speculative = lossless speed path** — draft 후보 block을 target이 rejection sampling으로 longest-accepted-prefix 확정, residual sampling 보정. 속도 축 = draft 빠르게 / acceptance↑ / 불필요 verify↓.
2. **DSpark = DFlash식 parallel backbone + sequential correction** — target hidden states를 concat/projection해 draft backbone 주입. config: `markov_rank=256`·`confidence_head_alpha=1.0`·`confidence_head_with_markov=True`. (DFlash = 같은 trainer에 `markov_rank=0`·`alpha=0.0`. Eagle3 = 별도 trainer·1-layer·TTT horizon 7.)
3. **Markov head = prefix-local transition bias** — 이전 token embedding을 저랭크 logit bias로 변환해 parallel base logits에 얕은 sequential correction만 얹음(full autoregressive block 회피). deployability 위해 RNN head보다 Markov가 default.
4. **Confidence head = verification budget gate** — position별 acceptance likelihood 예측 → threshold 아래 suffix를 verify에서 trim. 고부하일수록 low-confidence suffix를 잘라 batch capacity 확보.
5. **Target cache = 훈련 비용 병목** — target forward를 매 batch 반복 않고 hidden states를 미리 cache(mmap shard). 재현성·속도엔 좋으나 storage 큼(≈38TB 경고).

## 수치 (Verified-from-source, 독립 재현 X)
Table 1 accepted-length/round (Qwen3-4B): DSpark 6.11(GSM8K)/5.70(MATH)/... 로 Eagle3·DFlash 상회. 논문 claim:
- macro-avg accepted length: vs Eagle3 **+30.9/26.7/30.0%** (4B/8B/14B), vs DFlash **+16.3/18.4/18.3%**.
- long block일수록 gain↑ (γ=7 → 16/15/18%, γ=15 → 30/26/22% [math/code/chat]).
- sequential head latency overhead = batch128·ctx512~4096서 DFlash 대비 0.2~1.3%.
- confidence threshold sweep: chat acceptance 45.7%→95.7% (단 rejected suffix 덜 검증하는 tradeoff).
- **production(DeepSeek-V4 live, source-internal)**: V4-Flash 60~85% / V4-Pro 57~78% faster tok/s/user; moderate-SLA throughput Flash +51%·Pro +52%. → repo엔 V4 scheduler/kernel·raw telemetry 미포함이라 source-internal claim으로만 취급.

## 개념적 수확 (serving 사고 프레임)
속도는 모델 크기만의 문제 X(draft quality·verify waste·batch capacity가 같이 결정) / parallel backbone + 얕은 sequential head 절충 / confidence = "정답 확신"이 아니라 "검증할 가치 있는 prefix survival 추정" / 부하에 따라 verify 길이 가변 / 평가 단위가 token accuracy → **accepted length·verify rate·position-wise acceptance·calibration**으로 이동.

## 연결
- ai-npc-blueprint (Layer 2/5 — Gate 후 한 줄 연결만) · [eLLM — CPU 만으로 GPU 보다 빠른 long-context LLM 추론](ellm.md) (CPU/local serving 대비 GPU speculative) · [MLXP — Kubernetes LLM Serving 최적화 (NAVER, 정지윤·장혁진)](mlxp-k8s-llm-serving.md) (같은 deployment 축) · [Odysseus — 자가 호스팅 AI 워크스테이션 참조 구현](../methods/odysseus.md) (local serving wrapper backend 선택지) · [Fixed-Persona SLMs with Modular Memory — 소비자급 하드웨어 다중 NPC 대화](slm-dynamic-content-generation.md)
- 이름만 겹치고 무관: [Forge Spec-Gate (why-was-fable-banned) — 차용 해체](../methods/forge-spec-gate.md)·[스펙→프롬프트 Closed-loop — 스펙 변경이 프롬프트 자동 최적화로 흐르는 파이프라인 (NAVER, 정영훈·김규철·박세)](../methods/spec-to-prompt-closed-loop.md) (agent/workflow spec gate, inference와 무관).

## 다음 학습 후보
DFlash(`arXiv:2602.06036`, DSpark 직접 선행)·Eagle3(`arXiv:2503.01840`, autoregressive baseline) — 둘 다 repo README 인용·링크 실재 확인 / TETRIS(draft token selection as scheduling) / TurboSpec(goodput) / SGLang speculative integration.

## 열린 질문
tiny model+tiny JSONL로 target cache protocol+eval metric만 축소 검증 가능? / thinking-mode target은 draft 재훈련 필요(accepted length 하락폭 측정) / hardware-aware scheduler를 vLLM/SGLang로 이식 가능? / game dialogue domain에서 confidence calibration 재수행 필요?(open chat은 acceptance 낮아 pruning 효과 큼)
