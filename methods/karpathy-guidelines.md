---
created: 2026-04-25
updated: 2026-06-16
type: learning
tags: [learning, methods, skill, behavioral-overlay, harness, claude-code, codex, plugin]
source: https://github.com/forrestchang/andrej-karpathy-skills
category: method
authors: Forrest Chang
---

# Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)

> 출처: https://github.com/forrestchang/andrej-karpathy-skills (Forrest Chang)
> 원전: Andrej Karpathy의 LLM 코딩 함정 관찰 트윗
> 학습 동기: [Diagram-Design Skill — Editorial 다이어그램을 자동화한 Claude Code skill](diagram-design-skill.md) 이후 두 번째 skill 표본. **다른 archetype 비교** 위해.

## 한 줄 요약

Karpathy가 지적한 LLM 코딩 4대 함정 (잘못된 가정 / 과복잡화 / 인접 코드 침범 / 약한 성공 기준) 을 **66줄짜리 단일 CLAUDE.md** 또는 **plugin SKILL.md (frontmatter 포함 67줄)** 로 박은 behavioral overlay. 도메인 무관, 모든 코딩 작업에 cross-cut.

## 4 원칙

### 1. Think Before Coding — 가정 surface, 혼란 hide 금지
- 가정은 명시. 불확실하면 묻기.
- 다중 해석 가능하면 골라서 가지 말고 다 제시.
- 더 단순한 길 있으면 push back.
- 막히면 멈추고 *무엇이* 불명확한지 명명.

### 2. Simplicity First — 요청 외 코드 0
- 요청하지 않은 기능 X
- 단발 사용 코드 추상화 X
- "유연성 / 설정 가능성" 미리 만들기 X
- 불가능한 시나리오 error handling X
- 200줄을 50줄로 줄일 수 있으면 다시 써.
- **테스트:** "시니어가 보면 과복잡이라 할까?" → 그렇다면 단순화.

### 3. Surgical Changes — 본인이 만든 쓰레기만 청소
- 인접 코드 / 코멘트 / 포매팅 "개선" 금지.
- 멀쩡한 코드 리팩토링 금지.
- 본인 취향 다르더라도 기존 스타일 따라가기.
- 무관한 dead code 발견 시 *언급*하고 *지우진* 마.
- 본인 변경이 만든 orphan만 정리.
- **테스트:** 모든 변경 라인이 사용자 요청에 직접 trace 되는가.

### 4. Goal-Driven Execution — 검증 가능 성공 기준
- "validation 추가" → "invalid input 테스트 작성, 통과시키기"
- "버그 수정" → "재현 테스트 먼저, 통과시키기"
- "X 리팩토링" → "전후 테스트 통과 보장"
- 강한 기준이면 LLM이 독립 루프 가능. 약한 기준 ("make it work")은 끝없는 clarify 호출.

## 구조

```
andrej-karpathy-skills/
├── CLAUDE.md                                # 65줄 — drop-in 프로젝트 파일
├── EXAMPLES.md                              # 522줄 — 원칙당 before/after 사례
├── README.md / README.zh.md                 # 영중 이중 문서
├── CURSOR.md                                # Cursor IDE 변종
├── .claude-plugin/                          # Claude Code plugin metadata
├── .cursor/                                 # Cursor 설정
└── skills/karpathy-guidelines/SKILL.md     # frontmatter 있는 plugin 형
```

**두 가지 배포 형태:**
1. `CLAUDE.md` — 어떤 프로젝트든 루트에 떨어뜨리면 작동
2. `skills/karpathy-guidelines/` — Claude Code plugin 시스템 (frontmatter 있음)

EXAMPLES.md만 본문 길고, CLAUDE.md / SKILL.md는 거의 동일한 65~67줄.

## 두 skill archetype 비교 ([Diagram-Design Skill — Editorial 다이어그램을 자동화한 Claude Code skill](diagram-design-skill.md) vs 이것)

