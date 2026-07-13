---
created: 2026-07-10
updated: 2026-07-10
type: learning
tags: [game-design, game-architecture, unity, survival-sandbox, modding, data-driven-content, quest-design, ugc]
source: https://github.com/SmartlyDressedGames/U3-SDK
authors: ["Smartly Dressed Games", "Nelson Sexton"]
year: 2026
category: technique
---
<!-- Codex 해체분석 ③Gate 흡수(2026-07-10, clean-room) — 장수형 모드 샌드박스의 콘텐츠 문법. ⚠독점 라이선스=코드복사 금지, 원리만. -->

# U3-SDK — 장수형 모드 샌드박스를 지탱하는 콘텐츠 문법

> ③Gate 통과(2026-07-10). Unturned SDK(SmartlyDressedGames, SHA `ea7b497`) clean-room 해체. **⚠ 독점 라이선스** — 코드/포트폴리오 재사용 금지, *구조·원리·검증 계약만* 재서술. 무결성: SHA·commit(14개)·enum 카운트 검증(조건/보상 각 28 enum = NONE sentinel 포함, 실질 27).

## 1. 한 줄 명제
Unturned의 강점 = 기능 개수가 아니라 **아이템·대화·퀘스트·스폰·월드를 데이터 자산 + 조건/보상 문법으로 묶고, 서버 검증·하위 호환·모딩 도구가 그 콘텐츠를 오래 살게 한 구조**. 숨은 핵심 제약 = *콘텐츠가 수년간 계속 늘고 충돌하고 이동해야 한다* → 이 제약이 아키텍처를 밀었다.

## 2. 5개 신규 축 (vault 직접 정리 없음 — 흡수 델타)
1. **shared condition/reward 문법**(최고가치): 대화·퀘스트·제작이 별도 시스템처럼 보이나 실은 `현재 상태가 조건집합 만족? → 노출/실행 → 소비성이면 적용 → 보상/효과로 상태 변경` 규칙 공유. 새 조건·보상 원시형 1개가 여러 시스템에 파급 → 콘텐츠 *조합 가능*. 퀘스트 = 거대 FSM 아닌 `활성목록+조건평가+완료플래그`. ⚠ 결정론적 규칙 시스템 — NPC 기억·학습·계획 아님.
2. **origin-aware asset mapping**: "같은 게임" = 로컬 전 파일이 아니라 *현재 세션이 합의한 콘텐츠 집합*. 공식/Workshop/서버 충돌 = 예외 아닌 정상 운영.
3. **GUID 정본 + legacy ID redirector**: 16-bit ID↔GUID 병행, 리다이렉터가 옛 참조 이동(무한루프 32회 상한). 콘텐츠 이름·위치 바뀌어도 저장·퀘스트·모드 참조 불파손. 패턴: `stable key → origin → version/schema → redirect/migration → conflict policy → integrity hash`.
4. **incremental region visibility**: 8192공간을 64×64 지역(128단위)으로. `RegionIncrementalVisibilityTracker`가 카메라 이동 시 진입/이탈 지역만 여러 프레임 분산 갱신(순간이동=즉시 동기). "오픈월드" = 넓은 지형 한 장 아닌 *공간인덱스+가시성예산+관심영역+저장파티션*.
5. **metadata-preserving rewrite**: `MetadataPreservingDatWriter` = 파싱·수정 후에도 키 순서·주석·빈 줄 보존(round-trip 테스트). AI/도구가 지식 수정 시에도 *인간의 배치·주석·검토 흔적 보존* — Sub-brain 직결 수확.

## 3. 서버 권위 계약 (제작/퀘스트 공통)
제작 UI는 승인자가 아니다 — 서버가 현재 상태로 *재*판정: `요청자·레이트리밋 → 플러그인 훅 → 소유/인덱스 검증 → 맵·스킬·작업대·NPC 조건 → 인벤토리 재검색 → 입력 소비 → 변형/생성 → 조건·보상 → UI/통계`. 무한 제작 64회·리다이렉트 32회 상한. 공통 최적화 패턴 = `실패 사례 → 경계/상한/해시/모드 플래그 → 로그 가능한 계약`.

## 4. 반영 (Apply-or-Park)
- **① Applied**: 본 노트(정본, 5축 상호의존 → 단일 노드). 연결: [Homegames — Browser Game Platform Patterns](../methods/homegames-browser-game-platform-patterns.md)(UGC publish gate + origin-aware mapping)·[감정 공학의 기술 — 잊을 수 없는 퀘스트의 10가지 디자인 원칙 (CDPR 플레이북)](emotional-engineering-quests.md)(조건/보상만으론 "기능 퀘스트"지 "기억 퀘스트" 아님 — 가시 결과 proof 병행)·[제약 기반 게임 창의성 — 불편한 조건이 설계를 끌고 가게 하기](../methods/constraint-driven-game-design.md)·[적 의사결정 — Utility AI + GOAP 하이브리드 ("무엇을 하나")](enemy-decision-making.md)(weighted random은 seeded RNG+trace 없이 결정론 프로젝트 부적합).
- **② Parked(트리거: 콘텐츠/퀘스트 시스템 또는 UGC 게임 착수)**: §6 제안 도구 3종(Content Grammar Canvas 10칸·Quest Implementation Contract·Mod-friendly Content Gate) = **Codex 제안 tooling(source-derived 아님)**, provisional 유지·작가 확정 전 method 잠금 X. 구현은 활성 프로젝트 AGENTS/결정 조회 후 별도 디스패치. → codex-gate-park-backlog-2026-07-09.

## 5. Anti-overclaim
5229파일 전수 X(대표 축 정적검색). Git 이력으로 개발 연대기 복원 불가(14 commit·2026-07-06 일괄 스냅샷). 빌드·플레이 테스트 0. 조건/보상 문법 = LLM NPC *아래 결정론 실행층*으로만(환각 지급·위조 완료·무권한 순간이동 차단), 규칙층만으로 "배웠다" 주장 금지.
