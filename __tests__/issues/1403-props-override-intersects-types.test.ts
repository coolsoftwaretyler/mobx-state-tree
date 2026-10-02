/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/1403
 * [Typescript] Overriden model props get 'never'/'multiple implementation' typings
 *
 * Status: REPRODUCES
 * Summary: `Base.props({ bar: types.number })` where Base already has `bar: types.string` works at
 * runtime (docs/concepts/trees.md says `.props` "adds / overrides the specified properties") but the
 * type is the plain intersection `PROPS & NEW_PROPS`. The creation type of the overridden prop becomes
 * `string & number`, which is `never`, so `create({ bar: 1 })` does not compile, and an overridden
 * model prop gets the intersection of the old and new instance types. The thread proposes
 * `Omit<PROPS, keyof PROPS2> & PROPS2`; that was tried in #2218 and reverted in #2234 because of
 * "excessively deep" instantiation (#2230). Same root cause as #2216 and #2253.
 */
import { test, expect, describe } from "bun:test"
import { types, Instance, getSnapshot } from "../../src"

type Expect<T extends true> = T
type Equal<A, B> =
    (<X>() => X extends A ? 1 : 2) extends <X>() => X extends B ? 1 : 2 ? true : false

// Problem 1: creation type is 'never' for simple types
const SimpleTypeBase = types.model({
    foo: types.string,
    bar: types.string
})

const SimpleType = SimpleTypeBase.props({
    bar: types.number,
    baz: types.number
})

// Problem 2: instance typings are ambiguous for model-typed props
const ComplexTypeChildString = types.model({
    foo: types.string
})

const ComplexTypeChildNumber = types.model({
    bar: types.number
})

const ComplexTypeBase = types.model({
    child: ComplexTypeChildString
})

const ComplexType = ComplexTypeBase.props({
    child: ComplexTypeChildNumber
})

describe("1403 - overriding props with .props()", () => {
    test("a primitive prop can be overridden with a different type", () => {
        // @ts-expect-error BUG #1403: creation type of the overridden `bar` is `string & number` = never
        const simple = SimpleType.create({ foo: "foo1", bar: 1, baz: 1 })
        expect<unknown>(getSnapshot(simple)).toEqual({ foo: "foo1", bar: 1, baz: 1 })
    })

    test("the overridden primitive prop type is the new type", () => {
        type Bar = Instance<typeof SimpleType>["bar"]
        // @ts-expect-error BUG #1403: instance type of `bar` is `never`, expected `number`
        type _BarIsNumber = Expect<Equal<Bar, number>>
    })

    test("a model-typed prop can be overridden with a different model", () => {
        // @ts-expect-error BUG #1403: snapshot for `child` must satisfy both the old and the new model
        const complex = ComplexType.create({ child: { bar: 1 } })
        expect<unknown>(getSnapshot(complex)).toEqual({ child: { bar: 1 } })
        expect(complex.child.bar).toBe(1)
    })

    test("the overridden model prop is only the new model, not an intersection with the old one", () => {
        type Child = Instance<typeof ComplexType>["child"]
        type HasOldKey = "foo" extends keyof Child ? true : false
        // @ts-expect-error BUG #1403: `child` still exposes `foo` from the overridden model
        type _OldKeyGone = Expect<Equal<HasOldKey, false>>
    })
})
