import os, sys
os.chdir(os.path.dirname(os.path.abspath(__file__)))
import json, collections, statistics
run = json.load(open("results/latest.json"))
R = run["results"]
L = []
def p(s=""): L.append(s)

p(f"# Jev triage run {run['schema']} — {run['ran_at'][:16]}Z")
p(f"{run['issues']} issues · {run['input_tokens']:,} input tokens · ~${run['est_cost_usd']} · {run['elapsed_ms']} ms · model {R[0]['model']}")
p()
# disposition
p("## Disposition (choice)")
p("| disposition | n | mean conf | conf ≥0.6 | 0.3–0.6 | <0.3 |"); p("|---|---|---|---|---|---|")
byd = collections.defaultdict(list)
for r in R: byd[r["answers"]["disposition"]["choice"]].append(r["answers"]["disposition"]["confidence"])
for d, cs in sorted(byd.items(), key=lambda kv: -len(kv[1])):
    p(f"| {d} | {len(cs)} | {statistics.mean(cs):.2f} | {sum(c>=0.6 for c in cs)} | {sum(0.3<=c<0.6 for c in cs)} | {sum(c<0.3 for c in cs)} |")
allc = [r["answers"]["disposition"]["confidence"] for r in R]
p(f"\nOverall disposition confidence: median {statistics.median(allc):.2f}, ≥0.6: {sum(c>=0.6 for c in allc)}, 0.3–0.6: {sum(0.3<=c<0.6 for c in allc)}, <0.3: {sum(c<0.3 for c in allc)}")
p()
p("## Root module (choice)")
p("| module | n | mean conf |"); p("|---|---|---|")
bym = collections.defaultdict(list)
for r in R: bym[r["answers"]["root_module"]["choice"]].append(r["answers"]["root_module"]["confidence"])
for m, cs in sorted(bym.items(), key=lambda kv: -len(kv[1])): p(f"| {m} | {len(cs)} | {statistics.mean(cs):.2f} |")
p()
p("## Nouls (probability of yes)")
p("| question | ≥0.8 yes | 0.2–0.8 unsure | ≤0.2 no |"); p("|---|---|---|---|")
nouls = [k for k,v in R[0]["answers"].items() if v["type"]=="noul"]
for k in nouls:
    ps = [r["answers"][k]["noul"] for r in R]
    p(f"| {k} | {sum(x>=0.8 for x in ps)} | {sum(0.2<x<0.8 for x in ps)} | {sum(x<=0.2 for x in ps)} |")
p()
p("## Scores")
for k in ("severity","vision_fit"):
    sc = [r["answers"][k]["score"] for r in R]
    cf = [r["answers"][k]["confidence"] for r in R]
    b = collections.Counter(round(s) for s in sc)
    p(f"- **{k}**: mean {statistics.mean(sc):.2f}, mean conf {statistics.mean(cf):.2f}, rounded level counts {dict(sorted(b.items()))}")
p()
# agreement with existing labels (weak proxy)
p("## Agreement with existing labels (weak proxy, not ground truth)")
mapping = {
 "bug": {"runtime_bug","performance_or_memory","typescript_defect"},
 "Typescript": {"typescript_defect"},
 "docs or examples": {"docs_only"},
 "question": {"usage_question","close_stale","docs_only"},
 "enhancement": {"feature_api_neutral","feature_new_api","breaking_change_proposal"},
 "brainstorming/wild idea": {"feature_new_api","breaking_change_proposal"},
 "can't fix": {"close_stale","docs_only","breaking_change_proposal","typescript_defect"},
}
p("| label | issues | Jev disposition in expected set |"); p("|---|---|---|")
for lab, ok in mapping.items():
    rows = [r for r in R if lab in r["labels"]]
    if not rows: continue
    agree = sum(r["answers"]["disposition"]["choice"] in ok for r in rows)
    p(f"| {lab} | {len(rows)} | {agree} ({100*agree//len(rows)}%) |")
