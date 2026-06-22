---
created: 2026-06-17
updated: 2026-06-17
type: learning
tags: [agent-harness, ipabcd, hotl, hitl, role-agents, de-anchoring, model-independent, korean, clean-room, north-star]
source: https://github.com/lidge-jun/jawcode
authors: [lidge-jun, Yeachan-Heo]
year: 2026
category: technique
---

> ✅ **confirmed** (2026-06-17, 작가 "하네스로 분류 B로, 제대로 흡수, 내 것으로 삼아 응용") — Claude 작성, repo clean-room 전문통독 기반 ③Gate PASS(출처 실존·환각0·코드복제 X). **시뮬 아님 = 에이전트 하네스**(작가 최초 분류 정정). beta/실험작.

# Jawcode (jwc) — 코딩 에이전트 하네스 (IPABCD)

lidge-jun 의 독립 코딩 에이전트 하네스(MIT, Bun-native, gajae-code/Yeachan-Heo 포크). "Encode intention. Decode software." 46 provider·3,600+ 모델·40+ 툴·5 role agent. **goose/opencode/pi/ralph 에 잇는 하네스 정본군** — 기능 완성도 최상축(IPABCD 전체 워크플로우 + role agent + HOTL). 모델독립(46 provider) = 북극성 정합.

## 1. IPABCD 워크플로우 = 작가 시스템의 거의 완전 대응

**I**nterview → **P**lan → **A**udit → **B**uild → **C**heck → **D**one. 각 단계 명시 게이트, **"adversarial review 통과 없이 done 불가."**
- **I** Interview(모호 요구 명료화) = dispatch-builder 역면접
- **P** Plan = 계획
- **A** Audit(계획 품질 검수) = critic OKAY/ITERATE/REJECT
- **B** Build
- **C** Check(③Gate) — **실패 시 역방향 라우팅**: code issue→B / plan issue→P / spec issue→I
- **D** Done
→ hermes-loop + dispatch-builder + done-gate 를 *하나의 명명된 파이프라인*으로 통합. C단계의 *되돌아갈 단계 라우팅*이 작가 게이트(pass/flag만)에 없던 부분.

## 2. 🌟 핵심 차용 3종 (delta — 작가가 아직 안 가진 것)

### 2.1 HOTL — HITL과 전면자율 사이 명시 모드
- `jwc orchestrate`(PABCD 단독) = **HITL**("ask first", 매 단계 사람 승인). `jwc goal`로 감싸면 = **HOTL**("keep going unless you intervene", 에이전트가 *증거 체크포인트* 남기며 진행, 사람은 관찰·steer만).
- → 작가는 HITL(엄격) ↔ [Ralph — 자율 코딩 루프 최소 실현체 (snarktank)](ralph.md) 전면자율(`--dangerously-*`, 위험) **양극만** 있었음. HOTL이 그 *중간*을 정식화 = ②Apply 자율 루프의 **안전 모드**(증거 남기며 진행 + 작가 개입 가능). worktree-accept/done-gate 와 결합 시 작가 가드와 양립.

### 2.2 Correction de-anchoring (role agent 내장)
- 5 role agent(executor / executor_ext=fresh 모델 레인 / architect=read-only 리뷰 CLEAR·WATCH·BLOCK / planner / critic=OKAY·ITERATE·REJECT). 전부 async.
- **교정받으면 이전 분석을 *폐기*하고 다른 각도 3+ 가설 재생성**(de-anchoring) + **authority-bias 방지**(부모 주장을 자기 툴콜로 검증) + 서로 작업 중복 X.
- → 작가 dispatch 검증자(N-3)는 있으나 *de-anchoring 강제*는 명시 안 됨. verifier-claims-need-regate("검증자도 환각")의 *능동 대응*.

### 2.3 prompt-cache-aware fork
- subagent system prompt 를 static/dynamic 경계로 분리 → 캐시 prefix 를 spawn 간 공유, resume 시 캐시 세션 재사용. = 작가 [Claude Code 런타임 내부 (Layer C)](../methods/claude-code-runtime-internals.md) 캐싱 지식의 하네스 적용.

## 3. 🎯 응용 — "내 것으로 삼기" (작가 명시 목표)

작가 시스템에 *지금* 얹을 수 있는 것:
1. **HOTL 모드를 ②Apply 자율 루프에 채택** — [Ralph — 자율 코딩 루프 최소 실현체 (snarktank)](ralph.md) 루프를 작가 가드 하에 돌릴 때, 전면자율 대신 *HOTL*(체크포인트마다 증거 아티팩트 남기고 진행, 작가는 관찰·중단 가능). agent-harness-rsi-brief §6 반영.
2. **de-anchoring을 dispatch 검증자에 명시** — 검증자(N-3)가 교정 시 *패치 말고 3+ 새 가설*. dispatch-builder 슬롯3 반영.
3. **IPABCD C-라우팅을 게이트에 도입 검토** — ③Gate flag 시 *어느 단계로 되돌아갈지*(코드/계획/스펙) 분류. backlog(현 게이트는 pass/flag만 — felt-need 시).
4. **증거 아티팩트 패턴**(`goal-snapshot.json`·`quality-gate.json`·`verification.md`) = [Ralph — 자율 코딩 루프 최소 실현체 (snarktank)](ralph.md) prd.json + 작가 done-gate 증거주의 확증 — 이미 보유, 별도 도입 불요.

## 4. ⚠ Cold-verify

- **beta/실험작**(README·작가 인정 "rough edges"). 도구 도입 X — 작가 Claude Code/Codex 운용 중, 또 다른 하네스 설치 불필요(infra). 흡수 = *패턴/개념*(HOTL·de-anchoring·C-라우팅).
- **하네스 정본군 추가**: goose(breadth)·opencode(depth)·pi(minimal)·ralph(loop)·**jawcode(full IPABCD+HOTL+roles)**. 모델독립이라 북극성 정합.

## 5. 학습→반영 (학습→반영 루프, B 범위)

- **#1 (즉시)**: HOTL → agent-harness-rsi-brief §6 ②Apply 자율 모드 1줄(HITL↔전면자율 중간, 증거 체크포인트).
- **#2 (즉시)**: correction de-anchoring → dispatch-builder 슬롯3 검증자 1줄(교정 시 3+ 새 가설·authority-bias 방지).
- **#3 (backlog)**: IPABCD C-라우팅(실패→단계별 되돌림)을 ③Gate 에 도입 검토 — felt-need 시.
