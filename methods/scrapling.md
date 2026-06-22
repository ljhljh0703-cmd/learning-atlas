---
created: 2026-06-17
updated: 2026-06-17
type: learning
tags: [AI, web-scraping, crawling, anti-bot, escalation-tool, clean-reader, research-relay]
source: https://github.com/d4vinci/Scrapling
authors: [d4vinci]
year: 2026
category: method
---

# Scrapling — 차단·동적 페이지를 뚫는 적응형 스크래핑 (on-demand escalation 도구)

*WebFetch/clean-reader 가 막히는 지점(Cloudflare·JS 렌더·anti-bot)을 메우는 취득 계층. 파악 단계 = WebFetch 직접(lossy). 본 페이지 = "필요 상황에 꺼내 쓰는" 기억용 박제, 지금 설치 X.*

성숙한 Python 스크래핑 프레임워크(BSD-3·Python 3.10+·64.4k★·활발). vault 용도는 **딱 하나** — 작가의 *가끔 외부 크롤링* 중 단순 fetch 가 차단당할 때의 escalation.

---

## 한 줄 요약

> 단순 fetch(WebFetch/curl) → 막히면 `Fetcher`(TLS 임퍼소네이트) → 더 막히면 `StealthyFetcher`(Cloudflare 우회). 사이트 구조 변해도 유사도로 셀렉터 재배치(적응형). 취득만 — 정제는 clean-reader, 흡수는 research-relay.

---

## 핵심 (vault 관련분만)

- **멀티 페처**: `Fetcher`(HTTP 빠름·TLS 지문 위장) / `DynamicFetcher`(Playwright 브라우저) / `StealthyFetcher`(Cloudflare Turnstile·anti-bot 우회).
- **적응형 요소 추적**: 사이트 구조 변경 시 유사도 알고리즘으로 셀렉터 재배치 → 같은 사이트 반복 크롤에 강함.
- **AI 전달 전 타깃 추출**(MCP): LLM 에 넘기기 전 콘텐츠 추출 = 토큰·비용 절감(RTK 정합).
- 성능: 파서가 BeautifulSoup4 대비 ~784× 빠름(parsel 동급). *단 파싱 속도일 뿐, 취득 가치가 본체.*

---

## 운영 정책 (외부 도구 — SSOT) 🔒 LOCKED 2026-06-17

> 작가 확정("세팅해놓고 필요할 때 꺼낼 수 있게만", 2026-06-17). CLAUDE.md "외부 도구 사용 정책" 컨벤션 — 운영 정책 = 본 페이지, 헌법은 진입점 표만.

**위치 = escalation 도구 (기본 도구 아님)**: 웹 취득의 *기본*은 WebFetch / clean-reader / curl. **그게 차단·실패할 때만** Scrapling. 단순 정적 페이지에 Scrapling = over-engineering(Karpathy #2).

**발동 트리거 (셋 중 하나)**:
1. WebFetch 가 cross-host redirect/차단/빈 본문 반환.
2. clean-reader(`clean.py`, BeautifulSoup+UA)가 Cloudflare/JS 렌더/anti-bot 으로 빈 본문·차단.
3. 다중 페이지 크롤(Spider, pause/resume) 필요.

**설치 = 온디맨드** (지금 설치 X — infra-0): 발동 시점에 `pip install "scrapling[fetchers]" && scrapling install`(브라우저 다운로드, 무거움 — 필요 기능만). 상시 daemon X.

**구동 주체**: 코드 도구 → Codex/Claude 직접(claude-max-cost-shift 소량은 Claude). **Gemini No-Coding 무관.** **MCP 서버 상시 연결 금지** — hot.md 토큰 방침(MCP 커넥터 codegraph만)과 충돌. 크롤 세션 중에만 켜거나 CLI/스크립트 호출.

**파이프라인**: Scrapling(취득) → clean-reader(정제) → research-relay/learning 흡수(③Gate).

**⚠️ 법적 가드**: README "교육·연구용, 현지법·ToS 준수" 명시. robots.txt/ToS 존중. anti-bot 우회는 *접근 허용된 자료*에 한정 — 무단 대량 수집·우회 X.

review_trigger: "첫 실사용(차단 사이트 escalation) 후 실효성 검토 / 또는 2026-12-17"

---

## 연결된 페이지

- BRIEF (정제 계층 — Scrapling 이 취득, clean-reader 가 정제) · research-relay (흡수 외주)
- [browser-harness — LLM 에 Chrome CDP 직결, 에이전트가 스스로 자라는 thin harness](browser-harness.md) (browser-use CDP — 인접 브라우저 자동화, *에이전트 자가치유* 쪽) · [Ponytail — "게으른 시니어 개발자"를 13개 코딩 에이전트에 이식하는 portable behavioral skill](ponytail.md) (외부도구 정책 동일 패턴)
