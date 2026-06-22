---
created: 2026-06-07
updated: 2026-06-07
type: learning
tags: [playtesting, automated-qa, headless-test, reinforcement-learning, curiosity, validator-first, libgdx-rogue-os]
source:
  - https://arxiv.org/abs/2103.13798
authors: [Camilo Gordillo, Joakim Bergdahl, Konrad Tollmar, Linus Gisslén]
year: 2021
doi: 10.1109/CoG52621.2021.9619048
category: method
---

# Improving Playtesting Coverage via Curiosity-Driven RL Agents — 자동 커버리지 탐색

*Camilo Gordillo, Joakim Bergdahl, Konrad Tollmar, Linus Gisslén (SEED · Electronic Arts, CoG 2021)*

> 📝 **이 파일의 내력**: 2026-06-07 초안(Gemini)은 "Automated Playtesting with Shooterbot (Moura/Lelis/Seixas)" 로 적었으나 그 DOI·저자는 검색 불검출 — *날조 인용*이었다. 실제 CoG2021 플레이테스트 SOTA 는 EA SEED 의 본 논문(arXiv:2103.13798). 파일명(`...shooterbot`)은 링크 보존 위해 유지하되 내용은 교정. **shooterbot 명칭은 무효**.

내재적 보상(호기심)으로 강화학습 에이전트가 *아직 안 가본* 게임 공간을 우선 탐색하게 해, 사람·랜덤봇이 놓치는 도달 불가·데드락 영역까지 자동으로 커버하는 플레이테스트 기법.

---

## 한 줄 요약

> 에이전트에게 상태 전이 *예측 오류*를 내재 보상으로 주면, 익숙한 경로 대신 희귀·미탐색 상태를 파고들어 복잡한 공간의 테스트 커버리지를 random agent 대비 끌어올린다.

---

## 핵심 개념

### 1. Intrinsic Curiosity Reward
- 외부 목표 보상 + *환경 상태 전이 예측 오류* 자체를 보상으로. 모델이 예측 못 하는(=새로운) 상태일수록 보상 ↑ → 탐색 유도.

### 2. Coverage 최적화
- 목표 = 클리어가 아니라 *게임 상태/공간 커버리지 최대화*. 버그·고립·데드락이 숨은 희귀 상태를 우선 방문.

### 3. 적용 도메인
- 논문 실험은 **복잡한 3D 시나리오**. random-walk 봇이 못 뚫는 공간을 호기심 에이전트가 더 넓게 탐색함을 보임.

---

## 기술 스택 / 사용법

- RL(호기심 모듈) + 게임 시뮬레이션 루프. 핵심 *교훈*은 "렌더 없이, 상태 커버리지를 목표로, 자동 탐색".

```java
// libGDX 헤드리스 — 렌더/오디오 없이 모델만 구동 (이 논문의 정신을 경량 적용)
HeadlessApplicationConfiguration cfg = new HeadlessApplicationConfiguration();
new HeadlessApplication(new HeadlessGameModel(), cfg);
```

---

## 내 생각 — libgdx-rogue-os 적용 관점

### Honest Assessment
- **레이어**: QA/검증 인프라 레이어
- **적용 가치**: **개념 수확** (RL 봇 직접 도입은 과함 — 정신만 차용)
- **시급성**: 중기 (코어 + PCG 안정화 후)

### 직접적 연결: 중간 (정신은 직결, 기법은 무거움)
프로젝트의 **validator-first / 헤드리스** 정체성을 *정당화*하는 학술 근거다. 다만 핵심 차이를 정직하게:
- 논문 = **3D + RL 호기심 에이전트** (학습 비용 큼)
- 우리 = **격자 + 결정론 + 단순 검증기**(A\*/flood-fill 도달성 체크)
→ 우리는 RL 까지 안 가도 된다. **"렌더 없이 수천 판을 돌려 도달 불가·데드락을 빌드타임에 잡는다"는 발상**만 차용. RL 호기심은 PCG 다양성이 *너무 커서* 단순 검증기가 놓치는 영역이 생길 때의 *미래 옵션*.

### 처참한 실패 시나리오
- `core/model` 에 그래픽 클래스(`TextureRegion`·`Sound`)가 import 되면 헤드리스 JUnit 에서 `GdxRuntimeException: No OpenGL context` 로 CI 전체 마비. → **렌더(View)와 모델 분리**가 이 기법의 전제. 결합도 통제 비용이 곧 입장료.

### 개념적 수확
- 봇 커버리지 100% 통과 ≠ 인간 재미. [난이도/플로우](../techniques/unpredictability-of-gameplay.md) 의 정성 검증은 별도. (봇은 *정합성* 검출기, *재미* 판정기 아님)

---

## 열린 질문

- 격자 PCG 의 도달성 검증에 단순 flood-fill 검증기로 충분한 임계는 어디고, 어디서부터 탐색형(RL/휴리스틱) 에이전트가 필요해지나?
- 헤드리스 시뮬을 멀티스레드 병렬 포크할 때 전역 상태 공유 병목은?

---

## 다음 학습 후보

- **원논문 §실험 셋업** — 커버리지 메트릭 정의·측정
- [Dijkstra Maps — 격자 로그라이크 적 AI 의 공유 거리 필드](../techniques/dijkstra-maps.md) — 검증 봇의 이동 기반(공유 distance field)
- **flood-fill connectivity validation** — 격자 도달성 검증의 표준 알고리즘

---

## 연결된 페이지

- libgdx-rogue-os — validator-first 헤드리스 QA 정체성
- [Cellular Automata 동굴 생성 (+ BSP 합성) — 정합성 보장형 격자 지형](../techniques/cellular-automata-bsp-mapgen.md) — 검증 대상 PCG 맵 생성
- [The Unpredictability of Gameplay — 무작위성을 randomness / chance / luck 로 분해](../techniques/unpredictability-of-gameplay.md) — 결정론이 재현 검증을 가능케 함
