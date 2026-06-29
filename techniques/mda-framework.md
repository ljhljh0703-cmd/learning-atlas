---
created: 2026-06-27
updated: 2026-06-27
type: Note
tags: [game-design, academic-theory, mda, framework, aesthetics]
source: "Hunicke, LeBlanc, Zubek (2004). MDA: A Formal Approach to Game Design and Game Research. AAAI Workshop on Challenges in Game AI."
---

# MDA 프레임워크 — Mechanics, Dynamics, Aesthetics

## 1. 논문 기본 정보

| 항목 | 내용 |
|------|------|
| 제목 | MDA: A Formal Approach to Game Design and Game Research |
| 저자 | Robin Hunicke, Marc LeBlanc, Robert Zubek |
| 발표 | 2004, AAAI Workshop on Challenges in Game AI |
| 원문 | `https://users.cs.northwestern.edu/~hunicke/MDA.pdf` |
| 인용 | 게임 디자인 학술 분야에서 가장 많이 인용되는 논문 중 하나. GDC 2001–2004 Game Design and Tuning Workshop에서 발전. |

---

## 2. 핵심 명제 (Core Thesis)

게임은 **소비되는 미디어가 아니라, 플레이어와 상호작용하는 시스템**이다. 따라서 게임을 분석하고 설계할 때는 *"재밌다/재미없다"* 같은 모호한 언어가 아니라, 구조적으로 분해 가능한 **3개의 렌즈**가 필요하다.

$$
\text{Rules} \xrightarrow{\text{System}} \text{Mechanics} \xrightarrow{\text{Runtime}} \text{Dynamics} \xrightarrow{\text{Experience}} \text{Aesthetics}
$$

이 세 계층은 설계자와 플레이어 사이에서 **역방향으로 읽힌다**는 것이 핵심 통찰이다.

---

## 3. 3계층 정의 (The Three Lenses)

### 3.1. Mechanics (규칙 — 설계자의 입력)

게임을 구성하는 **규칙, 알고리즘, 데이터 구조**의 총체. 설계자가 직접 제어할 수 있는 유일한 계층이다.

- 카드 뽑기 규칙, 주사위 확률, 데미지 공식, 이동 속도 파라미터, 자원 획득량 등.
- 코드와 데이터 테이블로 환원 가능한 모든 것.

**실무 적용.** 데이터 테이블 설계 · 시스템 기획서가 정확히 이 계층에 대응한다.

### 3.2. Dynamics (런타임 행동 — 시스템의 산출물)

Mechanics가 플레이어 입력과 만나 **런타임에 발생하는 행동 패턴**. 설계자가 직접 제어하지 못하고, 규칙의 조합에서 *창발(emerge)*되는 것.

- "몬스터를 피해 우회하는 루트 탐색 행동"은 이동 규칙 + 몬스터 감지 규칙 + 체력 잔량의 조합에서 **발현**된다.
- 내쉬 균형, 메타 형성, 아이템 매매 시장 동향 등.

**핵심 통찰.** 설계자가 Mechanics를 조율(tune)함으로써 Dynamics를 간접 제어한다. 직접 "이렇게 플레이하라"고 명령할 수 없다. 따라서 **시스템 기획자의 역량 = Mechanics 조작으로 원하는 Dynamics를 유도하는 능력**이다.

### 3.3. Aesthetics (감성 경험 — 플레이어의 출력)

플레이어가 게임과 상호작용하며 도달하는 **감정적 반응과 미학적 경험**. 논문은 "fun"이라는 단어를 금기시하고, 대신 8가지 구체적 감성 유형으로 분류한다.

---

## 4. 8 Kinds of Fun (미학 유형 분류표)

