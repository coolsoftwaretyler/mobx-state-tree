/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/1367
 * Calling .props on a type that has .preProcessSnapshot doesn't update its snapshot type
 *
 * Status: REPRODUCES
 * Summary: `T1 = types.model({ id }).preProcessSnapshot(s => s)` fixes T1's custom creation type
 * (`CustomC`) to the snapshot of `{ id }`. `T1.props({ window })` keeps that `CustomC` unchanged, so
 * `SnapshotIn<typeof Extended>` still has no `window` key and `Extended` is not assignable to a type
 * declared as `IType<SnapshotIn<T1> & { window }, ...>`. Without `.preProcessSnapshot` the same code
 * compiles (control tests), so the defect is specific to the frozen `CustomC`. `types.compose` of the
 * same pieces does keep `window` in its snapshot type: `_CustomJoin` yields `CustomC & _NotCustomized`,
 * so `_CustomOrOther` falls back to the props creation type. A comment on `IModelType.props` in
 * src/types/complex-types/model.ts already warns about this ("redefining props after a process snapshot
 * is used ends up on the fixed (custom) C, S typings being overridden"), docs/ say nothing, and the
 * runtime does keep the new props. The BUG directives below become unused once `.props` updates the
 * snapshot type.
 */
import { test, expect, describe } from "bun:test"
import {
    types as t,
    IType,
    ReferenceIdentifier,
    SnapshotIn,
    SnapshotOut,
    Instance,
    getSnapshot
} from "../../src"

type Expect<T extends true> = T
type Equal<A, B> =
    (<X>() => X extends A ? 1 : 2) extends <X>() => X extends B ? 1 : 2 ? true : false

const T2 = t.model({
    id: t.identifier
})

interface IT2 extends Instance<typeof T2> {}

const T1 = t
    .model({
        id: t.identifier
    })
    .preProcessSnapshot(s => s)

// The creation type of a reference prop is the identifier or an instance of the target
interface ITSnapshotIn extends SnapshotIn<typeof T1> {
    window: ReferenceIdentifier | IT2
}

interface ITSnapshotOut extends SnapshotOut<typeof T1> {
    window: ReferenceIdentifier
}

interface IT extends Instance<typeof T1> {
    window: IT2
}

interface ITRunType extends IType<ITSnapshotIn, ITSnapshotOut, IT> {}

const Extended = T1.props({
    window: t.late(() => t.reference(T2))
})

// @ts-expect-error BUG #1367: IModelType from .props is not assignable to ITRunType, its snapshot type lacks `window`
const Declared: ITRunType = Extended
void Declared

// The snapshot type of the extended model should know about `window`.
type ExtendedSnapshotIn = SnapshotIn<typeof Extended>
type SnapshotHasWindow = "window" extends keyof ExtendedSnapshotIn ? true : false
// @ts-expect-error BUG #1367: SnapshotIn of the .props() result has no `window` key
type _SnapshotHasWindow = Expect<Equal<SnapshotHasWindow, true>>

// Control: the same pieces with types.compose keep `window` in the snapshot type.
const Composed = t.compose(
    T1,
    t.model({
        window: t.late(() => t.reference(T2))
    })
)
type ComposedHasWindow = "window" extends keyof SnapshotIn<typeof Composed> ? true : false
type _ComposedHasWindow = Expect<Equal<ComposedHasWindow, true>>
const DeclaredComposed: ITRunType = Composed
void DeclaredComposed

// Control: without .preProcessSnapshot, .props does update the snapshot type and the assignment compiles.
const PlainBase = t.model({
    id: t.identifier
})

interface IPlainSnapshotIn extends SnapshotIn<typeof PlainBase> {
    window: ReferenceIdentifier | IT2
}

interface IPlainRunType extends IType<IPlainSnapshotIn, ITSnapshotOut, IT> {}

const PlainExtended = PlainBase.props({
    window: t.late(() => t.reference(T2))
})
type PlainHasWindow = "window" extends keyof SnapshotIn<typeof PlainExtended> ? true : false
type _PlainHasWindow = Expect<Equal<PlainHasWindow, true>>
const DeclaredPlain: IPlainRunType = PlainExtended
void DeclaredPlain

describe("1367 - .props after .preProcessSnapshot", () => {
    test("the extended model still works at runtime and resolves the new reference prop", () => {
        const Root = t.model({
            targets: t.array(T2),
            item: Extended
        })
        // a variable, not a literal: the new `window` prop is not in the (buggy) creation type, so a
        // fresh object literal would fail the excess property check today
        const item = { id: "a", window: "w1" }
        const root = Root.create({ targets: [{ id: "w1" }], item })
        expect(root.item.window).toBe(root.targets[0])
        expect(getSnapshot(root.item)).toEqual({ id: "a", window: "w1" })
    })

    test("types.compose of the same pieces behaves the same at runtime", () => {
        const Root = t.model({
            targets: t.array(T2),
            item: Composed
        })
        const root = Root.create({
            targets: [{ id: "w1" }],
            item: { id: "a", window: "w1" }
        })
        expect(root.item.window).toBe(root.targets[0])
        expect(getSnapshot(root.item)).toEqual({ id: "a", window: "w1" })
    })

    test("without preProcessSnapshot the new prop is part of the snapshot type", () => {
        const Root = t.model({
            targets: t.array(T2),
            item: PlainExtended
        })
        const root = Root.create({
            targets: [{ id: "w1" }],
            item: { id: "a", window: "w1" }
        })
        expect(root.item.window).toBe(root.targets[0])
    })
})
