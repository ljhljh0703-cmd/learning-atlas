---
created: 2026-06-24
updated: 2026-06-24
type: learning
tags: [game-design, ai-agent, reverse-planning, vibe-coding, gdd, agent-harness, claudecraft]
source: "ClaudeCraft repo docs/reverse-analysis/11~12 + docs/harness/skill-candidates/game-planning-ai-agent"
category: method
---

# Game Planning AI Agent — 역질문 기반 게임 기획 에이전트

> ⚠️ **임시 (provisional)** — Codex(외부 AI)가 ClaudeCraft repo 산출물(`docs/reverse-analysis/11~12` + skill-candidate)에서 추출, vault Claude ③Gate 검증 통과(출처·환각·계약 대조). 단 작가 명시 컨펌 전이라 `confirmed` 아님 — 권위 결정으로 인용 금지. 작가 컨펌 시 `status: confirmed` 전환.

## 0. 한 줄 정의

게임 기획 AI 에이전트는 사용자의 막연한 게임 아이디어, 레퍼런스, 취향, 바이브를
**역질문으로 구현 결정까지 끌어내는 에이전트**다. 목표는 멋진 GDD 산문이 아니라,
Codex나 다른 구현 에이전트가 바로 움직일 수 있는 **기획서 + 시스템 계약 + 콘텐츠 계약 +
proof-gated dispatch**를 만드는 것이다.

핵심 공식:

```text
감각 / 레퍼런스 / 아이디어
→ 역질문
→ 결정 / 가정 / 미해결 질문 분리
→ GDD + System/Content/UI/Asset/Deploy 계약
→ C-1/C-2/C-3 구현 디스패치
→ proof gate
```

## 1. 출처와 산출물

ClaudeCraft repo에서 다음 산출물을 만든 뒤, Sub-brain 방법론으로 흡수했다.

- `docs/reverse-analysis/11-vibe-coding-implementation-template.md`
  - 역설계 결과를 콘텐츠·시스템·디자인·에셋·UI/UX·배포·홈페이지·QA로 나누는 구현 템플릿.
- `docs/reverse-analysis/12-reverse-planning-usage-guide.md`
  - 역기획서를 실제 게임 구현 디스패치로 바꾸는 사용 설명서.
- `docs/harness/skill-candidates/game-planning-ai-agent/SKILL.md`
  - repo-local candidate skill. 설치/승격은 하지 않았고, 사용자가 검토 후 승격 가능.

근거가 되는 상위 학습:

- [WoC 역기획 — AI 게임 생산 방법론 (10종 해체 종합)](../techniques/woc-ai-gamedev-teardown.md) — WoC 역기획 10종. 결정론 sim, Def/State, asset manifest, UI snapshot/event, proof gate.
- [The New SDLC With Vibe Coding (Google / Addy Osmani)](google-new-sdlc-vibe-coding.md) — vibe coding과 agentic engineering의 차이. 핵심은 검증 방식.
- agent-harness — AI가 안전하게 일하기 위한 source boundary, proof, HITL, return artifact.
- dispatch-builder — 역면접, deny-first scope, done-gate 형식화.
- pre-gdd — 막연한 게임 아이디어를 1장 기획 닻으로 잡는 기존 seed.

## 2. 왜 필요한가

AI에게 "게임답게 만들어"라고 하면 대부분 다음 문제가 생긴다.

- 플레이어가 실제로 반복할 10초 루프가 없다.
- UI, 콘텐츠, 시스템, 에셋이 서로 다른 게임을 말한다.
- 기획 문장은 있지만 어느 파일을 바꿔야 하는지 없다.
- proof가 없어 "되는 것 같음"과 "됨"이 섞인다.
- 사용자가 답하지 않은 취향을 AI가 그럴듯하게 채운다.
- build PASS를 재미 PASS나 visual acceptance처럼 말한다.

게임 기획 AI 에이전트는 이 문제를 막기 위해 **질문을 구현 결정으로 바꾸는 역할**을 한다.
질문은 넓은 브레인스토밍이 아니라, 답하면 코드 구조가 바뀌는 질문이어야 한다.

## 3. 역기획서 사용법

역기획서는 감상문이 아니다. 다음 순서로 채운다.

### 3.1 프로젝트 카드

가장 먼저 아래를 잠근다.

