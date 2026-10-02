/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/1458
 * safeReference invalidates on old subtree destroying
 *
 * Status: REPRODUCES
 * Summary: A safeReference points at a model with id "1" inside a subtree. The subtree is detached
 * and a new subtree containing a model with the same id is attached, so the reference now resolves
 * to the new model. Destroying the old, already detached subtree should not affect the reference,
 * but it is reset to undefined. A second failing test guards the fix: after the swap, destroying the
 * new target must still remove the reference, which today leaves it at "1" and unresolvable because
 * the watcher stays on the old node.
 */
import { test, expect, describe } from "bun:test"
import { types, detach, destroy, getSnapshot } from "../../src"

const Item = types.model("Item", {
    id: types.identifier,
    value: types.string
})

const Sub = types.model("Sub", {
    items: types.array(Item)
})

const Root = types
    .model("Root", {
        sub: types.maybe(Sub),
        ref: types.safeReference(Item)
    })
    .actions(self => ({
        replaceSub() {
            const old = detach(self.sub!)
            self.sub = Sub.create({ items: [{ id: "1", value: "new" }] })
            return old
        },
        destroyFirstItem() {
            destroy(self.sub!.items[0])
        }
    }))

function setup() {
    return Root.create({ sub: { items: [{ id: "1", value: "old" }] }, ref: "1" })
}

describe("1458 - safeReference and destroying a detached old subtree", () => {
    test("the reference follows the new subtree after the swap", () => {
        const root = setup()
        expect(root.ref!.value).toBe("old")
        root.replaceSub()
        expect(root.ref).toBe(root.sub!.items[0])
        expect(root.ref!.value).toBe("new")
    })

    test.failing("destroying the old detached subtree keeps the reference", () => {
        const root = setup()
        const old = root.replaceSub()
        destroy(old)
        expect(getSnapshot(root).ref).toBe("1")
        expect(root.ref).toBe(root.sub!.items[0])
        expect(root.ref!.value).toBe("new")
    })

    // Guard so that a fix which only skips the invalidation for the old node cannot pass the file:
    // the reference must also be watching the node the id resolves to now.
    test.failing("destroying the new target after the swap still removes the reference", () => {
        const root = setup()
        root.replaceSub()
        root.destroyFirstItem()
        expect(getSnapshot(root).ref).toBeUndefined()
        expect(root.ref).toBeUndefined()
    })
})
