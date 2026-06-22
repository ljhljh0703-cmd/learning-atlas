---
created: 2026-06-21
updated: 2026-06-21
type: learning
tags: [web-fetch, waf-bypass, scraping, tls-impersonation, playwright, research-relay]
source: https://github.com/fivetaku/insane-search
authors: [fivetaku]
year: 2025
category: method
---

# insane-search 해체 분석 — 포기를 모르는 웹 접근 아키텍처

> **한 줄 핵심**: HTTP 200은 성공이 아니다. 차단을 만나면 에스컬레이션하고, 방법이 없으면 설치하고 시도한다.
> **추출 목적**: 플러그인 의존 없이 이 패턴을 research-relay·clean-reader에 내재화.

---

## A. 전체 아키텍처 — 4단계 적응형 에스컬레이션

```
Phase 0: 플랫폼 공식 API (Reddit .json, HN Firebase, Twitter syndication...)
    └ 성공 → 종료 / 실패 → Phase 1

Phase 1: 경량 프로브 (병렬)
    WebFetch + Jina Reader + curl UA변형 + URL변형 + 사이드카(캐시/아카이브)
    └ 성공 → 종료 / WAF신호 감지 → Phase 2

Phase 2: TLS 임퍼소네이션 (curl_cffi)
    Safari → Chrome → Firefox TLS 지문 복제
    └ 성공 → 종료 / JS챌린지 → Phase 3

Phase 3: 실제 브라우저 (Playwright MCP)
    browser_navigate → wait → snapshot → 숨은 API 발견
    └ 성공 → 종료 / 인증필요 → "접근 불가" 종료
```

**핵심 원칙 4개**:
1. 어떤 방법도 미리 제외 안 함 — 의존성 없으면 설치하고 시도
2. 신호 기반 에스컬레이션 — 실패 유형이 다음 Phase를 결정
3. HTTP 200은 검사 시작 조건 (≠ 성공)
4. 도메인 무관 규칙 — 특정 사이트 하드코딩 금지 (No-Site-Name Rule)

---

## B. 핵심 패턴 — probe → validate → detect → plan → execute → report

insane-search의 내부 실행 패턴은 모든 "차단 가능성이 있는 작업"에 적용 가능한 범용 구조.

```
probe     — 기본 설정으로 첫 시도
validate  — 4계층 검증 (단순 200 OK 불충분)
detect    — 문제 유형 감지 → 랭킹
plan      — 감지 결과 기반 격자 구성 (URL변환 × TLS타겟 × Referer)
execute   — 격자 전수 시도 (첫 200에서 이탈 금지)
report    — ok/fail + trace (모든 시도 기록) + summary
```

**이 패턴의 일반화**:
- 어떤 반복 시도 작업에도 적용 가능 (API 호출, 모델 생성, 검색 쿼리)
- "첫 성공에서 이탈하지 않는다" → 검증 통과 후에만 이탈
- trace는 항상 남긴다 → 실패 진단 가능

---

## C. 4계층 검증 — HTTP 200이 성공이 아닌 이유

```python
# 성공 판정 = 4조건 AND
1. 챌린지 마커 없음
   "sec-if-cpt-container", "Access Denied", "Just a moment...", "DataDome"
   
2. 비정상 크기 아님
   < 3KB 또는 WAF fingerprint 크기 → 실패
   
3. 쿠키 센서 상태 정상
   "_abck=~-1~" → 실패 (Akamai 차단)
   
4. success_selectors 매칭 (호출자 제공 시)
   있으면 → STRONG_OK
   없으면 → WEAK_OK (주의 필요)
```

**False-positive 마커 목록** (HTTP 200이지만 실제 실패):

| 패턴 | 감지 방법 | 처리 |
|------|----------|------|
| WAF 소프트 블록 | 200 + "checking your browser" / "verify you are human" | Phase 2/3 에스컬레이션 |
| 빈 SPA 셸 | 200 + `<div id="root"></div>` + 200자 미만 | Phase 2/3 |
| 소프트 페이월 | 200 + "subscribe to read" / "구독하세요" | 메타데이터만 채택 |
| CAPTCHA | 200 + captcha/recaptcha/hcaptcha 감지 | Phase 3 |
| Akamai behavioral | 200 + `_abck` 쿠키 + sec-if-cpt 헤더 | Phase 3 직행 (TLS 무의미) |
| 빈 JSON | 200 + `"hasResults": false` / `"entries": []` | 실패 |
| 지역 차단 | 200 + "not available in your region" | 종료 |
| X SPA 셸 | 200 + "Sign in to X" | WebSearch+oEmbed 폴백 |

---

## D. URL 변환 규칙 (도메인 무관)

