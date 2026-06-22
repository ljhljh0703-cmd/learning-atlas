---
created: 2026-06-17
updated: 2026-06-17
type: learning
tags: [AI, agent-harness, loop, automation, ground-truth, addy-osmani, self-improvement]
source: https://addyosmani.com/blog/loop-engineering/
authors: [Addy Osmani]
year: 2026
category: method
---

# Loop Engineering (Addy Osmani) — 하네스 위 한 층, 스케줄 발동 loop (vault 수렴 ground-truth #6)

*GPT 충실 외주 → ③Gate PASS(VERBATIM 인용·출처·확실/불확실 분리). vault 와 거의 전면 확증, 유일 delta=Automations(infra-0 의도적 미도입 영역).*

"네가 agent 를 prompt 하는 사람을 그만두고, *agent 를 prompt 하는 system 을 설계*하라(You design the system that does it instead)." 저자 정의: **"Loop engineering sits one floor above the harness"** — 하네스(단일 agent 환경)가 *한 번의 실행*이면, loop 는 timer·memory·feedback 으로 그 하네스를 *반복 발동*시키는 시스템. = vault hermes-loop 의 외부 명명.

---

## 한 줄 요약

> "agent 를 돌리는 system" = 5블록(Automations·Worktrees·Skills·Plugins/Connectors·Sub-agents) + Memory. 5개는 vault 가 이미 보유, **Automations 만 vault 의 infra-0 미도입 영역을 찌름**. 단 저자도 "작고 read-only triage loop" 로만 정당화.

---

## 확증 매핑 — 5블록+Memory → vault (재서술 X, 링크만)

1. **Worktrees**(병렬 agent 파일 충돌 격리) → Dual-Track **worktree-accept**. 확증.
2. **Skills**(`SKILL.md` 로 project knowledge 코드화, "guess 대신") → 스킬 자가성장 + expansion-contracts. 확증.
3. **Plugins/Connectors**(MCP) → vault MCP 정책(codegraph 상시·커넥터 최소화). *운영 강도 차이*(글=적극 확장, vault=토큰 보수). 신개념 X.
4. **Sub-agents**("maker 를 checker 에서 떼라 — 자기 숙제 채점은 너무 후하다") → ③Gate + N-3 검증자. 확증.
5. **State/Memory**("agent 는 잊어도 repo 는 안 잊는다", markdown/board) → log.md·hot.md·projects progress/memory. 확증.
6. **개념**: intent debt(cold start 가정 구멍을 confident guess 로 메움)=expansion-contracts 로 intent 외부화 / comprehension debt("이해는 방치하면 썩는다")·cognitive surrender("opinion 없이 받기만") = HITL·Gate·작가 이해유지 / orchestration tax("worktree 는 충돌만 없앤다, 상한은 너의 review bandwidth") = parallel-delegation 유계+통합 / factory model=[Factory AI — Droid 중심 "AI-native 개발 플랫폼" (vault 아키텍처의 업계 수렴 ground-truth #4)](factory-ai.md) / agent harness=agent-harness. 전부 확증.

---

## 진짜 새것 (vault delta — Automations 1축)

> **Automations** = "스케줄에 따라 알아서 발동해 discovery 와 triage 를 하는 것. Automations 가 loop 를 *one run* 이 아닌 *실제 loop* 로 만든다(the heartbeat)."

- **메커니즘**: Codex Automations tab(project·prompt·cadence·background worktree, 결과 有→Triage inbox / 無→archive) · Claude Code `/loop`·cron·lifecycle hooks·GitHub Actions · `/goal`(조건 충족까지 반복, 별도 small model 이 완료 확인).
- **예**: daily issue triage · CI failure 요약 · commit briefing · 지난주 누가 심은 버그 사냥.
- **vault 위치**: infra-0(스케줄러 0, nightly-updater launchd 1개만 예외)라 *의도적 미도입* 영역. Gnosis 측정축에 이은 **두 번째 "vault 가 반복적으로 비워둔 delta" = 스케줄 자동화**.

---

## 한계 (저자 직접 경고 — 격상·무비판 도입 금지)

- "loop 는 일을 *바꾸지* 너를 *삭제하지* 않는다." verification 은 여전히 인간 — **"done 은 proof 가 아니라 claim."**
- unattended loop = unattended mistakes. 빠른 loop 는 comprehension debt 를 *더 빨리* 키움.
- cognitive surrender 위험 · 자동 loop 전적 의존 시 product quality suffer 가능 · 직접 prompting 도 여전히 유효(balance 필요) · 같은 loop 도 사용자 따라 반대 결과.
- → Automations 도 token cost·review bandwidth·unattended mistakes 동반. **"작고 read-only 한 discovery/triage loop" 로만 정당화**(GPT 종합).

---

## 반영 (학습→반영 루프)

- ✅ **확증분(5블록+개념)** = 이미 vault 보유 → 흡수만, 재서술 X(#3). 의미 = 북극성 수렴 ground-truth **#6**(google-sdlc·goose·opencode·factory-ai·gnosis 이은). "loop=하네스 위 한 층" 프레이밍은 hermes-loop 정체성 확인.
- 🗺️ **Automations delta = "지도+가드레일", 즉시 도입 X** — vault infra-0 + 저자 경고. **단 vault 는 이미 이 방향으로 통제된 전진 중**: nightly-updater(기존 1개)·**staged phase2 주간 다이제스트(6/28 게이트)**·수동 회고(dual-track·skill-curator·game-design M5). Loop Engineering = 그 전진의 *외부 ground-truth + 가드레일*(read-only·작게·triage inbox·token 인지). → **6/28 phase2 결정 시 본 페이지 참조**(hot.md SCHEDULED CHECKS 연결).
- 🔗 **대조쌍**: 비기술자 "How to Build Your First AI Agent"(naive baseline, 검증·debt 생략, "단계 간 승인 받지 마")의 *disciplined 상위판*. loop 무비판 자동화 vs 엔지니어로 남기 차이 = 본 글이 선명히 함.

---

## 연결된 페이지

- hermes-loop (loop=하네스 위 한 층, 본 글의 vault 정본) · agent-harness · [Factory AI — Droid 중심 "AI-native 개발 플랫폼" (vault 아키텍처의 업계 수렴 ground-truth #4)](factory-ai.md) · [The New SDLC With Vibe Coding (Google / Addy Osmani)](google-new-sdlc-vibe-coding.md) · [goose — 모델독립 에이전트 하네스 (production 오픈소스 정본)](../techniques/goose-agent-harness.md) · [Gnosis — 파인튜닝 없이 헌법·메모리·루프로 성장하는 자가개선 에이전트 (vault 아키텍처 수렴 ground-truth #5)](gnosis-self-improving-agent.md) (수렴 ground-truth 군 #1~6)
- parallel-delegation (Sub-agents·orchestration tax) · SKILL (Skills·intent debt) · [Gnosis — 파인튜닝 없이 헌법·메모리·루프로 성장하는 자가개선 에이전트 (vault 아키텍처 수렴 ground-truth #5)](gnosis-self-improving-agent.md) (delta=측정 / 본건 delta=자동화 — vault 가 반복 미도입하는 2축)
