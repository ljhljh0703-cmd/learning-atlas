---
created: 2026-07-11
updated: 2026-07-11
type: learning
tags: [maintenance, vault-health, diagnostic, decay, validator, self-audit, dispatchable]
category: method
---
<!-- 왜 vault가 repair를 필요로 하게 되나 — 근본원인 5조건 + Codex/Fable 재사용 진단 프로토콜. 2026-07-11 감사·세션 실증. -->

# Vault 유지보수 조건 — 왜 repair가 필요해지나 (근본원인 + 재사용 진단)

> 2026-07-11 Codex 감사(PARTIAL PASS) + 이번 세션 직접 목격 decay 종합. 표면 증상(invalid frontmatter·broken link·stale graph·aging queue)은 **아래 5개 반복 조건**의 발현. 이건 일회 버그가 아니라 *상시 유지보수 조건* — Codex·Fable에도 디스패치.

## 근본원인 — 5 compounding 조건

### C1. 쓰기 속도 ≫ 검증 속도 (master cause)
매 append/edit는 빠르고, 검증(YAML 유효성·링크 무결성·그래프 신선도·dedup)은 뒤처진다. 이번 세션만 ~30패킷 게이트·수십 노트·다수 커밋 — 그동안 hot.md 비대·log 1010줄 초과·provisional 12건·graphify 45파일 stale 누적. = [WoC 역기획 — AI 게임 생산 방법론 (10종 해체 종합)](../techniques/woc-ai-gamedev-teardown.md) §11 "AI 속도 integration debt"의 *지식베이스판*. **속도가 문제 아니라 검증이 못 따라오는 게 문제.**

### C2. fail-open(거짓초록) 검증기 — 최악
decay를 잡아야 할 검증기 자체가 *조용히 통과*한다: graphify `check-update` silent·integrity-lint 코드펜스 오탐(14 중 10 false-positive)·coherence false-green(접근불가 조용한 skip, 이번 세션 수정)·use-ledger 엔트리가 `<!-- -->`에 갇혀 invisible. **검증 안 했는데 통과처럼 보임 = decay가 안 보이게 쌓임.** 철칙: **검증기는 fail-safe(모르면 "모름"이라 큰소리) — fail-open(조용한 pass) 금지.** ([Shepherd — Reversible Execution Traces (하네스 자가수리 기판)](shepherd-reversible-execution-traces.md) `trace_incomplete`·헌법 "자기보고 불신" 동형.)

### C3. 손-집행 불변식의 drift (forcing function 부재)
hot.md ≤500자·log ≤1000줄·frontmatter=1번째줄·provisional→confirmed — *문서화된 규칙*이지만 손으로 집행. 차단 훅/게이트 없어 누군가 눈치챌 때까지 drift(hot.md 넘침·log 초과·provisional 적체·frontmatter 콜론 미인용 YAML깨짐). infra-0(데몬0) = 세션이 기억해야 하는데, 30패킷 게이트 중엔 housekeeping이 샌다.

### C4. 멀티세션 동시편집 + 유지보수 주인 부재
여러 세션(이 세션·엘드리치·포폴·Codex)이 공유파일(log·hot) 동시 append. **유지보수를 *소유*한 세션이 없음** → 청소가 틈으로 떨어짐(digest 11일 지연·gate:pending 5·staged 4 = 아무도 안 주인). coherence "쓰기 주인" 문제의 유지보수판.

### C5. 살아있으나 불신뢰한 자동화 (false confidence)
자동화가 존재하나 조용히 degrade: nightly updater **52% 성공**(retry/backfill 없음·24h 창)·graphify stale+silent check. **"살아있지만 불신뢰"가 "꺼짐"보다 나쁨** — 거짓 안심을 만든다.

## 재사용 진단 프로토콜 (Codex/Fable 디스패치 가능)
정기(주간/분기) 또는 대량 흡수 후 아래 6조건 점검. *vault 직접쓰기 X — RETURN으로 findings 제출, ③Gate 후 vault Claude 반영.*

