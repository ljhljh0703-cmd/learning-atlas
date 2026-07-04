---
created: 2026-06-29
updated: 2026-06-29
type: learning
tags: [ai-coding, product-work, taste, agent-harness, gate, methodology]
source: "https://www.youtube.com/watch?v=P3KDebPTUrw"
authors: [Andrew Ambrosino]
year: 2026
category: method
---
<!-- AI 코딩 시대 제품 작업법: 구현이 싸지면 병목은 선별·medium·stage·taste·삭제로 이동 -->

# Codex Product Work Shift — 구현은 싸지고, 판단이 귀해진다

> 출처: Lenny's Podcast, "OpenAI Codex lead on the new shape of product work" (Andrew Ambrosino, 2026-06-28). ③Gate PASS 2026-06-29 (외부 Codex 해체 → vault Claude 1차출처 transcript 줄단위 재대조, 8/8 주장 grounded·환각 0). **흡수 = 방법론만. 제품 사용률 수치·OpenAI 로드맵 주장은 비흡수**(호스트 발화 source claim, 독립검증 안 됨).

## 한 줄
AI가 구현 비용을 낮추면 병목은 "코드를 쓸 수 있나"가 아니라 **무엇을 만들지 / 어떤 medium으로 검증할지 / 언제 ship-ready라 부를지 / 어떤 취향·역할로 선별·삭제할지**로 이동한다.

## vault 델타 (이미 있는 골격에 더해지는 6가지)
기존 정본 — [The New SDLC With Vibe Coding (Google / Addy Osmani)](google-new-sdlc-vibe-coding.md)(Agent=Model+Harness) · agent-harness(RETURN/Gate·증빙2층) · dispatch-builder(목적/스코프/검증·역면접) · [Matt Pocock의 에이전틱 워크플로우 (하네스 공학)](matt-pocock-agentic-workflow.md)(queue not loops) · [Building Effective Human-Agent Teams — 인간-에이전트 협업 팀 구축 방법론](building-effective-human-agent-teams.md)(roster·Doer-Verifier·model-change retest·human-only) · design-taste·design-engine-brief — 위에 다음만 추가된다.

1. **Medium Gate** — 작업 전에 document / prototype / fixture / 공유 HTML 중 무엇인지, 그리고 검증하려는 불확실성이 *product clarity*인지 *interaction*인지 *model capability*인지 먼저 라벨.
2. **Artifact Stage Label** — "돌아감 ≠ accepted". `concept_doc → interaction_probe → future_model_fixture → ship_candidate → accepted`(accepted는 human/vault Gate 이후만). 기존 `PROOF_READY_NOT_ACCEPTED` 감각을 제품/프로토타입 계층으로 확장.
3. **Taste 확장** — 미감이 아니라 *system fit · semantic interaction · medium choice · novelty vs pattern · 삭제 판단*. (AI가 design에 약한 이유 = code는 compile/test feedback이 명확하나 design은 인간 taste가 feedback loop 안에 있음.)
4. **Dormant Fixture** — 현재 모델로 안 되는 아이디어를 폐기 말고 model-change retest용 fixture로 보존. 단 "미래엔 될 것"을 현재 ship 근거로 삼지 않음. ([Building Effective Human-Agent Teams — 인간-에이전트 협업 팀 구축 방법론](building-effective-human-agent-teams.md) model-change retest와 정합.)
5. **Deletion Gate** — AI 작업은 complexity를 늘리기 쉬움 → promote 전에 "added"뿐 아니라 *deleted / merged / deferred / explicitly-kept*를 보고.
6. **Specialty Tool Bridge** — agent가 전문 도구를 직접 못 다루면 새 앱보다 *기존 도구의 extension/connector/wrapper*가 더 가치 있다(영상: Premiere Pro extension 사례). 공유 기술의 기준 = "보이게 포장"이 아니라 "기존 고가치 작업면과 안전하게 연결되는가". → popup류 thin SaaS 공유 래퍼보다 우위(작가 판정 폐기, vault 미흡수).

## 거부할 anti-pattern
"PRD는 죽었다, 이제 prototype만" / "돌아가니 ship" / "AI가 코드 100% 썼으니 frontier" / "PM·design 없애고 다 builder" / "loop 걸어두면 알아서 개선" / "모델이 좋아질 예정이니 현재 실패를 성공으로 간주".

## 반영처 (학습→반영 루프)
시스템 파일 패치 후보는 §시스템 잠금 대상이라 `스테이징 영역/` 스테이징으로 분리(작가 merge):
- dispatch-builder 슬롯1~3 앞 `medium_gate` 질문 추가
- agent-harness H-09/P5 근처 `complexity/delete gate` 보강
- design-taste 정의에 system-fit·semantic·medium·deletion 축 추가
- design-engine-brief evaluation axis에 medium-selection·artifact-stage
- GUIDE 외부 공유 HTML에 `artifact_stage` 메타
