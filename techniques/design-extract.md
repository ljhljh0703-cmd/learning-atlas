---
created: 2026-06-10
updated: 2026-06-10
type: learning
tags: [design-system, extraction, playwright, mcp, tailwind, dtcg]
source: https://github.com/Manavarya09/design-extract
authors: [Manavarya09]
year: 2026
category: technique
---

# 충실 추출 — Manavarya09/design-extract (designlang)

> 원칙: 광범위 VERBATIM 적용. 코드 아키텍처, CLI 파라미터 스펙, MCP 프로토콜 및 데이터 흐름은 요약 없이 원본 코드와 상세 스펙을 그대로 유지하여 기술함.

## 0. 분류 추천
- **분류**: technique (이유: 라이브 웹사이트의 디자인 토큰을 자동 추출하고 AI 에이전트 도구로 바인딩하는 정형적 기술 구현체 세트임.)
- **한줄 정의**: Playwright 기반 브라우저 자동화와 AI 파이프라인을 결합하여 라이브 웹사이트의 디자인 시스템을 DTCG 토큰 및 Tailwind v4 설정 등 17+개 자산으로 추출하고 MCP 서버로 작동하는 CLI 도구.

## 1. 보존 필수 원문 [VERBATIM]

### 1.1 패키지·엔트리포인트 원문 식별자
- **package.json**: name: "designlang", version: "12.16.0", bin.designlang: "./bin/design-extract.js", type: "module", engines.node: ">=20", license: "MIT"로 정의되어 있다.
- **package.json의 exports**: ".", "./api", "./mcp"가 있고, "./mcp"는 "./src/mcp/index.js"를 가리킨다. 단, GitHub UI의 src/mcp 폴더 목록에서는 resources.js, server.js, tools.js만 확인되어 index.js 존재 여부는 §6에 불확실로 격리한다.
- **bin/design-extract.js**: Commander 기반 CLI의 프로그램 이름은 designlang이고, 메인 명령은 <url> 입력을 받아 디자인 시스템을 추출하는 구조다.

### 1.2 README 핵심 원문 식별자
- **README의 핵심 기능**: Headless Chromium via Playwright, page.evaluate() walks up to 5,000 DOM elements, 17 extractor modules, 12+ formatter modules, WCAG, Capture.
- **README Quick start 명령**: npx designlang https://example.com, designlang pair, designlang brand, designlang theme-swap, designlang pack, designlang remix, designlang grade, designlang battle, designlang clone, --full.
- **README 산출물**: design-language.md, design-tokens.json, tailwind.config.js, tailwind-v4.css, AGENT.md, motion.html, figma-variables.json, preview.html, voice-and-tone, semantic regions, WCAG remediation, stack fingerprint, SEO metadata.

### 1.2.1 최신 릴리즈(v12.x) 명령어 보강 (2026-06-14, 웹 검증 — GitHub Manavarya09/design-extract·designlang)
- **verify `<url>`**: 추출 토큰으로 복구한 화면 ↔ 라이브 화면 시각/구조 일치도(Fidelity Score) 측정.
- **pair `<A> <B>`**: 두 사이트 디자인 언어 7축 결합(기본 "A 비주얼 × B 보이스/타이포"). **brand `<url>`**: 13장 편집용 브랜드 가이드북. **theme-swap --primary `<hex>`**: OKLCH hue rotation 테마 치환. **pack/remix/grade/battle**: §1.2 기재.
- **Atlas Cloud 연동 (`--smart`)**: 저신뢰 분류를 Atlas Cloud API(예: `deepseek-ai/deepseek-v4-pro`)로 보강. env `ATLASCLOUD_API_KEY`/`ATLASCLOUD_MODEL`/`ATLASCLOUD_API_BASE`. (DeepSeek V4 Pro = 2026-04-24 출시 실존 모델.)
- **에이전트 통합**: `--emit-agent-rules`(Cursor/Claude Code/CLAUDE.md/agents.md 룰셋 발행) · **Claude Code 플러그인**(`.claude-plugin/`로 `/extract` `/grade` `/battle` `/remix` `/pack` `/theme-swap` `/brand` `/pair` 8 슬래시 커맨드).

