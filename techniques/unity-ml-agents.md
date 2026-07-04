---
created: 2026-05-23
updated: 2026-05-23
type: learning
tags: [unity, rl, ppo, sac, ma-poca, imitation-learning, multi-agent, npc, game-ai]
source: https://github.com/Unity-Technologies/ml-agents
category: technique
---

<!-- Unity 게임 환경을 RL 에이전트 훈련 플랫폼으로 쓰는 ML-Agents Toolkit 학습 아카이브 -->

# Unity ML-Agents — Unity 환경을 RL 학습장으로 쓰는 오픈 툴킷

*Unity Technologies · Apache-2.0 · 19.4k★ · Release 23 (2025-08-28, mlagents 1.1.0 / Unity package 4.0.0) · 기본 브랜치 develop*

Unity 의 2D/3D/VR 씬을 그대로 **RL·모방학습 에이전트의 학습 환경** 으로 노출시키는 SDK + Python 학습 백엔드. NPC 행동 제어, 자동 게임 테스트, 디자인 결정 사전 평가의 3대 용도. Juliani et al. 2020 의 reference paper 가 학술적 기반.

---

## 한 줄 요약

> Unity 씬에 `Agent` 컴포넌트를 붙이면, Python 측 PyTorch 학습 루프 (PPO/SAC/MA-POCA/BC/GAIL) 가 gRPC 로 그 씬을 환경 삼아 정책을 훈련하고, 결과 모델은 Inference Engine 으로 다시 Unity 안에서 native 실행된다.

---

## 핵심 개념

### 1. Agent · Behavior · Decision Requester 3종 컴포넌트

Unity C# 측 추상화의 핵심.
- `Agent` — 관측(`CollectObservations`), 행동(`OnActionReceived`), 보상(`AddReward`), 에피소드 종료(`EndEpisode`) 4 메서드를 오버라이드.
- `Behavior Parameters` — 정책 이름·관측 shape·행동 spec (continuous/discrete) 명세. 같은 Behavior Name 을 공유하는 Agent 는 정책 공유.
- `Decision Requester` — 몇 틱마다 정책에 결정을 요청할지 (On Demand Decision Making 으로 비동기 결정도 지원).

### 2. Python ↔ Unity gRPC LLAPI

학습 시 Unity 빌드가 Python `mlagents-learn` 의 gRPC 채널에 붙어 step/reset 을 주고받는다. **다수 Unity 인스턴스 병렬 실행** (concurrent environments) 으로 wall-clock 단축.

### 3. 지원 알고리즘 — RL 3종 + Imitation 2종

| 분류 | 알고리즘 | 용도 |
|---|---|---|
| Single-agent RL | **PPO** (기본) | 안정·범용 |
| Single-agent RL | **SAC** | sample-efficient, off-policy |
| Multi-agent | **MA-POCA** + **self-play** | 협력/적대 멀티 에이전트 (Cohen et al. 2022 AAAI RLG) |
| Imitation | **BC** (Behavioral Cloning) | 데모로 supervised 사전학습 |
| Imitation | **GAIL** | 데모를 reward signal 로 변환 |

커스텀 trainer plug-in 도 가능 (Python-Custom-Trainer-Plugin).

### 4. Curriculum + Domain Randomization

- **Curriculum Learning** — 난이도 단계 YAML 정의, 통과 기준 충족 시 자동 승급.
- **Environment Randomization** — 물리 파라미터·맵 변수 randomize 로 *robust* 정책 학습 (sim2real / 일반화).

### 5. Inference Engine — Native 추론

학습된 ONNX 모델을 Unity 안에서 cross-platform native 실행. Python 의존성 없이 빌드 배포 가능. *훈련은 Python, 배포는 C#* 분리가 toolkit 의 운영 모델.

### 6. Gym / PettingZoo 래퍼

Unity 환경을 표준 `gym` (single-agent) 또는 `PettingZoo` (multi-agent) 인터페이스로 노출 → 외부 RL 라이브러리 (SB3, RLlib 등) 호환.

---

## 기술 스택 / 사용법

```bash
# Python 측 (Release 23 기준)
pip install mlagents==1.1.0    # PyTorch backend
mlagents-learn config/ppo/3DBall.yaml --run-id=ball-01 --env=builds/3DBall

# Unity 측
# 1) Package Manager → com.unity.ml-agents 4.0.0 추가
# 2) Agent 상속 + Behavior Parameters 설정
# 3) Play 누르면 Python 학습 루프와 자동 연결
```

설정은 YAML (PPO hyperparams, reward signals, curriculum lessons 등) 단일 파일 — Unity Inspector 와 분리.

---

## 내 생각 — AI NPC 관점

> **2026-05-24 재평가**: ai-game-roadmap SSOT 도입으로 *직접적 연결* 평가가 트랙별로 분리됨.

### 트랙별 직접 연결도

