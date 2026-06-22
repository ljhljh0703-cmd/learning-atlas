---
created: 2026-05-03
updated: 2026-05-03
type: learning
tags: [browser-use, agent-harness, claude-code, codex, CDP, self-healing, coordinate-clicks]
source: https://github.com/browser-use/browser-harness
category: method
---

# browser-harness — LLM 에 Chrome CDP 직결, 에이전트가 스스로 자라는 thin harness

*browser-use 팀, Python, **9.7k★ / 897 fork** (17일 만에, created 2026-04-17), MIT*

`agent-workspace/agent_helpers.py` 에 helper 가 없으면 **agent 가 직접 그 helper 를 작성** 하면서 작업을 마친다. 다음 실행에선 그 helper 가 이미 있다. **harness 가 매 run 마다 자기 자신을 개선**.

> 정직한 판단: AI NPC blueprint 매핑 X. **직접 적용 — 중간 (작가 일상 web 자동화)**. 시급성 — 중기. 메타 패턴 수확 — **높음** (self-healing minimal core, "agent 가 도구를 쓰면서 도구를 키운다").

---

## 한 줄 요약

> 약 1,000 줄 핵심 + Chrome CDP 직결 websocket 1개. "manager layer / retry framework / config system 추가 금지" — 빈 자리는 *에이전트가 매 run 마다 직접 메운다*.

---

## 핵심 개념

### 1. The Bitter Lesson of Agent Harnesses (저자 명시 철학)

