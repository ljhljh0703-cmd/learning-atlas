---
created: 2026-04-28
updated: 2026-06-17
type: learning
category: techniques
source: https://github.com/666ghj/MiroFish
authors: [666ghj]
year: 2026
tags: [multi-agent, simulation, swarm, generative-agents, oasis, graphrag, zep, vision-b]
---

# MiroFish + OASIS — 거대 시뮬레이션 세계 reference architecture

> *"거대한 시뮬레이션 세계 구축"* (작가 비전 B 갈래) 의 **production-ready** 참조 아키텍처.
> hwigi-tower (비전 A, 모바일 게임 1 NPC) 와 명확히 분리. v2 / 별도 프로젝트의 학습 자산.

> **🔬 2026-06-17 재해체 (depth pass)**: 2026-04-28 초판은 services 모듈을 *표 한 줄씩* 으로 요약했으나, 공식 repo 통독(`backend/` ~16k LOC Python) 결과 각 모듈이 200~2,572줄짜리 *독자 에이전트 파이프라인* 임이 확인됨. "MiroFish=wrapper" 명제는 **부분 정정** — OASIS 가 시뮬 엔진인 건 맞지만, MiroFish 는 그 위에 *seed→persona→config→run→report* 자동화 에이전트 층을 독자 구현. §2~4 가 그 심화. 한국 페르소나 응용 골격은 mirofish-korean-sim-blueprint.

---

## 1. 위치 (의존성 스택)

```
[Application — MiroFish, similar wrappers]
         ↓
[Simulation Engine — OASIS (CAMEL-AI)]
         ↓
[Memory — Zep Cloud / Generative Agents (Park+2023)]
         ↓
[LLM — Qwen / GPT / Claude]
```

**MiroFish 자체는 wrapper**. 학습 가치의 70% 는 **OASIS** 에 있다.

---

## 2. MiroFish 아키텍처 (services 레이어 — 실측 LOC)

`backend/app/services/` (clone 통독 2026-06-17, `camel-oasis==0.2.5`·`camel-ai==0.2.78`·`zep-cloud==3.13.0`):

| 모듈 | LOC | 역할 | 실측 핵심 |
|------|-----|------|----------|
| `text_processor` | 71 | seed 자료 처리 | LLM-friendly chunk |
| `ontology_generator` | 506 | 엔티티·관계·속성 추출 | NER+RE → PascalCase 스키마 → **graphiti 용 Python 클래스 코드 생성**(`generate_python_code`) |
| `graph_builder` | 506 | GraphRAG/Zep 그래프 구축 | `set_ontology`→`add_text_batches`→episode 대기 |
| `oasis_profile_generator` | 1,205 | 엔티티→OASIS 페르소나 | **개인/집단 분리**(`_is_individual`/`_is_group`), Zep 검색 enrich, LLM 페르소나+rule-based fallback, reddit JSON/twitter CSV 저장 |
| `simulation_config_generator` | 991 | 시뮬 hyperparameter **자동 생성** | `TimeSimulationConfig`·`EventConfig`·`PlatformConfig`·agent activity — LLM 이 시뮬 설계 |
| `simulation_runner` | 1,768 | OASIS 실행 + **INTERVIEW** | subprocess 관리(`Popen`·signal·`_monitor`)·action log IPC·단건/배치/전체 인터뷰·env lifecycle |
| `simulation_manager` | 529 | 오케스트레이션 | `prepare_simulation` = 엔티티→profile→config 파이프 |
| `simulation_ipc` | 394 | 프로세스 간 통신 | front ↔ runner subprocess |
| `zep_graph_memory_updater` | 554 | Zep 메모리 피드 | **action→자연어 episode 직렬화**(워커 스레드 배치) |
| `zep_entity_reader` / `zep_tools` | 437 / 1,736 | Zep 읽기·도구 | report agent 의 검색 백엔드 |
| `report_agent` | 2,572 | 사후 분석 | **풀 ReAct 에이전트**(plan→섹션별 Thought-Action-Observation, 도구 4종) |

