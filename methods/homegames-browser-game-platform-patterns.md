---
created: 2026-07-10
updated: 2026-07-10
type: learning
tags: [game-platform, browser-game, ai-game-production, publish-gate, multiplayer, thin-client]
source: [https://homegames.io/, https://github.com/homegamesio]
authors: [homegamesio]
year: 2026
category: method
---
<!-- Codex 해체분석 ③Gate 흡수(2026-07-10) — 브라우저 게임 플랫폼 운영 패턴(코드 복사 아님). -->

# Homegames — Browser Game Platform Patterns

> ③Gate 통과(2026-07-10). SHA 일치·자가결함(GPLv3↔ISC 미해결) 정직 신고. **아키텍처·계약·검증 패턴만 흡수, 코드 복사 금지**(라이선스 미해결). game-studio-pipeline-brief·ai-game-production-harness의 창작 플랫폼 레인 델타.

## 1. Thin Client · Authoritative Server

게임은 서버측 단일 인스턴스로 실행. 클라이언트는 init/asset/state 프레임 수신 → scene graph 렌더 → 정규화 입력(click/key/touch/gamepad) 전송만. → 멀티플레이가 게임별 코드가 아닌 **플랫폼 속성**이 되고, 히든 정보를 서버측에서 필터. 트레이드오프: 서버 비용·스케일이 즉시 현실, "멀티플레이 무료"는 운영상 무료 아님.

## 2. Scene Graph = Wire Contract

게임은 직접 그리지 않고 0-100 좌표평면의 노드 트리(shape/text/asset)를 mutate → serializer("squish")가 바이너리 프레임 인코딩 → 클라 디코드·페인트. 재사용 계약: **AI 생성 게임용 작은 비주얼 DSL**(렌더러를 검증 가능할 만큼 결정론적, 작성 표면을 raw DOM/canvas보다 작게). 작성 규칙 — 속성 mutation은 state-change notifier 호출·tick rate=대역폭(이벤트형은 tick 회피)·per-player 가시성 scope·키보드 가정 금지(tap-first)·안정 node ID/layer로 flicker 방지·클릭은 topmost 승리.

## 3. Version-Pinned Engine Contract

게임이 `squishVersion` 선언 → 매칭 serializer/renderer. 구 게임을 조용히 마이그레이션하지 않음(포맷 mutate 금지). 반영 패턴: **AI 게임 DSL·템플릿·save 포맷·생성 런타임 API는 산출물에 버전 pin**, breaking change = 새 런타임 버전, validator가 import/runtime 버전·메타 일치 확인. 장수 AI 생성 게임의 rot 방지.

## 4. Publish Gate for Untrusted Code (핵심 델타)

published 코드를 **공격자 통제 코드로 취급**. 배포 워커 검사: entrypoint·license·file/total size·**AST 스캔(금지 모듈·동적 실행)**·no-network read-only Docker 검증·load/instantiate/run smoke·asset 수집+NSFW 플래그·commit SHA pin.

```
AI/game source → static scan → sandbox run → runtime smoke → asset/moderation → pinned publish
```

"빌드되나?"보다 강함 — 유저/AI 생성 코드가 적대적·고장·과비용일 수 있음을 가정. → ai-game-production-harness optional `publish-gate` proof family 후보(UGC/AI 코드 수용 시).

## 5. Studio Loop: AI edit = unsaved change

AI 워커에 상세 작성 가이드 주입 → AI가 코드 재작성하되 Studio에 **unsaved change로 착지**(유저 리뷰). validator 실패 = retry feedback. AI 산출 auto-publish 금지. `intent→AI edit→preview→validator→user review→save→publish gate`. **validator와 AI 프롬프트가 같은 가이드 참조**(LLM authoring contract = 실행 계약).

## 6. 반영 (Apply-or-Park)

- **① Applied**: 본 노트(정본). world-of-claudecraft-direction·game-studio-pipeline-brief ⑤Verify와 상보.
- **② Parked(트리거: 웹/UGC 게임 착수)**: patch 후보 3종(ai-game-production-harness publish-gate 레인·game-studio-pipeline-brief browser Studio ref·game-fun-delegation bot-fill) + `browser-game-platform-intake` skill 후보. 현재 브라우저 플랫폼 부재 → YAGNI(Karpathy #2). → codex-gate-park-backlog-2026-07-09.
- **라이선스 게이트**: GPLv3(공개 페이지)↔ISC(일부 repo 메타) 미해결 → 코드 재사용 전 사람 확인 필수.
