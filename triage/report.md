# Jev triage run v4 — 2026-10-02T16:49Z
97 issues · 446,744 input tokens · ~$0.0188 · 3278 ms · model jev-1.13.0

## Disposition (choice)
| disposition | n | mean conf | conf ≥0.6 | 0.3–0.6 | <0.3 |
|---|---|---|---|---|---|
| runtime_bug | 25 | 0.93 | 23 | 2 | 0 |
| feature_new_api | 24 | 0.87 | 20 | 4 | 0 |
| typescript_defect | 19 | 0.84 | 15 | 4 | 0 |
| breaking_change_proposal | 8 | 0.73 | 6 | 2 | 0 |
| docs_only | 8 | 0.96 | 8 | 0 | 0 |
| infra_chore | 4 | 0.85 | 3 | 1 | 0 |
| usage_question | 4 | 0.74 | 3 | 1 | 0 |
| performance_or_memory | 3 | 0.98 | 3 | 0 | 0 |
| feature_api_neutral | 2 | 0.42 | 0 | 2 | 0 |

Overall disposition confidence: median 0.97, ≥0.6: 81, 0.3–0.6: 16, <0.3: 0

## Root module (choice)
| module | n | mean conf |
|---|---|---|
| model | 14 | 0.74 |
| reference | 14 | 0.87 |
| node_lifecycle | 10 | 0.80 |
| actions_flow | 9 | 0.78 |
| snapshot_processor | 5 | 0.81 |
| union | 5 | 0.95 |
| map | 4 | 0.91 |
| identifier | 4 | 0.97 |
| build_packaging | 4 | 0.94 |
| patches_snapshots | 4 | 0.86 |
| refinement_custom_enum | 4 | 0.71 |
| mobx_interop | 4 | 0.73 |
| type_checker | 3 | 0.89 |
| middleware | 3 | 0.89 |
| docs_site | 3 | 0.89 |
| tree_operations | 2 | 0.77 |
| array | 2 | 0.92 |
| react_integration | 1 | 0.92 |
| late_lazy | 1 | 0.84 |
| unknown | 1 | 0.64 |

## Nouls (probability of yes)
| question | ≥0.8 yes | 0.2–0.8 unsure | ≤0.2 no |
|---|---|---|---|
| has_reproduction | 61 | 20 | 16 |
| proposes_concrete_fix | 10 | 45 | 42 |
| thread_already_resolved | 0 | 2 | 95 |
| has_workaround | 36 | 26 | 35 |
| others_affected | 35 | 22 | 40 |
| external_cause | 3 | 39 | 55 |
| maintainer_declined | 7 | 16 | 74 |
| blocked_on_info | 2 | 12 | 83 |
| asks_to_change_documented_behavior | 6 | 53 | 38 |
| reporter_is_frustrated_or_blocked | 6 | 35 | 56 |

## Scores
- **severity**: mean 1.47, mean conf 0.66, rounded level counts {0: 3, 1: 41, 2: 52, 3: 1}
- **vision_fit**: mean 1.81, mean conf 0.66, rounded level counts {0: 14, 1: 24, 2: 27, 3: 32}

## Agreement with existing labels (weak proxy, not ground truth)
| label | issues | Jev disposition in expected set |
|---|---|---|
| bug | 27 | 27 (100%) |
| Typescript | 13 | 11 (84%) |
| docs or examples | 15 | 8 (53%) |
| question | 5 | 4 (80%) |
| enhancement | 23 | 19 (82%) |
| brainstorming/wild idea | 15 | 12 (80%) |
| can't fix | 4 | 2 (50%) |

