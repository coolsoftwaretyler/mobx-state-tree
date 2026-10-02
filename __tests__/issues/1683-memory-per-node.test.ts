/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/1683
 * Memory consumption explodes with large number of nodes. 40MB of data becomes ~16GB in MST
 *
 * Status: REPRODUCES
 * Summary: Each instantiated MST node retains about 9 KB for an {id, value} model and about 16 KB
 * for a six-prop model with a view and two actions: roughly 70-80x the plain-object heap, 6.5x
 * MobX observable objects, and 160-230x the snapshot JSON text. Adding items one action at a time
 * to a types.map is also quadratic. Measured by bench scenarios "#1683 ..." in
 * bench/issue-scenarios.ts, not by a test.
 */
import { test } from "bun:test"

test.todo(
    "#1683: measured by bench scenario '#1683 memory (bytes): types.map(Metric {id, value}), every node read, 20000 nodes'",
    () => {
        // measured by the bench scenario, not by a test
    }
)
