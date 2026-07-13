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

> ③Gate 통과(2026-07-09). 외부 skill pack wholesale import 금지 — method 델타만. 기존 [Humanize KR (im-not-ai) — 한글 AI 티 제거기 = juhyeong 전 1차 윤문](humanize-korean.md)·juhyeong-voice 파이프라인 라우팅.

## 1. Public Writing Layer Router (artemnovitckii/content-skills, MIT)

5개 레이어를 룰로 라우팅(자동 슬래시 실행은 Claude 전용 — Codex/vault는 룰 텍스트로 수동 적용):

```
fact lock → humanize-korean(필요시) → storytelling(서사면) → viral-hooks(오프너/제목)
→ dumbify(밀도 높으면) → anti-ai(제네릭하면) → juhyeong-voice/portfolio-refiner → fidelity recheck
```

- `/dumbify` = 인지부하 단순화 · `/storytelling` = 서사 구조 · `/viral-hooks` = 오프너/제목 audit(클릭베이트 생성기 X) · `/anti-ai` = specificity/hollow-contrast/hype 필터([Humanize KR (im-not-ai) — 한글 AI 티 제거기 = juhyeong 전 1차 윤문](humanize-korean.md) 중첩) · `/voice-dna` = 프로파일 구축법(깨끗한 작가 corpus 한정, juhyeong-voice §7 중첩).
- **STOP 경계**: Claude 앱 skill 업로드·`~/.claude/skills/` 설치·리터럴 슬래시 동작·vault skill 승격은 라우터가 안 함.

## 2. 부서형 기술 피치 템플릿 (ClaudeKit 기사)

packaging 델타(신규 method core 아님). 재사용 공개언어 = **6-field block**:

```
[Department name] [Who it is for] [Current bad loop it replaces]
[Flagship action] [Proof/done gate] [Boundary: what it will not claim/do]
```

세일즈 구조: `raw capability → repeated pain → new operating metaphor → packaged specialist → flagship workflow → proof gate → audience fit → tiny action`. → 원고 템플릿 옵션(voice profile 아님). ⚠ ClaudeKit 구현 품질·명령 강제력은 실파일 미검증 — 주장 금지.

## 3. Apply-or-Park

- **① Applied**: 본 노드 신설. 라우터 룰 = juhyeong-voice/humanize-korean 파이프라인 앞단 참조. `public-writing-layer-router` skill 후보(park — 실사용 1회 후 승격).
- **② Parked**: skill 화 트리거 = 다음 공개 글쓰기(블로그/회고/지원서) 작업.
- **▸창작** 문체·공개 글. **▸NPC/게임** 무관.
