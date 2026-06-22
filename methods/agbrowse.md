---
created: 2026-06-19
updated: 2026-06-19
type: learning
tags: [browser-automation, cdp, web-ai, harness, cli, agent-tool]
source: https://github.com/lidge-jun/agbrowse
authors: [lidge-jun]
year: 2026
category: method
---

# agbrowse

Chrome/CDP 로컬 브라우저 자동화 CLI. "serverless extraction of the cli-jaw browser workflow"라는 자기 소개처럼, [Jawcode (jwc) — 코딩 에이전트 하네스 (IPABCD)](../techniques/jawcode.md) 작자(lidge-jun)가 cli-jaw에서 브라우저 계층만 독립시킨 툴이다. 85 stars, MIT. Node.js 18+, playwright-core 의존.

**분류 판단**: 툴/워크플로우 → `methods/`. 아키텍처 패턴도 있지만 "어떻게 일하는가"가 핵심이라 methods.

---

## 핵심 구조

```
bin/agbrowse.mjs
└─ skills/browser/browser.mjs        ← browser primitive (snapshot, click, type…)
   ├─ browser-core.mjs
   ├─ tab-manager.mjs / tab-lifecycle.mjs
   ├─ adaptive-fetch/ (14 modules)
   └─ web-ai/cli.mjs                 ← AI 웹 UI 자동화
      ├─ providers/chatgpt.mjs
      ├─ providers/gemini-live.mjs
      └─ providers/grok-live.mjs
```

각 agbrowse 명령 = 단기 Node 프로세스. 공유 Chrome에 CDP 재접속해서 작업하고 종료. **상시 서버 불필요** (MCP token tax 0).

`structure/` 폴더 = 문서 SSOT. `CAPABILITY_TRUTH_TABLE.md`, `release_gates.md`, `runtime_contracts.md`, `phase_status.md`가 코드·문서 drift 방지 게이트.

---

## Web AI 자동화 패턴 ★ (가장 중요한 delta)

ChatGPT / Gemini / Grok 웹 UI를 CLI로 구동해 **API 없이 프리미엄 모델** 접근:

```bash
agbrowse web-ai query \
  --vendor chatgpt --model pro \
  --inline-only \
  --prompt "..."
```

**모델 앨리어스** (stable, UI 변경 흡수):
- ChatGPT: `instant`, `thinking/think`, `pro`
- Gemini: `flash-lite/fast`, `flash`, `pro`, `deepthink`
- Grok: `auto`, `fast/quick`, `expert/thinking`, `heavy`, `grok-4.3`

### send + poll 분리 (fire-and-forget)

긴 Pro/Heavy 세션은 블로킹 금지 → `send` → 별도 프로세스 `watch`:

```bash
SID=$(agbrowse web-ai send --vendor chatgpt --model pro ... | jq -r .sessionId)
agbrowse web-ai watch --session "$SID" --json  # 별도 프로세스
```

**agent runtime별 권장 background watch 패턴:**

| 런타임 | 패턴 |
|--------|------|
| Claude Code | `Bash run_in_background: true` → 완료 시 알림으로 재활성 |
| Cursor | 백그라운드 셸 + `Await` 도구로 `watch.complete` 대기 |
| Codex | 외부 watcher + 완료 시 `codex exec resume` 호출 |
| cli-jaw | `cli-jaw bgtask add --preset web-ai --session "$SID"` 등록 후 턴 종료 |

### ULID 세션 퍼시스턴스

세션은 `~/.browser-agent/web-ai-sessions.json`에 저장 → 프로세스 종료·OS sleep·Bash 타임아웃에도 생존. `--session <SID>`로 재개.

- `sessions show <SID>` = read-only, 절대 상태 전진 안 함
- `watch`/`poll`만 DOM을 구동해 terminal status로 이행
- per-session watcher lock → dead PID 자동 회수 → 재실행 안전

### 탭 격리 & 풀링

기본 = send마다 새 탭 (컨텍스트 오염 방지). `--reuse-tab`으로 단일탭 레거시 모드. 완료된 탭은 vendor별 pool(TTL 15분, 최대 3개)에 보관해 재사용.

2+ 세션 활성 시 `session.target-ambiguous` fail-closed → `--session <id>` 재실행.

---

## Adaptive URL Fetch 6단계 에스컬레이션

`agbrowse fetch <url>` 내부 실행 순서:

1. **공개 엔드포인트 + direct fetch** — GitHub/Reddit/HN/arXiv/npm/PyPI 등 known API resolver, direct HTTP
2. **서드파티 리더** — Jina (`--allow-third-party-reader` 명시 opt-in)
3. **isolated Chrome render** — 새 프로필 + Defuddle 추출 + network API JSON discovery
4. **user session** — 인증된 사용자 브라우저 (`--browser-session user`, explicit opt-in)
5. **human-in-the-loop** — 챌린지 인간 해결 (`--browser-session interactive`, 5분 타임아웃)

각 단계 후 **content scoring**으로 에스컬레이션 필요성 판단. WAF(Cloudflare/Akamai/AWS WAF/DataDome/PerimeterX) 자동 감지해 챌린지 분류.

**핵심 플래그:**
- `--browser never/auto/required`
- `--browser-session none/isolated/existing/user/interactive`
- `--identity auto/minimal/chrome` (auto/chrome = 브라우저급 헤더)
- `--allow-third-party-reader`

**에이전트 워크플로우**: search tool → 후보 URL → `fetch <url> --json --trace --browser never` → `verdict` 확인 → 필요 시 에스컬레이션

---

## Preflight-Before-Mutation 계약

