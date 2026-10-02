import os, sys
os.chdir(os.path.dirname(os.path.abspath(__file__)))
import json, glob, sys
from policy import band, closure_reasons
gold = json.load(open("gold/gold-labels.json")); gold = {int(k): v for k, v in gold.items()}
run = json.load(open(sys.argv[1] if len(sys.argv) > 1 else "results/latest.json")); R = {r["number"]: r for r in run["results"]}
print(f"## Eval {run['schema']} vs {len(gold)} gold labels")
dis = [(gold[n]["disposition"] == R[n]["answers"]["disposition"]["choice"], R[n]["answers"]["disposition"]["confidence"], n) for n in gold]
mod = [(gold[n]["module"] == R[n]["answers"]["root_module"]["choice"], R[n]["answers"]["root_module"]["confidence"], n) for n in gold]
print(f"disposition {sum(x[0] for x in dis)}/{len(dis)} · module {sum(x[0] for x in mod)}/{len(mod)}")
for q, xs in (("disposition", dis), ("module", mod)):
    for b in ("accept", "review", "escalate"):
        g = [x for x in xs if band(x[1], q) == b]
        if g: print(f"  {q} {b}: {sum(x[0] for x in g)}/{len(g)} agree")
miss = [x for x in dis if not x[0]]
for ok, c, n in miss:
    a = R[n]["answers"]["disposition"]; print(f"  miss #{n}: Tyler={gold[n]['disposition']} Jev={a['choice']} conf={c:.2f} p(Tyler)={a['probabilities'].get(gold[n]['disposition'], 0):.2f}")
flag = [(n, closure_reasons(R[n])) for n in gold if closure_reasons(R[n])]
print(f"closure candidates among gold: {len(flag)} → " + ", ".join(f"#{n} {r}" for n, r in flag) if flag else "closure candidates among gold: none")
