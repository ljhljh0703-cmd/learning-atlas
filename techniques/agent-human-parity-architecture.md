---
created: 2026-07-20
updated: 2026-07-20
type: learning
tags: [ai-npc, agent-architecture, protocol-parity, llm-scheduler, game-plumbing, teardown]
source: [https://github.com/Julian-adv/OpenMMO]
authors: [Julian-adv]
year: 2026
category: technique
---
<!-- OpenMMO 해체(read-only, clean-room) — AI 행위자를 게임 시스템에 *참여*시키는 배선 계층. NPC 인지(기존 페이지)가 아니라 아키텍처 델타. -->

# Agent–Human Parity — AI 행위자 참여 아키텍처

> **경계 (이 페이지가 다루는 것 / 안 다루는 것)**: 기존 vault는 NPC가 *어떻게 생각하나*(기억·신념·결정·persona)를 이미 풍부하게 다룬다 → [AI NPC 기억·신념 아키텍처 (Memory + Belief)](ai-npc-memory-belief-architecture.md) · [DVM — 추론/결정/발화 분리형 소셜추론 NPC 결정 체인](dvm-decision-chain-npc.md) · [Fixed-Persona SLMs with Modular Memory — 소비자급 하드웨어 다중 NPC 대화](slm-dynamic-content-generation.md) · [Study: Mathaios - The Brevity-First NPC Case](mathaios-study.md). **본 페이지는 그 인지를 다루지 않는다.** AI 행위자를 게임/시스템에 *어떻게 배선해 참여시키나*(프로토콜·스케줄링·실행 분리) — **배관(plumbing) 계층**만. 출처: `Julian-adv/OpenMMO` 1인 vibe-coded Rust MMORPG read-only 해체(2026-07-20). 어느 코드도 wholesale 채택 아님 — 패턴만 추출.

## 왜 (북극성 ▸ AI 참여 표면)

작가 vault는 "AI NPC = 부산물"로 규정. OpenMMO는 그 부산물을 *중심 테제*로 삼았고, 그 과정에서 **"AI를 특권 없이 인간과 같은 인터페이스에 세운다"**는 대칭성 원칙을 아키텍처로 강제했다. 이 원칙은 게임 NPC를 넘어 **AI 파트너/집사 텔로스**에도 은유가 된다 — 파트너 AI에게 특권 API를 주지 말고 작가가 쓰는 것과 같은 도구·vault 표면으로 참여시키면, "인간이 할 수 있는 건 AI도 한다"가 선언이 아니라 구조가 된다.

## 신규 델타 (기존 vault에 없던 것만)

### 1. 프로토콜 대칭성 (Agent–Human Parity) ★핵심
- AI 에이전트와 인간이 **완전히 동일한 WebSocket 프로토콜**로 접속. 서버(`connection.rs`)는 둘을 **구별하지 못한다** — NPC든 PC든 같은 `Player`, 같은 `ClientMessage`/`ServerMessage`.
- **에이전트 전용 특권 API가 없다.** NPC를 서버 *내부*에 박지 않고 서버 *밖으로* 밀어내 "클라이언트로 로그인"시킴.
- 결과: ① 로드밸런싱·인증·rate limiting 인프라를 NPC가 공짜 재사용 ② 치팅 방지 대칭(몬스터 스폰 위치도 서버가 검증 → 에이전트 순간이동 불가) ③ "인간이 하는 건 AI도 한다"가 구조로 강제.
- **트레이드오프**: 1 WS = 1 캐릭터 강제 → NPC N명 = WS N개. 서버는 연결당 tokio task 1개(~1-2KB)+broadcast receiver, "10K도 OS 튜닝으로 가능"이라 주장(미실증).

### 2. LLM Scheduler — 다중 에이전트 비용통제 ★재사용성 높음
- 모든 NPC 드라이버가 백엔드를 직접 부르지 않고 **중앙 우선순위 큐**로 제출(`llm_scheduler.rs`, BinaryHeap + concurrency limiter).
- 3-tier 우선순위: `Urgent(0)` 전투·직접대화·죽음 → `Routine(1)` 이벤트 있는 주기 폴 → `Idle(2)` 유휴 폴. 동률은 제출시간 오래된 것 먼저.
- **비용 축이 코드로 박힘**: `max_concurrent` 동시호출 상한, 유휴 NPC는 1시간 간격 스킵, **전투 액션은 LLM 대기 없이 deterministic 실행**(LLM은 대화·고수준 판단만).

### 3. 3계층 실행 분리 (LLM은 매 프레임 돌지 않는다)
- **LLM**(전략·대화·판단) / **agent-client**(A* pathfinding·FSM·이벤트 버퍼) / **server**(월드 시뮬·권한 검증).
- LLM은 `move_to("대장간")` 같은 고수준 명령만. 좌표 추적·경로 재계산은 클라이언트가. → LLM 호출 빈도 = 비용 통제의 실질 레버.
- 몬스터 행동은 순수 FSM(idle→chase→attack→flee→return), LLM 0원. 지능이 필요한 지점에만 LLM.

### 4. 정의=SSOT / 배포=config 분리 (작가 철학과 동형)
- `data-src/npcs.csv` = "누가 존재하는가" git-tracked 단일 진실 소스. `config.toml`(gitignore) = "이 호스트에서 뭘 띄우나" 배포 결정만.
- system prompt = `template(역할) + instance(개성) + memory(런타임 누적, LLM이 `memory_update`로 자동 갱신)` 결합. ← 3계층 프롬프트는 [Fixed-Persona SLMs with Modular Memory — 소비자급 하드웨어 다중 NPC 대화](slm-dynamic-content-generation.md)의 Fixed-Persona+Modular-Memory와 **동형**(신규 아님, 링크만).

## 적용 트리거 + 체크리스트 (바로 꺼내 쓰는 용도)

**언제 이 페이지를 인출하나** — 게임/시스템에 AI 행위자(NPC·봇·파트너)를 *참여시키는 배선*을 설계할 때. (NPC *인지* 설계면 위 인지 페이지들로.)

적용 시 점검:
- [ ] **특권 API를 만들려 하는가?** → 멈춰라. AI가 인간과 같은 인터페이스로 참여 가능한지 먼저 검토(대칭성이 인프라 재사용+치팅방지+검증가능성을 공짜로 준다). 불가할 때만 전용 경로.
- [ ] **LLM을 매 tick/프레임 부르려 하는가?** → 3계층 분리로 밀어내라. 고수준 명령만 LLM, 실행(경로·타이밍·전투판정)은 deterministic 계층.
- [ ] **다중 에이전트인가?** → 중앙 스케줄러(우선순위 큐 + concurrency 상한 + 유휴 스킵) 없이 시작하면 비용이 N배로 샌다. Urgent/Routine/Idle 3-tier가 최소 골격.
- [ ] **행위자 정의를 코드/config에 박으려 하는가?** → 정의(누가 존재)와 배포(어디에 띄우나)를 분리. 정의는 git SSOT, 배포는 호스트별.
- [ ] **N개 연결의 상태 격리 vs 공유** → OpenMMO는 orchestrator 1 프로세스가 WS N개 + NPC별 SharedState, HeightSampler/PassabilityCache는 공유. 완전 격리(Option1, 비용N배)와 1-LLM-다NPC(Option2, 성격오염) 사이 hybrid가 채택안.

## 냉정 한계 (과대평가 가드)
- **"Parity"는 개념이 강하지 지능이 강한 게 아니다.** 실제 NPC = FSM + 간헐 LLM. 창발적 사회 시뮬(Generative Agents류) 아님 — "AI가 산다"가 아니라 "AI가 조종하는 봇이 인간 프로토콜로 참여한다".
- **1인 vibe-coded** — 프롬프트 일부 Rust 소스 하드코딩(TODO 자백), 5000 동시접속은 CLAUDE.md 야망일 뿐 실증 0. 프로덕션 견고성보다 데모 완성도 우선.
- **memory 계층이 얇다**(append/요약 교체). NPC "기억 품질"은 [AI NPC 기억·신념 아키텍처 (Memory + Belief)](ai-npc-memory-belief-architecture.md)의 2-speed/belief-ledger가 훨씬 앞섬 → **Sub brain 선행 지향**: OpenMMO의 배선 위에 vault의 인지 아키텍처를 얹는 것이 이상적 합성.

## 관계
- 인지 계층(본 페이지가 안 다룸): [AI NPC 기억·신념 아키텍처 (Memory + Belief)](ai-npc-memory-belief-architecture.md) · [DVM — 추론/결정/발화 분리형 소셜추론 NPC 결정 체인](dvm-decision-chain-npc.md) · [Fixed-Persona SLMs with Modular Memory — 소비자급 하드웨어 다중 NPC 대화](slm-dynamic-content-generation.md) · [Study: Mathaios - The Brevity-First NPC Case](mathaios-study.md)
- 게임 AI 생산 방법론: [WoC 역기획 — AI 게임 생산 방법론 (10종 해체 종합)](woc-ai-gamedev-teardown.md)
- 반영처(파킹): hwigi-tower AI NPC / ai-npc-engine 착수 시 §적용 체크리스트 인출 → [학습→반영 루프 (Absorb-to-Apply)](../narrative/학습→반영 루프.md) ②Park
