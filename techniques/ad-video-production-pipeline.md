---
created: 2026-06-16
updated: 2026-06-16
type: learning
tags: [ad, video, veo, motion-graphics, claymation, image-gen, ffmpeg, production]
category: technique
source: https://github.com/alexmcdonnell-airtable/hyperagent-public-skills
---

> 출처: hyperagent-public-skills 5스킬(`nyc-subway-campaign`·`briefing-trailer`·`veo-hyperframes`·`claymation-explainer`·`claymation-podcast-clips`) **전문 직접 통독**(clone, 2026-06-16). 실전서 디버깅된 파이프라인·함정 모음. ad-storyboard(기획·스토리보드)의 *실제 영상 제작* 단계 + [video-use — 영상을 *읽는* 에이전트 스킬](../methods/video-use.md) 보강.

# 광고·영상 제작 파이프라인 (실전)

## 1. 이미지/영상 모델 라우팅 (전 스킬 공통)
- **GPT Image 2**(`openai/gpt-image-2`) — *legible 텍스트·UI·로고*. 짧은 텍스트 렌더 최강. ~1536px. 헤드라인·워드마크·대시보드·email 샷.
- **Nano Banana Pro**(`gemini-3-pro-image-preview`) — *캐릭터 일관 photoreal 스틸*, 다중 subject 일관, in-scene 타이포. hero likeness·graphics-dense 프레임.
- **Nano Banana 2**(`gemini-3.1-flash-image-preview`, 기본) — 빠른 스틸·스타일 메타포 샷.
- **Veo 3.1**(`GenerateVideo`) — 모션. **`firstFrameImage`만**(referenceImages+custom durationSeconds 조합=400). 8s/1080p 고정(타 값 거부)·trim은 후처리. 503=1회 재시도. native 동기 오디오 생성.

## 2. 일관성 lock = 정전급 핵심
- **로고/캐릭터 = canonical asset 1개 먼저 생성** → *모든* 씬 생성에 `inputImages`로 주입 + "제공된 아트워크를 letterform·spacing 그대로 재현, redraw 금지" 지시. 텍스트→이미지만 쓰면 프레임마다 로고가 미묘하게 달라짐.
- 로고는 **code-SVG→PNG(타입 충실 최강)** 또는 GPT Image 2 plate. (Helvetica 래스터 함정=Liberation Sans/임베드 TTF — [Editorial Grid Design Canon — Vignelli + Müller-Brockmann (전문)](editorial-grid-design-canon.md) §D.)
- **BRAND KIT 문장을 매 프롬프트에 append**: 모델은 hex 못 읽음 → 색을 *서술적으로*("fresh spring-leaf green, deep evergreen ink…") + "Spell every word exactly; no invented text, no extra logos."

## 3. Text Zone Composition (veo-hyperframes 정전 — 영상 텍스트 가독)
> **"contrast source를 못 대면 샷을 설계 안 한 것."** 예쁜 footage 뽑고 그림자로 텍스트 살리려 하지 말 것.
- 매 beat가 텍스트 zone 1개 선언(좌/우/하 **1/3**, narrow strip 아님) + contrast 방향(다크존+흰텍스트 기본 / 밝은존+검은텍스트).
- Veo 프롬프트에 **실제 contrast source 명명**("좌측 1/3은 건물 overhang의 deep shadow, near-black") + **preservation clause**("이 다크존은 샷 내내 어둡고 빈 채 — light creep·모션 X"). 없으면 Veo가 다크존을 모션/빛으로 채움.
- 텍스트는 선언된 zone 안에만. shadow는 최소 1겹(dark navy `rgba(10,12,24)` — 순흑은 colorkey가 먹음). weight 400-500(300은 영상서 사라짐). ≥18px.