**Pattern**: *seed → ontology → graph → personas → config → simulation(OASIS) → report*. 매 단계 LLM 호출.

### 2.1 초판이 놓친 5대 발견 (코드 확증)

1. **`report_agent` = 풀 ReAct 에이전트** (≠ 단순 리포트). 아웃라인 plan → 섹션마다 ReAct 루프(`max_iterations=5`, `min_tool_calls=3`), 도구 `{insight_forge, panorama_search, quick_search, interview_agents}`. 🔑 리포트 작성 중 **살아있는 시뮬 agent 를 인터뷰**해 주장을 grounding(시뮬↔리포트 피드백 루프).
2. **"신의 시점 변수 주입" 의 실체 = `EventConfig`**: `initial_posts`(시드 게시물)·`scheduled_events`(특정 timestep 강제 투입)·`narrative_direction`(여론 유도 방향)·`hot_topics`.
3. **창발이 부분적으로 *스크립트된 입력*** = `PlatformConfig`: `echo_chamber_strength=0.5`·`viral_threshold=10`·추천알고리즘 가중치(`recency/popularity/relevance`). → **MP1("시뮬은 도구지 결과 아니다")에 코드 증거**: emergence 가 순수 자생이 아니라 일부 연출. 결과 해석 시 critical.
4. **Zep 메모리 피드 = action→자연어 직렬화**: 각 소셜 행동(`CREATE_POST`/`LIKE`/`REPOST`/`FOLLOW`/`MUTE`…)을 `"agent명: 활동묘사"` 문장으로 변환해 Zep 주입. 코드 주석 명시 — *"模拟 prefix 안 붙임 → 그래프 오도 방지"*(Zep 이 실제 사건처럼 엔티티 추출하게 하는 fidelity 트릭).
5. **페르소나에 group/faction 단위 존재**: 엔티티가 개인일 수도 집단(파벌)일 수도. 초판은 개인만 가정.

### 2.2 실행 골격 (OASIS 호출 — `run_twitter_simulation.py` 실측)

```python
# 1) 페르소나 CSV 로드 → agent graph
agent_graph = await generate_twitter_agent_graph(
    profile_path=csv,                 # user_id,name,username,user_char,description
    model=model,
    available_actions=AVAILABLE_ACTIONS,  # CREATE_POST,LIKE_POST,REPOST,FOLLOW,DO_NOTHING,QUOTE_POST
)
# 2) 환경 생성
env = oasis.make(agent_graph=agent_graph, platform=TWITTER,
                 database_path=db, semaphore=30)  # 동시 LLM 30 캡
await env.reset()
# 3) 초기 이벤트 주입(=시드/A안/B안)
await env.step({agent: ManualAction(CREATE_POST, {"content": seed})})
# 4) 라운드 루프 — 시뮬 시계(day/hour)로 active agent 선별
for round in range(total_rounds):
    active = active_agents_for(hour, round)
    await env.step({a: LLMAction() for a in active})
# 5) 신의 시점 질의(상태 변경 X)
await env.step({agent: ManualAction(INTERVIEW, {"prompt": q})})
await env.close()
```

- **`user_char`** = 페르소나 전체가 LLM 시스템 프롬프트로 주입되는 필드 = *페르소나를 갈아끼우는 단일 접합부* (mirofish-korean-sim-blueprint 의 한국화 지점).
- **`LLMAction()`** = agent 가 자율 행동 / **`ManualAction(...)`** = 운영자(신의 시점)가 강제 행동.
- **`INTERVIEW`** = 시뮬 상태를 바꾸지 않고 특정 agent 에 질문→DB 결과 = A/B·여론조사의 핵심 프리미티브.

### 2.3 [시뮬레이션 구축 Building Blocks (체크리스트)](../methods/simulation-building-blocks.md) 매핑 (현재 지식 렌즈)

