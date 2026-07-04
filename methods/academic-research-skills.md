---
created: 2026-06-18
updated: 2026-06-18
type: learning
tags: [tool, claude-code-skills, academic-writing, hitl, integrity-gate, multi-agent, anti-hallucination, citation-verification, calibration, fnr-fpr, cross-model, concession-threshold, intent-detection, ground-truth-isolation, failure-modes, ground-truth, clean-room]
source: https://github.com/imbad0202/academic-research-skills
authors: [Cheng-I Wu]
year: 2026
doi: 10.5281/zenodo.20696614
category: method
---

<!-- ARS(academic-research-skills, imbad0202) 전문통독 — 작가 거버넌스·검증·하네스 철학의 학술논문 도메인 쌍둥이. 4스킬/27모드 Claude Code 슈트. delta=concession threshold·intent detection·calibration FNR/FPR·결정론 citation 게이트·7실패모드·cross-model(31% 환각 same-model 통과). ground-truth isolation은 작가 data_access 등가. CC BY-NC 4.0. 도구 도입 아닌 메커니즘 수확. clean-room. -->

# Academic Research Skills (ARS) — 작가 거버넌스·검증 철학의 학술논문 도메인 쌍둥이

*Cheng-I Wu(吳政宜), CC BY-NC 4.0, Zenodo DOI · Claude Code 스킬 슈트 4종/27모드 v3.12.1 · GitHub clone 전문통독(핵심 메커니즘 중심, clean-room)*

> ⚠️ **분류(paper-study §2 정직판정)**: AI NPC blueprint **해당 없음** · **개념/메커니즘 수확**(도구 도입 X — 작가 felt-need=논문작성 비중 50%+ 미충족, CLAUDE.md Zotero 트리거와 동일 임계) · 시급성 **중기**(검증·거버넌스 메커니즘 자료). ⚠ **CC BY-NC 4.0** — 학습 인용 OK(출처 명기), 상업/모델학습 금지. **가치 = "작가 거버넌스·검증·하네스 철학이 학술 도메인에서 독립 정교화된 ground-truth"**([Kuku — 작가 Sub-brain 거버넌스를 제품화한 로컬 Markdown 앱 (외부 ground-truth)](kuku-second-brain.md)=거버넌스 정본, goose-harness-groundtruth=하네스 정본 옆 *검증·반환각 파이프라인 정본*).

---

## 한 줄 요약

> "AI는 copilot이지 pilot 아니다" — 연구→집필→리뷰→출판 전 파이프라인을 멀티에이전트 스킬로 분업하되, **스킵 불가 integrity gate + 결정론 citation 검증 + DA concession threshold + cross-model + calibration**으로 환각·sycophancy·frame-lock을 *정량 제동*. 작가 ③Gate·verifier-regate·하네스의 학술 도메인 정교판.

---

## 핵심 개념 (delta 중심)

### 1. ★ DA Concession Threshold Protocol — sycophancy 정량 제동
Devil's Advocate가 rebuttal 받을 때(`devils_advocate_reviewer_agent`):
- **rebuttal을 1-5 점수**화 → **≥4만 양보 허용**(≤3은 입장 유지·원공격 재진술).
- **No consecutive concessions**: 직전 finding 양보했으면 다음 양보 bar가 **5/5로 상승**.
- **Concession rate self-flag**: re-review에서 >50% 철회 시 "내가 genuine improvement 때문인지 *accommodate 경향* 때문인지 human이 검증하라" 자기경고.
- **"Pressure is not evidence"**: 반복 pushback·권위 호소·소프트닝 요청 자체로는 점수 안 변함. 새 증거 없으면 1회 재진술 후 정지(retract-under-pressure 패턴 차단).
→ 작가 [검증자의 주장도 환각이다 — 강한 주장은 1차 출처로 재-Gate](verifier-claims-need-regate.md)(검증자도 환각·강한주장 재게이트)의 *메커니즘 구현*. "persistent pushback ≠ valid rebuttal" = HITL 압박에 굴복 안 하는 게이트.

### 2. ★ Cross-model verification — same-model blind spot의 정량 증거
`shared/cross_model_verification.md`: **68개 AI생성 citation 스트레스 테스트 → 31% 결함, 전부 same-model 3회 integrity 검증 통과**. 근본원인 = 검증 AI와 생성 AI가 *같은 training 분포 → 같은 blind spot*. 다른 모델 family(겹치되 비동일·다른 RLHF)가 잡음.
- `ARS_CROSS_MODEL` opt-in, dimension score 불일치 >2점 시 flag. **Ungrounded 가드**: 1st-party(`gpt-`/`gemini-`) 외 compatible 모델의 positive verdict는 *citation 동의로 안 침*(환각 누적 차단).
→ **작가 cross-model 교차검증·external-ai-grant-hardcontract·GPT 외주(research-relay-default-gpt)의 정량 정당화.** "왜 다른 모델한테 검증시키나"의 ground-truth 수치(31%).

