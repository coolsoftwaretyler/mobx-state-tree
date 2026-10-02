/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/1157
 * Functions that create circular references need to have their return type explicitly typed
 *
 * Status: REPRODUCES
 * Summary: A `User` view reads `store.chats` (a `Store` that contains `User` and `Chat`), so the
 * view's return type depends on a type that depends on the view's own model. The reporter expects
 * `chats` to be inferred as `Chat[]`; TypeScript instead reports TS7023 ("implicitly has return
 * type 'any'"). That one error is the reported bug and is a TypeScript inference limit for
 * unannotated getters in a cycle (inference and checking happen in one pass).
 * Two more things show up on current source, both caused by `ExcludeReadonly` / `WritableKeys` on
 * `IType.create` in src/core/type/type.ts (added by #2199, 3a2945db, 2024-08-01, tracked with #1463):
 * (1) five cascade errors (TS7006, TS7022, TS2615 naming Pick and IsEqualConsideringWritability) on the
 * other declarations of the cycle, and (2) the workaround from the thread, annotating the getter as
 * `get chats(): Instance<typeof Chat>[]`, fails with TS2502 instead of working. With `ExcludeReadonly<T>`
 * replaced by `T` in memory, the cascade disappears, only TS7023 remains on the unannotated chain, and
 * the annotated chain compiles with `chats[0].id` typed as string. The 2019 explanation in the thread
 * (the `Omit` in `RedefineIStateTreeNode`) is outdated: that type no longer exists in src.
 * Directives: chain 1 has six (one BUG #1157, five REGRESSION #2199); chain 2 has five (the TS2502 line
 * and the ChatId assertion are labeled BUG #1157, the other three REGRESSION #2199). A directive becomes
 * unused when its error goes away, and then `bun run typecheck` fails.
 */
import { test, expect, describe } from "bun:test"
import { types, Instance } from "../../src"

type Expect<T extends true> = T
type Equal<A, B> =
    (<X>() => X extends A ? 1 : 2) extends <X>() => X extends B ? 1 : 2 ? true : false

// Chain 1: the circular shape from the thread, getter not annotated.
// User.chats -> store -> Store -> User, Chat -> User
const User = types.model("User", { id: types.identifier }).views(self => ({
    // @ts-expect-error BUG #1157: 'chats' implicitly has return type 'any' (TS7023)
    get chats() {
        // @ts-expect-error REGRESSION #2199 (ExcludeReadonly), tracked with #1463: callback parameters implicitly any (TS7006)
        return store.chats.filter(chat => !!chat.users.find(u => u.id === self.id))
    }
}))

// @ts-expect-error REGRESSION #2199 (ExcludeReadonly), tracked with #1463: 'Chat' implicitly has type 'any' (TS7022)
const Chat = types.model("Chat", {
    id: types.identifier,
    users: types.array(types.reference(User))
})

// @ts-expect-error REGRESSION #2199 (ExcludeReadonly), tracked with #1463: 'Store' implicitly has type 'any' (TS7022)
const Store = types.model("Store", {
    // @ts-expect-error REGRESSION #2199 (ExcludeReadonly), tracked with #1463: property types circularly reference themselves (TS2615)
    users: types.array(User),
    chats: types.array(Chat)
})

// @ts-expect-error REGRESSION #2199 (ExcludeReadonly), tracked with #1463: 'store' implicitly has type 'any' (TS7022)
const store = Store.create({
    users: [{ id: "u1" }, { id: "u2" }],
    chats: [
        { id: "c1", users: ["u1", "u2"] },
        { id: "c2", users: ["u2"] }
    ]
})

// Chain 2: the workaround from the thread, annotating the getter's return type.
const User2 = types.model("User2", { id: types.identifier }).views(self => ({
    // @ts-expect-error BUG #1157: the suggested annotation fails with TS2502 (also the #2199 regression, it compiles without ExcludeReadonly)
    get chats(): Instance<typeof Chat2>[] {
        // @ts-expect-error REGRESSION #2199 (ExcludeReadonly), tracked with #1463: callback parameters implicitly any (TS7006)
        return store2.chats.filter(chat => !!chat.users.find(u => u.id === self.id))
    }
}))

// @ts-expect-error REGRESSION #2199 (ExcludeReadonly), tracked with #1463: 'Chat2' implicitly has type 'any' (TS7022)
const Chat2 = types.model("Chat2", {
    id: types.identifier,
    // @ts-expect-error REGRESSION #2199 (ExcludeReadonly), tracked with #1463: property types circularly reference themselves (TS2615)
    users: types.array(types.reference(User2))
})

const Store2 = types.model("Store2", {
    users: types.array(User2),
    chats: types.array(Chat2)
})

const store2 = Store2.create({
    users: [{ id: "u1" }, { id: "u2" }],
    chats: [
        { id: "c1", users: ["u1", "u2"] },
        { id: "c2", users: ["u2"] }
    ]
})

describe("1157 - circular references between views and the store", () => {
    test("the unannotated view works at runtime even though its type cannot be inferred", () => {
        expect(store.users[0].chats.map((c: { id: string }) => c.id)).toEqual(["c1"])
        expect(store.users[1].chats.map((c: { id: string }) => c.id)).toEqual(["c1", "c2"])
    })

    test("the annotated view should expose the chat's id as a string", () => {
        type ChatId = Instance<typeof Store2>["users"][0]["chats"][0]["id"]
        // @ts-expect-error BUG #1157: the annotated getter's element type is `any`, expected string (also #2199)
        type _ChatIdIsString = Expect<Equal<ChatId, string>>
    })

    test("the annotated view works at runtime too", () => {
        expect(store2.users[0].chats.map((c: { id: string }) => c.id)).toEqual(["c1"])
        expect(store2.users[1].chats.map((c: { id: string }) => c.id)).toEqual(["c1", "c2"])
    })
})
