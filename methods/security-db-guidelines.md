---
created: 2026-05-05
updated: 2026-05-05
type: learning
tags: [security, web-development, supabase, database, starter-pack]
---

# 보안 및 DB 아키텍처 가이드라인 (Security & DB Guidelines)

본 문서는 웹 SaaS 및 AI 기반 개발 시 반드시 준수해야 하는 보안 체크리스트와 데이터베이스 운영 원칙을 정리한 가이드입니다. 과거의 인사이트를 현재의 AI 시대에 맞게 재구성했습니다.

---

## 1. 보안 필수 체크리스트 (SaaS Security Harness)
AI에게 코드를 요청할 때, 다음 항목들이 반영되었는지 반드시 검토하거나 프롬프트에 포함한다.

*   **네트워크 & 헤더**: CORS/Preflight, HTTPS/HSTS, 보안 헤더 (CSP 등)
*   **공격 방어**: CSRF, XSS, SSRF, SQL 인젝션 방어, Validation
*   **인증 & 인가 (AuthN/AuthZ)**: RBAC/ABAC, 테넌트 격리(Tenant Isolation), 최소 권한 원칙
*   **세션 & 쿠키**: HttpOnly, Secure, SameSite 설정, 세션 보안
*   **인프라 보호**: Rate Limit, Brute-force 방어, 에러 메시지 노출 차단
*   **자격 증명**: Secret 관리 및 주기적 Rotation
*   **사후 점검**: Audit Log 기록, 의존성 취약점 점검

## 2. Supabase 운영 원칙 (DB Strategy)
Supabase를 활용한 고유의 아키텍처 전략입니다.

*   **Auth 기능 배제**: Supabase의 자체 Auth 기능을 쓰지 않고 별도의 인증 시스템을 구축하거나 커스텀 처리함.
*   **SDK 지양 (Native ORM)**: 공식 SDK에 의존하기보다 자체 ORM 또는 직접적인 쿼리 방식을 사용하여 제어권을 확보함.
*   **테넌트 격리**: Supabase의 RLS(Row Level Security)를 활용하거나 애플리케이션 레벨에서 격리를 철저히 함.

---

## 3. 현대적 인사이트: 왜 지금도 중요한가? (AI Context)
AI 시대에는 코드가 빠르게 생성되는 만큼, 보안 취약점도 빠르게 전파됩니다.

1.  **할루시네이션 보안**: AI는 보안상 취약한 옛날 라이브러리나 설정을 추천할 수 있습니다. 위 체크리스트는 AI의 결과물을 검증하는 **'보안 가드레일'** 역할을 합니다.
2.  **구조적 안전성**: 프롬프트 한 줄보다, 위 체크리스트를 통과해야만 "완료"로 간주하는 **'정의된 프로세스'**가 더 강력합니다. (Harness의 Reviewer 패턴과 결합 가능)
3.  **제어권 확보**: SDK를 쓰지 않는 전략은 AI가 생성한 코드의 '블랙박스'화를 막고, 개발자가 시스템의 상세 동작을 완전히 이해하고 통제할 수 있게 돕습니다. 본 전략은 [고성능 AI 오케스트레이션 및 명령 표준 (Advanced Orchestration)](advanced-ai-orchestration.md)의 'Secret Guard' 원칙 및 [Harness AI 스타터팩: 에이전트 설계 표준 (Starter Pack)](harness-starter-pack.md)의 검증 프로토콜과 직접적으로 연계됩니다.

---

## 적용 방법
- 새로운 웹 기능 개발 시, 위 보안 문구를 프롬프트의 **Constraint(제약 사항)** 섹션에 삽입한다.
- DB 스키마 설계 시 Supabase Native 접근 방식을 우선 검토한다.