### 3. ★ 7 AI Research Failure Modes — "competent하게 보이는" 환각 차단 게이트
Lu et al.(2026 Nature, The AI Scientist) Limitations 기반. Stage 2.5/4.5 integrity gate에서 **각 모드 CLEAR/SUSPECTED/INSUFFICIENT 판정, SUSPECTED 1개라도면 파이프라인 block**:
1. 구현버그 self-review 통과(의심신호=suspiciously round 수치·동일 error bar) · 2. citation 환각 · 3. 실험결과 환각 · 4. shortcut reliance(색-편향 MNIST) · 5. **버그를 novel insight로 reframe**("surprisingly/unexpectedly" → 반대 예측 문헌 못 대면 버그 의심) · 6. methodology fabrication · 7. **frame-lock**(초기 잘못된 commitment를 하류가 못 벗어남).
→ 작가 agent-harness RSI·③Gate와 직결. 특히 #5(버그→insight)·#7(frame-lock)은 fun-feedback-separate-track·역면접의 학술판. "looks like competent work"가 환각의 위험 본질.

### 4. ★ Calibration mode — 검증자 자기오차 측정(FNR/FPR + severity)
`calibration_mode_protocol.md`: user gold set에 full mode 돌려 **FNR(miss)·FPR(false alarm)·balanced accuracy·severity-miscalibration** 측정 → 후속 리뷰에 confidence disclosure 첨부. Lu Table 1 인용(LLM 리뷰어 FNR 0.17 vs human 0.52 / FPR 0.50 vs human 0.17-0.34 = "거의 안 놓치나 과도 reject").
- **Grounding discipline**(자기지식으로 norm 옳은지 추측 금지 — 그게 측정 대상 실패) = [검증자의 주장도 환각이다 — 강한 주장은 1차 출처로 재-Gate](verifier-claims-need-regate.md) 동형. gold fixture 대조.
- Session-only 캐시·opt-in(토큰 작가 결정).
→ 작가 측정·평가축([Gnosis — 파인튜닝 없이 헌법·메모리·루프로 성장하는 자가개선 에이전트 (vault 아키텍처 수렴 ground-truth #5)](gnosis-self-improving-agent.md) private-outcome eval)의 *검증자 자기교정* 인스턴스. delta = FNR/FPR 이원 측정 + severity 별도축.

### 5. Ground-Truth Isolation — 작가 data_access_level과 *동일* (확증)
`ground_truth_isolation_pattern.md`: 에이전트가 생성 중 정답키를 읽으면 rubric에 reward hack(held-out 전이 실패). Anthropic automated-w2s-researcher 3-tier 샌드박스(local/redacted/server-side GT) 차용. ARS `data_access_level`(raw/redacted/verified_only) 선언 + lint 강제.
→ 작가 [Kuku — 작가 Sub-brain 거버넌스를 제품화한 로컬 Markdown 앱 (외부 ground-truth)](kuku-second-brain.md) "구조차단+불변테스트" 메타패턴과 *같은 철학*. 작가 vault엔 이미 ③Gate clean-room·verifier 분리로 등가 존재 = **확증**.

### 6. Intent Detection + Dialogue Health — 역면접 건강 모니터
`socratic_mentor_agent`: exploratory vs goal-oriented 분류(첫 2메시지+5턴마다 재평가). exploratory면 auto-convergence 비활성·max round 40→60·"summarize?" 금지. **5턴마다 silent self-assessment 3축**(persistent-agreement·conflict-avoidance·premature-convergence) → 동의편향 감지 시 challenging 질문 auto-주입(user 비가시=gaming 방지).
→ 작가 dispatch-builder 역면접·game-design M1 인터뷰의 *건강 지표*. "intent를 keyword 아닌 의미로"(read-intent-not-keyword 메모리 확증). delta = 대화 sycophancy의 silent 자기진단 루프.

---

## 기술 스택 / 구조

```
4 스킬 (27 모드, 모두 task_type: open-ended):
  deep-research(13에이전트)      — Socratic·PRISMA·fact-check·three-way-scan
  academic-paper(12에이전트)     — Style Calibration·Writing Quality Check·anti-leakage·VLM figure
  academic-paper-reviewer(7에이전트) — EIC+3리뷰어+DA·0-100 루브릭·read-only·calibration
  academic-pipeline(10-stage)    — integrity gate 2.5/4.5(스킵불가)·Material Passport·repro_lock·cross-model
공유: shared/(ground-truth isolation·cross-model·benchmark schema·handoff schemas·collaboration rubric)
검증 인프라: 결정론 citation 게이트(S2+OpenAlex+Crossref+arXiv 4-index, 90일 SQLite 캐시)
  · L3 claim-faithfulness audit(anchor fetch로 인용이 실제 주장 지지하는지) · scoped-write PreToolUse guard
프롬프트 구동(코어는 Python 0) + opt-in Python(가드·verifier CLI). Plugin/symlink 듀얼 설치.
```
- **결정론 게이트 철학**: citation 존재를 LLM 리뷰와 *독립* 4-index lookup(환각 DOI는 hope 아닌 lookup으로 잡음). advisory 기본, `terminal_policies` opt-in 시만 hard block(precision-over-recall, 비영어/지역 인용은 unresolvable로 비차단).

---

## 내 생각 — 거버넌스·검증·하네스 관점

### 직접 적용성: **낮음** (도구 도입 X)
작가 felt-need는 게임·취업이지 *학술 논문 작성*이 아님 → CLAUDE.md "vault 활동 50%+ 논문 시 Zotero 검토" 트리거 미충족. ARS 설치는 felt-need 미검증(cold-verify-before-adopt). **가치는 도메인-무관 메커니즘 수확** — concession threshold·cross-model 31%·calibration·7실패모드는 학술 밖에서도 작동.

### 개념 수확 (이식 가능 발상)
1. **concession threshold 정량화** — DA "1-5 점수·≥4만 양보·no-consecutive·rate self-flag"를 작가 ③Gate/verifier-regate에 *발상 차용*. 작가는 "강한 주장 재게이트"(soft)인데 ARS는 *양보 점수 임계*(정량). dispatch-builder done-gate에 "verifier 양보는 새 증거 ≥임계만" 추가 후보.
2. **cross-model 31% = same-model blind spot 정량 증거** — 작가 GPT 외주·cross-model의 가장 강한 정당화 수치. research-relay-default-gpt·[검증자의 주장도 환각이다 — 강한 주장은 1차 출처로 재-Gate](verifier-claims-need-regate.md)에 ground-truth로 인용 가치.
3. **7 failure modes** — frame-lock·버그→insight는 작가 RSI/하네스 디버깅 약점(agent-harness investigation 차용 검토 이력)과 직결. SUSPECTED→block 게이트 형식이 강제 규율 4부 골격 정합.

### 반영처 (학습→반영 루프, 루프)
- 대부분 **확증**(작가 검증철학이 옳았다는 외부 ground-truth) → 신규 룰 0. 억지 반영 금지(과적용 가드).
- 🟡 **consideration backlog (도입 아님, 성찰 입력)**: ① concession threshold 정량 발상 → dispatch-builder done-gate "verifier 양보 임계" 후보(작가 외주검증 마찰 시 트리거) / ② cross-model 31% 수치 → verifier-regate·research-relay에 ground-truth 인용(가벼운 1줄, 다음 갱신 시) / ③ 7 failure modes 체크리스트 → 코드 디스패치 ③Gate 보강 후보. 전부 infra-0 유지.
- 🔗 **확증 링크**: [Kuku — 작가 Sub-brain 거버넌스를 제품화한 로컬 Markdown 앱 (외부 ground-truth)](kuku-second-brain.md)(거버넌스 정본) · goose-harness-groundtruth(하네스 정본) 옆 *검증·반환각 정본*. read-intent-not-keyword·data_access·clean-room 메모리의 학술 도메인 확증.

---

## 열린 질문

- L3 claim-faithfulness audit의 anchor fetch 정확 배선(`claim_ref_alignment_audit_agent`)? — 작가 research-relay 출처검증 강화 시 참조 후보(미정독).
- Material Passport schema 전체(provenance ledger 구조) — 작가 출처 frontmatter 고도화 시 참조(미정독, handoff_schemas.md).
- calibration gold set 20-tuple 구성법 — 작가 private-outcome eval 설계 시 참조 후보.

---

## 다음 학습 후보

- **PaperOrchestra**(arXiv:2604.05018, Google) — ARS v3.3 영감원(S2 검증·anti-leakage·VLM figure·score trajectory). 검증 파이프라인 선행연구.
- **Lu et al. 2026 (The AI Scientist, Nature 651:914)** — 7 failure modes·calibration Table 1의 1차 출처. RSI/자율연구 ground-truth.
- **experiment-agent**(같은 저자) — ARS Stage1↔Stage2 사이 실험 실행 갭. 작가 게임 밸런싱 실험과 인접 가능.

---

## 연결된 페이지

- [검증자의 주장도 환각이다 — 강한 주장은 1차 출처로 재-Gate](verifier-claims-need-regate.md)(검증자 환각 — concession threshold·cross-model이 메커니즘 구현) · research-relay-default-gpt(GPT 외주 — cross-model 31%가 정당화) · external-ai-grant-hardcontract(외부 AI grant) · agent-harness(RSI — 7 failure modes 직결) · dispatch-builder(done-gate 차용 후보)
- [Kuku — 작가 Sub-brain 거버넌스를 제품화한 로컬 Markdown 앱 (외부 ground-truth)](kuku-second-brain.md)(거버넌스 정본 ↔ 본 페이지 검증 정본) · goose-harness-groundtruth(하네스 정본) · [Gnosis — 파인튜닝 없이 헌법·메모리·루프로 성장하는 자가개선 에이전트 (vault 아키텍처 수렴 ground-truth #5)](gnosis-self-improving-agent.md)(측정축 — calibration FNR/FPR 인접)
- *(read-intent-not-keyword·cold-verify-before-adopt·data_access·clean-room = 작가 운영 메모리, 본 학습이 외부 확증)*
