---
created: 2026-07-16
updated: 2026-07-16
type: learning
category: method
tags: [obsidian, file-over-app, agent-skills, cli, kepano, vault-methodology, codex-return]
source: "~/Documents/Codex/2026-07-14/kepano-obsidian-skills-asset-audit/outputs/2026-07-14-kepano-obsidian-skills-RETURN.md (source_pin a1dc48e, MIT)"
---
<!-- kepano(Obsidian) 5-skill 감사 — file-over-app 방법론 delta + read-only CLI 쿼리면 후보(Codex 흡수, ③Gate 2026-07-16). -->

# kepano Obsidian Skills 감사

> ⚠️ 임시(provisional) — Codex 감사 산출 흡수. 작가 컨펌 전. 원본 vault 밖 `~/Documents/Codex/2026-07-14/kepano-obsidian-skills-asset-audit/`.

Steph Ango(Obsidian CEO)의 5-Agent-Skill 저장소(`obsidian-markdown`·`obsidian-bases`·`json-canvas`·`obsidian-cli`·`defuddle`) 감사. **직접 설치 0/5** — 룰셋 알맹이만 흡수([외부 도구는 설치 말고 해체해 흡수 (Dissect, Don't Install)](dissect-not-install-external-tools.md) 원칙). 핵심 철학 = **file-over-app / plain-text**(공개 포맷을 diff 가능한 파일로 직접 조작) — 본 vault 가 이미 선도(wikilink·frontmatter·integrity-lint).

## REAL DELTA (vault 미보유)

- **Obsidian CLI read-only 쿼리면** (최고가치) — live Obsidian CLI 로 search/outline/backlinks/properties/`base:query` → compact JSON. rg/graphify 대체 아닌 **빠른 L1 후보**. 런타임 1.12.7 실검증(정확 vault 경로·실 결과).
- **`.base` 파생 read-only 감사 뷰** — `wiki/learnings/**` provenance 스캔용(SSOT 아님, 파생 뷰).
- **Obsidian 전용 syntax 소품** — block ID/block-link·embed 변형·foldable/nested callout·comment/highlight(authoring reference 미수록분).
- **정정** — JSON Canvas 1.0 node `id` = *고유 문자열*(16-char hex는 생성 관행이지 스펙 요구 아님 — 원 스킬 오기 보존).

## 위험 (흡수 가드)

Obsidian CLI 는 파괴/임의코드 동사 동반(`delete`·`move`·`property:set`·`plugin:install`·`eval`·`sync:restore`) + 기본 "최근 포커스 vault" → **wrong-vault hazard**. read-only 채택 시 **allowlist + 절대경로 assertion 어댑터 필수**(원본 복사 X). Defuddle = unpinned `npm -g`·라이선스/제거 게이트 없음 → web-reach 스택이 이미 소유(reject-dup).

## Per-Candidate 처분 (each HITL)

| C | 내용 | 처분 |
|---|---|---|
| C1 | `skills/obsidian-cli-readonly/` read-only 쿼리 스킬(allowlist 어댑터) | **Pilot/STAGED** → kepano-obsidian-candidates-2026-07-16 |
| C2 | `.base` 파생 감사 뷰 1개 | **Pilot**(실사용 입증 후) |
| C3 | Obsidian syntax 소품 → `workflows/wiki-authoring-reference.md` 부록 | **Merge/STAGED**(준-convention doc → 작가 확인) → 동 candidate |
| C4 | JSON Canvas 노드 스키마 | **Park**(16-hex 정정만 기록) |
| C5 | Defuddle | **Skip/Reject**(web-reach 중복·unpinned install) |

## Gate Receipt (2026-07-16 ③Gate)

무결성 PASS(SHA256SUMS 일치·source_status 19 URL 200·source_pin a1dc48e MIT). VALUE=**high**(wholesale install 거부·"format PASS ≠ vault promotion PASS" 분리·빈 표면[CLI/Bases] 식별·소스 스펙오류 정정). authority(C1 skill·C3 authoring)=staged, 본 감사노트만 직접 병합.

## 관계

- [AI Employee Obsidian Stack — 파운더 운영 자동화 5피스 (2026-05-15 archive)](ai-employee-obsidian-stack.md) · [Kuku — 작가 Sub-brain 거버넌스를 제품화한 로컬 Markdown 앱 (외부 ground-truth)](kuku-second-brain.md) — vault 방법론 인접(CLI/.base/.canvas 미커버 = 비중복)
- [외부 도구는 설치 말고 해체해 흡수 (Dissect, Don't Install)](dissect-not-install-external-tools.md) — 설치 0·알맹이 흡수 원칙
