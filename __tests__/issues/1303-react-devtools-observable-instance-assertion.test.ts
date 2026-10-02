/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/1303
 * Strange error with React Devtools: the creation of the observable instance must be done on the initializing phase
 *
 * Status: CANNOT_REPRODUCE
 * Summary: With React DevTools active (MST 3.14.0, MobX 5.9.4), reloading the page randomly throws
 * "assertion failed: the creation of the observable instance must be done on the initializing
 * phase", thrown from createObservableInstance in object-node.ts when a lazily created node is
 * touched while its lifecycle state is not INITIALIZING. The trigger is React DevTools' backend
 * walking props; React and DevTools are not installed and must not be installed. The thread gives
 * no React-free trigger: tried removing a map entry, replacing an array, detaching and
 * destroying while holding the old instance; each only produces the usual "no longer part of a
 * state tree" warning, never this assertion.
 */
import { test } from "bun:test"

test.todo(
    "1303: needs a React-free trigger or a repo with React + React DevTools (which node is being instantiated, and its lifecycle state at that moment)",
    () => {}
)
