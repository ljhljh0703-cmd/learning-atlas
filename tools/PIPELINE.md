# Pipeline — Learning Atlas 내보내기 파이프라인

> 개인 Obsidian vault(비공개 second-brain) → 이 공개 저장소로 **단방향** 내보내는 도구.
> vault 는 0순위이고 이 저장소는 그 위성이다. **vault 는 어떤 경우에도 수정하지 않는다(읽기 전용).**

## 방화벽 원칙 (불변)
- **단방향**: vault(읽기) → sanitize → public. 역류 금지.
- **vault 쓰기 0**: 이 파이프라인은 vault 의 어떤 파일도 수정/생성하지 않는다. 출력이 vault 내부 경로면 즉시 중단한다(`assert_outside_vault`).
- **격리**: 모든 코드·config·산출물이 vault 밖에 산다.
- **공개 범위**: 기술 learnings(`techniques`/`methods`) + 루트 경험 서사형만. 정체성·지원서·성찰·진행로그·운영문서는 **전부 제외**.

## 누출 2단 게이트
- **HARD (exit 1, 반영 차단)**: 진짜 민감 누출 — 이메일·`[[me/]]`·`[[applications/]]`·`[[reflections/]]` 링크·등록 실명.
- **WARN (exit 0, 리포트)**: 내부 노이즈. 본문의 내부 폴더명 멘션 등은 `warn_neutralize` 규칙으로 중립화한다.
- **sanitize**: frontmatter 내부 필드 스크럽(`proposed_by`·`status` 등) + private wikilink 중화(표시 텍스트만 남김) + 공개 wikilink → 상대경로 markdown 링크 변환.

## 사용법
```bash
cd tools
# 1) 로컬 vault 경로 지정 (둘 중 하나)
cp config.local.json.example config.local.json   # 후 vault_root 편집  (또는)
export LEARNING_ATLAS_VAULT="/path/to/your/vault"

# 2) 내보내기 + 게이트
python3 export.py            # vault → ../techniques ../methods ../narrative + HARD 게이트
python3 export.py --check    # 검사만 (출력 안 씀)

# 3) 목차 생성
python3 build_index.py       # ../README.md 재생성
```
HARD PASS(exit 0) 여야만 커밋·push 한다.

## 파일
- `export.py` — vault → 정제 노트(专栏 폴더). 2-pass(슬러그 맵 → 링크 변환).
- `build_index.py` — 专栏 폴더 스캔 → 루트 `README.md` 목차.
- `config.json` — 공개 설정(allowlist·게이트 패턴). `vault_root` 는 플레이스홀더.
- `config.local.json` — 로컬 실제 vault 경로. **gitignore(커밋 금지)**.

## 작가 TODO (선택)
- `config.json` 의 `extra_forbidden_literals` 에 실명을 넣으면 이름 누출도 HARD 차단(완전성).
