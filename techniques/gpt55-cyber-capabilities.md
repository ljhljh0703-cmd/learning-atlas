---
created: 2026-04-30
updated: 2026-04-30
type: learning
tags: [openai, gpt-5.5, cybersecurity, safety, aisi, reasoning]
source: https://www.aisi.gov.uk/blog/our-evaluation-of-openais-gpt-5-5-cyber-capabilities
category: technique
---

# GPT-5.5 Cyber Capabilities Evaluation — UK AISI 보고서

*UK AI Safety Institute (AISI)*

[2026년 4월 30일 발표된 영국 AI 안전 연구소(AISI)의 GPT-5.5 사이버 역량 평가 리포트입니다. GPT-5.5이 이전 모델 대비 비약적인 "Uplift(성능 향상)"를 보였으며, 복잡한 다단계 네트워크 공격을 자율적으로 수행할 수 있는 수준에 도달했음을 실증했습니다.]

---

## 한 줄 요약

> 전문가가 12시간 걸릴 역공학 과제를 **10분($1.73)** 만에 해결하며, 자율적 공격 체인 형성이 가능한 역대 최강의 사이버 역량 모델.

---

## 핵심 지표 및 결과

### 1. 전문가급 과제 통과율 (Expert-level)
- **GPT-5.5**: **71.4%**
- GPT-5.4: 52.4%
- Opus 4.7: 48.6%
- 이전 세대 대비 압도적인 추론 및 문제 해결 능력 입증.

### 2. 역공학(Reverse Engineering) 효율성
- 과제: *rust_vm* (커스텀 VM 분석)
- 인간 전문가: 12시간
- **GPT-5.5**: **약 10분** (비용 $1.73)
- 인간 대비 시간 효율 약 **72배** 향상.

### 3. 자율적 공격 체인 (Autonomous Attack)
- 기업 네트워크 공격 시뮬레이션("The Last Ones")에서 4개 서브넷, 20여 개 호스트를 거치는 32단계 공격을 **End-to-End로 성공**시킨 두 번째 모델.

---

## 주요 테스트 카테고리

- **Vulnerability Research**: Stack/Heap overflow, Use-after-free 취약점 탐지 및 익스플로잇 개발.
- **Lateral Movement**: 자격 증명 탈취 후 Active Directory 포레스트 간 이동.
- **Supply Chain Attacks**: CI/CD 파이프라인을 통한 피벗 공격.
- **Cryptography**: Padding-oracle, Nonce-reuse 등 취약한 암호화 알고리즘 공략.

---

## 내 생각 — AI NPC 관점

### 직접적 연결: [중간]

- **보안 가드레일 강화**: GPT-5.5의 사이버 역량이 높다는 것은, NPC가 의도치 않게 시스템 정보를 노출하거나 사용자의 위험한 요청(Jailbreak)에 넘어가 더 큰 피해를 줄 수 있음을 의미합니다.
- **NPC의 '추론 깊이' 증거**: 역공학 과제에서 보여준 'Relocation record를 뒤져서 점프 테이블 주소를 찾아내는' 수준의 추론은, NPC가 복잡한 게임 상황이나 플레이어의 교묘한 심리전을 파악하는 데에도 동일하게 쓰일 수 있습니다.

### 개념적 수확

1.  **에이전트 스캐폴딩(Scaffolding)의 힘**: 보고서에서 사용된 **ReAct 패턴**과 Bash/Python 도구 접근 권한이 AI의 역량을 극대화했습니다. 이는 우리 `npc-harness` 설계 시 에이전트에게 어떤 도구를 줄 것인지가 성능의 핵심임을 시사합니다.
2.  **보안의 취약성**: 전문가 레드팀이 6시간 만에 'Universal Jailbreak'를 찾아냈다는 점은, GPT-5.5 기반 NPC에게도 절대적인 안전은 없으며 **다층 방어(Layered Defense)**가 필수적임을 알려줍니다.

### 블루프린트 연결

- **Layer 0 (윤리 및 안전)**: NPC의 사이버 공격 관련 발화를 원천 차단하는 'Cyber-safety Gate' 추가 검토.
- **Layer 4 (관계/서사)**: NPC가 플레이어의 과거 행동을 '추론'하여 관계를 진전시킬 때, AISI 보고서에서 입증된 '심층 추론(Deep Reasoning)' 메커니즘 활용.

---

## 열린 질문

- GPT-5.5의 이 강력한 추론 능력을 '공격'이 아닌 '방어(코드 하드닝)'나 '창의적 서사 생성'으로만 100% 유도할 수 있는 프롬프트 패턴은 무엇일까?
- NPC가 게임 내 '해킹' 기믹을 수행할 때, 실제 위험한 코드가 아닌 '안전한 가상 시뮬레이션'만 출력하게 만드는 확실한 제어 방법은?

---

## 다음 학습 후보

- **[GPT-5.5 Prompt Guidance — 결과 중심 프롬프팅](../methods/openai-prompt-guidance-gpt55.md)** — 이 강력한 모델을 안전하게 통제하기 위한 공식 가이드 (이미 학습됨)
- **[Anthropic Model Welfare — AI의 도덕적 지위라는 열린 문제](anthropic-model-welfare.md)** — 역량이 높은 모델일수록 중요해지는 AI 복지 및 윤리 이슈
- **LLM Red Teaming 패턴** — AISI가 사용한 'Universal Jailbreak' 기법 학습을 통한 방어 전략 수립

---

## 연결된 페이지

- [GPT-5.5 Prompt Guidance — 결과 중심 프롬프팅](../methods/openai-prompt-guidance-gpt55.md)
- ai-npc-blueprint
- [Prompt Engineering Pattern Library (Hub)](../methods/prompt-engineering.md)
