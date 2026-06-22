#!/usr/bin/env python3
# Learning Atlas export — vault(읽기전용) → public repo 단방향. 누출 0 게이트 내장. vault 쓰기 절대 0.
"""
사용법:
  python3 export.py            # vault → 专栏 폴더(techniques/methods/narrative) + 누출 게이트
  python3 export.py --check    # 검사만 (출력 안 씀)

게이트(Karpathy #4 검증 기준):
  - forbidden_dirs 콘텐츠가 출력에 0
  - forbidden_patterns(HARD) 매치 0 (sanitize 후)  → 위반 시 exit 1
  - warn_patterns(WARN) 는 neutralize 후 0 이어야 정상

파이프라인:
  pass 1  collect + 슬러그→(상대경로,제목) 맵 빌드
  pass 2  frontmatter 스크럽 · private wikilink 중화 · 공개 wikilink→상대 md 링크 · WARN 중화 · HARD 스캔 · write
"""
import json, os, re, sys, glob, shutil

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)   # repo root (= 공개 repo 루트, vault 밖)

def load_config():
    with open(os.path.join(HERE, "config.json"), encoding="utf-8") as f:
        cfg = json.load(f)
    local = os.path.join(HERE, "config.local.json")
    if os.path.exists(local):
        with open(local, encoding="utf-8") as f:
            cfg.update({k: v for k, v in json.load(f).items() if not k.startswith("_")})
    return cfg

CFG = load_config()
VAULT = os.environ.get("LEARNING_ATLAS_VAULT", CFG["vault_root"])
CHECK_ONLY = "--check" in sys.argv

if not os.path.isdir(VAULT) or VAULT.startswith("/path/to/"):
    sys.exit(f"❌ vault_root 미설정 → {VAULT}\n   tools/config.local.json 에 실제 경로를 넣거나 LEARNING_ATLAS_VAULT 환경변수를 설정하세요.")

# ---- 안전 불변식: 출력은 반드시 vault 밖 ----
def assert_outside_vault(path):
    rp = os.path.realpath(path)
    if rp.startswith(os.path.realpath(VAULT)):
        sys.exit(f"❌ FATAL: 출력 경로가 vault 내부입니다 → {rp}. 중단(vault 무영향 위반).")
assert_outside_vault(PROJ)

COLS = CFG["columns"]
MANAGED_DIRS = sorted(set(COLS.values()))  # techniques/methods/narrative — export 가 관리(rmtree 대상)

def column_of(abs_path):
    rel = os.path.relpath(abs_path, VAULT)
    parent = os.path.dirname(rel)
    return COLS.get(parent, COLS["_root"])

def slug_of(abs_path):
    return os.path.splitext(os.path.basename(abs_path))[0]

# ---- 대상 파일 수집 (allowlist only) ----
def collect():
    files = []
    for d in CFG["include_dirs"]:
        files += sorted(glob.glob(os.path.join(VAULT, d, "*.md")))
    files += sorted(glob.glob(os.path.join(VAULT, CFG["include_root_glob"])))
    for fp in CFG["include_files"]:
        ap = os.path.join(VAULT, fp)
        if os.path.exists(ap):
            files.append(ap)
    seen, out = set(), []
    excl = set(b.lower() for b in CFG.get("exclude_basenames", []))
    for f in files:
        rp = os.path.realpath(f)
        if rp in seen:
            continue
        seen.add(rp)
        rel = os.path.relpath(rp, VAULT)
        parts = rel.split(os.sep)
        if any(p in CFG["forbidden_dirs"] for p in parts):   # 방어선: forbidden_dir 절대 통과 X
            continue
        if slug_of(rp).lower() in excl:                        # index 등 라우터 제외
            continue
        out.append(rp)
    return out

# ---- frontmatter 분리 (선행 HTML 주석 허용 — §5.5 첫줄주석) ----
def split_doc(text):
    lines = text.split("\n")
    i = 0
    while i < len(lines) and lines[i].strip().startswith("<!--"):
        if "-->" in lines[i]:
            i += 1; continue
        i += 1
        while i < len(lines) and "-->" not in lines[i]:
            i += 1
        i += 1
    if i < len(lines) and lines[i].strip() == "---":
        fm = []; i += 1
        while i < len(lines) and lines[i].strip() != "---":
            fm.append(lines[i]); i += 1
        i += 1
        return fm, "\n".join(lines[i:])
    return [], "\n".join(lines[i:])

def title_of(fm_lines, body):
    for ln in body.split("\n"):
        if ln.startswith("# "):
            return ln[2:].strip()
    for ln in fm_lines:
        m = re.match(r"^title:\s*(.+)$", ln)
        if m:
            return m.group(1).strip().strip('"')
    return None

# ---- frontmatter sanitize: whitelist 키만 유지 ----
def sanitize_frontmatter(fm_lines):
    keep, drop = set(CFG["frontmatter_keep"]), set(CFG["frontmatter_drop"])
    out, skipping = [], False
    for ln in fm_lines:
        m = re.match(r"^(\w[\w\-]*):", ln)
        if m:
            key = m.group(1)
            skipping = (key in drop) or (key not in keep)
            if not skipping:
                out.append(ln)
        elif not skipping:
            out.append(ln)
    return out

