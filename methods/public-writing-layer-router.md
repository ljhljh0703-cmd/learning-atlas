---
created: 2026-07-09
updated: 2026-07-09
type: learning
tags: [writing, humanize, voice, router, packaging, template]
source: [https://github.com/artemnovitckii/content-skills, https://x.com/hey_madni/article/2069010198040326329]
authors: [artemnovitckii, "Madni Aghadi"]
year: 2026
category: method
---
<!-- Codex 2패킷(ai-writing-slash-commands·claudekit-article) ③Gate 흡수 — 공개 글쓰기 레이어 라우터 + 부서형 피치 템플릿. -->

# 공개 글쓰기 레이어 라우터 + 부서형 피치 템플릿

> ③Gate 통과(2026-07-09). 외부 skill pack wholesale import 금지 — method 델타만. 기존 [Humanize KR (im-not-ai) — 한글 AI 티 제거기 = juhyeong 전 1차 윤문](humanize-korean.md)·~~juhyeong-voice~~(폐기 2026-07-30) 파이프라인 라우팅.

## 1. Public Writing Layer Router (artemnovitckii/content-skills, MIT)

5개 레이어를 룰로 라우팅(자동 슬래시 실행은 Claude 전용 — Codex/vault는 룰 텍스트로 수동 적용):

```
fact lock → humanize-korean(필요시) → storytelling(서사면) → viral-hooks(오프너/제목)
→ dumbify(밀도 높으면) → anti-ai(제네릭하면) → juhyeong-voice/portfolio-refiner → fidelity recheck
```

- `/dumbify` = 인지부하 단순화 · `/storytelling` = 서사 구조 · `/viral-hooks` = 오프너/제목 audit(클릭베이트 생성기 X) · `/anti-ai` = specificity/hollow-contrast/hype 필터([Humanize KR (im-not-ai) — 한글 AI 티 제거기 = juhyeong 전 1차 윤문](humanize-korean.md) 중첩) · `/voice-dna` = 프로파일 구축법(깨끗한 작가 corpus 한정, ~~juhyeong-voice~~(폐기 2026-07-30) §7 중첩).
- **STOP 경계**: Claude 앱 skill 업로드·`~/.claude/skills/` 설치·리터럴 슬래시 동작·vault skill 승격은 라우터가 안 함.

## 2. 부서형 기술 피치 템플릿 (ClaudeKit 기사)

packaging 델타(신규 method core 아님). 재사용 공개언어 = **6-field block**:

```
[Department name] [Who it is for] [Current bad loop it replaces]
[Flagship action] [Proof/done gate] [Boundary: what it will not claim/do]
```

세일즈 구조: `raw capability → repeated pain → new operating metaphor → packaged specialist → flagship workflow → proof gate → audience fit → tiny action`. → 원고 템플릿 옵션(voice profile 아님). ⚠ ClaudeKit 구현 품질·명령 강제력은 실파일 미검증 — 주장 금지.

## 2.5 조립 계약 5단계 (Alex Lieberman creator-owned loop — 2026-07-25 ③Gate)

라우터가 *어느 층으로 보낼지*를 정한다면, 이 계약은 **그 앞뒤를 어떻게 잇는지**를 정한다. 부품(humanize·~~juhyeong-voice~~(폐기 2026-07-30)·fact lock·deep interview·feedback ledger)은 vault 에 이미 다 있었고, 없던 것은 **순서와 소유권 규칙**뿐이었다.

1. **초안보다 먼저 인간의 경험·판단을 인터뷰로 채굴한다.** AI 가 빈 화면에서 시작하지 않는다.
2. **인간 확정본을 파생 콘텐츠의 유일한 anchor 로 둔다.** 파생물(요약·스레드·발췌)은 전부 확정본에서 갈라져 나온다. AI 초안에서 파생시키지 않는다.
3. **AI 초안과 인간 최종본의 *차이*에서 후보 교훈을 만든다** — 그리고 **작가 승인 후에만** 재사용 규칙으로 승격(추론 취향 자동 박제 금지, §5.7 기록 규율과 동형).
4. **교훈의 저장과 다음 작업에서의 회수·적용을 별도 Gate 로 검증한다.** 원전 인터뷰가 공개한 실패가 정확히 이 지점 — *저장된 lesson 이 다음 생성에 반영되지 않았다*.
5. **자동화가 비효율이면 사람이 직접 쓰는 우회가 정상 성공 경로다.** 파이프라인 완주가 목표가 아니다.

> **왜 신규 skill 을 만들지 않았나**: 단일 소스의 *조립* 델타이고 부품이 이미 전부 존재한다. 기존 자산을 잇는 얇은 보강이 최소 흡수 단위다(Karpathy #2).
>
> ⛔ **흡수 금지**: `AI Writer's Council 9/10` 점수(인간 평가로 보정된 품질 지표 아님) · 커넥터 전역 스캔(Gmail/Slack/Notion) 권한. 소스 교정분 = `Whisper Flow`→**`Wispr Flow`**, Morning Brew `$75M exit` = 개인 현금 수익이 아니라 *약 $75M 가치로 보도된 다수 지분 거래*.

## 3. Apply-or-Park

- **① Applied**: 본 노드 신설. 라우터 룰 = juhyeong-voice/humanize-korean 파이프라인 앞단 참조. `public-writing-layer-router` skill 후보(park — 실사용 1회 후 승격).
- **② Parked**: skill 화 트리거 = 다음 공개 글쓰기(블로그/회고/지원서) 작업.
- **▸창작** 문체·공개 글. **▸NPC/게임** 무관.
