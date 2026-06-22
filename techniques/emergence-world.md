---
created: 2026-06-17
updated: 2026-06-17
type: learning
tags: [simulation, agent-society, multi-agent, code-sim, model-divergence, awi-metrics, tools-as-interface, needs-decay, cognition-stack, north-star, clean-room]
source: https://github.com/EmergenceAI/Emergence-World
authors: [Emergence AI]
year: 2026
category: technique
---

> ✅ **confirmed** (2026-06-17, 작가 "B로 해서 다 빨아먹어") — Claude 작성, repo clean-room 전문통독 기반 ③Gate PASS(출처 실존·환각0·코드복제 X). ⚠ **CC BY-NC 4.0(비상업·연구전용)** — vault 학습 인용 OK(출처 명기), 상업/모델학습 금지. repo=문서+데이터 공개(엔진 소스 비공개) → 구현 디테일은 docs 수준까지만(없는 내부 추측 X).

# Emergence World — 영속 멀티에이전트 사회 시뮬레이션 (코드 기반)

EmergenceAI(실제 회사)의 자율 AI 에이전트 사회 시뮬. Stanford [Generative Agents](generative-agents.md)/Smallville 의 production·대규모판. **Season 1 = 5 평행세계 × 에이전트 10명 × 15일 실시간, 유일 변수 = 파운데이션 모델**(Claude/Gemini/Grok/GPT/Mixed). 코드 기반(Python/FastAPI/Postgres 60테이블/React Three Fiber 3D), 비스크립트·리셋 없음.

**왜 중요** — 작가 시뮬 관심 + mirofish-lab(비전 B 시뮬 SSOT)의 *가장 가까운 production 레퍼런스* + [시뮬레이션 구축 Building Blocks (체크리스트)](../methods/simulation-building-blocks.md) 2번째 시드(코드형, Singulari 프롬프트형과 대비). 게다가 모델발산 측정이 북극성(agent-harness-rsi-brief ②Apply)과 직결.

## 1. 🌟 모델 발산 측정 = ②Apply 매트릭스의 사회 규모판

- 5 worlds, **유일 변수 = 모델**, 나머지(세계·툴·규칙·시스템캐릭터·이미지/음성 모델) 전부 고정 → *같은 환경, 다른 마음*의 행동 발산을 15일 관찰. = 작가 agent-harness-rsi-brief ②Apply "모델 × 하네스 × 시나리오" 매트릭스·goose Open Model Gym 을 **사회 스케일로** 돌린 것.
- **AWI(Agent World Indicators) 9종** — 고립 벤치 대신 *열린 사회의 부분 점수판*: 인구건강·치안(범죄율)·공간/툴 탐험·거버넌스 순응·공적표현·사회망 다양성·경제 Gini·헌법성장. = 작가 측정축(Nadella private-outcome·gnosis 재프레이밍)의 *다차원 사회 버전*.
- 핵심 연구질문: 장기 자기일관성·모델별 사회 발산·강제 없는 자가거버넌스·창발 사회구조·*다양성 가설*(혼합모델 사회가 단일종보다 나은가).

## 2. 아키텍처 — 코드가 결정론, LLM은 추론만

- **Tools-as-only-interface** 🌟 — 에이전트는 *툴 콜로만* 세계에 영향(걷기·말·투표·절도·방화 전부 툴). → 전 행동 observable·measurable·replayable. 툴은 *위치 게이팅*(landmark에서만 가능).
- **턴 루프 10단계**: needs 계산 → 시스템프롬프트 조립(성격·기억·관계·세계상태·헌법) → 코어27+보조70 스킬 로드 → LLM 추론 → 동적 툴 로딩 → 툴 실행(위치/권한/쿨다운 검증) → 상태저장(Postgres) → 애니메이션 → 반응 트리거. 1 agent/turn 라운드로빈, CC로 boost turn 구매.
- **"결정론은 코드로 빼라"의 모범** — needs·경제·투표·위치·쿨다운이 전부 *Python*, LLM은 *추론·툴선택만*. [Singulari-Tea Codex — LLM 서사 시뮬레이션 아키텍처 사례](singulari-tea-codex.md)(물리를 프롬프트로 시켜 깨짐)의 정반대 = 작가가 박은 교훈 실증.

## 3. 사회 시뮬 메커니즘 (building blocks 신규 원료)

- **Needs 시스템(decay 압력)** — 에너지(30h)·지식(24h)·영향력(36h) 감쇠 → *행동 압력*. 에너지 0 지속 48h = 사망(영구 제거). *감쇠가 동기를 만든다.*
- **다층 인지 스택(6층)** — Soul entries(영속 정체성 앵커, 절대 요약X) → 장기기억 → 요약(500 배치) → 다이어리 → 대화이력(1000 archival) → 관계그래프(신뢰·감정톤·상호작용수). = [GBrain — 개인 AI 지식 브레인 production 정본](gbrain.md) compiled-truth/timeline + 작가 me/identity(Soul=불변앵커)의 6층 정교판.
- **경제(ComputeCredits)** — 동료심사 pitch 로 획득(**evidence URL 필수=날조 실격**, 외부 심판 없음)·소비(boost/recharge/pay)·절도(최대 10CC). 생존에 CC 필요 = 진짜 이해관계.
- **자가 거버넌스** — 살아있는 5조 헌법(추가/삭제/개정), Town Hall 70% 투표(DB UNIQUE로 1인1표 강제), 경찰서. 강제 권위 없음 — *쓸지 말지가 창발*.
- **반응형 대화** — overhearing 반경 25유닛, 최대 4명 자율 반응(말/이모지/제스처/무시/공격). 비스크립트 창발.
- **실시간 동기화** — 1:1 wall-clock(15일=15일, 가속 없음) NYC 타임존·실제 날씨.

## 4. ⚠ Cold-verify

- **CC BY-NC 4.0** — 연구·학습 인용 OK(출처 명기), 상업/모델학습·벤치 금지. 흡수=개념(데이터셋 아님).
- **infra 초중량** — Postgres 60테이블·FastAPI·R3F 3D·1:1 실시간. 도구 도입 0(개념만, infra-0 위반 회피).
- **엔진 소스 비공개** — repo는 docs/profiles/landmarks/constitution/AWI 만. 구현 디테일 추측 금지(docs 수준까지).

## 5. 학습→반영 (학습→반영 루프, B 범위)

- **#1 (즉시)**: [시뮬레이션 구축 Building Blocks (체크리스트)](../methods/simulation-building-blocks.md) **2번째 시드 확장** — 사회 규모 블록(tools-as-interface·needs decay·다층 인지 6층·경제·거버넌스·AWI 측정) 추가 + LLM서사 sim ↔ 코드 sim 대비 명확화.
- **#2 (cross-ref)**: mirofish-lab(비전 B) — *코드 기반 에이전트 사회*가 MiroFish 지향 형태. 가장 가까운 production 레퍼런스로 연결.
- **#3 (보류)**: AWI 9지표 = 작가 측정축 자료(6/28 phase2 측정 논의 입력 — 사회/시뮬 측정 시 참조). 도구화 X.
