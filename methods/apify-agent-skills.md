---
created: 2026-05-03
updated: 2026-06-16
type: learning
tags: [agent-skills, apify, skill-framework, web-automation, markdown-first]
source: https://github.com/apify/agent-skills
category: method
authors: Apify
---

# Apify Agent Skills

Apify에서 공개한 에이전트 전용 스킬 프레임워크 ([apify/agent-skills](https://github.com/apify/agent-skills)).

## 1. 핵심 아키텍처 (Core Architecture)

- **Markdown-First**: 모든 스킬은 `SKILL.md`라는 마크다운 문서로 정의됨. 이는 에이전트(LLM)가 스킬의 의도와 사용법을 가장 직관적으로 이해할 수 있게 함.
- **Actor-Centric**: 스킬의 실제 실행 로직은 Apify의 'Actor'(클라우드 기반 서버리스 프로그램)를 호출함. 로컬 환경의 제약을 벗어나 웹 스크래핑, 브라우저 핑거프린팅 등의 무거운 작업을 클라우드에서 수행.
- **Registry & Discovery**: `AGENTS.md`가 스킬 인덱스 역할을 하여 에이전트가 가용 스킬을 스스로 탐색할 수 있게 함.

## 2. 통합 및 도구 (Tooling)

- **Native Support**: Claude Code, Gemini CLI, Cursor, Windsurf 등 주요 에이전틱 도구들과의 네이티브 설정 파일(`.claude-plugin`, `gemini-extension.json` 등)을 제공.
- **CLI**: `npx skills add`를 통해 스킬을 쉽게 추가하고 관리 가능.

## 3. 차별점 (Differentiators)

| 구분 | Apify Agent Skills | MCP (Model Context Protocol) |
|------|--------------------|-----------------------------|
| **성격** | 고수준 스킬 라이브러리 (콘텐츠 중심) | 도구 간 통신 규격 (프로토콜 중심) |
| **실행** | Apify 클라우드 기반 (Actors) | 로컬 또는 지정된 서버 |
| **강점** | 웹 자동화, 프록시 관리, 장시간 작업 | 도구 간 인터페이스 표준화 |

## 4. Sub brain 및 AI NPC 응용 제안

### ① NPC의 '외부 세계 인식' 레이어 (Layer 4/5)
- **적용**: `hwigi-tower`의 NPC 마타이오스에게 "현실 세계의 소식을 가져오는 능력"을 부여. 예를 들어, 마타이오스가 "지금 현실 세계의 날씨는 어때?"라고 묻거나 실제 웹 데이터를 바탕으로 발화를 생성할 때 Apify 스킬을 호출.

### ② Sub brain의 웹 자동화 모듈 (Methods)
- **적용**: 현재 Sub brain은 로컬 파일 위주임. Apify 스킬을 `workflows/`에 통합하여, "특정 주제에 대한 최신 논문을 ArXiv에서 긁어와서 요약해줘"와 같은 작업을 수행할 때 Apify Actor를 백엔드로 활용.

### ③ 'SKILL.md' 컨벤션 흡수
- **적용**: 우리 프로젝트의 `skills/` 디렉토리 내 문서 구조를 Apify의 `SKILL.md` 포맷과 호환되게 정제. 이는 향후 다른 에이전트(Claude Code 등)가 우리 위키를 읽을 때 스킬 인지 능력을 높이는 데 기여함.

---
## 학습 큐

- [ ] [1단계] `npx skills add`로 실제 스킬 하나(예: Google Search)를 Sub brain에 실험적 추가
- [ ] [2단계] `SKILL.md` 템플릿을 우리 `skills/npc-eval` 등에 역이식 검토
- [ ] [3단계] Apify API 키 보안 관리 방안 수립 (`.env` 연동)
