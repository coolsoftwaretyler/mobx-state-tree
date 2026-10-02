# Escalation notes (Claude read the full thread; Jev disposition confidence < 0.4 in v1)

## #1369 getType ignores types.refinement
- Jev v1: feature_api_neutral 0.22 / close_stale 0.21 / feature_new_api 0.18
- Thread: real quirk. `refinement.create()` validates, then instantiates the node as the base type, so `getType()` returns the base. Maintainer (xaviergonz, 2019): "doable, but not easy", "not sure if a bug or an enhancement". Community workaround via `types.compose` (2023).
- Verdict: low-severity **runtime_bug** in `refinement`, module `refinement_custom_enum`. Fixable API-neutrally by keeping the refinement type on the node. Jev's uncertainty mirrors the maintainers' own.

## #2216 TypeScript override of mandatory prop with optional in sub-model
- Jev v1: close_already_resolved 0.51; thread_already_resolved 0.95; maintainer_declined 0.91
- Thread: fix attempted (Omit-based intersection), reverted because it caused "excessively deep type instantiation" (#2230). Tyler reopened to keep context. Final "No errors using v7.0.1, thanks!" refers to the revert fixing a side regression, not to the original problem.
- Verdict: **typescript_defect**, module `model`, currently blocked by the type-system depth trade-off. Belongs to the model type algebra cluster with #2253, #1403, #1833, #1367.
- Systematic Jev error found: `thread_already_resolved` fires on "thanks, works now" even when that refers to a side regression. Tighten criteria in v3 to "resolution of the originally reported problem".

## #1284 Getting parent of a reference
- Jev v1: close_already_resolved 0.28 / feature_new_api 0.25 / usage_question 0.16
- Thread: 2019 question. Not possible because references dereference on access; maintainer pointed at the references RFC (#1282), which never landed. Reporter has a workaround.
- Verdict: **feature_new_api** dependent on #1282, idle 7.4 years. Closure candidate: close with pointer to #1282 unless the references rework is in scope.

## #2253 types.compose does not override base properties for snapshot requirements
- Jev v1: typescript_defect 0.45 / close_already_resolved 0.27 / docs_only 0.24
- Thread: same intersection-typing limitation as #2216; PR #2218 reverted in #2234. Maintainer recommended a documentation clarification; reporter refactored.
- Verdict: **typescript_defect** sharing root cause with #2216, plus a **docs_only** follow-up. Near-tie was justified.

## Takeaways
- All four low-confidence calls were genuinely ambiguous threads. Confidence is carrying real signal.
- One criteria fix queued for v3 (thread_already_resolved). Hold further wording changes until the gold sheet is labeled.
- A concrete dependency surfaced: #2216, #2253, #1403, #1833, #1367 share the props/compose intersection typing root cause, gated by the excessive-depth constraint from #2230.