p()
p("## Per-issue")
p("| # | title | disposition | conf | module | sev | repro | resolved | declined | blocked | breaking/behav-change | idle y | labels |")
p("|---|---|---|---|---|---|---|---|---|---|---|---|---|")
order = {"runtime_bug":0,"performance_or_memory":1,"typescript_defect":2,"docs_only":3,"feature_api_neutral":4,"feature_new_api":5,"breaking_change_proposal":6,"infra_chore":7,"usage_question":8,"close_already_resolved":9,"close_stale":10,"other":11}
def f(x): return f"{x:.2f}"
for r in sorted(R, key=lambda r:(order.get(r["answers"]["disposition"]["choice"],99), -r["answers"]["disposition"]["confidence"])):
    a = r["answers"]
    t = r["title"][:58].replace("|","/")
    p(f"| {r['number']} | {t} | {a['disposition']['choice']} | {f(a['disposition']['confidence'])} | {a['root_module']['choice']} | {a['severity']['score']:.1f} | {f(a['has_reproduction']['noul'])} | {f(a['thread_already_resolved']['noul'])} | {f(a['maintainer_declined']['noul'])} | {f(a['blocked_on_info']['noul'])} | {f(a.get('requires_breaking_change', a.get('asks_to_change_documented_behavior'))['noul'])} | {r['years_idle']} | {', '.join(r['labels'])[:40]} |")
p()
p("## Low-confidence dispositions (<0.4): top two options")
for r in sorted(R, key=lambda r:r["answers"]["disposition"]["confidence"]):
    a = r["answers"]["disposition"]
    if a["confidence"] >= 0.4: break
    top = sorted(a["probabilities"].items(), key=lambda kv:-kv[1])[:3]
    p(f"- #{r['number']} {r['title'][:70]} → " + ", ".join(f"{k} {v:.2f}" for k,v in top))

p()
p("## Closure candidates (policy in thresholds.json; every one is verify-then-human-review)")
from policy import closure_reasons, band
flagged = [(r, closure_reasons(r)) for r in R]; flagged = [(r, c) for r, c in flagged if c]
by = {}
for r, cs in flagged:
    for c in cs: by.setdefault(c, []).append(r)
for c, rs in by.items(): p(f"- **{c}** → {len(rs)}: " + ", ".join(f"#{r['number']}" for r in sorted(rs, key=lambda r: r['number'])))
p(f"- **union**: {len(flagged)} issues")
p()
p("## Confidence bands (thresholds.json)")
for q, key in (("disposition", "disposition"), ("module", "root_module")):
    cnt = {}
    for r in R: b = band(r["answers"][key]["confidence"], q); cnt[b] = cnt.get(b, 0) + 1
    p(f"- **{q}**: " + ", ".join(f"{k} {v}" for k, v in cnt.items()))
p()
esc = [r for r in R if band(r["answers"]["disposition"]["confidence"], "disposition") == "escalate"]
p(f"Escalate to Claude (disposition): " + ", ".join(f"#{r['number']}" for r in esc))
rev = [r for r in R if band(r["answers"]["disposition"]["confidence"], "disposition") == "review"]
p(f"Human review (disposition): " + ", ".join(f"#{r['number']}" for r in rev))
import glob, os
prevs = sorted(glob.glob("results/run-v*.json")); prevs = [x for x in prevs if f"-{run['schema']}-" not in x]
prev = prevs
if prev:
    P = {r["number"]: r for r in json.load(open(prev[-1]))["results"]}
    p()
    p(f"## Changes vs previous schema ({os.path.basename(prev[-1])})")
    chg = []
    for r in R:
        a, b = P[r["number"]]["answers"], r["answers"]
        if a["disposition"]["choice"] != b["disposition"]["choice"] or a["root_module"]["choice"] != b["root_module"]["choice"]:
            chg.append((r["number"], r["title"][:50], a["disposition"]["choice"], b["disposition"]["choice"], f"{b['disposition']['confidence']:.2f}", a["root_module"]["choice"], b["root_module"]["choice"]))
    p(f"{len(chg)} issues changed disposition or module")
    p("| # | title | prev disp | new disp | new conf | prev module | new module |"); p("|---|---|---|---|---|---|---|")
    for c in chg: p("| " + " | ".join(map(str,c)) + " |")
open("report.md","w").write("\n".join(L))

print(f"wrote report.md ({len(L)} lines)")
