/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/2211
 * onBecomeUnobserved is never called
 *
 * Status: WORKS_AS_DESIGNED
 * Summary: MobX's `onBecomeUnobserved(node, "prop", cb)` is registered on an MST node, an autorun
 * reads the property and is then disposed. The reporter expects `cb` to fire once nothing observes
 * the property anymore, as it does for a plain MobX observable. MobX only fires it when the atom
 * has no observers left, and MST deliberately keeps one: the tree root runs a permanent snapshot
 * reaction (src/core/node/object-node.ts, `if (this.isRoot) this._addSnapshotReaction()` ~line
 * 239 and `_addSnapshotReaction` ~683-692), and ModelType.getSnapshot (src/types/complex-types/
 * model.ts ~689) calls reportObserved on every property atom. So the hooks fire only around
 * creation and destroy: on a root node `onBecomeObserved` never fires (already observed) and
 * `onBecomeUnobserved` fires only when the tree is destroyed; on a child node `onBecomeObserved`
 * fires on the first read and `onBecomeUnobserved` again only on destroy.
 *
 * Documented rule: the docs promise nothing about MobX's observed/unobserved hooks on MST nodes,
 * and maintainers closed this as "can't fix" without a larger refactor. Doc change suggested:
 * add a note to docs/overview/hooks.md (or the MobX interop docs) that MST property atoms stay
 * observed while the tree is alive, so these hooks fire only at creation or destroy, and show
 * the workaround from the thread (register the hooks in a closure or `volatile` and dispose them
 * in `afterDestroy`).
 *
 * Stability: changing this is a behavior change. An on-demand snapshot reaction would alter
 * getSnapshot caching and the onSnapshot internals.
 */
import { test, expect, describe } from "bun:test"
import { autorun, observable, onBecomeObserved, onBecomeUnobserved } from "mobx"
import { types, destroy } from "../../src"

describe("2211 - onBecomeUnobserved on MST nodes", () => {
    test("control: a plain MobX observable fires observed then unobserved", () => {
        const events: string[] = []
        const box = observable({ items: [] as number[] })
        onBecomeObserved(box, "items", () => events.push("observed"))
        onBecomeUnobserved(box, "items", () => events.push("unobserved"))

        const dispose = autorun(() => box.items)
        dispose()

        expect(events).toEqual(["observed", "unobserved"])
    })

    test("root node: neither hook fires around the autorun, unobserved fires on destroy", () => {
        const events: string[] = []
        const Collection = types.model("Collection", { items: types.array(types.frozen()) })
        const instance = Collection.create({ items: [] })
        onBecomeObserved(instance, "items", () => events.push("observed"))
        onBecomeUnobserved(instance, "items", () => events.push("unobserved"))

        const dispose = autorun(() => instance.items)
        dispose()
        expect(events).toEqual([])

        destroy(instance)
        expect(events).toEqual(["unobserved"])
    })

    test("child node: observed fires on first read, unobserved only on destroy", () => {
        const events: string[] = []
        const Collection = types.model("Collection", { items: types.array(types.frozen()) })
        const Root = types.model("Root", { child: Collection })
        const root = Root.create({ child: { items: [{ name: "1" }] } })
        onBecomeObserved(root.child, "items", () => events.push("observed"))
        onBecomeUnobserved(root.child, "items", () => events.push("unobserved"))

        const dispose = autorun(() => root.child.items)
        dispose()
        expect(events).toEqual(["observed"])

        destroy(root)
        expect(events).toEqual(["observed", "unobserved"])
    })
})
