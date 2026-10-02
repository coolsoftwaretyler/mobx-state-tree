/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/2253
 * `types.compose` does not override base properties for snapshot requirements.
 *
 * Status: REPRODUCES
 * Summary: `Base` has a required `invariant: types.enumeration(...)`; `types.compose(Base,
 * types.model("TypeA", { invariant: Invariant.A }))` overrides it with an optional prop (default "A").
 * At runtime `TypeA.create({ name })` works and `invariant` defaults to "A", but the compose overloads
 * in src/types/complex-types/model.ts (around lines 830 to 870) return `IModelType<PA & PB, ...>`, a
 * plain intersection in which the required prop of `PA` wins, so TypeScript rejects `create({ name })`
 * (TS2345, "Property 'invariant' is missing"). The reporter's `TypeB` case is different:
 * `types.literal(Invariant.B)` has no default, is required, and rejecting `TypeB.create({ name })` is
 * correct at both levels. Same pattern as #1403 and #2216 (`IModelType.props` returns `PROPS & NEW`),
 * but #2218 (96f2e469, reverted by #2234 because of #2230) only changed props/views/actions/volatile/
 * extend and had no compose hunk: a props-only `Omit` change leaves this directive in use. The compose
 * overloads need the same `Omit<PA, keyof PB> & PB` treatment; with that in memory the TypeA directive
 * flips while the TypeB control stays rejected.
 */
import { test, expect, describe } from "bun:test"
import { types, getSnapshot } from "../../src"

enum Invariant {
    A = "A",
    B = "B"
}

const Base = types.model({
    name: types.string,
    invariant: types.enumeration(Object.values(Invariant))
})

const TypeA = types.compose(
    Base,
    types.model("TypeA", {
        invariant: Invariant.A
    })
)

const TypeB = types.compose(
    Base,
    types.model("TypeB", {
        invariant: types.literal(Invariant.B)
    })
)

describe("2253 - types.compose overriding a required prop with an optional one", () => {
    test("TypeA can be created without `invariant` and gets the default", () => {
        // @ts-expect-error BUG #2253: `invariant` is optional on TypeA but its creation type still requires it
        const a = TypeA.create({ name: "Such a great name" })
        expect<unknown>(getSnapshot(a)).toEqual({ name: "Such a great name", invariant: "A" })
    })

    test("TypeB requires `invariant` because types.literal has no default (correct rejection)", () => {
        // @ts-expect-error not a bug: a literal prop without a default is required, so the type is right to reject this
        expect(() => TypeB.create({ name: "An even better name" })).toThrow()
        const b = TypeB.create({ name: "An even better name", invariant: Invariant.B })
        expect(b.invariant).toBe(Invariant.B)
    })
})
