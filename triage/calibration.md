# Calibration record

Gold set: 26 issues labeled by Tyler on 2026-10-02 through the labeling artifact (collection `labels`). Stratified: 2 highest-confidence per v2 disposition plus the 8 lowest-confidence overall.

| schema | disposition agree | module agree | accept-band disposition | notes |
|---|---|---|---|---|
| v2 | 23/26 | 26/26 | 17/18 | closure as code policy; missed Tyler's strict "breaking" (#734 at conf 1.00) |
| v3 | 19/26 | 25/26 | 17/18 | strict breaking wording overcorrected: new warnings and bug fixes read as breaking |
| v4 | 22/26 | 24/26 | 17/18 | bug-vs-breaking rule encoded; #734 moved to review band; resolved question tightened; has_workaround, others_affected added |

**Frozen at v4.** Differences between v2 and v4 are within what 26 labels can resolve. v4 is kept because it encodes Tyler's stated rules and fixes the resolved question, which the closure policy depends on.

**Residual confusions (all in review or escalate bands, so a human sees them):**
- feature_api_neutral vs feature_new_api when the request is "add an option" (#1050).
- typescript_defect vs feature_new_api when the thread proposes a new helper as the fix (#1428).
- "other, needs discussion" has no Jev equivalent (#2254); Tyler uses it for proposals that need a maintainer decision.
- breaking_change_proposal vs feature_api_neutral for error-message rewording (#734) is a near coin flip; Tyler's rule says breaking.

**Thresholds (thresholds.json):** disposition accept ≥0.70 / review ≥0.40 / escalate below; module accept ≥0.50. Evidence: accept band 17/18 on every schema version; escalate band is where Jev's misses concentrate.

**Closure policy learned from gold:** Tyler kept all 8 issues the v2 age-based policy flagged. Age alone never closes. Closure candidates now come only from: resolved ≥0.8 (verify first), blocked_on_info ≥0.6, or usage_question/other idle ≥3 years. Declines by past maintainers, external cause, and workarounds are informational.

**Cost of the whole calibration:** 4 full runs over 97 issues, about 7 cents total.