### 1.3 Playwright 크롤러 핵심 소스 식별자 — src/crawler.js
- **파일 경로**: src/crawler.js.
- **핵심 원문 식별자**: chromium, MAX_ELEMENTS = 5000, crawlPage(url, options = {}), width = 1280, height = 800, wait, dark, depth, screenshots, outDir, cookies, headers, ignore, insecure, userAgent, deepInteract, selector, wsEndpoint.
- **브라우저 실행 식별자**: chromium.connectOverCDP, chromium.launch, browser.newContext, viewport, colorScheme, ignoreHTTPSErrors, extraHTTPHeaders, context.addCookies.
- **페이지 로딩·수집 식별자**: page.coverage.startCSSCoverage, page.goto, waitUntil: 'domcontentloaded', page.waitForLoadState('networkidle'), document.fonts.ready, extractPageData, runInteractionPass, captureComponentScreenshots, discoverInternalLinks.
- **computed style 수집 식별자**: color, backgroundColor, backgroundImage, borderColor, fontFamily, fontSize, fontWeight, lineHeight, letterSpacing, padding, margin, gap, borderRadius, boxShadow, textShadow, zIndex, transition, animation, display, position, flex, grid, maxWidth, fontVariationSettings, fontFeatureSettings, textWrap, pseudo style, CSS source 추적.
- **DOM 구조 수집 식별자**: componentCandidates, candidateSelector, sections, header, nav, main, section, footer, aside, stack, scripts, metas, classNameSample, windowGlobals, __NEXT_DATA__.
- **CSS·메타데이터 수집 식별자**: cssVariables, mediaQueries, keyframes, containerQueries, envUsage, modernColors, favicons, manifest, jsonLd, images, parseCrossOriginCSS.

### 1.4 추출 파이프라인 핵심 소스 식별자 — src/index.js
- **파일 경로**: src/index.js.
- **핵심 원문 식별자**: extractDesignLanguage, crawlPage, design.meta, colors, typography, spacing, shadows, borders, variables, breakpoints, animations, components, accessibility, layout, gradients, zIndex, icons, fonts, images, componentScreenshots, stack, cssHealth, regions, componentClusters, modernCss, wideGamut, tokenSources, interactionStates, motion, componentAnatomy, voice, score, darkMode.
- **추가 extractor 식별자**: a11yRemediation, pageIntent, sectionRoles, componentLibrary, materialLanguage, imageryStyle, seo, iconSystem, backgroundPatterns, stackIntel, formStates.
- **멀티페이지·스코어링 식별자**: routes, scoreDesignSystem, warnings, safeExtract.

### 1.5 DTCG 토큰 포맷터 핵심 소스 식별자 — src/formatters/dtcg-tokens.js
- **파일 경로**: src/formatters/dtcg-tokens.js.
- **핵심 원문 식별자**: DTCG v1 token formatter, $metadata, primitive, semantic, $value, $type.
- **생성 범주 식별자**: primitive color, spacing, radius, shadow, fontFamily; semantic color.action, color.surface, color.text, typography, radius, shadow.

### 1.6 AI/LLM 분류 보조 핵심 소스 식별자 — src/classifiers/smart.js
- **파일 경로**: src/classifiers/smart.js.
- **핵심 원문 식별자**: Optional LLM fallback, --smart, OPENAI_API_KEY, ANTHROPIC_API_KEY, classify page intent, classify material language, classify component library, Return strict JSON only.
- **확인된 구조**: LLM은 토큰 추출의 본체가 아니라 낮은 신뢰도의 분류 작업에 선택적으로 사용되는 fallback이다. buildDigest는 URL, title, path, metas, section roles, text sample, class sample을 입력 digest로 구성한다.

