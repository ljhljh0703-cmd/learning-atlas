---
created: 2026-06-08
updated: 2026-06-08
type: learning
tags: [game-design, enemy-design, design-patterns, roguelike, libgdx-rogue-os]
source:
  - https://archive.org/details/patternsingamede0000bjor
  - https://brogue.fandom.com/wiki/Stealth
authors: [Staffan Björk, Jussi Holopainen, Brian Walker]
year: 2005
category: technique
---

# 적 아키타입 디자인 패턴 — "스탯 묶음"이 아니라 "전술 질문"

*Björk & Holopainen, Patterns in Game Design (Charles River Media, 2005) · Brogue (Brian Walker) stealth/combat 메커니즘*

적 다양화를 HP/ATK 수치 차이가 아니라 *플레이어에게 서로 다른 판단을 강제하는* 설계로 접근하기 위한 패턴 어휘 + 사례.

> 📝 **Gate 메모 (2026-06-08)**: 두 출처 검증 완료. 본 노트의 *아키타입 로스터*(아래 §메뉴)는 ChatGPT 디자인 합성 + 작가 디자인 영역 — 출처 사실 아님, 빌드 스펙도 아님. 원칙·어휘·검증된 메커니즘만 사실로 취급.

---

## 한 줄 요약

> 좋은 적 다양화는 능력치가 아니라 **"이 적은 플레이어에게 어떤 전술 질문을 던지는가"** 로 분화하며 (Björk 의 Asymmetric Abilities·Risk/Reward·Paper-Rock-Scissors), 그 특수 능력은 *예고·관찰 가능*해야 한다 (Brogue 의 telegraph/examine 철학).

---

## 핵심 개념

### 1. Björk & Holopainen 패턴 (검증된 책 패턴)
- **Enemies / Boss Monsters** — 진행 방해 기본 적 / 규칙 숙련 종합 시험.
- **Asymmetric / Privileged Abilities** — 특정 적만의 예외 능력(원거리·끌어당김·분열·폭발·은신).
- **Risk/Reward · Tradeoffs** — 처치/회피/유인/자원소모 사이 선택 압력.
- **Paper-Rock-Scissors** — 아키타입 간 상성(방패형↔관통형 등).
- → 적을 *행동·목표·밸런싱 패턴의 조합*으로 기술하는 언어.

### 2. Brogue 검증된 메커니즘 (전술 깊이 사례)
- **인지 거리**: stealth range 내 몬스터가 **턴당 25% 확률**로 플레이어 인지. (Brogue Wiki 확인)
- **sneak attack**: 잠든/배회/마비 적 공격 시 **3배 피해**(단검 5배). 선제의 보상.
- **추적 상실**: hunting 몬스터는 stealth range **×3 거리 초과 시** 추적 잃음 (거리 기반).
  *(ChatGPT 가 보고한 "3% per turn"·jelly 100 cap·search 5턴 등은 미검증/부정확 — 인용 금지)*
- **telegraph/examine**: 특수 능력은 *읽고 대응 가능한 정보*로 (숨겨진 억까 X).
- **fleeing / mutation**: 도주 상태, 같은 아키타입의 변형 태그.

---

## 내 생각 — libgdx-rogue-os 적용 관점

### Honest Assessment
- **레이어**: 적 다양화 *디자인 원칙* (코드 아님 — 설계 근거)
- **적용 가치**: 개념 수확 (원칙·어휘). 로스터는 작가 디자인 결정
- **시급성**: 중기 (0B 2종 → 점진 확장)

### 5대 설계 원칙 (이 프로젝트에 채택)
1. **적 1종 = 전술 질문 1개** (스탯 차이 X).
2. 특수 능력은 **예고·관찰 가능** (예고 없는 즉사·광역기 금지).
3. **동일 seed + world state → 동일 행동** (결정론, [적 의사결정 — Utility AI + GOAP 하이브리드 ("무엇을 하나")](enemy-decision-making.md) 정합).
4. **Dijkstra=어디로, Utility=무엇을** 분담 유지.
5. 다양화는 **행동 패턴·위치 압박·정보 공개·대응 선택지** 차이로.

