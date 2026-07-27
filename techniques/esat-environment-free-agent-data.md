---
created: 2026-07-21
updated: 2026-07-21
tags: [agent-training, synthetic-data, world-model, api-agent, distillation, llm-simulator, apple, teardown]
type: learning
source: [https://arxiv.org/abs/2607.16900]
authors: ["Seanie Lee", "Alexander Toshev", "Oncel Tuzel", "Raviteja Vemulapalli", "et al. (Apple)"]
year: 2026
category: technique
---
<!-- Apple "Environment-free Synthetic Data Generation for API-Calling Agents"(ESAT, arXiv 2607.16900) 전문 해체. LLM을 stateful 디지털 월드모델로 써서 실환경 없이 훈련궤적 합성 → 합성이 실환경 데이터를 이김. PDF 전문 판독(수치 포함). -->

# ESAT — 환경 없이 API-에이전트 훈련 데이터 합성 (Apple)

> **정체**: API-호출 에이전트 훈련엔 보통 *실행 환경 + 채워진 백엔드 DB*가 필요한데, **LLM을 즉석 "stateful 디지털 월드모델"로 써서** API 응답을 일관되게 흉내 내 훈련 궤적을 합성한다. 놀라운 결과 = **합성 데이터가 실환경 수집 데이터를 능가.** 출처: Apple ML(Lee·Toshev·Tuzel·Vemulapalli 외, arXiv 2607.16900). PDF 전문 해체 2026-07-21.

## 파이프라인 (ESAT, 3단계)
1. **태스크 합성** — API 스펙*만* 입력. **버킷화 생성**(난도×액션타입 read/write/mixed×task-focus×앱수 1–3×API수 조합격자로 균형 커버) + **역빈도 샘플링**(사용횟수 낮은 앱·API 우선 → 균일 커버) + LLM judge 필터 + **태스크 리라이팅**(절차적 장황함 → 의도수준 자연 요청으로 압축).
2. **궤적 합성 (교사 에이전트 ⊗ LLM 시뮬레이터)** ★ — 교사 LLM이 API 호출로 태스크 풀고, **LLM 시뮬레이터가 응답 생성**. 시뮬은 (API스펙+호출인자+태스크+*이전 호출·응답 히스토리(=상태)*+가상유저+현재시각)에 조건화. **4규칙**: ①상태 일관성(턴 넘어 상태 보존) ②다양성(관련+무관 항목 섞어 실제 노이즈) ③현실성(필드 제약·고유ID) ④스키마 준수. **다단 품질검사**: 인자 프로그램 검증 → 스키마 검증(불일치 시 재프롬프트) → LLM-judge 의미·일관성 검사(오류 시 refine) → 재시도, 실패 시 sim failure.
3. **궤적 필터** — 궤적수준 LLM judge가 정답 여부 판정, **복수 판정 다수결 positive만** 채택.

*쓴 모델*: 태스크=GLM-4.7, 교사+시뮬=GLM-5.1, 필터=Gemini-3.1-Pro. 파인튜닝 대상 = Qwen3(1.7/4/8/14B)+Qwen3.5(2/4/9/27B).

## 결과 수치 (전문)
- **AppWorld(TGC)**: ESAT-S52(52개 *합성* 앱, AppWorld 무관)로 8.4–47.0%p 향상. **거의 모든 모델에서 실환경 데이터(AWT)를 능가** — 합성 > 실환경. Qwen3-8B zero-shot 21.1/7.8 → ESAT-S52-AW7 **64.9/49.1**. 소형(Qwen3 8/14B·Qwen3.5 4/9/27B)이 **GPT-4o·Nemotron-120B 능가**, Qwen3.5-27B ≈ GLM-5.1 교사(<3%p) = 증류 성공.
- **OfficeBench**: 5.2–60.5%p 향상, 선행 합성연구 Simia 대비 **+20%p 이상**.
- **vs 기존 합성셋**: ToolAlpaca·ToolACE(무상태)=zero-shot 수준/이하, Nemotron(1.5M 궤적, 턴단위 rubric·무유지상태)=미미. **ESAT 차별점 = 시뮬이 *유지되는 상태*를 갖는 디지털 월드모델**.

## 급소 검증 ★ (신뢰성 = 이 논문의 진짜 기여)
"LLM이 만든 가짜 데이터를 어떻게 믿나"라는 순환 위험을 *실측으로* 방어:
- **judge 정밀도 = 실 AppWorld 실행검증기 대비 95.2%** (correct 플래그면 진짜 correct일 확률 = 훈련셋 오염 상한 통제).
- **인간 일치 95%, Cohen κ=0.90** (거의 완전 일치).
- **시뮬레이터 유효응답 93.7%** (27K 호출, GPT-5.1 심판 + 타 프런티어 교차확인).

## 냉정 한계
- **시뮬 실패율이 출력 길이 따라 급증**: <500토큰 2–3% → 500–1K 8% → 1K–2K 18% → **2K+ 23%**. 장문 생성이 약점(시뮬 모델 한계, 더 강한 모델로 완화 가능하나 비용).
- **judge 선택이 load-bearing**: 약한 judge(GLM)로 필터하면 *무필터보다 성능 저하*, 강한 judge(Gemini, 공격적 폐기)만 개선 → 방법이 모델-불가지 아님. **강한 프런티어 교사·시뮬·심판 필수** = "시뮬로 큰 모델 증류"지 공짜 아님.
- **LLM-judge 검증편향**: 교차모델로 완화했으나 대규모 인간평가는 "비용상 불가"라 자인. 벤치 2종(AppWorld·OfficeBench) 바운드.

## vault delta / synergy
vault에 에이전트 훈련·합성데이터 전용 페이지 없음. 개념적 쌍둥이 다수:
- **combat-sim-harness-spec** ★ — "실제 없이 *forward model*로 시뮬해 데이터/증거 생성 + 게이트 필터" = 완전 동형 패턴. combat-sim은 전투를, ESAT는 API 백엔드를 시뮬. **ESAT가 그 패턴을 대규모로 *작동시키고 충실도까지 실측*한 실증** — combat-sim 스펙(미빌드)에 "시뮬 충실도를 실검증기 대비 precision으로 측정" 아이디어가 직접 이식 가능.
- **[결정화(Determinization) 불완전정보 게임 AI — 고스톱 해체](determinization-imperfect-info-game-ai.md)**(gostop) — 안 보이는 상태를 시뮬해 롤아웃하는 계열.
- **[Hugging Face ml-intern — 자율 ML 엔지니어 에이전트 아키텍처](../methods/ml-intern.md)·[스펙→프롬프트 Closed-loop — 스펙 변경이 프롬프트 자동 최적화로 흐르는 파이프라인 (NAVER, 정영훈·김규철·박세)](../methods/spec-to-prompt-closed-loop.md)** — teacher→judge 부트스트랩(self-instruct/distill 계보).
- **선행 ④ 정합**: "생성기가 자기 산출 검증=순환" 위험은 작가 ③Gate·"자동 박제 불신" 경계와 같음. ESAT의 답 = *외부 ground-truth(실 검증기) 대비 judge precision을 측정*해 순환을 바운드 — vault 게이트 신뢰도를 정량화하는 방법으로 차용 가능(judge를 믿기 전 외부 기준 대비 precision 재보).
- **반영**: [학습→반영 루프 (Absorb-to-Apply)](../narrative/학습→반영 루프.md) ②Park — API/도구 에이전트 훈련 또는 LLM-시뮬 파이프라인 착수 시 인출. 억지 반영 X.
