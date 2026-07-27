---
created: 2026-07-26
updated: 2026-07-26
type: learning
tags: [agent-skills, skill-authoring, game-dev, threejs, demo-gate, teardown, deterministic-gate]
source: "https://github.com/MengTo/Skills (MIT, 21b278c · 2026-07-25) · 공지 https://www.threads.com/@mengto/post/DbNQ5z4jLMS · 실물 https://vesperfall.mengto.chatgpt.site"
authors: [Meng To]
year: 2026
category: method
---
<!-- Meng To 의 121-스킬 라이브러리 통독 해체 — 값은 광고된 게임 스킬이 아니라 *데모 검증 게이트*와 *스킬 밀도 규약*에 있다. -->

> ⚠️ **임시 (provisional)** — AI 작성, 작가 컨펌 전. 결론(특히 §5 판정)은 작가 검토 대상.

# Meng To Skills 라이브러리 해체 — 데모 게이트가 본체다

## 1. 실측 지형

`21b278c` · MIT · **121 SKILL.md / 12,942줄**(평균 107줄) · 812파일 130MB(대부분 데모 스크린샷 3840w jpg).

| 카테고리 | 스킬 | demo/ 보유 | 특징 |
|---|---|---|---|
| web-design | 79 | **73** | 대부분 *비주얼 스타일 프리셋*(색·무드 이름). 최대 617줄 |
| codex | 18 | 13 | 메타·운영 스킬(`article-prompts-to-skills`·`audit-verify-explain-grade-5`) |
| **game-development** | **19** | **0** | 공지가 광고한 패밀리. 897줄(평균 47줄, 5개는 정확히 20줄) |
| media / ui / customer-support | 5 | 3 | 소품 |

각 스킬 폴더 = `SKILL.md` + `agents/openai.yaml`(3줄 인터페이스 매니페스트) + 선택적 `demo/`·`references/`.

## 2. 배울 것 ①(최고값) — 데모 검증 게이트, LLM 0회

`scripts/validate-skill-demos.mjs` 가 스킬마다 딸린 `demo/` 를 **결정론적으로** 검사한다. 전건 실측:

