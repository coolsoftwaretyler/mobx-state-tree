/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/2136
 * Unexpected error "Cannot finalize the creation of a node that is already dead" while applying snapshot
 *
 * Status: REPRODUCES
 * Summary: Applying a snapshot that removes an array element whose subtree contains a
 * types.snapshotProcessor with a postProcessor throws "cannot finalize the creation of a node that is
 * already dead". The optional() and the array are red herrings: the smallest trigger is a snapshotProcessor
 * with a postProcessor that is two or more model levels below a node being killed while those
 * intermediate nodes were never instantiated (destroy(root) is enough). Without a postProcessor, or with
 * the snapshotProcessor directly under an instantiated node, it does not throw.
 */
import { test, expect, describe } from "bun:test"
import { types, applySnapshot, destroy, getSnapshot } from "../../src"

describe("2136 - snapshotProcessor with postProcessor inside a removed subtree", () => {
    test.failing("reporter repro: applySnapshot([]) on array of models with optional child", () => {
        const Model = types.array(
            types.model({
                b: types.string,
                c: types.optional(
                    types.model({
                        d: types.snapshotProcessor(types.model({ e: "" }), {
                            preProcessor(e: string) {
                                return { e }
                            },

                            postProcessor(snapshot) {
                                return snapshot.e
                            }
                        })
                    }),
                    { d: "" }
                )
            })
        )

        const m = Model.create([{ b: "b" }])

        expect(() => applySnapshot(m, [])).not.toThrow()
        expect(getSnapshot(m)).toEqual([])
    })

    const Leaf = types.snapshotProcessor(types.model({ e: "" }), {
        postProcessor(snapshot) {
            return snapshot
        }
    })

    test.failing("reduced: removing an array element via applySnapshot", () => {
        const Items = types.array(types.model({ c: types.model({ d: Leaf }) }))
        const items = Items.create([{ c: { d: { e: "" } } }])

        expect(() => applySnapshot(items, [])).not.toThrow()
        expect(getSnapshot(items)).toEqual([])
    })

    test.failing("reduced: destroy(root), no snapshot application involved", () => {
        const Root = types.model({ c: types.model({ d: Leaf }) })
        const root = Root.create({ c: { d: { e: "" } } })

        expect(() => destroy(root)).not.toThrow()
    })

    test("snapshotProcessor directly under an instantiated element is removed fine", () => {
        const Items = types.array(types.model({ d: Leaf }))
        const items = Items.create([{ d: { e: "" } }])

        applySnapshot(items, [])

        expect(getSnapshot(items)).toEqual([])
    })
})
