# Cluster map from Jev v4 root_module answers

Ranked by number of defects (runtime, TypeScript, perf). `†` = closure candidate under thresholds.json policy. sev = Jev severity 0–3; wk = has_workaround; oth = others_affected.

| module | defects | features | other | mean sev of defects |
|---|---|---|---|---|
| reference | 8 | 5 | 1 | 1.7 |
| model | 6 | 7 | 1 | 1.5 |
| node_lifecycle | 6 | 2 | 2 | 1.5 |
| union | 5 | 0 | 0 | 1.6 |
| snapshot_processor | 4 | 1 | 0 | 1.8 |
| actions_flow | 3 | 5 | 1 | 1.7 |
| identifier | 3 | 1 | 0 | 2.2 |
| mobx_interop | 3 | 1 | 0 | 1.7 |
| refinement_custom_enum | 2 | 2 | 0 | 1.7 |
| map | 1 | 2 | 1 | 1.7 |
| patches_snapshots | 1 | 2 | 1 | 1.6 |
| tree_operations | 1 | 1 | 0 | 1.9 |
| middleware | 1 | 1 | 1 | 1.8 |
| react_integration | 1 | 0 | 0 | 0.6 |
| array | 1 | 0 | 1 | 1.8 |
| unknown | 1 | 0 | 0 | 0.8 |
| type_checker | 0 | 3 | 0 | 0.0 |
| late_lazy | 0 | 1 | 0 | 0.0 |
| build_packaging | 0 | 0 | 4 | 0.0 |
| docs_site | 0 | 0 | 3 | 0.0 |

## Issues per module

### reference
- **defects:** #1297 runtime_bug 0.92 sev 2.0 wk 0.1 oth 0.6 — types.snapshotProcessor and types.reference; #1760 runtime_bug 0.52 sev 1.8 wk 0.1 oth 0.0 — Cast doesn't seem to work in combination with types.ref; #1738 typescript_defect 0.68 sev 1.8 wk 1.0 oth 0.9 — types.reference is not working on instance creation; #1745 runtime_bug 0.98 sev 1.8 wk 0.1 oth 0.5 — Instance node can't be used to instantiate a reference; #1291 runtime_bug 1.00 sev 1.6 wk 0.9 oth 0.1 — safeReference causes "Computed values are not allowed t; #1458 runtime_bug 1.00 sev 1.6 wk 0.1 oth 0.1 — safeReference invalidates on old subtree destroying; #1640 typescript_defect 0.99 sev 1.6 wk 0.9 oth 0.1 — `cast` TS error when `types.array` sub-type has referen; #1874 runtime_bug 1.00 sev 1.5 wk 0.9 oth 1.0 — Reference's `onInvalidated()` called after `map.put(sna
- **features / proposals:** #2109 feature_new_api 0.99 sev 1.9 wk 0.1 oth 0.0 — Add safeMap utility (or something like it); #1509 feature_new_api 0.63 sev 1.8 wk 0.9 oth 1.0 — safeReference throws when set to point at non-existent ; #1284 feature_new_api 0.53 sev 1.8 wk 0.9 oth 0.1 — Getting parent of a reference (not a real node); #1282 breaking_change_proposal 0.93 sev 1.8 wk 0.7 oth 0.9 — [RFC] Rethinking references API; #2205 feature_new_api 0.97 sev 1.7 wk 1.0 oth 0.1 — Invalidate Parent (Not just Immediate object) on Types.
- **other:** #1338 docs_only 0.74 sev 1.4 wk 1.0 oth 0.9 — Reference get does not support async call

