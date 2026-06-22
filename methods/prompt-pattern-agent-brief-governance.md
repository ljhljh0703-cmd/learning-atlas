---
created: 2026-04-30
updated: 2026-04-30
type: learning
tags: [prompt-pattern, governance, agents-md]
category: method
---

# Pattern: Agent Brief Governance (AGENTS.md)

## 🎯 적용 상황 (Problem)
- 새로운 프로젝트를 시작할 때마다 에이전트에게 컨벤션과 아키텍처를 다시 설명해야 할 때.
- 에이전트가 프로젝트 고유의 '잠긴 결정'을 어기고 임의로 코드를 수정할 때.

## 🛠️ 솔루션 (Instruction)
"프로젝트 루트에 **프로젝트 특화 DNA**만 담은 간결한 브리프(`AGENTS.md`)를 비치하라."

- **규칙 1**: 시스템 프롬프트가 아는 일반적인 지식(예: "코드 깔끔하게 짜")은 적지 않는다.
- **규칙 2**: 해당 프로젝트에서만 통용되는 **잠긴 결정(LOCKED)**과 **절대 금지(BANNED)**만 명시한다.
- **규칙 3**: 에이전트가 작업 시작 전 이 파일을 반드시 읽게 강제한다.

## 📊 실험 및 관측 (Evidence)
- **Codex CLI**: `AGENTS.md` 도입 후 불필요한 분석 턴이 줄어들고, 결정된 아키텍처(Pillar)를 준수하는 비율 급증.
- **hwigi-tower**: v0.5 브리프 적용으로 솔로 개발 컨텍스트 유지 비용 감소.

## ⚠️ 트레이드오프
- 브리프 파일이 200줄을 넘어가면 에이전트의 집중력이 흐트러짐 (짧고 강렬하게 유지 필수).

---

## 🚀 Skill 화를 위한 메타데이터
- **Version**: 1.1 (Codex/Warp 호환)
- **Target Models**: Codex, Cursor, Claude Code, Gemini CLI
- **Primary Use**: Repo-specific instructions, Team conventions
