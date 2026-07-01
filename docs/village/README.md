마을 이력서 산출물의 실행 방법과 구조를 적은 README입니다.

# 마을 이력서

정적 GitHub Pages 배포를 가정한 이미지 지도형 이력서입니다. 지도는 `assets/map-background.png` 한 장을 배경으로 쓰고, 건물 라벨·클릭존·키보드 탐색·모달은 HTML 버튼 계층으로 처리합니다. v14/v15에서는 건물 입장 스탬프 투어와 완주 보상 모달을 추가했고, 기존 미입주 구역을 Learning Atlas 학습 게시판으로 전환했습니다. v16에서는 학습 게시판 1구역만 먼저 로컬 타일맵·스프라이트 합성 픽셀 에셋으로 교체해 전면 교체 판단용 시범을 만들었고, v16.1에서는 같은 구역을 GPT 생성 고밀도 아카이브 인테리어로 다시 교체했습니다. 정본은 Codex 브리프 §B 패킷과 v16 게임엔진 픽셀 전환 브리프이며, 충돌 시 패킷의 공개 링크·상태·정직 라벨을 우선했습니다.

## 파일

- `index.html`: 이미지 배경 + 7개 투명 클릭존 + CSS 분위기 연출 + BGM 토글(기본 OFF) + 스탬프 투어 + 완주 보상 모달 + 건물별 내부 씬 모달 + 작업 목록 단일 상세 팝업 + 텍스트 이력서 보기. 본문은 Pretendard, 큰 제목과 짧은 배지는 Galmuri를 사용합니다.
- `village-config.js`: 건물/작업 config. `groups[].members[]` 안에서 `slug`, `group`, `status`, `link`, `label`, `hook`, `stage`를 관리합니다. 학습 게시판은 `groups[].learningCards[]`에 실제 Learning Atlas 공개 파일 링크만 둡니다.
- `./Resume_LeeJuHyeong.html`: V1 이력서 마스터 사본(동봉). 텍스트 모드 iframe과 새 탭에서 참조합니다. 정본은 `(작가 로컬 마스터 · 비공개)`이며, 이 사본은 직접 수정하지 않습니다.
- `assets/map-background.png`: 16:10 원본 지도 배경. 이미지 안에는 텍스트와 캐릭터가 없고, 상호작용은 HTML 버튼이 담당합니다.
- `assets/interiors/`: `lab.png`, `workshop.png`, `game.png`, `studio.png`, `hall.png`, `board.png`. 16:10 인테리어 이미지이며 모달 배경으로만 사용합니다.
- `assets/fonts/`: `Pretendard-Regular.woff2`, `Pretendard-OFL.txt`, `Galmuri11.woff2`, `Galmuri9.woff2`, `OFL.txt`. 외부 폰트 CDN 없이 self-host로 로드합니다.
- `assets/audio/`: `village-bgm.ogg`, `village-bgm.mp3`. OpenGameArt `Go Lucky` 원본을 로컬 번들로 둔 선택형 BGM입니다.
- `tools/render-board-pixel-prototype.py`: 외부 에셋 없이 학습 게시판 시범 이미지를 재생성하는 로컬 타일/스프라이트 합성 스크립트입니다.

## 실행

파일로 바로 열어도 동작합니다.

```bash
open index.html
```

로컬 서버로 확인할 때는 동봉 사본과 같은 폴더를 서버 루트로 엽니다.

```bash
python3 -m http.server 8787
```

그 다음 `http://127.0.0.1:8787/`로 접속합니다.

## 수정 규칙

- ✅ 공개 작업(연구소 3 + 회관 Learning Atlas = 4)만 공개 링크를 사용합니다.
- 기존 미입주 멤버 풀은 마을 UI에서 노출하지 않습니다.
- 학습 게시판 카드는 실제 Learning Atlas 공개 repo에 존재하는 파일만 연결합니다.
- 새 작업은 해당 건물의 `members[]` 배열에 한 줄 추가하는 방식으로 확장합니다.
- 새 학습 카드는 `board.learningCards[]`에 `slug`, `tag`, `title`, `date`, `link`, `hook`을 추가하는 방식으로 확장합니다.
- v16/v16.1 전면 교체는 아직 적용하지 않았습니다. 현재는 학습 게시판 1구역 시범만 적용했고, 나머지 맵/인테리어 이미지는 기존 에셋입니다.
- 마스터 이력서가 갱신되면 `Resume_LeeJuHyeong.html` 사본을 다시 복사하고 `cmp`로 동일성을 확인합니다.
- 새 지도 배경 이미지는 외부 핫링크 없이 `assets/`에 동봉하고, 생성 출처와 사용 범위를 `assets/CREDITS.md`와 `assets/LICENSE`에 기록합니다. 새 폰트는 OFL 등 재배포 가능한 라이선스와 원문 라이선스 파일을 함께 둡니다.
- 인테리어 이미지는 로컬에 동봉된 `assets/interiors/*.png`만 사용합니다. 외부 핫링크를 쓰지 않습니다.
- BGM은 사용자 클릭 후에만 재생합니다. 자동재생, 외부 핫링크, 브라우저 생성 드론 톤을 사용하지 않습니다.
- 스탬프 투어는 `localStorage` 키 `juhyung-world-stamps-v1` 하나만 사용합니다. 초기화 버튼으로 삭제할 수 있습니다.
- Galmuri는 큰 제목과 짧은 배지/코드 라벨에만 제한적으로 사용합니다. 본문, 설명, 버튼, 모달 텍스트는 Pretendard를 기본으로 둡니다.
- API 키, 서버 연동, 임의 지표를 넣지 않습니다.
