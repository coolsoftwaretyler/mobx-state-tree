import os, sys
os.chdir(os.path.dirname(os.path.abspath(__file__)))
import json, collections
from policy import closure_reasons
run = json.load(open("results/latest.json")); R = run["results"]
DEF = {"runtime_bug","typescript_defect","performance_or_memory"}; FEAT = {"feature_api_neutral","feature_new_api","breaking_change_proposal"}
closure = {r["number"] for r in R if closure_reasons(r)}
by = collections.defaultdict(list)
for r in R: by[r["answers"]["root_module"]["choice"]].append(r)
L = [f"# Cluster map from Jev {run['schema']} root_module answers", "",
     "Ranked by number of defects (runtime, TypeScript, perf). `†` = closure candidate under thresholds.json policy. sev = Jev severity 0–3; wk = has_workaround; oth = others_affected.", "",
     "| module | defects | features | other | mean sev of defects |", "|---|---|---|---|---|"]
rows = []
for m, rs in by.items():
    d = [r for r in rs if r["answers"]["disposition"]["choice"] in DEF]; f = [r for r in rs if r["answers"]["disposition"]["choice"] in FEAT]; o = [r for r in rs if r not in d and r not in f]
    rows.append((m, d, f, o, sum(r["answers"]["severity"]["score"] for r in d)/len(d) if d else 0))
rows.sort(key=lambda x: (-len(x[1]), -len(x[2])))
for m,d,f,o,sev in rows: L.append(f"| {m} | {len(d)} | {len(f)} | {len(o)} | {sev:.1f} |")
L += ["", "## Issues per module", ""]
def line(r):
    a = r["answers"]; wk = a.get("has_workaround",{}).get("noul"); oth = a.get("others_affected",{}).get("noul")
    extra = (f" wk {wk:.1f}" if wk is not None else "") + (f" oth {oth:.1f}" if oth is not None else "")
    return f"#{r['number']}{'†' if r['number'] in closure else ''} {a['disposition']['choice']} {a['disposition']['confidence']:.2f} sev {a['severity']['score']:.1f}{extra} — {r['title'][:55]}"
for m,d,f,o,sev in rows:
    L.append(f"### {m}")
    for label, group in (("defects", d), ("features / proposals", f), ("other", o)):
        if group: L.append(f"- **{label}:** " + "; ".join(line(r) for r in sorted(group, key=lambda r: -r["answers"]["severity"]["score"])))
    L.append("")
open("clusters.md","w").write("\n".join(L)); print("clusters.md written")
