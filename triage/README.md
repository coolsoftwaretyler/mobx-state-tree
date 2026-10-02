# Issue triage with Jev

Cheap, calibrated first-pass classification of every open issue in mobx-state-tree, using TypeSafe AI's Jev model. Jev labels, Claude reasons, code decides. Nothing here posts to GitHub.

## What is in here

| path | purpose |
|---|---|
| `questions.ts` | The frozen v4 question schema: one disposition choice, one root-module choice, ten yes/no nouls, two scores. Edit only with new gold labels in hand. |
| `schema-history/` | v1 to v3 for the record. `calibration.md` says why each changed. |
| `run.ts` | Classifies every issue in `data/` in one request each and writes `results/run-<schema>-<time>.json` plus `results/latest.json`. |
| `policy.py` | Confidence bands and the closure policy, read from `thresholds.json`. The only place that turns probabilities into actions. |
| `report.py`, `clusters.py` | Regenerate `report.md` and `clusters.md` from `results/latest.json`. |
| `eval.py` | Scores a run against `gold/gold-labels.json`. |
| `gold/` | 26 maintainer labels, collected with the labeling page in `labeling/`. |
| `data/` | The raw issue export the runs were made from. |
| `escalations.md` | Claude's read of the lowest-confidence threads. |

## Run it

```bash
export TYPESAFE_API_KEY=...        # console.typesafe.ai/keys
bun install
bun run classify                   # ~3 s, ~2 cents for 97 issues
bun run report
bun run eval
```

To refresh the export: `bun run export-issues > data/issues-$(date +%F).json` and point `ISSUES_JSON` at it.

## How to read the results

- **accept** band: label taken as is. **review** band: a human glances at it. **escalate** band: Claude reads the thread and answers the same schema with a rationale.
- Closure candidates are never closed by this tooling. Each is verified by reproduction or by reading the thread, then a human decides.
- Store the full probability distributions, not just winners. They are the audit trail and the input to recalibration.

See `calibration.md` for agreement numbers and the policy lessons from the gold set.
