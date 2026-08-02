---
created: 2026-07-30
updated: 2026-07-30
type: learning
tags: [game-design, economy, sink-faucet, ledger, telemetry, market-design, producer-role]
source: ["https://on.com2us.com/press/컴투스-대작-mmorpg-제우스-오만의-신-경제-특화-클래/", "https://www.youtube.com/watch?v=Em2g1Lj06nM"]
authors: [com2us]
year: 2026
category: method
---
<!-- 게임 경제를 source/sink/transfer + 권한 + 원장 + 계측으로 제어하는 설계 계약. ⚠️provisional. -->

# Game Economy Control Loop — 순환은 서사가 아니라 계측이다

> ⚠️ **임시(provisional)** — Codex RETURN ③Gate PASS(2026-07-29) 후 승격. 작가 내용 검토 전.
>
> 🔒 **정직성 잠금** — 출처(ZEUS)는 **출시 전 개발 방향·마케팅 자료**다. live telemetry 가 0이므로 이 노트는 **관측된 설계 의도**이고 검증된 성공 사례가 아니다. "가치 순환을 달성했다"는 서술 금지(G14 SKIP).

## 철칙

**경제 기능 구현 전에 stock/flow map · 권한 · 원장 · 계측을 잠근다.** "가치 유지"를 가격 상승이나 거래량 하나로 증명하지 않는다 — 저가 장비 sell-through 가 늘어도 프리미엄 재화 인플레이션이나 부 집중은 동시에 악화될 수 있다. **성공 지표 하나가 다른 실패를 가리지 못하게 만드는 것**이 이 계약의 목적이다.

## 잠금 7항 (구현 전)

```text
1. stock/flow map — 모든 currency·item 의 source / sink / transfer / conversion 전수
2. authority      — 누가 가격·eligibility·payout·recipe 를 바꾸는가 (+ rule_version)
3. ledger         — source_event_id · sink_event_id · actor · counterparty · rule_version
4. control rule   — buyback budget · price band · cooldown · per-account/device limit
5. fairness       — order priority · reservation expiry · cancellation · partial fill · anti-self-trade
6. observability  — currency velocity · source/sink 비 · item age·sell-through
                    · buyback 이 처분에서 차지하는 비중 · market depth/spread
                    · wealth Gini·top-1% 집중 · crafting margin·producer 집중 · bot/alt 이상률
7. rollback       — rule versioning · payout halt · reconciliation · compensating event
```

원장은 persistence §6 의 mutation 계약(`AuthZ → OCC → invariant → transaction → projection+ledger → scoped broadcast`)에 그대로 얹는다. **잔액을 바꾸고 나중에 로그**가 아니라 **projection 과 원장을 같은 commit 단위로** 만든다.

## 관측된 3개 제어 루프

**루프 A — 장비 잔존 가치 (system buyback)**

```text
저가·비유동 장비 → 조건부 시스템 매입 → 아이템 제거 → 프리미엄 재화 지급 → 소비·거래
```

단순 sink 가 아니다. 아이템은 사라지지만 프리미엄 유동성은 *플레이어에게 들어온다* → **item sink + price-floor 신호 + premium faucet** 세 역할을 동시에 한다. 이 겹침을 인지하지 못하면 "sink 를 넣었다"고 믿으면서 인플레이션을 주입한다.

*실패 모드* — 공개 고정 매입가가 가격 발견을 왜곡 · 매입 조건 역산 bot·다계정 farming · 신규 공급보다 payout 이 빠르면 재화 인플레이션 · 예산 부족 시 선착순·불투명 조건이 신뢰 훼손 · "저가 장비 구제"가 쓰레기 drop 양산을 정당화.

**루프 B — 프리미엄 재화 재분배**

```text
거래·구매에서 pool 축적 → 운영 규칙에 따라 이벤트·금고로 배분 → 참여자 지급 → 재소비
```

핵심은 "순환"이라는 서사가 아니라 **pool inflow · payout rule · eligibility · 집중도를 공개·계측**하는 것이다.

*실패 모드* — 통합 거래소는 시장 깊이를 늘리지만 서버별 정체성·지역 가격차를 없앤다 · 예약 우선순위·동가 체결 규칙이 sniping 에 취약 · self-trade·wash trade·price anchoring·길드 담합.

