---
created: 2026-07-25
updated: 2026-07-25
type: learning
category: methods
tags: [ux, product-spec, screen-flow, wireframe, teardown, reusable-skeleton]
source: "Threads @launchscreen post DbIZf_1AfSk — minispace 화면·플로우 맵 (AI agent 자동 UX/정책 기획 산출물)"
---
<!-- 서비스 전체 화면·상태 명세를 짜는 재사용 골격 + 상위호환 디벨롭 포인트 (minispace 맵 해체). -->

# 화면·플로우 명세 골격 (Screen-Flow Spec Skeleton)

> ⚠️ **provisional** — Claude 파악·제안, 작가 컨펌 전. 소스 = `minispace` (AI 에이전트가 UI/UX 흐름·정책을 자동 기획한 산출 맵, Threads @launchscreen). e커머스 "상세페이지"가 아니라 **서비스 앱 전체 화면 설계도**. 작가의 "상세페이지 기획" 응용 요청 대상 = 화면/서비스 기획으로 해석(마케팅 상세페이지면 §상위호환 6·7만 취사).

## 왜 이 골격이 좋은가 (해체 결과)

minispace 맵은 9단계 여정별 섹션 × (해피패스行 + 엣지/부록行)으로 **~50+ 화면을 전수 열거**한 완결형 명세다. 재사용할 *알맹이 = 아래 8개 구조 규율*.