| MiroFish 구현 | sim-블록 |
|---|---|
| `SimulationRunState` + action log DB | #1 단일 상태 SSOT |
| 라운드 루프 + 시뮬 시계 active 선별 | #2 결정론 턴 루프 |
| `PlatformConfig`(추천·echo·viral) | #3 세계 규칙 엔진 + #12 창발 사회 |
| `user_char` 주입 ↔ action 결과 | #4 데이터↔표현 분리 |
| `AVAILABLE_ACTIONS`(액션만 세계 영향) | #9 Tools-as-only-interface 🌟 |
| episode 직렬화 → Zep bi-temporal | #11 다층 인지/정체성 앵커 |
| `report_agent` 메트릭·인터뷰 | #13 측정 (점수판) |

---

## 3. OASIS (CAMEL-AI) — 진짜 학습 대상

→ **별도 deep-dive: [OASIS: Open Agent Social Interaction Simulations with One Million Agents](oasis.md)** (2026-04-28 작성)

요약:
- *소셜 미디어 (Twitter/Reddit)* 특화 시뮬레이터. 일반 에이전트 프레임워크 X
- **1M agents** 스케일 (논문 arXiv 2411.11581 검증)
- generative-agents (Park+2023) 의 *직계 후속이 아니라 상호 보완* — Park = town/depth, OASIS = social media/breadth
- PettingZoo style API, `pip install camel-oasis`
- INTERVIEW 액션 등 hwigi-tower 휴식 노드와 정합 가능 패턴 보유
- **CUBE** (echo-yiyiyi/cube) — Unity3D + OASIS 후속 연구. hwigi-tower v2 통합 경로

마감 후 첫 실험 + 학습 큐 8 단계 + 미리 준비 체크리스트는 [OASIS: Open Agent Social Interaction Simulations with One Million Agents](oasis.md) 참조.

---

## 4. Zep / Graphiti — LLM 메모리 인프라

→ **별도 deep-dive: [Zep / Graphiti — Temporal Knowledge Graph for Agent Memory](zep-graphiti.md)** (2026-04-28 작성, arXiv 2501.13956 정독)

