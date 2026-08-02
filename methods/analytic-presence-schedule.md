---
created: 2026-07-30
updated: 2026-07-30
type: learning
tags: [game-design, determinism, ambient-life, simulation-cost, reconnect, presence]
source: [https://github.com/achimala/TheLongSilence]
authors: [achimala]
year: 2026
category: method
---
<!-- 지속 시뮬레이션 없이 재접속 가능한 생활감을 만드는 방법 — analytic schedule 계약. ⚠️provisional. -->

# Analytic Presence Schedule — 틱 없이 사는 세계

> ⚠️ **임시(provisional)** — Codex RETURN ③Gate PASS(2026-07-29) 후 승격. 작가 내용 검토 전. 출처 pin `4845c1df02e71edcb54dd14e902663d51e0434eb`.

## 핵심 명제

플레이어가 실제로 사는 것은 *모든 개체가 계속 계산됐다는 사실*이 아니라 **"세계가 내가 없는 동안에도 움직였다는 증거"**다. 그 증거만 필요하다면 개체를 틱하지 말고 시계에서 위치를 *계산*한다.

```text
seed + world_time + schedule → observable state
```

## 왜 이게 싼가

지속 시뮬레이션은 적분을 누적한다 — 그래서 일시정지·시간 점프·재접속·리플레이마다 상태가 갈라지고, 그걸 맞추려고 snapshot·보정·재생 로직이 붙는다. analytic schedule 은 누적이 없다. **같은 시각을 물으면 언제 물어도 같은 답이 나온다.** 재접속 비용과 replay 비용이 동시에 사라진다.

출처 실측 — TheLongSilence 의 교통선은 개체별 지속 시뮬레이션이 아니라 시계에 고정된 analytic path 를 따른다. 먼 교통은 hull 가독성을 포기하고 *화면상 일정 픽셀의 beacon* 으로만 "살아 있음"을 전달한다. 즉 **지각에 필요한 최소 표현까지 같이 내린다** — 계산만 아끼고 표현을 그대로 두면 절감이 안 나온다.

## 적용 판정 (경계가 이 노트의 값이다)

| 대상 | 판정 | 근거 |
|---|---|---|
| ambient 교통·순찰·상업 활동 | ✅ 적용 | 관찰될 뿐 상태를 바꾸지 않음 |
| 시간대별 조명·군중 밀도·소음 | ✅ 적용 | 시각의 함수로 충분 |
| 플레이어 부재 중 *세계 주도 사건 후보 생성* | 🟡 조건부 | 후보 생성엔 유용, 확정은 정본 event 로 |
| 선택·충돌·자원 경쟁이 실제 상태를 바꾸는 NPC | ❌ 불가 | 정본 event/state 필요 — schedule 로 대체하면 사실이 조용히 덮인다 |

**철칙** — **관찰만 되는 것은 계산하고, 상태를 바꾸는 것은 기록한다.** 이 선을 넘기면 persistence §스택 인지 "AI NPC 8상태 분리"가 무너진다(LLM/시뮬 문장이 사실·기억을 덮어쓰는 그 실패 모드와 동형).

## 반영처 (학습→반영 루프)

- **결정론 게임 ambient 레인** — ai-game-production-harness ch.3 결정론 sim 계약과 정합. schedule 은 pure model 안에 두고 renderer 는 읽기만.
- **Penelope 부재시간** — 플레이어 없는 동안의 세계 주도 사건 *후보* 생성. 확정 전개는 작가·정본 경로 유지(메모리 `project_mangwon_penelope_korean_validation` 의 "작가=미시 교정" 경계 불변).
- 즉시 반영 diff 없음 — 위 두 레인 중 하나가 실제 착수될 때 인출. 트리거를 review_trigger 에 명시했다.

## 한계 · 비판 (흡수 4대 규율)

1. **기법 자체는 신규가 아니다.** analytic orbit·deterministic scheduling 은 오래된 관행이다. 신규성은 *발명*이 아니라 **vault 미보유**에 있었다(무스코프 2-패스 grep: `analytic`·`생활감`·`offline progression`·`seed+world_time` 전부 무매치).
2. **출처 신뢰도 상한** — 저장소는 **1 commit 공개** 상태다. 결과물은 볼 수 있으나 진화 과정·회귀 방지 이력은 검증 불가. "Claude Opus 5 가 만들었다"는 About 설명뿐이고 프롬프트·역할 분담·재시도·사람 개입 기록이 0이라 **AI 제작 방법론의 증거로는 채택하지 않았다**(G4 SKIP).
3. **README 과장 1건 교정** — "no assets"는 천체 생성에 한정된 문장이고, 실제로는 `interior_kit.glb` + baked webp 다수가 있다. 정확한 표현은 *외부 아트 팩 의존을 최소화하고 주요 세계 표현을 절차 생성·자체 bake했다*(repo 자체 `bake_interior.py`·`bake_terrain.py`).
4. **선행 지향** — vault 는 이미 결정론 sim 코어를 pure 로 격리하는 규율을 갖고 있다. 이 노트는 그 코어 *안에서* 무엇을 틱하지 않을지 고르는 하위 결정이다. 상위 규율을 대체하지 않는다.

## 관계

ai-game-production-harness(결정론 sim 계약·proof family) · persistence(§AI NPC 8상태 분리 — 상태 변경은 기록) · [Game Economy Control Loop — 순환은 서사가 아니라 계측이다](game-economy-control-loop.md)(같은 패킷 형제 자산) · hermes-loop ③Gate·④Promote · codex-gate
