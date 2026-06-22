---
created: 2026-06-21
updated: 2026-06-21
type: learning
tags: [fable-5, codex, harness, workflow, agent-discipline, goal-ledger, findings-gate]
source: https://github.com/baskduf/FableCodex
authors: [baskduf]
year: 2026
category: method
---

# FableCodex — Fable 규율을 Codex 워크플로우로 구현한 플러그인

> ⚠️ 임시 (작가 컨펌 전)

*baskduf (기여자 다수)*

Fable 5 모델의 operating discipline(검사 우선·증거 추적·완료 전 검증)을 Codex-native 플러그인으로 재구현한 오픈소스 도구. [Fable 5 프롬프팅 (공식 가이드)](fable-5-prompting.md)이 *원칙 문서*라면 FableCodex는 그 **실전 구현체** — Codex가 실제로 그 규율을 따르도록 CLI 도구(goal ledger, findings gate)와 라우팅 참조를 제공한다.

---

## 한 줄 요약

> Fable 5 스타일의 Inspect-first·Evidence-gate 루프를 Codex 플러그인(Python stdlib, 로컬 JSON 저장)으로 구현. 모델 변경 없이 워크플로우 규율만 주입.

---

## 핵심 개념

### 1. Core Loop (6단계)

```
classify → inspect → plan(필요시) → tool-first 실행 → findings 추적 → verify + close
```

- **classify**: 단순 한-스텝 답변 vs. 멀티스텝·리뷰·디버깅 여부 먼저 분류. 불필요한 goal 파일 생성 차단.
- **inspect before acting**: `rg` 또는 `rg --files`로 로컬 검색 우선. 파일·URL·논문·이슈 직접 확인.
- **plan only when it changes execution**: 2개 이상 의존 스토리·장기 자율 작업에만 goal ledger 사용.
- **verify = "Done"**: 테스트·lint·typecheck·스크린샷·커맨드 출력·소스 검사 중 하나 이상. 메모리에만 의존한 "완료" 금지.

### 2. Goal Ledger (`codex_goals.py` / `codex-fable5 goals`)

멀티스텝 작업의 resume-safe 로컬 상태 관리. `.codex-fable5/goals.json` 저장.

```bash
# 생성
codex-fable5 goals create --brief "Migration" \
  --goal "inspect::Find current behavior and tests" \
  --goal "change::Implement the migration" \
  --goal "verify::Run tests and inspect output"

# 완료 체크포인트 (증거 필수)
codex-fable5 goals checkpoint --id G003 --status complete \
  --evidence "Implemented X." \
  --verify-cmd "python3 -m unittest discover -s tests -v" \
  --verify-evidence "All tests passed."
```

**규칙**: 완료 체크포인트는 *구체적 증거* 필수. 최종 goal은 `--verify-cmd`와 `--verify-evidence` 추가 필수.

### 3. Findings Gate (`codex_findings.py` / `codex-fable5 findings`)

리뷰·검증 실패·미결 단서를 evidence-backed findings로 추적. `.codex-fable5/findings.json` 저장.

```bash
# 발견 등록
codex-fable5 findings add --title "Missing verification" --severity high --source review \
  --evidence "Final checkpoint completes without proof tests ran."

# 해결 (수정+검증 후)
codex-fable5 findings resolve --id F001 \
  --evidence "Final checkpoints now require verification evidence." \
  --verify-cmd "python3 -m unittest discover -s tests -v" \
  --verify-evidence "Regression test passed."

# 게이트 실행 (open/blocked findings 있으면 FAIL)
codex-fable5 findings gate
```

**게이트 규칙**: 최종 goal checkpoint 완료 전 반드시 `findings gate` 통과. open/blocked findings 잔재 시 goal 완료 자동 차단.

### 4. Task Routing Table

| Signal | Apply |
|--------|-------|
| 2+ 의존 스토리·마이그레이션·장기 자율 | Goal ledger + 최종 검증 게이트 |
| 디버깅·회귀·원인 불명 실패 | Investigation protocol (재현 먼저, 경쟁 가설, 반증 수집) |
| HTML·CSS·UI·캔버스·게임 | Verification grounding: 실행→관찰→수정→재실행 |
| 진단·아키텍처 결정·기술 트레이드오프 | VFF 구조: 결론 먼저, 단서-우선 가설, 최저비용 측정 |
| 리뷰 요청·불확실 검증·보안 민감·멀티파일 | Findings ledger + gate |
| 단순 한-스텝 편집·사실 답변 | 일반 Codex 루프 — goal 파일 추가 없음 |

### 5. Fable→Codex 변환 규칙 (`references/fable-to-codex-map.md`)

Fable-style 시스템 프롬프트를 Codex-native 지침으로 의미론적 변환하는 참조 가이드. **핵심 원칙: 소스 프롬프트 리터럴 복붙 금지 — 행동만 보존.**

변환 우선순위:
1. Agent operating loop (inspect→plan→tool→verify)
2. Currentness discipline (불안정 사실은 browse)
3. File/artifact workflow (Claude artifact → Codex repo 파일)
4. Durable state (Claude memory → AGENTS.md·skill·ledger)
5. Connector routing (MCP 앱 제안 → 설치된 Codex 앱)
6. Safety/copyright 경계 (간결한 거절·high-stakes 주의)
7. Tool 이름 번역 (`view` → `rg`, `str_replace` → `apply_patch` 등)

---

## 기술 스택 / 사용법

