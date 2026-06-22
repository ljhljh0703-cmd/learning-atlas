---
created: 2026-06-17
updated: 2026-06-17
type: learning
tags: [geo, measurement, llm-judge, evidence-grounding, leakage-guard, anti-anchoring, bootstrap-ci, latent-deterministic, clean-room, korean-org]
source: https://github.com/NomaDamas/geobench
authors: [NomaDamas]
year: 2026
category: technique
---

> ✅ **confirmed** (2026-06-17, 작가 "B로 해 — 충돌·성능·효율 저하 없는 선") — Claude 작성, clean-room 전문통독 기반 ③Gate PASS(출처 실존·환각0·코드 복제 X). 흡수 = *방법론*(도구 자체는 infra-0 제외).

# geobench — GEO 가시성 벤치마크 (측정 엄밀성 정본)

NomaDamas(AutoRAG 제작 한국 조직)의 MIT 오픈소스 **GEO(Generative Engine Optimization)** 벤치마크. "내 브랜드가 LLM 답변에 얼마나 잘 노출되나"를 6 provider(OpenAI/Anthropic/Google/Perplexity/xAI/OpenRouter)에서 측정 — hit rate·MRR(추천순위)·share of voice·citation·sentiment + bootstrap 95% CI + 로컬 대시보드.

**왜 중요** — 작가가 계속 *미도입한 "측정축"*(hot 메타발견)의 **엄밀한 구체 인스턴스**. 신규 흡수가치 = 측정 엄밀 4종 + leakage guard 가 작가가 이미 *정성적으로* 가진 규율(③Gate·clean-room)의 **정량/알고리즘 형식**이라는 점. GEO 실천 자체는 felt-need 미관찰 → backlog.

## 1. 측정 엄밀성 4종 (작가 규율의 정량 형식)

- **evidence = 원문 literal substring 강제** 🌟 — LLM judge 가 낸 근거 인용이 응답의 *정확한 NFC-정규화 부분문자열*이 아니면 **결과 전체 reject**. profiler 도 evidence quote 가 fetch 한 원문 substring 이어야 use-case 채택. → 작가 ③Gate "출처 grounding"·clean-room VERBATIM 의 *머신체크 버전*. [Forge Spec-Gate (why-was-fable-banned) — 차용 해체](../methods/forge-spec-gate.md) fake-evidence marker(not run/assumed)와 **상보**(이쪽은 *날조 인용* 잡음).
- **deterministic = audit-only, judge override 절대 금지** — 결정론 list-parser 는 병렬로 돌되 *calibration 신호(agreementRate)*로만. judge 가 유일 권위. → [GBrain — 개인 AI 지식 브레인 production 정본](gbrain.md)에서 흡수한 **latent vs deterministic** 이분법의 실전(동기 사례: "배터리 수명 §의 첫 bullet"을 파서가 rank=1로 오판 → 비교표지 추천 아님 → judge 만 의도 판별).
- **bootstrap 95% CI** ("Don't Measure Once" arXiv:2604.07585) — rate 지표마다 1,000-resample seeded CI. n<30 이면 `low_query_count` advisory(차이=노이즈). → [GBrain — 개인 AI 지식 브레인 production 정본](gbrain.md) 모순감지 Wilson CI 와 같은 "수렴≠도입" 통계 규율. LLM 답변은 확률적 → 단일 측정 과신 금지.
- **두 지표계 혼동 금지** — GEO 가시성(Part A) ≠ surface fidelity(API↔브라우저 일치, Part B/품질관리용). 명시 경고로 분리. → 작가 "측정≠게이트"(분량은 측정·correctness 는 게이트) 인사이트와 동형.

## 2. Leakage guard → anti-anchoring (clean-room 알고리즘화)

synthesizer LLM 이 *제품 정체(name/alias/romanization/도메인)를 절대 못 보게* 4단계 sanitization + 5 매칭전략(literal/word-boundary/CJK/compact/spaced-form). 안 그러면 쿼리가 브랜드명에 편향돼 결과 조작. 5개 미만 생존 시 loud fail. 실전 교훈: 짧은 alias(1-2자)·흔한 영단어(AI/Pro/Max)는 과차단 → 금지.

**핵심 추상 = anti-anchoring**: *생성자에게 정답/결론을 누설하면 산출이 편향된다.* → 작가 시스템 응용 = research-relay BRIEF 에 *기대 결론·선호 대상 누설 금지*(중립 기술 + 증거로 결정). research-relay 본연(대상을 *봐야* 하는 fidelity 분석)과는 구분 — leakage guard 는 *판정/비교/서베이* 디스패치에 적용. anti-bias 검증 규율(verifier-claims-need-regate)과 정합.

## 3. 부수 (대조용)

- **markdown skills + arg-elicitation** — spec-author(5단계 구조 인터뷰·vague면 재질문·건너뛰기 금지)·bench-runner arg-elicitation(자연어→CLI 플래그 결정트리)·references/ 분리. → [GBrain — 개인 AI 지식 브레인 production 정본](gbrain.md) thin-harness-fat-skills + 작가 dispatch-builder 역면접의 또 한 인스턴스(이미 보유, 신규성 낮음).
- **profiling unknown products** — 무명 제품은 공개페이지 fetch→use-case 추출(evidence quote 검증)→익명화→쿼리 생성. category 키워드 대신 *실제 user problem* 축.

## 4. ⚠ 가드 (cold-verify — 수렴≠도입)

- **도구 자체 = infra-heavy** — DB(migrations)·6 provider API 비용·대시보드·browser automation(ToS 경고). 로컬 vault 설치는 infra-0 위반(Karpathy #2). 흡수 = 방법론.
- **GEO 실천 = felt-need 미검증** — 작가는 아직 측정 대상 "브랜드" 아님. 단 *Track 3(포트폴리오/이름 가시성)* 에 미래 인출 가치(="LLM 이 내 게임/이름 언급하나"는 취업 관련 질문 될 수 있음) → backlog.
- **메타발견 재확증** — 또 **측정축**([Gnosis — 파인튜닝 없이 헌법·메모리·루프로 성장하는 자가개선 에이전트 (vault 아키텍처 수렴 ground-truth #5)](../methods/gnosis-self-improving-agent.md)·[Loop Engineering (Addy Osmani) — 하네스 위 한 층, 스케줄 발동 loop (vault 수렴 ground-truth #6)](../methods/loop-engineering.md)·[GBrain — 개인 AI 지식 브레인 production 정본](gbrain.md) 에 이어 N번째). "반복 미도입 delta = 측정·자동화축" → 6/28 phase2 infra-0 경계 재평가 입력.

## 5. 학습→반영 (학습→반영 루프, B 범위 실행)

- **#1 (즉시)**: evidence-substring 강제 → ③Gate 체크리스트 명문화(RETURN §③, forge fake-marker 옆 sibling).
- **#2 (즉시)**: anti-anchoring(결론 누설 금지) → research-relay BRIEF 가드레일 1줄.
- **#3 (보류)**: GEO 실천(작가 포트폴리오 가시성 측정) = backlog, felt-need 관찰 시. 측정 엄밀 4종의 *무거운 정량*은 미도입(Nadella private-outcome 노선 유지).
