---
created: 2026-07-22
updated: 2026-07-22
tags: [agent-skills, self-evolving, skill-optimization, validation-gate, sleep-time, distillation, teardown]
type: learning
source: [https://arxiv.org/abs/2605.23904, https://github.com/microsoft/SkillOpt]
authors: ["Yifan Yang", "et al. (Microsoft)"]
year: 2026
category: technique
---
<!-- Microsoft SkillOpt(arXiv 2605.23904) 해체 — 스킬 문서를 frozen 에이전트의 학습가능 상태로 보고 epoch·LR·held-out 게이트로 훈련(가중치 무변경). vault 자가성장 테제의 연구·벤치·제품판. 매핑 거의 1:1. -->

# SkillOpt — 스킬 문서를 "학습 가능 상태"로 훈련 (Microsoft 해체)

> **정체**: **스킬 문서 = frozen 에이전트의 *학습 가능 상태*.** 신경망 훈련하듯(epoch·batch·learning-rate·검증 게이트) 훈련하되 가중치는 안 건드림. 옵티마이저 LLM이 *채점된 롤아웃*을 스킬 문서의 **bounded add/delete/replace 편집**으로 바꾸고, **held-out 검증 점수를 *엄격히 개선할 때만* 채택.** 출처: Microsoft(arXiv 2605.23904, MIT, PyPI). read-only 해체 2026-07-22. **vault 자가성장 테제의 연구·벤치판 — 매핑 거의 1:1.**

## 메커니즘
- **훈련 루프**: rollout → reflect → aggregate → select → update → evaluate.
- **옵티마이저 규율**(가중치 훈련 차용): 텍스트 **learning-rate 예산**(편집량 상한) · **rejected-edit 버퍼**(실패 편집 기억) · **epoch 단위 slow/meta update** → 스킬 훈련 안정.
- 배포물 = 압축 `best_skill.md`(300–2,000토큰), **추론시 추가 호출 0**. 타깃 모델 불변.
- **SkillOpt-Sleep**: 야간 오프라인 자가진화 = **harvest**(Claude Code/Codex 트랜스크립트, 로컬 read-only) → **mine**(반복 태스크; 휴리스틱이 *retry-chain=실패 시도* 감지) → **replay**(오프라인) → **consolidate**(reflect→bounded edit→**실제 held-out 태스크 GATE**) → **stage → (작가) adopt**. `dry-run/run/status/adopt/schedule(cron)`. SkillOpt + Claude Dreams(오프라인 consolidation·review-then-adopt) + agent-sleep 합성.

## 결과 수치
6 벤치 × 7 모델 × 3 하네스(direct chat·Codex CLI·Claude Code CLI) = **52셀 전부 best/tied-best**. GPT-5.5: no-skill 대비 **+23.5(chat)·+24.8(Codex loop)·+19.1(Claude Code)**. **스킬이 모델 스케일·하네스·인접 벤치로 전이**(재최적화 없이).

## vault delta — 거의 1:1 매핑
| SkillOpt | vault 기존 |
|---|---|
| 스킬 자가진화 루프 | hermes-loop ⑤Distill · 스킬 자가성장 |
| stage → 작가 adopt | `스테이징 영역` + HITL 스테이징 |
| held-out 검증 게이트 | ③Gate — **단 vault=정성(환각·계약 대조), SkillOpt=정량(점수 엄격개선)** |
| rejected-edit 버퍼 / candidate→adopt | [기억 성숙도 3층 (Memory Maturity 3-Layer)](../methods/memory-maturity-3layer.md) · archive-only |

## 훔칠 것 3개 (vault에 없는 것 — §hermes-loop ⑤에 참조 반영)
1. **정량 held-out 게이트** ★ — vault ③Gate는 정성. "이 스킬 편집이 held-out 태스크 점수를 *실제로* 올렸나"를 측정. **[ESAT — 환경 없이 API-에이전트 훈련 데이터 합성 (Apple)](esat-environment-free-agent-data.md) judge-precision·"게이트 신뢰도 정량화" 차용과 같은 방향** — *검증가능 답이 있는 스킬*에 한해 게이트를 숫자로.
2. **트랜스크립트에서 반복 실패/의도 마이닝** — retry-chain(부정 피드백 후 재질문=이전 시도 실패) 자동 감지로 개선 대상 추출. vault는 RETURN·세션에서 *수동* 증류(레인 B "3회 반복 감지"의 자동화 후보).
3. **스킬-as-trainable-state 규율** — bounded 편집 + LR 예산 + rejected 버퍼 = 스킬 편집을 옵티마이저처럼(무분별 재작성 대신 경계 있는 증분).

## 냉정 한계 ★
- **핵심 게이트가 *채점 가능 벤치*를 요구** — SearchQA·ALFWorld·SpreadsheetBench = 정답 자동채점 태스크. **vault 스킬 대부분(정체성·창작·design-taste·vault 운영)은 held-out 자동점수가 없다.** → SkillOpt 킬러 메커니즘은 *검증가능 태스크 스킬*(코딩·검색·데이터)에만 깨끗이 적용, 작가 **취향·정체성 코어엔 정성 게이트 유지**.
- **작가는 야간 cron을 *의도적 거부***(스킬 자가성장 §: "cron 0, 모든 mutation 사용자 트리거"). SkillOpt-Sleep은 `schedule`(cron) 제공하나 adopt는 human-gated 스테이징 — 작가는 `dry-run`/수동만, 자동실행 자체 거부.
- **프라이버시**: 실 백엔드가 트랜스크립트 발췌를 provider 전송(secret-free 미보장). 개인 vault엔 redact 필요.
- **설치 X**([외부 도구는 설치 말고 해체해 흡수 (Dissect, Don't Install)](../methods/dissect-not-install-external-tools.md)) — 메커니즘만.

## 관계 / 반영
- 자가성장 계보: hermes-loop ⑤Distill · [기억 성숙도 3층 (Memory Maturity 3-Layer)](../methods/memory-maturity-3layer.md) · [Multimodal Resource → Skill Wiki (RESOURCE2SKILL 해체)](multimodal-resource-to-skill.md)(RESOURCE2SKILL, 멀티모달 스킬위키) 인접.
- **반영**: [학습→반영 루프 (Absorb-to-Apply)](../narrative/학습→반영 루프.md) ①Apply — hermes-loop ⑤Distill에 "훔칠 것 3개"를 비권위 참조 반영(2026-07-22). 정량 게이트는 *검증가능 스킬 한정* 조건부, 취향/정체성 코어 제외.
