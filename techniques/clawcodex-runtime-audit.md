---
created: 2026-07-17
updated: 2026-07-17
type: learning
tags: [agent-runtime, security-audit, white-box, compaction, tool-loop, permission-boundary, reject-adoption]
source: https://github.com/agentforce314/clawcodex
authors: [agentforce314]
year: 2026
category: technique
---
<!-- ClawCodex 해체 — 설치 Reject, agent runtime white-box 감사 표본으로만 흡수. codex teardown ③Gate 2026-07-17. -->

# ClawCodex 런타임 감사 (white-box 표본, 설치 Reject)

> **한줄**: Claude Code형 agent runtime 오픈소스([agentforce314/clawcodex](https://github.com/agentforce314/clawcodex), commit `f85a3b95`)를 *제품이 아니라 감사용 white-box 표본*으로만 해체. 구조 ~85%가 vault 기존 자산과 중복 → **채택 Reject**, 결정적 메커니즘 3개만 게이트. 무결성 PASS 3/3(정적분석만, 코드 미실행 = 보안 경계).

## 🚫 채택 판정 = Reject (설치·fork·구독 import·CA 주입 전부)

first-party `TODOS.md`가 스스로 밝힌 P0 결함이 채택을 막는다.
- **P0 workspace escape**: workspace 밖 read/write e2e 차단 실패(미해결).
- **P0 advisor 오분류**: advisor tool 을 read-only/concurrency-safe 로 오분류.
- **P2 미집행**: settings `max_cost_usd`/`max_turns` 미집행.
- Workflow 가 restrictive parent(default/plan)를 subagent `acceptEdits`로 **승격**(권한 상향 누수).
- 1.1.0 **Alpha**, latest release API 404, CI/main 증거 부족.

## 🔒 STOP (박제 — 인용·행동 금지)
- `curl | bash` 설치 금지 · `~/.codex/auth.json`(개인 토큰) import 금지 · upstream proxy **CA host trust 금지**(TLS MITM 면). (web-reach fail-closed·[Claude Code 런타임 내부 (Layer C)](../methods/claude-code-runtime-internals.md) A2 샌드박스 정합.)
- 마케팅 `80% / 200×`를 일반 성능으로 인용 금지(committed corpus 92,989→17,767 tokens −80%는 fat-tail 편향을 저자가 명시).
- MIT 파일만으로 clean-room/법적 안전 추론 금지 — TypeScript-reference provenance 미해결.

## ✅ 게이트한 메커니즘 3 (설계 차용 후보, 구현체 아님)
1. **`/eco` never-worse recovery contract** — raw artifact + *유효한 recovery pointer*가 있을 때만 lossy model view 허용, tee write 실패 시 lossy hit 폐기 → baseline passthrough(*결코 baseline보다 나빠지지 않음*). → 컴팩션 손실 방지 원리([Claude Code 런타임 내부 (Layer C)](../methods/claude-code-runtime-internals.md) A3/B1 5단계 파이프라인의 안전 불변): *압축은 되돌릴 포인터 + never-worse 를 계약으로*.
2. **결정적 tool-failure loop breaker** — 동일 signature/category/resource 실패 **3회 반복 + success reset**의 runtime guard. 무한 재시도 루프 차단을 프롬프트 훈계가 아닌 결정적 카운터로. → agent-harness 디버깅 루프 가드 후보.
3. **permission claim ≠ boundary 성립 (e2e fixture)** — "기능 존재"와 "안전 성립"을 분리하는 강한 반례(위 P0가 증명). 교훈: *권한 경계는 e2e fixture로 증명해야 하며, 기능이 있다는 것이 경계가 성립한다는 뜻이 아니다*.

## 관계
- 중복 확인처: [Claude Code 런타임 내부 (Layer C)](../methods/claude-code-runtime-internals.md)(권한·샌드박스·컴팩션 정본) · [Dynamic Workflows — 작업마다 하네스 (Claude Code)](../methods/dynamic-workflows-harness.md) · token-minimal-session-router · agent-harness. skill 신설 = **None**(재사용 조각이 기존 runtime/loop/RTK 자산에 들어맞음, 신설=중복).
- 흡수 성격: 순수 감사 표본 — 코드 도입 0, 원리 3개만 cross-link. (Karpathy #2 — 억지 반영 X.)