## Per-issue
| # | title | disposition | conf | module | sev | repro | resolved | declined | blocked | breaking/behav-change | idle y | labels |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1291 | safeReference causes "Computed values are not allowed to c | runtime_bug | 1.00 | reference | 1.6 | 0.92 | 0.07 | 0.05 | 0.04 | 0.11 | 7.3 | bug |
| 1317 | applySnapshot does not call preProcessSnapshot when using  | runtime_bug | 1.00 | snapshot_processor | 2.0 | 0.96 | 0.12 | 0.06 | 0.11 | 0.06 | 1.5 | bug, help/PR welcome, level: easy, hackt |
| 1433 | Walk is not walking the tree | runtime_bug | 1.00 | tree_operations | 1.9 | 0.95 | 0.03 | 0.04 | 0.28 | 0.06 | 2.8 | bug, help/PR welcome |
| 1458 | safeReference invalidates on old subtree destroying | runtime_bug | 1.00 | reference | 1.6 | 0.95 | 0.05 | 0.03 | 0.07 | 0.15 | 3.3 | bug, help/PR welcome, level: intermediat |
| 1547 | Destroying a model with a preprocessor that returns a new  | runtime_bug | 1.00 | snapshot_processor | 1.2 | 0.95 | 0.04 | 0.04 | 0.05 | 0.09 | 3.3 | bug, help/PR welcome |
| 1551 | getRoot in afterAttach returns undefined in Jest tests | runtime_bug | 1.00 | node_lifecycle | 1.3 | 0.97 | 0.29 | 0.12 | 0.10 | 0.08 | 1.1 | has PR |
| 1648 | My model returns fields as null, if I created model fields | runtime_bug | 1.00 | union | 2.1 | 0.95 | 0.03 | 0.05 | 0.05 | 0.12 | 3 | has PR |
| 1874 | Reference's `onInvalidated()` called after `map.put(snapsh | runtime_bug | 1.00 | reference | 1.5 | 0.98 | 0.03 | 0.04 | 0.04 | 0.14 | 2.5 | bug, help/PR welcome, level: intermediat |
| 1897 | snapshotProcessor modifies the type it wraps | runtime_bug | 1.00 | snapshot_processor | 2.0 | 0.97 | 0.05 | 0.03 | 0.04 | 0.04 | 3.3 | bug, help/PR welcome, level: intermediat |
| 2136 | Unexpected error "Сannot finalize the creation of a node t | runtime_bug | 0.99 | snapshot_processor | 2.0 | 0.96 | 0.03 | 0.05 | 0.31 | 0.08 | 2.1 | bug, docs or examples |
| 2185 | Mobx/Mobx-state-tree doesnt work in module federation of W | runtime_bug | 0.99 | mobx_interop | 2.2 | 0.28 | 0.02 | 0.07 | 0.76 | 0.08 | 2.3 | needs reproduction/info |
| 2255 | Duplicates in Identifier Cache | runtime_bug | 0.99 | identifier | 2.7 | 0.14 | 0.03 | 0.04 | 0.40 | 0.08 | 1.5 | needs reproduction/info |
| 1399 | union subtree isn't evaluated correctly when assigning dat | runtime_bug | 0.98 | union | 1.9 | 0.97 | 0.04 | 0.10 | 0.05 | 0.20 | 3.2 | bug |
| 1745 | Instance node can't be used to instantiate a reference | runtime_bug | 0.98 | reference | 1.8 | 0.97 | 0.18 | 0.02 | 0.03 | 0.06 | 5.2 | help/PR welcome |
| 2277 | Error when React 19 component has MST node as prop with ob | runtime_bug | 0.98 | node_lifecycle | 1.2 | 0.96 | 0.05 | 0.17 | 0.83 | 0.15 | 0.6 | bug |
| 2279 | React 19.2 dev mode breaks MST: "creation of the observabl | runtime_bug | 0.98 | node_lifecycle | 1.7 | 0.09 | 0.04 | 0.06 | 0.64 | 0.17 | 0.6 | bug, needs reproduction/info |
| 1987 | Aborting action with AbortController does not work immedia | runtime_bug | 0.97 | actions_flow | 1.8 | 0.97 | 0.03 | 0.04 | 0.06 | 0.19 | 1.2 | bug, help/PR welcome, level: intermediat |
| 1271 | createActionTrackingMiddleware breaks with nested flows | runtime_bug | 0.95 | middleware | 1.8 | 0.95 | 0.09 | 0.10 | 0.12 | 0.14 | 3.2 | bug, middleware |
| 1297 | types.snapshotProcessor and types.reference | runtime_bug | 0.92 | reference | 2.0 | 0.96 | 0.06 | 0.06 | 0.25 | 0.14 | 5.9 | bug |
| 1303 | Strange error with React Devtools: the creation of the obs | runtime_bug | 0.91 | react_integration | 0.6 | 0.17 | 0.07 | 0.07 | 0.09 | 0.16 | 3.9 | bug, help/PR welcome |
| 2211 | onBecomeUnobserved is never called | runtime_bug | 0.91 | node_lifecycle | 1.6 | 0.97 | 0.03 | 0.92 | 0.07 | 0.36 | 2.1 | can't fix |
| 1396 | getSnapshot returning inconsistent results | runtime_bug | 0.89 | patches_snapshots | 1.6 | 0.98 | 0.20 | 0.05 | 0.04 | 0.14 | 6.9 | bug |
| 1369 | getType ignore types.refinement | runtime_bug | 0.81 | refinement_custom_enum | 1.7 | 0.98 | 0.03 | 0.11 | 0.05 | 0.61 | 3.6 | bug, enhancement, help/PR welcome, level |
| 1760 | Cast doesn't seem to work in combination with types.refere | runtime_bug | 0.52 | reference | 1.8 | 0.93 | 0.12 | 0.05 | 0.05 | 0.14 | 5.1 | bug, help/PR welcome |
| 1295 | Code that runs in afterCreate hook does not generate snaps | runtime_bug | 0.36 | node_lifecycle | 1.6 | 0.96 | 0.04 | 0.88 | 0.06 | 0.77 | 7.3 | brainstorming/wild idea |
| 1683 | Memory consumption explodes with large number of nodes. 40 | performance_or_memory | 0.99 | identifier | 2.5 | 0.94 | 0.02 | 0.23 | 0.19 | 0.29 | 3 | brainstorming/wild idea, breaking change |
| 2237 | Replacing large array very slow (possibly due to reconcili | performance_or_memory | 0.99 | array | 1.8 | 0.97 | 0.04 | 0.04 | 0.05 | 0.27 | 1.7 | bug, help/PR welcome, level: intermediat |
| 1596 | Rare unstable performance problem (caching turns off) | performance_or_memory | 0.96 | mobx_interop | 1.6 | 0.09 | 0.03 | 0.04 | 0.12 | 0.07 | 3.3 | bug |
| 1367 | Calling .props on a type that has .preProcessSnapshot does | typescript_defect | 1.00 | model | 1.3 | 0.93 | 0.06 | 0.22 | 0.04 | 0.33 | 7 | Typescript |
| 1778 | resolveIdentifier type signature doesn't allow for snapsho | typescript_defect | 1.00 | identifier | 1.4 | 0.97 | 0.04 | 0.03 | 0.03 | 0.20 | 3.3 | help/PR welcome, Typescript |
| 1833 | Accessing a field of a model that inherits from another le | typescript_defect | 1.00 | union | 1.8 | 0.94 | 0.04 | 0.04 | 0.04 | 0.20 | 3.3 | help/PR welcome, Typescript |
| 1851 | getParent not useable in child view with TypeScript when a | typescript_defect | 1.00 | node_lifecycle | 1.7 | 0.94 | 0.03 | 0.05 | 0.04 | 0.07 | 3.3 | help/PR welcome, Typescript |
| 2040 | RootStore type becomes "any" the moment we call a RootStor | typescript_defect | 1.00 | actions_flow | 1.3 | 0.95 | 0.04 | 0.04 | 0.04 | 0.07 | 2.7 | help/PR welcome, Typescript |
| 2105 | When observe() a MST node's primitive property, TypeScript | typescript_defect | 1.00 | mobx_interop | 1.3 | 0.93 | 0.05 | 0.08 | 0.06 | 0.33 | 3 | bug, help/PR welcome |
| 2216 | TypeScript does not recognize overriding mandatory propert | typescript_defect | 1.00 | model | 1.4 | 0.97 | 0.07 | 0.91 | 0.05 | 0.23 | 1.8 | Typescript |
| 1157 | Functions that create circular references need to have the | typescript_defect | 0.99 | model | 1.6 | 0.97 | 0.02 | 0.91 | 0.06 | 0.37 | 2.2 | bug, Typescript, docs or examples, can't |
| 1640 | `cast` TS error when `types.array` sub-type has reference | typescript_defect | 0.99 | reference | 1.6 | 0.97 | 0.04 | 0.14 | 0.04 | 0.36 | 2.2 | Typescript |
| 1463 | Typesafety loophole: can pass garbage to SomeModel.create | typescript_defect | 0.96 | model | 1.8 | 0.92 | 0.04 | 0.09 | 0.17 | 0.22 | 3.3 | bug |
| 1403 | [Typescript] Overriden model props get 'never'/'multiple i | typescript_defect | 0.94 | model | 1.6 | 0.90 | 0.03 | 0.88 | 0.07 | 0.62 | 1.6 | brainstorming/wild idea, docs or example |
| 2253 | `types.compose` does not override base properties for snap | typescript_defect | 0.93 | model | 1.4 | 0.97 | 0.03 | 0.39 | 0.03 | 0.50 | 1.5 | help/PR welcome, level: easy, docs or ex |
| 2275 | MSTMap does not have `observe` method, but IMSTMap does | typescript_defect | 0.84 | map | 1.7 | 0.98 | 0.06 | 0.25 | 0.03 | 0.20 | 1.2 | bug, Typescript |
| 1929 | Additional `undefined` case inside `union` type | typescript_defect | 0.70 | union | 0.9 | 0.94 | 0.04 | 0.22 | 0.14 | 0.40 | 3.3 | question |
| 1738 | types.reference is not working on instance creation | typescript_defect | 0.68 | reference | 1.8 | 0.98 | 0.04 | 0.08 | 0.05 | 0.10 | 3.2 | bug, help/PR welcome, level: intermediat |
| 1631 | `types.Date` expects a number in postProcessSnapshot | typescript_defect | 0.57 | refinement_custom_enum | 1.6 | 0.94 | 0.05 | 0.04 | 0.44 | 0.12 | 3.3 | bug, help/PR welcome, level: intermediat |
| 1201 | Improving Typescript usability? | typescript_defect | 0.45 | actions_flow | 1.9 | 0.84 | 0.04 | 0.31 | 0.10 | 0.50 | 3 | Typescript, can't fix, never-stale |
| 1526 | Types.union not being re-inferred in reassignment | typescript_defect | 0.44 | union | 1.4 | 0.96 | 0.03 | 0.06 | 0.07 | 0.36 | 3.3 | bug, enhancement, help/PR welcome |
| 2217 | got 「unknown」 type when using Instance<typeof SomeModel> | typescript_defect | 0.43 | unknown | 0.8 | 0.49 | 0.06 | 0.07 | 0.12 | 0.15 | 1.9 | Typescript, docs or examples |
| 1434 | Docs: API docs is all italic after castToSnapshot  | docs_only | 1.00 | docs_site | 0.0 | 0.19 | 0.04 | 0.06 | 0.03 | 0.05 | 3.3 | docs or examples |
| 2058 | Document how MST lazily creates objects | docs_only | 1.00 | node_lifecycle | 0.9 | 0.06 | 0.04 | 0.04 | 0.03 | 0.14 | 3.1 | docs or examples |
| 2156 | Missing docs for `types.lazy` | docs_only | 1.00 | docs_site | 0.8 | 0.14 | 0.05 | 0.03 | 0.06 | 0.17 | 1.9 | docs or examples |
| 1647 | Get Error: [mobx-state-tree] Cannot modify 'AnonymousModel | docs_only | 0.99 | patches_snapshots | 1.8 | 0.94 | 0.05 | 0.06 | 0.21 | 0.45 | 5.7 | docs or examples |
| 2155 | Better documentation on action/view definitions and their  | docs_only | 0.99 | model | 1.1 | 0.77 | 0.03 | 0.03 | 0.06 | 0.44 | 1.1 | docs or examples |
| 1498 | Async actions with separate actions - example not working  | docs_only | 0.98 | actions_flow | 1.0 | 0.96 | 0.11 | 0.03 | 0.03 | 0.12 | 3.3 | docs or examples |
| 1948 | Middlewares can not detect modification directly made in t | docs_only | 0.98 | middleware | 1.5 | 0.96 | 0.04 | 0.28 | 0.04 | 0.30 | 3 | level: intermediate, docs or examples, o |
| 1338 | Reference get does not support async call | docs_only | 0.74 | reference | 1.4 | 0.96 | 0.09 | 0.87 | 0.04 | 0.74 | 2.2 | question, docs or examples |
| 734 | improve error message on snapshot-model discrepancies | feature_api_neutral | 0.51 | type_checker | 1.4 | 0.81 | 0.03 | 0.05 | 0.16 | 0.53 | 6.5 | enhancement, help/PR welcome |
| 2208 | Model Creation/Instantiation Allows Duplicate names (excep | feature_api_neutral | 0.32 | model | 1.3 | 0.98 | 0.06 | 0.05 | 0.04 | 0.36 | 2 | enhancement, help/PR welcome, level: eas |
| 381 | Add types.set | feature_new_api | 1.00 | map | 1.1 | 0.54 | 0.03 | 0.09 | 0.06 | 0.27 | 4.8 | enhancement, help/PR welcome |
| 1276 | Feature request: Partial models | feature_new_api | 1.00 | model | 1.7 | 0.78 | 0.02 | 0.29 | 0.09 | 0.24 | 7.1 | brainstorming/wild idea |
| 1280 | Feature idea: Error boundaries (Conceptually similar to re | feature_new_api | 1.00 | snapshot_processor | 1.3 | 0.93 | 0.03 | 0.05 | 0.04 | 0.15 | 7.4 | brainstorming/wild idea, require('@mwest |
| 1366 | Need a function to read a default value of a property | feature_new_api | 1.00 | model | 1.5 | 0.04 | 0.08 | 0.07 | 0.05 | 0.23 | 7 | enhancement, help/PR welcome, level: int |
| 1374 | AfterRoot | feature_new_api | 1.00 | node_lifecycle | 1.7 | 0.03 | 0.03 | 0.11 | 0.07 | 0.63 | 7 | brainstorming/wild idea |
| 1114 | Add a way to dynamically drill down into type information | feature_new_api | 0.99 | tree_operations | 1.6 | 0.40 | 0.04 | 0.06 | 0.06 | 0.22 | 7.8 | brainstorming/wild idea, help/PR welcome |
| 1151 | Proposal: types.hooks / TYPE.withHooks | feature_new_api | 0.99 | node_lifecycle | 1.1 | 0.74 | 0.02 | 0.17 | 0.07 | 0.55 | 6.4 | brainstorming/wild idea |
| 1949 | Add support for keepAlive | feature_new_api | 0.99 | mobx_interop | 1.6 | 0.77 | 0.03 | 0.12 | 0.37 | 0.60 | 2.1 | enhancement, help/PR welcome, level: int |
| 2109 | Add safeMap utility (or something like it) | feature_new_api | 0.99 | reference | 1.9 | 0.27 | 0.05 | 0.07 | 0.21 | 0.22 | 2 | enhancement, brainstorming/wild idea, le |
| 1359 | typed environment at model definition | feature_new_api | 0.98 | model | 1.2 | 0.86 | 0.03 | 0.59 | 0.05 | 0.53 | 7 | can't fix |
| 1861 | Make `preSnapshot` and `postSnapshot` actions in middlewar | feature_new_api | 0.97 | middleware | 1.5 | 0.04 | 0.03 | 0.08 | 0.06 | 0.52 | 3 | help/PR welcome, level: intermediate |
| 1886 | Are Sets supported (using typescript)?  | feature_new_api | 0.97 | refinement_custom_enum | 1.2 | 0.17 | 0.02 | 0.10 | 0.19 | 0.49 | 2 | help/PR welcome, level: easy, hacktoberf |
| 2205 | Invalidate Parent (Not just Immediate object) on Types.Saf | feature_new_api | 0.97 | reference | 1.7 | 0.86 | 0.03 | 0.53 | 0.10 | 0.80 | 2 | enhancement, help/PR welcome, level: eas |
| 1260 | Support JSON Patch move operation | feature_new_api | 0.95 | patches_snapshots | 1.4 | 0.90 | 0.03 | 0.06 | 0.80 | 0.54 | 6.7 | enhancement, help/PR welcome |
| 1300 | unique id for onAction/applyAction/onSnapshot/... | feature_new_api | 0.93 | actions_flow | 1.7 | 0.22 | 0.05 | 0.18 | 0.65 | 0.40 | 2 | enhancement, help/PR welcome, level: eas |
| 439 | applyAction with async result | feature_new_api | 0.90 | actions_flow | 1.2 | 0.65 | 0.03 | 0.08 | 0.05 | 0.63 | 2.8 | enhancement, help/PR welcome |
| 1025 | [Feature] map type: infer keys from identifiers on snapsho | feature_new_api | 0.89 | map | 1.4 | 0.79 | 0.03 | 0.16 | 0.09 | 0.72 | 6 | brainstorming/wild idea, help/PR welcome |
| 1939 | Symbol as model key | feature_new_api | 0.85 | model | 1.2 | 0.12 | 0.03 | 0.07 | 0.05 | 0.52 | 3.1 | enhancement, help/PR welcome, level: int |
| 1050 | Hide warnings | feature_new_api | 0.73 | actions_flow | 0.5 | 0.07 | 0.04 | 0.07 | 0.09 | 0.64 | 3.9 | enhancement, help/PR welcome |
| 1509 | safeReference throws when set to point at non-existent ent | feature_new_api | 0.63 | reference | 1.8 | 0.94 | 0.03 | 0.19 | 0.04 | 0.80 | 2.5 | docs or examples |
| 741 | custom action names | feature_new_api | 0.58 | actions_flow | 1.0 | 0.82 | 0.05 | 0.32 | 0.05 | 0.59 | 3 | enhancement, help/PR welcome |
| 1428 | Circular Dependency Issue - TS typings | feature_new_api | 0.58 | late_lazy | 1.8 | 0.53 | 0.02 | 0.19 | 0.14 | 0.29 | 0.9 | Typescript |
| 1284 | Getting parent of a reference (not a real node) | feature_new_api | 0.53 | reference | 1.8 | 0.94 | 0.05 | 0.34 | 0.03 | 0.75 | 7.4 | enhancement |
| 2215 | Unexpected patches for Dates with applySnapshot | feature_new_api | 0.36 | patches_snapshots | 1.3 | 0.96 | 0.05 | 0.08 | 0.04 | 0.39 | 2 | enhancement, help/PR welcome, level: int |
| 893 | RFC: Introducing action, computed and view types atoms | breaking_change_proposal | 0.98 | model | 1.1 | 0.61 | 0.03 | 0.07 | 0.07 | 0.79 | 5.8 | enhancement, brainstorming/wild idea |
| 1282 | [RFC] Rethinking references API | breaking_change_proposal | 0.93 | reference | 1.8 | 0.65 | 0.03 | 0.31 | 0.06 | 0.70 | 6.2 | enhancement, brainstorming/wild idea, he |
| 2080 | Use getTime() to check for Date equality | breaking_change_proposal | 0.93 | refinement_custom_enum | 1.5 | 0.96 | 0.03 | 0.31 | 0.07 | 0.70 | 3 | breaking change, level: intermediate |
| 1469 | Enable type checking for production by default | breaking_change_proposal | 0.67 | type_checker | 1.6 | 0.43 | 0.35 | 0.05 | 0.06 | 0.80 | 3.3 | enhancement, help/PR welcome |
| 2254 | SnapshotIn Type unexpectedly changed behavior in MST versi | breaking_change_proposal | 0.65 | model | 1.7 | 0.93 | 0.03 | 0.93 | 0.11 | 0.87 | 1.5 | Typescript |
| 887 | Make identifiers mutable | breaking_change_proposal | 0.63 | identifier | 1.8 | 0.83 | 0.02 | 0.06 | 0.20 | 0.83 | 2.5 | brainstorming/wild idea |
| 1962 | refinement doesn't run type checks in production 😱 | breaking_change_proposal | 0.59 | type_checker | 2.4 | 0.97 | 0.03 | 0.18 | 0.06 | 0.64 | 1.6 | brainstorming/wild idea, breaking change |
| 1267 | [RFC] SelflessModel | breaking_change_proposal | 0.45 | actions_flow | 1.5 | 0.38 | 0.02 | 0.12 | 0.14 | 0.82 | 2 | enhancement, brainstorming/wild idea, ha |
| 2227 | Move off TSLint | infra_chore | 1.00 | build_packaging | 0.0 | 0.06 | 0.06 | 0.03 | 0.03 | 0.37 | 1.8 | help/PR welcome, level: easy |
| 2232 | Use Changesets | infra_chore | 1.00 | build_packaging | 0.0 | 0.09 | 0.03 | 0.06 | 0.03 | 0.11 | 1.8 | enhancement, help/PR welcome, level: eas |
| 2246 | Remove ts-essentials dependency | infra_chore | 0.99 | build_packaging | 0.5 | 0.15 | 0.08 | 0.03 | 0.03 | 0.48 | 1.5 | help/PR welcome, level: intermediate, de |
| 1101 | Include compiled es6 version in the package | infra_chore | 0.43 | build_packaging | 1.2 | 0.95 | 0.04 | 0.06 | 0.10 | 0.30 | 2 | enhancement, help/PR welcome, level: eas |
| 1306 | How to describe model with dynamic keys | usage_question | 0.93 | map | 1.1 | 0.52 | 0.05 | 0.22 | 0.10 | 0.42 | 6.1 | question, stale |
| 1364 | Eager and lazy creation of stores | usage_question | 0.82 | node_lifecycle | 1.5 | 0.52 | 0.04 | 0.11 | 0.11 | 0.34 | 7 | question |
| 1357 | JSDoc | usage_question | 0.76 | docs_site | 0.5 | 0.26 | 0.02 | 0.20 | 0.03 | 0.15 | 5.5 | question |
| 1912 | Using new Array(n) constructor in snapshot doesn't work | usage_question | 0.44 | array | 1.1 | 0.96 | 0.05 | 0.23 | 0.53 | 0.55 | 3.3 | on hold |

## Low-confidence dispositions (<0.4): top two options
- #2208 Model Creation/Instantiation Allows Duplicate names (except for proper → feature_api_neutral 0.40, runtime_bug 0.33, breaking_change_proposal 0.27
- #1295 Code that runs in afterCreate hook does not generate snapshot → runtime_bug 0.44, feature_new_api 0.22, breaking_change_proposal 0.22
- #2215 Unexpected patches for Dates with applySnapshot → feature_new_api 0.43, breaking_change_proposal 0.23, runtime_bug 0.22

## Closure candidates (policy in thresholds.json; every one is verify-then-human-review)
- **needs-info** → 5: #1260, #1300, #2185, #2277, #2279
- **stale-question** → 4: #1306, #1357, #1364, #1912
- **union**: 9 issues

## Confidence bands (thresholds.json)
- **disposition**: accept 76, review 18, escalate 3
- **module**: accept 90, review 7

Escalate to Claude (disposition): #1295, #2208, #2215
Human review (disposition): #734, #741, #887, #1101, #1201, #1267, #1284, #1428, #1469, #1509, #1526, #1631, #1738, #1760, #1912, #1962, #2217, #2254

## Changes vs previous schema (run-v3-2026-10-02T16-48-45-532Z.json)
7 issues changed disposition or module
| # | title | prev disp | new disp | new conf | prev module | new module |
|---|---|---|---|---|---|---|
| 734 | improve error message on snapshot-model discrepanc | breaking_change_proposal | feature_api_neutral | 0.51 | type_checker | type_checker |
| 1267 | [RFC] SelflessModel | breaking_change_proposal | breaking_change_proposal | 0.45 | model | actions_flow |
| 1369 | getType ignore types.refinement | breaking_change_proposal | runtime_bug | 0.81 | refinement_custom_enum | refinement_custom_enum |
| 1912 | Using new Array(n) constructor in snapshot doesn't | runtime_bug | usage_question | 0.44 | array | array |
| 2208 | Model Creation/Instantiation Allows Duplicate name | breaking_change_proposal | feature_api_neutral | 0.32 | model | model |
| 2215 | Unexpected patches for Dates with applySnapshot | feature_api_neutral | feature_new_api | 0.36 | patches_snapshots | patches_snapshots |
| 2254 | SnapshotIn Type unexpectedly changed behavior in M | breaking_change_proposal | breaking_change_proposal | 0.65 | unknown | model |