| 차원 | Diagram-Design Skill | Karpathy Guidelines |
|------|------|------|
| **archetype** | 도메인 생성 (generative) | 행동 교정 overlay (corrective) |
| **표면적** | SKILL.md 400줄 + references 17 + assets 변종 다수 | CLAUDE.md 65줄, 끝 |
| **로딩** | progressive disclosure (필요 시 reference 로드) | 항상 로드, 항상 적용 |
| **출력** | self-contained HTML 다이어그램 | 출력 없음 — 다른 작업의 메타-가드 |
| **도메인** | 다이어그램 그리기 한정 | 모든 코딩 cross-cut |
| **게이트** | pre-output taste gate (체크리스트) | "would a senior say overcomplicated?" 자체 질문 |
| **anti-pattern** | 시각 함정 (JetBrains Mono blanket 등) | 행동 함정 (silent assumption 등) |
| **ROI 시점** | 다이어그램 그릴 때 | **모든** 코드 작성 시 |

→ **둘은 보완재.** Schematic = 손, Karpathy = 자세. 동시 적용 가능.

## NPC harness 적용 (A 단계 입력 추가)

지난 [Diagram-Design Skill — Editorial 다이어그램을 자동화한 Claude Code skill](diagram-design-skill.md) 의 6 패턴 위에 **behavioral overlay layer** 한 겹 더:

```
npc-harness/
├── SKILL.md                   # 카탈로그 (Schematic 형)
├── BEHAVIOR.md                # ← 새로 추가 (Karpathy 형)
│   ├─ Think Before Generating  # NPC 응답 전 가정 surface
│   ├─ Simplicity First         # 한 마디로 끝날 응답을 5문장 만들지 마
│   ├─ Surgical Memory Writes   # 무관한 memory 수정 금지
│   └─ Goal-Driven Dialogue     # 대화 목표 명시 (없으면 chat 무한 루프)
├── references/...             # (Schematic 형)
└── templates/...
```

NPC 작가에게 직접 이식되는 4 원칙 변형:

| Karpathy 원칙 | NPC 작가 변형 |
|---|---|
| Think Before Coding | **Think Before Generating** — 사용자 의도 다중 해석 시 NPC가 *되묻기*. 추측해서 답하지 마. |
| Simplicity First | **Brevity First** — 캐릭터 voice가 짧으면 짧게. 설명 늘리지 마. (RoleLLM voice fidelity 위반 = 과복잡) |
| Surgical Changes | **Surgical Memory Writes** — Reflection이 무관한 과거 기억 *재해석*하지 마. 본인 회차 사건만 정리. (Park Memory Stream 위생) |
| Goal-Driven Execution | **Goal-Driven Dialogue** — 챕터 내 NPC 목표 명시 ("플레이어와 신뢰 형성" / "정보 추출" / "혼란 야기"). 없으면 무한 잡담. |

## 인사이트

1. **Skill 크기와 가치는 무관.** 65줄짜리도 cross-cut 가치 충분. NPC harness BEHAVIOR.md도 작게 시작.
2. **Behavioral overlay는 별도 파일로.** 도메인 skill에 섞으면 진짜 함정 묻혀버림. Karpathy처럼 분리.
3. **EXAMPLES.md의 가치.** 원칙은 65줄이지만 사례는 522줄. NPC harness도 `EXAMPLES.md`로 anti-pattern 사례 누적 (예: "이렇게 NPC가 metric trap에 빠짐" — Sakana 경고의 NPC 버전).
4. **두 형태 동시 배포 (CLAUDE.md + plugin SKILL.md)** — 진입 장벽 다른 사용자 모두 잡기. NPC harness도 stand-alone 모드 + plugin 모드 둘 다 가능.

## 연결