# ---- private 판정 ----
def is_private_link(target):
    t = target.strip().lstrip("/")
    if t.startswith("wiki/"):
        t = t[5:]
    for pre in CFG["private_link_prefixes"]:
        if t.startswith(pre) or ("/" + pre) in t:
            return True
    base = t.split("/")[-1].split("#")[0].strip().lower()
    return base in [b.lower() for b in CFG["private_link_basenames"]]

# ---- wikilink sanitize+rewrite: private→텍스트, 공개 in-atlas→상대 md 링크, 그 외→텍스트 ----
def make_link_rewriter(linkmap, cur_col):
    def repl(m):
        inner = m.group(1)
        target, _, disp = inner.partition("|")
        target = target.strip()
        disp = disp.strip()
        base = target.split("/")[-1].split("#")[0].strip()
        if is_private_link(target):
            return disp if disp else base
        hit = linkmap.get(base.lower())
        if hit:
            relpath, title = hit
            text = disp if disp else (title or base)
            href = os.path.relpath(relpath, cur_col)   # cur_col 기준 상대경로
            return f"[{text}]({href})"
        return disp if disp else base                  # atlas 밖 공개 링크 → 텍스트
    return repl

def neutralize_local_paths(body):
    # 로컬 절대경로 누출 차단(username·디렉토리 구조). file:// md 링크는 표시텍스트만 남기고,
    # 남은 vault 절대경로 멘션은 <vault> 로, 그 외 /Users/ 경로는 <local-path> 로 중립화.
    body = re.sub(r"\[([^\]]+)\]\(file://[^)]*\)", r"\1", body)   # [텍스트](file:///...) → 텍스트
    for v in {VAULT, os.path.realpath(VAULT)}:
        body = body.replace(v, "<vault>")
    body = re.sub(r"/Users/\S+", "<local-path>", body)            # 백스톱(공백 없는 잔여 경로)
    return body

def sanitize_body(body, linkmap, cur_col):
    body = re.sub(r"\[\[([^\]]+)\]\]", make_link_rewriter(linkmap, cur_col), body)
    body = neutralize_local_paths(body)
    for pat, rep in CFG.get("body_neutralize_local", []):  # 로컬 전용(username 등) — config.local 에만
        body = re.sub(pat, rep, body)
    for pat, rep in CFG.get("warn_neutralize", []):     # WARN 중화
        body = re.sub(pat, rep, body)
    return body

# ---- 누출 스캐너 ----
def scan(text, patterns):
    hits = []
    for pat in patterns:
        for m in re.finditer(pat, text, re.IGNORECASE | re.MULTILINE):
            hits.append(m.group(0)[:60])
    return hits

def scan_hard(text):
    hits = scan(text, CFG["forbidden_patterns"])
    for lit in CFG.get("extra_forbidden_literals", []):
        if lit and lit in text:
            hits.append(lit[:60])
    return hits

# ---- 메인 ----
def main():
    files = collect()

    # pass 1: 슬러그 → (상대경로, 제목)
    linkmap, plan = {}, []
    for fp in files:
        col, slug = column_of(fp), slug_of(fp)
        relpath = f"{col}/{slug}.md"
        with open(fp, encoding="utf-8") as f:
            raw = f.read()
        fm, body = split_doc(raw)
        linkmap[slug.lower()] = (relpath, title_of(fm, body))
        plan.append((fp, col, relpath, fm, body))

    if not CHECK_ONLY:
        for d in MANAGED_DIRS:
            dp = os.path.join(PROJ, d)
            assert_outside_vault(dp)
            if os.path.exists(dp):
                shutil.rmtree(dp)
            os.makedirs(dp, exist_ok=True)

    total, violations, warnings, written = 0, [], [], 0
    for fp, col, relpath, fm, body in plan:
        total += 1
        fm = sanitize_frontmatter(fm)
        body = sanitize_body(body, linkmap, col)
        out_text = ("---\n" + "\n".join(fm) + "\n---\n" if fm else "") + body
        label = relpath
        hard = scan_hard(out_text)
        warn = scan(out_text, CFG.get("warn_patterns", []))
        if hard:
            violations.append((label, hard))
        if warn:
            warnings.append((label, warn))
        if not CHECK_ONLY:
            dest = os.path.join(PROJ, relpath)
            with open(dest, "w", encoding="utf-8") as f:
                f.write(out_text)
            written += 1

    print(f"\n=== Learning Atlas export {'(check)' if CHECK_ONLY else '(→ 专栏 폴더)'} ===")
    print(f"대상 파일: {total}  |  출력: {written}  |  HARD 위반: {len(violations)}  |  WARN: {len(warnings)}")
    if warnings:
        print("\n⚠️  WARN (neutralize 후에도 잔존 — 점검):")
        for label, w in warnings[:40]:
            print(f"  - {label}: {', '.join(sorted(set(w))[:5])}")
    if violations:
        print("\n❌ HARD 게이트 FAIL — 민감 누출:")
        for label, h in violations[:40]:
            print(f"  - {label}: {', '.join(sorted(set(h))[:5])}")
        print("\n게이트 = exit 1 (민감 누출 → repo 반영 차단)")
        sys.exit(1)
    print("\n✅ HARD 게이트 PASS — 민감 누출 0. (vault 무수정 확인)")
    sys.exit(0)

if __name__ == "__main__":
    main()
