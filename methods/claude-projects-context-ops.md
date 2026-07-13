---
created: 2026-07-11
updated: 2026-07-11
type: learning
tags: [claude, projects, context-ops, product-ops, retrieval, cowork, memory]
source: "사용자 제공 아티클(URL 미제공) + Anthropic Help Center 9 URL(HTTP 200) — Codex 해체분석"
authors: [anthropic-help-center]
year: 2026
category: method
---
<!-- Codex 해체분석 ③Gate 흡수(2026-07-11) — Claude Projects 컨텍스트 운영 델타(product-ops, context-eng taxonomy와 다른 축). -->

# Claude Projects — Context Ops (제품 운영 델타)

> ③Gate 통과(2026-07-11). SHA 일치·소스를 *교정*(오버클레임 잡음). [Context Engineering — 5 역할 분류 + 구현계획 컴파일러](context-engineering-five-roles.md) taxonomy와 **다른 축 = 제품 운영**(project-dossier·retrieval audit·memory 경계). ⚠ **수치 휘발성**(제품 기능 변화 빠름) — review_trigger로 재확인. [AI Employee Obsidian Stack — 파운더 운영 자동화 5피스 (2026-05-15 archive)](ai-employee-obsidian-stack.md)(2026-05)의 2026-07 product-fact 갱신.

## 1. 소스 교정 (Codex가 원문 오류 잡음)
- "프로젝트당 20파일" = **오류** → 20은 *채팅 업로드* 한도지 프로젝트 한도 아님(프로젝트 파일은 사실상 무제한).
- 파일 30MB/개 · 무료 5프로젝트 캡 · 대용량 시 RAG 조건부 발동(작은 컨텍스트는 전량 로드).
- ⚠ Cowork 스케줄 작업: 공식 페이지 간 모순(구 Apr-09 vs 신 cross-surface) — 해소 조작 없이 *모순 보존*.

## 2. 흡수 델타 (4종, non-dup)
1. **Project-dossier 템플릿** — 프로젝트 지식파일을 구조화(목적·계약·상태·경계). 컨텍스트 조각을 프로젝트 단위로 큐레이션.
2. **4-test retrieval/constraint audit** — 프로젝트가 (a) 관련 지식 인출하나 (b) 제약 지키나 (c) 무관 파일 배제하나 (d) 최신본 반영하나. 프로젝트 설정 후 검증 루프.
3. **Memory-as-cache 경계** — Claude memory = 세션 캐시지 *권위 지식 아님*. 권위=파일/DB(vault §0 북극성 정합). memory에 SSOT 위임 금지.
4. **Cowork scheduled-job 최소권한 프로파일** — 스케줄 작업에 least-privilege(read-only 기본·write scope 명시·side-effect 게이트).

## 3. 반영 (Apply-or-Park)
- **① Applied**: 본 노트(정본, 소형). [AI Employee Obsidian Stack — 파운더 운영 자동화 5피스 (2026-05-15 archive)](ai-employee-obsidian-stack.md)·[Zotero + NotebookLM 통합 제안 검증 archive](zotero-notebooklm-eval.md)·portfolio-refiner 링크. vault는 Obsidian 기반이나 Claude Projects 병용 시 이 운영 델타 참조.
- **skill_candidate: false** — dossier/audit 플로우 미측정(실프로젝트 3건 후 재검토).
- **미검증**: 제품 수치(30MB·5캡·RAG 트리거)는 Codex의 Help-Center reads 의존 — 휘발성, review_trigger 감시.