| # | 유형 | 영문 | 정의 | 대표 게임 사례 |
|---|------|------|------|----------------|
| 1 | **감각 쾌락** | Sensation | 시청각·촉각적 감각 자극에서 오는 즐거움. | 원신(오픈월드 비주얼), 비트세이버(햅틱) |
| 2 | **판타지** | Fantasy | 현실에서 불가능한 역할·세계를 가상으로 체험하는 즐거움. | 엘든 링(다크 판타지 몰입), 동물의 숲(목가적 환상) |
| 3 | **내러티브** | Narrative | 이야기의 전개·드라마에 의해 견인되는 즐거움. | 라스트 오브 어스, 디트로이트: 비컴 휴먼 |
| 4 | **도전** | Challenge | 장애물을 극복하고 마스터리를 달성하는 즐거움. | 다크소울, 셀레스트, 컵헤드 |
| 5 | **교류** | Fellowship | 타인과의 협력·경쟁·사회적 상호작용의 즐거움. | 오버워치(팀 플레이), 어몽어스(사회적 추리) |
| 6 | **탐험** | Discovery | 미지의 영역을 발견하고 비밀을 밝혀내는 즐거움. | 젤다 BotW(자유 탐사), 아우터 와일즈 |
| 7 | **표현** | Expression | 자기 정체성·창의성을 게임 안에서 발현하는 즐거움. | 마인크래프트(건축), 심즈(라이프스타일 커스텀) |
| 8 | **복종/몰입** | Submission | 게임의 규칙과 리듬에 자발적으로 빠져드는 즐거움. 반복적이고 명상적인 체험. | 테트리스, 쿠키 클리커, 농장 시뮬레이터 |

**실무 규칙.** 대부분의 성공적인 게임은 이 중 **3–4개를 주축**으로 선택하고 집중한다. 8개 전부를 균등하게 노리면 어느 것도 강하지 못한 "특색 없는 게임"이 된다.

---

## 5. 역방향 독해 (The Counter-Directional Lens)

MDA의 가장 중요한 구조적 통찰.

```
설계자 시점 (순방향):   Mechanics → Dynamics → Aesthetics
플레이어 시점 (역방향):  Aesthetics → Dynamics → Mechanics
```

- **설계자**는 규칙을 조립하고, 그것이 만들어낼 행동 패턴을 예측하며, 최종적으로 플레이어가 어떤 감정을 느낄지 기대한다.
- **플레이어**는 "이 게임 재밌다(Aesthetics)"에서 시작해, "왜 재밌지? 이 상황이 긴장감 있어서(Dynamics)" → "아, 체력이 1일 때 보스 패턴이 바뀌니까(Mechanics)" 순으로 내려간다.

**핵심 함의.** 기획서를 쓸 때 "이 기능을 넣자(Mechanics)" 출발이 아니라, **"플레이어에게 어떤 감정을 줄 것인가(Aesthetics)"에서 역산**해야 한다. 논문 원문 표현 그대로 **"work in retrograde"**.

---

## 6. 실무 적용 — 기획서 역방향 설계 프로세스

```
Step 1. 목표 Aesthetics 선언
        "이 던전은 '탐험(Discovery) + 도전(Challenge)'을 핵심 미학으로 한다."

Step 2. 필요 Dynamics 도출
        "탐험을 위해선 '미지 영역 진입 시 보상 기대감'이,
         도전을 위해선 '실패-학습-재도전 루프'가 런타임에 발생해야 한다."

Step 3. Mechanics 구체화
        - 전장 안개(FoW) 시스템 → 미지 영역 시각 차단
        - 탐사 보상 테이블 → 희귀 아이템 확률 분포
        - 체크포인트 간격 → 실패 비용 조절 (너무 멀면 좌절, 너무 가까우면 긴장 해소)
        - 보스 패턴 3페이즈 → 학습 곡선 설계
```

---

## 7. 학술적 한계 및 비판 (Honest Assessment)

### 7.1. 콘텐츠 과소 대표 (Under-representation of Content)
- MDA는 **내러티브, 비주얼 아트, 사운드 디자인을 Aesthetics 안에 뭉뚱그려 넣는다.** 이것들은 독립적인 설계 계층인데, "감정 반응" 하나로 환원하면 실체가 사라진다.
- Jesse Schell의 **Elemental Tetrad**(Mechanics, Aesthetics, Story, Technology)가 이 한계를 보완한다. Story와 Technology를 독립 축으로 분리.

