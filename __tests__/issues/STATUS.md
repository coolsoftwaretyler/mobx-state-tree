# Issue reproduction status

Generated from the per-issue worker reports after review. One test file per issue under this folder; the file header carries the same status.

| issue | status | kind | confidence | suspected cause / fixed by | fix API-neutral? |
|---|---|---|---|---|---|
| [#1291](https://github.com/mobxjs/mobx-state-tree/issues/1291) | CANNOT_REPRODUCE | runtime | low |  | yes |
| [#1297](https://github.com/mobxjs/mobx-state-tree/issues/1297) | ALREADY_FIXED | runtime | high | eef7b6d7 (#1581, 2021) | yes |
| [#1458](https://github.com/mobxjs/mobx-state-tree/issues/1458) | REPRODUCES | runtime | high | src/types/utility-types/reference.ts addTargetNodeWatcher: the beforeDetach/beforeDestroy hooks are registered once, on the node the reference resolved to at wa | yes |
| [#1640](https://github.com/mobxjs/mobx-state-tree/issues/1640) | ALREADY_FIXED | types | high | 3a2945db (#2199) | yes |
| [#1738](https://github.com/mobxjs/mobx-state-tree/issues/1738) | ALREADY_FIXED | types | high | 3a2945db (#2199) | yes |
| [#1745](https://github.com/mobxjs/mobx-state-tree/issues/1745) | WORKS_AS_DESIGNED | runtime | high | The castToReferenceSnapshot JSDoc example in src/core/mst-operations.ts (around lines 988-1006, mirrored in docs/API) creates `a` and `b` as separate roots, whi | yes |
| [#1760](https://github.com/mobxjs/mobx-state-tree/issues/1760) | ALREADY_FIXED | types | medium | 3a2945db (#2199) | yes |
| [#1778](https://github.com/mobxjs/mobx-state-tree/issues/1778) | REPRODUCES | types | high | src/core/mst-operations.ts resolveIdentifier: the type parameter is constrained to `IT extends IAnyModelType`. | yes |
| [#1874](https://github.com/mobxjs/mobx-state-tree/issues/1874) | REPRODUCES | runtime | high | src/types/complex-types/map.ts MSTMap.put (the !isValidIdentifier(id) branch, ~lines 194-198) builds a standalone instance with getChildType().create(value) jus | yes |
| [#2255](https://github.com/mobxjs/mobx-state-tree/issues/2255) | CANNOT_REPRODUCE | runtime | low |  | yes |

Statuses: REPRODUCES (test is `test.failing`, flips when fixed), ALREADY_FIXED (plain regression test; close citing the fixing change), WORKS_AS_DESIGNED (test pins documented behavior; fix is docs), CANNOT_REPRODUCE (`test.todo` records what is missing).