### 1.7 CLI 옵션·명령어 원문 식별자 — bin/design-extract.js
- **메인 추출 옵션 식별자**: --out, --name, --width, --height, --wait, --dark, --depth, --screenshots, --framework, --responsive, --interactions, --deep-interact, --full, --cookie, --cookie-file, --header, --user-agent, --insecure, --ignore, --ignore-widgets, --storybook, --selector, --system-chrome, --tokens-legacy, --platforms, --emit-agent-rules, --smart, --pages, --no-prompts, --no-design-md, --responsive-shots, --perf, --palette, --pdf, --paper, --landscape, --json, --json-pretty, --no-history, --verbose, --quiet.
- **출력 파일 식별자**: design-language.md, design-tokens.json, tailwind.config.js, tailwind-v4.css, tokens.d.ts, reset.css, gradients.css, gradients.json, AGENT.md, motion.html, motion.framer.js, motion.one.js, motion.css, motion.tailwind.js, variables.css, preview.html, Figma variables, platform outputs, storybook, history.
- **하위 명령 식별자**: clone, watch, diff, history, brands, sync, pack, theme-swap, widgets, ci, studio, mcp.
- **battle 식별자**: 두 URL을 병렬 추출한 뒤 HTML/Markdown/JSON 비교 산출물을 만들고, grade와 verdict를 출력한다.
- **remix 식별자**: 추출된 page-shape를 vocabulary로 렌더링해 self-contained HTML을 만든다.

### 1.8 MCP 서버·도구·리소스 원문 식별자 — src/mcp/*
- **파일 경로**: src/mcp/server.js, src/mcp/tools.js, src/mcp/resources.js.
- **서버 식별자**: StdioServerTransport, ListResourcesRequestSchema, ReadResourceRequestSchema, ListToolsRequestSchema, CallToolRequestSchema, Server({ name: 'designlang', version: '7.0.0' }), capabilities: { resources: {}, tools: {} }.
- **리소스 URI 원문 식별자**: designlang://tokens/primitive, designlang://tokens/semantic, designlang://regions, designlang://components, designlang://health.
- **Tool 원문 식별자**: search_tokens, find_nearest_color, get_region, get_component, list_failing_contrast_pairs.
- **MCP registry 문서의 실행 명령 식별자**: npx -y designlang mcp; Cursor·Claude Desktop 설정 예제가 문서화되어 있다.

