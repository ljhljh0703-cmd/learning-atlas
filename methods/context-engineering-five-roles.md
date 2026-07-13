---
created: 2026-07-09
updated: 2026-07-09
type: learning
tags: [context-engineering, harness, dispatch, taxonomy, superpowers]
source: [https://arxiv.org/abs/2604.04258, https://github.com/obra/superpowers]
authors: [arXiv-2604.04258, obra]
year: 2026
category: method
---
<!-- Codex 2패킷(context-engineering·superpowers v6.1.1 delta) ③Gate 흡수 — 컨텍스트 역할 분류 + 구현계획 컴파일러. -->

# Context Engineering — 5 역할 분류 + 구현계획 컴파일러

> ③Gate 통과(2026-07-09). 최상위 레버(§4 "토큰·비용 효율 = 컨텍스트 품질 먼저")의 *분류 델타*. 기존 harness 원칙 위 taxonomy 배선 — 신규 개념 아님(merge_existing).

## 1. 5 Context Roles (arXiv 2604.04258)

컨텍스트 조각을 역할로 명시하면 first-pass 성공률↑:

- **Authority** — 불가침 규칙·헌법(CLAUDE.md, LOCKED §, D-NNN).
- **Exemplar** — 정답/오답 예시(few-shot, 안티패턴).
- **Constraint** — 경계·금지(deny-first, 스코프).
- **Rubric** — 검증 기준(성공=무엇, Karpathy #4).
- **Metadata** — 출처·버전·상태(frontmatter, source lock).

## 2. 4단 파이프라인

`Reviewer → Design → Builder → Auditor`. spec→quality 2단 분리(hermes-loop §③)의 상류 버전.

## 3. 구현계획 컴파일러 (superpowers v6.1.1 `d884ae0`, MIT)

`superpowers-teardown`는 discipline skill을 이미 흡수 — 남는 델타 = **implementation-plan compiler**:

- plan 헤더 필수: `Goal / Architecture / Tech Stack / Global Constraints`.
- 각 task: file paths + interfaces + RED/GREEN test cycle + 정확한 commands + expected outputs + commit step.
- **per-task narrow review + final broad review 분리**(무작정 broad review 확대보다 우수).
- file 기반 context-economy 프리미티브: task brief / implementer report / review package / progress ledger.

## 4. 오버클레임 가드 (③Gate 마킹)

- ⚠ "Anthropic 엔지니어 8x 코드 merge" 주장 = **미검증**. 1차 출처 없이 사실 박제 금지.
- ⚠ "Claude가 AGENTS.md 자동 읽음" = 도구 특정 과일반화. 공식 = Claude는 **CLAUDE.md** 읽음. AGENTS.md는 CLAUDE.md에서 import/symlink.

## 5. Apply-or-Park

- **② Parked → 반영 트리거 명기**: 5-roles + impl-plan 헤더를 dispatch-builder·agent-harness에 반영 = **헌법급 SSOT 위성 → `스테이징 영역` 스테이징**(작가 수동 merge, R-01). 본 노드는 정본 참조.
- **▸무관** NPC/게임/창작 직접 트랙 아님(하네스 인프라).
