---
created: 2026-06-16
updated: 2026-06-16
type: learning
tags: [agentic-engineering, vibe-coding, agent-harness, context-engineering, skills, model-routing, sdlc, ground-truth, north-star]
source: https://drive.google.com/file/d/1wNEl8FMpTso8aXlb_joxgzparxi-0ciM/view
authors: [Addy Osmani, Shubham Saboo, Sokratis Kartakis]
year: 2026
category: method
---

# The New SDLC With Vibe Coding (Google / Addy Osmani)

> Google 발행, Addy Osmani 외 2인, 2026-05 (51p, 시리즈물 — Day3=Context Engineering, Day5=Spec-Driven Production). vault Claude 전문 통독(작가 직접 공유).
> **한 줄**: "가장 깊은 전환은 새 언어·프레임워크가 아니라 *코드 작성 → 의도 표현*으로의 이동이다." syntax→intent.
> **우리에게의 의미**: 도구가 아니라 **이 vault의 전체 아키텍처를 Google이 외부에서 권위 있게 확증·확장한 ground-truth.** [Fable 5 프롬프팅 (공식 가이드)](fable-5-prompting.md)과 동급의 외부 기준점.

## 1. 핵심 골격

- **Vibe coding ↔ Agentic engineering 스펙트럼** (Table 1): 차별점은 "AI 쓰냐"가 아니라 **출력 검증 방식**. vibe(캐주얼 프롬프트·"되는 것 같은데?")→structured(상세 프롬프트+수동 테스트)→agentic(formal spec+자동 eval+CI/CD 게이트). 우→좌 = 구조·검증·인간판단이 AI 출력을 얼마나 둘러싸는가.
- **Tests + Evals 둘 다 필수**: Tests = 결정적 부분(입력→출력) / Evals = 비결정적 부분(에이전트가 옳은 trajectory·도구선택·품질바). "둘 다 없으면 프롬프트가 아무리 정교해도 항상 vibe coding."
- **Agent = Model + Harness**: 모델은 엔진(raw). 하네스(prompts·tools·context policies·hooks·sandboxes·sub-agents·observability)가 "모델이 *실제로 뭔가를 끝내게* 하는 스캐폴딩." **모델 ~10% / 하네스 ~90%.**
- **Factory model**: 개발자 산출물 = 코드가 아니라 *코드를 만드는 시스템*(spec+context / agents / tests+gates / feedback loops / guardrails). "공장 관리자는 위젯을 손으로 조립 안 한다 — 조립라인을 설계한다." 성공 = step-by-step 지시가 아니라 *성공 기준*을 주고 반복시키는 것.
- **Conductor vs Orchestrator** (Fig 8): Conductor=실시간·동기·IDE 내·키스트로크 제어(탐색·프로토타입·새 API 학습) / Orchestrator=비동기·고수준·멀티에이전트 위임(기능구현·마이그레이션·테스트생성). 대부분 둘을 유동적으로 오감.
- **80% 문제**: AI가 기능의 ~80% 빠르게 생성, 나머지 20%(엣지케이스·에러핸들링·통합·미묘한 정합성)는 깊은 맥락 필요 → 인간. AI 에러는 syntax 실수에서 *개념적 실패*(잘못된 비즈니스 가정·모호함 미질문·아키텍처 부채)로 진화 — "코드가 맞아 보이고 기본 테스트도 통과해서" 더 위험.

## 2. 우리 시스템 매핑 (외부 ground-truth 확증)

| Google 개념 | 우리 vault |
|---|---|
| Agent = Model + Harness (~10/90) | agent-harness 그 자체. hot.md "1.6% logic/98.4% infra"와 동일 명제 |
| 하네스 구성(Instructions/Rule Files·Tools·Sandboxes·Orchestration·Guardrails/Hooks·Observability) | H-01~17 |
| static context = `AGENTS.md`/`CLAUDE.md`/`GEMINI.md` rule files (*직접 명시*) | 우리 헌법 3종 그 자체 |
| dynamic context = skill(task 매칭 시 로드)·tool results·RAG | RTK·Progressive Disclosure·token-minimal lookup |
| Agent Skills = progressive disclosure(startup 메타만→매칭 시 풀로드→deep ref) | skills 시스템 + 자가성장 |
| Intelligent Model Routing(결정적·저난도→싼 모델) | claude-max-cost-shift·§4 비용지침·[Ouroboros — Spec-First Agent OS](ouroboros.md) PAL Router |
| "eval not demo" / "tests·evals before code" | 방금 흡수 TDD([Superpowers 해체분석 (obra/superpowers)](superpowers-teardown.md) ④)·fun-feedback-separate-track·③Gate reachability |
| Trajectory eval(전 도구호출+중간추론 검증) | ③Gate·H-14 증빙 2층 |
| debugging skill 유지·slopsquatting/hallucinated deps 검증 | systematic-debugging(③)·[검증자의 주장도 환각이다 — 강한 주장은 1차 출처로 재-Gate](verifier-claims-need-regate.md) |
| Factory model(시스템을 만든다) | 북극성(진화하는 AI 운영 토대)·dispatch-builder |

