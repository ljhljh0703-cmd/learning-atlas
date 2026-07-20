---
created: 2026-07-04
updated: 2026-07-04
type: learning
category: method
source: https://www.youtube.com/watch?v=uMvTAF280so
authors: [David Khourshid]
year: 2026
tags: [determinism, anti-slop, agent-architecture, ssot, state-machine, ai-agent, agent-harness]
---
<!-- 결정적 코어 / 퍼지 엣지 — AI slop 을 "신뢰할 모델 없는 코드"로 재정의하는 아키텍처 원칙 노트 -->
# Deterministic Core, Fuzzy Edge — 안티슬롭 아키텍처 원칙

> 출처: David Khourshid "Beyond the Prompt: Goodbye slop; welcome determinism" (AG Grid, 2026-06-26). Codex 해체분석 → ③Gate PASS.
> ⚠ 자막 자동생성(한국어 429 실패). 슬라이드·데모 코드 미감사. **XState/Stately 언급 = 화자 컨텍스트(미감사) — 라이브러리로 채택 X**(출처도 동의: 혼란·위험·반복 드리프트 있는 곳에만 형식 모델 적용).

## 한 줄
판단·상태·불변식·전이를 **명시적 결정론 모델**이 소유하고, LLM 은 언어·해석·초안·퍼지 평가가 진짜 필요한 *엣지*에서만 호출한다. slop 은 모델 지능 문제가 아니라 *구조 없는 위임* 문제다.

## 진짜 델타 (기존 노드가 안 덮는 것)
- **markdown 은 너무 느슨하고 code 는 너무 시끄럽다 → 빠진 층 = 명시적 행동 MODEL.** markdown=의도엔 좋지만 실행 제어흐름엔 부적합 / code=실행되지만 의도가 배관·프레임워크·우발복잡성에 묻힘 / model=상태·사건·합법전이·불변식의 구조 표현(양쪽에 브릿지). `AGENTS.md`·`SKILL.md`·워크플로가 필요조건이나, *반복 오독되는 고위험 절차*는 산문만으로 두지 말고 작은 state/event 모델을 노출해야 한다.
- **slop = "신뢰할 모델 없는 코드"** — 도메인 경계 불명확, 불변식이 흩어진 조건문에 암묵 잠복, 상태 검사 불가, 행동이 UI·네트워크·저장·프롬프트에 분산, 변경이 지도 없는 추측.
- **아키텍처 반전**: LLM 을 워크플로 라우터로 두지 말라. *결정론 프로그램이 워크플로를 소유*하고 비결정이 마땅한 지점에서만 LLM 을 호출한다.

## 수입할 실패 모드
- **One-shotting** — 중간 모델·리뷰 상태를 건너뛰고 프롬프트→최종 산출로 직행.
- **Prose control flow** — 다수의 `must`/`should`/`never`/`only if` 산문 규칙을 실행 워크플로처럼 에이전트에 따르게 함.
- **Agent-as-system** — 결정론 조정층 없이 에이전트만 늘림.
- (부속) 관심사 얽힘 / context-window fallacy(지시 많음≠구조) / compounding slop(틀린 가정이 다음 생성의 선례가 됨).

## 게임 NPC 매핑
결정론: world/quest/memory 상태, 위치·시간·인벤·소셜그래프 갱신, 합법 행동·쿨다운, 퀘스트 진행, 메모리 쓰기 정책, 리플레이·평가 트레이스. 퍼지 엣지(LLM): 대사 표현, 플레이어 의도 해석, 반성적 요약, 계획 제안, 감정 톤 선택. **LLM 이 정본 상태 전이를 조용히 소유하게 두지 말 것.**

## 연결
- agent-harness — §"P2 Deterministic Core"(결정적 순회·seeded 해시·JSON 일치)는 *리플레이 가능 그래프 순회* 결정성 — 본 노트의 아키텍처 원칙(모델이 상태·전이를 소유)과 **별개 축**. 서로 보완.
- [Loop Engineering (Addy Osmani & Neyzis) — 프롬프터에서 루프 디자이너로 가는 14단계 로드맵](loop-engineering.md) — 루프 *오케스트레이션*(게이트·Ralph Wiggum·durable) counterpart. 본 노트는 그 루프 *내부* 판단/상태 배치 원칙.
- [GBrain — 개인 AI 지식 브레인 production 정본](../techniques/gbrain.md) §3 "latent vs deterministic" — 같은 이분법의 다른 어휘(지능=latent, 신뢰=deterministic).
- ai-npc-blueprint Layer 5 — 세계 상태 영향 범위 제한 열린 과제.
- [12-Factor Agents — 프레임워크 회의론 선언문 (vault 이미 앞섬, delta=F5)](../techniques/12-factor-agents.md) F5 — "실행 상태와 비즈니스 상태를 한 갈래로" = 본 노트 게임 NPC 매핑(world/quest/memory 상태 통합)의 외부 확인. 결정성 축(F1/4/8/12)은 본 노트가 더 깊음.