정정 (이전 페이지의 부정확한 표현 교정):
- ~~"LLM 메모리 SaaS"~~ → **Zep** = SaaS, **Graphiti** = 그 하단 오픈소스 KG 엔진 (github.com/getzep/graphiti, Apache 2.0). 학습 가치는 Graphiti 에 있다.
- ~~"reflection·retrieval 기능을 클라우드로 외주"~~ → 정확히는 *3-tier KG (episodic/semantic/community) + bi-temporal model (T 사건 vs T' 입수) + edge invalidation*. Park+2023 의 production-grade 진화형이지 단순 외주 X.

핵심 차별점:
- **Bi-temporal model**: 4 timestamp (t'_created / t'_expired / t_valid / t_invalid). 상대 시간 처리.
- **Edge invalidation**: 모순 fact 검출 시 LLM 으로 자동 무효화. **마타이오스 망각 narrative 의 기술적 동치**.
- **벤치마크**: LongMemEval +18.5% acc / -90% 지연 (gpt-4o)

**hwigi-tower 와의 충돌**: D-005 on-device 정책 위배 (Neo4j + 클라우드 LLM).
**자체 호스팅 가능**: Neo4j Community + BGE-m3 (무료) + 호환 LLM. v2 / 비전 B 영역.
**비전 B 적용**: OASIS 의 1000+ agents × 영구 메모리 = OASIS + 자체 호스팅 Graphiti.

---

## 5. 작가 비전 두 갈래의 분리

| 갈래 | 작품 | 기술 스택 | 시뮬레이션 단위 | 메모리 |
|------|------|----------|---------------|-------|
| **A. 모바일 게임** | hwigi-tower (Flick 출품) | Unity + on-device LLM | 1 NPC × 13 회차 | SQLite local |
| **B. 거대 시뮬레이션** | 미정 (v2) | OASIS + Zep + GraphRAG | 수백~수천 agents | Zep Cloud |

ai-npc-vision = 두 갈래의 *공통 철학*.
ai-npc-blueprint = 두 갈래의 *공통 기술 layer* (1-3) + B 갈래 전용 layer (4-5).

본 페이지 = B 갈래 layer 4-5 의 production 참조.

---

## 6. 작가 비전 B 의 작품 가능성 (브레인스토밍)

MiroFish 데모가 보여주는 것:
- **武大 여론 시뮬레이션** — 진지한 prediction
- **홍루몽 잃어버린 결말 시뮬레이션** — *서사적 시뮬레이션*

작가 정체성(identity) 과 매칭되는 갈래는 **서사적 시뮬레이션**:
- 한국 고전·근대 문학의 *대안 결말* 시뮬레이션 (예: 무정의 박영채가 동경 안 갔다면)
- 작가 본인의 초파리 세계관 시뮬레이션 (배금주의 인물의 1000 가지 분기)
- *영겁회귀 사고실험* — 같은 인물이 무한 회차에서 어떻게 변용되는가 (마타이오스의 거대 버전)

**모두 v2 영역**. 21일 후, Flick 결과 후 검토.

---

## 7. hwigi-tower 직접 차용 평가

| 컴포넌트 | 21일 MVP | 사유 |
|---------|---------|------|
| OASIS multi-agent | ❌ | D-007 (1 NPC 고정) 위배 + 스코프 폭발 |
| Zep Cloud | ❌ | D-005 (on-device) 위배 + 비용 |
| GraphRAG | ❌ | 메모리 파편 5개 = 임계 미달 |
| ontology_generator 패턴 | 🟡 | 5개라 인간 수동이 더 빠름 |
| ReportAgent 패턴 | 🟡 | W3-1 폴리싱 시 회차 통계 리포트 응용 가능 |
| simulation_runner IPC 패턴 | ❌ | Unity main thread 모델과 부정합 |

**결론**: hwigi-tower 에 기술 차용 X. **단**, OASIS 가 [Generative Agents (Park et al. 2023) — AI NPC의 성경](generative-agents.md) 의 production 구현이라는 사실을 NPC 청사진의 권위 출처로 인용 가능.

---

## 8. 다음 학습 후보 (우선순위)

1. ~~**OASIS repo 단독**~~ → ✅ 완료, [OASIS: Open Agent Social Interaction Simulations with One Million Agents](oasis.md) (2026-04-28)
2. **CUBE** (echo-yiyiyi/cube) — Unity3D + OASIS 후속 연구. **hwigi-tower v2 합류 경로**
3. ~~**Zep 의 temporal knowledge graph**~~ → ✅ 완료, [Zep / Graphiti — Temporal Knowledge Graph for Agent Memory](zep-graphiti.md) (2026-04-28)
4. ~~**GraphRAG (Microsoft)**~~ → ✅ 완료, [Microsoft GraphRAG — Query-Focused Summarization on Narrative Private Data](graphrag.md) (2026-04-28) — Graphiti 의 부모, 시뮬레이션 종료 후 report 단계 적용
5. **CAMEL-AI 의 다른 프로젝트** — agent communication protocols
6. **MultiAgent4Collusion / MultiAgent4Fraud** — OASIS 응용 후속 연구

---

## 9. 출처

- MiroFish: github.com/666ghj/MiroFish (Shanda Group 후원, 2026)
- 데모: bilibili 武大 여론 + 홍루몽 결말 영상
- 의존: OASIS (CAMEL-AI), Zep Cloud, Qwen-plus (Alibaba)
- 학습 일자: 2026-04-28
- 트리거: 작가가 "거대한 시뮬레이션 세계 구축" 비전을 명시적으로 선언한 시점
