---
created: 2026-06-18
updated: 2026-06-18
type: learning
tags: [tool, claude-code-skills, korean, humanize, de-ai, copyediting, translationese, juhyeong-voice, writing-pipeline, mit]
source: https://github.com/epoko77-ai/im-not-ai
authors: [epoko77-ai]
year: 2026
category: method
---

# Humanize KR (im-not-ai) — 한글 AI 티 제거기 = juhyeong 전 1차 윤문

*epoko77-ai, MIT, Claude Code/Codex 스킬 · GitHub clone 전문통독(clean-room) · 작가 윤문 파이프라인 1차 단계로 채택*

> ✅ **confirmed** (2026-06-18, 작가). **플러그인 설치 X → 룰셋 해체 vault 네이티브 흡수**(작가 교정: "플러그인 안 쓰고 해체분석해서 사용" → dissect-not-install-external-tools 규율화). 실행 스킬 = `skills/humanize-korean/SKILL.md`(Claude가 Fast 모드 직접 적용, 에이전트 오케스트레이션 인프라 불요). 용도 못박음: **품질 윤문(번역투 제거)**이지 AI 탐지 회피(cheating) 아님 — [Academic Research Skills (ARS) — 작가 거버넌스·검증 철학의 학술논문 도메인 쌍둥이](academic-research-skills.md)가 경계한 "humanizer=AI 숨기기"와 선 긋는다.

---

## 한 줄 요약

> AI가 쓴 한글 글의 "티"(번역투·AI 관용구·기계적 구조·이모지 남용)를 **10대 카테고리 60+ 패턴**으로 심각도(S1/S2/S3) 탐지 → 내용 불변·수술적 윤문해 중립적 자연 한국어로. 작가 파이프라인의 **1차(de-AI 중립화)** → juhyeong-voice **2차(개성화)** 전 단계.

---

## 핵심 개념

### 1. ★ 작가 윤문 파이프라인에서의 위치 — 1차 de-AI (최대 가치)
```
AI 초안 → [1차] humanize-korean (AI티·번역투 제거 = 중립 자연 한국어)
        → [2차] juhyeong-voice  (작가 개성: 구어체·유머·짧은 문장·결론먼저)
```
- **1차 = 감점 요소 제거**(중립화), **2차 = 작가 색 입히기**(개성화). 역할 분리.
- juhyeong §1.4도 "번역투 박멸"을 하지만 *수동·간단*. humanize는 *60+ 패턴 전수·정밀*(번역학계 계보 반영) → 1차로 정밀 청소하면 juhyeong은 개성에만 집중(분업 효율↑).

### 2. ★★ 순서 절대 규칙 — humanize 먼저, 역순 금지 (운영 핵심)
humanize 탐지 카테고리 중 **juhyeong 개성과 정면 충돌**하는 것:
- **E-4 단문 일변도** [S2] — 짧은 문장만 늘어놓으면 AI 티로 봄 ↔ **juhyeong §1.2 "짧게 끊어라"**.
- **C-5 이모지·J 시각장식(대시·괄호)** — juhyeong "괄호 딴지 유머"를 깎을 수 있음.

→ **반드시 humanize(1차) → juhyeong(2차).** 역순이면 humanize가 작가 개성(짧은 문장·유머)을 "AI 티"로 오인해 **깎아버림**. 작가 직감("입히기 *전* 1차")이 정확히 옳음. ⚠ **역순 금지 = 비협상.**

### 3. 10대 카테고리 × 60+ 패턴 (S1/S2/S3)
| | 대분류 | 대표 (심각도) |
|---|---|---|
| A | 번역투 | ~에 대해/통해/있어서(S1)·이중피동 되어진다(S1)·가지고 있다(S1)·그/그녀 직역(S1)·~할 수 있다 남발(S2) |
| B | 영어 과다 | 괄호 병기 반복·직역가능 영어(S2) |
| C | 구조 AI | 기계적 첫째/둘째(S1)·이모지(S1)·연결어미 뒤 쉼표 C-11(S1, KatFish 4.84배)·콜론부제 헤딩(S1) |
| D | AI 관용구 | 결론적으로/따라서(S1)·시사하는 바가 크다(S1)·본질적으로(S1)·hype어휘(S1)·의인화 주어(S1) |
| E | 리듬 균일 | 문장길이 표준편차 낮음·동일 종결어미 반복·단문 일변도 E-4(S2)·청자경어 손실 E-7 |
| F | 수식 중복 | 매우/정말·~적/~성/~화 남발 |
| G | Hedging | ~할 수 있을 것으로 보인다 다중완곡 |
| H | 접속사 남발 | 문두 또한/따라서/즉 연속 |
| I | 형식명사 | 것이다·점·수·바·~할 필요가 있다 |
| J | 시각장식 | 볼드·따옴표·대시 남발 |
- **심각도**: S1 결정적(1회로 AI 확신·무조건 제거) / S2 강함(3회+ 밀도 제거) / S3 약함(중첩 시).

### 4. 6대 대원칙 + 과윤문 가드 (작가 ③Gate·Karpathy #3 정합)
의미 불변(사실·수치·고유명사·인용 글자단위 보존) · 톤 유지(장르 안 바꿈) · **국소성**(탐지 span만 수술) · 자연성 우선(과 문학화 금지) · **근거 기반**(탐지 없는 구간 손 안 댐) · 과윤문 경고(**변경률 30%↑ 경고·50%↑ 강제중단·롤백**). **Do-NOT**: 고유명사·수치·날짜·직접인용·법조문·수식기호·업계약어(LLM·API 등) 탐지 제외.
→ = [Academic Research Skills (ARS) — 작가 거버넌스·검증 철학의 학술논문 도메인 쌍둥이](academic-research-skills.md) 의미불변·근거기반 + 작가 #3 Surgical(인접 손 안 댐)의 한글 윤문 구현.