## 2. 원자적 주장 (atomic claims)
1. designlang npm 패키지의 현재 원본 package.json 버전은 12.16.0이고 CLI 바이너리 이름은 designlang이다.
2. 패키지는 ESM(type: "module")이며 Node.js >=20을 요구한다.
3. CLI 엔트리포인트는 ./bin/design-extract.js다.
4. 저장소 README는 도구가 headless browser로 라이브 DOM에서 디자인 시스템을 추출한다고 설명한다.
5. README는 기본 실행 예시로 npx designlang https://example.com를 제시한다.
6. README의 “How it works”는 크롤링 단계에서 Playwright 기반 Headless Chromium을 사용한다고 설명한다.
7. README는 page.evaluate()가 최대 5,000개 DOM element와 25개 이상의 computed property를 걷는다고 설명한다.
8. src/crawler.js에도 MAX_ELEMENTS = 5000이 정의되어 있어 README의 5,000개 제한과 코드가 일치한다.
9. 크롤러는 기본 viewport를 width = 1280, height = 800으로 설정한다.
10. 크롤러는 wsEndpoint가 있으면 chromium.connectOverCDP로 연결하고, 없으면 chromium.launch로 브라우저를 실행한다.
11. browser.newContext에 viewport, color scheme, HTTPS error ignore, user agent, extra headers, cookies를 반영한다.
12. 크롤러는 페이지 이동 전 CSS coverage를 시작하고, 페이지 로딩 후 CSS coverage 결과를 수집한다.
13. 크롤러는 page.goto를 waitUntil: 'domcontentloaded'로 호출하고, 이후 networkidle과 document.fonts.ready를 기다린다.
14. 크롤러는 optional deepInteract 단계에서 상호작용 pass를 수행할 수 한다.
15. 크롤러는 depth > 0일 때 내부 링크를 발견하고 추가 페이지를 분석한다.
16. 크롤러는 dark 옵션이 켜지면 다크 모드 context를 새로 열어 별도 데이터를 수집한다.
17. extractPageData는 DOM element뿐 아니라 shadow DOM까지 순회하는 수집 로직을 포함한다.
18. 스타일 수집에는 색상, 배경, border, font, spacing, radius, shadow, z-index, transition, animation, flex, grid, max-width 등이 포함된다.
19. 크롤러는 root CSS variables, media queries, keyframes, container queries, env usage, modern color syntax를 수집한다.
20. 크롤러는 button, role button, .btn, input, textarea, card class 등에서 component candidate를 추출한다.
21. 크롤러는 header, nav, main, section, footer, aside와 ARIA role 기반 section 정보를 수집한다.
22. 크롤러는 scripts, metas, class name sample, React/Vue/Next 관련 window/global signal을 stack fingerprint 입력으로 수집한다.
23. src/index.js는 crawlPage 결과를 다수 extractor에 전달해 design 객체를 구성한다.
24. design 객체에는 colors, typography, spacing, shadows, borders, variables, breakpoints, animations, components, accessibility, layout, gradients, zIndex, icons, fonts, images가 포함된다.
25. design 객체에는 cssHealth, semantic regions, component clusters, modern CSS, wide gamut, token sources, interaction states, motion, component anatomy, voice, darkMode도 포함된다.
26. 추가 extractor는 accessibility remediation, page intent, section roles, component library, material language, imagery style, SEO, icon system, background patterns, stack intelligence, form states를 처리한다.
27. DTCG formatter는 $metadata, primitive, semantic 최상위 구조를 출력한다.
28. DTCG formatter는 primitive color/spacing/radius/shadow/fontFamily와 semantic color/typography/radius/shadow를 생성한다.
29. smart.js의 LLM 사용은 --smart 옵션과 API key가 있을 때의 optional fallback으로 설명되어 있다.
30. smart.js는 OpenAI 또는 Anthropic REST API를 사용하고, SDK dependency를 추가하지 않는다고 주석에 명시되어 있다.
31. smart.js의 LLM tasks는 page intent, material language, component library 분류다.
32. CLI는 기본 추출 외에 responsive capture, interactions capture, smart classifier, canonical page extraction, palette compression, JSON output을 조건부로 수행한다.
33. CLI는 Markdown, DTCG tokens, Tailwind config, Tailwind v4 CSS, TypeScript definitions, reset CSS, gradients, agent prompt, motion outputs, preview, Figma variables 등 다수 파일을 생성한다.
34. CLI는 iOS, Android Compose, Flutter, WordPress 같은 platform output을 옵션으로 생성할 수 있다.
35. battle formatter는 scoring extractor의 결과를 사용하며 새 분석을 수행하지 않는다고 주석에 명시되어 있다.
36. battle 비교 차원은 color discipline, typography consistency, spacing system, shadow consistency, radius consistency, accessibility, tokenization, css health다.
37. battle은 차이값이 3점 이상이면 해당 측 승리, -3점 이하이면 상대 승리, 그 외에는 tie로 판정한다.
38. remix formatter는 추출된 page-shape를 다른 design vocabulary로 렌더링해 self-contained HTML을 만든다.
39. pair 구현은 두 추출 디자인을 colors, typography, spacing, shape, motion, voice, components 축으로 결합하고, 기본값은 colors/spacing/shape/motion을 A에서, typography/voice/components를 B에서 가져오는 구조다.
40. pair의 기본 축 선택은 colors/spacing/shape/motion은 A, typography/voice/components는 B다.
41. drift 명령은 로컬 token 파일과 라이브 사이트 추출값을 비교하며 CI 용도로 non-zero exit을 낼 수 있게 설계되어 있다.
42. drift 구현은 확인된 범위에서 color token만 flatten하고 RGB Euclidean distance로 nearest palette color를 계산한다.
43. clone 구현은 Next.js starter를 생성하며 package.json, globals.css, layout.js, page.js, next.config, postcss.config 등을 작성한다.
44. 생성되는 clone starter는 Next ^15, React ^19, Tailwind ^4 계열 dependency를 사용한다.
45. MCP server는 최신 *-design-tokens.json을 mtime 기준으로 찾아 로드한다.
46. MCP server는 legacy token 파일을 primitive/semantic 구조가 없으면 건너뛰는 로직을 포함한다.
47. MCP server는 companion *-mcp.json이 있으면 regions, component clusters, accessibility remediation, css health를 design subset에 포함한다.
48. MCP resources는 primitive tokens, semantic tokens, regions, components, health 다섯 URI를 제공한다.
49. MCP tools는 token search, nearest color remediation, region lookup, component lookup, failing contrast pair listing을 제공한다.
50. MCP registry 문서는 Cursor와 Claude Desktop에서 npx -y designlang mcp를 실행 command로 쓰는 설정 예제를 포함한다.

