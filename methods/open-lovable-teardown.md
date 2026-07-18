---
created: 2026-07-18
updated: 2026-07-18
type: learning
tags: [agent-harness, prompt-engineering, code-generation, surgical-edit, self-healing, teardown, firecrawl, reference-first, clone-to-develop]
source:
  - https://github.com/firecrawl/open-lovable
  - https://github.com/firecrawl/open-lovable/blob/main/app/api/generate-ai-code-stream/route.ts
  - https://github.com/firecrawl/open-lovable/blob/main/app/api/analyze-edit-intent/route.ts
authors: [Firecrawl]
year: 2025
category: method
---

<!-- open-lovable(웹→앱 재생성 엔진) 해체 — 표면 복제는 버리고 기능(레퍼런스 흡수→디벨롭)+3대 프롬프트 패턴만 추출 -->

# open-lovable teardown — 레퍼런스 흡수→디벨롭 엔진 + 3대 프롬프트 패턴

> **왜 이 노트**: firecrawl/open-lovable(⭐27.8k, Lovable.dev 오픈 참조구현)에서 **표면(남의 사이트를 그대로 베끼는 "복제기" 성격)은 버리고 기능만 가져온다** — 스크랩→구조·브랜드 추출→재생성→자가치유라는 파이프라인은 그대로 살리되, **종점을 clone(복제)이 아니라 develop(디벨롭)으로** 재정향한다. 즉 레퍼런스는 *복사 output*이 아니라 *흡수 input*이고, 산출은 그 위에서 발전시킨 자기 것.
> 이 재정향은 vault의 [레퍼런스 우선 디자인 Prepass (bespoke HTML)](reference-first-design-prepass.md) "전부 참조 input, 복사 output 아님" 원칙의 코드-에이전트판이다. [외부 도구는 설치 말고 해체해 흡수 (Dissect, Don't Install)](dissect-not-install-external-tools.md)대로 **도구(Firecrawl 키 의존)는 안 깔고 기능·패턴만 추출**.

> ⛔ **안티패턴 (쓰지 않는 것)**: 대상 사이트를 픽셀·카피·구조까지 1:1로 재현해 그대로 내놓는 "복제 산출". 표절·저작권·정체성 희석 리스크. 레퍼런스 흡수의 목적은 *출발점 확보*이지 결과물 대체가 아니다.

---

## 한 줄 요약

> 레퍼런스를 스크랩→구조·브랜드 추출(input)→LLM 재생성→자가치유하는 루프에서, ①**편집은 파일 추측이 아니라 검색좌표 생성**으로 라우팅하고 ②**스코프 크립을 프롬프트에 하드코딩**하고 ③**빌드 에러를 폐루프로 자가치유**한다. 여기에 **복제→디벨롭** 전환(레퍼런스는 시작점, 산출은 발전형)을 얹으면 신뢰 가능한 *디벨롭 엔진*이 된다.

## 전체 파이프라인 (27 라우트 → 5블록)

```
[스크랩]  scrape-website · scrape-url-enhanced · scrape-screenshot · extract-brand-styles (색·폰트 추출)
   ↓
[편집 라우팅]  analyze-edit-intent   ← 패턴 1
   ↓
[코드 생성]  generate-ai-code-stream (SSE 스트리밍, ~4000토큰 시스템프롬프트)  ← 패턴 2
   ↓
[적용]  apply-ai-code(-stream) · detect-and-install-packages · run-command · create-ai-sandbox-v2 (Vercel/E2B)
   ↓
[자가치유]  check-vite-errors · monitor-vite-logs · report-vite-error · restart-vite   ← 패턴 3
```
(+ conversation-state=대화 메모리, search=웹검색)

---

## 🔄 복제 → 디벨롭 실행 절차 (기능은 살리되 표면 복제는 버림)

open-lovable의 파이프라인을 **"복제 산출기"가 아니라 "디벨롭 출발점 생성기"로** 돌리는 5스텝. 작가가 레퍼런스 사이트/화면을 실제로 흡수해 자기 것으로 발전시킬 때 이대로 수행:

1. **흡수 (Ingest)** — 레퍼런스를 스크랩(구조·레이아웃)·`extract-brand-styles`(색·폰트·간격)·스크린샷으로 *구조와 감각만* 뽑는다. 카피 텍스트·로고·고유 자산은 **가져오지 않는다**(안티패턴 가드).
2. **추상화 (Abstract)** — 뽑은 것을 *디자인 토큰·컴포넌트 골격·레이아웃 문법*으로 일반화. "이 사이트"가 아니라 "이런 패턴"으로 승격 → [레퍼런스 우선 디자인 Prepass (bespoke HTML)](reference-first-design-prepass.md) 트라이어드(매크로·마이크로·국내)와 결합.
3. **재생성 (Regenerate)** — 내 요구·콘텐츠·브랜드로 재작성. 여기서 산출은 이미 레퍼런스 ≠ 내 것. LLM엔 검색좌표 라우팅(패턴 1)·스코프 봉쇄(패턴 2) 적용.
4. **디벨롭 (Develop)** — 재생성물을 *넘어서* 발전: 레퍼런스에 없던 인터랙션·정보구조·접근성·정체성을 얹는다. **이 스텝이 복제와 디벨롭을 가르는 지점** — 여기서 멈추면 복제, 넘어서면 창작.
5. **자가치유·검증 (Verify)** — 빌드/렌더 에러 폐루프(패턴 3) + [Forge Spec-Gate (why-was-fable-banned) — 차용 해체](forge-spec-gate.md) done-gate로 실동작 확인.

> **판정선**: 산출물을 레퍼런스 옆에 놓았을 때 "베꼈네"가 아니라 "여기서 출발해 발전시켰네"로 읽히면 통과. 표면 유사도가 아니라 *델타(추가·개선분)*가 존재 근거.

---

## ⭐ 3대 패턴 (추출 대상)

### 패턴 1 — 검색좌표 편집 라우팅 (analyze-edit-intent)
LLM에게 "어느 파일 고칠지"를 묻지 않는다. **검색 전략**을 뱉게 한다.
> *"DO NOT GUESS which files to edit. Instead, provide specific search terms."*

출력 = 구조화 스키마 `{editType(UPDATE_COMPONENT|FIX_ISSUE…), searchTerms, regexPatterns, fileTypesToSearch, expectedMatches, fallbackSearch}`. 다운스트림이 이 좌표로 grep→정확한 라인 특정→편집. AI 실패 시 키워드 폴백.
- **vault 연결**: [Is Grep All You Need? — 에이전트 검색에서 grep vs 벡터 RAG (arXiv 2605.15184)](../techniques/agentic-search-grep-vs-vector.md)(grep>벡터 실증) + ① Dispatch "추측 말고 조회 먼저"의 **코드 구현판**. LLM을 *파일 선택자*가 아니라 *검색 쿼리 생성기*로 쓰는 게 핵심 전환.

### 패턴 2 — 스코프 크립을 프롬프트에 하드코딩 (generate-ai-code-stream)
> *"DO EXACTLY WHAT IS ASKED — NOTHING MORE, NOTHING LESS"*
> *"COUNT the files … that's EXACTLY how many you must generate"* (스타일 변경=1파일, 새 컴포넌트=최대 2파일)

+ ❌/✅ 위반 사례 실명 나열 + Tailwind 외 스타일 금지 + 스마트쿼트 자동교정.
- **vault 연결**: Karpathy #2(Simplicity)·#3(Surgical Changes)를 자연어 지시가 아니라 **강제 규율로 프롬프트에 박음** = 헌법 §"강제 규율 4부 골격"(금지 합리화 실명 봉쇄)과 동형. "파일 수를 세게 만드는" 트릭이 특히 이식성 높음.

### 패턴 3 — 빌드-에러 자가치유 폐루프
check-vite-errors → monitor-vite-logs → report-vite-error(구조화) → restart-vite → clear-cache. 생성으로 끝나지 않고 **빌드 통과를 성공 기준**으로 되먹임.
- **vault 연결**: Karpathy #4(검증 가능 성공 기준) + [Forge Spec-Gate (why-was-fable-banned) — 차용 해체](forge-spec-gate.md) done-gate/worktree-accept 계열. "생성 후 검증 루프"의 경량 사례.

### 부수 기법
- **Morph fast-apply**: MORPH_API_KEY 있으면 XML `<file>` 전체 대신 `<edit><instructions>+<update>` **최소 diff 블록**으로 전환 → [Pattern: Structured Output Gate (구조화 출력 게이트)](prompt-pattern-structured-output-gate.md) 변형(출력 포맷을 상황별 게이팅).
- **컨텍스트 예산**: 대화 20개·2000자 truncate = RTK 등가.
- **벤더 추상화**: LLM 4종(Gemini/Anthropic/OpenAI/Groq)+샌드박스 2종(Vercel/E2B) 스위칭 참조.

---

## 적용 후보 (파킹 — [학습→반영 루프 (Absorb-to-Apply)](../narrative/학습→반영 루프.md))

> 즉시 SSOT/헌법 수정은 §5.7 L-STAGE(스테이징 필요)이므로 여기선 **후보 파킹**. 착수 시 아래로:

1. **패턴 1·2 → dispatch-builder**: Codex 코드 디스패치의 "편집 대상 지정"을 *파일 경로 지정*에서 *검색좌표 지정*으로 바꾸는 프리셋 후보. 슬롯2(deny-first)에 "파일 수 세기" 강제 추가 후보.
2. **패턴 2 → 게임 코드 위임**(hwiglija-tower-AGENTS Codex 규약): "COUNT the files" 스코프 봉쇄 문구를 done-gate 프롬프트에 이식.
3. **패턴 3 → [Forge Spec-Gate (why-was-fable-banned) — 차용 해체](forge-spec-gate.md)**: 빌드-에러 폐루프를 worktree done-gate의 경량 버전으로 참조.

## 인접 지식
- [레퍼런스 우선 디자인 Prepass (bespoke HTML)](reference-first-design-prepass.md) — "참조 input, 복사 output 아님" 원칙의 디자인판. 복제→디벨롭 재정향의 근거·2·4스텝 결합점.
- [Is Grep All You Need? — 에이전트 검색에서 grep vs 벡터 RAG (arXiv 2605.15184)](../techniques/agentic-search-grep-vs-vector.md) — 패턴 1의 이론적 근거.
- [Pattern: Structured Output Gate (구조화 출력 게이트)](prompt-pattern-structured-output-gate.md) — 패턴 1의 스키마 출력·Morph 블록.
- [Forge Spec-Gate (why-was-fable-banned) — 차용 해체](forge-spec-gate.md) — 패턴 3의 검증 게이트 계보.
- [외부 도구는 설치 말고 해체해 흡수 (Dissect, Don't Install)](dissect-not-install-external-tools.md) — 이 노트의 흡수 원칙(도구 X, 패턴 O).
- [Superpowers 해체분석 (obra/superpowers)](superpowers-teardown.md) — 강제 규율 골격 차용 원류(패턴 2와 동형).
