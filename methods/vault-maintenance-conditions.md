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

## 관계
- **집행 스킬**: vault-health-gate (2026-07-13 착수) — 본 노드의 건강 조건을 기존 검증기 read-only 오케스트레이션으로 집계(fail-safe HEALTHY/DEGRADED/UNKNOWN). maintenance-prevention 계획 §5 SLO·§M2 healthcheck 의 v0 구현.
- master cause C1 = [WoC 역기획 — AI 게임 생산 방법론 (10종 해체 종합)](../techniques/woc-ai-gamedev-teardown.md) §11 KB판 · C2 = cross-agent-artifact-coherence §7 false-green 수정의 일반화 · use-ledger 강등 스캔·weekly-digest와 상보(사용 계측 ↔ 건강 계측).
- 디스패치: dispatch-builder로 Codex/Fable 감사 지시 조립(vault read-only·RETURN·③Gate 전제).
- **외부 툴화 제안(park)**: `llm-wiki-reliability-harness`(Codex 2026-07-11) = 본 진단 재도출 + vault 기존 검증기(integrity-lint·wiki-graph-lint·sca-gate·autogate)를 *외부 OSS CLI(`lwrh`) + portable skill*로 추출하는 빌드 스펙. 지식 아닌 **제품 제안** → 작가 go/no-go 대기(승인 전 구현 X). 신규 조각=claim-lock format·finding SARIF·README-first 파일럿. `~/Documents/Codex/2026-07-11/llm-wiki-reliability-harness-design/`.
