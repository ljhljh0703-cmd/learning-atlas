---
created: 2026-08-15
updated: 2026-08-16
type: learning
tags: [instruction-bloat, agent-harness, claude-md, agents-md, rule-lifecycle, rationale, provenance, maintainer-executor]
source: https://arxiv.org/abs/2608.11095
authors: [Kushal Chakrabarti]
year: 2026
category: technique
---
<!-- 지침이 왜 계속 쌓이기만 하는가 — 규칙의 탄생 이유를 실행 프롬프트와 분리 보존하는 방법. -->

# Catastrophic Remembering — 규칙은 왜 지워지지 않는가

> ⚠️ **provisional** — Codex 해체 초안 → vault Claude ③Gate 통과, 작가 컨펌 전. 수치는 전부 **저자 보고**이고 독립 재현 안 됨(v1 단일 저자 preprint).

## 한 줄

**지침 추가는 싸고 삭제는 비싸다.** 규칙이 왜 생겼는지가 사라지면 지우는 쪽의 위험만 남아, 파일은 단조 증가한다. 저자는 이를 continual learning 의 catastrophic forgetting 과 대칭인 **catastrophic remembering** 으로 명명한다.

## 관찰 (저자 보고 — 인과 아님)

공개 저장소 1,867개 · `CLAUDE.md`/`AGENTS.md`/`copilot-instructions.md` 의 instruction lifetime 247,694건.

| 축 | 값 |
|---|---|
| 파일 생애 동안 지침 수 | 평균 **+226%** |
| context-file 수정 commit 당 순증 | **+4.9** 지침 |
| 지침이 오래될수록 삭제 hazard | log-hazard **−0.032/commit** |
| 지침 death 중 wholesale rewrite 발생분 | **76.8%** |

마지막 줄이 핵심이다. 규칙은 하나씩 정리돼 죽지 않고 **파일을 통째로 갈아엎을 때 한꺼번에 죽는다** — 즉 개별 판단이 아니라 사고로 사라진다.

> ⚠️ 논문의 `O(2^|D|)` 는 *모든 지침 부분집합을 안전하게 감사하는 이론적 최악 비용*이지 실측 시간복잡도가 아니다. 인용 시 이 구분을 지운 채 쓰지 않는다.

## vault 자체 재현 (2026-08-15~16 실측 — **저자 보고 아님**, 본 vault 관측)

<!-- 2026-08-16 횡단 회고에서 추가. 논문 밖 1차 관측이라 위 §관찰(저자 보고)과 분리 표기. 정본 = 2026-08-16-rule-enforcement-gap -->

흡수 이틀 뒤 vault 가 논문이 서술한 상태 그대로였다 — `hot.md` **42KB**(한 줄 6,129B) · staged 목록 drift **5회차** · 커밋 규율 줄이 *자기 종료조건 실패 후에도* 존치 · `render-stack` "⚠️ 조사(선택 전)" 가 D-010/D-011 확정 후 **4주** 존치.

**걷어낼 수 있었던 조건 = rationale 복원.** `D-016` 이 왜 hot 에만 있는지 확인해 SSOT 로 이관, "선택 전" 은 확정 *사실*을 근거로 제거, ad-storyboard 6건은 `merged` 실측으로 제거 → `hot.md` **-47%**. 논문의 처방(rationale ⟂ 실행 지침 분리)과 같은 구조에 독립 도달한 셈이다.

⚠️ **논문의 경고가 실현될 뻔했다** — §⛔ 의 *일괄 삭제 금지* 그대로, 접기 직전 무스코프 grep 을 한 번 안 돌렸으면 `D-016`(작가 확정 결정)이 유실됐다. 막은 건 절차가 아니라 즉흥적 확인 1회였고, 그래서 *"자르기 전 이관처 확인"* 을 hot-md-closure 에 명문화했다.

🔍 **논문에 없는 축 1개 관측** — 논문은 생성(쌈) ⟂ 삭제(비쌈) 2축이나, 실측엔 **집행 확인** 축이 있었다. 같은 날 *규칙은 옳고 문서에 있는데 집행 경로가 어긋난* 사례 3건(선제 950줄 규칙 코드 미반영 4일 · 최장 줄 단위 혼동 · SessionStart 훅이 구판 가드 자체 구현). **셋 다 켠 직후 실물로 돌려봤을 때만 드러났다.** 규칙 승격은 L-STAGE 파킹.

## 통제 실험이 실제로 보인 것

IFEval 을 뒤집어 "최소 정답 지침 집합"을 아는 작은 세계를 만들고 3조건 비교 — ①주석 없음 ②**주석 *모양*의 무의미한 텍스트** ③실패·이유·반증을 담은 informative comment.

- 51-step 에서 excess instruction `+211.3% → +1.4%`
- 3 maintenance round 후 만족도 `50.4% → 62.0%`
- ②가 ①과 유의하게 안 갈림 → **효과의 원인은 형식이 아니라 정보**(이게 이 논문의 유일한 강한 ablation)

