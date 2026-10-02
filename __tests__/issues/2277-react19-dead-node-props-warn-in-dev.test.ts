/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/2277
 * Error when React 19 component has MST node as prop with observer defined later
 *
 * Status: WORKS_AS_DESIGNED
 * Summary: With React 19.2 in development, a component whose prop is an MST node logs one
 * "no longer part of a state tree" warning per property after an action replaces that node
 * (`self.item = newItem`), although the UI keeps working. The external trigger is React 19.2's
 * `logComponentRender` (react-dom-client.development.js), which enumerates the previous props,
 * including the now dead node, and so reads dead properties. React is not installed, so this
 * test emulates it: replace the node through an action, then read every own key of the old node.
 *
 * Documented rule: src/core/node/livelinessChecking.ts (lines 1-6) defines `"warn"`, the default,
 * as printing a warning on reads of dead objects, and `setLivelinessChecking("ignore")` is the
 * documented opt-out (used in the thread's workaround). One warning per property read is exactly
 * that behavior. Whether MST should stop warning for reads of replaced nodes (the maintainer's
 * PR #2278, which relaxes assertAlive) is an optional change for the maintainers to decide, not a
 * bug fix. The fatal variant from the thread's later comment ("creation of the observable
 * instance must be done on the initializing phase") goes through ComplexType.getValue on a dead
 * node and is reproduced, still without React, in 2279-*.test.ts.
 */
import { test, expect, spyOn } from "bun:test"
import { types, isAlive, setLivelinessChecking, getLivelinessChecking } from "../../src"
import type { LivelinessMode } from "../../src"

const Item = types.model("Item", { id: types.identifier, name: types.string })
const Root = types.model("Root", { item: types.maybeNull(Item) }).actions(self => ({
    updateItem(newValue: { id: string; name: string }) {
        self.item = newValue as typeof self.item
    }
}))

// what React 19.2's addObjectDiffToProperties does to a prop: read each property
function readAllProperties(node: object) {
    return Object.keys(node).map(key => (node as Record<string, unknown>)[key])
}

function readReplacedNode(mode: LivelinessMode) {
    const previous = getLivelinessChecking()
    const warnSpy = spyOn(console, "warn").mockImplementation(() => {})
    try {
        setLivelinessChecking(mode)
        const store = Root.create({ item: { id: "1", name: "initial" } })
        const oldItem = store.item!
        store.updateItem({ id: "2", name: "replacement" })
        expect(isAlive(oldItem)).toBe(false)

        warnSpy.mockClear()
        expect(() => readAllProperties(oldItem)).not.toThrow()
        return {
            keys: Object.keys(oldItem),
            warnings: warnSpy.mock.calls.map(call => String(call[0]))
        }
    } finally {
        setLivelinessChecking(previous)
        warnSpy.mockRestore()
    }
}

test('liveliness "warn" (the default) prints one warning per property read on a replaced node', () => {
    const { keys, warnings } = readReplacedNode("warn")

    expect(keys).toEqual(["id", "name"])
    expect(warnings).toHaveLength(keys.length)
    for (const warning of warnings) expect(warning).toContain("no longer part of a state tree")
})

test('liveliness "ignore" (the documented opt-out) prints no warnings', () => {
    const { keys, warnings } = readReplacedNode("ignore")

    expect(keys).toEqual(["id", "name"])
    expect(warnings).toEqual([])
})