```text
project_name:
core_offer:
target_player:
target_platforms:
session_length:
visual_identity:
local_mode:
source_boundary:
status_label:
```

`core_offer`는 "플레이어가 무엇을 반복하고 왜 다시 하는가"를 한 문장으로 쓴다.
이 문장이 비어 있으면 이후 시스템과 콘텐츠가 흔들린다.

### 3.2 역설계 입력 매트릭스

레퍼런스에서 본 것을 바로 기능으로 옮기지 않는다. 반드시 아래 형태로 바꾼다.

```text
관찰 항목 → 원본 증거 → 왜 중요한가 → local 구현 결정 → 예상 파일 → proof
```

예시:

| 관찰 | local 구현 결정 | proof |
| --- | --- | --- |
| 같은 seed가 같은 런을 만든다 | `GameState.rng` 단일 stream | same-seed JSON smoke |
| 아이템 의미가 즉시 드러난다 | 바닥 라벨 + pickup toast + inventory 설명 | browser pickup assertion |
| 홈페이지 첫 화면이 게임을 바로 보여준다 | 실제 gameplay screenshot/video를 hero에 사용 | desktop/mobile screenshot |

### 3.3 섹션별 계약

최소 섹션:

- 콘텐츠.
- 시스템.
- 디자인.
- 에셋.
- UI/UX.
- 배포.
- 홈페이지.
- QA/proof.

각 섹션은 "원한다"가 아니라 "어디에 구현하고 무엇으로 검증할지"까지 가져야 한다.

### 3.4 program → packet → phase → card

큰 게임 기획은 다음 네 계층으로 쪼갠다.

```text
program: 전체 목표
  packet: 같은 성격의 작업 묶음
    phase: 한 세션에 끝낼 구현/QA 단위
      card: 파일/기능 단위 작업
```

좋은 phase는 리스크가 하나다. 예를 들어 결정성, 콘텐츠 무결성, UI overflow,
asset loading, deploy routing을 한 phase에 섞지 않는다.

## 4. 게임 구현에서 정말 중요한 것

### 4.1 플레이 약속과 10초 루프

세계관보다 먼저 결정할 것은 플레이어가 10초 동안 반복할 행동이다.

```text
verb: 이동 / 조준 / 선택 / 회피 / 수집 / 건설 / 대화
risk: 피해 / 손실 / 시간압박 / 실수 / 길잃음 / 자원낭비
reward: 성장 / 새 선택지 / 새 장소 / 이야기 / 숙련 / 수집
feedback: 숫자 / 소리 / 흔들림 / 로그 / 애니메이션 / UI 변화
```

이 루프가 없으면 콘텐츠를 늘려도 게임이 아니라 목록이 된다.

### 4.2 결정성

AI 구현에서는 결정성이 생산성이다.

- seed는 런 진입 시 한 번 고정한다.
- RNG stream은 가능한 하나로 시작한다.
- draw order를 주석과 smoke로 잠근다.
- 같은 입력 로그가 같은 snapshot을 만들어야 한다.
- visual frame timing은 sim truth가 아니다.

ClaudeCraft R-DET-1/R-010a에서 이 원칙이 직접 증명됐다. seed-modulo와 별도 RNG가 섞이면
같은 seed proof가 깨진다.

### 4.3 데이터 드리븐 콘텐츠

콘텐츠는 코드 분기가 아니라 authored data여야 한다.

- `ClassDef`, `EnemyDef`, `ItemDef`, `ZoneDef`, `QuestDef`를 둔다.
- 런타임 상태는 `templateId`로 Def를 참조한다.
- 없는 id는 조용히 skip하지 말고 실패시킨다.
- 새 적/스킬/기믹은 optional field + 단일 hook으로 시작한다.

이 구조가 있어야 AI가 콘텐츠를 대량으로 추가해도 엔진 로직을 망가뜨리지 않는다.

### 4.4 시스템 수렴점

중요한 효과는 단일 함수로 모아야 한다.

- damage는 `dealDamage` 또는 동등 함수로 모은다.
- death는 한 곳에서 처리한다.
- drop은 death path에 붙인다.
- pickup은 inventory path에 붙인다.
- quest progress는 kill/pickup/use event에 붙인다.

수렴점이 없으면 새 기능 하나가 전투, UI, 퀘스트, 저장을 동시에 흔든다.