### model
- **defects:** #1463 typescript_defect 0.96 sev 1.8 wk 0.3 oth 0.2 — Typesafety loophole: can pass garbage to SomeModel.crea; #1157 typescript_defect 0.99 sev 1.6 wk 0.8 oth 1.0 — Functions that create circular references need to have ; #1403 typescript_defect 0.94 sev 1.6 wk 0.9 oth 1.0 — [Typescript] Overriden model props get 'never'/'multipl; #2216 typescript_defect 1.00 sev 1.4 wk 0.1 oth 0.8 — TypeScript does not recognize overriding mandatory prop; #2253 typescript_defect 0.93 sev 1.4 wk 0.9 oth 0.1 — `types.compose` does not override base properties for s; #1367 typescript_defect 1.00 sev 1.3 wk 0.8 oth 0.1 — Calling .props on a type that has .preProcessSnapshot d
- **features / proposals:** #1276 feature_new_api 1.00 sev 1.7 wk 0.9 oth 0.9 — Feature request: Partial models; #2254 breaking_change_proposal 0.65 sev 1.7 wk 0.3 oth 0.1 — SnapshotIn Type unexpectedly changed behavior in MST ve; #1366 feature_new_api 1.00 sev 1.5 wk 0.1 oth 0.0 — Need a function to read a default value of a property; #2208 feature_api_neutral 0.32 sev 1.3 wk 0.1 oth 0.2 — Model Creation/Instantiation Allows Duplicate names (ex; #1939 feature_new_api 0.85 sev 1.2 wk 0.3 oth 0.4 — Symbol as model key; #1359 feature_new_api 0.98 sev 1.2 wk 0.4 oth 0.1 — typed environment at model definition; #893 breaking_change_proposal 0.98 sev 1.1 wk 0.1 oth 0.2 — RFC: Introducing action, computed and view types atoms
- **other:** #2155 docs_only 0.99 sev 1.1 wk 1.0 oth 0.8 — Better documentation on action/view definitions and the

### node_lifecycle
- **defects:** #2279† runtime_bug 0.98 sev 1.7 wk 0.7 oth 0.9 — React 19.2 dev mode breaks MST: "creation of the observ; #1851 typescript_defect 1.00 sev 1.7 wk 0.8 oth 0.0 — getParent not useable in child view with TypeScript whe; #1295 runtime_bug 0.36 sev 1.6 wk 0.7 oth 0.9 — Code that runs in afterCreate hook does not generate sn; #2211 runtime_bug 0.91 sev 1.6 wk 0.9 oth 0.1 — onBecomeUnobserved is never called; #1551 runtime_bug 1.00 sev 1.3 wk 0.9 oth 0.9 — getRoot in afterAttach returns undefined in Jest tests; #2277† runtime_bug 0.98 sev 1.2 wk 0.9 oth 0.7 — Error when React 19 component has MST node as prop with
- **features / proposals:** #1374 feature_new_api 1.00 sev 1.7 wk 0.3 oth 0.1 — AfterRoot; #1151 feature_new_api 0.99 sev 1.1 wk 0.3 oth 0.8 — Proposal: types.hooks / TYPE.withHooks
- **other:** #1364† usage_question 0.82 sev 1.5 wk 0.3 oth 0.0 — Eager and lazy creation of stores; #2058 docs_only 1.00 sev 0.9 wk 0.1 oth 0.4 — Document how MST lazily creates objects

### union
- **defects:** #1648 runtime_bug 1.00 sev 2.1 wk 0.3 oth 0.1 — My model returns fields as null, if I created model fie; #1399 runtime_bug 0.98 sev 1.9 wk 0.8 oth 0.1 — union subtree isn't evaluated correctly when assigning ; #1833 typescript_defect 1.00 sev 1.8 wk 0.1 oth 0.9 — Accessing a field of a model that inherits from another; #1526 typescript_defect 0.44 sev 1.4 wk 0.8 oth 0.9 — Types.union not being re-inferred in reassignment; #1929 typescript_defect 0.70 sev 0.9 wk 0.1 oth 0.0 — Additional `undefined` case inside `union` type