```python
TRANSFORMS = {
    "original":          url 그대로
    "mobile_subdomain":  www.example.com  →  m.example.com
    "am_prefix":         example.com      →  m.example.com (서브도메인 없을 때)
    "drop_www":          www.example.com  →  example.com
}

# 추가 변형 (fallback.md 기준)
".json 접미사":   https://reddit.com/r/sub/hot  →  .../hot.json
"/rss, /feed":   블로그·뉴스 RSS 엔드포인트
```

**적용 원칙**: 새 변환 추가는 2개 이상 무관한 사이트에서 검증 후 (cross-site validation).

---

## E. TLS 임퍼소네이션 — curl_cffi

WAF가 TLS 핸드셰이크의 JA3/JA4 지문으로 봇을 감지할 때 실제 브라우저 지문으로 위장.

```python
from curl_cffi import requests

TARGETS = ["safari", "chrome", "firefox", "safari_ios", "chrome_android"]

for target in TARGETS:
    session = requests.Session(impersonate=target)
    session.headers.update({
        "Accept": "text/html,application/xhtml+xml,*/*;q=0.8",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8",
        "Referer": "https://www.google.com/",
    })
    resp = session.get(url, timeout=20)
    if is_valid(resp):  # 4계층 검증
        break
```

**Referer 전략 3종**:
- `self_root`: `https://target.com/` → 내부 탐색처럼
- `google_search`: `https://www.google.com/` → 검색 유입처럼
- `none`: Referer 없음

**격자 구조**: URL변환(4) × TLS타겟(7+) × Referer(3) = 최대 84회 시도. 기본 max=12.
**Jitter**: 시도 사이 150~400ms 랜덤 딜레이 (IP 평판 보호).

---

## F. WAF 감지 → 랭킹 시스템

단일 판정이 아닌 **랭킹** 반환 → 틀렸을 때 캐스케이딩 오판 방지.

```python
DetectionHit(profile_id, confidence, signals)
# 감지 신호: cookie / header / server_contains / body
# confidence: 0.9 (strong) | 0.6 (weak) | 0.3 (minimal)
# 랭킹 상위 3개 프로파일에 대해 순차 시도
```

**주요 WAF 프로파일**:
- `akamai_bot_manager`: `_abck` 쿠키, `x-akamai-*` 헤더 → Real Chrome 필요
- `cloudflare_turnstile`: `cf-ray` 헤더, `__cf_bm` 쿠키 → Playwright MCP
- `datadome_probable`: `datadome` 쿠키
- `perimeterx_human`: `_px*` 쿠키
- `unknown_challenge`: 기본 폴백 프로파일

---

## G. R7 — WAF HTML 차단 시 API 우선 병행 라우팅

**핵심 통찰**: SPA+WAF 사이트는 HTML은 WAF로 중투자, 내부 API는 기본 방어만.
→ HTML 격자 전수(65초+) 낭비보다 API 탐지(5~10초)가 효율적.

**발동 조건 (3개 AND)**:
1. 초기 2~3회 시도가 모두 `verdict=challenge`
2. WAF 프로파일이 akamai/cloudflare_turnstile/datadome/perimeterx/f5/aws_waf 중 하나로 확정
3. 사용자 요청이 "반복/수집/N개/전부" 의도 (단건 조회는 해당 없음)

**실행 방식**:
```
engine (배경 실행) — 격자 계속 돌림
Claude (전경)     — Playwright MCP로 정찰:
  browser_navigate → 대상 페이지
  browser_network_requests → XHR/fetch 목록 → /api/ · /graphql · .json 필터
  발견된 API URL → python3 -m engine <API_URL> 재호출
```

---

## H. Phase 0 — 플랫폼별 공식 엔드포인트 인덱스

설치 없이 즉시 쓸 수 있는 공개 API들. 이 목록이 Phase 0의 핵심.

### 소셜/커뮤니티

```bash
# Reddit — URL에 .json 붙이기
curl -sL -H "User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)" \
  "https://www.reddit.com/r/{sub}/hot.json?limit=10"

# X/Twitter 타임라인
curl -sL "https://syndication.twitter.com/srv/timeline-profile/screen-name/{handle}"

# Hacker News
curl -sL "https://hacker-news.firebaseio.com/v0/topstories.json?limitToFirst=10&orderBy=%22%24key%22"

# Bluesky AT Protocol
curl -sL "https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor={handle}&limit=20"
```

### 학술/레지스트리

```bash
# arXiv Atom API
curl -sL "https://export.arxiv.org/api/query?search_query=all:{keyword}&max_results=10"

# GitHub (gh CLI)
gh api repos/{owner}/{repo}/contents/{path}

# npm
curl -sL "https://registry.npmjs.org/{package}"

# PyPI
curl -sL "https://pypi.org/pypi/{package}/json"

# Wayback Machine CDX
curl -sL "http://web.archive.org/cdx/search/cdx?url={domain}&output=json&limit=5"
```

