/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/1291
 * safeReference causes "Computed values are not allowed to cause side effects" error
 *
 * Status: CANNOT_REPRODUCE
 * Summary: The reporter hits "[mobx] Computed values are not allowed to cause side effects by
 * changing observables that are already being observed. Tried to modify: ObservableObject.sender"
 * when nested computed views (using `slice()`/`asArray` on lists) touch models with a
 * `safeReference`; the diagnosis in the thread is lazy node creation inside a getter. The only
 * reproduction is a CodeSandbox link whose models are not in the thread. That error comes from
 * the computationDepth invariant of MobX 4/5. The installed MobX is 7.0.3, which has no such
 * check: `globalState.computationDepth` does not exist and `checkIfStateModificationsAreAllowed`
 * only calls console.warn when `allowStateChanges` is false. MST's `removeRef` also goes through
 * `applyPatch`, which runs as an MST action. So the reported throw cannot happen on current
 * dependencies, and the issue is likely obsolete.
 */
import { test, expect, describe } from "bun:test"
import { autorun } from "mobx"
import { types, getSnapshot } from "../../src"

const User = types.model("User", {
    id: types.identifier,
    name: types.string
})

const Message = types.model("Message", {
    id: types.identifier,
    sender: types.safeReference(User),
    text: types.string
})

const Store = types
    .model("Store", {
        users: types.array(User),
        messages: types.array(Message)
    })
    .views(self => ({
        get all() {
            return self.messages.slice()
        }
    }))
    .views(self => ({
        get texts() {
            return self.all.map(m => m.text)
        }
    }))
    .views(self => ({
        get senderNames() {
            return self.all.map(m => m.sender && m.sender.name)
        }
    }))

describe("1291 - safeReference inside nested computed views", () => {
    // Smoke test only. It does NOT exercise the reporter's lazy-init-inside-a-getter path (the
    // sandbox models are unknown) and it cannot detect the reported symptom on MobX 7, which no
    // longer throws for side effects in computeds. Do not read it as proof that the issue is fixed.
    test("smoke: nested views over a list with a dangling safeReference run without errors", () => {
        const store = Store.create({
            users: [{ id: "u1", name: "Alice" }],
            messages: [
                { id: "m1", sender: "u1", text: "hi" },
                { id: "m2", sender: "ghost", text: "anyone there?" }
            ]
        })
        const errors: unknown[] = []
        const seen: unknown[] = []
        const dispose = autorun(() => {
            try {
                seen.push(store.texts, store.senderNames)
            } catch (e) {
                errors.push(e)
            }
        })
        dispose()
        expect(errors).toEqual([])
        expect(seen).toEqual([
            ["hi", "anyone there?"],
            ["Alice", undefined]
        ])
        expect(getSnapshot(store).messages[1].sender).toBeUndefined()
    })

    test.todo(
        "1291: need the models and views from the CodeSandbox (https://codesandbox.io/s/mst-safereference-with-computed-bug-7qizx) and the MobX and MST versions it used, and whether the reporter still sees any error or MobX console warning with MobX 6+ and current MST; if not, the issue can be closed",
        () => {
            // blocked on the missing reproduction
        }
    )
})