블로그 [The Bitter Lesson of Agent Harnesses](https://browser-use.com/posts/bitter-lesson-agent-harnesses) 의 주장:
- 정교한 harness (DOM parser, retry framework, session manager, action validator) = LLM 능력 향상에 *방해*
- "model 이 이 정도면 알아서 할 수 있는데, harness 가 자기 방식 강요" → Sutton Bitter Lesson 의 agent 버전
- 결론: **harness 는 thin 해야 한다, model 이 자라면 harness 도 같이 자라야 한다 — 자동으로**

→ [Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](karpathy-guidelines.md) #2 (Simplicity First) + #3 (Surgical Changes) 의 *system architecture* 버전.

### 2. Self-healing helper pattern

```
agent: "파일 업로드 필요"
   ↓
agent_helpers.py 점검 → upload helper 없음
   ↓
agent 가 helper 직접 작성 (PR 아님, 본인 workspace 에)
   ↓
업로드 성공 → 다음 run 부터 helper 존재
```

핵심 디자인: **core 는 protected, agent_workspace 는 free-edit**.
- `src/browser_harness/` — core, agent 가 건드리지 않음
- `agent-workspace/agent_helpers.py` — task 별 추가 helper, agent free-edit
- `agent-workspace/domain-skills/<host>/` — site 별 playbook, agent 가 *발견 시 PR*

→ [Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](karpathy-guidelines.md) 의 "Surgical Changes" 와 정합 — agent 가 본 task 외엔 손대지 않게 영역 분리.

### 3. Coordinate clicks 기본, DOM 은 fallback

```python
capture_screenshot()      # 화면 캡쳐
# pixel 직접 읽기
click_at_xy(x, y)         # 좌표 클릭 (CDP Input.dispatchMouseEvent)
capture_screenshot()      # 검증
```

**Compositor level 클릭** — iframe / Shadow DOM / cross-origin 모두 그냥 통과 (Playwright 의 `getBoundingClientRect` + selector 헌트 불필요). DOM 은 hidden input / 0×0 node 같은 *visible geometry 없는 target* 에만 사용.

→ [video-use — 영상을 *읽는* 에이전트 스킬](video-use.md) 의 "transcript 가 primary, visual 은 on-demand" 와 동형 — primary surface 결정의 메타 패턴.

### 4. Domain skills (agent-generated, not human-authored)

```
BH_DOMAIN_SKILLS=1 → goto_url() 가 host 별 skill 파일 자동 surface
```

저자 *명시 강조*:
> "Skills are written by the harness, not by you. **Don't hand-author skill files** — agent-generated ones reflect what actually works in the browser."

`domain-skills/github/`, `domain-skills/linkedin/`, `domain-skills/amazon/` 등이 *작동하는 selector / flow / edge case* 의 **자동 archive**. 사람이 쓰면 stale, agent 가 쓰면 fresh.

### 5. 4 core file 만

```
install.md          - 첫 설치
SKILL.md            - 일상 사용
src/browser_harness - core (protected)
agent-workspace/    - free-edit zone
```

`run.py` 는 "no argparse, no subcommands, no config system" 명시. ~1k LOC 전체.

### 6. Browser Use Cloud 통합 (sub-agent / parallel / headless)

```python
start_remote_daemon("work")                            # clean cloud browser
start_remote_daemon("work", profileName="my-work")     # 로그인 상태 재사용
start_remote_daemon("work", proxyCountryCode="de")     # DE proxy
```

3 concurrent browsers free tier. profileId 로 cookies sync 만 (localStorage·extension·history X).

### 7. 작가가 알아야 할 gotchas

- 첫 navigation 은 `new_tab(url)` — `goto_url()` 은 *사용자 활성 탭* 을 덮어씀
- Auth wall 만나면 즉시 "사용자에게 물어보고 멈춤" — 스크린샷에서 비밀번호 X
- 로컬 Chrome remote debugging 활성화: `chrome://inspect/#remote-debugging` 체크박스 (*Way 1*, 본인 프로필 + 매 attach 마다 popup 승인) 또는 `--remote-debugging-port=9222 --user-data-dir=<isolated path>` (*Way 2*, 격리 프로필 + popup 없음)
- Chrome 136+ 부터는 `--user-data-dir` 가 *플랫폼 default 경로* 면 silently 무시됨 — 반드시 별도 경로

---

## 기술 스택 / 사용법

```bash
# 한 줄 설치 prompt (Claude Code / Codex 어디든 paste)
"Set up https://github.com/browser-use/browser-harness for me. Read install.md and follow the steps."

# 수동
git clone https://github.com/browser-use/browser-harness ~/Developer/browser-harness
cd ~/Developer/browser-harness && uv tool install -e .
# Claude Code: ~/.claude/CLAUDE.md 에 @~/Developer/browser-harness/SKILL.md 추가
# Codex: ~/.codex/skills/browser-harness/SKILL.md 심볼릭

# 사용
browser-harness -c '
new_tab("https://docs.browser-use.com")
wait_for_load()
print(page_info())
'
```

**Python 한 줄 안에 모든 helper pre-imported** — daemon 자동 시작/관리, IPC 는 unix socket (POSIX) / TCP loopback (Windows).

---

## 내 생각 — 작가 일상 / hwigi-tower / mirofish-lab 적용 관점

### 직접 적용성: 중간 (작가 일상 web 자동화)

**즉시 가치 있는 사용처** (D-15 마감 전엔 X, 마감 후):

1. **`applications/<company>/` 자동화** — 채용 공고 사이트별 applicant tracking system (ATS) 자동 작성. supercent 같은 회사별로 `domain-skills/<company-ATS>/` 가 누적.
2. **Flick 출품 페이지 (D-15 후)** — 출품 사이트 폼 작성, GDD upload, 응답 monitoring
3. **외부 LLM 디벨롭 보조** — Gemini Web UI / Claude.ai web 직접 자동 prompt (CLI 한계 보조)
4. **자료 수집** — 게임 기사·리뷰·아카이브 (이미 [OASIS: Open Agent Social Interaction Simulations with One Million Agents](../techniques/oasis.md) 학습에 했던 작업의 *자동화* 버전)
5. **포트폴리오 사이트 운영** — 작가 향후 본인 사이트 운영 시 콘텐츠 publish 자동화

**적용 X**:
- hwigi-tower (Unity 게임) 본체 — 브라우저 작업 X
- mirofish-lab 시뮬레이션 본체 — agent simulation 이지 web 자동화 아님
- AI NPC blueprint 어떤 레이어도 매핑 X

### 개념적 수확: 높음 — Self-Healing Minimal Core 패턴

이 repo 의 *진짜* 발상:

> **"core 는 작고 protected, 빈 자리는 agent 가 매 run 마다 채운다. 자동으로 누적되는 도구는 hand-authored 도구보다 fresh."**

이 패턴은 본 위키 자체에 *이미 부분 적용* 중:
- `wiki/learnings/methods/` 에 도구 학습 archive — agent (=LLM) 가 *발견 시 archive* (작가가 hand-author X)
- `applications/<company>/strategy.md` 와 `domain-skills/<host>/` 가 동형
- `wiki/projects/hwiglija-tower-design-journal.md` 는 결정의 *왜* archive — agent-generated archive

**즉시 흡수 가능 메타 룰** (CLAUDE.md 보강 후보):
> "Skills/notes are written by the agent during real work, not hand-authored ahead of time. Hand-authored 자료는 stale; agent-generated archive 는 fresh."

이건 본 위키 §"Ingest" 워크플로우와 정합 — 그러나 *명시화 안 됨*. 명시화 가치 있음.

### vs [video-use — 영상을 *읽는* 에이전트 스킬](video-use.md) — browser-use 가족의 두 instance

| 도구 | Surface | 메타 패턴 |
|------|---------|-----------|
| browser-use (본체) | DOM | structured perception |
| **browser-harness** | **CDP + screenshot + agent-grown helpers** | **self-healing minimal core** |
| video-use | transcript + on-demand timeline_view | structured perception |

세 도구 모두 [Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](karpathy-guidelines.md) 4원칙의 *system architecture* 구현체. 가족 매트릭스 완성:

| 문제 | 해법 |
|------|------|
| LLM 이 raw modality 보면 토큰 폭증 | structured surface (browser-use, video-use) |
| harness 가 너무 정교하면 LLM 진화에 방해 | thin core + agent 가 채움 (browser-harness) |
| harness 가 너무 thin 하면 매번 재발견 | site-specific skill 자동 누적 (browser-harness domain-skills) |

### vs [Claude Code Game Studios — Claude Code 를 게임 스튜디오로 변환하는 49 agent 템플릿](claude-code-game-studios.md) — 정반대 철학

| 차원 | Game Studios | browser-harness |
|------|--------------|-----------------|
| Agent 수 | **49** | **0 (skill 자동 생성)** |
| Hooks | 12 | 없음 (manager layer 거부) |
| Rules | 11 path-scoped | 없음 (agent 자유) |
| 철학 | 위계 + escalation | thin core + self-heal |
| 적합 | 솔로 dev 의 structure 부재 해결 | 솔로 dev 의 over-engineering 해결 |

→ 같은 모집단 (솔로 + Claude Code) 에 *정반대 처방*. 본 위키는 hwigi-tower (구조 필요) ~ web 자동화 (thin) 양 끝 둘 다 다룸. 도구는 작업 성격에 따라 선택.

### 창작자 정체성 연결

> "도구가 자기 자신을 키운다" 는 발상은 [Ouroboros — Spec-First Agent OS](ouroboros.md) 의 *5-stage evolutionary loop* 와 정확히 동족. agent 가 자기 도구를 키우는 것 = ouroboros 의 spec-first 자기 진화의 web 자동화 버전.

본 위키 자체도 같은 발상으로 운영 — *Claude 가 매 학습 archive 시 schema 발견 시 CLAUDE.md 업데이트* 흐름이 self-healing wiki 와 동형. 작가가 schema 를 미리 다 정해놓지 않음.

---

## 한계와 회의

1. **9.7k★/17일 = hype** — 검증 시간 부족. browser-use 본체 (별도 repo) 의 sub-set 이라 상당 코드는 해당 검증을 상속하지만, harness 자체 패턴은 갓 출시
2. **agent_helpers.py 의 *축적된 부채*** — agent 가 매 run 마다 helper 추가 → 6개월 후 spaghetti? *self-healing* 이 *self-cleaning* 까지는 X. 주기적 수동 lint 필요 가능
3. **coordinate clicks 의 한계** — 화면 해상도 의존, layout 변화에 약함. 저자도 명시: "pixel coordinates 는 domain-skills 에 적지 마라" (skill 은 *durable shape* 만)
4. **로컬 Chrome 침투** — 작가 일상 Chrome 에 remote debugging 활성화 = 보안 surface 증가. 격리 프로필 (Way 2) 권장하지만 그러면 로그인 X
5. **"You will never use the browser again"** — 마케팅 과장. auth wall, captcha, 2FA 만나면 즉시 정지하고 사용자에게 물음. *완전 자율* 아님

---

## 다음 학습 후보

- **The Bitter Lesson of Agent Harnesses 블로그 본문** — 이 repo 의 *철학 선언* 자체. Sutton Bitter Lesson 을 agent harness 에 매핑한 논리 검토. 본 위키 [Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](karpathy-guidelines.md) / [free-claude-code — Claude Code를 대체 LLM 프로바이더로 라우팅하는 프록시](free-claude-code.md) / [Everything Claude Code (ECC) — 에이전트 harness 성능 최적화 시스템](everything-claude-code.md) 의 입장 정리에 핵심 input
- **Web Agents That Actually Learn** — 동시 게재 블로그. domain-skills 자동 누적이 *actual learning* 인가의 주장
- **browser-use (본체)** — Agentic web full agent. browser-harness 가 sub-set, 본체 비교 시 "thin vs full" 라인 구분 명확
- **Anthropic Computer Use** — 동족. Claude 가 직접 화면 보고 클릭. browser-harness 의 *core 위치* 가 어디 있는가 비교 가치
- **CDP (Chrome DevTools Protocol) 자체 spec** — 본 repo 의 *진짜 dependency*. cdp-use 라이브러리 의존만, 그 외 추가 layer X
- **OpenAI Operator** — 동족 web 자동화. browser-harness 의 "사용자 실 Chrome 직결" vs Operator 의 "cloud browser only" 비교

---

## 연결된 페이지

- [video-use — 영상을 *읽는* 에이전트 스킬](video-use.md) — browser-use 가족, structured perception 의 video 버전
- [Karpathy Guidelines — LLM 코딩 함정 4 원칙 (behavioral overlay skill)](karpathy-guidelines.md) — Simplicity First + Surgical Changes 의 system architecture 구현체
- [Ouroboros — Spec-First Agent OS](ouroboros.md) — self-evolving 도구의 동족
- [Claude Code Game Studios — Claude Code 를 게임 스튜디오로 변환하는 49 agent 템플릿](claude-code-game-studios.md) — 정반대 철학 (49 agent vs 0 agent)
- [Everything Claude Code (ECC) — 에이전트 harness 성능 최적화 시스템](everything-claude-code.md) — Claude Code harness 강화 vs 약화 양 끝
- [free-claude-code — Claude Code를 대체 LLM 프로바이더로 라우팅하는 프록시](free-claude-code.md) — Claude Code 본체 라우팅
- [Autoresearch — Karpathy의 자동 연구 루프](autoresearch-karpathy.md) — 자율 루프의 동족
- [seCall — AI 에이전트 세션을 위한 로컬 퍼스트 검색 엔진](secall.md) — Sub brain 동족 도구 — agent-generated archive 발상 공유
- [CocoIndex — Incremental Data Pipeline for AI Agents](../techniques/cocoindex.md) — Δ-only ingestion, *agent 가 도구를 쓰면서 archive 가 쌓임* 동형