### 미디어

```bash
# YouTube/Vimeo/TikTok 등 1,858개 사이트
yt-dlp --dump-json "URL"

# YouTube 자막
yt-dlp --write-sub --write-auto-sub --sub-lang "en,ko" --skip-download -o "/tmp/%(id)s" "URL"
```

### 한국 전용

```bash
# 네이버 금융 (비공식 JSON)
curl -sL "https://api.finance.naver.com/siseJson.naver?symbol={종목코드}&requestType=1"

# 네이버 검색 → m.blog.naver.com 변환
# 원본: blog.naver.com/post/123 → m.blog.naver.com/post/123

# RSS/피드 (feedparser)
pip install feedparser -q
python3 -c "import feedparser; f=feedparser.parse('{URL}'); [print(e.title) for e in f.entries]"
```

---

## I. Jina Reader — WAF 없는 사이트의 클린 마크다운

```bash
# 기본 (마크다운 변환)
curl -sL "https://r.jina.ai/{URL}"

# JSON 모드 (구조화)
curl -sL -H "Accept: application/json" "https://r.jina.ai/{URL}"
```

**특징**: 무료 500 RPM, API 키 불필요, Puppeteer 기반 JS SPA 렌더링 포함.
**한계**: WAF 사이트엔 무효 → Phase 2 이상 필요.

---

## J. 사이드카 — 원본 차단 시 과거 스냅샷

```bash
# Wayback Machine
curl -sL "http://archive.org/wayback/available?url={URL}"
# → snapshot URL 추출 후 해당 URL 접근

# archive.today
# https://archive.ph/{URL} 직접 접근

# (Google AMP Cache는 2024-07 종료됨)
```

**사용 원칙**: 원본 하나라도 성공하면 사이드카는 참고만. 전부 실패 시에만 채택 + provenance 태깅.

---

## K. No-Site-Name Rule — 도메인 무관 설계 원칙

**금지**: 특정 도메인/URL/셀렉터/브랜드를 엔진 코드에 하드코딩.
**허용**: Phase 0 공식 API 인덱스 (플랫폼이 공식 공개한 것), 런타임 hint, 관측 로그.

**판단 기준**: "이 규칙이 다른 사이트에서도 같은 WAF를 쓰면 유효한가?" → YES면 코드에, NO면 런타임 hint로.

**왜 중요한가**: 사이트 하드코딩은 maintenance hell + 바이어스 형성. 범용 규칙이 더 오래 산다.

---

## L. 새 사이트가 안 뚫릴 때 — 진단 프로세스

```
1. result.trace 확인 → 어느 Phase에서 어떤 verdict로 실패했나
2. user_hint로 1회 재시도 (impersonate_first, referer_strategy)
3. 반복 성공 패턴이 관측되면 observations/ 로그
4. 동일 WAF를 쓰는 다른 사이트에서도 유효하면 waf_profiles 튜닝
5. 여전히 안 되면 신규 WAF 프로파일 검토 (Kasada 등)
```

---

## 학습→반영 루프

> 이 학습을 어디에 반영할 것인가 (§"학습→반영 루프" 원칙).

**즉시 반영 가능**:
1. **SKILL** — Phase 0→1→2→3 에스컬레이션 패턴 내재화. 현재 WebFetch → Scrapling 2단계를 4단계로 확장.
2. **BRIEF** — False-positive 마커 목록 추가 (HTTP 200 ≠ 성공 원칙).
3. **research-relay 외주 지시** — Phase 0 공식 API 인덱스를 GPT 외주 시 첫 시도 목록으로 지정.

**백로그 (조건부)**:
- `curl_cffi` + Jina Reader를 research-relay 스킬에 실제 코드로 통합 (Scrapling 대체 or 보완) — Codex 위임 후보.
- R7 패턴 (API 우선 병행 라우팅) → 대량 수집 작업 시 연구.

**반영처 없음**: No-Site-Name Rule은 순수 설계 철학. 별도 반영 없이 내 코드 작성 습관으로 내재화.

---

## 설치 (플러그인 방식)

```bash
/plugin marketplace add https://github.com/fivetaku/gptaku_plugins.git
/plugin install insane-search
# Claude Code 재시작
```

*단, 본 노트의 목적은 플러그인 없이 패턴을 내재화하는 것.*

## 연결

[Scrapling — 차단·동적 페이지를 뚫는 적응형 스크래핑 (on-demand escalation 도구)](scrapling.md) · SKILL · BRIEF · [지식 하네스 레지스트리 — Knowledge Harness Registry](knowledge-harness-registry.md)
