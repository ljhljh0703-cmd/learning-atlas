---
created: 2026-07-11
updated: 2026-07-11
type: learning
tags: [game-design, idle-game, incremental, auto-hunt, unity, deterministic-combat, offline-progress, state-machine]
source: "Inflearn 무협 방치형 게임 강의(공개 커리큘럼) 역설계 — Codex 해체분석"
authors: [inflearn-course]
year: 2026
category: technique
---
<!-- Codex 해체분석 ③Gate 흡수(2026-07-11) — 방치형/자동사냥 게임의 결정론 전투코어 + 3-loop 아키텍처. 공개 커리큘럼 역설계(유료본 미접근). -->

# Idle Game Combat Architecture — 자동사냥 결정론 코어 + 3-Loop

> ③Gate 통과(2026-07-11). Inflearn 무협 방치형 강의 *공개 커리큘럼*만 역설계(유료 영상/소스 미접근·자막 verbatim 미흡수). vault에 없던 축 = **방치형 loop 분리 + Unity 도메인/표현 분리 + offline/save 계약**. [Game-Agent Change Contract + AI NPC Definition-of-Done](../methods/game-agent-change-contract.md)(owner 매트릭스)·[Game Balance Formula Registry — 계산 가능한 밸런스 뼈대](game-balance-formula-registry.md)(수치)와 상보(중복 없음).

## 1. 세 개의 루프를 분리 (한 스크립트 금지)
- **전투 루프**(먼저): 살아있는 적 탐색 → 표적 잠금 → 사거리 이동 → windup 후 피해 1회 → 쿨다운 후 반복/재탐색 → 사망은 보상+다음탐색 정확히 1회.
- **세션 루프**(전투 검증 후): `웨이브 → 일반적 처치 → 보스 → 스테이지 클리어 → 다음`.
- **메타 루프**(마지막=방치형 정체): `보상 → 성장 선택 → 전투력 변화 → 더 높은 스테이지 → 방치/오프라인 보상`.
→ **분리 이유**: 전투가 틀렸는데 성장 수치로 덮거나, 애니가 멋있어서 판정 버그 놓치는 것 차단.

## 2. 핵심 계약
- **전투 진실 = 도메인 상태(애니 아님)**: 피해 판정=순수 로직 / 애니 이벤트=이펙트·사운드 표현만. **같은 초기상태+명령+시드 → 같은 전투 로그**. **프레임레이트 달라도 공격 횟수·보상 달라지면 실패.**
- **표적 계약**: 죽음/비활성/진영/이탈 통과한 대상만 후보. 한 번 고른 표적 유지(매 프레임 최근접 갈아타기 X). 기본 점수=거리 하나로 시작, 어그로·체력·역할 가중치는 전이 실험으로 추가.
- **정확히 한 번(exactly-once)**: 사망 전이 1회 · `killId` 하나에 보상 1회 · 스테이지 클리어 신호 1회 · **풀 반환 객체가 이전 표적·쿨다운·구독 보존하면 실패**(리셋 계약).

## 3. 상태 머신 + 데이터 소유
`Acquire`(표적없음→평가) → `Move`(사거리밖→이동의도) → `Windup`(사거리안→준비감소→피해1회) → `Recover`(쿨다운) → 유효시 Windup/Move, 무효시 Acquire · `Dead`(HP0→사망 1회). **핵심 = 상태 수가 아니라 *전이 이유를 로그로 남기는가***(`t=1.20 P Acquire→Move target=E2 reason=nearest_valid`). 로그로 버그 설명 못 하면 애니 붙일 때 아님.
- **데이터 소유**: 런타임 HP·현재표적·쿨다운·누적보상은 **ScriptableObject에 안 씀** → `ActorState`/`StageRunState`/`RewardLedger`가 소유. (SO=authored 불변만.)

## 4. 방치형 메타 계약 (M7·M8 — 이 장르 고유)
- **보상 멱등(M7)**: 동일 `killId` 재처리에도 보상 증가 X. 10분 시뮬로 성장곡선 재현 가능.
- **저장·오프라인(M8)**: **버전 필드 있는 Save DTO + 마이그레이션 + 오프라인 보상 함수**. Gate = 저장/로드 왕복·구버전 로드·**시간 역행**·최대보상 cap 테스트. ⚠ **클라 시간 신뢰 = 치팅 위험**(vs 서버시간 비용) — 방치형의 핵심 보안 결정.

## 5. 반영 (Apply-or-Park)
- **① Applied**: 본 노트(정본). 작가 방치형/자동사냥 게임 착수 시 M0~M8 역설계 커리큘럼(종이전투→Unity없는 코어→표현브리지→스폰→풀링→보스=조합→성장→저장/오프라인). [Game-Agent Change Contract + AI NPC Definition-of-Done](../methods/game-agent-change-contract.md) owner 계약·[Game Balance Formula Registry — 계산 가능한 밸런스 뼈대](game-balance-formula-registry.md) DPS/XP/천장 수치와 결합.
- **② Parked**: teardown eval 카드(`claim→curriculum→artifact→verification` 강의/튜토리얼 제품 평가) = 다른 강의 평가 시. → codex-gate-park-backlog-2026-07-09.
- **환각가드**: 유료 영상/소스 미접근(공개 커리큘럼 역설계, "비공개 구현 복원 아님"). Codex RETURN의 skill 참조(unity-blueprints 등)는 **실존 안 하는 skill 날조** → 미반영. 강의 자막 .vtt는 evidence(work/)에 두고 vault 미승격.
