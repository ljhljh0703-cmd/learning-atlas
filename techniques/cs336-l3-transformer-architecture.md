---
created: 2026-07-10
updated: 2026-07-10
type: learning
tags: [llm, transformer, architecture, cs336, decoder-only, rope, gqa, rmsnorm]
source: [http://cs336.stanford.edu/spring2025/, https://github.com/stanford-cs336/spring2025-lectures]
authors: ["Tatsunori Hashimoto"]
year: 2025
category: technique
---
<!-- Codex 해체분석 ③Gate 흡수(2026-07-10) — 디코더-only Transformer 아키텍처 선택·검증 시퀀스. Stanford 슬라이드 패러프레이즈(verbatim 금지). -->

# CS336 Lecture 3 — Transformer 아키텍처 선택·빌드 시퀀스

> ③Gate 통과(2026-07-10). Stanford CS336 *Language Modeling from Scratch* L3(Hashimoto, 2025-04-08), 68p 슬라이드 SHA `3692b3d`. **모델 내부 학습 경로**(에이전트 프레임워크 아님) — LLM을 도구·메모리·백엔드로 감싸기 *전* 디코더-only 구조를 어떻게 고르고 검증하나. Stanford 저작권 → 패러프레이즈만.

## 1. 핵심 명제 — 각 아키텍처 선택은 서로 다른 *제약*을 움직인다
"Llama 체크리스트 복사"가 아니라, 선택마다 지배 제약이 다름:

| 선택 | 주 제약 |
|---|---|
| Pre-norm / RMSNorm | gradient·residual 경로 안정성·data movement(RMSNorm=품질마법 아닌 데이터이동 축소) |
| GLU-family FFN | 파라미터 배분·비선형 용량(gate가 projection 추가 → *동일 파라미터/FLOP 예산*서만 비교) |
| RoPE | 위치=additive label 아닌 *회전*(내적이 상대위치 운반) |
| width/depth/heads/vocab | 파라미터 예산·compute·표현 shape (독립 노브 아닌 *ledger*) |
| z-loss / QK norm | softmax 수치 안정(출력softmax vs attention softmax = 다른 실패면, 뭉뚱그리지 말 것) |
| KV cache·MQA/GQA·sliding | decode 메모리대역폭·context 비용(생성=순차 → 대역폭이 주 제약) |

## 2. 빌드 계약 — Retrieval Card (CS336-L3-00~07, 식별자 verbatim 재사용)
각 단계 = **study → build → done-gate**. 결정론·테스트 우선, 결론 성급 금지:
- **L3-00 경계**: 디코더 블록·causal attention·next-token loss → tiny CPU forward. Gate: logits `[batch,seq,vocab]` + causal-mask 테스트(미래 토큰이 과거 logit 못 바꿈). RAG/tool/agent/serving 아직 추가 X.
- **L3-01 residual+norm**: pre/post-norm·LayerNorm/RMSNorm. Gate: forward shape·유한 gradient·norm 배치 구조 테스트.
- **L3-02 FFN/gated**: ReLU/GELU vs GLU, **파라미터 매칭**. Gate: config ledger 동일 파라미터/FLOP·1seed로 승자선언 금지.
- **L3-03 RoPE**: 2D 회전 손계산 fixture·offset 테스트·train/decode 동일 convention(실패징후=train과 decode가 다르게 회전).
- **L3-04 shape ledger**: d_model/d_ff/layers/heads/vocab → 1 SSOT서 파라미터·activation·tokens/batch·KV-cache bytes 산출. 필드 하나 바꾸면 전 의존값 갱신. *결합 family 하나씩* 변경(folklore 금지).
- **L3-05 안정성**: z-loss(출력)·QK norm(attention) 분리 계측 → 스트레스 fixture 탐지·stabilizer는 ablation으로 어느 metric 잡는지 증명.
- **L3-06 inference economics**: KV cache·MHA/MQA/GQA·sliding. Gate: prefill latency·decode tok/s·peak mem·uncached 대비 parity → *그 다음* head-sharing 비교. 측정된 serving 제약 기준(train loss만으론 X).
- **L3-07 소규모 ablation**: baseline·gated-FFN·inference-attention 1행렬. 동일 dataset/seed/budget/schema, correctness gate와 quality/cost 분리, `no conclusion` 옵션 명시.

## 3. 반영 (Apply-or-Park)
- **① Applied**: 본 노트(정본). 여정 매핑 = model literacy(L3-00~06) → 소형 구현(L3-07) → application arch → infra → domain(NPC). **파운데이션 모델 처음부터 학습 불요** — NPC 경로 시작에 Stage B(소형 디코더 실측)면 latency/context 추론 충분.
- **관계**: [LLM in a Flash (Alizadeh et al. 2023, Apple)](llm-in-a-flash.md)(KV-cache·sliding = 온디바이스/NPC 대사)·ai-npc-blueprint(SwiGLU/sliding 언급)와 상보. `.archive/antigravity-2026-06-27/stanford-cs336-basics`(**Assignment 1 구현스펙** — 별개, 중복 아님)와 구분.
- **② Parked**: 실구현은 작가 소형 LM 착수 시.

## 4. Anti-overclaim
2025 설계 스냅샷(2026 완전 레시피 아님). L3 단독으로 전체 pretraining 안 가르침. **모델 구현·학습 0**(빌드 gate=향후 작업, 달성결과 아님). KV cache(하위 메모리) ≠ 지속 의미기억/NPC 신념/학습. "slide 10 pre-norm 기본" = 슬라이드 번호 미검증(주장 자체는 정확).
