/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/1551
 * getRoot in afterAttach returns undefined in Jest tests
 *
 * Status: REPRODUCES
 * Summary: A child model instance is created up front (so its actions can be spied on) and then
 * placed in the parent's create snapshot: `State.create({ model: Child.create() })`. Inside the
 * child's `afterAttach`, `getRoot(self)` and `getParent(self)` return undefined although
 * `hasParent(self)` is true. docs/overview/hooks.md says that in afterAttach "one can safely make
 * assumptions about the parent". Same result when the instance comes from the factory of
 * `types.optional(Child, () => Child.create())` (the types.optional report in the thread).
 * Assigning the instance after the parent exists works, and PR #1952 did not change this.
 */
import { test, expect, describe } from "bun:test"
import { types, getRoot, getParent, hasParent, type IAnyStateTreeNode } from "../../src"

function createChild() {
    const seen: { root?: unknown; parent?: unknown; hasParent?: boolean; calls: number } = {
        calls: 0
    }
    const Child = types.model("Child", { x: 1 }).actions(self => ({
        afterAttach() {
            seen.calls++
            seen.root = getRoot(self)
            seen.parent = getParent(self)
            seen.hasParent = hasParent(self)
        }
    }))
    return { Child, seen }
}

describe("1551 - getRoot/getParent inside afterAttach", () => {
    test.failing("instance placed in the parent's create snapshot", () => {
        const { Child, seen } = createChild()
        const State = types.model("State", { model: types.maybe(Child) })

        const state = State.create({ model: Child.create() })
        expect(state.model).toBeDefined() // touch the child so it is created and attached

        expect(seen.calls).toBe(1)
        expect(seen.hasParent).toBe(true)
        expect(seen.root as IAnyStateTreeNode).toBe(state)
        expect(seen.parent as IAnyStateTreeNode).toBe(state)
    })

    test.failing("instance returned by the factory of types.optional", () => {
        const { Child, seen } = createChild()
        const State = types.model("State", {
            model: types.optional(Child, () => Child.create())
        })

        const state = State.create()
        expect(state.model).toBeDefined()

        expect(seen.calls).toBe(1)
        expect(seen.root as IAnyStateTreeNode).toBe(state)
        expect(seen.parent as IAnyStateTreeNode).toBe(state)
    })

    test("instance assigned to the parent after it exists (works)", () => {
        const { Child, seen } = createChild()
        const State = types.model("State", { model: types.maybe(Child) }).actions(self => ({
            setModel(model: typeof self.model) {
                self.model = model
            }
        }))

        const state = State.create()
        state.setModel(Child.create())

        expect(seen.calls).toBe(1)
        expect(seen.root as IAnyStateTreeNode).toBe(state)
        expect(seen.parent as IAnyStateTreeNode).toBe(state)
    })
})
