---
created: 2026-06-07
updated: 2026-06-07
type: learning
tags: [pcg, cellular-automata, bsp, map-generation, autotiling, validator, libgdx-rogue-os]
source:
  - https://www.roguebasin.com/index.php/Cellular_Automata_Method_for_Generating_Random_Cave-Like_Levels
authors: [RogueBasin Community]
year: 2016
category: technique
---

<!-- Cellular Automata 동굴 생성(RogueBasin) + BSP 합성 학습 노트 — libgdx-rogue-os PCG -->

# Cellular Automata 동굴 생성 (+ BSP 합성) — 정합성 보장형 격자 지형

*RogueBasin, "Cellular Automata Method for Generating Random Cave-Like Levels"*

> 📝 **이 파일의 내력**: 2026-06-07 초안(Gemini)은 "Srilakshmi & Suresh 2024" Springer DOI 로 적었으나 교차검증 실패(미검증) — 출처 교체. 실 출처는 RogueBasin CA 표준 문서. **BSP 결합은 그 문서의 내용이 아니라 프로젝트 자체 합성 설계**임을 명시(아래 §BSP 분리).

셀룰러 오토마타로 유기적 동굴 외곽을 깎고, flood-fill 로 연결성을 강제하며, 8방향 비트마스크로 타일 스프라이트를 매핑하는 격자 PCG 파이프라인.

---

## 한 줄 요약

> 무작위 벽/바닥 시드에 **4-5 규칙**(주변 벽 ≥5 → 벽, ≤4 → 바닥)을 n회 반복하면 자연스러운 동굴이 생기고, flood-fill 연결성 검증으로 고립 구역을 제거하면 *항상 플레이 가능한* 격자 맵이 나온다.

---

## 핵심 개념

### 1. Cellular Automata 동굴 (4-5 Rule)
- 초기: 각 셀을 확률적으로 벽/바닥 배치.
- 전이: 셀마다 8방향(Moore) 이웃의 벽 개수 $W_i$ 를 세서

$$\text{cell} = \begin{cases} \text{Wall} & W_i \ge 5 \\ \text{Floor} & W_i \le 4 \end{cases}$$

- 이 전이를 n회 반복 → 매끄러운 동굴 경계.

### 2. 연결성 검증 (flood-fill) — *정합성의 핵심*
- CA 단독은 **고립된 공동(cave)** 을 만든다. flood-fill 로 최대 연결 영역을 찾아 ① 작은 고립 구역 제거 또는 ② 터널로 연결.

### 3. 8방향 비트마스크 오토타일링
- 이진 매트릭스(0 바닥/1 벽)에서 각 벽 셀의 주변 8방향 벽 여부를 가중치(1,2,4,8,16,32,64,128) 합산 → $0\sim255$ 인덱스로 타일 스프라이트 즉시 매핑.

### 4. BSP 합성 (⚠️ 프로젝트 자체 설계 — 원문 아님)
- RogueBasin CA 문서엔 BSP 결합이 없다. *우리 설계*는 BSP 로 큰 방·필수 동선을 deterministic 하게 먼저 확보하고, 각 분할 내부에 CA 를 가해 유기적 경계를 만드는 **2단 하이브리드**. 포트폴리오에 "문헌 기법"이 아니라 "프로젝트 고유 합성"으로 표기할 것.

---

## 기술 스택 / 사용법

```
1. seed: 확률 p 로 벽/바닥 무작위
2. for n회: 4-5 Rule 전이
3. flood-fill: 최대 연결영역만 남기고 고립 제거 (또는 터널 연결)
4. (선택) BSP 로 방/동선 골격 먼저 → 내부에 1~3 적용
5. validator: 시작/출구/자원/전투노드 간 연결성 == true 검사 후 배포
```

---

## 내 생각 — libgdx-rogue-os 적용 관점

### Honest Assessment
- **레이어**: PCG/지형 생성 레이어
- **적용 가치**: **직접 적용** (바로 코드)
- **시급성**: **지금~중기** (맵 생성은 코어)

### 직접적 연결: 높음 (헤드리스 validator 와 한 몸)
이진 매트릭스 → flood-fill 검증은 [헤드리스 검증](../methods/automated-playtesting-shooterbot.md) 과 정확히 맞물린다. 뷰 레이어와 분리된 JUnit 에서 *"고립된 방 개수 == 0"* 을 단언해 무결한 맵만 배포 가능.

### 처참한 실패 시나리오
- BSP 게이트웨이(통로 연결점) 위에 CA 가 벽을 덮어 출구를 막고, validator 가 재생성을 요청하나 **같은 시드로 무한 루프** → 모바일 프리징. → 재생성 시 *시드 변경* + 시도 횟수 상한 + 실패 시 강제 터널링 fallback 필수.
- 256 타일 아틀라스를 다 안 그리면 비트마스크 인덱스 누락 → 깨진 타일. (대안: Wang tiles / 16-타일 축약)

### 개념적 수확
- "생성 → *검증* → 통과분만 배포"는 [randomness 를 PCG 에 가두는](unpredictability-of-gameplay.md) 결정론 전략의 실천. 전투는 결정론, 지형은 검증된 randomness.

---

## 열린 질문

- BSP 비율 임계 vs CA 전이 횟수의 조합에서 도달성을 깨지 않는 안전 마진(타일 수)은?
- flood-fill 재생성 루프의 상한 횟수와, 초과 시 강제 터널링의 비용 균형은?

---

## 다음 학습 후보

- **RogueBasin BSP Dungeon Generation** — BSP 골격 생성 표준(우리 합성의 다른 한 축)
- **Wang Tiles** — 256 타일 압박을 줄이는 오토타일링 대체 수학
- [Improving Playtesting Coverage via Curiosity-Driven RL Agents — 자동 커버리지 탐색](../methods/automated-playtesting-shooterbot.md) — 생성 맵의 도달성 검증

---

## 연결된 페이지

- libgdx-rogue-os — PCG 지형 생성 대상
- [Improving Playtesting Coverage via Curiosity-Driven RL Agents — 자동 커버리지 탐색](../methods/automated-playtesting-shooterbot.md) — flood-fill 정합성 검증의 짝
- [The Unpredictability of Gameplay — 무작위성을 randomness / chance / luck 로 분해](unpredictability-of-gameplay.md) — 검증된 randomness 의 디자인 근거
