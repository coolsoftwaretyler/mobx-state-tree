# Public API baseline

`api/baseline/` holds the library's emitted TypeScript declarations, normalized (comments
stripped, consistently printed). It is the public API contract. `bun run api:check` emits the
declarations from `src/` in-process and fails on any difference. It runs as part of `test:all`.

The baseline was created from the source that produced the published `mobx-state-tree@8.0.0`
package; the emitted declarations and bundles at that commit are byte-identical to the
published ones.

## What "stable" means here

A change that requires updating this baseline must satisfy all of:

1. No exported name is removed or renamed. `__tests__/core/api.test.ts` also guards this.
2. No runtime behavior changes for code that is valid today, including the text of error
   messages and warnings, which users match on.
3. A declaration may change only to become more precise: fixing an inferred `any`, `never` or
   `unknown`, tightening a loophole, or adding an overload or optional parameter. Code that
   compiled before must still compile with the same or a narrower inferred type.

Anything else is a breaking change and belongs on the next-major list, not in this baseline.

## Updating

```bash
bun run api:update
git add api/baseline
```

Commit the baseline change on its own, or at least in a commit whose message says which of
the three rules above the change satisfies and why. Reviewers read the baseline diff as the
API review.
