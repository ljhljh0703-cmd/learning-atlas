---
created: 2026-08-25
updated: 2026-08-25
type: learning
category: method
tags: [fde, problem-discovery, public-sector, korea, case-corpus]
source: "AI정부 공개 GitLab (public API HTTP 200 · X-Total 340 실측 2026-08-21)"
---
<!-- 한국 공공부문 실무 문제가 어떤 입력·규정·승인 구조를 갖는지 반복해 읽을 수 있는 살아 있는 사례 원장. -->

# 한국 공공부문 문제 원장 — AI정부 공개 GitLab

## 한 줄

**도구를 베끼는 자료가 아니라, 현장 문제의 *구조*를 반복해서 읽는 사례 원장이다.**

## 왜 값어치가 있는가

FDE 에게 필요한 건 코드가 아니라 이 사슬을 여러 번 읽는 경험이다.

`실무자 → 반복 업무 → 원본 아티팩트 → 규정/권한 → 자동화 단위 → 사람이 유지할 결정 → 배포 증거`

공개 목록에서 확인된 문제 유형 — 계약서류 작성 · NEIS 초과근무 검토 · 공문 순번 정리 · 법률 보조 · 폐쇄망 문서 지식화 · 로컬 LLM 한글 보고서 · PDF/Excel/DOCX 변환.

HWP·Excel·폐쇄망·규정 기반 업무가 실제로 어떻게 생겼는지 보여준다. 국내 공공 도메인은 이 제약들이 문제 정의를 지배하는데, 그걸 밖에서 상상하지 않고 읽을 수 있는 자리다.

## 과장 가드 (중요)

- 「현직자들이 실무에서 쓰는 것을 전부 오픈소스로 올렸다」는 **소개 문구는 과장 가능성이 있다.** 공개 저장소와 소속·설명은 확인했지만 **운영 배포와 실사용은 검증하지 않았다.**
- 목록에는 **실패한 파이프라인도 섞여 있다.**
- 따라서 **기관명·public repo 존재는 production 배포 증거가 아니다.** 사례로 인용할 때 이 등급을 함께 적는다.

## 적용 (Absorb-to-Apply)

**순수 참조로 흡수** — 지금 당장 바꿀 산출물이 없다. 반영처는 `applications/fde-craft/` 의 discovery·scoping 브리프(`BRIEF-B2-problem-framing.md` · `BRIEF-B2a-inquiry-method.md`)이며, 다음 FDE 문제 발굴 작업에서 사례 입력으로 쓴다.

⛔ Myth Forge·게임 코드로 연결하지 않는다(도메인 월경 금지).

## 출처 무결성

패킷 `2026-08-21/eight-source-independent-teardown` · SHA256SUMS 10/10 대조 통과.