| # | 규율 | 실물 |
|---|---|---|
| A | **여정 단계별 섹션화(9)** | ①진입·랜딩 ②게이트(연령·주소) ③편집기·꾸미기 ④생성 공통 UX ⑤로그인·저장 ⑥완성·프로필 ⑦소셜 ⑧공유·초대·미션 ⑨계정 관리 |
| B | **섹션당 2트랙** | 해피패스行(위) + **부록/엣지行(아래)**. 모든 화면에 실패·빈·차단 쌍을 바로 밑에 |
| C | **화면 레지스트리 = 해시태그 ID** | `#landing #age-blocked #claim-taken #gen-fail #space-private #account-restore` … 모든 화면이 주소를 가진 인벤토리 |
| D | **라벨 붙은 전이 엣지 = 상태기계** | 곡선 커넥터가 트리거를 운반: "로그인 완료(OAuth 콜백)", "생성 완료→4종 선택", "주소 특정 방문", "티켓 미션". 화면 더미가 아니라 방향 그래프 |
| E | **화면마다 정책 주석 + 출처** | 각 화면 하단 소자: 트리거 조건·정확한 마이크로카피·상태 규칙·**날짜 확정("2026-07-22 확정")·버전(v7,v25)·원장 참조("operation-policies.md §7", "plan.md §6")**. spec-with-provenance |
| F | **엣지·빈·라이프사이클 완결성** | 연령차단·주소taken·미소유·비공개·생성실패/일시정지/티켓소진·인증실패·방명록empty·신고차단·**탈퇴→pending_deletion→유예→복구/purge**. 안 예쁜 상태가 1급 시민 |
| G | **성장 루프를 UX에 내장** | 티켓(#missions)·초대(#invite +2장)·공유시트(#share) = 리텐션/바이럴 루프를 *화면으로* 명세(나중에 붙이는 게 아니라) |
| H | **일관된 마이크로카피 보이스** | 빈/에러 상태도 온브랜드("앗, 그러다 멈췄어요", "아직은 만날 수 없어요", "거의 다 왔어요") — 무미건조 시스템 메시지 X |

## 상위호환 디벨롭 포인트 (아류작 방지 — 그냥 베끼면 정적 그림, 이걸 붙이면 검증가능 명세)

minispace는 *정적 화면 맵*으로 훌륭하나, 상위호환의 핵심 = **화면 맵을 기계가독 검증가능 SSOT로 승격하고 캔버스는 그 render 로** (= vault 고유 "SSOT + 파생 render + 게이트" 철학의 UX 적용 = 시너지).

1. **레지스트리 → machine-readable SSOT.** 해시태그 ID가 Figma 캔버스(비주얼)에만 산다. 상위호환 = 병행 `screens.yml`/표: `id, phase, type(happy/edge), triggers, copy_ref, policy_ref, preconditions, exits[]`. 캔버스는 SSOT의 *render*. → lint 가능: 모든 exit 이 실재 id 를 가리키나·모든 화면 도달 가능한가·엣지 라벨 누락 0.
2. **전이 엣지 → guard 있는 명시 FSM.** 그들 엣지엔 트리거만, guard/전제 형식주의 없음. 상위호환 = 각 엣지에 `guard`(예 `age≥14 ∧ address_unclaimed`) + `on_fail → #edge-screen`. → "guard-false 경로마다 정의된 목적지 있나"(dead-end 0) 자동검사. 해피패스는 그렸는데 *분기조건*이 암묵인 고전적 구멍을 막음.
3. **커버리지 매트릭스를 게이트로.** 화면마다 {loading, empty, error, permission-denied, offline, over-limit} 전수 표기(covered/N-A/missing). minispace는 ~80% 암묵 수행 → 명시 매트릭스가 나머지 20% 포착(예: *offline* 상태? 저장 중 *네트워크 실패*? #gen-paused 넘어선 *생성 타임아웃*?).
4. **화면당 계측 계약.** 각 화면에 `events[]`(뭘 로깅)·성공지표·이탈정의 부착. minispace는 전환 임계 화면(#claim,#auth,#missions)을 보여주나 퍼널 지표 미선언. 상위호환 = 플로우가 곧 분석 스펙(= naholo "단계별 토큰 분포 측정" 본능의 UX 퍼널 적용).
5. **정책·카피를 버전 원장으로 교차링크.** 이미 "operation-policies.md §7" 인용 = 우수. 상위호환 = 양방향 + `review_trigger`(vault LOCKED-결정 규율): 정책 1개 바뀌면 그걸 인용한 모든 화면에 diff 발화. 50화면 카피/정책 drift 차단.
6. **재사용 phase-템플릿 라이브러리.** 9단계(진입/게이트/생성/편집/인증/완성/소셜/성장/계정)는 다수 서비스에 재발. 상위호환 = "서비스 화면골격 9-phase 체크리스트"로 추출 → *다음* 서비스는 백지 아닌 골격에서 시작. **← 작가 요청의 실제 재사용 자산.**
7. **빈 상태 → 활성화 사다리.** 모든 빈/차단 상태에 *북극성 지표로 향하는 next-best-action* CTA. minispace가 #space-unclaimed→"이 주소로 내 공간 만들기"로 잘 함 → 규칙으로 일반화(dead-end 빈 상태 0 = lint).
8. **a11y·i18n 슬롯.** 맵에 부재. 각 화면이 a11y 의도(포커스 순서·isometric 방 스크린리더 카피·reduced-motion 변형) + i18n 카피키 선언. 공간/시각 제품엔 실질 구멍.

**상위호환 1줄 논지**: 예쁘지만 정적인 그림 → **screens.yml + FSM guard + 커버리지/계측 매트릭스로 lint·drift-proof·분석배선된 SSOT**(캔버스는 거기서 render). = vault 강점(SSOT 위성·render 파생·done-gate·review_trigger)이 그대로 전이(흡수 4대 규율 ③ 시너지).

## 반영처 후보 (승격 시)
- 작가 앱/서비스 화면 기획 착수 시 = 본 골격 §A~H 인스턴스화 + 상위호환 §6 템플릿부터.
- **구체 near-term 타깃 (작가 명시 2026-07-25)**: ① **텀블벅 상세페이지** — 펀딩 페이지는 §상위호환 6(phase-템플릿)·7(빈상태→활성화 CTA) + 마케팅 상세페이지 각도(index). ② **젤리패닉 앱 배포** — 앱스토어 상세·온보딩·화면 플로우에 §A~H 골격. 앞으로 앱·웹 배포·펀딩 반복 = 본 골격 상시 인출 대상(작가 "필수").
- 관련: [trysmooth.ai 랜딩 해체분석 (Trysmooth Teardown)](trysmooth-landing-teardown.md)·[토스 앱인토스 다크패턴 방지 정책](toss-dark-pattern-policy.md)(단일 페이지) ↔ 본 노드(전체 서비스). 게임 UI 플로우면 게임 SSOT.
- 마케팅 상세페이지 맥락이면 index 각도 + §상위호환 6·7만.
