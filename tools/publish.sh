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

# 4) 비공개 경로 누출 안전 재확인
cd "$REPO"
if git ls-files --error-unmatch tools/config.local.json >/dev/null 2>&1; then
  echo "❌ config.local.json 이 추적됨 — 중단(비공개 경로 누출)."; exit 1
fi

# 5) 변경 없으면 종료
if [ -z "$(git status --porcelain)" ]; then
  echo "✓ 변경 없음 — push 생략."; exit 0
fi

# 6) commit + push (인증 = gh credential helper, 사전 `gh auth setup-git` 1회)
git add -A
git commit -m "content: vault 학습 재export ($(date +%Y-%m-%d))"
git push
echo "✅ 발행 완료 → $(git remote get-url origin)"
