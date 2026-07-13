---
created: 2026-07-10
updated: 2026-07-10
type: learning
tags: [system-prompt, leak-corpus, operating-patterns, cross-vendor, training-data, provenance]
source: "system-prompt leak corpus (CC0-1.0 repo) — 상세 URL·commit = agent-harness-returns 매니페스트"
authors: [unknown-leak-maintainer]
year: 2026
category: method
---
<!-- Codex 해체분석 ③Gate — 부분 흡수(2026-07-10). 핵심 명제는 vault 기확보(포화), 신규 델타(크로스벤더+보존 taxonomy)만. -->

# System-Prompt Leak Corpus — Operating Patterns (부분 흡수)

> ③Gate 통과(2026-07-10, SHA 3종·verbatim 미유입·CC0이나 제3자 권리 미클리어). ⚠ **leak-provenance**: 아래는 비공식·미검증 유출 패턴 — 공식 사실로 취급 금지. **핵심 명제("serious AI = thin harness + mode cards + deterministic tool boundaries + done gates")는 vault 기확보**([Fable 5 프롬프팅 (공식 가이드)](fable-5-prompting.md) §비공식 유출본·agent-harness §leak 대조군[트리거 소진 2026-07-04]·[Claude Code 런타임 내부 (Layer C)](claude-code-runtime-internals.md)) = 재도출 회피, **신규 델타만** 흡수.

## 1. 신규 델타 A — 크로스벤더 breadth (기존 leak작업은 Claude/Fable 중심)
한 코퍼스에서 OpenAI/Google/xAI/Microsoft/Cursor/Perplexity/Devin·OpenCode 계열을 **비교**. 8-layer contract 모델(identity/task/tool-routing/permission/context/output/verification/safety)로 벤더 간 프롬프트 구조를 대조 — 프롬프트 아키텍처의 공통·분기 지점 파악용. ⚠ 각 항목은 유출 파일의 해석 요약 = leak caveat 유지, 버전 함의 파일명(`gpt-5.5-full.md`·`Claude Code v2.1.205` 등)을 버전 진실로 박제 금지.

## 2. 신규 델타 B — 보존 매니페스트 + 5-레인 학습데이터 큐레이션 taxonomy
작가의 "미래 모델 학습용 보존" 요청에 직접 응답하는 durable artifact. raw 코퍼스를 **미러하지 않고** URL+commit SHA+provider 분포+re-fetch 명령만 보존(preservation-not-mirror). 큐레이션 taxonomy 5레인:
- `normalized_agent_contracts` / `tool_use_policy` / `coding_patterns` / `style_profiles` / `safety_taxonomy` + **exclusion rules**(개인정보·저작·기밀·raw 학습금지).
- **STOP**: 출처/법적 게이트 없이 raw 를 학습에 사용 금지(양 파일 명시).

## 3. 반영 (Apply-or-Park)
- **① Applied**: 본 노트 = 신규 델타 2종 + 보존 매니페스트 포인터. 핵심 명제는 기존 노드가 정본(중복 안 씀).
- **② Parked**: `system-prompt-corpus-intake` skill 후보(research-relay dispatch-out + codex-gate return-in 과 중첩, 작가 승인 대기). vendor별 patch 후보(agent-harness/dispatch-builder/prompt-engineering) = 작가 결정. → codex-gate-9pack-merges-2026-07-10.
