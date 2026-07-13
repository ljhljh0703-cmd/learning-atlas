---
created: 2026-07-06
updated: 2026-07-06
type: learning
tags: [agent-eval, benchmark, computer-use, acceptance-gate, done-gate]
source: https://www.youtube.com/watch?v=N0eMLp6-no8
authors: [WebArena team (web-arena-x), OSWorld team (xlang-ai)]
year: 2024
doi: arXiv:2307.13854
category: technique
---
<!-- WebArena/OSWorld = 에이전트 평가를 "환경·평가 계약"으로 보는 렌즈. final-state 채점 원리. -->

# WebArena / OSWorld — 에이전트 평가 계약 (final-state grading)

> 출처: NAVER D2 영상(N0eMLp6-no8) 해체 → Codex RETURN ③Gate PASS(2026-07-06). 공식 1차출처 대조: WebArena([arXiv 2307.13854](https://arxiv.org/abs/2307.13854)·[repo](https://github.com/web-arena-x/webarena)) / OSWorld([arXiv 2404.07972](https://arxiv.org/abs/2404.07972)·[repo](https://github.com/xlang-ai/OSWorld)·[v2](https://osworld-v2.xlang.ai/)). **수치 재현 X — 개념 계약만 흡수.**

## 핵심 (가장 강한 이식 규칙)

**행동 시퀀스로 채점하지 말고 최종 상태(functional correctness)로 채점한다.**
정답 경로가 여러 개인 과제에서 "정확한 클릭 순서 일치"는 틀린 채점축 — 목표 상태 도달 여부를 프로그래밍적으로 검증.

## 공통 계약 스키마

```text
TaskSpec + 환경 리셋 + 관측 표면(observation) + 행동 공간(action space)
        + 최종상태 평가자(final-state evaluator) + trace 번들
```

| 축 | WebArena (브라우저) | OSWorld (데스크톱/VM) |
|---|---|---|
| 환경 | 브라우저 | VM/데스크톱 |
| 관측 | DOM / 스크린샷 / 접근성 트리 | 스크린샷 / 접근성 / set-of-marks |
| 행동 | click/type/scroll/tab/navigate | 마우스/키보드/터미널 |
| 평가 | 프로그래밍적 최종상태 검증 | 실행기반 평가자 + 부분점수 |
| 특이 | infeasible/unachievable 과제 레인 | task-specific 결과 수집 |

## 반영 (학습→반영 루프)

- **done-gate / acceptance-gate 사고 강화** — vault의 ③Gate·dispatch-builder 슬롯3 done-gate·agent-harness H-14(user-facing proof)가 이미 "최종상태 검증" 원리를 부분 실천. WebArena/OSWorld = 이 원리의 외부 ground-truth(에이전트 벤치 표준). **backlog**: dispatch done-gate에 "행동경로 아닌 최종상태 검증" 명시축 추가 검토(HITL).
- **HTML Agent / 생성 UI acceptance** — 생성물 검증을 "코드 diff 일치"가 아닌 "렌더된 최종상태 기능 정합"으로. html-portfolio-pipeline-memory playwright 재현과 정합.
- **infeasible 레인** — 불가능 과제를 명시 레인으로 두는 설계(에이전트가 "못 함"을 정직 보고하도록). HITL simulate 금지 철학과 정합.

## 🧪 스킬 후보 (승격 보류 — 작가 승인·3회 누적 대기)

`computer-use-eval-harness` (Codex 제안, needs_approval) — source scout→환경/과제/평가자 추출→TaskSpec/Observation/Action/Evaluator 스키마→final-state gate→trace 번들. 브라우저·데스크톱·HTML Agent·게임데모·NPC authoring QA 반복 시 승격 검토. **현재 미생성**(.incubator 규칙 = 3회+ 반복 + 작가 승인).

## 한계·미검증

- 강의 자막 = 자동 캡션 파생 → 기술용어 경미한 오인식 가능.
- 발표/논문 수치 = 제3자 독립 재현 X.
- OSWorld 공식 페이지가 v2를 가리킴 → v1을 "최신"으로 취급 금지.
- 구현 스펙은 clean-room 각색 — WebArena/OSWorld 공식 호환 아님.

## 연결된 페이지

- agent-harness · dispatch-builder · hermes-loop (③Gate) · [MLXP — Kubernetes LLM Serving 최적화 (NAVER, 정지윤·장혁진)](mlxp-k8s-llm-serving.md) (같은 NAVER D2 큐)
