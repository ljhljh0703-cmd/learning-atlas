---
created: 2026-06-17
updated: 2026-06-17
type: learning
tags: [autonomous-loop, agent-harness, rsi, fresh-context, dual-track, done-gate, task-granularity, ralph, clean-room, automation-axis]
source: https://github.com/snarktank/ralph
authors: [Ryan Carson, Geoffrey Huntley]
year: 2026
category: technique
---

> ✅ **confirmed** (2026-06-17, 작가 "B ㄱㄱ") — Claude 작성, repo clean-room 전문통독 기반 ③Gate PASS(출처 실존·환각0·코드복제 X). [Ouroboros — Spec-First Agent OS](../methods/ouroboros.md) 가 언급만 했던 Ralph 패턴의 실물.

# Ralph — 자율 코딩 루프 최소 실현체 (snarktank)

Ryan Carson(snarktank)의 [Geoffrey Huntley "Ralph" 패턴](https://ghuntley.com/ralph/) 구현. MIT. **bash `for` 루프가 매 iteration 마다 *깨끗한 컨텍스트의 새 AI 인스턴스*(Amp 또는 Claude Code)를 띄워 PRD 전부 끝날 때까지 반복**. 본체 = `ralph.sh` 한 장 + 프롬프트 1장 + 스킬 2개. **인프라 거의 0**(bash + jq + git).

**왜 중요** — 작가가 agent-harness 로 *이론화*한 자율 루프의 *최소 실행체*. 특히 [GBrain — 개인 AI 지식 브레인 production 정본](gbrain.md)·[Loop Engineering (Addy Osmani) — 하네스 위 한 층, 스케줄 발동 loop (vault 수렴 ground-truth #6)](../methods/loop-engineering.md) 흡수 때마다 박은 "반복 미도입 delta = **자동화축**"의 infra-0 버전.

## 1. 루프 구조

매 iteration(`ralph.sh` for-loop) = 새 인스턴스가:
1. `prd.json`(task list) 읽기 → 2. `progress.txt` 읽기(**Codebase Patterns 섹션 먼저**) → 3. 브랜치 확인(PRD `branchName`) → 4. `passes:false` 중 **최우선 story 1개** → 5. 그 *하나만* 구현 → 6. 품질검사(typecheck/test) → 7. **AGENTS.md 에 학습 기록** → 8. 통과 시 커밋(`feat: [Story ID]`) → 9. `passes:true` 마킹 → 10. `progress.txt` append.
- **정지**: 전 story `passes:true` → `<promise>COMPLETE</promise>` 출력 → 루프 exit. 또는 max_iterations.
- **메모리 = 컨텍스트 아님**: iteration 간 기억 = git history + `progress.txt`(append-only) + `prd.json`(passes 상태). fresh context 라 토큰 누적 0.
- **스킬 2종**: `/prd`(lettered-option 질문 → PRD 생성) · `/ralph`(PRD → `prd.json` user story 변환).
- **⚠ 약점 보강 (LazyCodex ulw-loop 차용 2026-06-17)**: Ralph 는 에이전트가 `<promise>COMPLETE</promise>`를 *스스로* 내면 정지 — *자기주장 정지*(self-claim ≠ done). [LazyCodex](oh-my-openagent.md) ulw-loop 은 `DONE` 신호 후에도 **독립 Oracle 이 검증 통과해야** 종료("Oracle verification failed. Continuing"). → 작가가 Ralph 루프 채택 시 *정지 조건에 독립 검증 게이트*(③Gate/done-gate exit 0·검증자)를 끼워라 — 자기주장만으로 멈추면 무증명 완료.

## 2. 🎯 작가 시스템 수렴 (이론의 production 확증)

| Ralph | 작가 시스템 |
|---|---|
| fresh context + git/progress.txt/prd.json 외부 메모리 | **Dual-Track**(progress=history, memory=lessons) + hot.md |
| progress.txt "Codebase Patterns 를 TOP 에 consolidate" | hot.md/lessons 압축 · Memory 승격 |
| **AGENTS.md 갱신이 핵심**(학습이 다음 iter·인간 전파) | repo AGENTS.md + Lookup Protocol + Dual-Track 승격 |
| **small task = one context window**(크면 컨텍스트 소진→broken) | dispatch-phase-granularity(큰 디스패치 잘게) **정확 일치** |
| feedback loop 필수(typecheck/test/CI green, "broken compounds") | ③Gate done-gate · dispatch-builder "성공=exit 0" |
| `<promise>COMPLETE</promise>` 정지 신호 | 머신체크 done-gate |
| `passes` boolean per story | Karpathy #4 검증가능 성공기준 |
| UI story = dev-browser 브라우저 검증 필수 | [text-to-lottie — 에이전트 Lottie 생성 하네스 (diffusion studio)](text-to-lottie.md) `?frame`·H-14 OBSERVE 매체 |

## 3. 🗝️ delta — 자동화축 최소 실현체

- gbrain(DB/cron)·understand(pnpm/React) 무거움 없이 **bash for-loop 한 장**으로 자율 루프 = 작가가 미뤄온 "스케줄/루프 자동화"의 *가장 가벼운* 형태. [Loop Engineering (Addy Osmani) — 하네스 위 한 층, 스케줄 발동 loop (vault 수렴 ground-truth #6)](../methods/loop-engineering.md) Automations·[Gnosis — 파인튜닝 없이 헌법·메모리·루프로 성장하는 자가개선 에이전트 (vault 아키텍처 수렴 ground-truth #5)](../methods/gnosis-self-improving-agent.md) 측정축과 같은 수렴점이나 *실행 난이도 최저*.
- **prd.json = 머신체크 task list**(passes boolean) + per-story 게이트 + auto-commit = 작가 디스패치를 *루프용 다단계 실행*으로 확장한 형태. dispatch-builder 가 단발 master prompt 라면 Ralph 는 *그걸 루프로 감은 것*.

## 4. ⚠ Cold-verify — 결정적 충돌 1건

- **`--dangerously-skip-permissions` / `--dangerously-allow-all` 전면 자율 쓰기 루프** = 작가가 **2026-06-14 잠근 바로 그 위험**(헌법 "외부 AI CLI 호출 시 쓰기 차단 강제" — agy 무단 회고+쓰기 사고 log 실증). Ralph 철학(완전 자율·HITL 0)은 작가 **HITL 스테이징·③Gate fail-safe 와 정면 충돌**. → *기법(루프·메모리·게이트)은 차용하되, 자율 권한은 작가 가드 하에서만*(sandbox/worktree-accept·HITL 정지).
- **infra 도입 X** — Ralph 는 도구라기보다 *패턴*(bash 개념). agent-harness ②Apply 의 *돌려볼 수 있는 루프 레퍼런스*로 가치.

## 5. 학습→반영 (학습→반영 루프, B 범위 실행)

- **#1 (즉시)**: prd.json `passes` per-story 루프 + `<promise>COMPLETE</promise>` → dispatch-builder done-gate 에 *다단계 루프 확장* 1줄.
- **#2 (즉시)**: progress.txt "Codebase Patterns TOP consolidate" → dual-track-review 에 *consolidate 패턴 외부 확증* 1줄.
- **#3 (즉시)**: Ralph 루프 = agent-harness-rsi-brief §6 ②Apply *참조 런북*(돌려볼 수 있는 자율 루프 레퍼런스, 단 dangerous-auto 가드).
- **#4 (보류)**: 자동화축 infra-0 실현 가능성 = 6/28 phase2 결정 입력(Ralph 가 "bash 루프면 충분" 증명 → 무거운 자동화 불요 논거).
