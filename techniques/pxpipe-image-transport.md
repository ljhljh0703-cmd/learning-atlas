---
created: 2026-07-06
updated: 2026-07-06
type: learning
tags: [pxpipe, token-saving, vision-tokens, context-compression, agent-handoff, factsheet, precision-channel]
source: https://github.com/teamchong/pxpipe
authors: [teamchong]
year: 2026
category: technique
---
<!-- 텍스트를 요약 않고 PNG로 렌더해 입력토큰 절감(비전토큰 면적과금 이용) + 정확문자열은 factsheet 텍스트 사이드채널로 보호. headroom(의미압축)과 다른 failure shape. -->

# pxpipe — 이미지 기반 입력 토큰 절감 (teamchong/pxpipe v0.8.0)

Codex ③Gate PASS 2026-07-06(RETURN 내장 해시 재계산 일치, commit `7dd54d3`). headroom과 **다른 failure shape**(OCR 오독 vs semantic 누락)를 채우는 신규 기법.

## 0. 한 줄

큰 텍스트를 *요약하지 않고* PNG로 렌더해 입력토큰 절감(텍스트=길이 과금, 이미지=픽셀 면적 과금). **2채널**: gist·구조는 이미지로 싸게, 정확 문자열은 텍스트 factsheet/원본 재조회로 보호.

## 1. 핵심 개념 6종

1. **Text→Image Transport** — dense text(code·JSON·tool output·prompt·docs)를 촘촘한 PNG로. repo 주장: dense content가 image-token당 ~3.1 chars vs text-token당 ~1 char.
2. **Static Slab vs Dynamic Tail** — stable/bulky prefix(system prompt·tool docs·old history)만 이미지화, per-turn 변동(user 요청·최근 턴·`env`·`git_status`·`system-reminder`)은 텍스트 유지.
3. **Profitability Gate** — 이미지가 항상 이기지 X. 이미지 vs 텍스트 토큰 추정 + warm cache 상실 one-time burn까지 비교해 통과 시만 이미지화. sparse prose·작은 파일은 손해.
4. **Cache-Safe History Imaging** — old history를 매턴 재이미지화하면 cache key가 바뀜 → `collapseChunk` 단위 양자화, closed tool sequence만 접어 완성 chunk bytes 고정 → prompt cache warm read 유지.
5. **Factsheet Side Channel** — precision-critical token(URL·UUID·path·git SHA·version·flag·큰 숫자·CONST_ID·ticket)을 추출해 텍스트 factsheet로 붙임. export 시 `factsheet.txt`+`prompt.txt`.
6. **Model Allowlist** — 무조건 적용 X. 기본 허용 `claude-fable-5`·`gpt-5.6`, Opus 4.7/4.8·GPT 5.5는 오독률 때문에 opt-in. *"이미지 읽는 고성능 모델" 기대만으론 부족 — 모델별 판독 gate 필요*.

## 2. 사용 금지선 (핵심 가드)

**정확한 ID·해시·숫자·파일명·좌표·코드 심볼을 이미지 OCR에만 맡기면 안 됨.** repo 실측: dense image 안 12자 hex recall = Fable 5 13/15, Opus **0/15**, 실패가 *조용한 오독*. 대응 = recent tail 텍스트 유지·`keepSharp`·factsheet·recoverable 원본 보존.

## 3. Sub-brain 적용 — 대량 자료 외주 handoff

**적용 O**: 큰 코드베이스 일부 읽고 설계/리뷰·긴 tool output/log/JSON/diff·이전 세션/RETURN 패킷 넘기기·다량 참조자료. **적용 X**: NPC memory 압축(이름·약속·수치 OCR 오독 위험), prose 중심 자료.

**권장 패킷 구조**(large-context-handoff):
```text
TASK_TEXT.md        # 텍스트 필수: 목표·제약·성공기준·STOP
FACTSHEET.txt       # 텍스트 필수: path·sha·id·exact number·flags·version
SOURCE_PAGES/*.png  # bulk context: 코드/로그/문서 원문 이미지
MANIFEST.json       # snapshot·page order·checksums·dropped count
REHYDRATE.md        # 원문 재조회: local path·line anchor·command
```
운영 규칙: ①목표·금지·acceptance는 이미지로만 주지 않음 ②byte-exact는 factsheet ③코드 수정 전 원본 재독(이미지 신뢰 X) ④prose 이미지화 X, dense code/log/JSON/diff만 gate ⑤모델별 OCR/gist gate 선행 ⑥vault 원본 뭉개기보다 외부 workspace에서 gate-pending 패킷 → vault Claude 흡수 판정.

## 4. headroom과의 델타

중복(합침): 둘 다 context compression·cache alignment·silent omission 리스크. **신규 델타**: pxpipe = semantic compressor 아닌 **image transport**(요약 아닌 원문 표면 픽셀 보존) · 정확문자열을 factsheet 사이드채널로 분리 · export mode = 대량 자료 넘기는 실전 패키징 도구. (단 model-callable rehydrate tool은 미완성.)

**개념 수확**: 컨텍스트 = 단일 채널 아닌 `gist channel` + `precision channel` 분리. token 절감은 압축률보다 "무엇이 정확해야 하나" 분류가 먼저. Sub-brain token-minimal lookup(얇은 map + exact anchor + 필요시 원문 복귀)과 같은 원리.

## 5. 신뢰도·가드

수치(Fable 5 hex 13/15·SWE-bench Lite req -65%·Pro -59.9% 등)는 전부 **source-reported, repo artifact backed** — 이번 세션 재현 안 함, "독립 재현"으로 승격 금지. "고성능 AI에게 안전" ✗ → "gist bulk엔 유용, exact bytes엔 side channel 필요"로 표기. 모델명(`claude-fable-5`·`gpt-5.6`)은 repo README 귀속 인용(환각 아님).

**skill 후보** `large-context-image-handoff`(park, needs approval — 실사용 1회 입증 후). **열린 질문**: CJK dense rendering 실사용 품질 · factsheet 64 token budget 충분성 · 이미지 page 장기보존·checksum 정책.
