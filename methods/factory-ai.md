---
created: 2026-06-17
updated: 2026-06-17
type: learning
tags: [AI, agent-harness, orchestration, spec-mode, model-routing, enterprise, ground-truth]
source: https://docs.factory.ai/welcome
authors: [Factory]
year: 2026
category: method
---

# Factory AI — Droid 중심 "AI-native 개발 플랫폼" (vault 아키텍처의 업계 수렴 ground-truth #4)

*Factory · 상용 플랫폼 · GPT breadth 외주(2026-06-16) → ③Gate grounding PASS(공식 docs 인덱스 8개념 확인)*

Factory AI는 Droid(코딩 에이전트)에게 refactor·incident response·migration 같은 *전체 개발 작업*을 위임하는 상용 플랫폼이다. Cursor류 "IDE 보조"가 아니라 **agent runtime + orchestration + enterprise governance**로 분류된다. 학습 가치의 본체는 *새 개념*이 아니라 — **펀딩받은 상용 플랫폼이 독립적으로 vault와 거의 동일한 아키텍처에 도달했다**는 외부 확증이다([The New SDLC With Vibe Coding (Google / Addy Osmani)](google-new-sdlc-vibe-coding.md)·[goose — 모델독립 에이전트 하네스 (production 오픈소스 정본)](../techniques/goose-agent-harness.md)·[opencode — 모델독립 에이전트 하네스 #2 (컨텍스트 조립 *엄밀성* 정본)](../techniques/opencode-agent-harness.md)에 이은 #4).

---

## 한 줄 요약

> "Agent = Model + Harness + Spec-gate + AGENTS.md + 모델 라우팅 + headless-opt-in" 스택을 상용 제품으로 패키징한 사례 — vault가 직접 도달한 구조의 업계 수렴 증거.

---

## 확증 매핑 — Factory 개념 → vault 기존 자산 (핵심, 8축)

> 잠금 개념은 *재서술 X, 링크만*(#3 Surgical). 각 줄 = "Factory가 한 것 → vault에 이미 있는 것".

1. **Factory model / Droid runtime**(코드가 아니라 *시스템*을 위임) → [The New SDLC With Vibe Coding (Google / Addy Osmani)](google-new-sdlc-vibe-coding.md) "Factory model" + agent-harness. Agent=Model+Harness 명제 확증.
2. **Specification Mode**(자연어 → spec+plan, 승인 전 코드변경 차단, 분석은 read-only, Shift+Tab 수동) → [Forge Spec-Gate (why-was-fable-banned) — 차용 해체](forge-spec-gate.md) + 헌법 HITL 스테이징 + Plan mode. *거의 동일물*.
3. **AGENTS.md**(briefing packet; 발견순서 `./AGENTS.md`→parent→subfolder→`~/.factory/AGENTS.md`, 가까운 파일 우선) → vault 전체 AGENTS.md 컨벤션 + 외부 코딩 에이전트 Lookup Protocol. *같은 업계 표준에 수렴*.
4. **BYOK + Mixed Models**(planning·validation=강한 모델, worker=가벼운 모델; API키 local 보관·Factory 서버 미업로드) → CLAUDE.md §4 Intelligent Model Routing(2026-06-16 merged). 확증.
5. **Droid Exec**(headless one-shot, 기본 read-only/spec-mode, mutation은 `--auto low|medium|high` opt-in) → [Forge Spec-Gate (why-was-fable-banned) — 차용 해체](forge-spec-gate.md) worktree-accept + 헌법 Dual-Track 절대룰 #6. *"기본 read-only·명시 opt-in" 안전철학* 확증.
6. **Factory Missions**(features/milestones 분해, Mission Control 오케스트레이션, worker/validator 실행) → dispatch-builder + agent-harness-rsi-brief ②Apply + done-gate + Dual-Track. 오케스트레이션 확증.
7. **MCP**(registry 40+ 서버·http/sse/stdio) → vault codegraph MCP·graphify 운용 + CLAUDE.md MCP 정책. 인접.
8. **Enterprise**(cloud/hybrid/airgapped 배포·hierarchical settings·allow-deny·Droid Shield(시크릿 탐지)·hooks·sandbox·OTEL) → 에이전트 거버넌스·`agy --sandbox` 규율·HITL·헌법 §권한 분리. 확증.

---

## 진짜 새것 (vault에 없던 것 — 3종)

1. **Missions 비용 휴리스틱** — `total runs ≈ #features + 2 × #milestones`. 오케스트레이션 *예산 추정*의 구체 공식. dispatch/②Apply 비용 견적에 차용 가능(소형 휴리스틱).
2. **Droid 표면 taxonomy** — 하나의 에이전트가 *CLI · Factory App · Droid Exec(CI/CD) · Droid Computers* 여러 표면에서 동작. = "하네스는 같고 실행 표면만 갈아끼움"의 상용 구현(어댑터 패턴 [Ponytail — "게으른 시니어 개발자"를 13개 코딩 에이전트에 이식하는 portable behavioral skill](ponytail.md) 13에이전트와 동형).
3. **상용 거버넌스 패키징** — Droid Shield / Droid Shield Plus(Palo Alto 연동 AI 보안 스캔) / fully airgapped(EU 배포). 우리 거버넌스가 *문서·규율* 레벨이라면 이쪽은 *제품 기능*화.

---

## 내 생각 — Sub-brain 관점

### 직접적 연결: **높음** (단, 신개념 흡수 아닌 *검증* 성격)
Factory는 vault 북극성("진화하는 AI 운영 토대")의 **외부 검증 표본**이다. 의미는 두 겹:
- **수렴 = 정당화**: vault가 spec-gate·AGENTS.md·모델 라우팅·worktree-accept를 *직접 시행착오로* 도달했는데, 펀딩받은 상용 플랫폼이 같은 스택을 제품화했다 = 우리 선택이 업계 표준과 일치(고립된 자기만족 아님).
- **격차 = 다음 후보**: Factory가 *제품 기능*으로 가진 것(Mission Control 시각 오케스트레이션·Droid Shield·airgapped) 중 vault에 *문서 규율로만* 있는 것은, 필요 시 어디를 자동화·강화할지의 지도.

### 개념적 수확
- **③Gate 외부 AI 산출 검증의 모범 사례** — GPT가 "확실/불확실"을 분리 표기(BYOK local 보관=확실, 성능 우위=불확실 독립검증 필요). external-ai-grant-hardcontract·`verifier-claims-need-regate` 정합. 흡수 시 *불확실 항목 격상 금지* 유지.
- **headless opt-in 등급화**(`--auto low/medium/high`)가 우리 Dual-Track worktree-accept보다 *세분*. 외부 Codex 자동실행 권한을 3단으로 나누는 발상 = 백로그 후보.

### 한계·미검증 (격상 금지)
- 실제 품질·비용·안정성·벤치 우위 = 공식 문서만으론 확정 불가(GPT 명시). Factory vs Cursor/Claude Code/Devin 성능 비교 = 독립 검증 필요.
- Missions = research preview 성격(open questions 공식 문서에 명시). 비용 휴리스틱도 *추정*.
- 학술 논문/DOI = 문서 내 확인 안 됨(벤치는 자체 Agent Arena·Legacy-Bench·Terminal Bench).

---

## 반영 backlog (학습→반영 루프)

- 🟡 **(backlog) Droid Exec `--auto` 3단 등급 → Dual-Track worktree-accept 권한 세분화 검토** — 현 worktree-accept는 binary, Factory는 low/medium/high. 헌법 터치라 HITL 스테이징.
- ✅ **Missions 비용 휴리스틱 → dispatch 예산 견적 라인 반영** (2026-06-17) — `runs ≈ #features + 2 × #milestones` 를 dispatch-builder 슬롯6(Phase 분할)에 한 줄 추가. 외주 종량 비용 + 스코프 감각용.
- ✅ **순수 확증분**(spec-gate·AGENTS.md·모델 라우팅·headless opt-in)은 이미 vault 보유 → 흡수만, 재서술 X(#3).

---

## 다음 학습 후보

- **Devin (Cognition)** — Factory와 동급 "자율 SWE 에이전트" 직접 경쟁자. 표면 taxonomy·오케스트레이션 대조로 업계 수렴 vs 분기 파악.
- **Factory Missions 심화(직접 사용 시)** — worker/validator 실행 로그를 ②Apply 측정 매트릭스의 *상용 레퍼런스*로(비용 휴리스틱 실측).
- **Droid Shield / 시크릿 탐지** — 우리 거버넌스의 *제품화* 갭. clean-room·secret 탐지 자동화 필요 시 진입점.

---

## 연결된 페이지

- [The New SDLC With Vibe Coding (Google / Addy Osmani)](google-new-sdlc-vibe-coding.md) · [goose — 모델독립 에이전트 하네스 (production 오픈소스 정본)](../techniques/goose-agent-harness.md) · [opencode — 모델독립 에이전트 하네스 #2 (컨텍스트 조립 *엄밀성* 정본)](../techniques/opencode-agent-harness.md) · agent-harness (Agent=Model+Harness ground-truth 군)
- [Forge Spec-Gate (why-was-fable-banned) — 차용 해체](forge-spec-gate.md) (Specification Mode = spec-gate) · dispatch-builder · agent-harness-rsi-brief (Missions = 오케스트레이션/②Apply)
- [Ponytail — "게으른 시니어 개발자"를 13개 코딩 에이전트에 이식하는 portable behavioral skill](ponytail.md) (어댑터/표면 다중화 동형) · external-ai-grant-hardcontract (③Gate 외부산출 검증)