- 비교 표본: [Diagram-Design Skill — Editorial 다이어그램을 자동화한 Claude Code skill](diagram-design-skill.md) (다른 archetype, 보완재)
- 메타 비교: [DESIGN.md — 코딩 에이전트용 디자인 시스템 명세](design-md.md) (정적 명세) → [Diagram-Design Skill — Editorial 다이어그램을 자동화한 Claude Code skill](diagram-design-skill.md) (실행 명세) → [Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](karpathy-guidelines.md) (행동 overlay) — 3 axis
- 관련: [Everything Claude Code (ECC) — 에이전트 harness 성능 최적화 시스템](everything-claude-code.md) (D 단계 평가 시 Karpathy 4원칙 ECC에 박혀있는지 체크)
- 직접 적용: NPC harness `BEHAVIOR.md` 신설 근거
- 작가성과의 연결: 2026-04-25-npc-author-ethics 의 "한계 정직 명시"가 Karpathy의 "Surface assumptions"와 동형 — 작가의 메타 정직성.
- 동족 도구: [Ouroboros — Spec-First Agent OS](ouroboros.md) (5-stage spec-first loop — Karpathy 원칙을 *루프 단계* 로 운영화한 형태). [Codex CLI Prompting — 내재화 노트](codex-cli-prompting.md) §1.1 Bias to Action (Karpathy 4 원칙과 Ouroboros 의 절충안)

---

## 13. 배포 옵션 (2026-05-03 갱신)

### 13.1 Claude Code plugin (권장)

Claude Code 세션 내에서:
```
/plugin marketplace add forrestchang/andrej-karpathy-skills
/plugin install andrej-karpathy-skills@karpathy-skills
```
모든 프로젝트에 cross-project 적용. plugin 위치: `.claude-plugin/`.

### 13.2 CLAUDE.md per-project (수동)

신규 프로젝트:
```bash
curl -o CLAUDE.md https://raw.githubusercontent.com/forrestchang/andrej-karpathy-skills/main/CLAUDE.md
```

기존 프로젝트 append:
```bash
echo "" >> CLAUDE.md
curl https://raw.githubusercontent.com/forrestchang/andrej-karpathy-skills/main/CLAUDE.md >> CLAUDE.md
```

### 13.3 Cursor / 다른 IDE

repo 가 `.cursor/rules/karpathy-guidelines.mdc` 도 제공. Cursor 사용 시 자동 적용.

---

## 14. 우리 시스템 통합 현황 (2026-05-03)

| 시스템 | Karpathy 4 원칙 명시 여부 | 비고 |
|--------|--------------------------|------|
| Sub brain CLAUDE.md | 부분 — "중요 원칙" §에 정신 포함, 4 원칙 명시 X | 작가 동의 후 명시 추가 가능 |
| Sub brain GEMINI.md | 부분 — Pragmatic 톤 + SSOT 권한 분리에 정신 포함 | Simplicity First 가 토큰 절감과 직결 — 명시 가치 큼 |
| hwigi-tower-AGENTS.md | 부분 — §11.3 Bias to Action / §11.4 Loggy 금지 / §5.3 절대 금지에 정신 포함 | 4 원칙 인용 한 줄 추가 가능 |
| mirofish-lab-AGENTS.md | 부분 — Operator 입장 + 두 갈래 분리 (MP5) 가 Surgical Changes 정합 | 동일 |
| design-agenda (Mode 매핑) | Goal-Driven Execution 강화 — Ambiguity ≤ 0.2 게이트가 "verifiable success criteria" 의 정량화 | 흡수 완료 |
| design-journal | Surface Assumptions 강화 — *기각된 매력* + *재검토 조건* 항목이 4 원칙 #1 정합 | 흡수 완료 |

### 14.1 적용 완료 (2026-05-03, 작가 동의)

4 원칙을 **Sub brain 차원 보편 메타 규칙** 으로 승격:

| 파일 | 변경 |
|------|------|
| CLAUDE.md | §"메타 행동 원칙" 신설 — 4 원칙 본문 + 적용 범위 표 + 즉시 거부 행동 사례 + "본 §가 모든 프로젝트 컨벤션 위 우선" 룰. §"의사결정 일반 워크플로우" 신설 |
| GEMINI.md | §"4-pre 메타 행동 원칙 (CLAUDE.md 상속)" 신설 — Gemini 토큰 효율과 #2 Simplicity 직결 명시 |
| hwiglija-tower-AGENTS.md | §0 "메타 상속" 신설 — 4 원칙 한 줄씩 + "본 페이지 §11/§5 는 프로젝트 특화 구체화이지 대체 아님" |
| mirofish-lab-AGENTS.md | 동일 |

→ 모든 AI (Claude/Gemini/Codex), 모든 프로젝트 (현재·미래), 모든 의사결정에 자동 적용.

