/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/2040
 * RootStore type becomes "any" the moment we call a RootStore model action using yield on a child model action
 *
 * Status: WORKS_AS_DESIGNED
 * Summary: A child model's flow gets the root with `getRoot<typeof RootStore>(self)` and does
 * `yield root.load()`, where `load` is a flow on the root model that lists the child in its
 * props. The reporter expects the types to stay intact; TypeScript instead reports a circular
 * inference (TS7022 on `Child`, `root` and `RootStore`, TS7024 on the flow function) and
 * `RootStore` and its instances collapse to `any`. This is a TypeScript limitation, not a
 * library defect: TypeScript always folds the yielded operand types into a generator's inferred
 * type, so the generic `actions()` / `flow()` calls have to infer `root.load()` while Child's own
 * type is still being built, and that closes the cycle through `typeof RootStore`. Calling
 * `root.load()` without `yield`, or from a plain action, compiles fine. Loosening `flow`'s yield
 * constraint to `any` was tried and does not remove the cycle, so no API-neutral change in
 * `flow` can fix it. The codesandbox is not in the thread, so the model below is a reconstruction.
 * The @ts-expect-error lines pin the known limitation: they only go unused, and typecheck fails,
 * if TypeScript ever changes how it infers generators. The workaround from the thread (a hand
 * written root interface passed to `getRoot<...>`) is pinned below and compiles without errors.
 * Docs follow-up: docs/tips/circular-deps.md covers circular `types.late` props only; it (or the
 * TypeScript page) should cover `getRoot<typeof Root>` inside child flows and the interface
 * workaround.
 */
import { test, expect, describe } from "bun:test"
import { types, flow, getRoot } from "../../src"

type Expect<T extends true> = T
type Equal<A, B> =
    (<X>() => X extends A ? 1 : 2) extends <X>() => X extends B ? 1 : 2 ? true : false

// @ts-expect-error KNOWN LIMITATION #2040: TS7022 'Child' implicitly has type 'any' (cycle through the yield on a root action)
const Child = types.model("Child", { name: "" }).actions(self => ({
    // @ts-expect-error KNOWN LIMITATION #2040: TS7024 the flow function implicitly has return type 'any'
    run: flow(function* () {
        // @ts-expect-error KNOWN LIMITATION #2040: TS7022 'root' implicitly has type 'any'
        const root = getRoot<typeof RootStore>(self)
        yield root.load()
    })
}))

// @ts-expect-error KNOWN LIMITATION #2040: TS7022 'RootStore' implicitly has type 'any'
const RootStore = types.model("RootStore", { loaded: 0, child: Child }).actions(self => ({
    load: flow(function* () {
        yield Promise.resolve()
        self.loaded++
        return self.loaded
    })
}))

const store = RootStore.create({ child: { name: "c" } })

// @ts-expect-error KNOWN LIMITATION #2040: RootStore instances collapse to any, so their props are not typed
export type LoadedIsNumber = Expect<Equal<typeof store.loaded, number>>

// Workaround from the thread: describe the root by hand instead of using `typeof RootStore`.
interface IRootStoreShape {
    loaded: number
    load(): Promise<number>
}

const SafeChild = types.model("SafeChild", { name: "" }).actions(self => ({
    run: flow(function* () {
        const root = getRoot<IRootStoreShape>(self)
        const loaded: number = yield root.load()
        return loaded
    })
}))

const SafeRootStore = types
    .model("SafeRootStore", { loaded: 0, child: SafeChild })
    .actions(self => ({
        load: flow(function* () {
            yield Promise.resolve()
            self.loaded++
            return self.loaded
        })
    }))

const safeStore = SafeRootStore.create({ child: { name: "c" } })

export type SafeLoadedIsNumber = Expect<Equal<typeof safeStore.loaded, number>>

describe("2040 - yielding a root action from a child flow", () => {
    test("works at runtime even though the types collapse to any", async () => {
        await store.child.run()
        expect(store.loaded).toBe(1)
    })

    test("workaround: a hand written root interface keeps the types intact", async () => {
        expect(await safeStore.child.run()).toBe(1)
        expect(safeStore.loaded).toBe(1)
    })
})
