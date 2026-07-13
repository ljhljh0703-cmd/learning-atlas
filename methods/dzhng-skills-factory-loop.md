---
created: 2026-07-06
updated: 2026-07-06
type: learning
tags: [skills, factory-loop, spec, slice-graph, visual-gate, blind-eval, test-policy]
source: https://github.com/dzhng/skills
authors: [dzhng]
year: 2026
category: method
---
<!-- dzhng/skills 팩토리 루프 16스킬 해체 — 대부분 기존 harness 확증, 흡수 델타는 6종만(slice graph·recursive fog·visual less-wrong·blind eval·falsify-once). 대량 install 금지. -->

# dzhng/skills — 소프트웨어 팩토리 루프 (델타 흡수)

Codex ③Gate PASS 2026-07-06(SHA 3/3·commit `bca9d7e` 핀). **대부분 기존 agent-harness·dispatch-builder·hermes-loop 확증 — 흡수는 델타 6종만.** whole-install 금지.

## 0. 무엇인가

대형 코딩 작업을 *팩토리 루프*로: unknowns 매핑 → sliced spec → slice별 구현 → 테스트·시각 검증 → sediment 리팩터 → spec을 rationale로 close → blind golden case로 skill eval. 16 SKILL.md. **가치 = `npx skills add` 워크플로우가 아니라 어휘·운영 형태**(패턴 소스지 권위 아님).

## 1. 흡수 델타 (vault 결여분)

1. **spec slice graph = live product surface** — `specs/<feature>/README.md` + `slices/` + `assets/` + `visualizations/` + live "Next Agent Prompt" + evidence ledger. dispatch phase보다 날카로운 *다중 세션 장기 작업* 폴더 셰이프.
2. **recursive fog audit(reslice)** — 첫 계획 후, 위험 slice를 *각자 하나의 feature로* 재감사. 여러 변수 숨기면 구현 전 reslice.
3. **one visual variable per slice** — 시각 작업은 최종 프레임 한 번에 매칭 X. density·silhouette·color·texture·lighting·label·motion 분리. [HTML Sensory 품질 레버 (bespoke용)](html-sensory-quality-levers.md)·게임 UI 리뷰 강화.
4. **visual less-wrong gate** — baseline = ground truth 아님. metric은 *telemetry*(발산 위치), 판정은 *target 대비* human/agent. naive screenshot diff 게이트 교정.
5. **blind skill eval** — runner는 input만(expected output X), judge는 artifact+bar+원칙만("make this pass" X). borderline은 재실행(agent flicker). → skill-curator 도입 후보.
6. **falsify tests once** — 수정 후 쓴 regression test는 *기대 이유로 한 번 red* 만들어야. "test exists and passes"보다 강함.

(부록: `unknowns quadrant` known/unknown 4분면 → 1 map artifact — taste·tacit 제약 클 때. skill = behavioral compression(문서 아님) 저작 원칙.)

## 2. Reject (로컬 거버넌스 충돌 — 흡수 금지)

- whole repo install as-is
- commit-per-pass 기본 룰 · "full spec 끝까지 무정지 자율" · non-blocking human checkpoint(짧은 창 후 진행)
- 무인 장기 자율 = 정확성 증거 취급(README 1d16h = 이미지뿐, 재현로그 0)
- screenshot metric = acceptance score 취급
- 파일 소유·Gate 경계·승인점 불명확한데 병렬 위임 default

→ 전부 vault HITL·게이트·Codex 제어와 충돌. Codex도 동일 reject.

## 3. 외과 merge (선택)

- **falsify-once** → dispatch-builder TDD 부록 1줄
- **less-wrong·crop** → [HTML Sensory 품질 레버 (bespoke용)](html-sensory-quality-levers.md) anti-slop 방향 링크
- **verifier가 maker reasoning 봤는가** 필드 → dispatch 검증기준(anthropic-fable-workshop 게이트와 공통 델타)

## 4. skill 후보 (전부 park — 미빌드·needs approval)

`spec-slice-graph-handoff`(write-spec) · `visual-less-wrong-gate`(compare-screenshots, anti-slop-frontend-gate 병합 후보) · `blind-skill-eval`(eval-skills → skill-curator) · `tracer-bullet-test-policy`(write-tests → dispatch-builder 부록). 실사용 입증 후 `.incubator/` 등록·active 승격.

**후속 소스**: vercel-labs/skills · skills.sh(registry provenance) 비교.
