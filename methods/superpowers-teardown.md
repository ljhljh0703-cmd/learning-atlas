---
created: 2026-06-16
updated: 2026-06-16
type: learning
tags: [skills-framework, coding-agent, methodology, tdd, systematic-debugging, skill-authoring, agent-harness]
source: https://github.com/obra/superpowers
authors: [Jesse Vincent, Prime Radiant]
year: 2025
category: method
---

<!-- obra/superpowers(코딩 에이전트 스킬 프레임워크) 해체분석 — 메타 패턴 추출 및 vault 차용 후보 명세. -->

# Superpowers 해체분석 (obra/superpowers)

> ✅ **confirmed 2026-06-28** — 2026-06-16 vault Claude 직접 해체(WebFetch), 작가 컨펌 완료(frontmatter status: confirmed). 출처 = 공개 repo README + 5개 SKILL.md raw. clean-room(우리 분석·표현, 텍스트 복사 X). star 229k/fork 20.4k = 표시값(외부 재검증 안 함).

> **한 줄**: 코딩 에이전트용 *합성 가능한 스킬 13종 + 워크플로우 강제* 방법론. 마켓플레이스 플러그인으로 배포되나 본질은 public plain-markdown 스킬 — 잠금 없이 차용 가능.
> **핵심 발견**: 진짜 "superpower"는 개별 스킬이 아니라 **모든 discipline 스킬을 관통하는 1개 메타 패턴**(아래 §2).

---

## 1. 무엇이고 왜 인기인가

- 정체 = "코딩 에이전트를 위한 완전한 개발 방법론". 13개 스킬이 개발 단계에 매핑돼 *자동 발동*: `brainstorming` → `using-git-worktrees` → `writing-plans` → `subagent-driven-development`/`executing-plans` → `test-driven-development` → `requesting-code-review` → `finishing-a-development-branch`.
- 차별점 = ad-hoc 프롬프팅 대신 **체계적 프로세스를 강제하는 메타 레이어**. 단일 도구 X.
- 설치: 하네스별 마켓플레이스(Claude Code `/plugin install superpowers@claude-plugins-official`, Gemini/Cursor/Codex/Copilot 각각). **마켓 = 배포·자동업데이트 채널일 뿐, 본질은 plain-markdown** → clone·열람·차용 자유.

## 2. 메타 패턴 (핵심 흡수 대상) — Bulletproofing Against Rationalization

모든 discipline 스킬(`using-superpowers`·`test-driven-development`·`systematic-debugging`)이 **동일한 4부 골격**을 공유한다. 이게 우리가 *먹어야 할 진짜 한 입*이다.

1. **Iron Law (대문자 1문장, 비협상)** — 예: TDD = "실패하는 테스트 없이 프로덕션 코드 없음", 디버깅 = "근본원인 조사 없이 수정 없음".
2. **Phase 프로세스** — 단계별 강제 순서(RED→GREEN→REFACTOR, 4-phase 조사 등).
3. **금지 합리화 표(forbidden rationalizations) + Red-flags 자가점검 목록** — "일단 탐색부터", "이건 너무 간단해서", "이미 N시간 썼으니"(sunk cost), "나중에 테스트하지" 같은 *회피 사고를 명시적으로 박제·차단*. 규칙을 *서술*하지 않고 **구체적 우회로를 봉쇄**한다("letter 위반 = spirit 위반").
4. **When to use / 예외(human 승인 필요)** — 적용 범위 + 탈출구 명시.

> 우리 vault는 규칙(헌법·게이트)은 풍부하나 **이 "금지 합리화 표 + red-flags" 형식이 없다.** 이게 [Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](karpathy-guidelines.md)의 "즉시 거부할 행동"·lessons의 횡단 교훈을 *실행 강제 포맷*으로 끌어올리는 빠진 조각.

## 3. 스킬별 해체 요약

