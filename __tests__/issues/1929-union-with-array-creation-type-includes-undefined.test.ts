/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/1929
 * Additional `undefined` case inside `union` type
 *
 * Status: REPRODUCES
 * Summary: For `types.union(types.string, types.array(types.number))` the reporter sees an extra
 * `undefined` in the inferred type and asks whether it is intended. On current source the
 * instance type (`Instance<typeof U>`) has no `undefined`, but the creation type
 * (`SnapshotIn`, `U.CreationType`, and the model property it feeds) is
 * `string | readonly number[] | undefined`. The `undefined` is not a union dispatcher case, as
 * the maintainer guessed: it comes from `IArrayType`, whose creation type includes `undefined`
 * because a bare `types.array` model property is wrapped in `optional(array, [])`. A union does
 * not get that wrapper, so at run time `U.is(undefined)` is false and `Holder.create({})` throws
 * while the types say the property is optional.
 */
import { test, expect, describe } from "bun:test"
import { types, getSnapshot, Instance, SnapshotIn } from "../../src"

type Expect<T extends true> = T
type Equal<A, B> =
    (<X>() => X extends A ? 1 : 2) extends <X>() => X extends B ? 1 : 2 ? true : false
type HasUndefined<T> = undefined extends T ? true : false

const U = types.union(types.string, types.array(types.number))
const Holder = types.model("Holder", { u: U })

// the instance type does not contain undefined
export type InstanceHasNoUndefined = Expect<Equal<HasUndefined<Instance<typeof U>>, false>>

// @ts-expect-error BUG #1929: SnapshotIn of the union contains undefined, taken from IArrayType
export type SnapshotInHasNoUndefined = Expect<Equal<HasUndefined<SnapshotIn<typeof U>>, false>>

type EmptyObjectAllowed<T> = {} extends T ? true : false

// @ts-expect-error BUG #1929: the model property is typed optional, but the union requires a value
export type PropertyIsRequired = Expect<Equal<EmptyObjectAllowed<SnapshotIn<typeof Holder>>, false>>

describe("1929 - undefined in the creation type of a union that contains an array", () => {
    test("the union rejects undefined at run time", () => {
        expect(U.is(undefined)).toBe(false)
        expect(U.is("text")).toBe(true)
        expect(U.is([1, 2])).toBe(true)
    })

    test("a model property of that union is required at run time", () => {
        expect(() => Holder.create({} as any)).toThrow(/Error while converting/)
        expect(getSnapshot(Holder.create({ u: [1, 2] }))).toEqual({ u: [1, 2] })
        expect(getSnapshot(Holder.create({ u: "text" }))).toEqual({ u: "text" })
    })
})
