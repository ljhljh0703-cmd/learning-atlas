---
created: 2026-06-09
updated: 2026-06-09
type: learning
tags: [anthropic, recursive-self-improvement, rsi, ai-safety, ai-r&d-automation, governance, alignment, agents]
source: https://www.anthropic.com/institute/recursive-self-improvement
authors: [Marina Favaro, Jack Clark]
year: 2026
category: technique
---

# Recursive Self-Improvement — "When AI builds itself" (Anthropic)

*Anthropic Institute · Marina Favaro, Jack Clark*

[2026년 Anthropic Institute가 발표한 RSI(recursive self-improvement) 리포트. AI 개발 사이클의 각 단계가 점진적으로 AI에게 위임되고 있다는 공개·내부 증거를 제시하고, 그 끝에 있는 자기개선 폐쇄 루프의 시나리오·위험·거버넌스를 다룬다. research-relay 충실(depth) 모드로 흡수 — ③Gate 라이브 대조 통과(시그니처 사실 10/10 일치).]

---

## 한 줄 요약

> AI가 코드 작성 → 실험 실행 → 연구 판단 → 후계 모델 설계·훈련까지 단계적으로 넘겨받아 자기 후계 시스템을 개선하는 폐쇄 루프가 **RSI**. *"We are not there yet"* 이지만 많은 기관의 준비보다 빨리 올 수 있다.

핵심 논증 구조: **AI가 AI 개발의 더 많은 부분을 수행 → 인간 역할은 goal·taste·review 로 축소 → 병목이 이동 → full RSI 가능성과 control·alignment·governance 문제가 커진다.**

---

## 1. RSI 정의와 현재 위치

- RSI = AI가 자기 후계 시스템을 자율적으로 설계·개발할 수 있는 상태. 위임이 충분히 진행되고 compute가 충분하면 도달.
- 현재: *"We are not there yet."* 필연 아님. 단, 기관들이 준비한 것보다 빠를 수 있음.
- 남은 핵심 gap = **목표 선택 · direction-setting · research taste/judgment** (실행이 아니라 판단).

## 2. 발전 단계 (타임라인)

1. **2021–2023** — 인간이 노트북으로 코드·문서 수동 작성 (일반 기술회사식).
2. **2023–2025** — 초기 chatbot이 짧은 코드 조각 생성 등 부분 보조.
3. **2025–2026** — coding agent가 코드 작성·수정, 때로 파일 전체 작성.
4. **Today** — autonomous agent가 코드를 직접 실행하고 여러 시간 분량 작업을 다른 agent에 위임.
5. **20XX?** — agent가 모델 build·train 까지 수행 → Claude 미래 버전이 Claude에 의해 지속 개선.

## 3. 외부 벤치마크 증거 (capability acceleration)

- AI가 독립적으로 안정 수행하는 작업 길이의 **doubling period 단축**: 기존 ~7개월 → 새 추세 **~4개월**.
- 모델별 인간환산 작업 길이: Claude Opus 3 (2024-03) ≈ **4분** → Claude Sonnet 3.7 (1년 뒤) ≈ **1시간 반** → Claude Opus 4.6 (다시 1년 뒤) ≈ **12시간**.
- 추세 유지 시 올해 며칠짜리, 2027년 몇 주짜리 작업 전망.
- **SWE-bench** (실제 codebase + 실제 bug → test 통과 수정): 2년 사이 low single digits → saturation.
- **CORE-Bench** (논문 code·data 재실행 = 재현; original research 전제조건): 2024 ~20% → 15개월 뒤 saturation.
- **METR**: Claude Mythos Preview가 최소 **16시간** 작업 수행, 측정 상단 근접 (50% reliability 기준; 80%도 동일 추세 — footnote 1).
- 한계: 공개 benchmark는 capability는 보여도 *AI 개발 자체의 가속*은 못 보여줌 → 내부 증거로 전환.

## 4. 내부 증거 (AI가 AI 개발을 가속한다)

