---
created: 2026-06-28
updated: 2026-06-28
type: learning
tags: [llm, agent, react, chain-of-thought, reasoning-scaffold, tool-use, ai-npc]
source:
  - https://arxiv.org/abs/2210.03629
  - https://arxiv.org/abs/2201.11903
authors: ["Shunyu Yao 외 (ReAct)", "Jason Wei 외 (CoT)"]
year: 2022
doi: arXiv:2210.03629
category: technique
---
<!-- 추론 스캐폴드 계보: CoT(추론을 출력형식으로) → ReAct(추론을 환경 feedback에 묶음). AI NPC runtime loop 근거. -->

# ReAct + CoT — 추론 스캐폴드 계보

> Codex 외주 통합 해체(2026-06-28) ③Gate PASS → ④Promote. 수치 전건 추출 텍스트 trace.
> CoT: arXiv:2201.11903 (Wei et al., Google 2022) · ReAct: arXiv:2210.03629 (Yao et al., 2022, ICLR'23)

---

## 한 줄

**CoT는 추론을 *출력 형식*으로 만들고, ReAct는 그 추론을 *환경 feedback*에 묶는다.** NPC/agent runtime 의 기본 디버그 형식 `Thought → Action → Observation` 의 학술 뿌리.

## Layer A — CoT: 추론을 출력 공간에 노출

- CoT = "series of intermediate reasoning steps" 를 few-shot exemplar 로 제공 → arithmetic/commonsense/symbolic reasoning 개선.
- 핵심은 "단계별 설명" 자체가 아니라 **모델이 문제를 여러 중간 상태로 분해하도록 출력 공간을 바꾸는 것**.
- **수치(검증됨)**: PaLM 540B GSM8K standard **17.9 → CoT 56.9 (+39.0)**. 8 exemplar 만으로 SOTA.
- ⚠️ **scale 의존**: 작은 모델에선 도움 안 되거나 성능 해침. 논문이 "sufficient scale" 명시.
- ⚠️ **추론 진위 미보장**: 논문 limitation — CoT path 가 인간 reasoning 을 닮아 보여도 "실제 neural net 이 reasoning 하는가"엔 답 못 함. **reasoning path 가 항상 맞는 것도 아님.**

## Layer B — ReAct: 추론을 행동·관찰 루프에 결합

- thought 가 다음 action 을 고르고, action 이 외부 환경/Wikipedia/API 에서 observation 을 가져오며, observation 이 다시 reasoning 갱신. reasoning trace 와 task-specific action 을 **interleaved** 생성.
- HotpotQA/Fever: Wikipedia API 상호작용으로 **CoT 의 hallucination/error propagation 감소**.
- ALFWorld/WebShop: imitation/RL baseline 대비 **absolute success rate +34% / +10%** (검증됨).
- ⚠️ **실패 양식**: CoT 보다 hallucination 은 줄지만 reasoning error + non-informative search error 발생. → "외부 도구 쓰면 안전"이 아니라 **"도구 실패도 기록해야 안전"**.

## AI NPC 적용

- NPC 내부 판단을 `state → reasoning scratch → decision → public utterance` 로 분리. **CoT trace 는 debugging aid 이지 truth evidence 아님** — public UI 에 그대로 노출 X.
- `Thought → Action → Observation` 을 NPC runtime loop 기본 디버그 형식으로.
- **관찰은 반드시 environment state 에서.** LLM 이 상상한 관찰은 observation 아님(hallucinated_observation 으로 분류).
- social deduction 에선 action 을 `speak/vote/accuse/protect/investigate/bid_to_speak` 로 타입화.
- ReAct log 는 public log 와 private reasoning 분리 저장. 발표엔 public speech, 검증엔 private trace hash + action result.
- 한국어 사회추리: "생각 길게 쓰게 하기"보다 역할별 질문 셋 + evidence pointer 요구 구조가 안전.

## 연결

- [Generative Agents (Park et al. 2023) — AI NPC의 성경](generative-agents.md) — memory/reflection 위에 이 추론 루프가 얹힘(cognition stack)
- [Werewolf LLM (Xu et al. 2023, Tsinghua)](werewolf-llm.md) — 4-component prompt 가 §CoT prompt 를 part 4 로 이미 포함
- [AgentBench — agent 평가는 task completion + failure taxonomy다](agentbench-evaluation-taxonomy.md) — ReAct 류 루프의 실패 taxonomy 평가
- [Research Claim Gate — 주장을 증거 등급에 묶는 운영법](../methods/research-claim-gate.md) — "CoT trace = 추론 증거" 과장 차단의 claim-gate 근거
- ai-npc-blueprint — runtime loop 설계 적용처

## 출처

- CoT: Wei et al. "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models." arXiv:2201.11903 (2022).
- ReAct: Yao et al. "ReAct: Synergizing Reasoning and Acting in Language Models." arXiv:2210.03629 (2022, ICLR'23).
- raw evidence(vault 외 보관): `~/Downloads/AI AGENT/codex-returns/2026-06-28/work/2026-06-28-agent-social-reasoning-papers/`
- 학습일: 2026-06-28 (Codex 충실 해체 외주 → vault Claude ③Gate)
