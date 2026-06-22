---
created: 2026-06-16
updated: 2026-06-16
type: learning
tags: [agent-ops, simulation, work-tracking, source-of-truth, memory, methods]
category: method
source: https://github.com/alexmcdonnell-airtable/hyperagent-public-skills
---

> 출처: hyperagent-public-skills 3스킬(`business-simulation-operator-method`·`airtable-kanban-work-tracker`·`landscaping-design-and-quote`) 전문 통독(clone, 2026-06-16). 광고/포폴 직결은 아니나, *장기 에이전트 운영* 패턴이 vault 운영(sim·dual-track·decisions·memory)과 강하게 adjacent — "당장 안 써도 연관되면 박제"(작가 지시).

# Agent Sim/Ops Patterns (vault-adjacent)

## A. Business Simulation Operator Method → vault 운영 정합
실시간 가상 비즈니스를 operator로 운영하는 방법론. 매 룰이 실패서 도출. vault 매핑:
- **Calendar discipline(#1 실패모드)** — Day 1을 *달력 날짜에 1회 앵커*, 항상 `sim_day=(today−day_one)+1` 계산. **마일스톤서 앵커 재유도 금지**(milestone 옮기면 썩음). prose 아닌 *스크립트*(`simclock.py`)에 박고 `--check` 자가테스트. → vault: 날짜 의존 결정·mirofish-lab 같은 장기 sim에 동일.
- **🚨 Memory bloat = 위험(단순 지저분 아님)** — auto-save 메모리가 *틀린 사실*(예 잘못된 날짜 앵커)을 복제하면 대화서 고쳐도 *매 턴 재주입*. canonical 사실은 **모든 root에서 수정**(brief/시스템프롬프트 + 단일 canonical 메모리 + 스크립트), auto-save 끄고 중복 prune. → **vault `memory/MEMORY.md` 시스템에 직접 경고**(중복 메모리·stale 메모리 재주입 위험. [WebFetch 는 lossy 요약 — 충실 학습은 clone 통독](webfetch-is-lossy-clone-for-fidelity.md) 같은 교훈도 단일 root 유지).
- **Source-of-truth locking 위계** — `user 지정 > 승인 artifact > 검증된 real-world > 생성물`. 충돌 시 작가에게 designate 요청·기록. → vault SSOT/decisions/HITL(R-01)과 동형.
- **Delegated authority threshold** — 숫자로 명시(≤$X 결정·실행 / 초과 escalate+옵션+추천). 권한 내 = 묻지 말고 실행→로그→보고. identity/legal/불가역은 명시 컨펌만. → vault 권한분리·dispatch-design-ask-first 정합.
- **Persona team** — 명명된 전문 subagent에 작업 귀속. "AI=volume, 인간=stakes". → 3-AI 분업의 일반형.
- **Real-world grounding + self-audit** — 모든 명명 entity(장소·벤더·가격)는 *실소스 검증* 후 기록(검색 먼저, 발명 금지). 업데이트 끝에 self-audit. 오류는 *correction entry*로 기록(숨기지 X). → ③Gate·환각가드와 동형.
- **Finance honesty / risk cadence** — 검증된 실비용서 projection, 실제 착지 시 공개 re-baseline+variance ledger. 무인 런은 *repetition guard*(material 변화만 alert). → daily-cards/nightly-updater·dual-track 회고 정합.

## B. Airtable Kanban Work Tracker → progress/dual-track 정합
- **Bracket every work turn** — 턴 *첫 액션*=레코드 in-progress, *마지막 액션*=ready-for-review(+링크). 사이에 실작업. 이게 보드를 신뢰 가능하게 함.
- **Status=handoff signal, not decoration.** 1 thread=1 record. **내 레인은 in-progress→review까지, downstream(Approved/Shipped/Done)은 인간 소유** — 명시 없이 downstream 설정 금지. → Dual-Track progress/hot.md status·Hermes ③Gate 인계와 동형(작업자=review까지, 작가=승격).
- ID 추측 금지(base app../table tbl../field fld../rec..), 스키마 1회 학습 후 매핑 persist. → vault "맵→점프" 토큰최소 lookup과 동류.

## C. Landscaping Photo-to-Quote → 전이 가능 패턴
광고/포폴 무관하나 *인터랙티브 deliverable* 패턴 3종 전이:
- **One base, many variants(일관성 lock)** — N 디자인을 *같은 before 플레이트*서 생성(같은 vantage/fence/tree 프롬프트 고정) → 정직한 before/after. → design-index ParkDal **팔레트 스왑**(같은 골격, 토큰만)·포폴 톤 변주와 동형. 영상 로고 lock([광고·영상 제작 파이프라인 (실전)](../techniques/ad-video-production-pipeline.md) §2)과 같은 원리.
- **Connection-points-for-real(데모→프로덕션 배선표)** — 데모(온플랫폼 gen+하드코딩)를 실제 운영으로: intake CRM·geocoding·imagery·measurement·price book·financing·payment·e-sign·delivery 각각 무엇을 연결할지 표로. *minimal viable real version* 명시. → 작가 프로젝트의 "PoC→실서비스" 견적에 재사용 템플릿.
- **Honesty guardrails** — 렌더=AI 시각화·측정=±추정·가격=비구속 견적·데모는 전부 fictional. UX: lean hero + 디테일 on-demand(`<details>`), 숫자는 snap 아닌 *tween*(신뢰감).

## 적용 임계
- A의 calendar/memory-bloat/SoT-locking = *지금 vault 운영에 직접* 유효(특히 memory 중복 경고).
- B = progress/dual-track 기존 구조 확증(신규 도입 X, 정합 확인).
- C = 인터랙티브 웹 deliverable(포폴·광고 케이스페이지·견적툴) 만들 때 인출.