| # | 조건 | 점검 | 신호 |
|---|---|---|---|
| 1 | **Frontmatter 유효성** | 활성 .md YAML 파싱(콜론 인용·frontmatter=line1·`---` 앞 서사 없음) | 파싱 실패 = 자동화 라우팅 죽음 |
| 2 | **검증기 정직성(fail-safe?)** | integrity-lint 코드펜스 strip·graphify freshness 실감지·coherence UNKNOWN 큰소리 | *silent pass* 발견 = C2 재발 |
| 3 | **불변식 drift** | hot.md 자수·log 줄수·provisional 수·staged 수·digest 지연일 | 임계 초과 = C3 |
| 4 | **링크/그래프 무결성** | broken link·orphan·graph stale(manifest보다 새 파일수)·최근 노드 retrieve 되나 | broken·stale = C1 |
| 5 | **자동화 신뢰도** | nightly 성공률·launchd·last-success 타임스탬프(alive 아닌 *reliable*) | <90% or 무backfill = C5 |
| 6 | **유지보수 큐 age** | gate:pending·staged patch·미회고 흡수·digest lag | 적체 = C4 주인 부재 |

**출력**: 각 조건 PASS/증상+수치, active-core만(raw/archive/template 제외), 오탐 구분(false-positive 표기). = Codex 2026-07-11 감사 형식.

## 그래프 재빌드 운영 규칙 (실측 기록 — 2026-07-25~26)

<!-- proposed_by: claude · status: provisional (작가 컨펌 전 — 실측 기록 + 운영 권고이지 LOCKED 룰 아님) -->

> **작가 문제제기**: *"재빌드를 몇 번이나 해야 하노."* 이 절은 그 질문의 원인 기록이다. 3회 실측(07-25 전량 · 07-26 AST update · 07-26 증분 update 실패)에서 나온 것만 적는다.

**R-1. 전량 재빌드는 *구조 지표*가 깨졌을 때만.** 파일 몇 개 drift 는 재빌드 사유가 아니다 — `graph_freshness` DEGRADED 를 정직하게 켜둔 채 다음 정기 재빌드까지 간다. 재빌드 트리거로 쓸 지표: 최대 연결성분 <70% · 커뮤니티 라벨 0 · 커버 파일 급감. (07-26 실측: 20,888 노드 그래프를 파일 8개 때문에 전량 재빌드하는 건 수지가 안 맞는다. 07-25 재빌드는 최대성분 68.9%→89.9%·라벨 0→1,266 이라 정당했다.)

**R-2. 증분 `--update` 경로는 현재 신뢰 불가 — 쓰지 마라.** 2026-07-26 실측: 문서 13개 변경분을 증분 병합했더니 병합 단계가 **전역 dedup 을 돌려 순 -1,666 노드**를 만들었다. 안전장치가 덮어쓰기를 거부했고, 대조해 보니 소실분 대부분은 JSON 키 노이즈(`path`·`count`·`heading` ×402)였으나 **`북켓몬 케이스 스터디`·`world-of-claudecraft W25 lesson` 같은 실제 내용 노드도 함께 사라졌다**(서로 다른 파일의 동명 노드를 label 기준 fuzzy 로 병합). 정리가 아니라 손실이다. → force 금지.

**R-3. `graph.json` 과 `manifest.json` 은 반드시 쌍으로만 갱신한다.** 한쪽만 쓰면 조용히 거짓 상태가 된다 — 양방향 다 실측했다. ①07-25: 그래프만 갱신 → freshness 계속 stale(**false-red**) ②07-26: update 흐름이 manifest 만 갱신하고 그래프는 거부됨 → 하마터면 **false-green**(그래프는 09:29 판인데 manifest 는 12:19 판). 게다가 그 manifest 는 freshness 체커가 `duplicate normalized manifest path` 로 거부하는 형태였다(git 복원). = C2·C5 의 그래프판.