## 3. 🌟 킬러 근거 — 하네스 > 모델 (북극성 외부 증거)

- **Terminal Bench 2.0**: 한 팀이 **하네스만 바꿔** 코딩 에이전트를 Top30 밖 → **Top5**로. *모델 변경 0.*
- **LangChain**: 고정 모델에 **시스템 프롬프트·도구·미들웨어만** 손봐 같은 벤치 **+13.7점**.
- "에이전트가 틀리면 첫 본능은 모델 탓. 그러나 대부분의 실패는, 정직히 보면, *configuration 실패*(빠진 도구·모호한 룰·없는 가드레일·노이즈로 채운 컨텍스트창)."
- → agent-harness-rsi-brief ②Apply 가설("다른 모델에 하네스 얹어 Fable급 산출")의 **공개 벤치 증거**. Fable 차단(EMERGENCY)으로 가속한 RSI 전략이 외부 데이터로 정당화됨.

## 4. 경제학 (TCO — CapEx/OpEx, 토큰 경제)

- **Vibe coding = Low CapEx / High OpEx**: 진입장벽 ~0이나 숨은 OpEx 폭탄 — 토큰 burn rate(구조 없는 파일 덤프+미검증 재수정 루프), maintenance tax(스파게티 역공학), security remediation(자동 eval 하네스 없으면 취약점 양산).
- **Agentic engineering = High CapEx / Low OpEx**: 선투자(API 스키마·결정적 테스트·**컨텍스트 구조화**) 후 기능당 한계비용 급락. Fig 9: Crossover Point 이후 vibe가 기능당 3–10x 비싸짐.
- **Context engineering = financial lever**: "LLM은 보내는 모든 정보에 과금. 10만 토큰 repo를 매 프롬프트에 넣는 건 스케일에서 재정적으로 불가능." dense high-signal payload(정밀 `AGENTS.md`+가드레일) → first-pass 성공률↑ → trial-and-error 루프 회피.
- **Intelligent Model Routing**: 복잡(Requirements·Architecture·초기 Implementation)=대형 모델 / 결정적·저난도(Test Generation·Code Review·CI/CD monitoring)=작고 싼 모델. 멀티모델 오케스트레이션으로 품질 유지+토큰비용 절감. → §4 비용지침 차용(헌법 패치 staged).

## 5. 실행 권고 (전문 추출 — 우리 적용 가능분)

**개인 개발자**: ① `AGENTS.md` 10줄로 시작, 에이전트가 실수할 때마다 룰 1개 추가 ② 스킬셋 설치 ③ 반복 워크플로우 1개를 첫 에이전트로(프로토타입→production) ④ **코드 전 테스트·eval 작성**(=AI와의 계약) ⑤ ship할 모든 라인 리뷰("clever해 보이면 의심", import가 실재 패키지인지 확인) ⑥ **개발자 스킬 유지**(디버깅·시스템설계·정합성 직관 — AI는 전문성 *확대* 수단이지 대체 아님).

**조직/리더**: ① context engineering을 일급 실천으로(`AGENTS.md`·system prompt·eval suite·skill lib를 코드처럼 PR 리뷰·버전관리·오너 지정) ② **"eval에 바를 걸어라, demo 아니라"**(rubric 명시: task success·tool use quality·trajectory compliance·hallucination·response quality) ③ AI 코드 리뷰 재설계(hallucinated deps·부실 에러핸들링·"맞아 보이는" 정합성 갭) ④ 프로토타입/production 경계 명시 ⑤ 하네스 구성요소를 공유 팀 자산으로(한 번 만들고 여러 번 정련).

## 6. 학습→반영 (이 페이지 = §5 백로그 실행분)

- ✅ agent-harness — §3 킬러 근거(하네스>모델 벤치) cross-ref 추가.
- ✅ agent-harness-rsi-brief — ②Apply 외부 증거로 등재.
- 🟡 §4 비용지침(헌법 LOCKED) — Intelligent Model Routing 차용 = 패치 스테이징(B, staged 2026-06-16).
- (기존 확증) context engineering static/dynamic·eval-not-demo·skills progressive disclosure는 *이미 우리에 있음* → 신규 흡수 아닌 외부 확증(매핑표 §2로 박제).

## 7. 출처·핵심 endnote

- 본체: Drive PDF(`raw/papers/google-new-sdlc-vibe-coding.pdf`). 시리즈: Day3 Context Engineering(Sessions/Skills/Memory), Day5 Spec-Driven Production Grade.
- 인용 근거(endnotes): Karpathy "Vibe Coding"(2025-02)·"agentic engineering"(2026) / METR uplift(숙련개발자 AI로 특정작업 19%↑ — verify/debug 시간) / Deloitte 30-35% 생산성 / Anthropic C compiler multi-agent 실험(2주, Rust) / Google Agents Whitepaper(2025-11)·ADK·A2A·MCP·Agents CLI·Jules.
- 마지막 문장: *"Generation is solved. Verification, judgment, and direction are the new craft."*
