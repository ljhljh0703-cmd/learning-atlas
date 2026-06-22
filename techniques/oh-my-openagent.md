---
created: 2026-06-17
updated: 2026-06-17
type: learning
tags: [agent-harness, opencode-layer, orchestration, hyperplan, skillopt, skill-eval, lifecycle-hooks, hitl-clash, north-star, clean-room]
source: https://github.com/code-yeongyu/oh-my-openagent
authors: [code-yeongyu, Sisyphus Labs]
year: 2026
category: technique
---

> ✅ **confirmed** (2026-06-17, 작가 "B ㄱㄱ") — Claude 작성, repo clean-room 전문통독 기반 ③Gate PASS(출처 실존·환각0·코드복제 X). ⚠ **SUL-1.0(Sustainable Use License — source-available·non-compete, OSI 오픈소스 아님)**. 흡수=패턴/개념(도구 도입 X). **후속**: 같은 제작자 Codex판 LazyCodex 예정(작가 예고) → 그때 본 페이지에 이어붙임.

# Oh My OpenAgent (OmO) — opencode 위 하네스 레이어

code-yeongyu(Sisyphus Labs)의 유명 OSS **에이전트 하네스 배포판** — [opencode](opencode-agent-harness.md)(작가 보유 정본, depth) 위에 얹는 *productized fat-skills + 오케스트레이션* 층. 11 agent·54+ 라이프사이클 훅·5 MCP·Team Mode·`ultrawork`/`ulw-loop`. "Anthropic이 우리 때문에 opencode 차단"으로 유명. 모델독립(멀티프로바이더) = 북극성 정합. **opencode=하부 하네스 / OmO=그 위 '무엇을 얹나' 층**으로 작가 [opencode — 모델독립 에이전트 하네스 #2 (컨텍스트 조립 *엄밀성* 정본)](opencode-agent-harness.md)의 실전 보완재.

## 1. 3층 명명 오케스트레이션

- **Planning**: Prometheus(플래너) + Metis(컨설턴트) + Momus(리뷰어). **Execution**: Atlas(지휘자). **Workers**: Sisyphus-Junior(실행)·Oracle(아키텍처)·Explore(grep)·Librarian(docs)·visual-eng. 각 역할이 *멀티프로바이더 모델 매칭*(opus/sonnet/gpt-5.5/gemini/kimi/glm/minimax 등). = [Jawcode (jwc) — 코딩 에이전트 하네스 (IPABCD)](jawcode.md) 5역할의 더 풍부판.
- **3 진입 모드**: 단순=그냥 프롬프트 / 복잡+귀찮음=`ulw`(에이전트가 알아서, 자율 루프=[Ralph — 자율 코딩 루프 최소 실현체 (snarktank)](ralph.md) 계열) / 복잡+정밀=`@plan`→`/start-work`(plan/execute 분리).

## 2. 🌟 학습가치 3종

### 2.1 hyperplan — 적대적 다중에이전트 계획
- 5명 *상호 적대* 멤버(skeptic[단순성·반과잉]·validator[통합취약]·researcher[근거]·architect[구조]·creative[관습파괴]), 모델 다양. "합의 아닌 **지적 전투**" → 살아남은 *방어가능 인사이트만* distill → plan 에이전트로 넘김.
- = 작가 verifier-claims-need-regate·3심제·[Jawcode (jwc) — 코딩 에이전트 하네스 (IPABCD)](jawcode.md) de-anchoring 을 *의도적 적대팀*으로 구현한 구체 패턴. **skeptic 멤버 = Karpathy #2(반과잉) 인격화**("delete this, prove it's needed").

### 2.2 🌟 skill A/B eval (skillopt) — 측정축의 skill 적용
- skill 마다 *with_skill ↔ without_skill* grading.json·timing.json·benchmark.md. 실측 예(work-with-pr): **pass rate 96.8% vs 51.6% (+45.2%)**, discriminator 분석(three-gates 5/5 vs 0/5 = 최강 신호), **"유일한 with-skill 실패 = 과잉엔지니어링" 자기비판**.
- = **스킬을 경험적으로 측정**. 작가가 계속 미뤄온 *측정축*([GBrain — 개인 AI 지식 브레인 production 정본](gbrain.md) skillopt 수렴)을 skill 단위로 실증. skill 자가성장/curator 의 정량 근거.

### 2.3 54+ 라이프사이클 훅
- per-turn 주입 인프라. = 작가가 [goose — 모델독립 에이전트 하네스 (production 오픈소스 정본)](goose-agent-harness.md) MOIM 에서 "vault 엔 per-turn 주입 인프라 없다"고 박은 그 delta 의 실물(작가 대체 = hot.md §절대룰 재노출).

## 3. ⚠ Cold-verify — 철학 정면충돌 1건

- **매니페스토: "Human Intervention is a Failure Signal / HITL = BOTTLENECK"** 🔴 — OmO 는 *HITL 을 자율주행 인간개입처럼 시스템 실패로 본다*. 작가 **HITL 스테이징·③Gate fail-safe 철학과 정반대**([Ralph — 자율 코딩 루프 최소 실현체 (snarktank)](ralph.md) 전면자율 진영). **해소책 = 작가가 [Jawcode (jwc) — 코딩 에이전트 하네스 (IPABCD)](jawcode.md)에서 흡수한 HOTL**(증거 체크포인트 자율, 사람 steer) — OmO=HITL부정 / 작가=HITL안전 / HOTL=중간 해소.
- **"Indistinguishable Code · No AI slop"** 매니페스토 = Karpathy #2/#3 정합(이 부분은 작가와 일치). hyperplan skeptic 이 그 집행자.
- SUL-1.0(non-compete)·infra 중량(opencode 플러그인·11 agent 설정). 도구 도입 X — 작가 Claude Code/Codex 운용. 흡수=패턴.

## 4. 학습→반영 (학습→반영 루프, B 범위)

- **#1 (즉시)**: hyperplan 적대팀 → dispatch-builder 검증/계획 옵션 1줄(최대 rigor 시 적대적 다중모델 비평 → distill).
- **#2 (즉시)**: skill A/B eval(skillopt) → skill-curator 1줄(keep/archive 경험적 근거 + 측정축, 6/28 phase2 입력).
- **#3 (즉시)**: HITL=failure 충돌 → agent-harness-rsi-brief §6 HOTL 줄에 *충돌 해소* 1줄(OmO HITL부정 ↔ 작가 HITL안전 = HOTL 중간).
- **#4 (완료)**: LazyCodex(Codex판) 수신 → §6 이어붙임(2026-06-17).
- **#5 (즉시)**: ulw-loop *Oracle-gated 정지*(자기주장 `DONE` → 독립 검증 통과해야 종료) → [Ralph — 자율 코딩 루프 최소 실현체 (snarktank)](ralph.md) 의 자기주장 정지 약점 보강 1줄.

## 6. LazyCodex — OmO 의 Codex 판 (이어붙임 2026-06-17)

[`code-yeongyu/lazycodex`](https://github.com/code-yeongyu/lazycodex)(MIT, 얇은 배포층 — 코어 엔진 OmO 는 SUL). "LazyVim for Codex" — OmO 하네스를 Codex 에 *반복 가능 셋업*으로 포장(`npx lazycodex-ai install`). OmO 에서 *이름만* 봤던 4개 커맨드의 실체:

- **`ulw-plan`** (Prometheus 플래너, 구현 X) — Socratic 인터뷰 → 병렬 codebase 탐색 → Metis gap 분석 → `plans/<slug>.md` → 선택적 Momus 리뷰. = 작가 dispatch-builder 역면접+plan.
- **`start-work`** — plan 의 *모든 top-level 체크박스*가 끝날 때까지 실행. **durable Boulder 상태 `.omo/boulder.json` 가 턴/세션 넘어 생존 + Stop-hook 이 완료까지 다음 턴 재주입** + 5 evidence 게이트(plan reread·automated verify·manual-QA·adversarial QA·cleanup) + ledger. = [Ralph — 자율 코딩 루프 최소 실현체 (snarktank)](ralph.md) 루프 + [Jawcode (jwc) — 코딩 에이전트 하네스 (IPABCD)](jawcode.md) goal + per-turn 재주입 인프라.
- **`ulw-loop`** 🌟 — `<promise>DONE</promise>` 가 나와도 **루프 안 멈춤 → Oracle 이 먼저 검증해야** 종료("Oracle verification failed. Continuing ULTRAWORK loop"). cap 500(normal 100). = **[Ralph — 자율 코딩 루프 최소 실현체 (snarktank)](ralph.md) 정지신호 루프 + 강제 독립 검증 게이트**. Ralph 가 *자기주장으로 멈추는* 약점을 Oracle 게이트로 메움.
- **`ultrawork`/`ulw`** — TDD RED→GREEN→SURFACE→CLEAN + ≥3 현실 QA 시나리오 + 실 manual-QA 채널(HTTP/tmux/browser) + *binding 검증 게이트가 genuinely done 까지 루프*.
- **`init-deep`** — 큰/오래된 repo 용 *계층적 AGENTS.md* 자동 생성(에이전트가 코드 건들기 전 올바른 파일 찾게). = 작가 CodeGraph/[Understand-Anything — Karpathy-wiki→그래프 플러그인 (graphify 비교)](understand-anything.md) 온보딩 + Lookup Protocol.

**Codex 훅 = 플랫폼 강제 HITL** — 훅이 startup review 승인 전엔 *절대 실행 안 됨*(SessionStart hook approval). 흥미로운 대비: OmO 매니페스토는 "HITL=실패"인데 *Codex 플랫폼이 하네스 레벨 HITL 게이트를 강제*. → 작가 HITL-안전과 우연히 정합(플랫폼이 가드 제공).

**계보 메모**: LazyCodex 의 Ultragoal/UltraQA 는 [oh-my-codex](https://github.com/Yeachan-Heo/oh-my-codex)(Yeachan-Heo) 영감 — [Jawcode (jwc) — 코딩 에이전트 하네스 (IPABCD)](jawcode.md)(gajae-code/Yeachan-Heo 포크)와 *같은 Yeachan-Heo 계보*. 한국 Codex 하네스 씬의 공통 뿌리.

**추가 반영**: ulw-loop 의 *Oracle 게이트 정지* → [Ralph — 자율 코딩 루프 최소 실현체 (snarktank)](ralph.md) 의 자기주장 정지 약점 보강(아래 학습→반영 #5).
