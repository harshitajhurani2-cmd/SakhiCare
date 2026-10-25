import json, re, time, sys
from pathlib import Path
import requests

BASE = "http://localhost:8000"
DIR = Path(__file__).parent / "sample_reports"
raw = json.loads((DIR / "expected_values.json").read_text(encoding="utf-8"))
expected = {Path(item["file"]).name: item for item in raw}

def norm(s):
    return re.sub(r"[^a-z0-9]", "", str(s).lower())

def to_num(x):
    try:
        return float(str(x).replace(",", "").strip())
    except Exception:
        return None

def close(a, b):
    a, b = to_num(a), to_num(b)
    if a is None or b is None:
        return False
    return abs(a - b) <= max(0.05, abs(b) * 0.02)

limit = int(sys.argv[1]) if len(sys.argv) > 1 else 999
files = [p for p in sorted(DIR.iterdir())
         if p.suffix.lower() in (".pdf", ".png", ".jpg", ".jpeg")][:limit]

print(f"{'file':28} {'type':12} {'values ok':10} note")
for p in files:
    exp = expected.get(p.name) or {}
    exp_type = str(exp.get("type", "?"))
    want = {}
    for t in exp.get("tests") or []:
        if isinstance(t, (list, tuple)) and len(t) >= 2:
            want[norm(t[0])] = t[1]
        elif isinstance(t, dict):
            want[norm(t.get("name"))] = t.get("value")
    unsupported = "unsupported" in exp_type.lower() or not want

    r = None
    for attempt in range(3):
        try:
            with open(p, "rb") as f:
                r = requests.post(f"{BASE}/report/extract",
                                  files={"file": (p.name, f)}, timeout=120)
        except Exception as e:
            print(f"{p.name:28} {exp_type:12} {'-':10} ERROR {str(e)[:80]}")
            r = None
            break
        if r.status_code in (429, 503) and attempt < 2:
            time.sleep(15)
            continue
        break
    if r is None:
        continue
    if r.status_code != 200:
        print(f"{p.name:28} {exp_type:12} {'-':10} HTTP {r.status_code} {r.text[:80]}")
        continue

    data = r.json()
    if "error" in data:
        print(f"{p.name:28} {exp_type:12} {'-':10} API error: {str(data['error'])[:80]}")
        continue

    if unsupported:
        ok = data.get("supported") is False
        print(f"{p.name:28} {exp_type:12} {'-':10} {'rejected OK' if ok else 'NOT rejected'}")
    else:
        got = {norm(t.get("name")): t.get("value") for t in data.get("tests", []) if isinstance(t, dict)}
        ok = sum(1 for k, v in want.items() if k in got and close(got[k], v))
        print(f"{p.name:28} {exp_type:12} {ok}/{len(want):<8} detected: {data.get('report_type')}")
    time.sleep(3)