---
created: 2026-06-17
updated: 2026-06-17
type: learning
tags: [AI, agent-harness, behavior-injection, simplicity, benchmark, model-independent]
source: https://github.com/DietrichGebert/ponytail
authors: [DietrichGebert]
year: 2026
category: method
---

# Ponytail — "게으른 시니어 개발자"를 13개 코딩 에이전트에 이식하는 portable behavioral skill

*DietrichGebert · MIT · "He says nothing. He writes one line. It works."*

코딩 에이전트가 요청도 안 한 추상화·의존성·보일러플레이트로 코드를 부풀리는 경향을, **"가장 좋은 코드는 안 쓴 코드"** 라는 단일 행동 규율로 눌러버리는 스킬. 핵심 룰셋(skill) 하나를 13개 에이전트(Claude Code·Codex·Gemini/Antigravity·opencode·pi·Cursor·Windsurf·Cline·Copilot·Kiro·OpenClaw·VS Code+Codex)에 **얇은 어댑터**로 동일하게 주입하고, promptfoo 벤치로 그 효과(코드량 80-94%↓)를 모델별로 실측한다.

---

## 한 줄 요약

> Karpathy "Simplicity First"를 *매 턴 재주입되는 결정 사다리*로 형식화하고, 모델·에이전트 무관하게 이식한 뒤 벤치로 증명한 행동주입 하네스.

---

## 핵심 개념

### 1. 게으름의 사다리 (the ladder) — 코드 쓰기 전 멈춤 게이트
코드를 쓰기 *전에* 먼저 걸리는 첫 번째 단에서 멈춘다:
1. 애초에 만들 필요가 있나? (YAGNI) → 없으면 skip
2. 표준 라이브러리가 하나? → 쓴다
3. 네이티브 플랫폼 기능이 있나? → 쓴다 (예: `<input type="date">`)
4. 이미 설치된 의존성이 푸나? → 쓴다
5. 한 줄로 되나? → 한 줄
6. 그제서야: 동작하는 최소 코드

### 2. "게으름 ≠ 부주의" — 절대 안 줄이는 축 (실명)
다음은 사다리에서 제외 = **never on the chopping block**: 신뢰경계 입력검증 · 데이터 손실 방지 에러처리 · 보안 · 접근성 · *실하드웨어 보정*("플랫폼은 결코 스펙 이상이 아니다 — 시계는 드리프트하고 센서는 어긋나게 읽는다") · 사용자가 명시 요청한 것. → 단순화의 *예외축을 추상어가 아니라 실명*으로 박는다.

### 3. done-gate 최소형 — "ONE runnable check behind"
> Lazy code without its check is unfinished. 비자명 로직은 *깨지면 실패하는 가장 작은 것 하나*(assert 기반 self-check 또는 작은 테스트 파일 1개, 프레임워크·픽스처 X)를 남긴다. 사소한 one-liner는 테스트 불요.

### 4. `ponytail:` 주석 컨벤션 — ceiling + upgrade path 인라인
의도적 단순화는 `// ponytail: <한계>, <업그레이드 트리거>` 주석으로 표시. 알려진 천장(글로벌 락·O(n²) 스캔·naive 휴리스틱)이 있으면 *천장과 인상 경로를 주석이 명명*. → `/ponytail-debt`가 이 주석들을 grep해 **부채 원장(ledger)**으로 수확("나중"이 "영영"이 되는 것 차단). upgrade path 없는 주석은 `no-trigger` 태그로 rot 위험 플래그.

### 5. Agent-portability = 얇은 어댑터 (model/host 독립)
core 행동은 `skills/*/SKILL.md` + `AGENTS.md`(컴팩트 룰셋)에만 있고, host별 파일은 *그 행동을 로드하기 쉽게 하는 어댑터*일 뿐. **Adapter Rule**: 어댑터는 얇게 — skill/hook 지원 host는 기존 `skills/`·`hooks/`를 가리키고, instruction만 지원하는 host는 룰 텍스트를 `AGENTS.md`와 *정렬 유지*(`scripts/check-rule-copies.js`가 동기 검사, drift 시 테스트 실패).

