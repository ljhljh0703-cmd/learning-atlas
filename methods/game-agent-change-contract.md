---
created: 2026-07-11
updated: 2026-07-11
type: learning
tags: [game-design, ai-npc, agent-operable, change-contract, definition-of-done, ownership]
source: https://github.com/dextune/gpt5.6-sol-action-rpg-demo
authors: [dextune]
year: 2026
category: method
---
<!-- Codex 해체분석 ③Gate 흡수(2026-07-11) — 게임을 '에이전트가 안전히 편집 가능'하게 만드는 변경 계약. 코드 fork 아님, 계약만. -->

# Game-Agent Change Contract + AI NPC Definition-of-Done

> ③Gate 통과(2026-07-11). GPT-5.6 Sol Action RPG repo(SHA·live 200 검증) 해체 — ⚠ **"GPT-5.6" 브랜딩·코드/아트 fork 기각**(라이선스 미검증·NPC 아님=결정론 action-state), *에이전트-편집 가능 구조 계약*만 흡수. Three.js 특정 배제. [WoC 역기획 — AI 게임 생산 방법론 (10종 해체 종합)](../techniques/woc-ai-gamedev-teardown.md)·[게임 재미 설계 OS (AI 위임용)](game-fun-delegation-os.md)와 상보(owner-matrix는 신규).

## 1. 핵심 — 데이터 선언 = 계약
콘텐츠(zone·몬스터·장비·스킬)를 *1급 인터페이스*로: 스킬 = 숫자가 아니라 combat block + input key + unlock + anim clip + effect handler + VFX + audio + timeline. "스킬 추가" 요청을 *완전한 스키마*로 검증 → 반쪽 UI 버튼·미검증 데미지 함수 방지. **데이터 소유 / 규칙 소유 / 표현 소유 분리** = 에이전트에게 *one-owner map* 제공 → 밸런스 요청이 조용히 player feel·카메라·렌더 비용을 바꾸는 vibe-code 회귀 차단.

### 1.1 Feel Contract — 손맛도 소유자를 갖는다 (2026-08-05 ③Gate 델타)

§1 의 *데이터/규칙/표현 소유 분리* 를 **입력→피드백 경로**로 연장한다. 게임 필(feel)은 "잘 만들면 나오는 것"이 아니라 **계약으로 고정되는 파이프라인**이다.

```text
Input Adapter → deterministic Resolver → semantic event → Feedback Bundle
```

- **Resolver 가 진실을 소유한다** — 판정은 결정론이고, 표현(VFX·SFX·카메라·hitstop)은 그 결과를 *구독*할 뿐 판정을 바꾸지 않는다. 기존 *"AI expresses. Engine decides."* 의 입력측 짝.
- **semantic event 로 끊는다** — 표현층이 원시 입력이 아니라 *의미 사건*(`stomp`·`block_hit`·`damage`·`course_clear`)을 받게 하면, 같은 사건에 기기별로 다른 피드백을 붙여도 판정이 안 흔들린다.
- **device command parity** — 데스크톱/모바일은 **같은 semantic command 를 공유**하되 control surface·정보 위계·safe area·동시 입력·resume·performance tier·canonical flow 는 **별도 acceptance** 로 둔다. (하나의 acceptance 로 두 기기를 덮으려 하면 둘 다 어정쩡해진다.)

<!-- 출처: Codex `k3-mario-game-engine-application` ③Gate 2026-08-05. 원본 영상 125.76초 실측 관찰(타이틀·이동·stomp/block/damage/death/course-clear 흐름)에서 역산한 구조. -->
⛔ **범위 제한(중요)**: ① **K3 벤치마크 주장 기각** — 게시자 표기 외에 repo·프롬프트·빌드로그·엔진·사람 개입 증거가 **없다**. 제작량·코드 품질을 인용하지 말 것. ② **시각·IP 레퍼런스 기각** — 마리오풍 외형·레벨 문법·음악을 자산 기준값으로 삼지 않는다(구조만 차용). ③ **수치 미확인** — hit-stop·screen shake·coyote time·input buffering·물리값은 **영상에서 확인 불가**. 튜닝값은 프로젝트 플레이테스트로만 정한다. ④ 방향 승인 ≠ 구현 권한.

## 2. Game-Agent Change Contract (feature 요청마다 — 프로젝트 로컬 카드)
| 필드 | 예 |
|---|---|
| **Data owner** | `content.js` 스킬 레코드 |
| **Rule owner** | combat handler / entity state |
| **Presentation owner** | VFX 레시피 + audio + animation |
| **UI owner** | input/HUD 매핑 |
| **Persistence impact** | none 또는 migration required |
| **Proof** | static schema test + 표적 runtime 시나리오 |

⚠ *imported framework 아님* — 프로젝트 로컬 operating card로.

## 3. AI NPC Definition-of-Done 매트릭스 (⭐ NPC feature 착수 시)
같은 구조를 NPC로 — "NPC가 배웠다"가 대사 1줄만 바꾸는 걸 차단, *advice→action→outcome→later-retrieval* 체인이 관측 가능해야:
| Layer | NPC 등가 |
|---|---|
| Canon data | authored 사실·사회 제약·역할 규칙 |
| Runtime state | 목표·관계 상태·현재 commitment |
| Rule handler | 허용 행동·상태전이 검증 |
| Presentation | 대사·애니·퀘스트마커·플레이어 피드백 |
| Persistence | event anchor·mutation 사유·rollback/review |
| **Proof** | *나중 행동이 올바르게 바뀜*을 보이는 replayable 시나리오 |

→ [AI NPC 기억·신념 아키텍처 (Memory + Belief)](../techniques/ai-npc-memory-belief-architecture.md) belief/evidence 게이트·[Shepherd — Reversible Execution Traces (하네스 자가수리 기판)](shepherd-reversible-execution-traces.md) settlement과 정합.

## 4. 콘텐츠·와이어링 테스트 (import만 X)
zone/boss 매핑·스킬키 유일성·handler registry·anim 이름·데미지 배수 오류·상태효과·품질 스케일 검사. NPC 등가 테스트 = **canon 모순·무권한 memory mutation·관계 전이·retrieval provenance·post-compaction replay**.

## 5. 반영 (Apply-or-Park) + Anti-overclaim
- **① Applied**: 본 노트(계약·매트릭스). 작가 게임 하네스·AI-NPC 게임에 직접 적용. [Game Balance Formula Registry — 계산 가능한 밸런스 뼈대](../techniques/game-balance-formula-registry.md)(Proof의 수치 축)·agent-harness와 상보.
- **② Parked**: 배포 게이트 교훈(fallback ≠ feature parity → *required asset 404/fallback에 fail하는 deploy smoke*) · skill `agent-operable-game-feature-contract`(1회 관측·8주 use-gate). → codex-gate-park-backlog-2026-07-09.
- **⚠ stale 증거 배제**: 원 teardown의 "hero GLB 404" P0 증거는 *하루 만에 무효*(작가 재호스팅 → 현재 200). 배포는 mutable — 특정 404 지적은 박제 X, *deploy smoke 원리*만 흡수.
