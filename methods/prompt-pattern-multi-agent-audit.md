---
created: 2026-04-30
updated: 2026-04-30
type: learning
tags: [prompt-pattern, agents, orchestration]
category: method
---

# Pattern: Multi-Agent Audit (병렬 위임 감사)

## 🎯 적용 상황 (Problem)
- 하나의 에이전트가 너무 많은 차원(예: 문법, 윤리, 팩트, 일관성)을 동시에 검증해야 해서 성능이 평준화되거나 누락이 발생할 때.

## 🛠️ 솔루션 (Instruction)
"오케스트레이터가 작업을 쪼개어 **전문 서브에이전트**에게 병렬 위임하고 결과를 취합하라."

1. **Orchestrator**: 전체 컨텍스트 파악 및 작업 분배.
2. **Sub-Agents**: 독립된 체크리스트를 가진 전문 분석가.
3. **Consolidator**: 각 에이전트의 리포트를 읽어 우선순위 기반 최종 verdict 도출.

## 📊 실험 및 관측 (Evidence)
- **claude-ads**: 250개 체크리스트를 6개 에이전트가 나눠서 수행할 때 누락률 0% 달성 확인.
- **npc-eval (예정)**: NPC 대사의 '보이스'와 '윤리'를 분리 검증하여 상충하는 상황 처리 가능.

## ⚠️ 트레이드오프
- API 호출 횟수(비용) 증가. 로컬 실행 시 레이턴시 발생.

---

## 🚀 Skill 화를 위한 메타데이터
- **Version**: 1.0
- **Target Models**: Claude Code, Codex, Custom multi-agent systems
- **Primary Use**: Content auditing, System refactoring, Security checks
