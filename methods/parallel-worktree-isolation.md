---
created: 2026-09-03
updated: 2026-09-03
type: learning
category: method
tags: [parallel, multi-agent, git-worktree, isolation, orchestration, dispatch]
source: https://nurimedia.ninehire.site/tech017
---
<!-- 누리미디어 테크블로그 — 병렬 에이전트의 물리 격리 3층. vault 병렬 규칙(파일 소유권 분리)에 빠져 있던 「격리 장치」. -->

> ⚠️ **임시 (provisional)** — AI 작성, 작가 컨펌 전.

# 병렬 에이전트 격리 3층 — git worktree · 인스턴스 분리 · 화면 조율

## 한 줄
vault 의 병렬 규칙(dispatch-builder 「배타적 파일 집합 + Progress 단독 기록」)은 **규율**이다. 이 글은 그 규율을 **장치**로 강제하는 가장 얇은 방법을 준다: 에이전트마다 폴더를 따로 준다.

## 원문 골격 (3층)
| 층 | 장치 | 무엇을 막나 |
|---|---|---|
| 1 | `git worktree add <폴더> <브랜치>` — 같은 저장소, 작업 폴더만 추가 | 브랜치 전환으로 편집기·개발 서버·빌드 캐시가 흔들리는 것. 에이전트 둘이 같은 파일을 덮어쓰는 것 |
| 2 | worktree 마다 Claude Code 인스턴스 1개. 공유 규약 = `CLAUDE.md` | 인스턴스가 남의 폴더를 탐색·수정하는 것 |
| 3 | 터미널 멀티플렉서(원문은 cmux, 준비 중) | 여러 작업 공간을 한 화면에서 조율 |

원문 핵심 통찰: **작업 분해가 병렬화의 성패다.** 서로 다른 파일 영역을 다루는 작업끼리만 안전하다. (= vault 규칙 ①과 같은 말)

## vault delta — 새로운 것 / 중복
- **새로움**: 규칙 ①(배타적 파일 집합)을 사람의 주의가 아니라 **폴더 경계**로 집행한다. uzmap-forge W28 충돌(R-202b 가 wave1 B1 과 같은 `src/sim/balance/` 를 건드림)은 규칙이 있었는데도 났다 — 장치가 없었기 때문.
- **중복**: 층 2 의 「공유 규약」은 vault 의 `CLAUDE.md`/`*-AGENTS.md` 그대로. 층 3 은 [Paseo 해체 — 전송층은 사고 싶고, 오케스트레이션층은 사면 안 된다](paseo-teardown.md) 이 더 넓게 다룬다(원격·데몬).
- **한계**: worktree 는 *파일* 경합만 막는다. 공유 상태(DB·포트·빌드 산출 폴더)는 따로 분리해야 한다. Progress 단독 기록 규칙은 그대로 필요.

## 적용 지점
1. dispatch-builder 병렬 슬라이스 항목에 「격리 = worktree 1개/슬라이스, 병합은 오케스트레이터」 1줄 → 패치 `wiki/스테이징 영역`.
2. game-studio-pipeline-brief ③제작 단계의 멀티 오케스트레이션 = 이 3층이 물리 바닥. 첫 실측은 게임 실증 슬라이스에서.
