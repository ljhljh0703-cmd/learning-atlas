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

## 3.5 컨텍스트를 *변수*로 — RLM (arXiv 2512.24601v3)

<!-- 2026-08-10 ③Gate 보강 · 출처 = RLM 논문 full-text + 저자 구현 `72d6940` · 패킷 `~/Documents/Codex/2026-08-08/x-loopx-ix-prime-agent-teardown/` · draft: external_ai (via codex), gate: vault Claude. vault 전역 grep 에서 `RLM`·`recursive language model`·`2512.24601` 무결과 → 신규 델타로 판정. -->

위 §1~3 은 컨텍스트를 *무엇으로 채울지*(역할·순서·계약)의 축이다. RLM 은 다른 축을 더한다 — **긴 입력을 프롬프트에 넣지 않고 REPL 환경의 *변수*로 둔다**(`context as environment`). 루트 모델이 그 변수를 프로그램적으로 엿보고(peek)·분해하고·변환하고, 선택한 슬라이스에만 서브모델을 호출한다. 4개 롱컨텍스트 과제에서 기반 모델 윈도우를 **한 자릿수 배 이상** 넘는 입력을 처리하며 base·compaction·retrieval·coding-agent 베이스라인을 평균 API 비용 동급에서 자주 앞섰다.

vault 와의 관계 — 이건 `RTK`·`Progressive Disclosure`(헌법 §4)의 **상류 일반화**다. RTK 는 "불필요한 읽기를 하지 마라"는 *절제* 규율이고, 이쪽은 "읽을 대상을 주소 지정 가능한 데이터로 두고 필요한 조각만 산다"는 *기판* 설계다. 실제 vault 등가물이 이미 있다 — grep·line-range Read·🗺️라우팅맵으로 좁혀 읽는 흐름이 정확히 "전량 적재 없이 슬라이스 구매"다([Is Grep All You Need? — 에이전트 검색에서 grep vs 벡터 RAG (arXiv 2605.15184)](../techniques/agentic-search-grep-vs-vector.md) 의 grep 우위와 같은 방향). **즉 새 도구가 아니라 기존 습관의 이름과 근거**.

⚠️ 논문이 스스로 적은 한계 — **무제한 컨텍스트가 아니다**. 서브콜 비용 폭발 위험 · 런타임·비용 분산이 큼 · 순차 호출로 느림 · 모델별 프롬프트 수정 필요 · 최종 답 신호가 brittle · 약한 코딩 모델에선 열화. **일부 과제는 이 스캐폴드에서 오히려 나빠졌다.** 따라서 "context rot 해결"·"무한 컨텍스트" 류로 인용 금지 — 조건부 기법이다.

## 4. 오버클레임 가드 (③Gate 마킹)

- ⚠ "Anthropic 엔지니어 8x 코드 merge" 주장 = **미검증**. 1차 출처 없이 사실 박제 금지.
- ⚠ "Claude가 AGENTS.md 자동 읽음" = 도구 특정 과일반화. 공식 = Claude는 **CLAUDE.md** 읽음. AGENTS.md는 CLAUDE.md에서 import/symlink.

## 5. Apply-or-Park

- **② Parked → 반영 트리거 명기**: 5-roles + impl-plan 헤더를 dispatch-builder·agent-harness에 반영 = **헌법급 SSOT 위성 → `스테이징 영역` 스테이징**(작가 수동 merge, R-01). 본 노드는 정본 참조.
- **▸무관** NPC/게임/창작 직접 트랙 아님(하네스 인프라).
