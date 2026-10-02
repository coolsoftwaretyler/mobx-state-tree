/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/1874
 * Reference's `onInvalidated()` called after `map.put(snapshot)` when snapshot doesn't have an id
 *
 * Status: REPRODUCES
 * Summary: A Todo model has `id: types.optional(types.identifier, generator)`, an array of
 * `safeReference(User)` and a `reference(User, { onInvalidated })`. Putting a todo snapshot into a
 * map without an id should keep every reference valid and never call `onInvalidated`.
 * Reported behavior: the hook fires for each reference and the safeReference array ends up empty.
 */
import { test, expect, describe } from "bun:test"
import { types, getSnapshot } from "../../src"

function setup() {
    const calls = { assigned: 0, primary: 0 }
    let nextTodoId = 1
    const todoIdGenerator = () => `t${nextTodoId++}`

    const User = types.model("User", {
        id: types.identifier,
        name: types.string
    })

    const Todo = types.model("Todo", {
        id: types.optional(types.identifier, todoIdGenerator),
        title: types.string,
        assignedUsers: types.array(
            types.safeReference(User, {
                acceptsUndefined: false,
                onInvalidated() {
                    calls.assigned++
                }
            })
        ),
        primaryAssignedUser: types.reference(User, {
            onInvalidated() {
                calls.primary++
            }
        })
    })

    const TodoStore = types
        .model("TodoStore", {
            todos: types.map(Todo),
            users: types.map(User)
        })
        .actions(self => ({
            addTodo(todoSnapshot: any) {
                self.todos.put(todoSnapshot)
            }
        }))

    const store = TodoStore.create({
        users: {
            u1: { id: "u1", name: "Alice" },
            u2: { id: "u2", name: "Bob" },
            u3: { id: "u3", name: "Charlie" }
        }
    })
    return { store, calls, todoIdGenerator }
}

describe("1874 - onInvalidated after map.put without id", () => {
    test("snapshot with an explicit id does not invalidate references", () => {
        const { store, calls, todoIdGenerator } = setup()
        store.addTodo({
            id: todoIdGenerator(),
            title: "Get coffee",
            assignedUsers: ["u1", "u2"],
            primaryAssignedUser: "u2"
        })
        expect(calls).toEqual({ assigned: 0, primary: 0 })
        expect(getSnapshot(store.todos).t1.assignedUsers).toEqual(["u1", "u2"])
    })

    test.failing("snapshot without an id does not invalidate references", () => {
        const { store, calls } = setup()
        store.addTodo({
            title: "Get more coffee",
            assignedUsers: ["u2", "u3"],
            primaryAssignedUser: "u2"
        })
        const todo = store.todos.get("t1")!
        expect(calls).toEqual({ assigned: 0, primary: 0 })
        expect(getSnapshot(todo).assignedUsers).toEqual(["u2", "u3"])
        expect(todo.primaryAssignedUser.name).toBe("Bob")
    })
})