### 5. 모드·에이전트
- **Fast**(≤5,000자, 디폴트): `humanize-monolith` 단일호출(탐지→윤문→자체검증, 도구 4~5회 캡, opus ~3분).
- **Strict**(`--strict`/8,000자+ 자동승급): 탐지(`ai-tell-detector`)→윤문(`korean-style-rewriter`)→**병렬검증**(content-fidelity-auditor 13항 의미감사 + naturalness-reviewer 잔존·과윤문 재탐지)→오케스트레이터(accept/2차윤문 최대3회/롤백/사람검토). **품질등급 A~D**(A=S1 0·S2≤2·개선70%+).
- 한국 번역학계 8대 번역투 계보 출처(이영옥 2001·김도훈 2009·김정우 2007·김혜영 2019) — 출처 충실(작가 research-thoroughly 정합).

---

## 기술 스택 / 사용

```
설치(택1): /plugin marketplace add epoko77-ai/im-not-ai → /plugin install humanize-korean@im-not-ai  (권장)
          또는 git clone + ./install.sh (전역 심링크, Claude/Codex 자동감지)
사용: /humanize-korean  또는 "이 글 AI 티 없애줘"  (Codex: $humanize-korean, Fast만)
구조: .claude/skills/humanize-korean/(SKILL+references) · agents/(11종) · commands/(toml)
references: ai-tell-taxonomy(SSOT 60+패턴) · rewriting-playbook(치환 레시피) · quick-rules(Fast용 슬림) · metrics.py(post-editese 정량) · scholarship(번역학계 외부 SSOT)
```
- **영어 번역표**(playbook): framework→체계/틀, leverage→활용/기대다, seamless→매끄러운, robust→튼튼한, holistic→총체적 등. (업계표준 pipeline·API는 유지.)

---

## 내 생각 — 작가 윤문 워크플로우 관점

### 직접 적용성: **높음** (vault 스킬 해체 흡수 — 설치 X)
작가 felt-need 명확 = **외부 공개 글**(블로그·회고·지원서·소개글, juhyeong-voice 적용 대상과 동일). 1차 humanize로 AI 티 정밀 제거 → 2차 juhyeong 개성. 파이프라인 완성. **플러그인 설치 대신 룰셋 해체 → `skills/humanize-korean/` vault 스킬**(infra-0·dissect-not-install-external-tools). 플러그인의 실체 = 에이전트 오케스트레이션(인프라, 불요) + 룰셋(알맹이, 흡수). Claude가 Fast 모드로 직접 적용.

### 개념 수확
1. **순서 규칙(humanize→juhyeong)** = 운영 핵심. 역순이 작가 개성 깎는 함정 = 박제 가치 최대.
2. **번역투 60+ 패턴 SSOT** = juhyeong §1.4 "번역투 박멸"의 *백과사전*. juhyeong이 참조 가능(개성 입힐 때 무엇이 번역투인지 정밀 기준).
3. **과윤문 30/50% 가드** = 작가 #3 Surgical의 정량판. 윤문이 내용 훼손 안 하게.

### 반영처 (학습→반영 루프)
- ✅ **vault 스킬 신설** (2026-06-18) — `skills/humanize-korean/SKILL.md`(origin: agent_generated·MIT 출처). quick-rules v2.0 해체 → Fast 룰셋 재구성(10카테고리 패턴표·6원칙·자체검증·순서규칙). Claude 직접 적용.
- ✅ **juhyeong-voice SKILL 연결** — §3 절차 앞 "0차: humanize-korean 1차 먼저(역순 금지)" 추가.
- ✅ **규율 박제** — dissect-not-install-external-tools(앞으로 플러그인 설치 X·해체 흡수 기본).
- 🟡 backlog: humanize 패턴 중 juhyeong Before→After에 없는 것(C-11 연결어미 뒤 쉼표·E-1 단문·D 결산피벗) = juhyeong 보강 후보(작가 다음 글쓰기 시).

---

## 열린 질문
- humanize Strict 5인 파이프라인 vs 작가 직접 윤문(Claude) — 토큰 대비 품질? (외부 공개 글 빈도 낮으면 Fast로 충분.)
- juhyeong 2차 후 humanize *재탐지*만 advisory로 1회? (개성 안 깎게 탐지만, 윤문 X — 잔존 명백 AI티 점검용. 실험 후보.)

---

## 다음 학습 후보
- **juhyeong-voice 정량화** — humanize metrics.py(post-editese 14함수) 발상을 작가 문체 일치도 측정에 차용 검토.
- **ARS Writing Quality Check** ([Academic Research Skills (ARS) — 작가 거버넌스·검증 철학의 학술논문 도메인 쌍둥이](academic-research-skills.md)) — 영어권 machine-generated 탐지. humanize 한글판과 대조.

---

## 연결된 페이지
- juhyeong-voice(2차 개성화 — humanize 1차 뒤 / 역순 금지) · [Academic Research Skills (ARS) — 작가 거버넌스·검증 철학의 학술논문 도메인 쌍둥이](academic-research-skills.md)(영어권 Writing Quality Check 한글 대응) · cold-verify-before-adopt(humanizer=품질 도구로 검증)
- *(research-thoroughly·#3 Surgical = 작가 운영 메모리, 본 도구가 정합)*
