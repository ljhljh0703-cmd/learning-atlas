---
created: 2026-06-07
updated: 2026-06-07
type: learning
tags: [ecs, data-oriented-design, cache, gc, java-optimization, flecs, libgdx-rogue-os]
source:
  - https://github.com/SanderMertens/flecs
  - https://www.flecs.dev/
authors: [Sander Mertens]
year: 2019
category: technique
---

<!-- Data-Oriented Design & Flecs (Sander Mertens) 학습 노트 — libgdx-rogue-os 메모리/GC 설계 -->

# Data-Oriented Design & Flecs — 컴포넌트를 조밀 배열로 정렬하는 ECS

*Sander Mertens (Flecs 저자), github.com/SanderMertens/flecs · flecs.dev*

> 📝 **이 파일의 내력**: 2026-06-07 초안(Gemini)은 출처를 arXiv:2207.00163 으로 적었으나 그건 통계 논문("Non-Parametric Inference of Relational Dependence")으로 무관 — *날조 인용*이었다. 실제 권위 출처는 Mertens 의 Flecs 프로젝트·문서. 본 개정에서 교체.

엔티티를 객체 상속이 아니라 *ID + 컴포넌트 조합*으로 다루고, 같은 조합(archetype)의 엔티티 데이터를 연속 메모리에 밀집 배치해 캐시 친화성과 순회 성능을 끌어올리는 데이터 지향 설계(DOD)의 대표 구현·명세.

---

## 한 줄 요약

> 엔티티 = 정수 ID, 컴포넌트 = archetype 별 연속 배열. 시스템은 필요한 컴포넌트 배열만 선형 순회하므로 캐시 미스와 객체 할당이 줄고, GC 가 있는 런타임에서도 프레임 안정성을 높인다.

---

## 핵심 개념

### 1. Archetype-based Storage (조합별 조밀 저장)
- 같은 컴포넌트 조합을 가진 엔티티들을 하나의 테이블에 모아 연속 배열로 저장. 추가/삭제는 테이블 간 이동.

### 2. ID 중심 엔티티
- 엔티티는 무거운 객체가 아니라 정수 핸들. 데이터는 컴포넌트 배열에. 참조 인디렉션 최소화.

### 3. 시스템 = 배열 순회
- 로직은 "이 컴포넌트들을 가진 모든 엔티티"에 대해 *연속 배열을 한 번 훑는다*. CPU 가 인접 데이터를 캐시 라인에 함께 적재 → cache-friendly.

---

## 기술 스택 / 사용법

```java
// libGDX 진영의 Java ECS = Ashley. DOD 정신을 Java 로 근사:
public class PositionSystem {           // 컴포넌트를 primitive 배열로
    float[] x = new float[MAX], y = new float[MAX];
    boolean[] active = new boolean[MAX]; // 비트/플래그로 생사 토글 → new 회피
}
```
- Flecs(C) 자체는 포팅 불가(헌법: NuGet/직접 포팅 제약). **철학만 차용** — Ashley `PooledEngine` 또는 자체 primitive 레이어.

---

## 내 생각 — libgdx-rogue-os 적용 관점

### Honest Assessment
- **레이어**: 엔티티/데이터 인프라 레이어
- **적용 가치**: 개념 수확 → 부분 직접 (Ashley pooling)
- **시급성**: 중기 (적/엔티티 수가 늘 때)

### 직접적 연결: 중간 (턴제 규모에선 과하지 않게)
턴제 로그라이크는 엔티티 수가 수만 단위로 폭증하진 않는다. **풀 DOD 재설계는 과잉**일 수 있다. 현실적 차용은 ① Ashley `PooledEngine` 으로 엔티티 생성/소멸 시 `new` 회피, ② 자주 갱신되는 핫 데이터(좌표·HP)만 primitive 배열화.

### ⚠️ 정직한 한계 (단정 금지)
- **"GC 오버헤드 제로"는 과장**. Java/ART 에선 C 처럼 메모리 레이아웃을 완전 제어 못 한다. 정확한 표현은 *"객체 할당을 줄여 GC pressure 를 낮춘다"*. 포트폴리오에 "GC 제로" 라고 쓰지 말 것.
- primitive 평탄화는 타입 안정성·가독성을 깎는다 → 핫패스에만 외과적으로.

### 처참한 실패 시나리오
- 풀 재사용 시 *이전 엔티티 잔여 데이터 초기화 누락* → 신규 엔티티가 오염된 상태(잘못된 좌표·디버프)로 부활. 풀 반환 시 명시적 reset 강제.

### 개념적 수확
- [Dijkstra map](dijkstra-maps.md) 의 공유 `int[][]` 와 같은 결: *적 엔티티 핫 데이터를 배열로 모으면* distance field 와 함께 캐시에 잘 얹힌다.

---

## 열린 질문

- 우리 규모(동시 엔티티 수십~수백)에서 Ashley pooling 만으로 16ms 프레임 예산 안에 GC pause 가 들어오는가 — 실측 임계는?
- Off-heap(`ByteBuffer`)까지 갈 가치가 생기는 엔티티 수 임계점은?

---

## 다음 학습 후보

- **Ashley ECS 소스** — `PooledEngine`·`Family`·컴포넌트 매퍼 내부
- **Android ART GC 스펙** — generational GC 와 힙 압박
- [Dijkstra Maps — 격자 로그라이크 적 AI 의 공유 거리 필드](dijkstra-maps.md) — 공유 primitive 배열 AI 와의 접합

---

## 연결된 페이지

- java-art-archetype-ecs — 구현 명세(Archetype-ECS flat array·swap-remove·ART GC 0B, 본 이론의 libgdx 이식)
- libgdx-rogue-os — 엔티티 데이터 레이어 설계 대상
- [Dijkstra Maps — 격자 로그라이크 적 AI 의 공유 거리 필드](dijkstra-maps.md) — primitive 공유 배열 철학의 짝
- [Improving Playtesting Coverage via Curiosity-Driven RL Agents — 자동 커버리지 탐색](../methods/automated-playtesting-shooterbot.md) — 결정론적 상태 전이 검증