### 4.5 게임 UI는 상태판이다

게임 UI는 웹 UI가 아니다. 플레이 중 판단을 돕는 상태판이다.

- always-visible 정보와 modal 정보를 나눈다.
- snapshot과 event stream을 분리한다.
- 조작 힌트는 첫 플레이에 보이고, 숙련자에게는 방해되지 않아야 한다.
- 전투 피드백은 최소 두 채널을 쓴다. 예: floating text + log.
- 작은 viewport와 모바일/터치를 별도 proof로 확인한다.

### 4.6 에셋 manifest와 swap 전략

에셋은 "나중에 그림 교체"가 아니다. 처음부터 교체 가능해야 한다.

- placeholder와 final asset은 같은 manifest shape를 통과한다.
- gameplay code에 파일 경로를 박지 않는다.
- logical id와 asset id를 분리한다.
- source/license/approval state를 기록한다.
- asset 교체는 renderer/loader/manifest에서 끝나야 한다.

ClaudeCraft Phase C AUTO의 핵심 성과도 이 원칙이다. 새 에셋은 manifest 한 줄과 sync
파이프라인으로 들어와야지, 렌더러를 매번 고치면 안 된다.

### 4.7 배포와 홈페이지

게임을 구현했다면 리뷰어가 만질 수 있어야 한다.

- build command와 preview command를 고정한다.
- package path와 hash를 남긴다.
- known gaps를 숨기지 않는다.
- homepage 첫 viewport에는 실제 gameplay visual과 play/download CTA가 있어야 한다.
- 포트폴리오용이면 proof/evidence link를 숨기지 않는다.

### 4.8 proof와 acceptance 분리

항상 분리한다.

| 상태 | 의미 |
| --- | --- |
| `PASS` | 명령이 실행됐고 gate를 통과했다. |
| `PROOF_READY_NOT_ACCEPTED` | proof는 있지만 사용자의 미감/재미/방향 수락은 별도다. |
| `N-A` | 현재 slice에는 적용되지 않는다. 이유를 쓴다. |
| `DEFERRED` | 일부러 뒤로 미뤘다. trigger를 쓴다. |
| `BLOCKED` | 외부 입력 없이는 진행할 수 없다. |

특히 `visual proof`, `fun feedback`, `user acceptance`를 같은 말로 쓰면 안 된다.

## 5. 게임 기획 AI 에이전트 운영 프로토콜

### 5.1 Mission

사용자의 아이디어를 구현 가능한 계획으로 잠근다.

산출해야 하는 결정:

- player promise.
- 10-second loop.
- content scope.
- deterministic system contract.
- UI and feedback requirements.
- asset pipeline.
- deploy/homepage surface.
- proof gates.
- explicit non-goals.

### 5.2 모드

**Mode A — Concept Intake**

막연한 아이디어를 받을 때. 산출물은 project card, 10초 루프, assumption ledger, 다음 질문 3개.

**Mode B — Reverse-Design From Reference**

레퍼런스 게임이나 바이브가 있을 때. 산출물은 observation matrix, borrow/reject 목록,
implementation mapping, proof risks.

**Mode C — GDD Lock**

답이 충분할 때. 산출물은 one-page GDD, system/content/asset/UI/deploy/homepage contract,
proof matrix.

**Mode D — Dispatch Builder**

Codex나 구현 에이전트에 넘길 때. 산출물은 AGENTS식 8필드와 C-1/C-2/C-3 순차 slice.

### 5.3 1차 역질문 7개

게임 기획 시작 시 우선 이것만 묻는다.

1. 플레이어가 첫 10초에 반복할 핵심 행동은 무엇인가?
2. 실패는 무엇으로 느껴져야 하는가?
3. 보상은 숫자 성장, 새 선택지, 새 장소, 새 이야기 중 무엇이 중심인가?
4. 한 판의 길이는 어느 정도인가?
5. 시각 정체성은 픽셀, 2D 일러스트, 3D, 텍스트 중심 중 어디에 가까운가?
6. 반드시 첫 버전에 들어가야 하는 콘텐츠 단위는 무엇인가?
7. 이번 버전에서 의도적으로 하지 않을 것은 무엇인가?

나쁜 질문:

```text
어떤 게임을 만들고 싶나요?
```