### 7.2. 메카닉스 편향 (Mechanics-Centric Bias)
- 시스템 기획자에게는 강력하지만, 내러티브 디자이너나 레벨 디자이너에게는 **자기 작업을 설명할 도구가 없다.** "내가 설계하는 레벨 동선은 Mechanics인가? Dynamics인가?" — 답이 모호하다.

### 7.3. 학술적 후속 확장
| 확장 모델 | 주요 차이 |
|-----------|-----------|
| **DDE (Design, Dynamics, Experience)** | Aesthetics를 Experience로 확장, 감정 외 인지적 체험 포함. |
| **Elemental Tetrad** (Schell, 2008) | Story + Technology를 독립 축으로 분리. |
| **MTDA+N** | Narrative를 4번째 축으로 명시 추가. |
| **Layered Tetrad** | MDA + Tetrad 하이브리드, 계층과 구성요소 동시 분석. |

### 7.4. "프레임워크가 창의성을 죽이는가?"
- 일부 비판자는 "형식적 틀이 예술적 직관을 억압한다"고 주장.
- **반론.** 프레임워크는 *공유 어휘(shared vocabulary)*를 제공하여 다직군 협업의 의사소통 비용을 낮춘다. 직관을 대체하는 것이 아니라, 직관을 **검증 가능한 형태로 번역**하는 도구다.

---

## 8. MDA vs Elemental Tetrad — 비교표

| 비교 축 | MDA | Elemental Tetrad |
|---------|-----|------------------|
| **초점** | 설계 *프로세스* — 시스템이 경험을 어떻게 생성하는가. | 게임의 *구성요소* — 게임을 이루는 재료는 무엇인가. |
| **계층 수** | 3 (Mechanics → Dynamics → Aesthetics). | 4 (Mechanics, Aesthetics, Story, Technology). |
| **방향성** | 순방향(설계자) / 역방향(플레이어) 이중 독해 강조. | 4요소 간 상호연결 그래프(어느 것도 독립이 아님). |
| **강점** | 시스템 밸런싱, 창발 행동 분석, 이머전트 게임플레이 설계. | 컨셉 단계에서 모든 차원을 균형 있게 점검. |
| **약점** | 스토리·기술을 독립 축으로 다루지 않음. | 런타임 창발 행동을 분석하는 도구가 약함. |
| **적합 단계** | 시스템 설계·튜닝·QA 피드백 분석. | 초기 컨셉·GDD 작성·피칭. |

**결론.** 두 프레임워크는 대립이 아니라 **상보적**이다. 컨셉 단계에서 Tetrad로 구성요소를 점검하고, 시스템 설계 단계에서 MDA로 "이 규칙이 어떤 감정을 유도하는가?"를 역산한다.

---

## 9. 면접 방어 시나리오 (Interview Defense)

**Q. "이 시스템이 왜 재밌다고 생각하세요?"**

> "MDA 프레임워크로 역산하면 이렇습니다.
> 이 시스템의 목표 Aesthetics는 **Discovery(탐험)**와 **Challenge(도전)**입니다.
> 이를 위해 필요한 Dynamics는 '미지 영역 진입 시 기대감-불안감 교차'와 '실패 후 패턴 학습을 통한 점진적 마스터리'입니다.
> 이 Dynamics를 유도하기 위한 Mechanics로, 전장 안개 시스템과 보스 3페이즈 패턴을 설계했습니다.
> 단순히 '재밌을 것 같아서'가 아니라, 감정 목표에서 규칙으로 역산한 구조입니다."

---

## 10. 깊이 판별 질문 (Depth Check)

1. MDA에서 설계자가 "직접 제어"할 수 있는 계층은 무엇이고, 나머지 두 계층은 왜 간접 제어인가.
2. "8 Kinds of Fun" 중 Submission과 Challenge는 어떻게 공존할 수 있는가. 두 미학이 동시에 강한 게임의 예를 들어라.
3. MDA의 "역방향 독해"와 기획 의도 설계의 "왜 → 무엇을 → 어떻게" 순서는 어떤 구조적 유사성이 있는가.
4. MDA가 내러티브 디자인을 제대로 다루지 못하는 이유를 설명하고, 이를 보완하려면 어떤 추가 축이 필요한지 제안하라.
