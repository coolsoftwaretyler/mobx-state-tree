/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/1317
 * applySnapshot does not call preProcessSnapshot when using types.snapshotProcessor
 *
 * Status: REPRODUCES
 * Summary: Calling applySnapshot directly on an instance whose type is a types.snapshotProcessor does
 * not run the preProcessor, so a snapshot in the processor's input shape ({ value: "2" }) is validated
 * against the inner model and throws. The same snapshot works when it is applied through a parent
 * model, because that path goes through SnapshotProcessor.reconcile and applies the processed value.
 * Only create() and reconcile() run the preProcessor; _fixNode only proxies "create" onto the inner
 * node type. The input shape ({ value: string }) differs from the inner shape ({ x: number }) and the
 * preProcessor throws on anything that is not input-shaped, so that a fix which preprocesses twice
 * (reconcile, then a wrapped node.applySnapshot with the already-processed value, as in the reverted
 * #1823 attempt) fails the parent-path guard instead of silently passing. Call counts are not asserted
 * because validation legitimately preprocesses once more (the parent path currently calls it twice).
 */
import { test, expect, describe } from "bun:test"
import { types, applySnapshot, getSnapshot } from "../../src"

const Processed = types.snapshotProcessor(types.model({ x: types.number }), {
    preProcessor(snapshot: { value: string }) {
        if (typeof snapshot.value !== "string") {
            throw new Error(
                "preProcessor received a snapshot that is not in the processor input shape"
            )
        }
        return { x: Number(snapshot.value) }
    },
    postProcessor(snapshot) {
        return { value: String(snapshot.x) }
    }
})

describe("1317 - applySnapshot and snapshotProcessor preProcessor", () => {
    test.failing("applySnapshot on the processed instance runs the preProcessor", () => {
        const m = Processed.create({ value: "1" })
        expect(m.x).toBe(1)

        applySnapshot(m, { value: "2" })

        expect(m.x).toBe(2)
        expect(getSnapshot(m)).toEqual({ value: "2" })
    })

    test("applySnapshot on a parent runs the preProcessor of the nested processed type once, not twice", () => {
        const Parent = types.model({ inner: Processed })
        const parent = Parent.create({ inner: { value: "1" } })

        applySnapshot(parent, { inner: { value: "2" } })

        expect(parent.inner.x).toBe(2)
        expect(getSnapshot(parent)).toEqual({ inner: { value: "2" } })
    })
})
