---
created: 2026-06-28
updated: 2026-06-28
type: learning
tags: [reproducibility, claim-gate, evaluation, llm-checklist, human-baseline, research-method, ai-npc]
source:
  - https://arxiv.org/abs/2003.12206
  - https://arxiv.org/abs/2302.12691
  - https://arxiv.org/abs/2411.03417
  - https://arxiv.org/abs/2506.13776
authors: ["Pineau 외 (NeurIPS 2019 report)", "Semmelrock 외", "NeurIPS'24 Checklist Assistant team", "Human Baselines team"]
year: 2020
category: method
---
<!-- 재현성·체크리스트 4논문 통합 운영법: 주장(claim)을 증거(evidence)에 묶고 4등급으로 쓴다. LLM/인간은 보조, 판정은 게이트. -->

# Research Claim Gate — 주장을 증거 등급에 묶는 운영법

> Codex 외주 통합 해체(ml 재현성 4편 + agent claim-gate)(2026-06-28) ③Gate PASS → ④Promote.
> load-bearing 수치 **전건 추출 텍스트 trace**(71.5/74.4/173/92%/34%, 539/234/78, 20·14/52, 59.13/1.74/13.91/33.04/21.74, n=115).

---

## 한 줄

ML/AI 연구에서 "좋은 결과"는 단일 점수·데모가 아니다. **주장(claim)을 증거(evidence)에 묶고, 재현 패킷을 남기고, 체크리스트는 보조로 쓰되 최종 판단은 인간/게이트**가 한다. → vault 의 hermes-loop ③Gate·[검증자의 주장도 환각이다 — 강한 주장은 1차 출처로 재-Gate](verifier-claims-need-regate.md) 의 연구 방법론 버전.

## 4 논문 한 줄씩 (전부 실재·200, 환각 0)