## 3. 메커니즘 및 구조 [PARAPHRASE / VERBATIM 혼합]

### 3.1 크롤링 및 디자인 토큰 파싱 흐름
- **입력 단계**: 사용자는 `designlang <url>` 또는 `npx designlang <url>` 형태로 URL을 전달한다. CLI는 URL, 출력 디렉토리, 이름, viewport, wait, dark, depth, screenshots, responsive, interactions, cookie/header, selector, framework, smart, platform, JSON 출력 등 옵션을 파싱한다.
- **브라우저 초기화**: `src/crawler.js`의 `crawlPage`는 Playwright chromium을 사용한다. wsEndpoint가 있으면 CDP 연결을 사용하고, 없으면 Chromium을 launch한다. 이후 viewport, color scheme, HTTPS ignore, user agent, headers, cookies가 반영된 browser context를 만든다.
- **페이지 안정화**: 크롤러는 CSS coverage를 시작한 뒤 URL로 이동하고, domcontentloaded, networkidle, document.fonts.ready 대기 과정을 거친다. 사용자가 wait를 지정하면 추가 대기도 수행한다.
- **DOM·style 수집**: `extractPageData`는 페이지 내부에서 실행되어 DOM element와 shadow DOM을 순회한다. 각 element에 대해 computed style, pseudo style, CSS source, layout geometry, text, class/id, component candidate signal을 모은다. computed style 필드는 color, background, border, font, spacing, shadow, transition, animation, display, position, flex, grid, z-index 등 UI 토큰화에 필요한 범위를 포함한다.
- **CSS 구조 수집**: 크롤러는 root CSS variables, media queries, keyframes, container queries, env usage, modern color syntax, cross-origin CSS의 일부 파싱 결과를 함께 수집한다.
- **컴포넌트·섹션 후보 수집**: button, role button, .btn, input, textarea, card class 등에서 component candidate를 만들고, header/nav/main/section/footer/aside 및 ARIA role 기반 semantic section 정보를 수집한다.
- **스택·메타 수집**: scripts, metas, class name sample, React/Vue/Next 관련 window/global signal, favicons, manifest, JSON-LD, images가 함께 수집된다.
- **확장 크롤링**: depth > 0이면 내부 링크를 발견해 추가 route를 분석하고, dark 옵션이면 dark color scheme context를 별도로 열어 dark data를 수집한다. screenshots와 component screenshots도 옵션에 따라 생성된다.
- **extractor fan-out**: `src/index.js`의 `extractDesignLanguage`는 raw crawl 결과를 colors, typography, spacing, shadows, borders, variables, breakpoints, animations, components, accessibility, layout, gradients, zIndex, icons, fonts, images 등 extractor로 분배해 하나의 design 객체를 만든다.
- **semantic enrichment**: 이후 cssHealth, semantic regions, component clusters, modern CSS, wide gamut, token sources, interaction states, motion, component anatomy, voice, a11y remediation, page intent, section roles, component library, material language, imagery style, SEO, icon system, background patterns, stack intelligence, form states가 추가된다.
- **DTCG 변환**: `src/formatters/dtcg-tokens.js`는 최종 design 객체를 $metadata, primitive, semantic 구조의 DTCG v1 스타일 token JSON으로 변환한다. primitive에는 color/spacing/radius/shadow/fontFamily가, semantic에는 action/surface/text color, typography, radius, shadow가 배치된다.
- **AI 파싱 관련 정정**: 확인된 소스 기준으로 “AI 에이전트가 스타일 데이터로부터 DTCG 토큰을 파싱한다”는 구조는 명시적으로 확인되지 않았다. DTCG 생성은 deterministic formatter가 담당하고, LLM은 --smart 옵션에서 page intent/material language/component library 같은 낮은 신뢰도 분류를 보조하는 fallback이다.

