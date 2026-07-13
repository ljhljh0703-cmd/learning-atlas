---
created: 2026-07-10
updated: 2026-07-10
type: learning
tags: [privacy, legal-risk, app, game, compliance, red-flags, risk-gate]
source: "작가 실무 노트 (Codex 세션, 2026-07-09) + 국가법령정보센터 공개 법령"
authors: [user]
year: 2026
category: method
---
<!-- 작가 실무 노트 ③Gate 흡수(2026-07-10) — 앱/게임 출시 전 개인정보 리스크 레드플래그 게이트. -->

# App Privacy Risk Red Flags — 게임·앱 개인정보 리스크 게이트

> ③Gate 통과(2026-07-10, 무결성·환각 clean). **법률 자문 아님** — "이 설계는 법무/개인정보 검토 없이는 나가면 안 된다"를 잡는 출시 전 프리플라이트 체크리스트. 조항 번호는 미검증(`후보` 표기), 승격 시 law.go.kr 재확인 필요. [보안 및 DB 아키텍처 가이드라인 (Security & DB Guidelines)](security-db-guidelines.md)(기술 보안)와 상보 — 본 노트는 *법무/개인정보* 레드플래그 특화.

## Severity
- **P0 Release Block** — 출시/운영 전 법무·개인정보 검토+설계 수정 없으면 차단.
- **P1 Design Gate** — 구현 전 정책·동의·보존·삭제 설계 필요.
- **P2 Audit Watch** — 운영 중 로그/문서/스케줄 감시.

## 레드플래그 표 (조항 = 후보, 재확인 필요)

| Red flag | 후보 법령 | Sev | 설계 체크 |
|---|---|---|---|
| 개인정보 수집하며 처리방침 없음 | 개인정보보호법 제30조 | P0 | 수집항목·목적·보유기간·제3자·위탁·파기·권리행사 공개 |
| 나이 확인 없이 가입 | 제22조의2 후보 | P1/P0 | 연령확인·14세 미만·보호자 동의/차단 |
| 14세 미만 유입 무시 | 제22조의2 후보 | P0 | 타깃 연령·스토어 등급·채팅/결제/광고 노출 |
| 로그에 비밀번호 평문 | 제29조 | P0 | pw·토큰·인증코드·주민번호·전화·메일 redact + pw hash |
| 신고/동의 없이 위치정보 수집 | 위치정보법 제9조·제40조 후보 | P0 | 사업 해당성·동의·목적·보존·철회·SDK 범위 |
| 수신동의 없이 광고 발송 | 정보통신망법 제50조 | P0 | 수신동의·철회·표시·발송 필터 |
| 밤 9시~아침 8시 광고 push | 제50조제3항 후보 | P0/P1 | 야간 발송 금지 또는 별도 동의/차단 |
| 유출 인지 후 72시간 내 신고/통지 미준비 | 제34조 | P0 | 유출 판단·72h clock·신고기관·통지·증거보존 runbook |
| 전자상거래 기록 보존기간 위반 삭제 | 전자상거래법 제6조+시행령 후보 | P1/P0 | 결제/계약·분쟁·표시광고 보존 vs 파기 분리 |
| 탈퇴회원 정보 DB 방치 | 제21조 | P0/P1 | 즉시 파기 vs 법정 보존 분리(`deleted_at`) |
| 주민등록번호 수집 | 제24조의2 후보 | P0 | 법령 근거 없는 주민번호 수집 차단 |

## 설계 프리플라이트 (새 기능 전 표로)
Data item(식별 가능?) / Purpose(없어도 도나?) / User surface(동의·철회 시점) / Legal basis candidate / Retention(삭제·법정보존 분리) / Access(운영툴·로그·SDK) / Logging(redact?) / Child risk / Marketing risk / Incident path(72h runbook).

## Anti-patterns
"개발 중이라 로그에 다 남기자" · "프론트에서 약관 체크했으니 서버 동의 저장 불요" · "탈퇴하면 row만 숨기고 나중에 일괄삭제"(job 없음) · "위치 팝업만 받으면 위치정보법 끝" · "앱 push는 광고 규제 약하다" · "주민번호 받으면 신원확인 확실"(근거 없이).

## 반영 (Apply-or-Park)
- **① Applied**: 본 노트(게임 hwigi-tower·앱·nexon 등 지원 맥락서 채팅/결제/위치/미성년자/push-광고 설계에 직접 매핑). [Agent Production Lifecycle (spec→eval→trace→gate)](agent-production-lifecycle.md) "prompt/response 전문 저장 금지"를 로그 개인정보 원칙으로 연결.
- **미결(deferred)**: §law.go.kr 조항 재확인(web 필요, 본 게이트 범위 밖) → 완료 전 `provisional` 유지.
- **② Parked**: `app-privacy-risk-gate` skill 후보(1회 관측, 2회차 실사용 시 부활). → codex-gate-park-backlog-2026-07-09.