| arXiv | 주제 | 핵심 |
|---|---|---|
| 2003.12206 | NeurIPS 2019 재현성 프로그램 | 정책(code policy·challenge·checklist)이 신호는 만들지만 *논문 품질 개선 증명은 아님* |
| 2302.12691 | ML 재현성 용어·권고 | repeatability/reproducibility/replicability 분리. Experiment/Method/Data 축 |
| 2411.03417 | LLM 체크리스트 보조자(NeurIPS'24) | 누락 탐지엔 유용하나 *부정확·과엄격·adversarial 게임 가능* → author-side·human-gate |
| 2506.13776 | 인간 베이스라인 보고 체크리스트 | "human vs AI" 비교는 별도 측정 설계. 안 갖추면 claim 강도 낮춰야 |

## 1. Claim 4등급 — AI 연구 문장은 이 등급으로 쓴다

| 등급 | 허용 표현 | 필요 근거 |
|---|---|---|
| **Demo** | "이 run 에서 X 관찰됨" | raw log, sanitized replay, seed/config |
| **Repeatability** | "같은 팀/환경 재실행 가능" | commands, env, seed, expected output, run log |
| **Reproducibility** | "독립 검증자가 원 artifact 로 유사 결과" | 공개/접근 code·data·env, license, verification protocol |
| **Replicability/corroboration** | "다른 구현/데이터/조건에서도 결론 유지" | multi-seed, multi-split, external baseline, 통계 분석 |

→ **대표 run 1개 = demo claim 근거는 되나 efficacy/"scaffold 가 성능 개선" 근거는 아님.** 특히 AI NPC/agent 처럼 stochastic·multi-agent 환경에서 치명적.

## 2. 재현성 = code release 가 아니라 evidence architecture (3층)

1. **Artifact**: code, data, env, weights, prompts, configs, commands
2. **Measurement**: metrics, splits, seeds, run count, uncertainty, 통계, baseline equivalence
3. **Governance**: checklist, review 절차, claim gate, human oversight, public/private 경계

최소 패킷 필수 항목: code commit/hash · dataset version/split · model/checkpoint/prompt/config version · hardware/runtime · seed/run count · metric 정의 · 통계 uncertainty 또는 "not measured" · known nondeterminism · 접근불가 artifact 와 사유 · license/use restriction.

## 3. LLM 체크리스트 보조자 사용 규칙 (2411.03417)

- **수치**: pre-survey 539 · 제출 234 · post-survey 78 · 70%+ 유용 응답. 단 freeform issue 중 inaccuracy **20/52**·excessive strictness **14/52** 최다. adversarial rewrite 실험서 **15문항 중 14개**가 3회 공격 후 점수 상승.
- **써도 됨**: 누락 항목 탐지 · claim 과장/범위초과 탐지 · reviewer 전 author-side preflight.
- **쓰면 안 됨**: accept/reject 판정 · human reviewer 대체 · LLM score → paper quality score 환산 · justification 만 다듬어 gate 통과.
- **철칙**: LLM feedback 반영은 **paper/code/log diff 가 있을 때만** 개선으로 인정. score 만 오르고 artifact 변화 없으면 **gaming risk** 표시. LLM 결과 = evidence 아니라 **triage signal**.

## 4. 인간 베이스라인 보고 규칙 (2506.13776)

- **진단(n=115 리뷰)**: test set equivalence **59.13%** yes · power analysis **1.74%** · ethics review **13.91%** yes/**83.48%** unknown · uncertainty estimate **33.04%** · baseline data availability **21.74%**. → 대부분 부실.
- **규칙**: human·AI 같은 test set(subset 쓰면 AI 도 같은 subset) · population of interest 정의 · sample size/power 보고 · recruitment·execution QC · instruction/tool/time 조건 문서화 · metric/rubric equivalence · uncertainty/통계 검정 · 가능 범위 data/material/code 공개.
- **해석**: test set 다르면 "human vs AI" 직접 비교 금지. power 약하면 "pilot"/"illustrative" 로 낮춤. crowdworker 인지 expert 인지 명시.

## 5. AI NPC / 마피아 프로젝트에 바로 붙이기

- 대표 run 문장은 **demo claim 으로 고정.** "scaffold improves performance"·"마을 팀 승률 향상"은 **same-seed/N-parity comparison + uncertainty 전까지 차단.**
- raw logs / sanitized replay / public deck 문장을 **세 파일 분리.** sanitized = presentation evidence 이지 efficacy evidence 아님.
- final 산출물에 `claim_inventory.md` 추가. human baseline/observer study 넣으면 2506.13776 체크리스트를 필수 gate 로.
- LLM reviewer 붙일 땐 author-side preflight only. 안전 구조: 작성 → LLM 누락 flag → **author 가 source artifact 수정(justification 만 X)** → human gate 가 evidence-linked diff 확인 → public claim 을 최강 지지 등급으로 다운그레이드.

## 연결

- hermes-loop — vault ③Gate 의 일반 회로(본 노트 = 그 연구 방법론 버전)
- [검증자의 주장도 환각이다 — 강한 주장은 1차 출처로 재-Gate](verifier-claims-need-regate.md) — 검증자도 환각, 강한 주장은 1차출처 재-Gate
- [AgentBench — agent 평가는 task completion + failure taxonomy다](../techniques/agentbench-evaluation-taxonomy.md) — failure taxonomy = claim 보수화 측정 축
- [Generative Agents (Park et al. 2023) — AI NPC의 성경](../techniques/generative-agents.md) · [Werewolf LLM (Xu et al. 2023, Tsinghua)](../techniques/werewolf-llm.md) — 대표 run/human baseline caveat 적용 대상
- [Academic Research Skills (ARS) — 작가 거버넌스·검증 철학의 학술논문 도메인 쌍둥이](academic-research-skills.md) — concession threshold·calibration 검증 정본과 상보

## 출처

- 2003.12206 Pineau et al. NeurIPS 2019 Reproducibility Program report · 2302.12691 Semmelrock et al. ML reproducibility terminology · 2411.03417 LLM Author Checklist Assistant (NeurIPS'24) · 2506.13776 Human Baselines reporting checklist.
- raw evidence(vault 외 보관): `~/Downloads/AI AGENT/codex-returns/2026-06-28/work/2026-06-28-ml-reproducibility-checklists/` (PDF·text·해시, RETURN 매니페스트 동반)
- 학습일: 2026-06-28 (Codex 충실 해체 외주 → vault Claude ③Gate). skill 후보(research-claim-gate)는 작가 결정으로 **보류**(felt-need/Apply 후 재검토).
