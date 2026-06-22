---
created: 2026-04-30
updated: 2026-04-30
type: learning
tags: [claude-code, agents, skills, multi-agent, marketing, automation]
source: https://github.com/AgriciDaniel/claude-ads
category: method
---

# claude-ads — 전문 광고 감사/전략 에이전트 스킬

*AgriciDaniel*

[Claude Code의 기능을 확장하여 구글, 메타, 틱톡 등 멀티 플랫폼 광고 계정을 전문적으로 감사(Audit)하고 최적화하는 3계층 구조의 AI 에이전트 스킬셋입니다.]

---

## 한 줄 요약

> 250개 이상의 체크리스트와 멀티 에이전트 협업을 통해 주니어 마케터도 시니어급 광고 감사를 수행하게 돕는 **전문 지식 인코딩 스킬 패턴**.

---

## 핵심 개념

### 1. 3계층 아키텍처 (3-Layer Architecture)
- **Orchestrator (/ads)**: 사용자 명령을 수신하고 적절한 서브 스킬로 라우팅.
- **Sub-Skills (ads-google, ads-meta 등)**: 각 도메인별 깊은 전문 지식을 보유한 모듈.
- **Agents (audit-creative, audit-tracking 등)**: 실제 무거운 분석 작업을 병렬로 수행하는 실행 주체.

### 2. 병렬 서브에이전트 위임 (Parallel Delegation)
- `/ads audit` 명령 하나로 6개 이상의 전문 에이전트가 동시에 각기 다른 영역(소재, 추적, 설정 등)을 분석합니다.
- 복잡한 작업을 작은 단위로 쪼개어 전문성을 극대화하는 패턴입니다.

### 3. RAG & MCP 통합
- **RAG**: 25개 이상의 최신 벤치마크 및 가이드라인 파일을 참조하여 답변의 정확성을 확보합니다.
- **MCP (Model Context Protocol)**: Google Ads API 등 실시간 데이터 소스에 연결하여 수동 데이터 업로드 없이 직접 분석이 가능합니다.

---

## 기술 스택 / 사용법

- **기반 플랫폼**: Claude Code (Anthropic CLI)
- **구조**: `skills/` 디렉토리에 배치되는 모듈형 스크립트
- **데이터 형식**: JSON 스키마를 통한 구조화된 보고서 출력

```bash
# 전체 광고 계정 감사 실행
/ads audit

# 특정 산업군(SaaS)에 최적화된 전략 수립
/ads plan saas
```

---

## 내 생각 — AI NPC 관점

### 직접적 연결: [중간]

- **hwigi-tower**의 NPC 개발 도구인 `npc-harness`와 `npc-eval`을 설계할 때 가장 강력한 벤치마크가 될 수 있습니다.
- 특히 **여러 전문 에이전트가 병렬로 NPC의 대사를 검증(음성, 윤리, 일관성 등)**하는 구조를 짤 때 `claude-ads`의 3계층 구조를 그대로 이식할 수 있습니다.

### 개념적 수확

1. **지식의 스킬화 (Encoding Expertise)**: 단순한 프롬프트가 아니라, 수백 개의 체크리스트와 가이드라인을 '스킬'이라는 형태로 패키징하여 에이전트의 능력을 영구적으로 증폭시키는 방식.
2. **병렬 위임 패턴**: 혼자 모든 것을 판단하게 하지 말고, 영역별 전문 서브에이전트에게 맡긴 뒤 오케스트레이터가 종합하는 흐름의 유효성.

### 블루프린트 연결

- **Layer 2 (대화)**: NPC 대사의 품질을 `audit-voice`, `audit-canon` 에이전트로 나누어 병렬 검증하는 `npc-eval` 시스템의 아키텍처 모델로 활용.

---

## 열린 질문

- NPC의 '성격(Trait)' 마다 `claude-ads`의 플랫폼별 모듈처럼 별도의 'Personality Skill'을 만들어 장착할 수 있을까?
- MCP를 통해 Unity 에디터의 실시간 게임 상태를 `npc-harness`에 직접 연결할 수 있을까?

---

## 다음 학습 후보

- **[Everything Claude Code (ECC) — 에이전트 harness 성능 최적화 시스템](everything-claude-code.md)** — 156개의 스킬을 보유한 에이전트 하네스의 원조. `claude-ads`와 비교 연구 가치.
- **[Hugging Face ml-intern — 자율 ML 엔지니어 에이전트 아키텍처](ml-intern.md)** — 허깅페이스의 자율 ML 에이전트. `claude-ads`의 '작업 지향' 성격과 유사.
- **MCP SDK (Python/TypeScript)** — `claude-ads`가 실시간 데이터를 가져오는 기술적 표준.

---

## 연결된 페이지

- [Everything Claude Code (ECC) — 에이전트 harness 성능 최적화 시스템](everything-claude-code.md)
- [Hugging Face ml-intern — 자율 ML 엔지니어 에이전트 아키텍처](ml-intern.md)
- [OpenAI Codex CLI — 로컬 에이전틱 코딩 엔진](openai-codex-cli.md)
