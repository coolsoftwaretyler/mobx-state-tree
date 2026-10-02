/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/1399
 * union subtree isn't evaluated correctly when assigning data
 *
 * Status: REPRODUCES
 * Summary: RECONSTRUCTION, the thread's sandboxes are not available and the exact models are
 * unknown. The reporter has a store holding a `MainModel` whose sub model starts as
 * `CommonSubModel` and should become one of several composed models, picked by a union dispatcher
 * from an id in the incoming data, when `self.mainModel = modelData` is assigned. They report that
 * the `CommonSubModel` node stays and fields of the composed model are lost. When the union is
 * wrapped in `types.maybe` or `types.maybeNull`, create honors the dispatcher but assigning a plain
 * snapshot, or `applySnapshot`, keeps the `CommonSubModel` node and drops the composed fields.
 * Cause: `Union.determineType` returns the node's current type whenever that type accepts the
 * snapshot, even when the current type is not one of the union's own members. The outer union
 * built by `maybe` / `maybeNull` has members [inner union, optional undefined/null], so it picks
 * `CommonSubModel` and never runs the inner dispatcher. That branch arrived with the #1045 fix
 * (6c5a743f, #1047, 2018-10), which fits the reporter's "broke after the upgrade" account. It is the
 * same branch as #1526, so the two fixes must be coordinated; checking that the current type is a
 * member of the union would not affect the #1045 cases. With `types.optional` (or a bare union)
 * the dispatcher is honored and the plain tests below pass. Without a dispatcher the first
 * compatible member wins, also at creation.
 *
 * Sandboxes named in the thread (not fetched):
 * - https://codesandbox.io/s/composed-union-mobx-example-37i86 (original report)
 * - https://codesandbox.io/s/composed-union-mobx-example2-5uz9k (updated example A)
 * - https://codesandbox.io/s/composed-union-mobx-example2oldmobx-mulw8 (example B, old mobx and MST, works)
 * - https://codesandbox.io/s/composed-union-mobx-example-forked-mlthlg (2023 fork; by its slug it
 *   comes from 37i86, not from example2)
 */
import { test, expect, describe } from "bun:test"
import {
    types,
    getType,
    getSnapshot,
    applySnapshot,
    unprotect,
    IAnyType,
    IAnyStateTreeNode
} from "../../src"

const idToModel: Record<number, "A" | "B"> = { 1: "A", 2: "A", 3: "B" }

const CommonSubModel = types.model("CommonSubModel", {
    determiningId: types.maybe(types.number)
})
const ComposedA = types.compose(
    "ComposedA",
    CommonSubModel,
    types.model({ a: types.optional(types.string, "a-default") })
)
const ComposedB = types.compose(
    "ComposedB",
    CommonSubModel,
    types.model({ b: types.optional(types.string, "b-default") })
)

type Wrapper = "optional" | "maybe" | "maybeNull"

// the wrapper is chosen at run time, so the store is typed loosely
type LooseStore = IAnyStateTreeNode & { mainModel: any }

const snapshotOf = (node: unknown): unknown => getSnapshot(node as IAnyStateTreeNode)

function createStore(options: {
    dispatcher: boolean
    wrapper: Wrapper
    initialSub?: object
}): LooseStore {
    // maybe() validates through the union with undefined, so the dispatcher must accept it
    const dispatcher = (sn: { determiningId?: number } | undefined) => {
        const key = sn?.determiningId === undefined ? undefined : idToModel[sn.determiningId]
        return key === "A" ? ComposedA : key === "B" ? ComposedB : CommonSubModel
    }
    const Sub = options.dispatcher
        ? types.union({ dispatcher }, CommonSubModel, ComposedA, ComposedB)
        : types.union(CommonSubModel, ComposedA, ComposedB)
    const wrapped: IAnyType =
        options.wrapper === "maybe"
            ? types.maybe(Sub)
            : options.wrapper === "maybeNull"
              ? types.maybeNull(Sub)
              : types.optional(Sub, {})
    const MainModel = types.model("MainModel", {
        id: types.optional(types.number, 0),
        sub: wrapped
    })
    const Store = types.model("Store", { mainModel: types.optional(MainModel, {}) })
    const store = Store.create({ mainModel: { sub: options.initialSub ?? {} } })
    unprotect(store)
    return store as unknown as LooseStore
}

const incoming = { id: 1, sub: { determiningId: 3, b: "hello" } }

describe("1399 - union subtree evaluation when assigning data", () => {
    describe("types.optional(union with dispatcher)", () => {
        test("the default sub model is replaced by the composed model on assignment", () => {
            const store = createStore({ dispatcher: true, wrapper: "optional" })
            expect(getType(store.mainModel.sub)).toBe(CommonSubModel)

            store.mainModel = incoming
            expect(getType(store.mainModel.sub)).toBe(ComposedB)
            expect(snapshotOf(store.mainModel.sub)).toEqual({ determiningId: 3, b: "hello" })
        })

        test("a later assignment switches between composed models", () => {
            const store = createStore({ dispatcher: true, wrapper: "optional" })
            store.mainModel = incoming
            store.mainModel = { id: 2, sub: { determiningId: 1, a: "x" } }
            expect(getType(store.mainModel.sub)).toBe(ComposedA)
            expect(snapshotOf(store.mainModel.sub)).toEqual({ determiningId: 1, a: "x" })
        })

        test("applySnapshot on the parent honors the dispatcher too", () => {
            const store = createStore({ dispatcher: true, wrapper: "optional" })
            applySnapshot(store as IAnyStateTreeNode, {
                mainModel: { id: 3, sub: { determiningId: 3, b: "applied" } }
            })
            expect(getType(store.mainModel.sub)).toBe(ComposedB)
        })
    })

    describe("without a dispatcher", () => {
        test("the first compatible model wins, at creation and on assignment", () => {
            const store = createStore({ dispatcher: false, wrapper: "optional" })
            expect(getType(store.mainModel.sub)).toBe(CommonSubModel)

            store.mainModel = incoming
            expect(getType(store.mainModel.sub)).toBe(CommonSubModel)
            expect(snapshotOf(store.mainModel.sub)).toEqual({ determiningId: 3 })
        })
    })

    for (const wrapper of ["maybe", "maybeNull"] as const) {
        describe(`types.${wrapper}(union with dispatcher)`, () => {
            test("create honors the dispatcher", () => {
                const store = createStore({ dispatcher: true, wrapper, initialSub: incoming.sub })
                expect(getType(store.mainModel.sub)).toBe(ComposedB)
                expect(snapshotOf(store.mainModel.sub)).toEqual({ determiningId: 3, b: "hello" })
            })

            test.failing(
                "assigning data replaces the CommonSubModel node with the dispatched model",
                () => {
                    const store = createStore({ dispatcher: true, wrapper })
                    expect(getType(store.mainModel.sub)).toBe(CommonSubModel)

                    store.mainModel = incoming
                    expect(getType(store.mainModel.sub)).toBe(ComposedB)
                    expect(snapshotOf(store.mainModel.sub)).toEqual({
                        determiningId: 3,
                        b: "hello"
                    })
                }
            )
        })
    }

    test.todo(
        "1399: need the code of the four sandboxes (37i86, example2 5uz9k, old-MST example B mulw8, 2023 fork mlthlg) to confirm the reporter's union is wrapped in maybe/maybeNull (or another wrapper with the same effect), what the dispatcher returns, and the MST versions",
        () => {
            // blocked on the missing reproduction
        }
    )
})
