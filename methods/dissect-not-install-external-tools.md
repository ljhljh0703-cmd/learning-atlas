---
created: 2026-06-28
updated: 2026-06-28
type: learning
category: method
tags: [operating-rule, infra-0, external-tools, vault-native, dissect]
---
<!-- 규율: 외부 도구/플러그인은 설치 말고 해체해 알맹이만 vault-native 흡수 (infra-0). 작가 코인 2026-06-18. -->

# 외부 도구는 설치 말고 해체해 흡수 (Dissect, Don't Install)

> **규율 (한 줄)**: 외부 도구·플러그인을 *그냥 설치*하지 말고, 그 실체를 **해체(dissect)** 해 *알맹이(룰셋·기법)만* vault-native 로 흡수한다. 앱/런타임 의존 레이어는 들이지 않는다 (infra-0 유지).

작가 코인 — 2026-06-18, [Humanize KR (im-not-ai) — 한글 AI 티 제거기 = juhyeong 전 1차 윤문](humanize-korean.md) 교정 발화: *"플러그인 안 쓰고 해체분석해서 사용."* 이후 여러 학습에서 *잠긴 규율*로 인용되어 정본 노트로 backfill (2026-06-28 유지보수).

## 왜

외부 도구(플러그인·CLI·SaaS)의 실체 = **오케스트레이션 인프라**(앱·데몬·의존성 — 통상 *불요*) + **룰셋/기법**(알맹이 — *흡수 가치*). 인프라까지 통째로 들이면:
- infra-0 위반 (앱 의존 레이어 = 유지보수·보안·stale 부채).
- vault 정합 약화 (도구 표준이 wiki 컨벤션을 덮어씀).
- 락인 (도구 사라지면 흡수분도 같이 증발).

알맹이만 해체해 `skills/` 또는 `learnings/` 로 vault-native 화하면, 도구 없이도 Claude(Fast 직접 적용)가 재현 — infra-0 유지 + 영구 보존.

## 적용 절차

1. 도구의 *실체 분해*: 인프라 레이어 vs 룰셋/기법 알맹이 식별.
2. 알맹이만 해체 흡수 → vault 스킬/learnings (출처 주석·origin 표기).
3. 인프라는 도입 X. 꼭 필요하면 cold-verify-before-adopt + 외부도구정책(CLAUDE.md §) 게이트 후 작가 결정.
4. 통독 충실 = 요약 아닌 해체 ([WebFetch 는 lossy 요약 — 충실 학습은 clone 통독](webfetch-is-lossy-clone-for-fidelity.md)).

## 적용 사례

- [Humanize KR (im-not-ai) — 한글 AI 티 제거기 = juhyeong 전 1차 윤문](humanize-korean.md) — 한국어 윤문 플러그인 → 룰셋만 해체 → `skills/humanize-korean/` (설치 X).
- [im-not-strange-ai — Sunny 7 보조 패스 (humanize-korean 확장)](im-not-strange-ai.md) — 설치/플러그인 X, 규율 동일 적용.
- [Matt Pocock의 에이전틱 워크플로우 (하네스 공학)](matt-pocock-agentic-workflow.md) §Sandcastle 도구 — infra-0·TS/Node 의존이라 *점검 대상*, 지식 확증만 도입 X.
- Obsidian 공식 CLI 검토 (hot.md backlog) — 도입 시 본 규율로 앱 의존 레이어 점검.

## 관계

- 상위: **infra-0** 원칙 (cron/launchd/hook 0 선택) · CLAUDE.md §외부 도구 사용 정책.
- 인접: cold-verify-before-adopt(흡수 전 냉정 검증) · [WebFetch 는 lossy 요약 — 충실 학습은 clone 통독](webfetch-is-lossy-clone-for-fidelity.md)(해체=통독) · concept-intake-protocol.