### snapshot_processor
- **defects:** #1897 runtime_bug 1.00 sev 2.0 wk 0.0 oth 0.3 — snapshotProcessor modifies the type it wraps; #1317 runtime_bug 1.00 sev 2.0 wk 0.1 oth 0.9 — applySnapshot does not call preProcessSnapshot when usi; #2136 runtime_bug 0.99 sev 2.0 wk 0.4 oth 1.0 — Unexpected error "Сannot finalize the creation of a nod; #1547 runtime_bug 1.00 sev 1.2 wk 0.8 oth 0.1 — Destroying a model with a preprocessor that returns a n
- **features / proposals:** #1280 feature_new_api 1.00 sev 1.3 wk 0.8 oth 0.9 — Feature idea: Error boundaries (Conceptually similar to

### actions_flow
- **defects:** #1201 typescript_defect 0.45 sev 1.9 wk 0.9 oth 0.8 — Improving Typescript usability?; #1987 runtime_bug 0.97 sev 1.8 wk 0.9 oth 1.0 — Aborting action with AbortController does not work imme; #2040 typescript_defect 1.00 sev 1.3 wk 0.9 oth 0.8 — RootStore type becomes "any" the moment we call a RootS
- **features / proposals:** #1300† feature_new_api 0.93 sev 1.7 wk 0.2 oth 1.0 — unique id for onAction/applyAction/onSnapshot/...; #1267 breaking_change_proposal 0.45 sev 1.5 wk 0.1 oth 0.9 — [RFC] SelflessModel; #439 feature_new_api 0.90 sev 1.2 wk 0.1 oth 0.1 — applyAction with async result; #741 feature_new_api 0.58 sev 1.0 wk 0.5 oth 1.0 — custom action names; #1050 feature_new_api 0.73 sev 0.5 wk 0.1 oth 0.9 — Hide warnings
- **other:** #1498 docs_only 0.98 sev 1.0 wk 0.4 oth 0.1 — Async actions with separate actions - example not worki

### identifier
- **defects:** #2255 runtime_bug 0.99 sev 2.7 wk 0.1 oth 0.0 — Duplicates in Identifier Cache; #1683 performance_or_memory 0.99 sev 2.5 wk 0.7 oth 1.0 — Memory consumption explodes with large number of nodes.; #1778 typescript_defect 1.00 sev 1.4 wk 0.1 oth 0.1 — resolveIdentifier type signature doesn't allow for snap
- **features / proposals:** #887 breaking_change_proposal 0.63 sev 1.8 wk 0.1 oth 1.0 — Make identifiers mutable

### mobx_interop
- **defects:** #2185† runtime_bug 0.99 sev 2.2 wk 0.1 oth 0.0 — Mobx/Mobx-state-tree doesnt work in module federation o; #1596 performance_or_memory 0.96 sev 1.6 wk 0.0 oth 0.0 — Rare unstable performance problem (caching turns off); #2105 typescript_defect 1.00 sev 1.3 wk 0.2 oth 0.1 — When observe() a MST node's primitive property, TypeScr
- **features / proposals:** #1949 feature_new_api 0.99 sev 1.6 wk 0.9 oth 0.9 — Add support for keepAlive

### refinement_custom_enum
- **defects:** #1369 runtime_bug 0.81 sev 1.7 wk 0.8 oth 0.6 — getType ignore types.refinement; #1631 typescript_defect 0.57 sev 1.6 wk 0.1 oth 0.1 — `types.Date` expects a number in postProcessSnapshot
- **features / proposals:** #2080 breaking_change_proposal 0.93 sev 1.5 wk 0.9 oth 0.1 — Use getTime() to check for Date equality; #1886 feature_new_api 0.97 sev 1.2 wk 0.5 oth 0.4 — Are Sets supported (using typescript)? 

### map
- **defects:** #2275 typescript_defect 0.84 sev 1.7 wk 0.9 oth 0.1 — MSTMap does not have `observe` method, but IMSTMap does
- **features / proposals:** #1025 feature_new_api 0.89 sev 1.4 wk 0.7 oth 0.7 — [Feature] map type: infer keys from identifiers on snap; #381 feature_new_api 1.00 sev 1.1 wk 0.9 oth 0.9 — Add types.set
- **other:** #1306† usage_question 0.93 sev 1.1 wk 0.8 oth 0.7 — How to describe model with dynamic keys

