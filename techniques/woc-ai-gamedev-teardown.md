---
created: 2026-06-22
updated: 2026-06-22
type: learning
tags: [game, teardown, deterministic-sim, ai-gamedev, architecture, rsi-apply, track1]
source: "https://github.com/levy-street/world-of-claudecraft (MIT, v0.9.1 / 63c7ca4)"
authors: [levy-street]
year: 2026
category: technique
---

# WoC 역기획 — AI 게임 생산 방법론 (10종 해체 종합)

> WoC v0.9.1(MIT, 원저자 허락) **전 소스 직접 통독**(src 150,520 LOC + 개발 docs 19,244 LOC) 역분석 종합. world-of-claudecraft-teardown-brief §3 Phase 1 산출(외주 계획 → 실제는 직접 통독으로 수행).
>
> **전문 10종**(715→1,819줄) = ClaudeCraft repo `docs/reverse-analysis/01~10`. 본 노트는 *농축 인출본* — 작가 게임개발에 쓸 패턴만. 상세 재독은 repo.

## 0. 정체

vanilla WoW류 MMO(TS·Three.js·Node·PostgreSQL). **LLM 통합 0**(이름만 Claude). 탐나는 핵심 = `src/sim/` 공유 결정론 코어 — 오프라인 브라우저 싱글 + authoritative 서버가 *동일* 동작. agent-harness H-03(model 경계)·H-04(결정론)와 동형을 MMO 규모로 구현한 레퍼런스.

## 1. 아키텍처 골격 (01)

- 단방향 의존 7모듈: `sim/`(규칙 코어, DOM/Three import 0) → `world_api.ts`(IWorld 계약 seam) → `render`/`ui`/`game`/`net`(IWorld만 읽고 명령) → `main.ts`(유일 조립부) + `admin/`(격리).
- **IWorld seam** = offline `Sim`·online `ClientWorld`가 같은 계약 구현 → UI/렌더러는 모드 차이를 모름. 새 데이터/액션은 world_api에 먼저 추가 → 양쪽 구현.
- 효과: 진실 소스 한 곳·프레젠테이션이 규칙 못 깸·온라인 전환 비용 낮음·AI 작업 단위 축소.

## 2. 실행 런타임 (06) — 정적 구조가 아닌 *동적 실행*

- **tick() 9단계 고정 순서**: 시계전진→리스폰→prevPos 스냅샷→플레이어 루프(이동·캐스팅·자동공격·리젠)→몹 루프(AI·aura)→전투상태 집계→서브시스템 고정순(duel→arena→trade→instance→market→delayed)→공간 재버킷팅(맨끝)→이벤트 드레인. 고정스텝 `DT=1/20`.
- **`dealDamage` = 모든 데미지 단일 수렴점** 13단계(흡수실드→가드→hp감산→위협 갱신→tap rights→분노생성→사망). threat 공식이 *여기서* 호출.
- ⚠ **RNG draw 함정**: melee는 miss/dodge **통합 1-roll**, ranged는 분리 roll. 통일하려다 draw 수 바뀌면 리플레이 깨짐.
- **결정성 5종**: 단일 `this.rng`(생성자 1회 고정)·`Map` 삽입순 iteration·고정스텝·threat 동점 선입유지(strict `>`)·생성자 draw 고정 시퀀스.
- 퀘스트 = tick 루프 없이 100% **이벤트 구동**(몹 사망·인벤 변동 순간만). 인스턴스/마켓은 `tick%20`(초당 1회) 분주.

## 3. 콘텐츠 / 스키마 (02·07)

- **Def(불변 authored) vs Entity(런타임) 2층** — Def는 `id`로만 참조, 런타임은 `templateId`로 Def 가리킴. `name`은 표시용 전용.
- **id 무결성은 어디서도 컴파일 강제 안 됨** — 룩업 throw + 테스트가 잡음. **단 talent 트리만 예외**(`validateTalentTree` 로드타임 중복/사이클/도달불가 throw).
- **talent modifier = flat precompute** — 할당을 1회 평탄화(stats/ability/global/grant 4축), hot path는 flat만 읽고 트리 안 걸음.
- **보스 기믹의 데이터화** — MobTemplate에 aoePulse·summon·enrage 등 20+ optional 필드. "새 기믹 = 데이터 필드 + sim hook 1개, 새 전투 수식 0".
- data.ts 병합: Record는 spread(키 충돌 시 **조용히 뒤가 덮음**), 보상은 9직업 아닌 3 아키타입 단위 authored. **트레이드오프**: 타입안전·압축 얻고 참조 무결성·조용한 덮어쓰기는 테스트로 사야 함.

## 4. 에셋 (03)

