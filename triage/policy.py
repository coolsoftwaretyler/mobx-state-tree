import json, os
T = json.load(open(os.path.join(os.path.dirname(__file__), "thresholds.json")))
def A(r, k): return r["answers"][k]["noul"]
def band(conf, q):
    t = T[q]; return "accept" if conf >= t["accept"] else ("review" if conf >= t["review"] else "escalate")
def closure_reasons(r):
    d = r["answers"]["disposition"]["choice"]; c = T["closure"]; out = []
    if A(r, "thread_already_resolved") >= c["verify_then_close_resolved"]["thread_already_resolved"]: out.append("resolved?")
    if A(r, "blocked_on_info") >= c["needs_info_unanswered"]["blocked_on_info"]: out.append("needs-info")
    if d in c["stale_question"]["dispositions"] and r["years_idle"] >= c["stale_question"]["min_years_idle"]: out.append("stale-question")
    return out
