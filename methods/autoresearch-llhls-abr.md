---
created: 2026-06-18
updated: 2026-06-18
type: learning
tags: [AI, agent-harness, autoresearch, done-gate, escalation, llhls, abr, qoe, deterministic-eval, ground-truth]
source: AI 에이전트가 코드를 실험하고 개선하는 법 (NAVER D2)
authors: [배웅준]
year: 2026
category: method
---

# AutoResearch 프로덕션 인스턴스 — LLHLS ABR 자율 실험으로 QoE 17.1% 향상 (NAVER D2, 배웅준)

*NAVER D2 발표(미디어 플레이어테크 배웅준) · NotebookLM 충실(depth) 외주 ④Gate PASS(확실/불확실/자막의심 분리 일관) · [Autoresearch — Karpathy의 자동 연구 루프](autoresearch-karpathy.md) 패턴의 *프로덕션 실전 확증* + escalation·다단게이트 vein 신규*

Karpathy의 [Autoresearch — Karpathy의 자동 연구 루프](autoresearch-karpathy.md)(2026-04)는 "에이전트가 `train.py` 고쳐 밤새 LLM 학습 실험"이었다 — 당시 vault 평가는 *"AI NPC 직접 적용 낮음, 방법론은 이식 가능"*. 이 발표는 그 패턴을 **LLM 학습이 아닌 프론트엔드/미디어 도메인(HLS.js ABR 알고리즘)에 그대로 이식**해 사람 개입 없이 30회 자율 실험으로 동영상 재생 품질(QoE)을 **17.1% 실향상**(0.7954→0.9310), 측정 에러 0번. = "방법론 이식 가능" 가설의 **프로덕션 확증**이자, 북극성 RSI ②Apply 의 외부 ground-truth.

---

## 한 줄 요약

> "점수 매길 수 있는 모든 정량 실험에 적용 가능" — 에이전트가 ABR 코드를 수정→빌드→결정론 시뮬→측정을 30회 자율 반복. 사람은 `program.md`(전략)만 쓰고, **판정은 오직 쉘스크립트 출력**(좋아 보임 ≠ 근거). 우리 agent-harness done-gate·[Autoresearch — Karpathy의 자동 연구 루프](autoresearch-karpathy.md) 루프의 *미디어 프로덕션 확증*.

---

## 문제 맥락 (왜 자율화가 필수였나)

- **LLHLS(저지연 HLS)에서 ABR 예측이 어려워짐**: 일반 HLS 의 8~30초 세그먼트가 LLHLS 에선 2~3초로 줄어, 측정 단위가 작아진 만큼 다음 화질을 예측하는 EWMA(지수가중이동평균) 추정 정밀도가 떨어진다.
- **수동 검증 = 1회 ~54분**: 수십 개 파라미터 × 7가지 네트워크 시나리오를 통제해야 함 → 사람이 돌리기엔 비현실적, 자동화 필수.

---

## 확증 매핑 — 발표 개념 → vault 기존 자산 (재서술 X, 링크만 — #3)

1. **사람=전략(`program.md`), 에이전트=코드 수정** → [Autoresearch — Karpathy의 자동 연구 루프](autoresearch-karpathy.md) program.md 패턴 그대로. 확증.
2. **수정 범위를 ABR 파일 딱 4개로 제한**(헤매지 않는 자율성) → autoresearch "train.py 하나" + 디스패치 scope deny-first(agent-harness L-1). 확증.
3. **"좋아 보임은 근거 아님, 오직 쉘스크립트 출력만 판정"** → done-gate "성공=`<shell>` exit 0" 머신체크(dispatch-builder 슬롯3). 확증.
4. **결정론 E2E 측정 인프라**(FFmpeg→MediaMTX→Toxiproxy→Playwright, 네트워크 선제어로 EWMA 오염 방지) → [Playwright E2E 에이전트 하네스 — 테스트=실행가능 명세, trace=user-facing 증빙 매체 (Naver 발표)](playwright-e2e-agent-harness.md) 결정론 센서 철학(형제 NAVER 발표). 확증.
5. **3중 메모리 누적**(git log 커밋이력 + autoresearch.json 단위결과 + lessons.json 회피규칙) → vault lessons·memory 누적 + autoresearch 로그. 확증+구체.
6. **"자율성 = 무제한 자동화 아니라 한계를 정직 보고하는 능력"**(블록 13) → agent-harness ceiling escalation·정직 보고 규율. 확증+강화.
7. **"더 복잡한 게 아니라 더 단순한 게 정답"**(5줄 임계값 로직 > 논문 알고리즘 전체, 블록 12·15) → [Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](karpathy-guidelines.md) #2 Simplicity First. 강한 프로덕션 확증.

---

## 진짜 새것 (vault delta)

