---
created: 2026-07-18
updated: 2026-07-18
type: learning
category: technique
source: https://github.com/humanlayer/12-factor-agents
authors: [Dex, HumanLayer]
tags: [agent-architecture, determinism, control-flow, agent-harness, manifesto]
---
<!-- 12-factor-agents 해체 — 프로덕션 LLM 앱 설계 선언문. vault 가 이미 앞선 자료, 순수 delta 는 F5 하나 -->
# 12-Factor Agents — 프레임워크 회의론 선언문 (vault 이미 앞섬, delta=F5)

*Dex / HumanLayer — github.com/humanlayer/12-factor-agents*

Heroku "12-factor app" 네이밍을 차용한 프로덕션 LLM 앱 설계 *선언문*. 실증·벤치마크 0의 현장 경험칙 코드화. 반발 대상 = "LLM 판단→툴 실행→반복" 단순 루프 + "프레임워크가 builder 를 80%에 가두고 그 이상은 리버스엔지니어링을 요구"한다는 관찰.

## 한 줄
> 프롬프트·컨텍스트·제어흐름을 프레임워크에 넘기지 말고 개발자가 소유하라. LLM 은 결정론 코드의 *엣지*에서만 구조화 JSON 을 뱉는 조각이어야 한다. — **vault 가 이미 이 방향을 헌법 규율로 집행 중이라, 새 지평이 아니라 외부 확인서**.

## 무엇을 쳐냈나 (12 중 10 — vault 가 동등 이상)

| Factor | 쳐낸 이유 (vault 선행) |
|---|---|
| F1 NL→Tool · F4 Tools=structured output · F8 Own control flow · F12 Stateless reducer | [Deterministic Core, Fuzzy Edge — 안티슬롭 아키텍처 원칙](../methods/deterministic-core-fuzzy-edge.md) 가 "markdown 느슨/code 시끄러움 → 빠진 층=명시적 행동 MODEL"까지 더 깊음. 12-factor 는 "결정 로직 명시하라" 수준에서 멈춤. (F12 reducer = 유용한 *이름*일 뿐, 개념은 이미 보유) |
| F2 Own prompts · F3 Own context window · F9 Compact errors | RTK·Progressive Disclosure 가 헌법 §4 로 매 세션 *강제*. [Context Engineering — 5 역할 분류 + 구현계획 컴파일러](../methods/context-engineering-five-roles.md) 보유. 12-factor 는 원칙 언급, vault 는 운영 규율 |
| F7 Contact humans as tool call | §5 HITL 철칙 + §5.6 상신 4부 + §5.7 자율 3-레인 + [Building Effective Human-Agent Teams — 인간-에이전트 협업 팀 구축 방법론](../methods/building-effective-human-agent-teams.md) 이 훨씬 정교 |
| F10 Small agents · F11 Trigger anywhere | 흔한 원칙 / "토픽별 자동 진입점" 표가 이미 다중진입 라우터 |

## 진짜 delta (흡수분)

- **F5 — Unify execution state & business state (HIGH, 흡수)**: 에이전트 워크플로 상태와 앱 도메인 데이터를 *두 갈래로 두지 말고 한 갈래로*. vault 에 이 명제의 명시 노드가 없었음. 게임 NPC 설계에 직결 — [Deterministic Core, Fuzzy Edge — 안티슬롭 아키텍처 원칙](../methods/deterministic-core-fuzzy-edge.md) 게임 매핑(world/quest/memory 상태)과 ai-npc-blueprint Layer 5 열린 과제("세계 상태 영향 범위 제한")가 바로 이 통합 문제. *실행 상태를 별도 저장소에 분리하면 재개·리플레이 시 두 상태가 어긋난다*는 게 핵심 실패 모드.
- **F6 — Launch/Pause/Resume API (MEDIUM, park PK-008)**: 중단/재개해도 진행 안 잃는 durable 계약. [Loop Engineering (Addy Osmani & Neyzis) — 프롬프터에서 루프 디자이너로 가는 14단계 로드맵](../methods/loop-engineering.md) 에 durable 언급은 있으나 pause/resume *API 계약* 각도는 약함. 즉시 반영처 없어 파킹.

## 내 생각 — 선행 지향
결정성·context 소유·human-in-loop 세 축 전부 **vault 가 12-factor 보다 앞서 있다**. 12-factor 는 "이렇게 해라" 원칙에서 멈추지만 vault 는 강제 규율·게이트·4부 골격으로 체화해 집행한다. 이 자료의 가치는 신규 지식이 아니라 *vault 방향이 외부 프로덕션 현장과 수렴함을 확인*하는 것 + F5 하나. 통짜 흡수는 트레드밀(10/12 기보유) — 그래서 쳐냈다.

## 한계
- 실증 0 — 벤치마크·수치 없는 선언문(paper-study 안티패턴: "증거 없이 뛰어나다" 금지 대상).
- 내부 개념 중복 — "12"는 Heroku 오마주로 맞춘 억지. F1≈F4, F8≈F12. 실질 서로 다른 개념 7~8개.
- 시점 낡음 — "프레임워크 80% 천장" 관찰은 2024~25 시점, 2026 harness/skill 생태계엔 부분적으로 지남.

## 연결
- [Deterministic Core, Fuzzy Edge — 안티슬롭 아키텍처 원칙](../methods/deterministic-core-fuzzy-edge.md) — 결정성 축(F1/4/8/12)의 vault 선행 정본 + F5 반영 후보
- [Context Engineering — 5 역할 분류 + 구현계획 컴파일러](../methods/context-engineering-five-roles.md) — context 소유 축(F2/3/9)
- [Building Effective Human-Agent Teams — 인간-에이전트 협업 팀 구축 방법론](../methods/building-effective-human-agent-teams.md) — human-as-tool-call 축(F7)
- [Loop Engineering (Addy Osmani & Neyzis) — 프롬프터에서 루프 디자이너로 가는 14단계 로드맵](../methods/loop-engineering.md) — F6 durable/resume 반영 후보
- ai-npc-blueprint — Layer 5 세계 상태 통합(F5 적용지)
- agent-harness — 리플레이 가능 순회(F6 인접)

## 다음 학습 후보
- **HumanLayer 실제 SDK/코드** — 선언문 말고 구현체를 봐야 F5/F6 계약이 실물로 어떻게 생겼는지 확인 가능
- **durable execution (Temporal / Inngest)** — F6 pause/resume 의 성숙한 인프라 선행 사례
- **event-sourcing / CQRS** — F5 unify-state 의 정통 데이터 패턴 계보
