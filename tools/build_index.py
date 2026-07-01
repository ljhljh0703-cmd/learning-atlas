#!/usr/bin/env python3
# Learning Atlas README 자동 인덱스 — 专栏(techniques/methods/narrative) 폴더를 스캔해 X-Plore식 목차 README.md 생성.
"""
사용법: python3 build_index.py
  export.py 가 만든 专栏 폴더를 읽어 repo 루트 README.md 를 생성한다. vault 무관(로컬 출력만 읽음).
  컬럼 내부는 config.json 의 index_groups(주제 그룹) 규칙으로 자동 분류해 소제목으로 묶는다.
"""
import os, re, json, glob

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)

COLUMNS = [
    ("techniques", "🔬 Techniques", "논문 · 아키텍처 · 알고리즘 · 연구 기법"),
    ("methods",    "🛠️ Methods",    "도구 · 워크플로우 · 방법론 · 스킬"),
    ("narrative",  "📖 경험 서사",   "경험과 지식이 함께 엮인 학습 (부트캠프 등)"),
]

def load_groups():
    """config.json 의 index_groups(공개) 로드. 없으면 그룹핑 비활성(None)."""
    try:
        with open(os.path.join(HERE, "config.json"), encoding="utf-8") as f:
            return json.load(f).get("index_groups")
    except Exception:
        return None

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

def haystack_of(path):
    """slug + frontmatter(tags 등) + H1 제목만 소문자화 — 본문 제외(본문 단어로 인한 오분류 방지)."""
    with open(path, encoding="utf-8") as f:
        text = f.read()
    fm = ""
    if text.startswith("---"):
        parts = text.split("---", 2)
        if len(parts) >= 3:
            fm = parts[1]
            text = parts[2]
    title = next((ln for ln in text.split("\n") if ln.startswith("# ")), "")
    slug = os.path.splitext(os.path.basename(path))[0]   # .md 확장자 제외(파일명-design.md 등 오매칭 방지)
    return (slug + "\n" + fm + "\n" + title).lower()

def group_of(path, groups):
    """rules 를 위에서부터 검사, 첫 매칭 그룹 반환. 미매칭은 default."""
    if not groups:
        return None
    hay = haystack_of(path)
    for rule in groups.get("rules", []):
        if any(kw.lower() in hay for kw in rule.get("match", [])):
            return rule["group"]
    return groups.get("default")

def render_table(body, files):
    body.append("| 글 | 출처 | 최종 수정 |")
    body.append("|----|------|-----------|")
    rows = []
    for fp in files:
        title, fm = meta(fp)
        col = os.path.basename(os.path.dirname(fp))
        href = f"{col}/{os.path.basename(fp)}"
        src = fm.get("source", "")
        src = re.sub(r"\s*\(.*\)\s*$", "", src)
        if len(src) > 48:
            src = src[:45] + "…"
        rows.append((fm.get("updated", ""), f"| [{title}]({href}) | {src} | {fm.get('updated','')} |"))
    for _, row in sorted(rows, key=lambda x: x[0], reverse=True):
        body.append(row)
    body.append("")

def main():
    groups = load_groups()
    lines = [
        "# Learning Atlas",
        "",
        "> 공부한 걸 주제별로 모아 공개하는 곳이에요. AI·에이전트·게임·디자인을 중심으로 논문·도구·방법론을 정리했어요.",
        "> 글은 비공개 Obsidian에 쌓고, 민감한 정보를 걸러낸 것만 자동으로 이 repo에 올려요. 노트끼리 링크로 이어져서 하나의 지식 그래프가 돼요.",
        "> 어떻게 내보내고 정제하는지는 [`tools/`](tools/)에 정리해뒀어요.",
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

        if groups and len(files) > 3:          # 소량 컬럼(narrative 등)은 그룹핑 생략 — 평면 렌더
            buckets = {}
            for fp in files:
                buckets.setdefault(group_of(fp, groups), []).append(fp)
            ordered = list(groups.get("order", []))
            for g in buckets:                       # order 에 없는 그룹은 뒤에 붙임(안전망)
                if g not in ordered:
                    ordered.append(g)
            for g in ordered:
                gfiles = buckets.get(g)
                if not gfiles:
                    continue
                body.append(f"### {g} <sub>{len(gfiles)}편</sub>")
                body.append("")
                render_table(body, gfiles)
        else:
            render_table(body, files)

    total = sum(c for _, c in counts)
    lines.append(f"**{total}편** · " + " · ".join(f"{h.split(' ',1)[1]} {c}" for h, c in counts))
    lines.append("")
    lines += body
    lines.append("---")
    lines.append("")
    lines.append("이 README는 자동으로 만들어져요. vault가 자라면 게이트를 통과한 새 글이 그대로 따라 올라와요. 파이프라인은 `tools/export.py`(vault→정제·누출 게이트) → `tools/build_index.py`(주제별 목차) 순서예요. 자세한 원칙은 [`tools/PIPELINE.md`](tools/PIPELINE.md)에 있어요.")
    lines.append("")

    with open(os.path.join(PROJ, "README.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"✅ README.md 생성 — 총 {total}편 ({', '.join(f'{h.split(chr(32),1)[1]}:{c}' for h,c in counts)})")

if __name__ == "__main__":
    main()