1. **★다단 점진 검증(3-Tier)** — Tier1 시뮬 15초 → Tier2 퀵테스트 2.5분 → Tier3 풀테스트. *빠른 실패 후보를 싸게 먼저 거른다*. autoresearch 원본은 "5분 고정 단일", vault done-gate 는 "exit 0 단일 게이트" → **점진 필터 = 공백**. → dispatch-builder done-gate 보강(2026-06-18).
2. **★3단계 자동 에스컬레이션** — 3회 연속 Discard→**Refine**(같은 전략 파라미터 미세조정) / 5회→**Pivot**(전략 전환, `program.md` 다음 Pass) / 8회→**Halt**(사람 호출). Keep 1회 시 모든 카운터 0 리셋. vault on_failure 는 "재시도 or STOP"만 → *연속실패 임계별 전략 단계화 = 공백*. = 위 #6 "한계 정직 보고"의 **구체 메커니즘**. → done-gate on_failure 보강(2026-06-18).
3. **2중 가드레일 판정**(worst-of-N 구체화) — Keep 조건 = ① 7개 시나리오 평균 QoE 가 baseline 이상 AND ② 단일 시나리오라도 표준편차 1.5배 이상 떨어지면 안 됨("6/7 좋아도 1개 무너지면 Discard"). [goose — 모델독립 에이전트 하네스 (production 오픈소스 정본)](../techniques/goose-agent-harness.md) "worst-of-N flaky 검출"의 **임계 구체 사례**.
4. **이터레이션이 진행될수록 변경 *품질*이 학습됨**(순수 관찰) — Tier1(15초)에서 탈락하는 비율↓, Tier3(풀테스트)까지 진입 빈도↑. 에이전트가 lessons.json 누적으로 "헛수고 변경"을 줄여감.
5. **두 변경의 *공통 영역*에서 단일 합보다 큰 이득**(블록 14, 순수 관찰) — 비선형 시너지. 극한 네트워크(대역폭 2Mbps cap)에서 개선 폭 최대.

---

## 한계·미검증 (격상 금지)

- **타임스탬프 없음**: 텍스트 소스 외주라 물리적 mm:ss 부재 → 발언 위치를 단락 기준 (블록 n)으로 대체 표기. 정직 보고.
- **자막 오인식 정리됨**(RETURN §6): `QoE`(←Q/키오), `1M Context`(←원밀리안), `Pensieve`/`SODA`(←팬시브/소다, ABR 논문명), `매 이터레이션`(←매터레이션).
- **사용 LLM 모델 = 자막 불명**: NotebookLM 이 "소네 4.6→Sonnet, 오프스 4.6→Opus"로 추정했으나 *추정이므로 박제 X*(verifier-claims-need-regate). 코딩 에이전트로 Claude 계열 사용은 확실, 구체 모델명은 미확정.
- **17.1%·0번 에러·30회**는 영상서 직접 확인(확실). baseline 0.7954→0.9310 도 수치 제시됨.

---

## 반영 (학습→반영 루프)

- ✅ **dispatch-builder 슬롯3 done-gate 보강** (2026-06-18) — 정량 실험형 디스패치에 *다단 점진 게이트(Tier1 sim→Tier2 quick→Tier3 full) + 2중 가드레일(평균 baseline + worst-case 임계) + escalation on_failure(Refine→Pivot→Halt, Keep시 리셋)* 차용 라인.
- ✅ **[Autoresearch — Karpathy의 자동 연구 루프](autoresearch-karpathy.md) 프로덕션 확증 노트** (2026-06-18) — 2026-04 "방법론 이식 가능" 가설이 미디어 ABR 프로덕션에서 확증됨을 상호링크.
- 🔗 **agent-harness 연결**: escalation(Refine/Pivot/Halt)은 ceiling escalation 의 *임계 단계화* 구체형 — H-Core 신규 항목 추가는 구조변경이라 회피, done-gate 경유 반영(필요시 ②Apply 검증 후 H-Core 승격 backlog).
- ❌ **확증분**(program.md·scope·쉘판정·결정론센서·3중메모리·단순함)은 이미 vault 보유 → 흡수만, 재서술 X.

---

## 연결된 페이지

- [Autoresearch — Karpathy의 자동 연구 루프](autoresearch-karpathy.md) (원 패턴 — 본 페이지가 프로덕션 확증) · [Playwright E2E 에이전트 하네스 — 테스트=실행가능 명세, trace=user-facing 증빙 매체 (Naver 발표)](playwright-e2e-agent-harness.md) (형제 NAVER 발표, 결정론 E2E 센서) · dispatch-builder (done-gate 반영처)
- agent-harness (ceiling escalation·done-gate) · agent-harness-rsi-brief (RSI ②Apply — 자율 실험 루프 = Apply 외부 ground-truth) · [goose — 모델독립 에이전트 하네스 (production 오픈소스 정본)](../techniques/goose-agent-harness.md) (worst-of-N)
- [Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](karpathy-guidelines.md) (#2 단순함 프로덕션 확증) · lessons (lessons.json 누적 동형)
