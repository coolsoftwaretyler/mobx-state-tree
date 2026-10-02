/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/1295
 * Code that runs in afterCreate hook does not generate snapshot
 *
 * Status: WORKS_AS_DESIGNED
 * Summary: The reporter has two stores that subscribe with onSnapshot and then change state: one
 * directly in `afterCreate`, one inside requestAnimationFrame. Only the deferred change logged a
 * snapshot; they expected both to. Maintainer xaviergonz: state changed in `afterCreate` is part
 * of the initial snapshot, so it emits no snapshot event (the initial snapshot is already final).
 * The thread's second reporter (dprentis) has nested children that edit their own props in
 * `afterCreate` and finds the parent's getSnapshot missing those edits; that is MST's lazy node
 * creation (a nested node is only created, and its `afterCreate` run, on first access) and the
 * maintainer accepted it as a tradeoff for lazy init. Both are pinned below.
 *
 * Documented rule: docs/overview/hooks.md says `afterCreate` runs "immediately after an instance
 * is created and initial values are applied"; it promises no snapshot or patch events for it.
 * Doc changes suggested: (1) add a line to hooks.md that changes made in `afterCreate` are part
 * of the initial state, emit no onSnapshot/onPatch, and that a listener must be attached after
 * creation (or the change deferred) to observe them; (2) extend the model hooks table, which
 * unlike the array/map hooks table (hooks.md ~line 48) does not say that a nested node's
 * `afterCreate` runs on first access, so the parent's snapshot only shows its edits after that.
 */
import { test, expect } from "bun:test"
import { types, getSnapshot, onSnapshot } from "../../src"

function createStore(change: "in-after-create" | "deferred") {
    const snapshots: Array<{ n: number }> = []
    const Store = types
        .model("Store", { n: 0 })
        .actions(self => ({
            increment() {
                self.n++
            }
        }))
        .actions(self => ({
            afterCreate() {
                onSnapshot(self, snapshot => snapshots.push(snapshot))
                if (change === "in-after-create") {
                    self.increment()
                } else {
                    // stands in for the reporter's requestAnimationFrame
                    Promise.resolve().then(() => self.increment())
                }
            }
        }))
    return { store: Store.create(), snapshots }
}

test("a change made in afterCreate is part of the initial snapshot and emits no snapshot event", () => {
    const { store, snapshots } = createStore("in-after-create")

    expect(getSnapshot(store)).toEqual({ n: 1 })
    expect(snapshots).toEqual([])

    // later changes do emit
    store.increment()
    expect(snapshots).toEqual([{ n: 2 }])
})

test("the same change deferred past creation does emit a snapshot event", async () => {
    const { store, snapshots } = createStore("deferred")

    expect(snapshots).toEqual([])
    await Promise.resolve()

    expect(getSnapshot(store)).toEqual({ n: 1 })
    expect(snapshots).toEqual([{ n: 1 }])
})

test("a nested child's afterCreate edit is missing from the parent snapshot until the child is first read", () => {
    const Todo = types.model("Todo", { title: "" }).actions(self => ({
        afterCreate() {
            if (!self.title) self.title = "untitled"
        }
    }))
    const Store = types.model("Store", { todos: types.array(Todo) })
    const store = Store.create({ todos: [{}] })

    // the child node has not been created yet, so its afterCreate has not run
    expect(getSnapshot(store)).toEqual({ todos: [{ title: "" }] })

    expect(store.todos[0].title).toBe("untitled")

    expect(getSnapshot(store)).toEqual({ todos: [{ title: "untitled" }] })
})
