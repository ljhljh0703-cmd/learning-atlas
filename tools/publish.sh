#!/usr/bin/env bash
# Learning Atlas 발행 — export(누출게이트) → build_index → commit → push. 게이트 FAIL 시 push 도달 X.
set -euo pipefail
cd "$(dirname "$0")"                       # tools/
REPO="$(cd .. && pwd)"

# 1) 실 vault 경로(비공개) 필수
if [ ! -f config.local.json ]; then
  echo "❌ tools/config.local.json 없음 — config.local.json.example 복사 후 vault_root 설정."; exit 1
fi

# 2) export + 누출 게이트. HARD 위반 시 export.py 가 exit 1 → set -e 로 여기서 중단(push 도달 X).
python3 export.py

# 3) 자동 인덱스
python3 build_index.py

# 3b) 포폴 페이지(docs/index.html)의 '최근 학습 다이제스트' 최신 N편으로 자동 갱신
python3 update_digest.py

# 4) 비공개 경로 누출 안전 재확인
cd "$REPO"
if git ls-files --error-unmatch tools/config.local.json >/dev/null 2>&1; then
  echo "❌ config.local.json 이 추적됨 — 중단(비공개 경로 누출)."; exit 1
fi

# 5) 원격 상태 최신화(밀린 커밋 판정용) + 작업트리 변경 있으면 commit
git fetch origin main --quiet 2>/dev/null || true
if [ -n "$(git status --porcelain)" ]; then
  git add -A
  git commit -m "content: vault 학습 재export ($(date +%Y-%m-%d))"
fi

# 6) 미푸시 커밋 있으면 push (작업트리 변경 없이 '밀린 커밋'만 있어도 발행 — 샌드박스에서 커밋만 된 경우 등)
#    인증 = gh credential helper, 사전 `gh auth setup-git` 1회
if [ -n "$(git rev-list origin/main..HEAD 2>/dev/null)" ]; then
  git push
  echo "✅ 발행 완료 → $(git remote get-url origin)"
else
  echo "✓ 변경·미푸시 커밋 없음 — push 생략."
fi