**루프 C — 생산자 역할 클래스** <!-- G12 merge: 독립 노트 아님. 근거 = 생산자 역할은 §1 stock/flow map 의 한 노드이고, 단독 근거가 출시 전 마케팅 자료 단독(G14 와 동일 소스)이라 독립 자산으로 세우기엔 미달. -->

```text
생산 클래스 성장 → recipe·생산 효율 해금 → 성장 재료 생산 → 전투 플레이어 수요 → 재화 수입 → 재성장
```

진짜 델타는 **클래스를 전투 스킬 묶음이 아니라 *경제적 권한과 생산 함수*로 확장**한다는 점이다. 전투 외 역할을 부캐가 아닌 main class 로 세울 수 있다.

*가드 (이걸 계약에 넣지 않으면 채택 금지)* — ①경제 역할이 재미가 아니라 **필수 부캐 세금**이 되는지 ②고급 recipe 가 소수 길드·고과금에 몰려 **생산 독점**이 되는지 ③생산 클래스가 전투에서도 강하면 **경제 우위 + 전투 필수의 이중 독점** ④확률형 전용 재료가 성장 격차를 **복리로** 확대 ⑤작업장 억제 장치가 정상 생산자까지 막는지.

**공급 제한** — 핵심 재료의 일일 획득 상한은 공급 안정에 유효하지만 플레이 시간 강제·FOMO 가 되고, 계정 수로 cap 을 우회하면 다계정 우위만 강화하며, demand shock 에 공급이 반응하지 못해 가격이 급등한다.

## 검증 게이트

- rule_version 별 source/sink balance
- buyback 전후 item age · sell-through · price band
- top 1% payout 집중 · producer 집중
- bot/alt 공격 시뮬레이션
- rollback·compensating event 리허설

## 반영처 (학습→반영 루프)

- **즉시 반영 diff 없음** — 현재 활성 게임 레인에 재화·거래 시스템 착수분이 없다. 트리거 = 위 review_trigger.
- 착수 시 결합처 = persistence(원장·mutation 계약) · [Game Balance Formula Registry — 계산 가능한 밸런스 뼈대](../techniques/game-balance-formula-registry.md)(BAL-EV-001 기대값·BAL-XP-001 곡선 — 전투·RNG 축은 그쪽이 정본, 본 노트는 순환 축)
- **park 형제** — system buyback 구체 구현은 시장·프리미엄 재화 prototype + attack simulation 이 있을 때까지 파킹(G13).

## 한계 · 비판 (흡수 4대 규율)

1. **live 성과 0** — 출시 전 기사 + 공식 영상 자막(05:00–09:04 구간)이 전부다. 설계 *의도*는 읽을 수 있고 *결과*는 읽을 수 없다.
2. **기존 수용분과 delta** — 활성 vault 에 경제 설계 자산이 없었다(2-패스 grep: `source/sink`·`인플레이션`·`거래소`·`gold sink` → 활성분 무매치, 유일 근접 [Game Balance Formula Registry — 계산 가능한 밸런스 뼈대](../techniques/game-balance-formula-registry.md) 12카드는 전투·치명·방어·XP·RNG 축뿐). 즉 이 노트는 중복이 아니라 **빈 축을 채운다**.
3. **시너지** — §7 rollback 은 persistence 계약의 correction-event append 규율과 같은 형태다. 경제를 별도 도메인으로 두지 말고 *원장을 가진 상태 기계*의 한 인스턴스로 다루는 것이 다음 단계.
4. **과적용 가드** — 소규모·단일 플레이어·비거래 게임에 7항 전건을 강제하지 않는다(Karpathy #2). 재화가 *플레이어 간 이동*하지 않으면 §5 fairness·§6 집중도 축은 `N/A` 1줄로 면제.

## 관계

persistence(원장·OCC·mutation 계약) · [Game Balance Formula Registry — 계산 가능한 밸런스 뼈대](../techniques/game-balance-formula-registry.md)(수식 축 정본) · [Analytic Presence Schedule — 틱 없이 사는 세계](analytic-presence-schedule.md)(같은 패킷 형제 자산) · ai-game-production-harness(게임 생산 하네스) · hermes-loop ③Gate·④Promote · codex-gate
