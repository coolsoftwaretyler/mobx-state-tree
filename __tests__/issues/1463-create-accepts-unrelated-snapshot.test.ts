/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/1463
 * Typesafety loophole: can pass garbage to SomeModel.create
 *
 * Status: REPRODUCES
 * Summary: For the reporter's model (an array of `Ref = types.model({})` plus
 * `types.maybe(types.reference(Ref))`), `Foo.create({ a: 1, b: 2 })` compiles although no key matches.
 * TypeScript's weak type check ("has no properties in common") rejects the same snapshot for ordinary
 * all-optional models (control tests), but not here. The cause is `ExcludeReadonly<T> = T extends {} ?
 * T[WritableKeys<T>] : T` on `IType.create` in src/core/type/type.ts (around line 93, added by #2199 in
 * 2024, which lets `create` accept an instance). It is an indexed access, so `create` accepts the union
 * of the writable props' instance types; for Foo that union includes `Instance<Ref>`, i.e.
 * `{} & IStateTreeNode<...>`, which is not a weak type, so any object is assignable. This is also why
 * the thread's remark that adding a required prop (`prim`) makes the error appear no longer holds: that
 * stopped working with #2199, not because of a TypeScript change. The same union makes
 * `types.model({ name: types.string }).create("x")` compile today, because `string` is in the
 * parameter union. Runtime is not the issue: MST ignores unknown snapshot keys by design, so nothing
 * here asserts that `create` throws for them. With `ExcludeReadonly<T>` replaced by `T` (or by
 * `Pick<T, WritableKeys<T>>`) in memory, all three directives flip and the controls stay green.
 */
import { test, expect, describe } from "bun:test"
import { types, getSnapshot } from "../../src"

type Expect<T extends true> = T
type Equal<A, B> =
    (<X>() => X extends A ? 1 : 2) extends <X>() => X extends B ? 1 : 2 ? true : false

const Ref = types.model({})

const Foo = types.model({
    bars: types.array(Ref),
    someReference: types.maybe(types.reference(Ref))
})

// The reporter's commented-out `prim` property
const FooWithRequired = types.model({
    bars: types.array(Ref),
    someReference: types.maybe(types.reference(Ref)),
    prim: types.boolean
})

// Controls: all-optional models without a reference to an empty model
const Plain = types.model({
    bars: types.array(types.string),
    label: types.maybe(types.string)
})

const Target = types.model({ id: types.identifier })

const RefToNonEmpty = types.model({
    bars: types.array(Target),
    someReference: types.maybe(types.reference(Target))
})

const Named = types.model({ name: types.string })

type Garbage = { a: number; b: number }

type AcceptsGarbage<M extends { create: (...args: any[]) => any }> = Garbage extends Parameters<
    M["create"]
>[0]
    ? true
    : false

describe("1463 - create accepts a snapshot with no matching keys", () => {
    test("controls: other all-optional models reject unrelated keys", () => {
        type _PlainRejects = Expect<Equal<AcceptsGarbage<typeof Plain>, false>>
        type _NonEmptyRejects = Expect<Equal<AcceptsGarbage<typeof RefToNonEmpty>, false>>
        expect(getSnapshot(RefToNonEmpty.create({ bars: [{ id: "1" }] }))).toEqual({
            bars: [{ id: "1" }],
            someReference: undefined
        })
        expect(getSnapshot(Plain.create({ bars: ["x"] }))).toEqual({
            bars: ["x"],
            label: undefined
        })
    })

    test("the reporter's model rejects a snapshot with no matching keys", () => {
        // @ts-expect-error BUG #1463: Foo.create accepts `{ a: number, b: number }`, which should not compile
        type _FooRejects = Expect<Equal<AcceptsGarbage<typeof Foo>, false>>
        const foo = Foo.create({ bars: [] })
        expect(getSnapshot(foo)).toEqual({ bars: [], someReference: undefined })
    })

    test("a model with a string prop rejects a plain string as snapshot", () => {
        type AcceptsString = string extends Parameters<typeof Named.create>[0] ? true : false
        // @ts-expect-error BUG #1463: `create("x")` compiles, `string` is in the parameter union via ExcludeReadonly
        type _StringRejected = Expect<Equal<AcceptsString, false>>
        expect(() => Named.create("x" as never)).toThrow()
        expect(getSnapshot(Named.create({ name: "n" }))).toEqual({ name: "n" })
    })

    test("adding a required prop does not close the loophole either", () => {
        // @ts-expect-error BUG #1463: still accepted, although `prim` is required and missing
        type _RequiredRejects = Expect<Equal<AcceptsGarbage<typeof FooWithRequired>, false>>
        const foo = FooWithRequired.create({ bars: [], prim: true })
        expect(getSnapshot(foo)).toEqual({ bars: [], someReference: undefined, prim: true })
    })
})
