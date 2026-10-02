/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/1369
 * getType ignore types.refinement
 *
 * Status: REPRODUCES
 * Summary: The reporter refines a model with `types.refinement` and creates an instance from the
 * refined type. `TestType2.create({ test1: 50, test2: 40 })` throws as expected, but
 * `getType(instance).create({ test1: 50, test2: 40 })` does not, because `getType` returns the base
 * model type (`TestType`) instead of the refinement. `Refinement.instantiate` delegates straight to the
 * subtype, so the node never records the refinement as its type.
 * Fix direction is a maintainer decision: in 2019 the maintainer could not tell bug from enhancement.
 * Either the node keeps the refinement as `node.type` (ripples into reconcile, union dispatch and
 * snapshots), or `getType` returns a separately recorded declared type. Both change what `getType`
 * returns for every refined instance (identity, name, `.properties`), so this is not a safe drive-by fix.
 */
import { test, expect, describe } from "bun:test"
import { types, getType } from "../../src"

describe("1369 - getType ignores types.refinement", () => {
    const TestType = types.model("TestType", {
        test1: types.number,
        test2: types.number
    })

    const TestType2 = types.refinement(
        "TestType2",
        TestType,
        value => value.test1 + value.test2 === 100
    )

    test("control: creating through the refinement validates the predicate", () => {
        expect(() => TestType2.create({ test1: 50, test2: 50 })).not.toThrow()
        expect(() => TestType2.create({ test1: 50, test2: 40 })).toThrow()
    })

    test.failing(
        "getType(instance) of a refined instance enforces the refinement on create",
        () => {
            const instance = TestType2.create({ test1: 50, test2: 50 })

            expect(() => getType(instance).create({ test1: 50, test2: 40 })).toThrow()
        }
    )
})
