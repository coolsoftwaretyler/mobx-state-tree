/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/2237
 * Replacing large array very slow (possibly due to reconciliation)
 *
 * Status: REPRODUCES
 * Summary: Replacing a types.array of N identified nodes with N new nodes (all new ids) costs
 * O(N^2): reconcileArrayChildren scans the rest of oldNodes with areSame for every new value. On
 * this machine 1k/2k/4k/10k items take 42/129/471/2669 ms, against 163 ms at 10k after replace([]).
 * Measured by bench scenarios "#2237 ..." in bench/issue-scenarios.ts, not by a test.
 */
import { test } from "bun:test"

test.todo(
    "#2237: measured by bench scenario '#2237 array.replace: 10000 identified Points with 10000 fresh instances'",
    () => {
        // measured by the bench scenario, not by a test
    }
)
