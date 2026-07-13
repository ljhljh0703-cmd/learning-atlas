---
created: 2026-07-06
updated: 2026-07-06
type: learning
tags: [multi-agent, agent-org, claude-code-hooks, roster, cost-telemetry]
source: https://www.youtube.com/watch?v=c-loQfGep5g
authors: [NAVER D2 (NaverMadCat talk)]
year: 2026
category: method
---
<!-- NaverMadCat(NAVER D2 "AI 에이전트 회사 차리기") 강의의 운영-델타: 에이전트 조직·라이프사이클·동기화·HR·비용 텔레메트리 설계. -->

# NaverMadCat — 에이전트 "회사" 운영 델타 (조직·라이프사이클·HR·비용)

> 출처: NAVER D2 강의 `AI 에이전트 회사 차리기: 설립부터 어디서든 동기화까지`(c-loQfGep5g, 2026-06-30) 해체 → Codex RETURN ③Gate PASS(2026-07-06). **⚠️ 수치·자가주장 흡수 X**: 발표 아키텍처는 *source-reported*(공개 코드 미검증). 수치 red-flag 정본 = [Gnosis — 파인튜닝 없이 헌법·메모리·루프로 성장하는 자가개선 에이전트 (vault 아키텍처 수렴 ground-truth #5)](gnosis-self-improving-agent.md) §red-flag(MadCat 단일벤더 편향·외부 검증 부재). 본 노트 = 그 노트와 중복 없이 *운영 델타(재사용 엔지니어링 패턴)*만.

## 흡수 구조 (source-reported)

```text
secretary-chief 루트 에이전트
+ simple/team 라우팅
+ 10 부서 / 11 에이전트
+ 세션당 활성 팀 1개 (전면 동원 금지)
+ Claude Code 라이프사이클 훅
+ Git 기반 멀티-PC 동기화
+ roster 기반 HR
+ 대시보드 + 측정된 비용 이벤트
+ (선택) Gate로 제한된 성장 루프
```

## 재사용 패턴 (델타 — 우리에 없던 구체)

- **세션당 1팀 규칙 + 전면 동원 금지** — 주의력/토큰 예산 보호. [Building Effective Human-Agent Teams — 인간-에이전트 협업 팀 구축 방법론](building-effective-human-agent-teams.md) Attention Budgeting의 조직 버전.
- **라이프사이클 훅 맵** — SessionStart / PreToolUse / PostToolUse / SessionEnd. vault의 SessionStart 훅(digest-reminder)·nightly-updater와 정합 — 훅 표면을 조직 수준으로 확장한 참조.
- **roster = HR 단일 진실원** — 에이전트 상태(활성/보관/tombstone)를 roster가 권위. **archive/tombstone 가드**로 실수 재고용 차단 = vault Archive-Only invariant(스킬 자가성장)와 동형.
- **에이전트/모델/세션별 실제 비용 귀속** — 측정된 비용 이벤트. [Loop Engineering (Addy Osmani & Neyzis) — 프롬프터에서 루프 디자이너로 가는 14단계 로드맵](loop-engineering.md) Nadella "private evals"(작가 관심 outcome 추적)의 비용 축.
- **serious harness는 install/doctor/rollback 요구** — 도구화의 최소 계약. [외부 도구는 설치 말고 해체해 흡수 (Dissect, Don't Install)](dissect-not-install-external-tools.md)와 긴장(우리는 infra-0라 install 지양) — 참조로만.

## 반영 (학습→반영 루프)

- **반영처 = 참조 지식(순수)**. vault는 이미 단일작가·2-AI(Claude+Codex) 체제라 "10부서 11에이전트" 조직을 도입하지 않음(Karpathy #2 — 억지 반영 X). 델타는 *향후 에이전트 팀 설계 시 참조 창고*(예: harness-factory 확장 시).
- **정합 확인**: 세션당 1팀·roster HR·훅 맵·비용 귀속 = 이미 vault가 부분 실천(SessionStart 훅·Dual-Track·private evals). 신규 도입 아닌 *외부 확증*.
- **company-brain-agent-operating-stack 패킷(2026-07-10 codex-gate) = 본 노드로 흡수(SKIP standalone)**: `Sources→Ingest→Company Brain→Orchestrator→Verticals→Human Gate→Writeback` 루프 = 본 "AI 에이전트 회사"의 solo-studio 축약 재진술, 신규 델타 near-zero. 별도 노트 신설 X(중복 회피, 패킷 자가경고와 일치).

## 한계·미검증

- 전 아키텍처 = 발표자 주장, 공개 코드/제3자 검증 없음.
- 수치(부서수·비용절감 등) 흡수 금지 — caveat로만(R-04 환각 고착 차단).
- 영어 자막 429 차단·저해상 영상 403 차단 → 스토리보드 23시트 + 한국어 자막 + D2 API로 재구성(부분 증거).

## 연결된 페이지

- [Gnosis — 파인튜닝 없이 헌법·메모리·루프로 성장하는 자가개선 에이전트 (vault 아키텍처 수렴 ground-truth #5)](gnosis-self-improving-agent.md) (수치 red-flag 정본·Gate 제한 성장) · [Building Effective Human-Agent Teams — 인간-에이전트 협업 팀 구축 방법론](building-effective-human-agent-teams.md) (roster·Attention Budget) · agent-harness · [Loop Engineering (Addy Osmani & Neyzis) — 프롬프터에서 루프 디자이너로 가는 14단계 로드맵](loop-engineering.md) (비용/측정) · [MLXP — Kubernetes LLM Serving 최적화 (NAVER, 정지윤·장혁진)](../techniques/mlxp-k8s-llm-serving.md)·[WebArena / OSWorld — 에이전트 평가 계약 (final-state grading)](../techniques/webarena-osworld-eval-contracts.md) (같은 NAVER D2 큐)
