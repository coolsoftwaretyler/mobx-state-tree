# Issue reproduction status

Generated from the per-issue worker reports after review. One test file per issue under this folder; the file header carries the same status.

| issue | status | kind | confidence | suspected cause / fixed by | fix API-neutral? |
|---|---|---|---|---|---|
| [#1157](https://github.com/mobxjs/mobx-state-tree/issues/1157) | REPRODUCES | types | high | Reported TS7023: TypeScript inference limit for unannotated getters whose return type depends on their own model (microsoft/TypeScript#26623). Cascade and annot | yes |
| [#1201](https://github.com/mobxjs/mobx-state-tree/issues/1201) | WORKS_AS_DESIGNED | types | medium |  | no |
| [#1271](https://github.com/mobxjs/mobx-state-tree/issues/1271) | REPRODUCES | runtime | high | src/middlewares/create-action-tracking-middleware.ts, cases flow_return and flow_throw: they look up and runningActions.delete(call.rootId), but a nested flow s | yes |
| [#1291](https://github.com/mobxjs/mobx-state-tree/issues/1291) | CANNOT_REPRODUCE | runtime | low |  | yes |
| [#1295](https://github.com/mobxjs/mobx-state-tree/issues/1295) | WORKS_AS_DESIGNED | runtime | medium |  | no |
| [#1297](https://github.com/mobxjs/mobx-state-tree/issues/1297) | ALREADY_FIXED | runtime | high | eef7b6d7 (#1581, 2021) | yes |
| [#1303](https://github.com/mobxjs/mobx-state-tree/issues/1303) | CANNOT_REPRODUCE | runtime | medium | src/core/node/object-node.ts createObservableInstance dev-mode assertion; reachable only when a never-instantiated node is touched in a state other than INITIAL | yes |
| [#1317](https://github.com/mobxjs/mobx-state-tree/issues/1317) | REPRODUCES | runtime | high | src/types/utility-types/snapshotProcessor.ts SnapshotProcessor._fixNode: only proxies `create` onto node.type (and wraps node.getSnapshot); node.applySnapshot / | yes |
| [#1367](https://github.com/mobxjs/mobx-state-tree/issues/1367) | REPRODUCES | types | high | src/types/complex-types/model.ts IModelType.props (~line 200) returns IModelType<PROPS & ..., OTHERS, CustomC, CustomS> passing CustomC through unchanged; prePr | yes |
| [#1369](https://github.com/mobxjs/mobx-state-tree/issues/1369) | REPRODUCES | runtime | high | src/types/utility-types/refinement.ts Refinement.instantiate delegates to _subtype.instantiate, so the node's type is the subtype; getType in src/core/mst-opera | no |
| [#1396](https://github.com/mobxjs/mobx-state-tree/issues/1396) | REPRODUCES | runtime | high | src/core/node/object-node.ts lazy observable-instance creation: ObjectNode.getSnapshot returns _getCachedInitialSnapshot() (cached once via _cachedInitialSnapsh | yes |
| [#1399](https://github.com/mobxjs/mobx-state-tree/issues/1399) | REPRODUCES | runtime | medium | src/types/utility-types/union.ts Union.determineType: the reconcileCurrentType branch returns the current node type whenever it accepts the snapshot, even when  | yes |
| [#1403](https://github.com/mobxjs/mobx-state-tree/issues/1403) | REPRODUCES | types | high | src/types/complex-types/model.ts IModelType.props (~line 200): `IModelType<PROPS & ModelPropertiesDeclarationToProperties<PROPS2>, ...>` plain intersection; sam | yes |
| [#1433](https://github.com/mobxjs/mobx-state-tree/issues/1433) | REPRODUCES | runtime | high | src/core/mst-operations.ts walk(): recurses on child.storedValue, which is undefined for lazily instantiated object nodes. The fix should create the instance on | yes |
| [#1458](https://github.com/mobxjs/mobx-state-tree/issues/1458) | REPRODUCES | runtime | high | src/types/utility-types/reference.ts addTargetNodeWatcher: the beforeDetach/beforeDestroy hooks are registered once, on the node the reference resolved to at wa | yes |
| [#1463](https://github.com/mobxjs/mobx-state-tree/issues/1463) | REPRODUCES | types | high | `type ExcludeReadonly<T> = T extends {} ? T[WritableKeys<T>] : T` in src/core/type/type.ts (~line 93, from #2199), used by `IType.create(snapshot?: C / ExcludeR | yes |
| [#1526](https://github.com/mobxjs/mobx-state-tree/issues/1526) | REPRODUCES | runtime | medium | src/types/utility-types/union.ts Union.determineType, the reconcileCurrentType branch (added as the fix for #1045) | yes |
| [#1547](https://github.com/mobxjs/mobx-state-tree/issues/1547) | WORKS_AS_DESIGNED | runtime | medium | src/types/utility-types/snapshotProcessor.ts SnapshotProcessor.is / isValidSnapshot run the preProcessor on undefined, and the union created by types.maybe() di | no |
| [#1551](https://github.com/mobxjs/mobx-state-tree/issues/1551) | REPRODUCES | runtime | high | src/core/node/object-node.ts ObjectNode.setParent (~line 348-351): fires Hook.afterAttach immediately for an already-created child even though the new parent's  | yes |
| [#1596](https://github.com/mobxjs/mobx-state-tree/issues/1596) | CANNOT_REPRODUCE | runtime | low |  | yes |
| [#1631](https://github.com/mobxjs/mobx-state-tree/issues/1631) | WORKS_AS_DESIGNED | types | medium |  | yes |
| [#1640](https://github.com/mobxjs/mobx-state-tree/issues/1640) | ALREADY_FIXED | types | high | 3a2945db (#2199) | yes |
| [#1648](https://github.com/mobxjs/mobx-state-tree/issues/1648) | WORKS_AS_DESIGNED | runtime | high |  | yes |
| [#1683](https://github.com/mobxjs/mobx-state-tree/issues/1683) | REPRODUCES | runtime | high | Per-node footprint of ObjectNode plus its MobX observable object, computed snapshot, identifiersCache entry and per-instance action/view closures (src/core/node | no |
| [#1738](https://github.com/mobxjs/mobx-state-tree/issues/1738) | ALREADY_FIXED | types | high | 3a2945db (#2199) | yes |
| [#1745](https://github.com/mobxjs/mobx-state-tree/issues/1745) | WORKS_AS_DESIGNED | runtime | high | The castToReferenceSnapshot JSDoc example in src/core/mst-operations.ts (around lines 988-1006, mirrored in docs/API) creates `a` and `b` as separate roots, whi | yes |
| [#1760](https://github.com/mobxjs/mobx-state-tree/issues/1760) | ALREADY_FIXED | types | medium | 3a2945db (#2199) | yes |
| [#1778](https://github.com/mobxjs/mobx-state-tree/issues/1778) | REPRODUCES | types | high | src/core/mst-operations.ts resolveIdentifier: the type parameter is constrained to `IT extends IAnyModelType`. | yes |
| [#1833](https://github.com/mobxjs/mobx-state-tree/issues/1833) | WORKS_AS_DESIGNED | types | high |  | yes |
| [#1851](https://github.com/mobxjs/mobx-state-tree/issues/1851) | REPRODUCES | types | low | MST's part in the cycle is not yet identified. It is not getParent's typing: getParent(self) as Instance<typeof Parent> and getParent<Instance<typeof Parent>>(s | no |
| [#1874](https://github.com/mobxjs/mobx-state-tree/issues/1874) | REPRODUCES | runtime | high | src/types/complex-types/map.ts MSTMap.put (the !isValidIdentifier(id) branch, ~lines 194-198) builds a standalone instance with getChildType().create(value) jus | yes |
| [#1897](https://github.com/mobxjs/mobx-state-tree/issues/1897) | REPRODUCES | runtime | high | src/types/utility-types/snapshotProcessor.ts SnapshotProcessor._fixNode -> proxyNodeTypeMethods(node.type, this, "create"): assigns `create` on the shared inner | yes |
| [#1929](https://github.com/mobxjs/mobx-state-tree/issues/1929) | REPRODUCES | both | medium | src/types/complex-types/array.ts IArrayType creation type includes `/ undefined` (same in map.ts IMapType) and src/types/utility-types/union.ts IUnionType passe | yes |
| [#1987](https://github.com/mobxjs/mobx-state-tree/issues/1987) | WORKS_AS_DESIGNED | runtime | medium |  | no |
| [#2040](https://github.com/mobxjs/mobx-state-tree/issues/2040) | WORKS_AS_DESIGNED | types | high | TypeScript limitation: TS always folds yield operand types into a generator's inferred type, so the generic actions()/flow() calls must infer root.load() while  | no |
| [#2105](https://github.com/mobxjs/mobx-state-tree/issues/2105) | WORKS_AS_DESIGNED | runtime | medium | src/types/complex-types/model.ts createNewInstance/finalizeNewInstance: observable.object stores child nodes, reads are unboxed via _interceptReads, so MobX's l | yes |
| [#2136](https://github.com/mobxjs/mobx-state-tree/issues/2136) | REPRODUCES | runtime | high | src/core/node/object-node.ts ObjectNode.finalizeDeath reads this.snapshot after its children already died; the `snapshot` getter calls createObservableInstanceI | yes |
| [#2185](https://github.com/mobxjs/mobx-state-tree/issues/2185) | CANNOT_REPRODUCE | runtime | high |  | no |
| [#2211](https://github.com/mobxjs/mobx-state-tree/issues/2211) | WORKS_AS_DESIGNED | runtime | medium | src/core/node/object-node.ts: createObservableInstance (~line 239, if (this.isRoot) this._addSnapshotReaction()) and _addSnapshotReaction (~683-692) install a p | no |
| [#2216](https://github.com/mobxjs/mobx-state-tree/issues/2216) | REPRODUCES | types | high | src/types/complex-types/model.ts IModelType.props (~line 200) `PROPS & ModelPropertiesDeclarationToProperties<PROPS2>`: in the intersection, P['error']['Creatio | yes |
| [#2217](https://github.com/mobxjs/mobx-state-tree/issues/2217) | CANNOT_REPRODUCE | types | medium |  | no |
| [#2237](https://github.com/mobxjs/mobx-state-tree/issues/2237) | REPRODUCES | runtime | high | src/types/complex-types/array.ts reconcileArrayChildren: when oldNodes[i] does not match, the inner loop 'for j = i..oldNodes.length' calls areSame on every rem | yes |
| [#2253](https://github.com/mobxjs/mobx-state-tree/issues/2253) | REPRODUCES | types | high | src/types/complex-types/model.ts types.compose overloads (around lines 830 to 870) return IModelType<PA & PB, ...>, a plain intersection where the required prop | yes |
| [#2255](https://github.com/mobxjs/mobx-state-tree/issues/2255) | CANNOT_REPRODUCE | runtime | low |  | yes |
| [#2275](https://github.com/mobxjs/mobx-state-tree/issues/2275) | REPRODUCES | both | high | src/types/complex-types/map.ts: IMSTMap declares observe and intercept, but class MSTMap (extends ObservableMap) does not implement them; MapType casts the inst | no |
| [#2277](https://github.com/mobxjs/mobx-state-tree/issues/2277) | WORKS_AS_DESIGNED | runtime | medium | Not an MST defect: src/core/node/livelinessChecking.ts (lines 1-6) defines 'warn' (default) as printing a warning on reads of dead objects, and setLivelinessChe | yes |
| [#2279](https://github.com/mobxjs/mobx-state-tree/issues/2279) | REPRODUCES | runtime | medium | src/core/type/type.ts ComplexType.getValue (~line 427) calls node.createObservableInstanceIfNeeded() on a DEAD node whose instance was never created; src/core/n | yes |

Statuses: REPRODUCES (test is `test.failing`, flips when fixed), ALREADY_FIXED (plain regression test; close citing the fixing change), WORKS_AS_DESIGNED (test pins documented behavior; fix is docs), CANNOT_REPRODUCE (`test.todo` records what is missing).
