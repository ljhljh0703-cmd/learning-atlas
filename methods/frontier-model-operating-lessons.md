---
created: 2026-07-03
updated: 2026-07-03
type: learning
tags: [model-routing, harness, governance, frontier-model, fable-5, north-star]
source: https://www.anthropic.com/news/redeploying-fable-5
authors: [Anthropic]
year: 2026
category: method
---

<!-- 고지능(frontier) 모델을 거버넌스가 감당 못 하게 두지 않고 운용하는 원칙 — Anthropic Fable 5 재배포 사건에서 추출. -->

# Frontier 모델 운용 교훈 (High-Intelligence Model Operating Lessons)

> ✅ **confirmed 2026-07-03** — Codex가 추출(RETURN), vault Claude ③Gate 통과(1차 출처 7/7 verbatim 일치), 작가 컨펌.

## 왜 이 노트가 있나

Anthropic이 2026-06-12 미 정부 수출통제로 차단됐던 Fable 5·Mythos 5를 2026-07-01 재배포하며 낸 [Redeploying Fable 5](https://www.anthropic.com/news/redeploying-fable-5) 포스트는 단순 "모델 돌아옴" 공지가 아니다. **모델 능력이 거버넌스를 앞지르지 않게 하며 frontier 모델을 쓰는 운영 매뉴얼**로 읽힌다. 북극성(모델독립 하네스, [goose — 모델독립 에이전트 하네스 (production 오픈소스 정본)](../techniques/goose-agent-harness.md)·[The New SDLC With Vibe Coding (Google / Addy Osmani)](google-new-sdlc-vibe-coding.md))과 직결.

핵심 한 줄:
```
고지능 모델 = 가속 레인, SSOT 아님.
SSOT는 Sub-brain + 테스트 + RETURN/Gate 에 있지, Fable/Codex/Claude 가용성에 있지 않다.
```

## A. Frontier 모델 접근 = 불안정 capacity, 인프라 기반암 아님

Fable 5 접근은 정부 지시로 중단됐다가 복원됐다. 실무 규칙:
- 어떤 워크플로우도 *한 frontier 모델의 상시 가용*에 의존시키지 않는다.
- 디스패치 패킷은 fallback 거동을 명시 — `preferred_model` / `acceptable_fallbacks` / `degraded_mode` / `stop_if_model_required`.
- 고지능 모델 부재 시, 하네스는 저모델로 bounded 작업 라우팅 후 *판단 무거운 부분만* 나중에 에스컬레이션.

## B. 더 강한 모델일수록 *좁은 task envelope*, 느슨한 프롬프트 아님

Anthropic의 대응은 "모델을 믿자"가 아니라 분류기 강화·fallback 라우팅·심각도 스코어링·외부 평가였다. 작가 하네스 등가:
- Fable급 = bounded 고레버리지 작업에만 — 아키텍처 비평, 어려운 디버깅, 종합, verifier 리뷰, 계획 압축, 충돌 분석.
- **verified ≠ genre clone** (2026-07-03 voxelcraft teardown delta): Fable 산출 게임 = *bounded work-envelope narrowing* + 브라우저 자동화 done-proof(playtest·screenshot-hash)로 성립. "Fable이 마인크래프트 만듦" 류 과장 X → "검증된 voxel 샌드박스 프로토타입" O — 능력 주장이 아니라 *좁힌 envelope 안의 검증된 결과*. [Fable 5 프롬프팅 (공식 가이드)](fable-5-prompting.md).
- 상시 자율 executor + 넓은 쓰기 스코프로 쓰지 않는다.
- 명시적 envelope 부여: source set / 허용 쓰기 / 금지 파일 / 기대 산출물 / 검증 명령 / 정지 조건.
- **높은 IQ → 하네스는 *더 명확*해야지 더 약해지면 안 된다.** (external-ai-grant-hardcontract 강화)

## C. Safeguard 오탐 = 새로운 관측 변수

Anthropic은 새 분류기가 *양성(benign) 코딩·디버깅*을 더 자주 flag할 수 있다고 명시. 새 작업 마찰 클래스:
- refusal/fallback ≠ "에이전트 실패".
- `blocked_by_safeguard: true` + 프롬프트 카테고리·작업유형·fallback 모델·양성 여부로 기록.
- 반복되는 양성 작업이 막히면 task envelope를 안전 프레이밍으로 재작성(defensive context·로컬 repo 소유·no exploit chain·정확한 검증 대상).

기록 필드: `blocked_by_safeguard` · `safeguard_area` · `fallback_model` · `benign_task_evidence` · `reroute_result`.

## D. 심각도 스코어링 — jailbreak 뿐 아니라 하네스 사고에도

Anthropic 제안 jailbreak 심각도 4축을 작가 하네스 incident/risk rubric으로 차용:

| Anthropic 축 | Sub-brain 하네스 등가 |
|---|---|
| Capability gain | 모델이 리스크/레버리지를 바꾸는 정상 범위 밖 행위를 했나? |
| Breadth | 좁은 한 작업인가, 다수 워크플로우에 영향인가? |
| Ease of weaponization | 캐주얼 프롬프트로 발생 가능한가, 복잡 셋업 필요인가? |
| Discoverability | 위험 경로가 누구에게나 명백한가, 숨겨/드문가? |

용도: risk-verification-report 항목이 고지능 모델 사고를 4축 스코어 → **breadth 높고·쉽게 트리거·쉽게 발견되는 실패 우선 처리**. 좁은 사소 실패는 기록만, 과잉 프로세스화 X (Karpathy #2).

## E. Frontier 모델 사용은 1인 작가라도 pre-release/eval 같이

새 frontier 모델을 default worker로 채택 전, Sub-brain에서 작은 **앵커 eval set** 실행:
- 코딩 1 / 디자인·포폴 1 / 리서치 해체 1 / verifier·Gate 1 / refusal·safeguard 민감 1.
- 현 default 모델 대비 품질·false confidence·refusal/fallback·도구 규율·검증 정직성 비교.
- 그 후에만 라우팅 default 갱신.

→ gate-eval-set-v0 / red-queen Verifier Evolution 로직 직결 — **새 고IQ 모델은 평판이 아니라 앵커 케이스로 라우팅 신뢰를 획득**한다. (cold-verify-before-adopt)

## F. 모델 라우팅 정책 후보

Fable급을 **쓸 곳**:
1. Architect / Critic — 어려운 시스템 설계·충돌 탐지·타당성 비평.
2. Verifier — 스펙·출처증거·Gate rubric 대비 독립 리뷰.
3. Synthesis Engine — 다수 RETURN/daily 기록을 실행 가능한 다음 수로 압축.
4. Escalation Lane — 정상 모델이 루프·숨은 제약 놓침·깊은 문서간 추론 필요 시.

Fable급을 **쓰지 말 곳**:
1. authority 문서 위 unbounded writer.
2. 지식의 background 자율 promoter.
3. Sub-brain 연속성의 단일 지점.
4. 증거·테스트·출처링크·작가/vault Claude Gate의 *대체물*.

## G. 관련 학습→반영

이 노트의 헌법·하네스 반영 후보는 별도 스테이징 패치 agent-observability-integration-2026-07-03 및 agent-observability-inbox 서브시스템에서 다룬다. 관측성 record가 `model`·`blocked_by_safeguard`·`fallback_model`을 추적하는 근거가 여기(C·D)다.

## 관계

- [goose — 모델독립 에이전트 하네스 (production 오픈소스 정본)](../techniques/goose-agent-harness.md) · [The New SDLC With Vibe Coding (Google / Addy Osmani)](google-new-sdlc-vibe-coding.md) — 모델독립 하네스 외부 ground-truth (북극성)
- agent-harness-rsi-brief — ②Apply 앵커 eval(E), Open Model Gym
- gate-eval-set-v0 · hermes-loop §③ — 새 모델 라우팅 신뢰 획득(E)
- CLAUDE.md §4 비용·모델 운용 — Intelligent Model Routing(F 정합)
- external-ai-grant-hardcontract — 좁은 envelope·하드컨트랙트(B)
- cold-verify-before-adopt — 평판 아닌 검증(E)
