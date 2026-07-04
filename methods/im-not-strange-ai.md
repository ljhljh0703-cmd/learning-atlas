---
created: 2026-06-20
updated: 2026-06-20
type: learning
tags: [tool, korean, humanize, de-ai, copyediting, sunny-rules, writing-pipeline, mit]
source: https://github.com/itssosunny/im-not-strange-ai
authors: [itssosunny]
year: 2026
category: method
---

<!-- im-not-strange-ai(itssosunny) — im-not-ai 포크. 추가분 핵심 = Sunny 7 규칙(문장 단위 역할 점검). humanize-korean 스킬 보조 패스로 흡수(2026-06-20). -->

# im-not-strange-ai — Sunny 7 보조 패스 (humanize-korean 확장)

*itssosunny, MIT, 2026-06-20 clone 통독·해체 흡수. 설치 X.*

> **흡수 방침**: im-not-ai(epoko77-ai)의 포크. 분류 체계(A~J·v2.0)는 [Humanize KR (im-not-ai) — 한글 AI 티 제거기 = juhyeong 전 1차 윤문](humanize-korean.md)이 이미 커버. 이 페이지는 **추가분만** — Sunny 7 규칙 + 포크 맥락.

---

## 포크 관계

| | im-not-ai (원본) | im-not-strange-ai (포크) |
|---|---|---|
| 분류 체계 | A~J v1.x | A~J **v2.0** (A-16·18·19·E-7 신규) |
| 문장 단위 보조 | 없음 | **Sunny 7 규칙** 추가 |
| 파이프라인 | 5인 Strict | 동일 + monolith Fast |
| 설치 | plugin/clone | plugin/clone |

→ vault `skills/humanize-korean`은 이미 v2.0 taxonomy 반영. **Sunny 7만 미반영 → 본 흡수로 추가.**

---

## Sunny 7 규칙 — 역할 점검 보조 레이어

> AI 티(A~J) 제거 *후에도* 문장이 뻣뻣하면 적용. 삭제 규칙 아님 — **의미·리듬·강조·장르에 역할 있으면 유지, 없으면 다듬기.**

| # | 의심 표현 | 유지 조건 | 다듬기 조건 | 예시 |
|---|---|---|---|---|
| S1 | `-적`이 붙은 말 | 개념어·전문어·대조 필요 | 추상성만 더할 때 | `효율적인 방식으로` → `효율적으로` |
| S2 | 조사 `의` | 소유·출처·고정용어·중의어 방지 | `의` 중첩·번역투 | `서비스의 개선의 방향` → `서비스 개선 방향` |
| S3 | 접미사 `들` | 실제 복수·분포·대조·강조 | 일반명사에 뜻 안 더할 때 | `사용자들의 반응` → `사용자 반응` |
| S4 | 의존명사 `것` | 실제 대상·인용·필요한 추상화 | 술어만 미룰 때 | `문제라는 것이다` → `문제다` |
| S5 | `있는/있다는` | 존재·소유·진행·대조 | 명사 앞 완충재 | `가능성이 있다는 점` → `가능성` |
| S6 | 사족 `있었다` | 과거 존재·위치·소유·상태 | 사건명사가 뜻 담을 때 | `변화가 있었다` → `변했다` |
| S7 | 어색한 `있다` 패턴 | 고정·기술 표현 | 단순 관계를 흐릴 때 | `성공에 있어 중요한 요소` → `성공에 중요한 요소` |

**적용 순서**: A~J 탐지·윤문 완료 → Sunny 7 후속 점검 → 소리 내 읽기.

---

## 흡수 결과

- ✅ `skills/humanize-korean/SKILL.md` — Sunny 7 보조 패스 섹션 추가(2026-06-20)
- ✅ 본 learnings 페이지 신설
- ✅ 설치/플러그인 X — [외부 도구는 설치 말고 해체해 흡수 (Dissect, Don't Install)](dissect-not-install-external-tools.md) 규율 동일 적용

## 연결된 페이지

[Humanize KR (im-not-ai) — 한글 AI 티 제거기 = juhyeong 전 1차 윤문](humanize-korean.md)(A~J 분류 체계 본진·파이프라인 1차) · juhyeong-voice(2차 개성화)