### patches_snapshots
- **defects:** #1396 runtime_bug 0.89 sev 1.6 wk 0.7 oth 0.0 — getSnapshot returning inconsistent results
- **features / proposals:** #1260† feature_new_api 0.95 sev 1.4 wk 0.9 oth 0.2 — Support JSON Patch move operation; #2215 feature_new_api 0.36 sev 1.3 wk 0.1 oth 0.3 — Unexpected patches for Dates with applySnapshot
- **other:** #1647 docs_only 0.99 sev 1.8 wk 0.9 oth 0.6 — Get Error: [mobx-state-tree] Cannot modify 'AnonymousMo

### tree_operations
- **defects:** #1433 runtime_bug 1.00 sev 1.9 wk 0.8 oth 1.0 — Walk is not walking the tree
- **features / proposals:** #1114 feature_new_api 0.99 sev 1.6 wk 0.1 oth 0.1 — Add a way to dynamically drill down into type informati

### middleware
- **defects:** #1271 runtime_bug 0.95 sev 1.8 wk 0.5 oth 0.9 — createActionTrackingMiddleware breaks with nested flows
- **features / proposals:** #1861 feature_new_api 0.97 sev 1.5 wk 0.2 oth 0.1 — Make `preSnapshot` and `postSnapshot` actions in middle
- **other:** #1948 docs_only 0.98 sev 1.5 wk 0.1 oth 0.1 — Middlewares can not detect modification directly made i

### react_integration
- **defects:** #1303 runtime_bug 0.91 sev 0.6 wk 0.8 oth 0.9 — Strange error with React Devtools: the creation of the 

### array
- **defects:** #2237 performance_or_memory 0.99 sev 1.8 wk 1.0 oth 0.1 — Replacing large array very slow (possibly due to reconc
- **other:** #1912† usage_question 0.44 sev 1.1 wk 0.9 oth 0.0 — Using new Array(n) constructor in snapshot doesn't work

### unknown
- **defects:** #2217 typescript_defect 0.43 sev 0.8 wk 0.2 oth 0.8 — got 「unknown」 type when using Instance<typeof SomeModel

### type_checker
- **features / proposals:** #1962 breaking_change_proposal 0.59 sev 2.4 wk 0.2 oth 1.0 — refinement doesn't run type checks in production 😱; #1469 breaking_change_proposal 0.67 sev 1.6 wk 0.9 oth 0.1 — Enable type checking for production by default; #734 feature_api_neutral 0.51 sev 1.4 wk 0.8 oth 0.9 — improve error message on snapshot-model discrepancies

### late_lazy
- **features / proposals:** #1428 feature_new_api 0.58 sev 1.8 wk 0.7 oth 0.9 — Circular Dependency Issue - TS typings

### build_packaging
- **other:** #1101 infra_chore 0.43 sev 1.2 wk 0.9 oth 1.0 — Include compiled es6 version in the package; #2246 infra_chore 0.99 sev 0.5 wk 0.1 oth 0.4 — Remove ts-essentials dependency; #2227 infra_chore 1.00 sev 0.0 wk 0.0 oth 0.6 — Move off TSLint; #2232 infra_chore 1.00 sev 0.0 wk 0.0 oth 0.0 — Use Changesets

### docs_site
- **other:** #2156 docs_only 1.00 sev 0.8 wk 0.1 oth 0.6 — Missing docs for `types.lazy`; #1357† usage_question 0.76 sev 0.5 wk 0.1 oth 0.9 — JSDoc; #1434 docs_only 1.00 sev 0.0 wk 0.1 oth 0.1 — Docs: API docs is all italic after castToSnapshot 
