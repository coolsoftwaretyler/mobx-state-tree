# Benchmarks

Informational micro-benchmarks for the hot paths that issues keep landing on: node creation,
snapshot application and reconciliation, array replacement, identifier and reference
resolution. They are not tests and never gate the test suite; numbers are specific to the
machine that produced them.

```bash
bun run bench                                   # table on stdout
bun run bench -- --out bench/results/me.json    # also save a record
bun run bench:compare bench/baselines/<file>.json bench/results/me.json
```

`bench/baselines/` holds records taken on a named machine at a named commit. Compare against
the one that matches your hardware; a 15% change in median is the default threshold for
calling something a regression. When a fix is meant to speed something up, add or extend a
scenario first, record a baseline, then fix.

Scenarios live in `bench/scenarios.ts`. The model fixtures under `bench/fixtures/` were ported from the old, disabled `__tests__/perf/` suite, which this replaces.