**구현 경계가 결론보다 중요하다**: maintainer 는 comment 를 보지만 **executor 에게는 comment 를 제거한 지침만 전달**된다. `CLAUDE.md` 에 HTML 주석을 그냥 붙이는 것과 **같지 않다** — 후자는 모델 입력에 그대로 들어가 토큰과 간섭을 늘린다.

## ⛔ 가장 중요한 경고 (여기서 멈추지 않으면 오적용된다)

informative-comments arm 은 **마지막에 prompt 를 비워버린 세계가 12.1%** 였고 그 세계에서는 성능이 나빠졌다. 논문 자신의 결론 범위:

- comment 를 **쓰는 것** = 안전
- comment 를 근거로 **자동 삭제하는 것** = 안전하지 않음
- 삭제 경로에는 **인간 유지**
- **safety-relevant instruction 은 자동 삭제 범위에서 제외**

## vault delta — 이미 있는 것 ⟂ 없는 것

**이미 있다**: 결정·출처 provenance / `review_trigger` / Gate·인간 승인 / 중복 제거·held-out / 자기검산 불신 / [goose — 모델독립 에이전트 하네스 (production 오픈소스 정본)](goose-agent-harness.md) 의 "comment = why not what".

**없다**: **규칙 단위 rationale 을 실행 지침과 물리적으로 분리 보존하는 maintainer/executor 이중 표면.** 개념-dedup 2-패스 실측(2026-08-15) — 1패스 `rationale sidecar|instruction rationale` **0건**, 2패스 확장(`why not what|규칙의 이유|지침 비대`)에서 goose 1건. 즉 *원칙은 있고 자산은 없다*.

이 vault 는 논문이 기술한 증상의 **표본이기도 하다** — `CLAUDE.md` 의 규율 다수가 `review_trigger` 를 달고 있으나, 트리거가 발동해도 *그 규칙이 어떤 실패 때문에 생겼는지*는 문서 여기저기에 산문으로 흩어져 있다. 규칙 옆에 반증 조건이 붙어 있는 건 일부뿐이다.

## 최소 자산화 후보 — Instruction Rationale Sidecar

권위 파일을 바로 바꾸지 않는다. **비안전 규칙 10개 이하**로 파일럿.

```yaml
rule_id: R-XXX
instruction: 실행자에게 보이는 규칙
added_at: YYYY-MM-DD
cause_evidence: 어떤 실패/교정 때문에 생겼는가
rationale: 왜 이 규칙이 필요한가
scope: 적용 범위
counterevidence: 현재까지의 반증
falsifier: 어떤 관측이면 약화/삭제 후보가 되는가
safety_class: ordinary | authority | security | destructive
owner: 누가 삭제를 승인하는가
```

렌더 2종 — **maintainer view**(instruction + sidecar) / **executor view**(살아있는 instruction 만).

### Pilot Gate

1. safety/authority/security/destructive 규칙 **제외**
2. 비안전 규칙 ≤10개에 sidecar 작성
3. rationale 없음 / 잡음 / 있음 3 variant 를 **동일 held-out task** 로 비교
4. 측정: instruction count · pass@1 · regression · token · 잘못된 삭제 후보 수
5. **자동 삭제 금지** — 후보만 생성, vault Claude + 작가 승인
6. sidecar ⟂ 실행본 drift 검사

**성공 판정 = "파일이 짧아졌다"가 아니라 *정확도·안전 비열화 없이 오래된 규칙의 유지/폐기 이유를 재구성할 수 있음*.**

## 적용하지 말 것

- 논문 수치를 한국어 vault 에 그대로 일반화(주 실험 최소 지침 2~3개 ⟂ 실제 corpus 중앙값 39개)
- 모든 `CLAUDE.md` 규칙에 즉시 주석 backfill → **입력이 오히려 비대**해진다(§learnings 출처 frontmatter 의 "기존 페이지 일괄 backfill 금지" · Karpathy #3 과 동일 실패)
- "오래된 규칙 = stale" 가정 — 논문이 보인 건 hazard 감소이지 무용성이 아니다
- rationale 이 있다는 이유만으로 삭제 자동화
- safety rule 을 ablation 대상에 포함

## 관계

[goose — 모델독립 에이전트 하네스 (production 오픈소스 정본)](goose-agent-harness.md)(comment = why not what — 원칙층) · agent-skill-quality-gate(pruning A/B · hard guardrail ablation 제외) · [하네스 개선 판정 계약 (Vault-lite)](../methods/harness-gain-evaluation-contract.md)(held-out transfer·비용 측정 — **경로는 `learnings/methods/`**) · [Claude Code 공식 개념 지도 — vault 대조 기준선 (W29)](../methods/claude-code-official-concept-map.md)(파일 비대·조건부 로딩) · CLAUDE.md §"LOCKED 결정에 재검토 조건 의무"(`review_trigger` = 이 논문이 없다고 지적한 것의 vault 선행 구현)

> 반대 축 (2026-08-26): [Compaction Cliff — 규칙과 로그를 같은 비율로 요약하면 안전성이 무너진다](compaction-cliff.md) — 이 노드는 규칙이 *너무 남는* 문제, 그쪽은 압축에서 필요한 규칙이 *지워지는* 문제. 둘을 한 축으로 합치지 않는다.