- **using-superpowers (게이트웨이)**: 대화 시작·매 작업 *전* 무조건 스킬 점검. "1%라도 해당되면 응답·역질문 전에 Skill 호출, 선택 아님" + 의사결정 플로우차트 + red-flag 목록("일단 코드베이스 탐색부터" 차단). 우선순위 = 사용자 명시 > 스킬 > 기본동작. → **우리 Hermes ① Dispatch(vault-first) 발동 규율의 강제판.**
- **test-driven-development**: Iron Law "실패 테스트 먼저". RED(최소 테스트, 올바른 이유로 실패 확인)→GREEN(통과시킬 최소 코드만)→REFACTOR(기능추가 금지, 중복제거·네이밍). 예외(prototype/생성코드/config)는 human 승인. → **우리 ③Gate는 테스트 *재현*은 있으나 작성단계 TDD 강제는 없음.**
- **systematic-debugging**: Iron Law "근본원인 조사 없이 수정 없음". 4-phase(근본원인 조사→패턴 분석→가설·테스트→구현). **"3번 수정 실패 시 멈추고 아키텍처를 의심"**. → 디버깅은 우리 약점(fablize investigation-protocol 검토 때 스킵했던 결).
- **subagent-driven-development**: 작업당 *fresh subagent* + 2단 리뷰(spec 준수 → 코드품질 *분리*) + 컨텍스트 사전추출(파일읽기 오버헤드 회피) + 상태(BLOCKED/NEEDS_CONTEXT/DONE_WITH_CONCERNS). "작업 사이 human 체크인 금지"(momentum). → 우리 Codex/Gemini 분업·③Gate와 겹치나 **"spec→quality 2단 분리"는 정련 포인트**. 단 Claude Max 비용상 fan-out 신중.
- **writing-skills (메타)**: Iron Law "실패 테스트 없이 스킬 없음"(스킬 작성에도 TDD). frontmatter 2필수(name + `description: "Use when..."`), **description에 워크플로우 요약 금지**(요약하면 Claude가 본문 안 읽고 description만 따름 = CSO 함정), rationalization 표·red-flags로 bulletproofing, 교차참조는 `@` 금지(컨텍스트 소모)·이름+마커만. → **우리 skill-curator/스킬 작성 컨벤션 강화 후보.**

## 4. 우리 시스템 대비 — 수렴/차용/주의

**🟢 이미 수렴(차용 불요)**:
- `using-git-worktrees` ↔ 우리 worktree-accept(Dual-Track #6, forge 차용). 독립 도달.
- `verification-before-completion` ↔ 우리 ③Gate + reachability(lessons automated≠user-facing).
- `writing-skills` 골격 ↔ 우리 skill-curator + Hermes ⑤Distill(단 메타 패턴은 보강 가치).

**🟡 차용 후보(소화 대상)**:
1. **메타 패턴(§2)** — Iron Law + 금지 합리화 표 + red-flags 포맷. *가장 깊은 한 입.*
2. **게이트웨이 규율** → Hermes ① Dispatch 발동을 red-flag 형식으로 강제 강화 (CLAUDE.md § = 헌법 → 패치 스테이징).
3. **systematic-debugging** → 신규 스킬 또는 agent-harness H-Core 흡수.
4. **TDD 작성단계 강제** → dispatch-builder 검증기준 슬롯 / agent-harness 보강.
5. **subagent 2단 리뷰(spec→quality 분리)** → ③Gate 정련 후보.

**🔴 주의**:
- subagent fan-out 전면 채택 = Claude Max 토큰 곱 → 신중.
- 라이선스 미확인 → 차용은 패턴·아이디어만(clean-room), 텍스트 복사 X.

## 5. 학습→반영 루프 (✅ 전수 흡수 완료 2026-06-16)

- ✅ **① 메타 패턴** → CLAUDE.md §"강제 규율 4부 골격" 신설(merge 완료, HITL §R-01 예외).
- ✅ **② 게이트웨이** → CLAUDE.md ① Dispatch 4부 골격 형식화(보강, AI 직접+보고).
- ✅ **③ systematic-debugging** → agent-harness §"체계적 디버깅" 4부 골격 신설.
- ✅ **④ TDD 작성단계 강제** → dispatch-builder 슬롯3 검증기준 보강.
- ✅ **⑤ 2단 리뷰(spec→quality)** → hermes-loop ③Gate 검증 순서 규율.
- 🟡 (미흡수, 보류) writing-skills 컨벤션 전면 채택 = skill-curator 보강 후보. 메타 패턴 골격으로 충분 → 신규 스킬화는 불요 판단(Karpathy #2). 필요 시 작가 트리거.