**작업 구분**: frontier model 개발 = engineering(코드·infra·훈련 감독) + research(실험 선택·해석·다음 아이디어).
- engineering: Claude가 불완전 명세 문제를 받아 방법을 스스로 찾음 (인간은 목표만).
- research: well-specified 실험 실행은 숙련 인간과 같거나 더 나음.
- 단, 양쪽 모두 *목표 선택·judgement* 엔 큰 gap.

**코드 생산량**:
- As of **May 2026, merge되는 코드의 80%+ 가 Claude authored** (Claude Code research preview 출시 2025-02 이전엔 low single digits).
- engineer당 하루 merge line: 2021–2024 거의 일정 → 2025 상승 시작 → 2026 다시 가팔라짐.
- **2026 Q2: 2024 대비 하루 8× 코드 merge** (타이핑이 아니라 Claude가 쓰고 인간이 지시·검토).
- 인당 분기별 기여량 차트: 2025 Q1 1.2× → Q2 1.5× → Q3 1.9× → Q4 2.5× → **2026 Q1 5.8× → Q2 8.0×** (1× = 2025 이전 평균).
- ⚠️ caveat: LOC 는 quantity metric — true productivity 과대평가 가능. Anthropic은 line 수를 보상하지 않음. >80% 수치도 conservative measurement (footnote 3; 리더십 공개 추정은 90%+).

**생산성·새 작업**:
- March 2026 research team 130명 설문: median이 Mythos Preview로 no-AI 대비 **~4× output** 추정 (실제 uplift는 다소 낮을 것으로 봄 — footnote 6).
- Claude가 원래 안 했을 exploratory tooling·미뤄둔 cleanup 도 수행.
- **April 2026**: Claude가 API 오류 class를 **1000배** 줄인 **800+ fixes** ship — 담당자는 사람이면 **4년** 걸렸을 것으로 추정.

**코드 품질** (기준 = ① 작동 ② 타인이 이해·확장 가능):
- correction/redirect/takeover 필요 비율 1년간 꾸준히 하락 (복잡·open-ended task 포함).
- open-ended problem success rate: **May 2026 76%, 6개월간 +50%p**.
- 예: routine upgrade가 수만 개 training job을 crash시킨 live incident를 Claude가 **~2시간**에 해결 (사람은 보통 2–3일).
- 이해 가능성 gap은 빠르게 닫히는 중 — 내부 다수는 "2025말 < 인간, 현재 ≈ parity, 연내 추월" 견해.

**AI가 AI 산출물 검증**:
- 자동 Claude reviewer가 merge 전 bug·security flaw 탐지. 회고 분석: 모든 변경에 자동 리뷰를 했다면 claude.ai 과거 incident bug의 **~1/3** 을 production 전 차단했을 것.

**실험 실행 자동화** (small-model training-code speedup test = 미니 연구 루프, goal·metric 고정, rewrite-run-time-repeat):
- May 2025 Claude Opus 4 평균 **~3×** → April 2026 Mythos Preview **~52×**.
- calibration: 숙련 연구자가 4×에 도달하는 데 4–8시간. (절대 배율을 real-world 훈련 speedup으로 읽지 말 것 — footnote 7; 핵심은 like-for-like 추세 ~3×→~52×.)

**개방형 연구 자동화** (약한 모델이 강한 모델을 supervise 가능한가 — AI safety 문제):
- floor = weak supervisor 단독, ceiling = 정답 학습 strong model.
- 인간 연구자 2명: 1주에 gap의 **~23%** 회복.
- Claude agents: **800 누적시간 + ~$18,000** compute로 gap의 **97%** 회복.
- caveat: production-scale 로 깨끗이 transfer 안 됨, 인간이 problem·rubric 선택. 단 그 bounds 안에선 agent가 모든 실험을 설계, 인간은 direction-setting만.