**R-4. 중복 대형 JSON 사본이 재빌드 비용과 dedup 충돌의 상류 원인.** `skills/vault-health-gate/retired-routes.json` 과 `wiki/스테이징 영역*/retired-routes.json` 이 거의 동일 → 각각 402 노드를 만들고 전부 라벨이 겹친다(`path`·`heading`·`count`). 스냅샷 디렉토리를 스캔 스코프에서 빼는 게 dedup 을 고치는 것보다 상류다. **미실행 — 스코프 변경은 작가 결정.**

**R-5. 에이전트 보고가 아니라 디스크로 판정하라.** 07-25 실측(실패 보고 후 파일 정상 6건·보고↔파일 불일치 1건)에 07-26 이 1건 추가 — 서브에이전트가 API 오류로 죽었을 때 청크 파일 부재를 *디스크로* 확인하고 재실행했다. 보고만 믿었으면 없는 데이터를 병합할 뻔했다.

**R-6. 그래프 상태 이력은 커밋 본문에 있다 — vault 문서만 뒤지지 마라.** 07-25 재빌드 산출(19,464)과 현 `graph.json`(20,888)의 1,424 노드 차를 "원인 미확인"으로 적었으나, **커밋 `1f60dc9` 본문에 전말이 이미 기록돼 있었다**(AST 전용 update 로 19,464→20,888 · 엣지 25,807→28,201). 같은 커밋이 더 중요한 것도 남겼다 — **그래프 재생성이 커뮤니티 라벨 1,266개를 날렸고, 번호가 아니라 대표 노드(내용) 기준으로 재정박해야 했다**(update 후 커뮤니티 ID 이동 실측: `me_identity` C30→C308). 즉 R-2 의 dedup 충돌(exact 1,529)은 이 AST update 가 시맨틱 노드와 겹치는 파일·섹션 노드를 얹은 결과일 가능성이 높다(가설 — 미검증).
> 운영 함의: **재빌드/update 이력은 `git log -- graphify-out/` 로 먼저 조회한다.** 그래프 파일은 커밋마다 통째로 바뀌어 diff 가 무용하므로, 무슨 일이 있었는지는 *커밋 본문*에만 남는다. 본문을 성실히 쓰는 것이 곧 그래프의 변경 이력 대장이다.

## 관계
- **집행 스킬**: SKILL (2026-07-13 착수) — 본 노드의 건강 조건을 기존 검증기 read-only 오케스트레이션으로 집계(fail-safe HEALTHY/DEGRADED/UNKNOWN). maintenance-prevention 계획 §5 SLO·§M2 healthcheck 의 v0 구현.
- master cause C1 = [WoC 역기획 — AI 게임 생산 방법론 (10종 해체 종합)](../techniques/woc-ai-gamedev-teardown.md) §11 KB판 · C2 = cross-agent-artifact-coherence §7 false-green 수정의 일반화 · use-ledger 강등 스캔·weekly-digest와 상보(사용 계측 ↔ 건강 계측).
- 디스패치: dispatch-builder로 Codex/Fable 감사 지시 조립(vault read-only·RETURN·③Gate 전제).
- **외부 툴화 제안(park)**: `llm-wiki-reliability-harness`(Codex 2026-07-11) = 본 진단 재도출 + vault 기존 검증기(integrity-lint·wiki-graph-lint·sca-gate·autogate)를 *외부 OSS CLI(`lwrh`) + portable skill*로 추출하는 빌드 스펙. 지식 아닌 **제품 제안** → 작가 go/no-go 대기(승인 전 구현 X). 신규 조각=claim-lock format·finding SARIF·README-first 파일럿. `~/Documents/Codex/2026-07-11/llm-wiki-reliability-harness-design/`.
