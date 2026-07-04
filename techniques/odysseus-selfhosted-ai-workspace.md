---
created: 2026-06-30
updated: 2026-06-30
type: learning
tags: [self-hosted, ai-workspace, agent, memory, deep-research, reference-study, external-oss]
source: https://github.com/pewdiepie-archdaemon/odysseus
authors: [pewdiepie-archdaemon]
year: 2026
category: technique
---
<!-- 프로덕션 self-hosted AI 워크스페이스 구조 스터디. ⚠️ 외부 OSS(PewDiePie, MIT) — 작가 구축 아님, 이력서 자산 X. 참고용 clone 스터디만. -->

# Odysseus — self-hosted AI 워크스페이스 구조 스터디

> **⚠️ 출처·성격**: `pewdiepie-archdaemon/odysseus`(MIT) — **외부 오픈소스, 작가 구축 아님.** 작가 = 참고용 clone 스터디(2026-06). **이력서·포폴에 작가 프로젝트로 절대 싣지 말 것** (cold-verify 확정, git 커밋 작가 0건).
> **무엇**: ChatGPT/Claude 같은 UX를 자기 하드웨어·자기 데이터로 돌리는 self-hosted AI 워크스페이스. local-first·privacy-first. "프로덕션 AI 워크스페이스가 어떻게 조립되는가"의 참고 표본.

## 1. 아키텍처 (참고)

- **FastAPI** 엔트리(`app.py`) + 모듈형 `routes/`·`services/`·`src/`.
- **Agent** — `opencode` 위에 구축([opencode — 모델독립 에이전트 하네스 #2 (컨텍스트 조립 *엄밀성* 정본)](opencode-agent-harness.md) = vault 모델독립 하네스 #2와 동일 베이스). MCP·web·files·shell·skills·memory 도구.
- **Memory** — ChromaDB + fastembed(ONNX) + **vector + keyword 하이브리드 검색**. import/export. 시간 경과 진화.
- **Deep Research** — Tongyi DeepResearch(Alibaba) 적응. multi-step gather→read→synthesize→visual report.
- **Cookbook** — llmfit 기반. 하드웨어 스캔→VRAM-aware fit scoring→vLLM/llama.cpp 서빙.
- **MCP 서버** — 빌트인 auto-register, npx lazy(캐시 있을 때만, fresh install 블로킹 방지).
- 부가: Compare(블라인드 멀티모델)·Documents(멀티탭 에디터)·Email(IMAP/SMTP AI triage)·Calendar(CalDAV)·PWA 모바일.

## 2. 흡수 가치 (참고 표본으로서)

- **하이브리드 메모리 리트리벌**(vector+keyword) = vault의 [Gemini Agentic RAG & Sufficient Context Implementation](gemini-agentic-rag.md)·북켓몬 Dense+BM25 하이브리드와 같은 패턴의 프로덕션 사례.
- **opencode 위 워크스페이스 레이어** = 하네스(opencode) 위에 *제품(워크스페이스)*을 얹은 실물. vault 북극성(모델독립 하네스)의 응용 표본.
- **self-hosted·local-first 운영 모델** = mirofish-korean-sim-blueprint·인프라-0 철학과 대비 참고(odysseus = 무거운 풀앱, sub-brain-engine = 경량 프로토콜 — 같은 "개인 AI 도구"의 양극).
- **보안 모델** = admin 콘솔 취급·auth 게이팅·per-user privilege·fork 전 `git status` 누출 점검 — 자기호스팅 배포 가드 참고.

## 3. ③Gate / 가드

- **출처 정합**: git remote·커밋 전부 `pewdiepie-archdaemon` → 작가 구축 아님 확인.
- **이력서 분리**: 작가 산출 0 → 이력서·포폴 등재 금지. 본 노트는 *학습 참고*로만.
- **반영처**: 순수 참고 지식(억지 반영 X, Karpathy #2). vault 메모리/하네스 패턴의 *외부 확증* 1건으로 족함.