**연구 판단 (next-step) 평가** (실제 Claude Code research session에서 인간이 detour한 지점을 골라, 모델이 prefix만 보고 더 나은 다음 수를 고르는지):
- n=129 (인간 선택에 개선 여지 있던 case 의도 선별 → like-for-like 인간 비교 아님, model progress yardstick).
- **Nov 2025 Opus 4.5: 인간 선택을 51% beat → April 2026 Mythos Preview 64%.**
- 판단 차트(better/tie): Haiku 3 22%/10% · Sonnet 4 48%/11% · Sonnet 4.5 50%/11% · Haiku 4.5 45%/11% · Opus 4.5 51%/10% · Sonnet 4.6 45%/13% · Opus 4.6 55%/14% · Opus 4.7 59%/12% · Mythos Preview 64%/9% · **practical ceiling 90%**.
- judge bias check: 인간 수가 이미 strong한 별도 127 moments에선 model이 better로 판정된 비율 ~20% (footnote 8).

## 5. 인간 역할 축소 + 반론

- code 작성·실험 실행의 *human-time cost* 가 낮아질수록 인간 역할은 **review · direction-setting · result judgment · taste** 로 좁아짐.
- review가 생성 속도를 못 따라가면 **human review가 병목**.
- 인간 비교우위 = **research taste and judgment** (무엇이 중요한지, 어떤 결과를 신뢰할지, 어떤 접근이 dead end인지).
- **반론 (What if we're wrong?)**: 아직 인간 손에 남은 problem choice가 가장 중요할 수 있음 — 그게 없으면 Claude는 유능한 assistant일 뿐 progress를 drive하는 system은 아님. 오늘의 training/architecture가 그 capacity를 열지는 genuinely unclear.
- 반론에 대한 재반론: AI progress 대부분은 eureka가 아니라 **incremental**(scale→break→fix→retry; 드문 예외 = Transformer, MoE). Claude는 바로 이 반복 workflow에 강함 → research taste를 못 얻어도 **compounding acceleration** 발생. 덜 보수적으로는, research judgment 개선 신호가 실제 capability라면 taste도 과거 qualitative skill(농담 설명·theory of mind 등)처럼 결국 좋아질 capability일 수 있음.

## 6. 세 가지 미래 시나리오

1. **Trend stalls, capability diffuses** (가장 덜 우려·시간 여유 최대, but Anthropic은 likely로 안 봄): exponential이 S-curve일 수 있음 / judgment가 scaling으로 안 나올 수 있음 / 병목이 model이 아니라 energy·compute·chip fab·grid·interconnect supply chain일 수 있음 / exogenous shock. 그래도 오늘 capability만으로 cyber defense(병목이 발견→패칭으로 이동, Project Glasswing이 첫 몇 주에 1만+ high/critical 취약점 발견)·조직 규모(100명이 1000명 일) 변화.
2. **Compounding efficiency gains** (제시 증거가 가리키는 쪽): AI 개발 상당 자동화, 인간은 direction·judgment. 조직 productivity multiplier 급증 — **100명이 1만~10만명 일**. knowledge work·정부서비스 혁신 ↔ surveillance·influence operation 오용. **Amdahl's law**: 일부가 빨라지면 안 빨라진 부분(예: human code review)이 전체 속도를 cap → 병목 발견·수정 능력이 핵심 조직 역량.
3. **Full RSI** (가장 빠르고 준비 공간 최소): AI가 자기 후계자를 build, progress pace = compute + algorithmic efficiency 발견 속도. 인간은 oversight·validation·verification 로 이동, AI-run **virtual lab** 확장. **alignment 결과가 가장 불확실** — 낙관(모델이 novel alignment 해법 발견·구현 / 필요시 멈출 만큼 wise) vs 비관(오늘의 rare misalignment가 successor-building에서 compound → control loss). robotics(embodied)가 뒤따를 수 있음. 단 drug 장기효과·헌법상 선거일정·인간관계 형성 같은 현실 병목은 남아, 대부분 사람의 felt pace는 병목이 결정.

## 7. 거버넌스 — "What should we do?"

- 효과적으로 늦춰 대응 시간을 벌면 좋지만, coordination 없이 한 actor만 늦추면 **least cautious actor의 catch-up** 만 도와 모두를 덜 안전하게 만들 수 있음.
- credible slowdown/pause 요건: 여러 국가의 frontier/near-frontier labs, 공통 조건, **상호 verification**, trigger·lift·adjudicator 명시, bad-actor secret lead 차단.
- AI는 verification이 특히 어려움 — training run은 missile silo보다 숨기기 쉽고, input은 general-purpose, 몰래 defect할 incentive 큼.
- **INF Treaty** 선례 = 원리상 가능 증명, but infra·trust 구축에 수십 년 — "우리는 그 시간이 없다." unilateral pause는 front-runner만 바꿀 뿐 deliberative process를 못 만듦.
- Anthropic Institute: credible pause용 verification system research + policymakers·researchers·civil society·AI companies 대화 조직·publish 예정. "지금이 함께 조사할 window."

---

## 8. 작가 시스템 연결 (Claude 해석 — 리포트 사실과 격리)

> 아래는 §1~7 추출을 근거로 한 *설계적 해석*이지 리포트의 주장이 아님.

- 이 리포트의 RSI 모델은 "갑작스러운 자기복제 폭발"이 아니라 **"개발 workflow에서 인간 단계가 하나씩 자동화되고 남은 병목이 direction·review·governance로 재배치되는 과정"**. 작가의 자가성장 AI 시스템([Hermes Agent — Nous Research 자가개선형 에이전트 플랫폼](hermes-agent.md) §8 dual-loop, CLAUDE.md "스킬 자가성장")과 같은 골격.
- 작가 시스템에 흡수 시 "성장 루프"를 *code generation → experiment execution → metric evaluation → next-step selection → safety review → pause/rollback trigger* 로 분해하면 이 리포트의 각 증거 항목과 1:1 매핑됨.
- 리포트가 강조한 남은 gap이 **research taste/judgment** 이므로, 작가 시스템 설계에서도 agent의 실행력보다 *objective selection · evaluation reliability · bottleneck detection* 을 별도 항목으로 두는 게 정합 (= [Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](../methods/karpathy-guidelines.md) #4 "검증 가능한 성공 기준" 의 시스템판).
- "AI가 AI 산출물을 review"(§4 자동 리뷰 1/3) = 작가 vault의 ③Gate / integrity-lint / Hermes Gate 와 동일 패턴 — 외부 AI 산출의 무결성 검증 계층.
- 인접 학습: [Sakana AI "AI Scientist" — 자율 연구 에이전트가 ICLR workshop 심사 통과](sakana-ai-scientist.md)(자율 연구 에이전트), [GPT-5.5 Cyber Capabilities Evaluation — UK AISI 보고서](gpt55-cyber-capabilities.md)(자율 공격 체인 = §6 시나리오1 cyber defense 병목과 호응), [Hermes Agent — Nous Research 자가개선형 에이전트 플랫폼](hermes-agent.md)(자가성장 회로).

---

## 출처·신뢰도 노트

- **③Gate (2026-06-09, Claude)**: 원문 라이브 fetch 대조 — 헤드라인·저자·8x·80%·76%·~52x/~3x·Project Glasswing 1만+·INF Treaty·3 시나리오·RSI **10/10 일치, 날조 없음**.
- 1차 외주: GPT (research-relay 충실 모드, 광범위 VERBATIM). 커버리지 맵상 DROP = 사이트 chrome/footer + 장문 직원 인용(저작권) 뿐 — 본문 논증·수치 무손실.
- **미확인 (원문에서 못 찾음)**: 정확한 게시일(day/month), DOI/arXiv. `year: 2026` 은 본문·각주의 2026 맥락 추정. `authors` 는 상단 byline 아닌 credits "co-authored this piece" 근거.
- 차트 일부 무라벨 값은 보존 제외 — 명시 label 값과 본문 수치만 박제.
