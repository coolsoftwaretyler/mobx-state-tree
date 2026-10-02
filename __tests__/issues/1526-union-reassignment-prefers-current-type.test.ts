/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/1526
 * Types.union not being re-inferred in reassignment
 *
 * Status: REPRODUCES
 * Summary: With an eager union and no dispatcher, `create` picks the first member that accepts the
 * snapshot, but a later assignment to the same property tries the node's current member type first
 * (the "fix for #1045" branch in Union.determineType). Once a broader later member such as
 * `types.frozen()` or a loosely-typed model has matched, a snapshot that an earlier, narrower member
 * would accept keeps being applied to the broader one. The reporter expected the same member
 * to be chosen for the same snapshot, as the docs say the first matching type is used.
 * The custom-type case is the one from ada-waffles' comment on the thread.
 *
 * Constraint for any fix: the #1045 cases in __tests__/core/union.test.ts ("submodel2 first" with
 * "snapshot is of type Submodel1") expect the current member to stay when both members accept
 * the snapshot, so a plain declared-order rule breaks tests that pass today. Two candidates keep both
 * green: (a) prefer the current type only when the snapshot carries the current node's identifier,
 * which is the id-keyed array case that #1047 (6c5a743f) was written for; (b) an opt-in union option.
 * Rule (a) needs no new option but still changes which member unions without ids pick on
 * reassignment, so it is a maintainer decision. The same branch causes #1399, so coordinate the fixes.
 */
import { test, expect, describe } from "bun:test"
import { types, getType, unprotect, getSnapshot } from "../../src"

describe("1526 - eager union re-inference on reassignment", () => {
    const Narrow = types.model("Narrow", {
        kind: types.literal("narrow"),
        x: types.number
    })
    // Accepts every object with a numeric x, including the snapshots that Narrow accepts
    const Broad = types.model("Broad", {
        x: types.number
    })
    const Holder = types.model("Holder", {
        value: types.union(Narrow, Broad)
    })

    test("create picks the first member that accepts the snapshot", () => {
        const holder = Holder.create({ value: { kind: "narrow", x: 1 } })
        expect(getType(holder.value)).toBe(Narrow)
    })

    test.failing(
        "assigning the same snapshot after a broader member matched picks the first member again",
        () => {
            const holder = Holder.create({ value: { kind: "narrow", x: 1 } })
            unprotect(holder)

            // not accepted by Narrow, so Broad takes over
            holder.value = { x: 2 } as any
            expect(getType(holder.value)).toBe(Broad)

            // exactly the snapshot that selected Narrow in create above
            holder.value = { kind: "narrow", x: 3 }
            expect(getType(holder.value)).toBe(Narrow)
        }
    )

    test.failing(
        "custom type before frozen is not re-inferred after frozen matched (thread repro)",
        () => {
            const InnerTest = types.custom<{ foo: number }, { foo: string }>({
                name: "InnerTest",
                fromSnapshot: ({ foo }) => ({ foo: foo.toString() }),
                toSnapshot: ({ foo }) => ({ foo: parseFloat(foo) }),
                isTargetType: (snapshot: unknown) =>
                    !!snapshot && typeof (snapshot as { foo?: unknown }).foo === "string",
                getValidationMessage: (snapshot: unknown) =>
                    !snapshot || typeof (snapshot as { foo?: unknown }).foo !== "number"
                        ? "foo must be a number"
                        : ""
            })
            const TestModel = types.model({
                inner: types.union(types.null, InnerTest, types.frozen<any>())
            })

            const instance = TestModel.create({ inner: { foo: 1 } })
            unprotect(instance)
            expect(instance.inner).toEqual({ foo: "1" })

            instance.inner = null
            instance.inner = { foo: 2 }
            expect(instance.inner).toEqual({ foo: "2" })

            // frozen<any> captures this one
            instance.inner = { bar: "bar" }
            instance.inner = { foo: 3 }
            expect(getSnapshot(instance).inner).toEqual({ foo: 3 })
            expect(instance.inner).toEqual({ foo: "3" })
        }
    )
})