```bash
# 설치
codex plugin marketplace add baskduf/FableCodex --ref v0.5.1
codex plugin add codex-fable5@fablecodex

# 프롬프트에서 호출
@codex-fable5 Use this skill to implement the change.
Create a goal ledger. Track findings before final completion.
Run tests before saying it is done.

# CLI 직접 사용 (checkout bin 경로 추가)
export PATH="$PWD/plugins/codex-fable5/bin:$PATH"
codex-fable5 status
codex-fable5 goals next
codex-fable5 findings gate

# 테스트
python3 -m unittest discover -s tests -v
```

**로컬 상태**: `.codex-fable5/goals.json`, `findings.json`, `ledger.jsonl` — 의도하지 않는 한 커밋 금지.

---

## 내 생각 — 에이전트 하네스 관점

### 직접적 연결: 높음

FableCodex는 agent-harness-rsi-brief의 북극성("Fable 사고→모델독립 하네스 추출")을 **이미 완성한 working implementation**이다. 우리가 역추출하려던 것을 누군가 먼저 오픈소스로 만들었다.

구체적 활용처:
- **hwigi-tower Codex 디스패치**: `@codex-fable5` 호출 + goal ledger 패턴을 hwiglija-tower-AGENTS 브리프에 통합. 구현 중 findings gate로 미완 항목 추적.
- **디스패치 브리프 강화**: dispatch-builder에서 Codex 작업 할당 시 `codex-fable5 goals create` 시작 지시 추가 → Codex가 스스로 resume-safe 체크포인트 관리.
- **③Gate 대응**: Hermes loop ③Gate의 Codex-side 거울 — findings gate = 외부 AI 산출 수락 전 findings 제로 확인.

### 개념적 수확

1. **Findings = accepted repair work, not brainstorming**: findings는 생각 노트가 아니라 *해결 의무*가 있는 증거-backed 결함. 우리 vault의 `proposed-patches/`와 같은 논리.
2. **Goal = intent + evidence checkpoint**: 작업 의도를 선언하고, 완료는 반드시 증거로만 닫힘. "되는지 확인해주세요" 류 약한 완료 차단 — [Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](karpathy-guidelines.md) #4 Goal-Driven Execution의 구현.
3. **Route first, discipline later**: 작업 분류로 적용할 discipline을 결정. 단순 작업에 과잉 process 투입 금지(Karpathy #2 Simplicity).
4. **Operating structure = VFF 추출**: `operating-structure.md`는 Value-for-Fable의 operating 원칙을 Codex-native로 증류. 결론 먼저·cheapest discriminating measurement·2-pass review 조건 등.

### 블루프린트 연결

- agent-harness-rsi-brief: FableCodex = 하네스 추출 북극성의 외부 검증 사례. 우리가 추출 중인 하네스가 실제로 standalone 플러그인이 됨을 증명.
- [goose — 모델독립 에이전트 하네스 (production 오픈소스 정본)](../techniques/goose-agent-harness.md): goose(breadth)·opencode(depth)에 이어 FableCodex = *Codex-specific* 하네스 3번째 정본. 각각 다른 host에서 같은 Fable 규율을 구현.
- [Fable 5 프롬프팅 (공식 가이드)](fable-5-prompting.md): 원칙 → FableCodex: 실전 구현. 원칙 읽고 구현 방식 참조 시 병행 활용.

---

## 열린 질문

- hwigi-tower Codex 세션에서 `@codex-fable5 goals create`를 디스패치 브리프에 포함 시 Codex가 실제로 `.codex-fable5/` 로컬 상태를 Codex Desktop App 내에서 유지하는가? (CLI 환경 vs. Desktop App 환경 차이 확인 필요)
- `codex-fable5 findings gate`를 Hermes ③Gate의 *Codex-side 하위 게이트*로 공식화할 수 있는가? hermes-loop.md §③Gate 보강 후보.
- `fable_coverage.py --source CLAUDE-FABLE-5.md`를 실행하면 어느 섹션이 아직 Codex-native로 변환 안 됐는지 확인 가능 — 향후 하네스 강화 입력으로 활용 가능.

---

## 다음 학습 후보

- **[elder-plinius/CL4R1T4S — ANTHROPIC/CLAUDE-FABLE-5.md](https://github.com/elder-plinius/CL4R1T4S)** — FableCodex가 source로 인용한 상위 원천. Fable 5 실제 system prompt 유출본 분석 (`fable-5-prompting.md`에 이미 caveat-fenced로 흡수됨 — 추가 확인용).
- **[fivetaku/fablize](https://github.com/fivetaku/fablize)** — FableCodex source #2. VFF(Value-for-Fable) operating structure의 원류.
- **[itsinseong/value-for-fable](https://github.com/itsinseong/value-for-fable)** — FableCodex source #3. 비용-인식 라우팅·진단 패턴 원류.
- **[sickn33/antigravity-awesome-skills](https://github.com/sickn33/antigravity-awesome-skills)** — FableCodex가 등재된 Antigravity 스킬 레지스트리. 다른 Codex 스킬 탐색 기반.

---

## 연결된 페이지

- [Fable 5 프롬프팅 (공식 가이드)](fable-5-prompting.md) — 원칙 문서 (FableCodex가 구현하는 Fable 5 공식 가이드)
- agent-harness — 모델독립 하네스 마스터 노트
- agent-harness-rsi-brief — 북극성 전략 (Fable→하네스 추출)
- [goose — 모델독립 에이전트 하네스 (production 오픈소스 정본)](../techniques/goose-agent-harness.md) — 모델독립 하네스 정본 (goose 사례)
- hwiglija-tower-AGENTS — hwigi-tower Codex 브리프 (goal ledger 통합 후보)
- dispatch-builder — Codex 디스패치 프롬프트 조립 (fable-to-codex-map 참조)
- [Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](karpathy-guidelines.md) — 메타 행동 원칙 (FableCodex가 구현하는 원칙들과 수렴)
