---
created: 2026-05-03
updated: 2026-05-03
type: learning
tags: [AI, claude-code, video, agent-skill, browser-use, structured-perception]
source: https://github.com/browser-use/video-use
category: method
---

# video-use — 영상을 *읽는* 에이전트 스킬

*browser-use 팀 (Magnus Müller 등), 100% OSS, Python, 6.1k★ / 854 fork (2026-05-03)*

browser-use 가 LLM 에 스크린샷이 아니라 구조화된 DOM 을 주듯, video-use 는 영상을 **transcript + on-demand visual** 로 환원해 LLM 이 word-boundary 정밀도로 컷 편집하게 만드는 Claude Code/Codex 스킬.

> 정직한 판단: AI NPC blueprint 5 레이어 — **해당 없음**. 직접 적용 — **개념 수확** (영상 편집 도구로의 직접 사용은 장기 옵션). 메타 패턴 — **높음** (perception 압축 발상).

---

## 한 줄 요약

> "LLM 은 영상을 *보지* 않고 *읽는다*" — ElevenLabs Scribe 한 번으로 12KB 텍스트 만들고, 시각 정보는 결정 지점에서만 timeline_view PNG 로 호출.

---

## 핵심 개념

### 1. Two-layer perception

- **Layer 1 (always loaded)** — `takes_packed.md` ~12KB. 단어 단위 timestamp + speaker diarization + audio events (`(laughter)`).
- **Layer 2 (on demand)** — `timeline_view` 가 filmstrip + waveform + word label PNG 합성. 모호한 pause, retake 비교, cut sanity check 시에만 호출.

> Naive: 30,000 frame × 1,500 token = **45M token noise**.
> video-use: **12KB text + 몇 장의 PNG**.

### 2. Pipeline + self-eval loop

```
Transcribe → Pack → LLM Reasons → EDL → Render → Self-Eval
                                                    │
                                                    └─ issue? fix + re-render (max 3)
```

self-eval 단계에서 *렌더된 결과* 의 모든 컷 경계에 timeline_view 다시 돌려 visual jump / audio pop / 숨겨진 자막 잡음. preview 는 통과 후 노출.

### 3. 12 hard rules + artistic freedom

production-correctness (30ms audio fade, 컷 경계 word boundary 등) 12 개는 비협상. 그 외 taste 는 자유. SKILL.md 가 본체.

### 4. Sub-agent 병렬

Manim / Remotion / PIL 애니메이션 오버레이는 *하나당 sub-agent* 병렬 spawn. 영상 내 N 개 애니메이션 = N 개 동시 작업.

### 5. Session 메모리

`project.md` 가 세션 간 컨텍스트 보존. "다음 주 세션이 이번 주 결정 이어 받기."

---

## 기술 스택 / 사용법

```bash
# Setup prompt 한 줄 — agent 가 알아서 clone/symlink/uv sync/ffmpeg/ELEVENLABS_API_KEY 확인
"Set up https://github.com/browser-use/video-use for me. Read install.md..."

# 사용
cd /path/to/videos && claude
> edit these into a launch video
# → 인벤토리 → 전략 제안 → OK 받고 → edit/final.mp4
```

스택: Python (uv), ffmpeg (필수), yt-dlp (선택), ElevenLabs Scribe (필수, transcription), Manim/Remotion/PIL (선택).

---

## 내 생각 — AI NPC 관점

### 직접적 연결: 낮음

NPC blueprint 5 레이어 어느 곳에도 영상 perception 은 없음. 억지 매핑 금지.

### 개념적 수확: 높음 — *Structured Perception Reduction*

이게 진짜 수확. browser-use(DOM) → video-use(transcript+timeline_view) 는 동일 발상의 두 instance:

> **"raw modality 를 LLM 이 token-효율로 *읽을 수* 있는 구조로 환원하고, 시각 detail 은 결정 지점에서만 on-demand 호출."**

이 메타 패턴은 [Pattern: Visual Anchor Consistency (비주얼 앵커 일관성)](prompt-pattern-visual-anchor.md) 의 더 일반화된 형태. NPC 게임 적용 가능 후보:

- **게임 상태 perception** — Unity 화면을 raw frame 으로 LLM 에 보내는 게 아니라, scene graph + 핵심 entity 좌표 + 최근 이벤트 ledger 를 12KB packed text 로. visual sanity 는 결정 시점에만 screenshot.
- **NPC 의 환경 인지** — Generative Agents ([Generative Agents (Park et al. 2023) — AI NPC의 성경](../techniques/generative-agents.md)) 의 memory stream 은 이미 이 발상의 절반. video-use 는 *현재 인지* 에도 같은 압축 적용.
- **시뮬레이션 디버깅** — mirofish-lab / [OASIS: Open Agent Social Interaction Simulations with One Million Agents](../techniques/oasis.md) 의 1M agent 트레이스 분석 시 raw timeline 을 packed.md 형태로 환원하고 anomaly 만 visual zoom.

### 블루프린트 연결

- 직접 레이어 매핑 X.
- *cross-cut* 메타 패턴: Layer 1-5 모두에서 "perception input → packed text + on-demand visual" 원칙 채택 가능.

### 창작자 정체성과의 연결

[Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](karpathy-guidelines.md) #2 (Simplicity First) 의 방법론적 구현 사례. "raw 던지지 말고 LLM 이 읽을 수 있는 형태로 환원" = 토큰 효율의 정수. 본 위키 자체가 같은 발상 (raw 일기 → wiki schema).

또한 영상 콘텐츠 제작 (mirofish-lab 시뮬레이션 결과 다큐, hwigi-tower 트레일러) **장기 옵션** 으로 보관. 출시 전후 마케팅 영상 self-edit 후보.

---

## 자매 도구 비교

| 도구 | Surface | 결정 단위 | 우리 적용 |
|------|---------|----------|----------|
| browser-use | DOM 텍스트 | element id | 없음 (웹 자동화 X) |
| video-use | transcript + timeline_view | word boundary | 마케팅 영상 (장기) |
| [CocoIndex — Incremental Data Pipeline for AI Agents](../techniques/cocoindex.md) | Δ-only data graph | source change | 위키 자동 ingestion (중기) |
| [seCall — AI 에이전트 세션을 위한 로컬 퍼스트 검색 엔진](secall.md) | hybrid search | session token | 본 Sub brain 동족 (사용 중) |

공통 발상: **agent 가 *읽을 수 있는 surface* 를 먼저 만들고 raw 는 on-demand**.

---

## 자매 primitive — claude-real-video (영상 intake 전처리기)

*HUANGCHIHHUNGLeo/claude-real-video, MIT, commit `2675da2` — Codex ③Gate PASS 2026-07-06(SHA 10/10).*

video-use 가 *읽기/편집* surface 라면, claude-real-video 는 그 앞단 **intake primitive** — 영상을 LLM 이 볼 evidence packet 으로 환원. 세 도구가 "읽기(video-use) / 만들기([광고·영상 제작 파이프라인 (실전)](../techniques/ad-video-production-pipeline.md)) / 흡수(claude-real-video)" 3분할.

- **메커니즘**: `ffmpeg` scene-change + density floor 로 프레임 추출 → **RGB sliding-window dedup** → `MANIFEST.txt + grids/*.jpg + 선별 프레임`(전체 frame dump 아님). smoke 실증: 4추출→3keep→1중복drop.
- **적용처**: 영상 소스 리서치·게임플레이/데모 리뷰·광고/트레일러 해체·AI NPC 플레이테스트 증거. (= video-use 의 "raw→읽을 surface" 발상을 *비주얼 증거*에 적용.)
- **과장 가드**(RETURN §6): Claude 가 영상을 네이티브로 보는 게 **아님** · OSS 는 Pro 의 camera/pacing/gesture/emotion 분석 미구현 · manifest 에 per-frame timestamp 없음(skill 문구와 불일치) · rerun 이 output 덮어쓰지 않음 · `--kb` 는 manifest 저장이지 LLM 의미분석 아님 · `_run()` returncode 미검증 · 테스트 없음 · **`--kb` 를 vault 로 기본 지정 금지**.
- **skill 후보** `video-source-intake-crv` = **park**(실제 영상 intake 1회 입증 후 — RETURN 도 동의).

---

## 열린 질문

- Layer 1 packed.md 의 ~12KB 한계는 영상 길이 (40초 sample) 기준. 1시간 영상 = 1MB+ 가 되면 hierarchical pack 필요 — 어떻게 처리하나? ([Microsoft GraphRAG — Query-Focused Summarization on Narrative Private Data](../techniques/graphrag.md) community summary 와 동형)
- self-eval 의 timeline_view 통과 기준은 LLM judge. 12 hard rule 외 taste 영역 self-eval 일관성은? ([Pattern: Multi-Agent Audit (병렬 위임 감사)](prompt-pattern-multi-agent-audit.md) 동원 가능)
- Manim sub-agent 병렬 spawn 의 race / 일관성 처리 (스타일 공유) 는 어떻게?

---

## 다음 학습 후보

- **browser-use 본체** — 동일 발상의 *원형*. DOM packing 구체. video-use 의 부모.
- **ElevenLabs Scribe API** — word-level timestamp + diarization + audio events. transcript-as-surface 구현 표준.
- **Remotion** — React 로 비디오. video-use 의 애니메이션 backend. 장기 마케팅 영상 자체 제작 시 직접 사용 후보.
- **video-as-DOM 일반화** — 게임 화면 / 시뮬레이션 trace 도 동일 추상으로 묶을 수 있는가 (NPC harness perception layer 설계 candidate)

---

## 연결된 페이지

- [Pattern: Visual Anchor Consistency (비주얼 앵커 일관성)](prompt-pattern-visual-anchor.md) — visual 을 token-효율 anchor 로 쓰는 모 패턴
- [Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](karpathy-guidelines.md) — Simplicity First 의 perception 버전
- [Generative Agents (Park et al. 2023) — AI NPC의 성경](../techniques/generative-agents.md) — memory stream 압축의 NPC 적용
- [CocoIndex — Incremental Data Pipeline for AI Agents](../techniques/cocoindex.md) — Δ-only ingestion 의 자매 발상
- [seCall — AI 에이전트 세션을 위한 로컬 퍼스트 검색 엔진](secall.md) — Sub brain 동족 도구 (텍스트 surface)
- [OASIS: Open Agent Social Interaction Simulations with One Million Agents](../techniques/oasis.md) / mirofish-lab — 시뮬레이션 trace 분석에 동 패턴 적용 후보
