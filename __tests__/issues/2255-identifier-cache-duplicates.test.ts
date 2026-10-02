/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/2255
 * Duplicates in Identifier Cache
 *
 * Status: CANNOT_REPRODUCE
 * Summary: The reporter sees duplicate nodes in the identifier cache (and an intermittent
 * "the creation of the observable instance must be done on the initializing phase" assertion)
 * while replacing a store's data in a closed-source Next.js app, after moving the stores into a
 * Turborepo internal package. The thread has no runnable code, only screenshots of the errors, and
 * the reporter could not build a standalone reproduction.
 */
import { test, describe } from "bun:test"

describe("2255 - duplicates in the identifier cache", () => {
    test.todo(
        "2255: need the exact error text, the model definitions with their identifiers, and the call that replaces the store data (applySnapshot, array.replace, map.replace or put), ideally standalone; also whether two copies of mobx-state-tree end up in the bundle",
        () => {
            // blocked on the missing reproduction
        }
    )
})
