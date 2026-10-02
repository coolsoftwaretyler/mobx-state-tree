/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/1778
 * resolveIdentifier type signature doesn't allow for snapshotProcessor types
 *
 * Status: REPRODUCES
 * Summary: `resolveIdentifier` is declared as `<IT extends IAnyModelType>(type: IT, ...)`, so a type
 * made with `types.snapshotProcessor(Model, ...)` is rejected by the compiler. The reporter
 * expected the call to compile, since at run time it works and returns the node.
 */
import { test, expect, describe } from "bun:test"
import { types, resolveIdentifier } from "../../src"

const Todo = types.model("Todo", {
    id: types.identifier,
    title: types.string
})

const ProcessedTodo = types.snapshotProcessor(Todo, {
    preProcessor(sn: { id: string; name: string }) {
        return { id: sn.id, title: sn.name }
    }
})

const Store = types.model("Store", {
    todos: types.array(ProcessedTodo)
})

describe("1778 - resolveIdentifier with a snapshotProcessor type", () => {
    test("resolves the node at run time", () => {
        const store = Store.create({ todos: [{ id: "1", name: "first" }] })
        // @ts-expect-error BUG #1778: IAnyModelType constraint rejects snapshotProcessor types
        const resolved = resolveIdentifier(ProcessedTodo, store, "1")
        expect(resolved).toBe(store.todos[0])
    })

    test("a plain model type is accepted", () => {
        const store = Store.create({ todos: [{ id: "1", name: "first" }] })
        const resolved = resolveIdentifier(Todo, store, "1")
        expect(resolved).toBe(store.todos[0])
    })
})
