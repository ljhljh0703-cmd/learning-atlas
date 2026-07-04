---
created: 2026-06-30
updated: 2026-06-30
type: learning
tags: [game-design, advergame, web-game, engine-render-split, data-out-of-code, teardown]
source: https://kfc.modak-b2b.com/
authors: [modak-b2b (KFC 캠페인 외주)]
year: 2026
category: technique
---
<!-- KFC 오통파이터(Pac-Man형 광고 미니게임) 번들 해체 — 엔진/렌더 분리·data-out-of-code 구조 추출. Codex RETURN ③Gate 통과분. -->

# KFC 오통파이터 웹게임 기술 해체

> Codex가 프로덕션 번들을 해체, vault Claude ③Gate 통과(SHA 8건 일치·source 58행 200·번들 직접 grep 교차검증). 출처: `https://kfc.modak-b2b.com/` (Pac-Man형 KFC 캠페인 advergame).

## 확인된 구조 (번들 grep 실증)

- **스택**: React 19.2.7(`createRoot`) + Phaser 3.90.0 + Vite 해시 정적번들.
- **3-레이어 분리**: React = 화면흐름/UI(loading→tutorial→playing→clear/over) · Phaser Scene = 캔버스 렌더 · **별도 GameEngine 상태머신** = 룰.
- **엔진=스냅샷 발행 상태머신**: `getSnapshot()`(16회)·`subscribe()` 제공. React·Phaser가 *구독만*. Phaser 물리에 룰 위임 ❌ — 순수 상태머신이 진실, 렌더는 보간/트윈.
- **data-out-of-code**: `maps/maps.json` ASCII-grid(legend `#`벽·`.`/`o`점·`-`게이트·`W`워프·`P`플레이어·`B/I/N/C/D`적). 맵이 코드 밖 manifest로 외부화됨(실측).
  - ⚠ **에셋은 manifest 아님**: 스프라이트/사운드 경로(`assets/characters/ghost-blinky.gif` 등)는 번들에 **하드코딩**. `sprites.json`/`sounds.json` 외부화는 *우리 제안*이지 KFC 실측 아님 — 혼동 금지.
- **전환 닫기**: 클리어 화면 CTA → `go.kfckorea.com/otongfighter` → airbridge 캠페인 파라미터 달고 `kfckorea.com` 리다이렉트(200 실증).

## 왜 "완성도 높게" 느껴지나 (구조 사실)

- 튜토리얼이 별도 도움말 아니라 **첫 화면 필수 흐름** — 시작 전 전체 규칙 노출.
- 목표가 짧다(통다리 3개 수집). 광고게임은 깊이보다 **완료율**.
- 보상 CTA는 **성공 화면에만**, 실패는 다시하기만.
- PC(방향키/WASD)/모바일(조이스틱·스와이프) 입력 분기.
- 픽셀폰트·border-image 버튼·`image-rendering: pixelated`로 톤 일관.

## 추출 delta (엔진 무관 — 재사용 가능)

1. **엔진/렌더 분리 + snapshot 구독** — 룰=순수 상태머신(맵·상태·점수·충돌·승패만, snapshot 발행), 렌더=구독해 그리기만. → "룰 테스트 / 렌더 확인" 분리 가능(fun-feedback-separate-track·default-run reachability 게이트와 정합). **Godot면 autoload 싱글톤 엔진 + 노드 signal 구독으로 직역.**
2. **data-out-of-code** — 맵/에셋/카피를 리소스로 외부화 → manifest 1줄 추가로 새 브랜드/테마. 코드 수정 0이 목표.
3. **완료율 설계** — 60–120초 단일목표 + 1화면 튜토리얼 + 성공화면 전용 CTA 하나.
4. **검증/재미 분리** — 자동게이트(로딩·입력·목표달성·CTA href·콘솔에러 0) ≠ 재미(작가 플레이 별도 트랙).

## 가드 (버릴 것)

- Pac-Man 룰·에셋 **복제 금지** — 구조만 차용(clean-room).
- tick 수치(player 225ms·enemy 261ms·eaten 105ms)는 레퍼런스값 — 박제 X.
- **advergame 광고 flavor(쿠폰 CTA·완료율 최우선)는 광고게임 전용** — 호러·서사 게임엔 부적합. delta 1·2·4(아키텍처)만 범용.

## 반영 ([학습→반영 루프 (Absorb-to-Apply)](../narrative/학습→반영 루프.md))

- **반영처 1 — ✅ 실증 완료(2026-06-30, ③Gate PASS·parity 직접 재현)**: backrooms-escape-pre-gdd Godot 백룸(작가 2주 전 원본=Before)에 delta 1·2·4 적용(backrooms-escape-reform-dispatch-2026-06-30, 광고 flavor 제외). **Before↔After 비교 6축 결과**:
  - 룰→렌더 결합: Game.gd 직접 룰 mutation **15곳 → 0** (룰 전부 autoload `GameEngine` 싱글톤으로, `get_snapshot()`/`state_changed` 계약).
  - 방·이벤트 추가 비용: **코드 2줄+데이터 → 데이터만(코드 diff 0)** (a3_probe로 9방 reachable 실증 후 제거).
  - 룰 단위테스트: 씬 인스턴스 필요 → **headless 가능**.
  - 동작 동일성: Before·After 양쪽 `validate_routes` 8/8 + `qa_game_flow` A/B/C **PASS**(회귀 0).
  - ⚠ **정직한 한계**: LOC는 *줄지 않음* — Game.gd 1440→1329(−111)이나 GameEngine +425로 **총량 1440→1754 증가**. 파이프라인 가치 = *코드 감량 X, 결합 해체·테스트가능·데이터 확장성*. "적은 코드"로 오판 금지(design-fit-not-personality 정직 원칙).
  - 산출 원본(외부, stale 주의): `Documents/Codex/2026-06-30/backroom-reform-after-165226/_dev/BEFORE-AFTER-comparison.md`.
- **반영처 2**: game-studio-pipeline-brief — ③ Produce 의 "엔진/렌더 분리" 실증 레퍼런스로 등재 가능.
- **스킬 후보 보류**: `campaign-mini-game-onepipe`(asset 제안)는 ⑤Distill 3회 임계 미달(1회차) + game-studio-pipeline·html-publish 중첩 위험 → 위 review_trigger로 backlog.

## 출처

- RETURN: `Documents/Codex/2026-06-30/kfc-modak-teardown/outputs/...-RETURN.md` (SHA 8건 일치 검증)
- 번들: `index-BMtztYJl.js`·`GameScene-Ckg5Cc7_.js`·`phaser-C1IXbtjv.js`·`maps.json`