### ⚠️ 스코프 규율 (가장 중요)
- 현재 적 = melee 1종, 게임 = Spike 0. **10종 로스터·20필드 Spec 즉시 도입 금지** (#2 Simplicity).
- **0B = baseline 2종만**: **Bruiser**(=Aggressive, 절대 후퇴 안 함) + **Skirmisher**(=Cautious, HP 낮으면 도주). 둘 다 *기존 Utility 행동의 파라미터 양극* — 새 메커니즘 0.
- 나머지 로스터는 *미래 메뉴* — 작가가 1종씩 골라 증분(0C, 0D...). 새 메커니즘(원거리·소환·폭발·CC)은 각각 *별도 D 결정* + 필요 학습(예: 원거리 → symmetric shadowcasting).

### Validator-first 검증 태그 (채택 가치 높음)
적 추가 시 헤드리스 validator 체크리스트:
- `deterministic` (동일 seed 재현) · `visibleCounterplay` (대응 가능) · `noUnavoidableDeath` (예고 없는 즉사 X) · `noStatOnlyVariant` (스탯만 다른 적 아님) · `boundedSummon`/`boundedCrowdControl` (무한 소환·탈출불가 속박 X).

---

## 아키타입 메뉴 (미래 — 작가 디자인 픽, 빌드 스펙 아님)

> ChatGPT 합성 + Björk/Brogue 근거. *우선순위·채택은 작가.* 새 메커니즘 동반 종은 별도 결정·학습 필요.

| 역할 | 전술 질문 | 근거 패턴 | 새 메커니즘? |
|---|---|---|---|
| **Bruiser** | 정면 교전 감당? | Enemies+Combat | ❌ (0B) |
| **Skirmisher** | 쫓을까 무시할까? | Asymmetric+Risk/Reward | ❌ (0B) |
| Artillery | 시야 끊을까 접근할까? | Privileged Abilities | ✅ 원거리(+symmetric FOV) |
| Spear/Axe | 일렬·둘러싸기 회피? | Asymmetric Abilities | ✅ 관통/광역 |
| Controller | 위치 유지 vs 상태이상? | Obstacles | ✅ CC |
| Summoner | 본체 vs 소환물? | Boss+Resource | ✅ 소환 |
| Exploder | 처치 타이밍·위치? | Risk/Reward | ✅ 폭발 |
| Thief/Imp | 추격 vs 진행? | fleeing(Brogue) | ✅ 훔치기+도주 |
| Mutated Elite | 이번 변형 읽기? | mutation(Brogue) | ✅ 변형태그 |

---

## 열린 질문
- 2종(0B) 운영 후 어느 역할을 3번째로? (작가 디자인 우선순위)
- Paper-Rock-Scissors 상성을 도입하면 turn-based 격자에서 가독성이 유지되나?

## 다음 학습 후보
- **Symmetric Shadowcasting** (Albert Ford) — Artillery(원거리) 도입 시 시야 공정성 전제
- **Keith Burgun, Game Design Theory** — 결정론·전술 깊이 디자인 이론
- [적 의사결정 — Utility AI + GOAP 하이브리드 ("무엇을 하나")](enemy-decision-making.md) · [Dijkstra Maps — 격자 로그라이크 적 AI 의 공유 거리 필드](dijkstra-maps.md) · [Recursive Shadowcasting — 격자 로그라이크 FOV 의 표준](fov-recursive-shadowcasting.md) — 구현 3분할

## 연결된 페이지
- libgdx-rogue-os — 적 다양화 설계 대상
- [적 의사결정 — Utility AI + GOAP 하이브리드 ("무엇을 하나")](enemy-decision-making.md) — Utility/GOAP 행동 구현 (이 원칙의 코드측)
- [The Unpredictability of Gameplay — 무작위성을 randomness / chance / luck 로 분해](unpredictability-of-gameplay.md) — 결정론·예고성의 디자인 근거
- [Berlin Interpretation — 로그라이크 장르 정의의 사실상 표준](berlin-interpretation.md) — 장르 정체성