### 3.2 CLI 명령어 아키텍처
- **메인 추출 명령**: `bin/design-extract.js`는 Commander로 `<url>` 명령을 등록하고, 옵션 검증·config merge·URL 정규화·cookie/header 파싱·ignore selector 처리 후 `extractDesignLanguage`를 호출한다. 이후 선택적으로 responsive capture, interaction capture, smart refinement, canonical page extraction, palette compression, JSON 출력, history 저장을 처리한다.
- **파일 생성 흐름**: 메인 명령은 design-language.md, design-tokens.json, Tailwind v3/v4 산출물, CSS variables, reset, gradients, TypeScript definition, prompt pack, preview, Figma variables, platform theme, Storybook, agent rules 등을 formatter에 위임해 출력한다.
- **battle 명령**: CLI의 `battle`은 두 URL을 병렬 추출한 뒤 battle formatter로 비교한다. formatter는 scoring extractor의 점수 위에 color discipline, typography consistency, spacing system, shadow consistency, radius consistency, accessibility, tokenization, css health 차원을 구성한다. 차이값이 3점 이상이면 A 승, -3점 이하이면 B 승, 그 사이면 tie로 판정한다.
- **remix 명령**: `remix`는 추출된 page-shape를 `src/vocabularies`의 디자인 vocabulary로 다시 렌더링한다. 확인된 vocabulary 파일은 art-deco, brutalist, cyberpunk, editorial, soft-ui, swiss이며, formatter는 self-contained HTML을 출력한다.
- **pair 명령**: pair의 핵심 구현은 `src/fuse.js`다. 두 디자인을 colors, typography, spacing, shape, motion, voice, components 축으로 결합하고, 기본값은 colors/spacing/shape/motion을 A에서, typography/voice/components를 B에서 가져오는 구조다. 결과 design 객체는 기존 formatter 출력 경로를 재사용할 수 있도록 virtual `pair://...` meta를 만든다.
- **drift 명령**: `drift`는 로컬 token JSON/CSS와 라이브 사이트 추출 결과를 비교하는 CI 지향 명령이다. 확인된 구현은 color token을 flatten한 뒤 라이브 palette와 RGB 거리 기반 nearest match를 계산하고, tolerance와 drift ratio에 따라 in-sync, minor-drift, notable-drift, major-drift verdict를 산출한다.
- **clone 명령**: `clone`은 라이브 사이트에서 추출한 디자인을 기반으로 Next.js starter를 생성한다. 생성 파일에는 src/app, public, package.json, globals.css, layout.js, page.js, next.config, postcss.config가 포함되며, CSS variables는 추출된 colors/typography/radius/shadow에서 만들어진다.
- **pack / theme-swap / 기타 명령**: CLI 파일에는 pack, theme-swap, widgets, ci, studio, mcp 명령이 등록되어 있으며, pack은 추출 design에서 prompt pack을 만들고, mcp는 `src/mcp/server.js`의 `run`을 호출한다.