좋은 질문:

```text
플레이어가 첫 10초에 반드시 해야 하는 행동은 전투, 탐험, 회피, 선택 중 무엇에 가장 가깝습니까?
```

좋은 질문의 조건:

- 답이 구현 구조를 바꾼다.
- 선택지가 서로 배타적이다.
- 답하지 못해도 임시 가정을 명시할 수 있다.

### 5.4 출력 형식

```text
# Game Planning Packet

## 1. Project Card
project_name:
core_offer:
target_player:
target_platform:
session_length:
visual_identity:
source_boundary:
status:

## 2. Locked Decisions
- D-001:

## 3. Assumptions
- A-001:

## 4. Open Questions
- Q-001:

## 5. 10-Second Loop
verb:
risk:
reward:
feedback:

## 6. Content Contract
defs:
state:
ids:
validation:

## 7. System Contract
loop:
rng:
state:
commands:
events:
save:

## 8. Design/UI Contract
always_visible:
feedback_channels:
input_policy:
first_viewport:

## 9. Asset Contract
placeholder:
manifest:
final_swap:
license:

## 10. Deploy/Homepage Contract
build:
preview:
package:
homepage:
known_gaps:

## 11. Proof Matrix
sim:
content:
asset:
ui:
deploy:
homepage:
user_acceptance:

## 12. Implementation Dispatch
C-1:
C-2:
C-3:
```

### 5.5 Done gate

구현으로 넘겨도 되는 기획 packet은 다음을 포함해야 한다.

- core offer 한 문장.
- 첫 10초 루프.
- 하지 않을 것 목록.
- content Def/State 분리.
- deterministic 또는 intentionally non-deterministic system policy.
- UI always-visible 목록.
- asset manifest/swap 정책.
- deploy target.
- homepage first-viewport 계획.
- proof matrix.
- implementation dispatch ladder.

빠진 항목이 있으면 `DRAFT`로 표시하고 다음 최소 질문을 묻는다.

## 6. Sub-brain 사용 규칙

이 방법론은 `game-design` 관련 세션의 시작점으로 쓸 수 있다.

권장 흐름:

1. `CLAUDE.md`와 `wiki/hot.md`로 현재 프로젝트 context 확인.
2. 신규 게임이면 pre-gdd 또는 이 문서의 1차 역질문 7개로 시작.
3. 레퍼런스 기반이면 [WoC 역기획 — AI 게임 생산 방법론 (10종 해체 종합)](../techniques/woc-ai-gamedev-teardown.md)식 observation matrix를 먼저 작성.
4. 구현으로 넘기기 전에 dispatch-builder의 deny-first scope와 done-gate로 재작성.
5. Codex 구현이면 repo `AGENTS.md` 8필드를 반드시 포함.

이 문서는 Sub-brain의 권위 문서가 아니라 confirmed learning이다. 특정 프로젝트에 적용할 때는
각 프로젝트의 `*-AGENTS.md`, GDD, source lock이 우선한다.

## 7. 금지

- 사용자가 답하지 않은 취향을 AI가 대신 확정하지 않는다.
- 레퍼런스의 고유명, 퀘스트 문구, 아이템 테이블, 에셋을 source boundary 없이 복사하지 않는다.
- mood word만 남기지 않는다. 모든 mood word는 구현 표면과 proof로 바꾼다.
- 기획 단계에서 meta-script, audit, guard, heartbeat를 새로 만들지 않는다.
- proof-ready를 complete로 보고하지 않는다.
- user acceptance가 필요한 항목을 AI가 자체 승인하지 않는다.

## 8. 적용 메모

ClaudeCraft에서는 이 방법론이 A-011/A-012 문서와 repo-local skill candidate로 남아 있다.

- 사용 설명서: `docs/reverse-analysis/12-reverse-planning-usage-guide.md`
- 에이전트 후보: `docs/harness/skill-candidates/game-planning-ai-agent/SKILL.md`

후속 사용 후보:

- 신규 게임 GDD 시작.
- ClaudeCraft B 전환 이후 "가치 있는 게임" 방향 재기획.
- libgdx/hwigi 계열의 재미 피드백을 구현 dispatch로 바꾸는 작업.
- 포트폴리오 홈페이지에서 게임 기획/구현 하네스를 설명하는 케이스 스터디.
