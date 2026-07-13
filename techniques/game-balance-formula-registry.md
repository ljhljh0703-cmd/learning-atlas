---
created: 2026-07-11
updated: 2026-07-11
type: learning
tags: [game-design, game-balance, combat, formula, probability, gacha, ttk, ehp, simulation]
source: "Game Balance Vol.1 (출처불명 54p PDF, SHA `6d46ac…`) — Codex 해체분석"
authors: [unknown]
year: 2026
category: technique
---
<!-- Codex 해체분석 ③Gate 흡수(2026-07-11) — 감사 가능한 게임 밸런스 공식 레지스트리. MDA와 combat-sim 사이 누락된 Layer 0. -->

# Game Balance Formula Registry — 계산 가능한 밸런스 뼈대

> ③Gate 통과(2026-07-11). **12 공식 SHA 일치·소스 오류 5건까지 잡음**(Codex가 원문 수학을 재검산해 거짓 적발). 가치 = 게임별 정답수치 아닌 **목표경험→수식·검산 루프**. combat-sim-harness-spec와 [MDA 프레임워크 — Mechanics, Dynamics, Aesthetics](mda-framework.md) 사이 누락된 *Layer 0*(감사 가능한 공식 레지스트리). ⚠ 출처불명 PDF — 라이브 게임 사례·권장수치는 D등급(비권위), 일반 수식만 B등급.

## 1. 철칙 — "수식이 있다"가 아니라 "수식·입력·단위·경계·제약·출처를 한 덩어리로 검증"
평균값은 역할 정체성을 보존하지 않는다(같은 평균 DPS라도 단타 고치명 ↔ 다단 저치명은 분산·피드백·방어 상호작용이 다름). **각 공식은 "반드시 선언할 조건"을 동반해야 자산**.

## 2. 공식 카드 (12종 — 조건 선언 필수)
| ID | 식 | 반드시 선언 |
|---|---|---|
| BAL-DMG-001 원시 피해 | `Base×(1+ATK)×Skill Coef` | 보너스 합/곱연산·계수 단위·반올림 시점 |
| BAL-CRIT-001 평균 치명배율 | `1 + CritRate×CritDmg` | CritDmg가 추가보너스/총배율인지·표본수 |
| BAL-CRIT-002 체감감소 치명률 | `Points/(Points+K)` | K 캘리브레이션·상한·표시스탯↔내부포인트 |
| BAL-DEF-001 체감감소 방어 | `DEF/(DEF+K)` | 관통·감소 적용순서·음수방어·K 레벨의존 |
| BAL-EHP-001 유효체력 | `HP/(1-DR)` | 보호막·회복·피해유형·DR 상한 |
| BAL-TIME-001 생존시간 | `EHP/Incoming DPS` | 폭딜↔지속딜·0 DPS·회복주기 |
| BAL-DPS-001 로테이션 DPS | `Σ Rotation Dmg / Cycle Sec` | 애니·이동·자원·다운타임·타깃수 (쿨타임표만으론 타임라인 손실) |
| BAL-TTK-001 평균 TTK | `Target EHP / Applied DPS` | 명중률·보스패턴·페이즈·회피시간 |
| BAL-XP-001 다항 XP곡선 | `a×Level^b` | 레벨당/누적·콘텐츠 공급속도·후반벽 |
| BAL-EV-001 이산 기대값 | `Σ(value×prob)` | 확률합=1·화폐가치↔효용 분리·분산 |
| BAL-RNG-001 N회내 성공확률 | `1-(1-p)^N` | 독립시도·시도별 확률변화 |
| BAL-RNG-002 하드캡 기하분포 평균 | `(1-(1-p)^N)/p` | N번째 보장·소프트천장 없음 |
| BAL-RNG-003 BLP(천장쌓기) | `min(p0+failures×Δp, pmax)` | 실패카운트 시작·리셋규칙·보장상태 |

## 3. 소스 오류가 가르치는 것 (검산 규율 — Codex가 원문에서 적발)
| 문제 | 원문 → 실제 | 자산화 규칙 |
|---|---|---|
| EHP 생존시간 | 93.75s → **37.5s** (HP3000·DR60%·DPS200) | 식·예제출력 모두 단위테스트 |
| 하드천장 평균 | 67회 → **46.77회** (1.5%·80캡) | 하드캡/소프트피티/보장 별도 모델 |
| 방어 레벨패널티 | "12–15%" → 식상 **2.78%** (Lv80↔90) | 서술 %를 식으로 역검산 |
| 딜러 DR목표 | 33.3%가 "탱커60% 절반이하" 제약 위반 | **계산통과 ≠ 설계제약 통과**(분리) |
| 라이브 사례(블아·원신·NIKKE) | 공식출처 부족·용어 교차오염 | 게임별 사례=버전·공식링크 필수, 없으면 `unverified`/quarantine |

## 4. Balance Spec Compiler (반영 — LLM/엔진/인간 권한 분리)
```
목표경험 → 측정가능 KPI+실패조건 → 공식카드 선택 → 단위·범위·적용순서 선언
→ 결정론 계산+경계값 테스트 → 분산·하위분위·최악값 검증 → 플레이테스트 → 가설 유지/수정/폐기
```
LLM=목표경험 후보·설명 생성 / Formula Registry+테스트=숫자계산·회귀판정 / 인간=최종 재미판정([게임 재미 설계 OS (AI 위임용)](../methods/game-fun-delegation-os.md) 정합 — 지표는 재미의 대리증거일 뿐).

## 5. 반영 (Apply-or-Park)
- **① Applied**: 본 노트(정본). combat-sim-harness-spec 입력 스키마 후보(§7)·[MDA 프레임워크 — Mechanics, Dynamics, Aesthetics](mda-framework.md) 하위 Layer 0·[게임 재미 설계 OS (AI 위임용)](../methods/game-fun-delegation-os.md)와 상보. hwiglija-tower·FG·libgdx 로그라이크 전투에 직접 적용 가능. ⚠ **hwiglija-tower-gdd 병합 금지**(SSOT·AI 데미지공식 금지 가드) — 레지스트리는 standalone·cross-ref만.
- **② Parked(트리거 명기)**: Telegraphed Variance Budget NPC 가설(같은 기대 DPS라도 분산·전조로 공정성/위협 달라짐 → 안정형↔폭발형, p10/50/90·피격률·회피율·공정성 비교, 프로토타입 필요) = 전투 프로토타입/seeded 플레이테스트 시 · 확률분포 시뮬레이터(p10/50/90·최악연속실패·천장도달률) · portfolio-blueprint 삽입 = 이력서/포폴 정합 후(coherence). → codex-gate-park-backlog-2026-07-09.
- **② skill 후보 park**: `game-balance-evidence-compiler`(1회 관측·작가 승인 대기).

## 6. Anti-overclaim·라이선스
출처불명 PDF(저자·ISBN 없음) → 저작권 UNKNOWN, **원문/장문 발췌 발행 금지**. 수식=uncopyrightable 사실이라 재작성 안전. 라이브 게임 사례표는 quarantine(교차오염). "재미 입증" 수치 단독 결론 금지 — 프로토타입·플레이테스트 필수.
