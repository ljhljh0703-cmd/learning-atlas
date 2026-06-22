#!/usr/bin/env python3
# Learning Atlas README 자동 인덱스 — 专栏(techniques/methods/narrative) 폴더를 스캔해 X-Plore식 목차 README.md 생성.
"""
사용법: python3 build_index.py
  export.py 가 만든 专栏 폴더를 읽어 repo 루트 README.md 를 생성한다. vault 무관(로컬 출력만 읽음).
"""
import os, re, glob

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)

COLUMNS = [
    ("techniques", "🔬 Techniques", "논문 · 아키텍처 · 알고리즘 · 연구 기법"),
    ("methods",    "🛠️ Methods",    "도구 · 워크플로우 · 방법론 · 스킬"),
    ("narrative",  "📖 경험 서사",   "부트캠프 등 경험이 섞인 학습"),
]

def meta(path):
    with open(path, encoding="utf-8") as f:
        text = f.read()
    fm = {}
    if text.startswith("---"):
        block = text.split("---", 2)
        if len(block) >= 3:
            for ln in block[1].split("\n"):
                m = re.match(r"^(\w+):\s*(.+)$", ln)
                if m:
                    fm[m.group(1)] = m.group(2).strip().strip('"')
            text = block[2]
    title = next((ln[2:].strip() for ln in text.split("\n") if ln.startswith("# ")), None)
    return title or os.path.splitext(os.path.basename(path))[0], fm

def main():
    lines = [
        "# Learning Atlas",
        "",
        "> 한 사람의 학습을 *지식 그래프*로 운영하는 공개 허브. 노트는 노드, 링크는 엣지.",
        "> 각 글은 Obsidian 기반 개인 second-brain vault 에서 **누출 게이트를 통과한 것만** 단방향으로 내보내진다.",
        "> 파이프라인은 [`tools/`](tools/) 에 공개 — 무엇을 어떻게 정제해 내보내는지 전부 볼 수 있다.",
        "",
    ]
    counts = []
    body = []
    for col, head, desc in COLUMNS:
        d = os.path.join(PROJ, col)
        files = sorted(glob.glob(os.path.join(d, "*.md")))
        if not files:
            continue
        counts.append((head, len(files)))
        body.append(f"## {head}")
        body.append("")
        body.append(f"*{desc}* — {len(files)}편")
        body.append("")
        body.append("| 글 | 출처 | 최종 수정 |")
        body.append("|----|------|-----------|")
        rows = []
        for fp in files:
            title, fm = meta(fp)
            href = f"{col}/{os.path.basename(fp)}"
            src = fm.get("source", "")
            src = re.sub(r"\s*\(.*\)\s*$", "", src)
            if len(src) > 48:
                src = src[:45] + "…"
            rows.append((fm.get("updated", ""), f"| [{title}]({href}) | {src} | {fm.get('updated','')} |"))
        for _, row in sorted(rows, key=lambda x: x[0], reverse=True):
            body.append(row)
        body.append("")

    total = sum(c for _, c in counts)
    lines.append(f"**{total}편** · " + " · ".join(f"{h.split(' ',1)[1]} {c}" for h, c in counts))
    lines.append("")
    lines += body
    lines.append("---")
    lines.append("")
    lines.append("이 저장소는 자동 생성된다. 파이프라인: `tools/export.py`(vault→정제·누출게이트) → `tools/build_index.py`(목차). 자세한 원칙은 [`tools/PIPELINE.md`](tools/PIPELINE.md).")
    lines.append("")

    with open(os.path.join(PROJ, "README.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"✅ README.md 생성 — 총 {total}편 ({', '.join(f'{h.split(chr(32),1)[1]}:{c}' for h,c in counts)})")

if __name__ == "__main__":
    main()
