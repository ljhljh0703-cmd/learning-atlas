---
created: 2026-04-28
updated: 2026-04-28
type: learning
category: techniques
source: https://github.com/camel-ai/oasis
tags: [oasis, multi-agent, simulation, camel-ai, social-media, gym, pettingzoo, vision-b]
---

# OASIS: Open Agent Social Interaction Simulations with One Million Agents

> 작가 비전 B (거대 시뮬레이션) 의 **핵심 엔진**. 미리 세팅 — hwigi-tower 마감 직후 실행 가능 상태.

---

## 1. 정체성 — 무엇이고 무엇이 아닌가

| 차원 | OASIS 의 위치 |
|------|--------------|
| ✅ **이다** | LLM 에이전트 기반 **소셜 미디어** (Twitter/Reddit) 시뮬레이터 |
| ✅ **이다** | 1M agents 까지 스케일하는 사회적 emergence 연구 도구 |
| ✅ **이다** | PettingZoo style multi-agent gym 인터페이스 |
| ✅ **이다** | SQLite + 추천시스템 + 23 actions 의 *production* 패키지 (`pip install camel-oasis`) |
| ❌ **아니다** | 일반 multi-agent 시뮬레이션 프레임워크 (소셜 미디어 도메인 특화) |
| ❌ **아니다** | generative-agents (Park+2023) 의 직계 후속 — 두 작품은 **상호 보완** (Park = town, OASIS = social media) |
| ❌ **아니다** | Unity/게임 엔진 통합 (그건 후속 CUBE 가 담당) |

**정확한 한 줄**: *"Twitter·Reddit 스케일의 LLM 에이전트 사회를 SQLite + 추천시스템 + 23 행동 으로 재현하는 1M-agent gym."*

---

## 2. 논문 메타

- **제목**: OASIS: Open Agent Social Interaction Simulations with One Million Agents
- **arXiv**: 2411.11581 (2024-11-19 게재)
- **저자**: Yang, Zhang, Zheng et al. (32명, CAMEL-AI + Oxford — *Bernard Ghanem, Philip Torr* 포함)
- **소속**: CAMEL-AI / Shanghai AI Lab / KAUST / Oxford 등 다국 협력
- **License**: Apache 2.0

---

## 3. 아키텍처 (실 모듈 분해)

```
oasis/
├── social_agent/
│   ├── agent.py              # 개별 SocialAgent
│   ├── agent_action.py       # 23 ActionType 정의
│   ├── agent_environment.py  # agent 가 보는 환경 (피드·알림)
│   ├── agent_graph.py        # 사회 네트워크 그래프 (follow 관계)
│   └── agents_generator.py   # 페르소나 → agent 일괄 생성
│
├── social_platform/
│   ├── platform.py           # Twitter/Reddit clone 본체
│   ├── database.py           # SQLite (posts, comments, follows...)
│   ├── recsys.py             # 추천: interest-based + hot-score
│   ├── channel.py            # async 메시지 채널
│   ├── process_recsys_posts.py
│   └── schema/, config/
│
├── environment/              # RL gym wrapper (env.reset, env.step)
├── clock/                    # timestep 관리
└── testing/
```

**핵심 추상**:
- `agent_graph` = (agents, follow edges)
- `oasis.make(agent_graph, platform, db_path)` → `env`
- `await env.reset()` → 초기 상태
- `await env.step({agent: action_or_LLMAction()})` → 1 timestep 진행
- `LLMAction()` (자율) vs `ManualAction(action_type, args)` (수동 제어)

---

## 4. Action Space 23개 (agent_action.py)

LIKE_POST, DISLIKE_POST, CREATE_POST, CREATE_COMMENT, LIKE_COMMENT, DISLIKE_COMMENT, SEARCH_POSTS, SEARCH_USER, TREND, REFRESH, DO_NOTHING, FOLLOW, UNFOLLOW, MUTE, REPOST, QUOTE, INTERVIEW (★ NPC 와 1:1 대화), GROUP_CHAT, REPORT (부적절 콘텐츠 신고), ...

★ **INTERVIEW** action — agent 에게 직접 질문을 던져 답을 받음. **hwigi-tower 의 휴식 노드 NPC 대화와 정합**. v2 합류 시 직접 차용 가능.

---

## 5. Quick Start (실제 코드, README 인용)

```python
import asyncio, os, oasis
from camel.models import ModelFactory
from camel.types import ModelPlatformType, ModelType
from oasis import ActionType, LLMAction, ManualAction, generate_reddit_agent_graph

async def main():
    model = ModelFactory.create(
        model_platform=ModelPlatformType.OPENAI,
        model_type=ModelType.GPT_4O_MINI,
    )
    available_actions = [
        ActionType.LIKE_POST, ActionType.CREATE_POST, ActionType.CREATE_COMMENT,
        ActionType.FOLLOW, ActionType.SEARCH_POSTS, ActionType.DO_NOTHING, # ...
    ]
    agent_graph = await generate_reddit_agent_graph(
        profile_path="./data/reddit/user_data_36.json",
        model=model,
        available_actions=available_actions,
    )
    env = oasis.make(agent_graph=agent_graph,
                     platform=oasis.DefaultPlatformType.REDDIT,
                     database_path="./reddit_simulation.db")
    await env.reset()

    # Step 1: 수동 시드 (특정 agent 가 특정 action)
    await env.step({
        env.agent_graph.get_agent(0): [
            ManualAction(ActionType.CREATE_POST, {"content": "Hello, world!"}),
        ],
    })

    # Step 2: 모든 agent 가 LLM 자율 결정
    await env.step({a: LLMAction() for _, a in env.agent_graph.get_agents()})

    await env.close()

asyncio.run(main())
```