### 14.2 Plugin 설치 (보류, 작가 미결정)

`/plugin marketplace add forrestchang/andrej-karpathy-skills`
`/plugin install andrej-karpathy-skills@karpathy-skills`

장점: Claude Code 의 *모든* 세션에 자동 적용. plugin 시스템이 cross-project.
단점: Claude Code 의존 — Codex / Gemini CLI 에는 영향 X (그쪽은 §14.1 의 컨벤션 파일이 담당).
현 상태: §14.1 의 컨벤션 파일 인용으로 **이미 cross-AI / cross-project 커버**. plugin 추가 도입은 *중복* 일 수 있어 보류.

작가가 plugin 추가 도입 원하면 한 줄 명령으로 가능.

### 14.3 추가 사례 — #4 Goal-Driven 따름: "automated proof ≠ user-facing proof" (2026-06-07, W23 회고 승격)

> `proposed_by: external_ai (via memory)` · `confirmed_by: user` · `status: confirmed`. 출처: libgdx-rogue-os memory W23 (사용자 교정 2회 — "실질적 효과 검증해봐" + "뭐가 뭔지 모르겠노").

#4 Goal-Driven Execution 의 *검증 기준 함정* 사례. **자동/스모크/synthetic 통과는 user-facing flow 의 증명이 아니다.**

- smoke / auto-exit run = 렌더 루프 진입·종료 증거이지 UI 가시성·조작성 증거 아님.
- "runnable" ≠ "플레이어가 무엇이 무엇인지 식별 가능".
- → 수동 user-path QA (가시성·판독성·실조작 흐름) 를 *별도 게이트*로 유지. synthetic/smoke test 를 user-facing flow 의 *유일* 증거로 쓰지 말 것.
- 적용처: 모든 프로젝트의 검증 단계. 게임 측 구체화 = `hermes-game-dev-pipeline` Core Loop #4 (smoke ≠ visible/manual QA).

### 14.4 추가 사례 — "progress.md는 history, live source가 진실" (2026-06-20, W25 회고 승격)

> `proposed_by: external_ai (via memory)` · `confirmed_by: user` · `status: confirmed`. 출처: 2026-W25 §20 StarLink 포폴 (작가 직접 적발 — "공개 레포라 치명").

#3 Surgical Changes + #1 Think Before Coding 의 *출처 신뢰 함정* 사례. **`progress.md` 는 시행착오 history (폐기된 과거 시도 포함) — 현재 코드의 진실이 아니다.**

- `progress.md` 의 서술(Silero VAD 도입 / 마이크 즉시 mute / 수동 락 코드)이 현재 소스와 정반대로 기술됨.
- README (코드와 동기화) 는 정확했음 — README ⊃ 코드 동기화 = 신뢰 출처.
- → **기술 서술(포폴·이력서)은 `progress.md` 가 아닌 live source grep 을 정본 대조**로 써야 한다.
- 적용처: 포폴·이력서·케이스스터디·기술 문서 등 *외부 공개* 기술 서술 전체. 자가검증 "source-verified" 라 적었어도 *실제 검증 범위* 를 명시 (verifier-claims-need-regate 재현 — [검증자의 주장도 환각이다 — 강한 주장은 1차 출처로 재-Gate](verifier-claims-need-regate.md)).

---

## 15. 변경 이력

- 2026-04-25 — v1.0. 4 원칙 정리, NPC harness BEHAVIOR.md 적용, [Diagram-Design Skill — Editorial 다이어그램을 자동화한 Claude Code skill](diagram-design-skill.md) 비교
- 2026-05-03 — v1.1. forrestchang plugin 배포 옵션 §13 추가. §14 우리 시스템 통합 현황 매트릭스. 4 원칙을 Sub brain 보편 메타 규칙으로 승격 (CLAUDE.md §"메타 행동 원칙" + GEMINI.md §4-pre + 양 AGENTS.md §0 메타 상속).
- 2026-06-07 — v1.2. §14.3 추가 사례 신설 — #4 Goal-Driven 따름 "automated/smoke proof ≠ user-facing proof" (libgdx-rogue-os W23 회고 승격).
