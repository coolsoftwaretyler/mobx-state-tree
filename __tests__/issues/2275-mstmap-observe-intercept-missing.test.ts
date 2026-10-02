/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/2275
 * MSTMap does not have `observe` method, but IMSTMap does
 *
 * Status: REPRODUCES
 * Summary: `IMSTMap` declares `observe(listener, fireImmediately?)` and `intercept(handler)`, so
 * `store.tweets.observe(() => {})` compiles, but the runtime `MSTMap` (extends MobX's `ObservableMap`)
 * has neither, so the call throws "observe is not a function". Only MobX's standalone
 * `observe(map, ...)` / `intercept(map, ...)` exist. The reporter hit this in July 2025, before the
 * repo's MobX 7 bump (8c7c89fe, 2026-09-02), so it is not a MobX 7 regression.
 * Fix direction is a maintainer decision. (a) Implement the methods on MSTMap. A plain delegation to
 * `observe(this, listener)` would not be enough: MSTMap stores ObjectNodes and unboxes them only on
 * read, so the listener would receive internal nodes, which is the reporter's second comment where
 * `getSnapshot(ch.newValue)` crashes. The observe test below therefore also asserts that the listener
 * receives instances, as the `IMapDidChange<string, IT["Type"]>` signature promises. (b) Drop
 * `observe`/`intercept` from `IMSTMap`, the patch the maintainer suggested in the thread, which also
 * matches `IMSTArray`, MST's array interface, and MobX 7's `IObservableArray`, neither of which
 * declares them. Under (b) these tests would stop compiling and the file would need rewriting as a
 * type test.
 */
import { test, expect, describe } from "bun:test"
import { types, getSnapshot } from "../../src"

describe("2275 - MSTMap observe/intercept declared by IMSTMap", () => {
    const Tweet = types.model("Tweet", {
        body: types.string,
        read: false
    })

    const TwitterStore = types
        .model("TwitterStore", {
            tweets: types.map(Tweet)
        })
        .actions(self => ({
            add(id: string, body: string) {
                self.tweets.set(id, { body })
            }
        }))

    test.failing("observe is callable on a map and reports additions", () => {
        const store = TwitterStore.create()
        const seen: string[] = []
        const bodies: string[] = []

        const dispose = store.tweets.observe(change => {
            seen.push(`${change.type}:${String(change.name)}`)
            if (change.type === "add") {
                // The listener must receive the Tweet instance, not the internal ObjectNode
                bodies.push(change.newValue.body)
                expect(getSnapshot(change.newValue)).toEqual({ body: "Hello", read: false })
            }
        })
        store.add("1", "Hello")
        dispose()

        expect(seen).toEqual(["add:1"])
        expect(bodies).toEqual(["Hello"])
    })

    test.failing("intercept is callable on a map", () => {
        const store = TwitterStore.create()

        const dispose = store.tweets.intercept(change => change)
        store.add("1", "Hello")
        dispose()

        expect(store.tweets.size).toBe(1)
    })
})