### 6. 매 턴 재주입 (per-turn injection) + 모드 (lite/full/ultra/off)
opencode 플러그인은 `experimental.chat.system.transform` 훅에서 **매 턴** 룰셋을 system 프롬프트에 push (`output.system.push(getPonytailInstructions(mode))`). 단일 instruction builder(`hooks/ponytail-instructions.js`)를 Claude/Codex/pi/opencode가 공유 = one source of truth. fallback 텍스트엔 `## Persistence — ACTIVE EVERY RESPONSE. No drift back to over-building. Still active if unsure.` 가 박혀 있다.

---

## 수치적 결과 (벤치마크)

3 arm(no-skill / [caveman](https://github.com/JuliusBrussee/caveman) prose-압축 / ponytail) × 3 모델(Haiku/Sonnet/Opus) × 5 일상 과제(email validator·debounce·CSV sum·countdown·rate-limit) × **10회 median**, promptfoo.

| 지표 (vs no-skill) | 결과 |
|---|---|
| 코드량 | **80-94% 감소** (Sonnet 693→44줄) |
| 비용 | 47-77% 감소 |
| 지연 | 3-6× 빠름 |

- **측정 vs 게이트 분리**: `loc.js`=항상 통과(LOC 기록만) / `correctness.js`=**게이트**(생성 코드 안 돌면 fail). "깨진 one-liner가 LOC는 좋아도 correctness에서 탈락" → 미니멀리즘이 *동작성을 인질로 잡지 못하게* 함.
- **🌟 전이 한계 (Layer A 확증)**: instruction-following 모델(Claude급)엔 잘 전이되나, *작은 로컬 모델(llama3.2)엔 multi-step 결정 사다리가 안정적으로 안 따라져 전이 실패*. → 행동주입은 강한 모델엔 작동, 약한 모델엔 천장.
- 정직한 caveat: "ruleset이 매 턴 재주입돼 *짧은 단발 프롬프트*에선 그 오버헤드가 절감을 상쇄할 수 있다"를 README 첫머리에 명시(과대광고 회피).

---

## 내 생각 — Sub-brain 관점

### 직접적 연결: **높음** (북극성 직결)
ponytail은 우리 agent-harness 계열(=Agent=Model+Harness)의 *소형·단일목적 production 사례*다. [goose — 모델독립 에이전트 하네스 (production 오픈소스 정본)](../techniques/goose-agent-harness.md)(breadth)·[opencode — 모델독립 에이전트 하네스 #2 (컨텍스트 조립 *엄밀성* 정본)](../techniques/opencode-agent-harness.md)(depth)에 이은 외부 ground-truth #3 성격이되, 범위가 "하나의 행동 규율 이식"으로 좁아 vault 원칙 여러 개를 *정확히 한 점씩* 확증한다.

### 개념적 수확 (vault 원칙별 ground-truth 매핑)
1. **[Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](karpathy-guidelines.md) #2 (Simplicity First)의 운영화** — vault는 원칙 4줄, ponytail은 *결정 사다리 6단 + 예외축 실명 + done-gate*. 우리 #2가 "추상화 0"만 말한다면 ponytail은 *언제 멈출지의 순서*를 준다.
2. **"주입 표면" 원칙(헌법 §대화 시작 시, 06-17 신설)의 production ground-truth** — vault는 infra가 없어 *세션시작 재독*으로 근사하지만, ponytail은 진짜 *per-turn system 주입* + "ACTIVE EVERY RESPONSE. No drift. Still active if unsure." = 규율 강도 ∝ 재노출 빈도의 실증. [goose — 모델독립 에이전트 하네스 (production 오픈소스 정본)](../techniques/goose-agent-harness.md) MOIM과 동일 계열.
3. **②Apply 측정 매트릭스(agent-harness-rsi-brief §6)의 외부 인스턴스** — arms×models×tasks×N-median + correctness GATE + 로컬모델 전이실패 발견. [Fable 5 프롬프팅 (공식 가이드)](fable-5-prompting.md) VFF baseline과 같은 줄에 둘 외부 측정 사례.
4. **done-gate(dispatch-builder 슬롯3, 06-17 형식화) 확증** — "ONE runnable check behind, no frameworks/fixtures" = 우리 머신체크 게이트의 코드판.
5. **`ponytail:` ceiling+upgrade 주석 = 우리 `review_trigger`/design-journal "기각된 매력+재검토 조건"의 코드 인라인판** + `/ponytail-debt` ledger = backlog/promote-candidate 규율의 코드판. (vault는 등가 이미 보유 → 확증재.)
6. **강제 규율 4부 골격([Superpowers 해체분석 (obra/superpowers)](superpowers-teardown.md) 차용)과 동형** — ponytail의 "ladder(단계) + 안 줄이는 축 실명(금지 봉쇄) + Persistence(letter=spirit)"가 우리 4부 골격 패턴과 겹친다.

### 한계·분기
- caveman 대비 우위는 "prose 압축 vs 코드 자체 축소"의 차이 — ponytail은 *무엇을 짓는지*를 줄이고 caveman은 *말투*만 줄인다. 우리 dispatch-builder는 둘 다 필요(스코프 축소 + 토큰 절감).
- 로컬 모델 전이실패 = 우리 ②Apply가 "약한 모델로 하네스 따라 강한 모델급 나오나"를 측정할 때 *행동주입만으론 천장이 있다*는 사전 경고.

---

## 운영 정책 (외부 도구 도입 — SSOT) 🔒 LOCKED 2026-06-17

> 작가 확정("#2 ㄱㄱ", 2026-06-17). CLAUDE.md "외부 도구 사용 정책" 컨벤션 — *운영 정책 = 본 페이지 SSOT, 헌법은 진입점 표만*.

**도입 결정**: Codex 코드 디스패치에 ponytail 룰셋을 **정적 주입**(static ruleset)으로 채택. **per-turn hook 인프라는 미도입**(= 본 페이지  #2 / 반영 backlog #4 그대로 보류). 근거: ① vault infra-0 원칙 ② README 명시 "짧은 단발 프롬프트엔 매턴 재주입 오버헤드가 절감 상쇄" ③ 06-17 거버넌스 교훈(갓 merge한 주입표면 원칙 위 인프라 적층 신중).

**적용 경계 (3-조건 — 셋 다 충족 시만)**:
1. **Codex 코드 디스패치 한정** — Gemini(No-Coding) 무관 · Claude 직접 소량작업 무관(claude-max-cost-shift).
2. **큰·반복 코드 작업만** — 짧은 단발 코드 디스패치엔 미적용(재주입 오버헤드 > 절감).
3. **강한 instruction-following 모델 타깃** — 로컬 SLM(llama3.2급) 타깃 작업엔 미적용(Layer A 전이실패, 결정 사다리 불안정).

**주입 방법**: dispatch-builder로 Codex 코드 디스패치 조립 시 아래 블록을 슬롯에 포함(또는 Codex repo `AGENTS.md`에 정적 삽입). 실제 ponytail repo clone + 어댑터 설치는 *선택* — 정적 룰셋만으로 효과 대부분 확보, repo 설치 시 provenance 복원은 graphify 사례 준용.

**Codex 주입 블록 (compact ruleset)**:
```
[ponytail — 게으른 시니어 규율]
- 가장 좋은 코드는 안 쓴 코드. 코드 쓰기 전 사다리에서 멈춰라:
  ① 만들 필요 있나(YAGNI)→없으면 skip ② 표준 라이브러리 하나면 그것 ③ 네이티브 플랫폼 기능 있으면 그것 ④ 이미 설치된 의존성이면 그것 ⑤ 한 줄로 되면 한 줄 ⑥ 그제서야 동작하는 최소 코드.
- 단, 절대 안 줄이는 축(실명): 신뢰경계 입력검증·데이터손실 방지 에러처리·보안·접근성·실하드웨어 보정·작가가 명시 요청한 것. (게으름 ≠ 부주의)
- 비자명 로직엔 ONE runnable check(깨지면 실패하는 가장 작은 것 하나, 프레임워크/픽스처 X). 사소한 one-liner는 불요.
- 의도적 단순화는 `// ponytail: <한계>, <업그레이드 트리거>` 주석으로 천장+인상경로 명명.
```

review_trigger: "Codex 디스패치 3회 적용 후 코드량/품질 효과 검토 / 또는 2026-09-17"

---

## 반영 backlog (학습→반영 루프 — 즉시 vs 보류)

> 학습→반영 루프 1단위 = 반영처까지. 아래는 *반영 후보*이며, 헌법·brief 터치분은 HITL 스테이징(R-01) 대상이라 직접 수정 X — 작가 확정 후 패치.

- ✅ **agent-harness-rsi-brief §6 ②Apply 측정 방법론 레퍼런스 기록 완료** (2026-06-17, 작가 확정 "2만 반영") — arm 비교·측정/게이트 분리·전이곡선 3축을 §6에 추가(VFF baseline 옆). 우리 ②Apply가 "PASS/FAIL → baseline 대비 정량 + 게이밍 방지 게이트"로 격상.
- 🟡 **(backlog) 헌법 §"주입 표면"에 ponytail ground-truth 각주** (per-turn injection production 사례) — 보류, 패치 스테이징 후보(06-17 갓 merge한 원칙 위 적층 신중 — 어제 거버넌스 교훈). *나중에 재검토.*
- ✅ **Codex 디스패치 정적 룰셋 채택** (2026-06-17, 작가 "#2 ㄱㄱ") — §운영 정책 신설(3-조건·주입 블록) + dispatch-builder 코드 디스패치 라인 + 헌법 외부도구 표 row 패치 스테이징. per-turn hook은 미도입.
- 🟡 **(backlog) dispatch-builder 슬롯3 done-gate "ONE runnable check, no frameworks" 표현 보강** — 위 채택으로 사실상 흡수(주입 블록에 포함). 슬롯3 본문 명시 표현은 선택. *나중에 재검토.*
- ✅ **순수 지식 확증 (반영처 無 항목)**: Karpathy #2 사다리·4부 골격 동형·debt ledger ↔ review_trigger 등가 = 이미 vault 보유 → 흡수만, 억지 반영 X (Karpathy #3).

---

## 열린 질문

- ponytail의 "안 줄이는 축 실명" 방식을 우리 dispatch-builder/4부 골격의 *금지 봉쇄표*에 그대로 차용하면 외부 AI의 over-simplification(보안·검증 날리기)을 더 잘 막을까?
- per-turn injection을 vault에서 *진짜로* 구현할 인프라(hook)가 생긴다면(예: Claude Code SessionStart/UserPromptSubmit hook), "주입 표면" 근사를 실주입으로 승격할 가치가 있나? (현재는 infra 0 원칙)
- 로컬 SLM 전이실패 → 한국어 SLM NPC(agent-harness-rsi-brief)에 행동주입을 얹을 때 같은 천장이 나올까?

---

## 다음 학습 후보

- **[caveman](https://github.com/JuliusBrussee/caveman)** — ponytail의 비교 arm(prose 압축 스킬). "코드 축소 vs 말투 압축"의 경계를 직접 대조하면 dispatch-builder 토큰 절감축 분리에 직접 쓸모.
- **promptfoo** — ponytail이 ②Apply 측정에 쓴 벤치 엔진. 우리 Open Model Gym(models×runners×scenarios·worst-of-N) 구현 도구 후보.
- **pi (agent harness)** — goose-harness-groundtruth에서 3종으로 지목한 모델독립 하네스. ponytail이 어댑터로 지원 = 진입점 확보됨.

---

## 연결된 페이지

- agent-harness · [goose — 모델독립 에이전트 하네스 (production 오픈소스 정본)](../techniques/goose-agent-harness.md) · [opencode — 모델독립 에이전트 하네스 #2 (컨텍스트 조립 *엄밀성* 정본)](../techniques/opencode-agent-harness.md) · [The New SDLC With Vibe Coding (Google / Addy Osmani)](google-new-sdlc-vibe-coding.md) (하네스 정본·ground-truth)
- [Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](karpathy-guidelines.md) (#2 Simplicity First 운영화) · [Superpowers 해체분석 (obra/superpowers)](superpowers-teardown.md) (4부 골격 동형)
- dispatch-builder (done-gate 슬롯3) · agent-harness-rsi-brief (②Apply 매트릭스) · [Fable 5 프롬프팅 (공식 가이드)](fable-5-prompting.md) (VFF baseline 동렬)
- goose-harness-groundtruth (pi·모델독립 하네스 3종)
