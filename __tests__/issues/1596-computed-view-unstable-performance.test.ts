/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/1596
 * Rare unstable performance problem (caching turns off)
 *
 * Status: CANNOT_REPRODUCE
 * Summary: The reporter sees a computed view (modulesMap, a reduce with an object spread) run up
 * to 20x slower at times, without changing the frontend code, and guesses the MobX cache turned
 * off. No store definition, data shape, or trigger is given, only two profiler screenshots.
 */
import { test } from "bun:test"

test.todo(
    "1596: need the store and data shapes (module count, models), how modulesMap is read when it is slow (inside an observer, an action, or plain code), and which API response change flips it",
    () => {
        // blocked on the missing reproduction
    }
)