| 트랙 | 직접 연결 | 근거 |
|---|---|---|
| **AI Game 로드맵** (ai-game-roadmap) | **🔴 핵심 도구** | Phase 2-7 의 *기반 프레임워크*. PPO·SAC·MA-POCA·GAIL 모두 활용 예정. |
| **hwiglija-tower** (hwiglija-tower-gdd) | 🟢 낮음 | NPC 가 LLM-driven persona (D-022/D-024) 기반이라 RL 직접 도입 시 아키텍처 충돌. 단 Phase 5 LLM+RL 결합 시 *교차점*. |
| **com2us-2026 지원** | 🟡 중간 | RL 시뮬레이터·밸런스 자동화 포지션 — Phase 1-2 결과물이 증빙 |

### 개념적 수확

1. **Agent 컴포넌트 추상화** — `CollectObservations / OnActionReceived / AddReward` 4메서드 분리는 LLM-NPC 의 `gather_context / dispatch_action / reflect` 로 *형식 동형*. 우리 NPC 코드도 이 4면 인터페이스로 정리하면 향후 RL hybrid 시 brige 비용 0.
2. **Decision Requester 패턴** — *모든 틱이 아니라 N 틱마다 결정 요청* 은 LLM 호출 비용 절감 패턴과 동일. On Demand Decision Making 을 LLM 결정 트리거 (회차 종료·임계 이벤트) 에 그대로 차용.
3. **MA-POCA 의 absorbing state 처리** — 멀티 NPC 사망/이탈 시 보상·정책 처리 표준화. 우리는 단일 NPC (마타이오스) 지만, *향후 다중 NPC* (e.g. 동행자 추가) 도입 시 reference.
4. **Curriculum YAML + lesson 승급 자동화** — D-022 의 메모리 단계 (S0→S4) 와 매핑 가능. 작가가 직접 단계 트리거 짜는 대신 YAML 화.
5. **Inference Engine 의 *훈련/배포 분리*** — Python 측에서 무거운 작업, Unity 측에서 native 추론. 우리 on-device LLM (OQ-004) 와 동형 — *cloud 학습 / device 추론* 분리 패턴의 사전 reference.
6. **Domain Randomization** — NPC reflection prompt 의 *세부 변주* 를 randomize 해서 over-fitting (특정 표현 반복) 방지하는 발상으로 전이 가능.

### 블루프린트 연결

- **자가 검증 루프 (D-053)** — ml-agents 의 *에이전트가 환경에서 보상 받고 정책 갱신* 구조는 openhands 의 Executive Limb 와 *완전 동형*. D-053 디벨롭 시 두 reference 를 *나란히* 놓고 비교하면 설계 폭 확대.
- **NPC eval (D-052)** — Curriculum lesson 통과 기준이 자동 평가 게이트와 같음. SKILL.md §0 First-Run Gate 의 강화 reference.

---

## 열린 질문

- 우리 LLM-NPC 가 *부분적으로* RL hybrid 가 될 가치가 있는가 (e.g. 전투 액션 선택만 PPO, 대사·reflection 은 LLM)? → 토픽 13 (D-053) 디벨롭 시 옵션으로 넣을 것.
- ml-agents 의 *self-play* 가 hwiglija-tower 의 *회귀자 vs 자기 자신 (이전 회차)* 메타 구조에 응용 가능한가? → 장기 옵션.
- Inference Engine 의 ONNX 추론이 *on-device LLM* (OQ-004) 의 추론 백엔드와 같은 런타임에 공존 가능한가? → 기술 제약 확인 필요.

---

## 다음 학습 후보

- **MA-POCA 논문** (Cohen et al. 2022 AAAI RLG) — 멀티 에이전트 absorbing state 의 *왜* 가 단독 학습 가치 있음.
- **Juliani et al. 2020 reference paper** (arXiv 1809.02627) — Unity 를 일반 AI 플랫폼으로 본 학술 시각, NPC welfare gate 와 *학습 환경 윤리* 교차점.
- **Hugging Face Deep RL Course Unit 5** (ml-agents 챕터) — 실전 튜토리얼, 손에 직접 익혀볼 때 reference.
- **Godot RL Agents / Brax / Isaac Sim** — Unity 외 게임 엔진의 RL 학습 통합 비교 (장기 비교 reference).

---

## 연결된 페이지

- ai-game-roadmap — **본 학습의 SSOT** (Phase 2 핵심 reference)
- openhands — Executive Limb · 자가 검증 루프 (D-053 짝)
- SKILL.md — Curriculum 평가 게이트 reference (D-052 짝)
- hwiglija-tower-design-agenda 토픽 13 — OpenHands + ml-agents 양쪽 reference 비교 후보
- hwiglija-tower-gdd D-022 / D-024 — Mataios Reflection 메모리 단계 (Curriculum 매핑 가능)
- roadmap · blog-draft-rl-first-steps — RL 학습 경로 자매(로드맵 / 첫 실험 스텝 / 본 페이지=게임 RL 적용)