### 3.3 MCP 서버 구현 및 AI 에이전트 연동 아키텍처
- **entrypoint**: CLI의 mcp 명령은 `../src/mcp/server.js`를 import하고 `run(opts)`를 호출한다.
- **서버 구조**: `src/mcp/server.js`는 MCP SDK의 Server와 StdioServerTransport를 사용한다. 서버 이름은 designlang, 서버 버전 문자열은 7.0.0이며, capabilities로 resources와 tools를 선언한다.
- **데이터 로딩**: MCP server는 지정 output directory에서 최신 `*-design-tokens.json`을 mtime 기준으로 찾아 로드하고, primitive/semantic 구조가 없는 legacy token 파일은 skip한다. companion `*-mcp.json`이 있으면 regions, component clusters, accessibility remediation, css health를 함께 읽는다.
- **resource handler**: `buildResources`는 `designlang://tokens/primitive`, `designlang://tokens/semantic`, `designlang://regions`, `designlang://components`, `designlang://health`를 JSON resource로 노출한다.
- **tool handler**: `buildTools`는 token flattening and lookup 함수를 만든 뒤 search_tokens, find_nearest_color, get_region, get_component, list_failing_contrast_pairs를 제공한다. find_nearest_color는 contrast remediation helper를 사용하고, region/component tool은 name 또는 kind/variant 기준으로 match한다.
- **Claude Code / Cursor 연동**: 레포의 MCP registry 문서는 npx -y designlang mcp를 command로 실행하는 설정을 제시하며, Cursor와 Claude Desktop 설정 예제를 포함한다.

## 4. 연결 후보 및 해석 (provisional)
- **키워드**: html-publish, design-system, tailwind-v4, mcp-server, DTCG, Playwright, live DOM extraction, WCAG remediation, visual drift, Next.js starter, agent prompt pack.
- **관련성 후보**:
    - html-publish의 테마/스타일 계층에 designlang의 design-tokens.json, tailwind-v4.css, variables.css를 입력 자산으로 연결할 수 있다. 이 연결은 실제 html-publish 코드 검증 전의 provisional 해석이다.
    - Claude Code 또는 Cursor 같은 agent는 designlang mcp를 통해 primitive/semantic token, semantic regions, component clusters, health 정보를 질의할 수 있다. 이 부분은 MCP server와 registry 문서에서 확인된다.
    - drift와 visual-diff 계열 명령은 publish 파이프라인의 CI guard로 연결할 후보가 있다. drift의 로컬 token 대 라이브 사이트 비교 구조는 코드에서 확인된다.
- **외부 LLM 해석 — HTML Publish 파이프라인에 designlang을 결합하는 3단계 제안**:
    1. **Extract stage**: 배포된 참조 사이트 또는 경쟁 사이트에 `npx designlang <url> --full --json-pretty --emit-agent-rules`를 실행해 tokens, markdown, Tailwind v4, preview, MCP companion 자산을 만든다. 해당 출력군은 CLI와 README에서 확인된다.
    2. **Normalize stage**: design-tokens.json의 DTCG primitive/semantic 구조를 html-publish의 theme 변수명으로 매핑하고, tailwind-v4.css 또는 variables.css를 publish theme asset으로 등록한다. DTCG 구조와 CSS 출력은 확인되지만, html-publish 내부 매핑 규칙은 본 조사 범위 밖이라 확인 불가다.
    3. **Agent QA stage**: Claude/Cursor에서 designlang mcp를 실행해 token search, nearest color, region/component lookup, contrast failure listing을 사용하고, CI에서는 drift로 live site와 token source 간 divergence를 감시한다. MCP tools와 drift 구조는 소스에서 확인된다.

