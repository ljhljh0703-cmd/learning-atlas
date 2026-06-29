---
created: 2026-06-28
updated: 2026-06-28
type: learning
tags: [llm, agent, evaluation, benchmark, failure-taxonomy, agentbench, ai-npc]
source: https://arxiv.org/abs/2308.03688
authors: ["Xiao Liu 외 (Tsinghua)"]
year: 2023
doi: arXiv:2308.03688
category: technique
---
<!-- AgentBench: agent 평가 = 단일 IQ 점수 X, 다환경 task completion + failure taxonomy. NPC 평가 설계 근거. -->

# AgentBench — agent 평가는 task completion + failure taxonomy다

> Codex 외주 통합 해체(2026-06-28) ③Gate PASS → ④Promote. 수치 추출 텍스트 trace.
> arXiv:2308.03688 (Liu et al., Tsinghua 2023)

---

## 한 줄

LLM-as-agent 를 **8개 환경 × 29 LLM** 으로 평가. 핵심 교훈 = **단일 "agent IQ" 점수가 아니라 다환경 task + failure taxonomy** 가 옳은 평가 모양.

## 8개 환경 (3 type, 검증됨)

- **Code**: Operating System, Database, Knowledge Graph
- **Game**: Digital Card Game, Lateral Thinking Puzzle, House-Holding
- **Web**: Web Shopping, Web Browsing

(5/8 은 본 벤치를 위해 신규 제작)

## 핵심 진단

- **top commercial LLM ↔ 70B 이하 OSS 모델 사이 큰 성능 격차.**
- 실패 원인 = **장기 추론·의사결정·지시 준수 부족.**
- **Task Limit Exceeded (TLE)** 가 주요 실패 유형 — 정해진 step 안에 못 푼 경우.
- **code training 은 양면적**: 정적 절차형 task 엔 도움, 일반 전략/추론 task 엔 악영향 가능.

## AI NPC 적용

- 우리 agent 평가도 **단일 점수보다 failure taxonomy**. 제안 분류:
  `completed / task_limit_exceeded / invalid_action / invalid_format / context_limit_exceeded / private_info_leak / role_rule_violation / unrecoverable_loop`
- "AI 가 마피아를 잘한다"보다 **"어떤 failure mode 가 줄었는가"** 가 연구 claim 으로 안전.
- 능력은 환경별로 분리 평가 — **대화 잘함 ≠ 도구 사용 ≠ 장기 계획 ≠ 사회추리.** 같은 능력 아님.

## 연결

- [ReAct + CoT — 추론 스캐폴드 계보](react-agent-loop.md) — 평가 대상 루프(closed-loop action)
- [Werewolf LLM (Xu et al. 2023, Tsinghua)](werewolf-llm.md) · [Mini-Mafia — 기만/탐지/폭로 분해 벤치마크 + NPC 기만 데이터셋](mini-mafia-benchmark.md) — 사회추리 도메인 벤치(환경 분리 원칙 적용)
- [Research Claim Gate — 주장을 증거 등급에 묶는 운영법](../methods/research-claim-gate.md) — failure taxonomy = claim 보수화의 측정 축
- ai-npc-blueprint — 평가 매트릭스 적용처

## 출처

- Liu et al. "AgentBench: Evaluating LLMs as Agents." arXiv:2308.03688 (2023).
- raw evidence(vault 외 보관): `~/Downloads/AI AGENT/codex-returns/2026-06-28/work/2026-06-28-agent-social-reasoning-papers/`
- 학습일: 2026-06-28 (Codex 충실 해체 외주 → vault Claude ③Gate)
