---
created: 2026-06-28
updated: 2026-06-28
type: learning
tags: [game-dev, agentic-coding, self-evolution, harness, phaser, context-engineering, portfolio]
source: https://github.com/leigest519/OpenGame
authors: [Yilei Jiang, Jinyuan Hu, Qianyin Xiao, Xiangyu Yue]
year: 2026
category: technique
---
<!-- 한국어 원라인 헤더. OpenGame — 프롬프트→웹게임 end-to-end 에이전트 프레임워크 해체 학습 노트. -->

# OpenGame — 프롬프트 하나로 플레이 가능한 웹게임을 짓는 자가진화 에이전트 프레임워크

*CUHK MMLab (Yilei Jiang 외), arXiv 2604.18394, 2026-04-21 공개. clone 통독(1차 출처).*

> ⚠️ **임시 (provisional)** — vault Claude 가 repo clone 통독 + ③Gate(출처·환각·clean-room) 통과 흡수. 작가 컨펌 전이라 권위 인용 금지.
> ⚠️ **출처 신뢰도 분리 (cold-verify, 컷오프 2026-01 이후 자료)**: repo 코드·아키텍처·프로토콜 = 통독 확인됨. **GameCoder-27B 가중치 · OpenGame-Bench 평가 파이프라인 · "150프롬프트 SOTA" 수치 = repo 에 없음("released soon") → 논문 주장만, 미검증.** 인용 시 *논문 주장(미검증)* 표기.

---

## 한 줄 요약

> 게임 생성 에이전트의 진짜 알맹이는 모델이 아니라 **"게임을 지을수록 다음 게임이 쉬워지는" 2개 자가진화 스킬**(Template Skill + Debug Skill) — 작가의 agent-harness RSI 를 학술 프레임워크가 게임 도메인에서 독립 재현한 외부 ground-truth.

---

## 0. 정체·기술 베이스

- **목적**: 자연어 프롬프트 → 플레이 가능한 웹게임 end-to-end 생성. Phaser 렌더, Vite+TS+Tailwind 빌드.
- **런타임 베이스**: `qwen-code`(= Google Gemini CLI 포크) 위에 게임 특화 레이어를 얹음. 즉 *에이전트 하네스 자체는 기성품*, 기여는 그 위의 게임 스킬·GDD·검증.
- **모델 비종속**: 알맹이 스킬 2종은 OpenAI-호환 API(gpt-4o 등)로 돌고, LLM 키 없으면 휴리스틱 fallback. GameCoder-27B 는 *옵션 강화재*. → 모델 독립 ([goose — 모델독립 에이전트 하네스 (production 오픈소스 정본)](goose-agent-harness.md) "Agent=Model+Harness" 정합).

## 1. 핵심 기여 = Game Skill (자가진화 2종)

### 1.1 Template Skill — 진화하는 스캐폴드 라이브러리
- **M0**(장르 가정 0 인 최소 Phaser 뼈대: build·init·scene loop·config·FSM)에서 시작 → 게임 완성할 때마다 5단계 파이프라인으로 패턴 추출·누적.
- 파이프라인: **Collector**(프로젝트 파일·코드 수집) → **Classifier**(물리 레짐 분류, LLM+휴리스틱 하이브리드) → **Extractor**(룰베이스, LLM 없이 클래스계층·hook·config diff·import 추출) → **Abstractor**(LLM, 구체명→placeholder·하드코딩→config 참조) → **Merger**(라이브러리 병합).
- **패밀리는 사전정의 X, 데이터에서 창발** — gravity(횡스크롤)·top-down·grid·path-wave(타워디펜스)·ui-heavy 가 organically 등장. 아카타입 라벨 = 고정 enum 아닌 open-vocabulary `string`.
- **Stability = min(1.0, 기여프로젝트수/5)** — 5개 프로젝트 거쳐야 패밀리 완전 안정.

### 1.2 Debug Skill — 살아있는 디버그 프로토콜
- 실패 관측 시 `(error signature, root cause, verified fix)` 3종 entry 기록. 디버그 루프 = `build→test→dev` REPEAT-UNTIL-pass.
- **2종 entry**: **reactive**(에러 후 진단용 signature-match, 2단: 가중 유사도 매칭 → 미스 시 LLM fallback) / **proactive**(실행 *전* 일관성 체크).
- **자가진화 핵심**: 같은 errorCode 가 임계치(기본 **3회**) 넘으면 reactive entry 묶음 → **proactive 검증 룰로 자동 승격**(Generalizer). 디버그할수록 사전체크가 늘어 미래 루프 단축.
- 신규 패턴은 *후속 빌드 통과로 검증된 fix 만* 기록(Recorder) — 환각 fix 박제 방지. 시드 = Phaser+TS 흔한 실패 14종(reactive 7 / proactive 7) 수작업 큐레이션.

### 1.3 Dual-Knowledge GDD 아키텍처 (컨텍스트 엔지니어링)
- GDD 생성 서브모델엔 `design_rules.md`(게임디자인 지식: 무엇이 재밌나)**+** `template_api.md`(템플릿 능력: 엔진이 뭘 할 수 있나) 두 관점만 줌 → **디자인이 엔진 능력 안에 머물도록 제약**.
- 무거운 전체 템플릿 코드는 **Phase 5 구현 직전에만** 읽음. "에이전트 컨텍스트는 Phase 5 전까지 가볍게 유지" = RTK/Progressive Disclosure 의 게임판.

## 2. 7-Phase 파이프라인 (end-to-end 스파인)