## 5. 커버리지 맵 (로스 검증용)
- [x] README.md → 본 산출 §0, §1.2, §2, §3.1, §3.2 반영. Quick start, output files, feature list, “How it works”, MCP 설명을 반영했다.
- [x] package.json → 본 산출 §1.1, §2 반영. package name, version, bin, exports, engines, license를 반영했다.
- [x] bin/design-extract.js → 본 산출 §1.7, §2, §3.2, §3.3 반영. 메인 옵션, 출력 파일, 하위 명령, MCP command import 흐름을 반영했다.
- [x] src/crawler.js → 본 산출 §1.3, §2, §3.1 반영. Playwright 실행, page lifecycle, DOM/style/CSS/metadata/component/section 수집, dark/depth/screenshots 흐름을 반영했다.
- [x] src/index.js → 본 산출 §1.4, §2, §3.1 반영. extractDesignLanguage의 extractor fan-out과 design 객체 필드를 반영했다.
- [x] src/extractors/ → 본 산출 §2, §3.1 반영. colors, typography, spacing, accessibility, layout, motion, semantic regions, component clusters 등 extractor 목록과 역할을 반영했다.
- [x] src/formatters/ → 본 산출 §1.5, §2, §3.1, §3.2 반영. DTCG, Tailwind, prompt pack, battle, remix, pair-related outputs, platform formatters 목록을 반영했다.
- [x] src/classifiers/smart.js → 본 산출 §1.6, §2, §3.1 반영. LLM fallback 범위와 tasks를 반영했다.
- [x] src/vocabularies/ → 본 산출 §3.2 반영. art-deco, brutalist, cyberpunk, editorial, soft-ui, swiss vocabulary 파일 목록과 remix 연결을 반영했다.
- [x] src/mcp/ → 본 산출 §1.8, §2, §3.3 반영. server.js, resources.js, tools.js, stdio server, resources, tools, registry 문서를 반영했다.
- [x] src/fuse.js → 본 산출 §3.2 반영. pair 축 결합 구조를 반영했다.
- [x] src/drift.js → 본 산출 §2, §3.2, §4 반영. live-vs-local token drift 비교 구조를 반영했다.
- [x] src/clone.js → 본 산출 §2, §3.2 반영. Next.js starter 생성 구조를 반영했다.
- [x] docs/MCP-REGISTRY.md → 본 산출 §1.8, §3.3 반영. Cursor/Claude Desktop MCP command 예제를 반영했다.
- [x] .claude-plugin/, .claude/, .github/, chrome-extension/, commands/, figma-plugin/, github-action/, marketplace/, raycast-extension/, skills/extract-design/, tests/, vscode-extension/, website/ → 루트 파일트리 존재는 확인했지만, 각 하위 구현 전문은 이번 추출에서 세부 열람하지 않았다. 따라서 “레포 표면/배포면 존재” 수준으로만 반영한다.
- DROP: 긴 소스코드 전문 재출력은 저작권상 DROP. 대신 파일 경로, 원문 식별자, 구조, 데이터 흐름, citation으로 대체했다.

## 6. 신뢰도 메모 (환각 가드)
- **확실 — 레포지토리 소스 코드에서 직접 검증**:
    - 패키지명 designlang, 버전 12.16.0, CLI bin `./bin/design-extract.js`, Node >=20, MIT license.
    - Playwright/Chromium 기반 크롤링, 최대 5,000 DOM element 수집, computed style·CSS variables·media/keyframes/container queries·component candidates·semantic sections 수집.
    - extractDesignLanguage가 raw crawl 결과를 다수 extractor로 fan-out하여 design object를 구성하는 구조.
    - DTCG token formatter가 $metadata, primitive, semantic 구조를 출력하는 구조.
    - battle, remix, pair, drift, clone, mcp의 핵심 작동 구조.
    - MCP resources와 tools의 URI/name 스펙.
- **불확실 — 추가 검증 필요**:
    - authors: [Manavarya09]는 사용자 제공 frontmatter와 GitHub owner 기준으로 유지했다. 다만 package.json의 author 필드는 masyv이고 license 관련 표기는 별도로 보이므로, 정식 저자명 표기는 maintainer 확인이 필요하다.
    - package.json의 "./mcp" export는 ./src/mcp/index.js를 가리키지만, GitHub UI에서 확인한 src/mcp 폴더 목록에는 resources.js, server.js, tools.js만 보였다. export target 누락인지 UI/브랜치 표시 문제인지는 확인 불가다.
    - “AI 에이전트가 긁어모은 스타일 데이터로부터 DTCG 토큰을 파싱한다”는 설명은 소스에서 그대로 확인되지 않았다. 확인된 구조는 deterministic extractor/formatter가 토큰을 만들고, LLM은 --smart 옵션에서 일부 분류를 보조하는 fallback이다.
    - GitHub UI의 star, fork, latest release 같은 저장소 메타데이터는 조사일 이후 변할 수 있다. 본 산출은 2026-06-10 열람 기준이다.