## 4. 스킬별 산출 형태
- **NYC Subway Campaign** — 브랜드 → 실제 지하철 OOH 광고 photoreal 렌더 → 1 케이스스터디 웹페이지(masthead→brief→manifesto→brand book→work in context→copy→media run). 7 placement 아키타입(platform wall takeover/interior car cards/2-sheet poster/backlit diorama/station domination/digital screen/in-app payoff), 각 종횡비 지정. SearchImages로 환경 디테일 보강(흰 타일·steel column·형광등·노란 tactile edge·motion-blur train).
- **Briefing Trailer** — 실제 하루(Calendar/Gmail/Slack 연결) → ~30s "coming soon" 트레일러(2s 컷·VO 없음·텍스트로 서사). world bible(1단어 타이틀·1 캐릭터·~4 장소·시계=마감) → hero 포트레이트 1개 재사용 → Veo 8s를 2s 컷으로 reslice. 15컷 ~30s 리듬.
- **Veo + Hyperframes** — Veo footage + GSAP 모션그래픽 overlay(WebM→colorkey 합성). beat board가 footage↔overlay 계약. duration 카탈로그(30s=5beat×6s 등).
- **Claymation Explainer** — 스타일 explainer(8컷×3s≈24s). 캐릭터 ref(distinct 실루엣+시그널 색) → 씬 스틸(ref를 inputImages) → Veo → **단일 VO**(Gemini TTS Aoede). "more shots, faster cuts"=살아있음. 끝은 human+agent "together" beat.
- **Claymation Podcast Clips** — talking-head → claymation(원본 오디오 유지·2~3s마다 새 컷·번인 캡션). transcribe(timestamps)→스토리보드→clay hero(reference photo inputImages)→씬 스틸→Veo→캡션(.ass).

## 5. ffmpeg/제작 함정 (실전 디버깅)
- **drawtext 없음**(sandbox ffmpeg=libfreetype 미컴파일) → 텍스트를 Pillow PNG로 렌더해 `overlay` 합성.
- **단일 큰 filtergraph OOM**(20+ 1080p 입력=SIGKILL) → per-segment 렌더 → concat-demux(`-c copy`) → 최종 1패스 grade.
- **concat 전 전 클립 동일 정규화**(codec/size/fps/pixfmt/timescale) 필수 — 불일치 시 깨짐.
- **Veo 오디오 버리고 단일 VO만**(`-map 0:v -map 1:a`). concat.txt 경로는 *자기 디렉토리* 기준.
- **타입 주인공이면 영상생성 회피**(Veo letterform 프레임마다 드리프트) → 정지컷/웹 스크린캡처.
- **🚨 news-broadcast 안전필터**(claymation-podcast G6): 실제 인물 + 방송 레이아웃(chyron+ticker+LIVE) firstFrameImage는 Veo가 *조용히 거부*("No video URL"). 우회 = graphics 제거한 clean plate 애니 → graphics를 투명-center overlay로 재합성.
- **미디어 sandbox 반입**: staging URL curl 불가(SSO) → `FetchStoredFile(fileId)` → symlink. 웹 임베드는 `PublishFilePublicly` public URL(thread-scoped `/api/files` 는 iframe 인증 불가).

## 6. 반복 하드룰 (5스킬 + brand-book 공통)
🚫 **blue/purple gradient 금지**(indigo→cyan→magenta aurora=AI slop)·"Claude look"(warm-cream+serif) 회피. 브랜드에 맞는 register로 diverge. (→ design-index §4.5 전역.)

## 7. vault 적용
- ad-storyboard HARNESS: AS-09(레퍼런스 clean-room)·AS-11(비율 불변)에 §2 로고 lock·§3 Text Zone·§5 ffmpeg 함정 연결. 실제 영상 제작 단계 = 본 파이프라인.
- [video-use — 영상을 *읽는* 에이전트 스킬](../methods/video-use.md)(영상 *읽기*) ↔ 본 문서(영상 *만들기*) = 한 쌍.
- 작가 광고 작업(스카이틴 등)이 실제 영상까지 가면 §1~5 적용.