설치: `pip install camel-oasis` + `OPENAI_API_KEY` 환경변수.

---

## 6. 비용 추정 (Qwen-plus, 2024-12 기준)

| 모델 | 100 agents | 1,000 | 10,000 |
|------|-----------|------|--------|
| qwen-plus | ¥0.027 (~$0.004) | ¥0.27 | ¥2.68 |
| qwen-max | ¥0.717 | ¥7.17 | ¥77.17 |

(1 timestep, activation prob 0.1 기준. 100 agents × 1 step 입력 ≈ 335K 토큰 / 출력 16K)

→ **솔로 실험 가능 수준**. 1만 agents × 10 steps = ~$0.4 (qwen-plus). gpt-4o-mini 환산 시 약 5-10배.

---

## 7. CUBE — Unity3D 합류 경로 ★

OASIS follow-up research 중:

- **[CUBE](https://github.com/echo-yiyiyi/cube)** — *"dynamic simulations in customized unity3D-based environments"*
- **[MultiAgent4Collusion](https://github.com/renqibing/MultiAgent4Collusion)** — 사회적 collusion (담합)
- **[MultiAgent4Fraud](https://github.com/zheng977/MutiAgent4Fraud)** — 금융 사기

**CUBE 의 의미**: hwigi-tower 가 Unity 라는 사실과, OASIS 가 Python-only 라는 사실 사이의 **bridge**. CUBE 가 그 bridge 패턴을 이미 구현. v2 단계에서 hwigi-tower 의 마타이오스 1 NPC 를 OASIS 의 1 agent 로 격하시키고, 다른 N agents 를 사회적 배경으로 추가하는 경로가 열린다.

**우선순위**: hwigi-tower 마감 후 → OASIS 단독 실험 → CUBE 코드 분석 → hwigi-tower 후속작 시 통합 검토.

---

## 8. generative-agents (Park+2023) vs OASIS 비교

| 차원 | Park+2023 | OASIS |
|------|----------|-------|
| 환경 | town (25 NPC, 6개 위치) | Twitter/Reddit (1M users) |
| Memory | 자체 reflection/retrieval/planning | 외주 가능 ([Zep / Graphiti — Temporal Knowledge Graph for Agent Memory](zep-graphiti.md)) + 내장 SQLite + [Microsoft GraphRAG — Query-Focused Summarization on Narrative Private Data](graphrag.md) (holistic) |
| Action | 자유 텍스트 → action 변환 | 23개 enum |
| 사회 구조 | 위치 기반 만남 | 그래프 기반 (follow) |
| 추천 | 없음 | interest + hot-score |
| 스케일 | 25 | 1M |
| 사용처 | NPC 깊이 연구 | 사회 emergence 연구 |

→ **상호 보완**. Park = *깊이* (인지·일상·관계 디테일), OASIS = *폭* (사회·미디어 동학).
양쪽 다 학습 대상. hwigi-tower 는 Park 표준 채택 (ai-npc-blueprint Layer 3-4).

---

## 9. 작가 비전 B 와의 매핑

비전 B (거대 시뮬레이션) 의 잠재 작품:
- 한국 고전·근대 문학 *대안 결말 시뮬레이션* (홍루몽 데모와 동일 패턴)
- 초파리 세계관의 1000 가지 분기
- 영겁회귀 사고실험 (마타이오스의 거대 버전)

OASIS 가 직접 지원하는 것:
- ✅ 1000+ agents 사회 동학
- ✅ 페르소나 시드 → 일괄 생성 ([Nemotron-Personas-Korea — 활용 레포트](nemotron-personas-korea.md) 와 결합 가능)
- ✅ 실험 / 시각화 인프라
- ✅ 비용 가시화 ($1 미만으로 1000 agents × 1 step)

OASIS 가 직접 지원하지 않는 것 (확장 필요):
- ❌ Twitter/Reddit 외 도메인 — `custom_platform_simulation.py` 패턴으로 직접 구현 필요
- ❌ Unity 시각화 — CUBE 활용 필요
- ❌ 한국어 페르소나 — Qwen 으로는 한계, Claude/HCX/Solar 교체 필요 (`custom_model_simulation.py`)

---

## 10. 마감 후 실행할 첫 실험 (구체)

**목표**: 21일 후 즉시 시작 가능. 1주일 내 첫 결과 도출.

**실험명**: *한국어 100 agents Reddit-clone 여론 시뮬레이션 — 작은 사회의 의견 수렴 동학*

**셋업**:
1. `pip install camel-oasis` (uv venv 권장)
2. 페르소나 시드 100개: [Nemotron-Personas-Korea — 활용 레포트](nemotron-personas-korea.md) 에서 직접 추출 (KOSIS grounding)
3. 모델: 토큰 절감 위해 GPT-4o-mini 1순위, 여유 시 Claude Haiku 비교
4. 액션 공간: LIKE/DISLIKE/POST/COMMENT/FOLLOW/SEARCH/DO_NOTHING (7개)
5. 시드 토픽: 한국 공론장 이슈 1개 (예: AI 가 만든 콘텐츠의 표시 의무 — 작가의 토스 학습 [토스 앱인토스 — 서비스 오픈 정책](../methods/toss-service-policy.md) 와 연결)
6. timestep 10회 → 의견 수렴 곡선 측정

**측정 지표**:
- agent 별 의견 PAD (-1 ~ +1) 의 timestep 별 분산
- echo chamber 형성 시점 (follow 그래프 community detection)
- minority opinion 의 생존율 ([Mafia Game Refinement (Ri et al. 2022, JAIST)](mafia-game-refinement.md) 의 1:5 균형 검증)

**예산**: gpt-4o-mini 환산 ~$1-2 / 첫 실험. (Qwen-plus 기준 ¥0.27)

**산출물**: `learnings/techniques/oasis-experiment-01.md` (실험 로그, 차트, 코드)

---

## 11. 학습 큐 (마감 후 우선순위)

| # | 다음 학습 | 예상 시간 |
|---|----------|---------|
| 1 | OASIS Quick Start 실제 실행 (예제 reddit_simulation_openai.py) | 1일 |
| 2 | 한국어 페르소나 100명 generator 작성 | 2일 |
| 3 | 첫 실험 (위 §10) 실행 + 분석 | 1주 |
| 4 | CUBE repo 분석 — Unity bridge 패턴 | 3일 |
| 5 | OASIS 논문 정독 (arXiv 2411.11581) | 2일 |
| 6 | MultiAgent4Collusion / MultiAgent4Fraud 응용 사례 학습 | 1일 |
| 7 | Park+2023 vs OASIS 통합 가능성 검토 (depth × breadth) | 1주 |
| 8 | OASIS + 자체 호스팅 **Graphiti** 통합 실험 ([Zep / Graphiti — Temporal Knowledge Graph for Agent Memory](zep-graphiti.md) 정독 완료) | 1주 |

---

## 12. 미리 준비할 것 (마감 *전* 짧은 시간 내 가능)

- [ ] Python 3.11/3.12 환경 (Codex 작업과 분리, uv venv 권장)
- [ ] OpenAI API key (gpt-4o-mini 사용량 한도 확인)
- [ ] [Nemotron-Personas-Korea — 활용 레포트](nemotron-personas-korea.md) 데이터셋 다운로드 (700만 페르소나 중 100명 샘플 추출)
- [ ] OASIS arXiv PDF 다운로드 (2411.11581) — 통근/이동 시 정독용
- [ ] 첫 실험 도메인 1개 결정 (한국 공론장 이슈) — 작가가 미리 1개 픽

→ hwigi-tower 작업 중 *짬짬이* 가능한 준비. 본격 학습은 마감 후.

---

## 13. 중요 변경 사항 / 최신 업데이트 (README 발췌)

- **2025-12-04**: camel-ai 0.2.78, HuggingFace dataset 링크 갱신
- **2025-06-08**: REPORT 액션 추가 (부적절 콘텐츠 신고)
- **2025-06-06**: 그룹챗 (생성·발화·이탈) 액션
- **2025-06-02**: INTERVIEW 액션 (★ NPC 직접 대화)
- **2025-05-22**: 에이전트별 모델·도구·프롬프트 커스터마이즈, PettingZoo 인터페이스 리팩터
- **2025-04-24**: PyPI `camel-oasis` 정식 배포

본 페이지 학습 시점 (2026-04-28) 기준 위 모든 기능이 안정화된 상태.

---

## 14. 출처 / 인용

```bibtex
@misc{yang2024oasisopenagentsocial,
  title={OASIS: Open Agent Social Interaction Simulations with One Million Agents},
  author={Yang, Ziyi and others},
  year={2024},
  eprint={2411.11581},
  archivePrefix={arXiv},
  primaryClass={cs.CL},
  url={https://arxiv.org/abs/2411.11581},
}
```

---

## 15. 연결

- [MiroFish + OASIS — 거대 시뮬레이션 세계 reference architecture](mirofish-oasis.md) — OASIS 응용 사례 (예측 엔진)
- [Generative Agents (Park et al. 2023) — AI NPC의 성경](generative-agents.md) — 비교 표준 (depth)
- [Nemotron-Personas-Korea — 활용 레포트](nemotron-personas-korea.md) — 한국어 페르소나 시드 결합 가능
- ai-npc-blueprint Layer 4-5 — 비전 B 영역
- [Mafia Game Refinement (Ri et al. 2022, JAIST)](mafia-game-refinement.md) — 1:5 균형 공식 (실험 측정 지표 차용)