`Classify → Scaffold → GDD → Assets → Config → Code → Verify`
- 각 phase 가 컨텍스트 비용 라벨(Light/Heavy)을 달고, Phase 5(코드)만 Heavy. GDD 는 6섹션 "기술명세 = 각 실행단계의 계약"(Config-First: 모든 수치는 `gameConfig.json`, 하드코딩 금지).
- 에셋은 union-type 도구 호출(background/tileset/animation/image/audio)로 생성, key 일관성(asset-pack ↔ animations ↔ code 3층)을 Pre-Build 체크리스트가 강제.

## 3. OpenGame-Bench (검증 철학) — *논문 주장, repo 미포함*
- 정적 코드 평가가 아니라 **headless 브라우저로 게임 실행 + VLM judge** 로 3축 채점: **Build Health · Visual Usability · Intent Alignment**. "interactive playability 검증은 static code 검증보다 본질적으로 어렵다"는 문제의식.

---

## 내 생각 — 작가 시스템과의 정합·시너지

### 직접적 연결: **높음** (게임 제작 + 하네스 RSI 양쪽)

이건 단순 게임 생성기가 아니라 **작가의 북극성(모델독립 하네스 RSI)을 학술 프레임워크가 게임 도메인에서 독립 재현한 외부 ground-truth**다. 핵심 정합:

1. **Debug Skill "reactive→임계3회→proactive 룰 승격"** ≈ 작가 weekly-digest Phase2 **"recurrence≥3 → 헌법 룰 승격"**. 거의 동일 메커니즘을 게임 디버그 도메인에서 자동화 = 가장 강한 정합 신호. (단 임계치 3 은 *그들 휴리스틱* — 작가 임계와 근접하나 박제 근거 아님, 과장 가드.)
2. **Template Skill 진화(M0→패밀리, stability=projects/5)** ≈ 작가 skill incubator + curator + hermes-loop ⑤Distill/⑥Curate. **단 작가 것은 수동 트리거, OpenGame 은 게임 완성마다 자동 누적** — 이게 ai-game-production-harness가 *아직 없는* 층(아래 시너지 핵심).
3. **Dual-Knowledge GDD(코드는 구현 직전에만 read)** ≈ 작가 RTK + Progressive Disclosure + token-minimal lookup 외부 확증.
4. **build→test→dev 게이트 + Pre-Build 체크리스트** ≈ 작가 ③Gate + reachability 게이트(libgdx FG dead-path 잡은 그 패턴).
5. **OpenGame-Bench 3축 + VLM "visual usability" 자동채점** ↔ 작가 fun-feedback-separate-track의 분기점 — 작가는 "재미는 수동 플레이테스트"인데 OpenGame 은 visual usability 를 VLM 으로 *자동* 채점. (단 재미≠visual usability, VLM judge 도 환각 — [검증자의 주장도 환각이다 — 강한 주장은 1차 출처로 재-Gate](../methods/verifier-claims-need-regate.md).)

### 개념적 수확 (이식 가능)
- **"게임을 지을수록 쉬워지는" 자동 누적 루프** = 작가 게임 제작이 *아직 명시 자동화 안 한* 델타. ai-game-production-harness 는 build-layer(sim→command→content→render→deploy)는 있으나 *경험 누적*은 수동. → Template/Debug Skill 패턴이 그 공백을 메움.
- **Dual-Knowledge GDD** = pre-gdd 에 `template_api`(엔진 능력) 관점 추가 → 디자인이 구현 불가능으로 새는 것 방지. 현 pre-gdd엔 이 제약 없음.

### 블루프린트 연결 / 반영처
- → game-studio-pipeline-brief (이 노트를 골격으로 기획→제작 포트폴리오 파이프라인 디벨롭. 시너지 매핑·로드맵 전문은 거기).
- → ai-game-production-harness (자가진화 층 보강 제안 — brief 에서 스테이징).
- → dispatch-builder (Debug Skill 2단 진단·verified-fix-only 기록 → done-gate 형식화 후보).

---

## 열린 질문
- VLM judge 의 "Intent Alignment" 채점이 작가 수동 재미 트랙을 *부분* 대체 가능한가, 아니면 보조에 그치나? (fun-feedback-separate-track 와 충돌 검증 필요)
- Phaser/웹게임 종속 — libgdx(Java)/canvas(TS) 라인엔 *메커니즘 개념*만 이식 가능. 코드 직차용은 X.
- GameCoder-27B 미공개 — 가중치 풀리면 로컬 특화모델 가치 재평가(현재는 gpt-4o 등 범용으로 충분히 작동).

## 다음 학습 후보
- **qwen-code / Gemini CLI 하네스** — OpenGame 이 *얹은* 베이스 런타임. 작가 하네스 비교 ground-truth.
- **Phaser 3 아키텍처** — 작가가 웹게임 라인 갈 시 (현재 libgdx/canvas 라 보류 옵션).
- **execution-grounded RL for code** — GameCoder 의 "게임 playability 를 reward 로" = [Recursive Self-Improvement — "When AI builds itself" (Anthropic)](recursive-self-improvement.md) 게임판.

## 연결된 페이지
- ai-game-production-harness · [Game Planning AI Agent — 역질문 기반 게임 기획 에이전트](../methods/game-planning-ai-agent.md) · game-design-discovery · dispatch-builder · agent-harness · [WoC 역기획 — AI 게임 생산 방법론 (10종 해체 종합)](woc-ai-gamedev-teardown.md) · [MDA 프레임워크 — Mechanics, Dynamics, Aesthetics](mda-framework.md) · fun-feedback-separate-track · game-studio-pipeline-brief
