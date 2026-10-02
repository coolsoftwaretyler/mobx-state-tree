# Issue reproduction status

Generated from the per-issue worker reports after review. One test file per issue under this folder; the file header carries the same status.

| issue | status | kind | confidence | suspected cause / evidence | fix API-neutral? |
|---|---|---|---|---|---|
| [#1297](https://github.com/mobxjs/mobx-state-tree/issues/1297) | ALREADY_FIXED | runtime | high |  | yes |
| [#1640](https://github.com/mobxjs/mobx-state-tree/issues/1640) | ALREADY_FIXED | types | high |  | yes |
| [#1738](https://github.com/mobxjs/mobx-state-tree/issues/1738) | ALREADY_FIXED | types | high |  | yes |
| [#1745](https://github.com/mobxjs/mobx-state-tree/issues/1745) | WORKS_AS_DESIGNED | runtime | high | The castToReferenceSnapshot JSDoc example in src/core/mst-operations.ts (around lines 988-1006, mirrored in docs/API) creates `a` and `b` as separate roots, whi | yes |
| [#1874](https://github.com/mobxjs/mobx-state-tree/issues/1874) | REPRODUCES | runtime | high | src/types/complex-types/map.ts MSTMap.put (the !isValidIdentifier(id) branch, ~lines 194-198) builds a standalone instance with getChildType().create(value) jus | yes |

Statuses: REPRODUCES (test is `test.failing`, flips when fixed), ALREADY_FIXED (plain regression test; close with the cited change), WORKS_AS_DESIGNED (test pins documented behavior; fix is docs), CANNOT_REPRODUCE (`test.todo` records what is missing).
