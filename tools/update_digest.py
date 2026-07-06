#!/usr/bin/env python3
# Learning Atlas 포폴 다이제스트 자동 갱신 — 발행된 노트의 updated 최신순 N편을 docs/index.html 의 <!--DIGEST--> 구간에 재주입.
"""
사용법: python3 update_digest.py [target_html]
  export.py 가 만든 techniques/methods/narrative 노트를 읽어, updated(없으면 created) 최신순 N편을
  포폴 페이지의 <!--DIGEST:START--> ~ <!--DIGEST:END--> 구간에 <li> 로 다시 찍는다. (기본 target = ../docs/index.html)
  vault 무관 — 로컬 출력 폴더만 읽는다. group→태그·색은 config.json 의 index_groups 를 그대로 따른다.
"""
import os, re, json, glob, html, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
N = 7                        # 다이제스트 노출 편수 (CSS dg-list nth-child 1..7 와 일치)
PER_TAG_CAP = 2              # 도메인(태그)당 최대 편수 — 한 영역 쏠림 방지(부족하면 날짜순 보충)
TITLE_CAP = 48               # 제목 최대 길이(초과 시 … 말줄임 — .dg-t 는 말줄임 CSS 없음)
COLS = ["techniques", "methods", "narrative"]

# group(display name) → (짧은 태그, dot 색). 도메인 카드·팔레트와 일치.
GMETA = {
    "🎮 게임 · 로그라이크 · NPC AI": ("게임", "#3b6fff"),
    "🤖 에이전트 하네스 · 자가개선": ("하네스", "#7a5cff"),
    "🧠 AI · LLM 연구": ("AI·LLM", "#00c2b8"),
    "🎨 디자인 · 프론트엔드": ("디자인", "#ff7a59"),
    "🧰 도구 · 방법론": ("도구", "#f4b740"),
}
NARRATIVE_META = ("경험", "#7a87a3")

def load_groups():
    try:
        with open(os.path.join(HERE, "config.json"), encoding="utf-8") as f:
            return json.load(f).get("index_groups")
    except Exception:
        return None

def read_split(path):
    """(frontmatter_str, body_str) 반환."""
    t = open(path, encoding="utf-8").read()
    fm, body = "", t
    if t.startswith("---"):
        parts = t.split("---", 2)
        if len(parts) >= 3:
            fm, body = parts[1], parts[2]
    return fm, body

def meta(path):
    fm, body = read_split(path)
    d = {}
    for ln in fm.split("\n"):
        m = re.match(r"^(\w+):\s*(.+)$", ln)
        if m:
            d[m.group(1)] = m.group(2).strip().strip('"')
    title = next((ln[2:].strip() for ln in body.split("\n") if ln.startswith("# ")),
                 os.path.splitext(os.path.basename(path))[0])
    return title, d.get("updated", ""), d.get("created", "")

def group_of(path, groups):
    """build_index.py 와 동일한 haystack(slug+fm+H1) 규칙으로 그룹 판정."""
    if not groups:
        return None
    fm, body = read_split(path)
    title = next((ln for ln in body.split("\n") if ln.startswith("# ")), "")
    slug = os.path.splitext(os.path.basename(path))[0]
    hay = (slug + "\n" + fm + "\n" + title).lower()
    for rule in groups.get("rules", []):
        if any(kw.lower() in hay for kw in rule.get("match", [])):
            return rule["group"]
    return groups.get("default")

def clean_title(t):
    t = re.sub(r"\s+", " ", t).strip()
    if len(t) > TITLE_CAP:
        t = t[:TITLE_CAP - 1].rstrip(" -—·,:;(") + "…"
    return html.escape(t, quote=False)

def build_items():
    groups = load_groups()
    rows = []
    for col in COLS:
        for p in glob.glob(os.path.join(PROJ, col, "*.md")):
            title, up, cr = meta(p)
            date = up or cr
            if col == "narrative":
                tag, color = NARRATIVE_META
            else:
                g = group_of(p, groups)
                tag, color = GMETA.get(g, ("도구", "#f4b740"))
            rows.append((date, up, cr, tag, color, title))
    rows.sort(key=lambda x: x[5])                 # title asc — 동일 날짜 tie 를 결정적으로(파일시스템 순서 무의존 → 노이즈 커밋 방지)
    rows.sort(key=lambda x: x[0], reverse=True)   # date desc (stable sort — 같은 날짜 안에서 title 순 유지)
    # 최신순을 유지하되 도메인 편중 방지 — 태그당 최대 PER_TAG_CAP 편, 못 채우면 날짜순 보충
    picked, seen = [], {}
    for r in rows:
        if len(picked) >= N:
            break
        if seen.get(r[3], 0) < PER_TAG_CAP:
            picked.append(r)
            seen[r[3]] = seen.get(r[3], 0) + 1
    if len(picked) < N:
        for r in rows:
            if len(picked) >= N:
                break
            if r not in picked:
                picked.append(r)
    picked.sort(key=lambda x: x[5])
    picked.sort(key=lambda x: x[0], reverse=True)  # 최종 표시는 날짜 내림차순
    lis = []
    for date, up, cr, tag, color, title in picked:
        mmdd = (up or cr)[5:] if len(up or cr) >= 10 else "—"
        lis.append(
            f'<li><span class="dg-d">{mmdd}</span>'
            f'<span class="dg-dot" style="background:{color}"></span>'
            f'<span class="dg-t">{clean_title(title)}</span>'
            f'<span class="dg-g">{tag}</span></li>'
        )
    return lis

START = "<!--DIGEST:START (tools/update_digest.py 가 자동 갱신 — 이 구간 수동 편집 금지)-->"
END = "<!--DIGEST:END-->"

def main():
    target = sys.argv[1] if len(sys.argv) > 1 else os.path.join(PROJ, "docs", "index.html")
    if not os.path.isfile(target):
        sys.exit(f"❌ target 없음 → {target}")
    doc = open(target, encoding="utf-8").read()
    if "DIGEST:START" not in doc or END not in doc:
        sys.exit(f"❌ DIGEST 마커 없음 → {target} (포폴 <ul class=\"dg-list\"> 에 마커 필요)")
    lis = build_items()
    if not lis:
        sys.exit("❌ 노트 0편 — techniques/methods/narrative 먼저 export 필요.")
    block = START + "\n" + "\n".join("        " + li for li in lis) + "\n        " + END
    new = re.sub(r"<!--DIGEST:START.*?DIGEST:END-->", lambda m: block, doc, count=1, flags=re.DOTALL)
    if new == doc:
        print(f"✓ 다이제스트 변경 없음 — {os.path.relpath(target, PROJ)} ({len(lis)}편)")
        return
    with open(target, "w", encoding="utf-8") as f:
        f.write(new)
    print(f"✅ 다이제스트 갱신 — {os.path.relpath(target, PROJ)} · 최신 {len(lis)}편: "
          + ", ".join(re.search(r'dg-t\">(.*?)</span>', li).group(1)[:18] for li in lis))

if __name__ == "__main__":
    main()