- **placeholder-first + manifest 4층**: logical id → manifest → loader/preload → runtime visual. gameplay 코드는 파일명 직접 안 듦.
- build가 media root 스캔 → **sha256 12자 hashed URL manifest 생성**(개발 참조 안정 ↔ 배포 캐시 안정 분리).
- placeholder도 최종과 *같은 manifest shape* 통과 → 교체 시 sim/UI 무수정. build pass ≠ visual acceptance(별도 게이트).

## 5. UI (04)

- **2채널**: 현재값(HP)=snapshot polling / 순간사건(피해숫자·로그·사운드)=event stream. 안 섞음.
- 갱신 주기 분리(castbar/cooldown=빠름, quest/social/map=느림, 집계는 정확·DOM은 throttling ~4Hz).
- hotbar=DOM보다 순수 데이터 함수 먼저. portrait=placeholder crest→준비되면 hydrate. i18n=generated table·pseudo-locale로 폭검증(나중 치환 X). 모바일=long-press peek vs click 억제.

## 6. 렌더 (08) — 개념만(작가는 libGDX/Java, Three.js 직접이식 X)

- **결정론 height = 단일 진실(hard invariant)**: render가 `sim/world.ts` height를 *직접 샘플링*, 재유도 금지 → seed만으로 월드 재현(가장 이식가치 높음).
- entity view **hysteresis**(80u 생성/96u 파괴 = 경계 thrash 방지)·거리² **LOD 사다리**·품질 tier 단일 `GFX` 객체·instancing by z-band 버킷·vfx **ring-buffer 풀**(per-frame new 0).
- sim 무지 시각 파생(swim/jump/stealth는 sim 읽기→렌더 로컬 계산, sim에 안 씀).

## 7. 네트워크 (09) — 작가 현재 싱글, "전환 대비" 관점

- **IWorld seam**: 읽기 ~25필드 + 명령 ~80개(전부 void, 결과는 snapshot/event로). REST(일회성: 계정·리더보드) vs WS(매틱 mirror) = 데이터 성격으로 분리.
- **delta guard 2층**(A-001 "핵심" 실증): lite/full 레코드 + self heavy field omission(`if undefined` = 누락=무변화, 빈값 default 금지). 깨지면 매 snapshot마다 로컬 상태 소실.
- command 권위 흐름: 클라가 결과 계산 0, 화이트리스트 optimism만. input ack/echo=RTT 측정이지 prediction 아님.

## 8. 프로덕션 메타 (10) — 개발 docs 해체

- **게이트가 사람 리뷰어를 대체**: 100% AI repo엔 모놀리스 통독할 사람이 없어서 작은 모듈+결정적 게이트(tsc·perf·parity·visual)로 전수 검증. 6,280줄 HUD를 25-phase 해체.
- **구현/QA 홀짝 교번** phase + 변경 표면별 validation matrix.
- **Strangler Fig + parity fixture**: seam→특성화 테스트→PR 1개씩→신구 공존→byte-identical.
- **PRD = spec↔code 바인딩**: 모든 hook이 `file:line`, 수용기준 기계검증, "코드가 진실·PRD는 spec·어긋나면 deviation 로깅".
- validation-report **severity 6단**(BLOCKING/HIGH/MED/LOW/HOLDS/**REFUTED**)·봇탐지 report-only+≥2 독립 family 게이트.

## 9. 작가 적용 — 학습→반영 루프

- **✅ 이미 반영**: renewed `ARCHITECTURE.md` 신설 — §2 실행·§3 콘텐츠를 INV-D1~5/INV-C1~5 계약으로 박제(전투·콘텐츠 확장 시 강제 상속). 현 코드 갭 G-D1(rng 3계통)·G-D2(seed 비결정) 식별.
- **⏭️ staged**: `DISPATCH_DETERMINISM.md`(R-DET-1) — rng 단일 stream + run seed 기록 교정 디스패치(작가 Codex 투입 대기).
- **후보(미반영)**:
  - libgdx-rogue-os → §2 결정성 5종·dealDamage 수렴점·§3 id 스키마(SPD급 D-044 직접 이식).
  - Sub-brain 헌법 차용 6종(§8, 10번 문서) → 구현/QA 홀짝·Strangler parity·PRD file:line·severity 6단·봇탐지 철학·에셋 staging. HITL 스테이징 영역(felt-need만, 과적용 가드).

## 10. 핵심 메타교훈

- **"AI가 강한 건 파일 많이 읽기가 아니라 경계 선명한 코드에서 작은 결정을 정확히 바꾸기"** — 역기획 전체가 *경계·계약·proof gate*로 수렴. 작가 헌법(Karpathy #3·③Gate·proof-ready≠accepted)과 동형.
- 정적 구조(01~03)는 1차 WebFetch로도 잡히지만, *동적 실행*(06 tick·결정성·RNG draw 함정)은 **전 소스 통독**에서만 나온다 — [리서치는 전문 통독 — 인접한 것까지 뽑아 박제](../methods/research-thoroughly-extract-adjacent.md) 실증.
