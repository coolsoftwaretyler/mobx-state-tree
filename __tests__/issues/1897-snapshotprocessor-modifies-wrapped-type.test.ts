/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/1897
 * snapshotProcessor modifies the type it wraps
 *
 * Status: REPRODUCES
 * Summary: After instantiating a type returned by types.snapshotProcessor, the wrapped model type's
 * own create() behaves like the processor type: Todo1.create() starts running Todo2's preProcessor
 * and ignores the snapshot it is given. SnapshotProcessor._fixNode calls
 * proxyNodeTypeMethods(node.type, this, "create"), which overwrites `create` on the shared inner type.
 */
import { test, expect, describe } from "bun:test"
import { types } from "../../src"

describe("1897 - snapshotProcessor must not modify the type it wraps", () => {
    test.failing(
        "wrapped type keeps its own create() after the processor type is instantiated",
        () => {
            const Todo1 = types.model({ text: types.maybe(types.string) })
            const Todo2 = types.snapshotProcessor(Todo1, {
                preProcessor() {
                    return { text: "todo2 text" }
                }
            })

            expect(Todo1.create().text).toBeUndefined()

            const todo2 = Todo2.create()
            expect(todo2.text).toBe("todo2 text")

            // the wrapped type must be unaffected by the instantiation above
            expect(Todo1.create().text).toBeUndefined()
            expect(Todo1.create({ text: "mine" }).text).toBe("mine")
        }
    )
})