- `index.html`: doctype · `lang` · viewport meta · `<title>` · `<main>` 랜드마크 · **h1 정확히 1개**
- **reduced-motion 폴백 필수**
- **원격 URL 금지** — 데모는 self-contained
- **`<local-path> 절대경로 금지 · 이메일 문자열 금지**(개인정보·경로 누출 가드)
- 참조 파일 존재 + **데모 폴더 밖 참조 금지**
- `preview.jpg`: JPEG · **공유 뷰포트(1280×720) 고정 — 캡처 크기 drift 시 FAIL** · ≤2MB / 에셋 ≤5MB
- `source.json` provenance 파싱 가능

**왜 vault 에 값인가.** vault 스킬 라이프사이클은 provenance(`origin`/`state`)+mtime 만 본다 — **"이 스킬이 실제로 뭔가를 만들어낸다"는 증거를 요구하지 않는다.** 위 게이트는 그 빈칸을 채우는 형태이고, LLM 호출 0·grep/파일검사만이라 vault 의 deterministic-first·infra-0 와 정합한다. 개별 항목은 이미 vault 에 흩어져 있다(self-contained=Artifact CSP · 절대경로/이메일=clean-room · h1 1개=integrity-lint 헤딩 · 참조 존재=broken_links · 캡처 drift=배포 캐시우회 비협상). **새로운 것은 그것들을 *스킬의 증명물*에 묶어 1개 스크립트로 강제한 배치.**

## 3. 배울 것 ② — 스킬 밀도: 38줄로 규율을 다 담는다

`build-isometric-arpg`(38줄, 코드 스니펫 0)의 실제 내용 —

- **수직 슬라이스 순서 고정**: 이동·카메라·충돌·타깃·일시정지 → 전투 동사 1개+접촉/피해/자세/회복/사망 → 적 1종+텔레그래프·판단루프·카운터플레이 → 보상 1개+원자적 인벤토리 → 존 전환 1개.
- **게이트**: *"앞 슬라이스가 게임플레이 증거·자동 커버리지·안정된 save/load 를 갖기 전에는 두 번째 시스템을 추가하지 마라."*
- **안티패턴 실명**: *"권위 있는 접촉 이벤트를 소비하라 — 시각 상태로 물리 결과를 추론하지 마라."* / 전투 클럭 중복 금지 / 장비·픽업·세이브 마이그레이션은 원자적·멱등.
- **테스트 가능성**: 보스 페이즈 전환·빈 인벤토리·중단된 액션·세이브 마이그레이션 같은 어려운 상태에 **리뷰 쿼리 파라미터/픽스처 제공**.
- **보고 규율**: *"알려진 baseline 실패를 신규 실패와 분리해 보고하라."*

마지막 항목은 vault 의 `lessons` **"완료 과잉선언 금지 — 5-state 분리 보고"**(2026-07-17)와 같은 명제다 — 게임 QA 쪽에서 독립 도달. 그리고 이 밀도는 vault 규율(`SKILL.md ≤500줄`·행동 로직만·예시 물리 분리, 🔒2026-06-27)의 *상위 실천* 이다. 대조로 vault 가 금지선으로 둔 500줄을 이 저장소도 1건 위반한다(`cinematic-gsap-lenis-motion-system` 617줄).

## 4. 배울 것 ③④ — 패밀리 경계 문서 · 멀티런타임 어댑터

- `game-development/README.md` 에 **"Important boundaries"** 절: `build-threejs-enemy-systems`(이식 가능한 적 콘텐츠) ⟂ `build-game-monster-system`(개별 리그·애니메이션 적합성) ⟂ `tune-enemy-ai`(적이 *무엇을 할지*), `design-action-combat`(전투 동사) ⟂ `design-game-encounters`(동사를 압박·페이싱으로 조합). → vault §1.5 Description Routing Contract("이웃 skill 과 어떻게 다르게")를 *패밀리 레벨 문서*로 구현한 형태. vault 엔 헌법 라우팅표는 있으나 패밀리 경계 문서는 없다.
- `agents/openai.yaml` 3줄(`display_name`·`short_description`·`default_prompt`)로 같은 SKILL.md 를 **런타임별로 노출**. vault 는 Claude 스킬 ⟂ Codex `AGENTS.md` 로 갈라져 있고 스킬 단위 어댑터는 없다.

## 5. 비판적 검증 (실측)

1. **공지 ≠ 산출물.** 게시물은 "카메라 컨트롤·VFX·오디오·몬스터 에셋·전투 시스템"을 열거하지만, **게임 소스는 저장소에 없다.** `scripts/` 제외 코드 파일 **19개 = 전부 vendored 라이브러리**(three.min.js·gsap.min.js 등, web-design 데모용) + React 컴포넌트 1개. 문구 자체는 "skills"라 정확하나, 통상 독법("게임 개발물을 오픈소스화")과는 어긋난다. 열린 것은 *산문 규약*이다.
2. **광고된 패밀리가 가장 덜 익었다.** game-development 19개 = 897줄, 5개는 20줄. 라우팅 표(README) 만 60줄 — **인덱스가 본문보다 길다.** 커밋도 `codex/upload-three-game-skills` 가 공지 **하루 전** 머지. 축적된 라이브러리가 아니라 갓 덤프된 층이다.
3. **★ 그 패밀리가 이 저장소의 최고 자산에서 제외돼 있다.** `demo/` 보유 = web-design **73/79** vs game-development **0/19**. `DEMOS.md` 는 "Every tracked skill has a portable demo"라 쓰지만 문서 전체에 `game` 이 **0회** 등장한다. 즉 **자기 품질 게이트를 광고 대상에 적용하지 않았다.** 20줄 스킬 대부분은 acceptance criterion 도 없다 → *검증 없는 규율*.
4. **얇음의 이면 = 모델 의존.** 코드 0·스니펫 0이므로 스킬은 모델이 이미 Three.js 를 안다는 전제에 전적으로 기댄다. 프런티어 모델엔 충분하고 약한 모델엔 무의미하며, 어느 쪽이든 저장소만으로는 재현·측정 불가.
5. **web-design 78개는 *타인의 취향*이다.** `funky-purple-container-tech`·`orange-clean-paper-saas` 처럼 스타일 프리셋의 스킬화 — vault 가 bespoke-html-direction/ParkDal 폐기로 정리한 방향의 반대편이고, 외부 취향 이식은 작가가 봉인한 계보다. **가져오지 않는다.**
6. **실물 증거는 존재하나 호스팅이 취약.** Vesperfall("The Three Tolls", Ashen Causeway 튜토리얼, Vitality/Resolve/Power/Guard/Burden 스탯, asset-catalog)은 실제로 로드된다 = 규약이 공백 이론은 아니라는 앵커. 단 `*.chatgpt.site` 프리뷰 호스트라 링크 부패 위험이 있어 인용 시 날짜 고정 필요.

## 6. vault 대조 (delta)

- [WoC 역기획 — AI 게임 생산 방법론 (10종 해체 종합)](../techniques/woc-ai-gamedev-teardown.md)(WoC, 2026-06-22 흡수)와 **겹치지 않는다.** WoC = 결정론 시뮬레이션 *아키텍처*. 본 건 = 스킬 *패키징·검증 규약*. 교집합은 "브라우저 AI 게임"이라는 표면뿐.
- **적용면 현실**: 작가 게임 레인은 Unity(hwigi-tower, 전면 중단) · libGDX/Java(libgdx-rogue-os) · 2D 픽셀(pixel-art-pipeline)이다. **Three.js/웹 스택은 작가 레인에 없다.** 따라서 §3 게임 규율은 *스택 무관 부분*(수직 슬라이스 게이트·접촉 권위·픽스처·baseline 분리 보고)만 이식 가치가 있고, Three.js 특정분은 순수 참조다.

## 7. 반영 판정 ([학습→반영 루프 (Absorb-to-Apply)](../narrative/학습→반영 루프.md) 3-way)

- **②파킹 + 이름붙은 트리거** — §2 데모 게이트. 반영처 = agent-skill-quality-gate(신설 X, 기존 owner 확장). 트리거 = *다음 skill 신설·승격 시*. 지금 배선하지 않는 이유 = 모집단(신규 스킬)이 그 시점에 생기고, vault 스킬 다수는 데모 개념이 부적합(문서형).
- **③순수 참조** — §3 Three.js 특정분·§4 멀티런타임 어댑터(현 2-AI 체제에 불필요)·web-design 78종(취향 봉인).
- **②파킹 + 이름붙은 트리거** — §8.1 몬스터 계약(4층·5레이어·시맨틱 소켓·프레임데이터·순수 샘플러·actionId 멱등) + §8.4 유리링 짝. 반영처 = libgdx-rogue-os(작가 활성 게임 레인). 트리거 = *전투/적 시스템 착수 시*. **인용 가드(§8.4 정정판)** = 유리링 archive 의 *용어·구조*는 provisional 표기와 함께 사용 가능 / *수치·밸류·계수·지표*는 PDF 원본 대조 없이 인용 금지(c31·c35 는 복원 시 수정 필수). 앞서 이 자리에 적었던 "c31/c35 정정이 선행 조건" 은 **과도했다** — 인용 대상(c20·용어)이 날조 목록 밖이다.
- **반영 diff 0** — 이번 흡수로 즉시 고친 파일 없음. 정직 선언.

## 8. 작가 지목 3계통 심층 (몬스터 · 스킬 이펙트 · 직업 선택)

작가 지목: *"스킬 이펙트나 몬스터, 직업 선택 등 내가 만들고 싶은 부분"*. 셋의 실제 깊이는 **극단적으로 다르다.**

### 8.1 몬스터 — 최상급, 엔진 무관 (SKILL 63줄 + `references/monster-contract.md` 217줄)

저장소 전체에서 유일하게 **계약서 수준**이다. 이식 가치 있는 골자 —

**4층 분리** (각 층의 금지사항이 명시됨)
1. `MonsterDefinition` — authored·**런타임 불변**: id·archetype·tags·asset{kind procedural|glb|hybrid, source, license, metersPerUnit, forwardAxis, provenance}·stats{maxHealth, posture, moveSpeed, turnRate}·locomotion{radius, height, stepHeight}·attacks·movesets·budgets. 체력·쿨다운·타깃·타이머는 **여기 두지 않는다.**
2. `MonsterRig` — joints/sockets/colliders/hurtVolumes/attackVolumes/animationHooks/lods + `setState(state, elapsed, ctx)`·`resetPose()`·`dispose()`.
3. `MonsterRuntime` — 상태·타이머·의도·체력/포스처·쿨다운·**권위 전투 이벤트**.
4. `MonsterViewAdapter` — 리그 포즈·VFX·오디오·가시성·LOD를 런타임 상태로부터 구동. **"렌더된 포즈로 히트를 판정하지 않는다."**

**시맨틱 계층 고정** — `root`(접지·월드 이동) → `motion`(로컬 이동·기울기) → `body`(해부 계층), + `ground`·`target`·`vfx-hit`·`vfx-death` 소켓. 비인간형은 *없는 해부를 위조하지 말고* 의미 등가로 명명. **LOD는 시각 자식만 변경** — root/joint/socket/collider 맵은 보존.

**콜리전 5레이어** — `solid`(차단) / `navigation`(반경·높이·스텝) / `hurt`(피격) / `attack`(**권위 active 윈도우 밖에서는 비활성**) / `trigger`(지각·상호작용). 시각 메시 겹침으로 접촉 추론 금지.

**필수 9상태 + 전이표** — `idle|investigate|pursue|reposition|windup|attack|recover|stagger|defeated`, 전이 `idle→investigate|pursue` · `pursue→reposition|windup|idle` · `windup→attack|stagger` · `attack→recover` · `recover→pursue|reposition|idle` · `*→stagger`(인터럽트 규칙 허용 시) · `*→defeated`. `setState` 는 `(state, elapsed, context)` 에 대해 **결정론적**이어야 하고 포즈 적용 전 변경 트랜스폼을 전부 리셋.

**AttackDefinition** — `startup·active·recovery·cooldown·range[min,max]·arcDegrees·contact{socket, shape sphere|capsule|box|sweep, size}·damage·postureDamage·facingLock(startup|active|none)·interruptible{startup, active, recovery}`(**페이즈별 개별 플래그**). 접촉은 안정된 `(actionId, targetId)` 당 **1회만**.

**★ 무브셋 ⟂ 타이밍 분리 + 순수 샘플러** — 무브셋은 *순서와 intent 지속시간만* 소유하고, startup/active/recovery/contact/damage/interrupt 의 **유일 출처는 AttackDefinition**(전투 클럭 중복 금지). 그리고 `sampleMoveSet(movesetId, elapsed) → {state, attackId, normalized, active, interruptible, phaseIndex, cycle, actionId}` 를 **순수 함수**로 제공한다. `actionId` 규약 = 한 공격의 startup→active→recovery 동안 **하나로 유지**, 루프 반복 시 **갱신**. 테스트는 **active 윈도우 경계의 직전·정확·직후**를 표본해야 한다.

**LOD 예산**(브라우저 기준 일반 적 1체) — near ≤50k tri / far ≤12k / draw call ≤48 / 텍스처 ≤12(1024px). 보스는 명시적 별도 예산만.

**13항 적합성 체크리스트** + 실패 조건 실명(부유 부착물·필수 상태 누락·**포즈 파생 피해**·LOD 소켓 drift·무한 리소스). 결과 보고는 3값(완전 적합 / 문서화된 예외 포함 적합 / 공용 계약에 새 아키타입 능력 추가 필요).

### 8.2 스킬 이펙트 — 원칙 목록, 계약 아님 (20줄)

*"게임플레이 의미를 스펙터클보다 먼저 보이게 하라."* 이펙트마다 정의: **트리거·소유자·지속시간·게임플레이 의미·카메라 거리에서의 실루엣·색 위계·스폰 상한·정리 규칙·reduced-motion 등가**. 그리고 **telegraph / contact / success / failure / lingering-status 5분류를 분리**. 구현은 풀링·머티리얼/지오메트리 재사용·파티클 상한·프레임당 할당 금지, 중요 UI·타깃 주변 additive/transparency 자제, **정리는 멱등**(리셋·사망·일시정지가 이펙트를 누출시키지 못하게). 검증은 중첩·다중 타깃·빠른 반복·pause/resume·최저 품질·reduced motion·터치 뷰포트.

**한계 정직**: 여기엔 VFX 데이터 스키마도, 타이밍 계약도, 코드도 **없다**. 몬스터 계약서와 달리 검증 가능한 형태가 아니다. 타이밍 축은 `design-action-combat`(31줄)이 보완한다 — 전투 동사마다 startup/active/recovery/취소규칙/자원비용/접촉형상/피해·포스처/쿨다운/피드백, 그리고 *"시각은 해결된 시뮬 이벤트의 하류"*.

### 8.3 직업 선택 — **전용 스킬이 없다**

전 게임 패밀리 grep 결과 **스치는 언급 4곳**뿐이다. `build-isometric-arpg` 의 *"title/menu, **character choice**, movement…"* 1구절과 *"**player classes**·장비·적·존·인카운터·퀘스트의 데이터 주도 계약을 정의하라"* 1구절, `build-hybrid-game-assets` 는 **class portrait 를 "직접 사용하는 2D UI 미디어"로 분류**, `build-game-map-editor` 는 에디터 아이콘으로 class portrait 참조. **아키타입 설계·스탯 배분·스킬트리·리스펙은 전무.**

대체 가능한 인접분 = `build-game-inventory`(31줄)의 **트랜잭션 규약**: ①출처 소유·목적지 적법성 검증 → ②다음 인벤/장비 상태 **전체 계산** → ③1회 커밋 또는 거부 → ④유효 확인 후에만 영속화. *"적법한 목적지를 확인하기 전에 아이템을 제거하지 마라"* · *"스왑 간 아이템 정체성 보존 + 효과 중복 등록 방지"*. 직업 변경·장비 교체·효과 재계산에 그대로 적용되는 형태다.

작가가 본 "잘 구현돼 있음"의 실체는 **라이브 게임(Vesperfall — Vitality/Resolve/Power/Guard/Burden)**이고, **그 소스는 공개돼 있지 않다**(§5-1). 즉 직업 선택은 *구현을 볼 수 없고 규약도 없는* 유일한 계통이다.

### 8.4 ★ 유리링 대조 — 중복이 아니라 **짝**이다

`wiki/.archive/yuriring-2026-06-28/game-design-yuriring-combat-skill-design.md`(한국 게임기획 강의자료 흡수분)에 **프레임 데이터 용어가 이미 더 풍부하게** 있다 — 선딜레이(리스크 부여 근거 포함)·후딜레이(행동 경직)·**캔슬**(선/후딜 차단→연계 강제 전이)·채널링·선판정, 그리고 **무적 / 피해면역 / 디버프면역 / 슈퍼아머 4분류**, 실드 파괴 프레임 연출.

따라서 delta 는 *개념*이 아니다 —

| 축 | 유리링(archive) | MengTo |
|---|---|---|
| 형태 | 설계자 **언어·용어 사전**(한국어, 리스크 설계 근거) | **실행 계약**(TS 인터페이스·순수 샘플러·멱등 규칙) |
| 검증 | 없음 | 경계 표본 테스트·13항 체크리스트·실패 조건 실명 |
| CC/무적 체계 | **4분류 보유** | 없음(`interruptible` 페이즈 플래그만) |
| 자산·리그·소켓·LOD | 없음 | **완비** |

⚠️ **인용 리스크 = "노트 단위"가 아니라 "카테고리 단위"다** (2026-07-26 MANIFEST 실독 후 정정 — 앞선 서술은 과도했다). `wiki/.archive/yuriring-2026-06-28/MANIFEST.md` ③Gate 실측 = **PDF 16 표본 전수 대조 → 14개 충실·날조 0**, 날조는 *수치 밀집* 노트 2개에 국한:
> - **c31 `combat-balance`** — §5.2 좀비 밸류표 전면 날조(PDF 8종→노트 6종·값 전건 불일치·밸류 10/30+ 는 PDF 부재[최대 8]), §4.4/§4.5 밸류분해 날조(쿨타임 불일치·**"단일지정=밸류11" 발명**·산수 90을 "≈86"으로 호도). 단 §3.2 총기 5종 DPS 는 exact.
> - **c35 `resume-portfolio`** — 선언 source 에 없는 콘텐츠 절반+(롤 5포지션·7대죄악·1분자소 20/30/30/20·연봉협상), §3.2 **"DAU 12%·PUR 1.8%" = PDF 전무 수치 날조**.
>
> **본 §8.4 가 인용한 `combat-skill-design` 의 source 는 `c20` — 날조 목록에 없다.** 게다가 가져온 것은 *용어*(선딜레이·캔슬·슈퍼아머 4분류)이고, 감사에서 깨진 건 **수치**다. MANIFEST 교훈 그대로 — *"수치 밀집 source 의 자동 갭보강 = 그럴듯한 오답 양산."*
>
> 따라서 실무 규칙 = **유리링 archive 에서 *용어·구조*는 인용 가능(단 `status: provisional`·`proposed_by: gemini`[RETIRED]·`confirmed_by: null` 표기 유지), *수치·계수·밸류·DPS·지표*는 PDF 원본 대조 없이 인용 금지.** c31·c35 는 복원 시 수정 필수. (16 표본이 어느 노트였는지는 MANIFEST 미명시 → c20 의 감사 통과 여부는 **미확인**. 용어 인용에는 무해, 수치 인용에는 금지선 그대로.)

**그리고 "권위 시뮬 ⟂ 렌더" 축은 신규가 아니다** — [WoC 역기획 — AI 게임 생산 방법론 (10종 해체 종합)](../techniques/woc-ai-gamedev-teardown.md) 이 이미 더 정밀하다(IWorld seam·결정론 height 단일 진실·"클라가 결과 계산 0"·outcome-prediction 금지 ⟂ display-only anticipation 350ms 허용). MengTo 의 *"렌더된 포즈로 피해를 만들지 마라"* 는 그 원리의 몬스터 자산판 재진술이다. **활성 vault 에 없는 것 = 프레임 데이터 계약의 기계 검증 형태 + 몬스터 자산 계약층(리그·소켓·콜리전 레이어·LOD 예산).**

## 연결

[WoC 역기획 — AI 게임 생산 방법론 (10종 해체 종합)](../techniques/woc-ai-gamedev-teardown.md) · agent-skill-quality-gate · skill-curator · hermes-loop · libgdx-rogue-os · bespoke-html-direction · cold-verify-before-adopt
