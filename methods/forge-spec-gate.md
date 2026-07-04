---
created: 2026-06-15
updated: 2026-06-15
type: learning
tags: [spec-gate, hooks, agent-harness, hermes, dual-track, codex, clean-room]
source: https://github.com/SihyeonJeon/why-was-fable-banned
authors: [SihyeonJeon]
year: 2026
category: method
---

<!-- why-was-fable-banned spec-gate 해체 + 우리 ③Gate/Dual-Track 차용. research-relay GPT ④Gate PASS(clean-room). -->

# Forge Spec-Gate (why-was-fable-banned) — 차용 해체

> **한줄**: AI 코딩 에이전트가 `.forge/spec.json`(deterministic gate) 통과 전 *구현 편집을 차단*하는 설치형 훅. 우리 ③Gate·H-09·Karpathy #4·deny-first 의 *코드 강제 구현체*. research-relay GPT ④Gate PASS(clean-room·환각0). **차용은 설계만**(MIT, 코드 이식 X).
> **정직성**: repo 저자 본인이 과거 벤치 주장 철회(`<2×` 못 맞춤 인정)·**품질 lift 0**(10/10 동률 = gate 는 capability 아닌 *과정·증거·감사가능성* 강제). = 우리 agent-harness ②Apply 명제([Fable 5 프롬프팅 (공식 가이드)](fable-5-prompting.md) "harness ≠ ceiling")의 외부 실증.

## 메커니즘 (clean-room 서술)
- **spec gate** (`gate_spec`): grade(LIGHT/STANDARD/HEAVY)별 필드 검사. restated_goal 필수·raw_goal 과 동일하면 fail·acceptance verify.value ≥1. STANDARD+: non_goals≥1·rejected_alternatives≥2(+broken_boundary)·risks severity+mitigation·high/blocking risk 는 acceptance_ref·invariant≥1·must_read 경로 실존. `GRADE` 파일이 모델의 grade 다운그레이드 우회 차단.
- **done gate** (`gate_done`): spec 재검사 + acceptance 마다 evidence 필수 + **fake marker(`not run`·`assumed`·`would pass`·`tbd`·`pending`) → fail** + forbidden_paths ↔ 실제 edit log(`.forge/edits.txt`) 대조.
- **강제 배선**: Claude Code = `PreToolUse` 훅으로 SPEC fail 시 편집 차단(exit 2)·`PostToolUse` 로 edit 경로 기록·`UserPromptSubmit` 로 grade contract 주입. **Codex headless = `PreToolUse` 가 edit 못 막음**(edit 가 apply_patch 아닌 native file_change) → **worktree-accept**(격리 worktree 작업 → 통과 diff 만 `apply --index`).
- **semantic judge** (`forge_judge.py`): deterministic gate 가 못 보는 의미 품질 0–2 rubric, *hot path 밖*(HEAVY/corpus 한정). deterministic gate + acceptance command 가 authoritative.

## 우리 시스템 차용 (3종)
1. **✅ fake-evidence marker 차단 (반영 완료 2026-06-15)** — 완료/acceptance 주장의 `not run`·`assumed`·`would pass`·`tbd`·`pending` 등을 게이트가 flag. RETURN §③ 게이트에 추가. = H-12(정직 N/A)·Fable 공식 #5(audit claims)의 문자열 수준 가드.
2. **🟡 Codex worktree-accept (HITL 패치 스테이징)** — 격리 worktree → 통과 diff 만 반영. 우리 Dual-Track("외부 AI = RETURN 제출, ③Gate 후 반영")의 *git 수준 자동화* 후보. 헌법 §Dual-Track 영향 → 패치 스테이징, 작가 merge 대기.
3. **🟡 헤드리스 Codex PreToolUse 미차단 사실** — `codex exec --json` 에서 훅이 편집 못 막음(native file_change). → 우리 Codex 위임이 *훅 차단*에 의존하지 말 것(RETURN+③Gate, 또는 worktree-accept). 각 프로젝트 repo `*-AGENTS.md` 갱신 시 반영 후보.

## 미확인 (재외주 시)
- `execpolicy.rules.template`·`adapters/claude-code/settings.json`·`bench/quality/grade.py` = raw fetch 실패(저자 주장으로만). 벤치 재현 미수행. 상세 EVAL GPT 7건째.

## 차용 확장 — NL 컨벤션 QA 3-역할 루프 (Woowahan i18n ESLint)
<!-- proposed_by: external_ai (via codex) · confirmed_by: user · 2026-07-04 -->
- **사례** (source-reported): 우아한형제들 i18n 번역 누락을 커스텀 ESLint(AST) 룰로 잡은 techblog 케이스([techblog.woowahan.com/26388](https://techblog.woowahan.com/26388/)). ⚠ 직접 curl 403 차단·브라우저 추출이 유일 경로·플러그인 코드 비공개 → 수치·구현 세부 독립 재현 X.
- **델타 = 역할 3분할 루프**: `deterministic detect(AST 린트) → LLM correct → human escalate`. 위 forge 의 "deterministic gate + semantic judge" 2분할에 *교정 역할*을 더한 확장. 자연어 컨벤션(번역 API 미경유 노출 문자열 등)도 위반 형태를 좁히면 정적 분석으로 탐지 가능.
- **핵심 신규 메커니즘**: **lint error message = AI 교정 프롬프트**. 에러를 "실패 통보"가 아니라 *다음 에이전트 행동을 좁히는 인터페이스*(위반 원인+교정 방향 삽입)로 설계 = §"fake-evidence marker"·H-12 evidence 인터페이스의 correction 판.
- **의도적 거부**: 자연어 교정엔 **autofix 미채택** — 결정론 탐지는 하되 NL 교정은 LLM/human 에 남긴다(자동 치환 = 오교정 위험). 결정론이 *탐지*까지만 authoritative 라는 forge 원칙과 정합.
- **재사용처**: 글쓰기 fidelity·로컬라이징·NPC 대사/기억/상태 invariant·에이전트 코드리뷰 QA. (RETURN skill candidate `deterministic-convention-gate` = 미승격 후보.)

## 연결된 페이지
- [Ouroboros — Spec-First Agent OS](ouroboros.md) · [SCA-Gate & Spike 1A RAG Failure Defense Specification](sca-gate-specification.md) — Spec-Gate / 평가 게이트 차용 패턴 자매(본 페이지=spec=test·fake-evidence 차단 / ouroboros=immutable spec·Evaluate / sca=충분 컨텍스트 게이트)
- [Pattern: Structured Output Gate (구조화 출력 게이트)](prompt-pattern-structured-output-gate.md) · [Research Claim Gate — 주장을 증거 등급에 묶는 운영법](research-claim-gate.md) — 게이트 기반 검증 방법론 계열
