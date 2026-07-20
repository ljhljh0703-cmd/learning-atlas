---
created: 2026-07-18
updated: 2026-07-18
type: learning
tags: [agent-harness, self-improving, rsi, experience-bank, diagnosis-taxonomy, harness-optimization]
source:
  - https://arxiv.org/abs/2607.14159
  - https://arxiv.org/html/2607.14159v1
authors: [Yue Huang, Wenjie Wang, Han Bao, Yuchen Ma, Xiaonan Luo, Yi Nian, Haomin Zhuang, Zheyuan Liu, Yue Zhao, Xiangliang Zhang]
year: 2026
doi: arXiv:2607.14159
category: technique
---

<!-- MemoHarness(arXiv 2607.14159) — 하네스가 경험에서 학습. vault Dual-Track과 동형, delta=6차원 진단 taxonomy -->

# MemoHarness — 경험에서 학습하는 에이전트 하네스

> ⚠️ **provisional** — 미게재 프리프린트(2026-07-14, venue 없음), 수치 전부 저자 자체측정. 흡수 대상은 *구조·taxonomy*이지 벤치 수치가 아니다.

## 한 줄 요약

> 하네스(베이스 LLM→작동 에이전트 제어층)를 고정 config로 두지 않고, **6개 제어차원으로 분해 + dual-layer 경험은행에 실패진단을 축적 + 신규 케이스에 retrieval로 맞춤 조립**한다. = vault가 이미 운영하는 "하네스가 경험에서 진화"의 학술적 정식화.

## 메커니즘

**6 제어차원**(추론 흐름 순): D1 Context Assembly · D2 Tool Interaction · D3 Generation Control · D4 Orchestration · D5 Memory Management · D6 Output Processing.

**Dual-layer Experience Bank** ℬ=(ℰ,𝒢):
- **ℰ (케이스별)**: 실행 스냅샷 — 특징·config·궤적·보상·비용·**진단**(성공/실패 + 어느 차원이 실패 유발).
- **𝒢 (증류된 전역패턴)**: N반복마다 distillation operator가 **실패 클러스터**에서 케이스 넘는 규칙성 추출(근거+예상효과).

**루프**: 실행 → **진단 operator g**(검증결과·예외·타임아웃·누락·명령실패·트레이스 → 6차원 중 하나로 매핑) → 엔트리 기록 → N회마다 증류 → **correctness-first 사전식 랭킹**(정답 우선, 동점 시 저비용). 테스트 시 = 임베딩 코사인 top-K 성공/실패 이웃 + 전역패턴 조회 → 케이스별 하네스 조립(테스트 중 재검색 X).

**결과**(자체측정): Terminal-Bench 0.806 vs Codex 0.722. 크로스모델 평균 +0.098. 비용 $6.89(캐시 13.3M/14.2M) < Codex $10.28.

## 🔬 한계·비판 (수용 전 검증)

- **미게재**(venue 없음) — Terminal-Bench 0.806·크로스모델 gain 독립검증 0. 비용회계도 "under this cost-accounting protocol"(자체 정의).
- **스케일 불일치**: labeled search corpus 반복학습 전제. vault는 소량·비정형 사건·단일작가 → retrieval 통계가 약함. *자동 search loop는 이식 부적합*.
- **자동화 상충**: 논문의 핵심 동력 = 자동 반복 최적화. vault는 **infra-0·주1회 수동 회고**([Self-Improvements in Modern Agentic Systems: A Survey (arXiv 2607.13104)](self-improving-agents-survey.md)에서 이미 자동 self-improve 기각) → 루프 메커니즘은 채택 안 함.

## 🔀 이미 수용한 지점과의 delta (기존 vault ↔ 논문)

| MemoHarness | vault 기존 수용분 | delta(차이) |
|---|---|---|
| Dual-layer Bank(ℰ 케이스 / 𝒢 증류) | Dual-Track Protocol: Memory(사건별) / lessons·헌법(증류) | **구조 동일** — 논문이 vault를 검증. 차이=vault는 프로젝트별 폴더, 논문은 단일 bank+임베딩 |
| 진단 operator g(실패→6차원 매핑) | vault 회고: 실패를 **서술형**으로 명명 | ⭐**진짜 delta**: vault엔 *고정 진단 taxonomy 부재*. 논문 D1~D6 = 회고를 정밀·재현가능하게 만드는 렌즈 |
| correctness-first 사전식 랭킹 | [Self-Improving Coding Agent (SICA) — DGM·HGM 의 공통 조상](self-improving-coding-agent-sica.md) 다기준 효용·greedy | 거의 동일(이 세션 흡수분과 정합) |
| retrieval→케이스별 조립 | ① Dispatch(vault-first→시작노드→하네스 로드) | vault는 *수동 그래프 순회*, 논문은 *임베딩 자동*. vault §4 grep>벡터라 자동임베딩 미채택 |

→ **결론: 논문은 대부분 vault가 이미 하는 것. 순수 신규 = D1~D6 진단 taxonomy 하나.**

## 🌿 시너지 가지뻗기 (반영·진화 방향)

1. **agent-harness에 6차원 진단 렌즈 park** — 하네스 실패 회고 시 "이 실패 = D1~D6 중 무엇" 강제 태깅 → 진단 정밀화·패턴 클러스터링 가능. (예: "D5 Memory 오염"·"D1 Context 과다".)
2. **hermes-loop ③Gate·⑤Distill 강화** — 게이트 실패를 6차원으로 분류하면 증류(⑤)가 *실패 클러스터*를 잡기 쉬워짐(논문 𝒢 레이어 방식).
3. **llm-wiki-reliability-harness VIS와 연결** — vault-health 축(broken_links·graph_freshness 등)을 6차원 진단과 매핑하면 self-monitoring 정밀도↑.
4. **선행 지향**: 이 논문이 vault를 *뒤늦게 정식화*했다는 사실 자체가 신호 — vault의 다음 수는 논문에 없는 것(단일작가·수동·그래프 기반 진단)을 taxonomy로 역수출하는 것.

## 관계
- [Self-Improvements in Modern Agentic Systems: A Survey (arXiv 2607.13104)](self-improving-agents-survey.md) — Σ-개선 형식. MemoHarness = 그 harness-optimization 인스턴스.
- Dual-Track Protocol / hermes-loop — dual-layer bank의 vault 원본.
- [Self-Improving Coding Agent (SICA) — DGM·HGM 의 공통 조상](self-improving-coding-agent-sica.md) — correctness-first 랭킹·greedy 아카이브 정합.
- [기억 성숙도 3층 (Memory Maturity 3-Layer)](../methods/memory-maturity-3layer.md) — 경험→능력 판정(bank의 성숙도 축).
- [Context Engineering — 5 역할 분류 + 구현계획 컴파일러](../methods/context-engineering-five-roles.md) — 6차원 중 D1/D5와 겹치는 컨텍스트 역할 분해.
