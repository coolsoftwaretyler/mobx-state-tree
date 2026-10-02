/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/2105
 * When observe() a MST node's primitive property, TypeScript get the wrong type of oldValue & newValue
 *
 * Status: WORKS_AS_DESIGNED
 * Summary: The reporter calls MobX `observe(model, "name", listener)` on a `types.string` property
 * and sees `change.oldValue` / `change.newValue` typed as `string` (MobX's `IValueDidChange<T[K]>`),
 * while at runtime they are MST's internal `ScalarNode` objects. They expect the types to say
 * ScalarNode. Both types are correct for their own layer: MST's instance type says `name` is a
 * string, and MobX's overload derives its change type from that. The mismatch exists because MST
 * stores child nodes inside the MobX observable object and unboxes them only on read
 * (`_interceptReads` in src/types/complex-types/model.ts), so MobX's low-level `observe` and
 * `intercept` see the stored nodes. MST's own `didChange` handler relies on receiving nodes
 * (it reads `change.newValue.snapshot`), and typing the public change as ScalarNode would expose
 * an internal class. As first written, a type-level assertion ("not a string") and a runtime
 * assertion ("is a string") demanded opposite fixes, which is why this is not a defect to fix.
 * Documentation: docs/concepts/listeners.md describes the supported APIs, `onSnapshot`,
 * `onPatch` and MobX `reaction` / `autorun`; MobX itself warns against `observe` / `intercept`
 * for application use. Docs resolution: add a note to the listeners page (or close with this
 * explanation) that raw MobX `observe` / `intercept` on MST nodes receive internal nodes, and
 * point to those APIs. Related: #2275, where n9's comment of 2025-07-23 hits the same node leak
 * through `observe` on a map (`ch.newValue` is a node, not the instance).
 */
import { test, expect, describe } from "bun:test"
import { observe, reaction } from "mobx"
import { types, onPatch, onSnapshot } from "../../src"

const Model = types
    .model("Model", {
        name: types.string
    })
    .actions(self => ({
        setName(newName: string) {
            self.name = newName
        }
    }))

describe("2105 - observe() on a primitive property of a MST node", () => {
    test("raw MobX observe hands listeners the stored node, not the plain value (documented limitation)", () => {
        const model = Model.create({ name: "John" })
        const seen: { oldValue: unknown; newValue: unknown }[] = []

        // The reporter's code path, as written in the issue
        observe(model, "name", change => {
            if (change.type === "update") {
                seen.push({ oldValue: change.oldValue, newValue: change.newValue })
            }
        })

        model.setName("Dave")

        expect(seen.length).toBe(1)
        // Limitation pinned: the values are MST nodes (ScalarNode), not strings
        expect(typeof seen[0].oldValue).not.toBe("string")
        expect(typeof seen[0].newValue).not.toBe("string")
        expect((seen[0].newValue as { storedValue: unknown }).storedValue).toBe("Dave")
    })

    test("supported APIs (onPatch, onSnapshot, reaction) deliver plain values", () => {
        const model = Model.create({ name: "John" })
        const patches: unknown[] = []
        const snapshots: unknown[] = []
        const reactions: unknown[] = []

        onPatch(model, patch => patches.push(patch))
        onSnapshot(model, snapshot => snapshots.push(snapshot))
        const dispose = reaction(
            () => model.name,
            (name, previous) => reactions.push([previous, name])
        )

        model.setName("Dave")
        dispose()

        expect(patches).toEqual([{ op: "replace", path: "/name", value: "Dave" }])
        expect(snapshots).toEqual([{ name: "Dave" }])
        expect(reactions).toEqual([["John", "Dave"]])
    })
})