```bash
agbrowse web-ai status --vendor chatgpt --json   # mutation 전 항상 먼저
```

`capabilities[]` 반환: `capabilityId`, `state(ok/warn/fail/unknown)`, `evidence`, `next(retry hint)`. 지원 안 하는 vendor/모델은 브라우저 mutation 전 fail.

→ agent-harness H-01 (preflight) 패턴과 동일 철학.

---

## Content Boundary & Source Audit

- 웹페이지/컨텍스트 패키지 콘텐츠 = **untrusted data** (명시 표기)
- `--require-source-audit` → 인라인 출처 없는 완료 답변 fail-closed
- Grok 컨텍스트 패키지 = 기본 fail-closed (`--allow-grok-context-pack` 명시 override)
- `--unsafe-allow evaluate` 없으면 evaluate 명령 차단

→ [검증자의 주장도 환각이다 — 강한 주장은 1차 출처로 재-Gate](verifier-claims-need-regate.md) 철학과 수렴 (provider DOM을 untrusted data로 취급).

---

## Structure SSOT 패턴

`structure/` 폴더 = 이 프로젝트의 claim 진실 소스:

| 파일 | 역할 |
|------|------|
| `CAPABILITY_TRUTH_TABLE.md` | Phase 22 캐퍼빌리티 진실 테이블 (`gate:truth-table-fresh`로 7일 freshness 강제) |
| `release_gates.md` | named gate 정의 (typecheck, smoke:bins, test:mcp, gate:all 등) |
| `runtime_contracts.md` | session/tab/policy/trace 런타임 계약 |
| `phase_status.md` | Phase 11+ 상태 진실 테이블 |
| `stability-upgrade/01_operational_weakness_register.md` | 실제 운영 취약점 레지스터 |

`gate:no-cloud-claims` = README의 hosted/stealth/CAPTCHA bypass 주장 CI 차단.
`gate:truth-table-fresh` = 7일 이내 갱신 강제.

**변경 계약**: runtime contract 변경 시 test + docs + skill + cli-jaw mirror 동시 업데이트 의무.

---

## Vision-Click

DOM ref 없는 Canvas/WebGL/Shadow DOM → 스크린샷 후 좌표 클릭:

```bash
agbrowse-vision-click "the visible Submit button"
```

DPR 보정 포함. `agbrowse snapshot` 실패 시, `screenshot`으로 시각 검사 후 vision-click 사용 (Recovery 6번째 단계).

---

## ChatGPT Code Mode (beta)

`web-ai code` = ChatGPT 웹 샌드박스에서 코드 생성 → `/mnt/data/*.zip` 아티팩트 headless 회수:

```bash
agbrowse web-ai code --vendor chatgpt --model thinking --prompt "Flask MVP" --output-zip ./result.zip
```

- 모든 zip에 `PLAN.md`/`00_plan.md` 필수 (없으면 retrieval fail)
- 첫 턴에만 `gpt-dev-agent-context.zip` 자동 첨부 (이후 continuation은 생략)
- multi-zip: `--multi-zip --output-dir ./artifacts`
- ChatGPT-only, cli-jaw 패리티 없음

---

## Research Planning 워크플로우

```bash
agbrowse research plan --query "질문" --json        # 쿼리 → atomicQueries 분해
agbrowse research normalize-results --backend tavily ...
agbrowse research enrich-fetch --plan ... --results ...  # adaptive fetch (browser never 기본)
agbrowse research browse-plan --plan ... --enrichment ... # dynamic/Naver 후보 → 브라우저 커맨드 생성
```

한국어 전용 경로 (`search-research/korean-routes.mjs`) 내장. browse-plan은 Chrome 실행 안 함 — 명령 문자열만 생성.

---

## 기존 vault와의 관계

- [Jawcode (jwc) — 코딩 에이전트 하네스 (IPABCD)](../techniques/jawcode.md) — 동일 작자. cli-jaw에서 브라우저 계층 분리. IPABCD 하네스와 이 browser skill이 같은 생태계.
- [Scrapling — 차단·동적 페이지를 뚫는 적응형 스크래핑 (on-demand escalation 도구)](scrapling.md) — 브라우저 자동화 에스컬레이션 (Cloudflare 특화). agbrowse fetch는 6단계 계층구조 + content scorer.
- research-relay — web-ai query로 GPT 외주 자동화 가능성. 현재는 수동 copy-paste 방식인데, agbrowse가 그 마찰을 없애는 구조.
- agent-harness — preflight-before-mutation, content boundary 계약, runtime분기 패턴 모두 하네스 패턴 인스턴스.

---

## 학습→반영 루프

**반영처 3곳:**

1. **research-relay** — "web-ai query로 외주 자동화 가능성" 메모 추가 (felt-need 검증 후 도입 여부 결정)
2. **agent-harness** — background watch agent runtime 분기표를 H-14 또는 신규 H-항목 후보로 검토
3. **[Scrapling — 차단·동적 페이지를 뚫는 적응형 스크래핑 (on-demand escalation 도구)](scrapling.md) 에스컬레이션 정책** — agbrowse 6단계 계층구조(content scoring + fail-closed)를 현행 escalation 정책에 비교·통합 가능성

**도입 가드**: cold-verify 규칙상 설치 전 felt-need 검증 필요. 현재 research-relay 수동 방식이 실제 마찰인지 확인 후 결정.

---

## 안전 모델 요약

| 허용 | 금지 |
|------|------|
| browser-grade 헤더 | CAPTCHA 자동 해결 |
| 사용자 세션 (explicit opt-in) | credential stuffing |
| human-in-the-loop | stealth/anti-detection |
| DNS rebinding 가드 | private/loopback redirect |
