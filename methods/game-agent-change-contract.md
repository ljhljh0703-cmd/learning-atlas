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
