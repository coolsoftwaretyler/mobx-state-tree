/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/1271
 * createActionTrackingMiddleware breaks with nested flows
 *
 * Status: REPRODUCES
 * Summary: A flow that yields another flow (a nested flow) on a model guarded by the v1
 * `createActionTrackingMiddleware` should run to completion and report exactly one success for
 * the outer action (the docs promise exactly one of onSuccess / onFail per action). Instead the
 * inner flow's `flow_return` fires `onSuccess` with the outer action's context too early, and
 * deletes the outer action's entry from the middleware's `runningActions`. When the outer flow
 * resumes, the middleware throws `TypeError: undefined is not an object (evaluating
 * 'root.context')`, the outer promise never settles (the helper below would resolve "timeout"),
 * and the error is rethrown from a microtask. The codesandbox is not in the thread, so the model
 * below is a reconstruction.
 * Cause as the reporter suspected: nested flows share the outer action's `rootId`, and the
 * middleware's `flow_return` / `flow_throw` cases act on `runningActions[call.rootId]`, which is
 * the outer action's entry. The reporter's proposed guard is `call.parentId === call.rootId`
 * (true only for the outer flow's own events). That guard alone would still fire the premature
 * `onSuccess`, so the last assertion requires "success outer" exactly once, and last.
 */
import { test, expect, describe } from "bun:test"
import { types, flow, addMiddleware, createActionTrackingMiddleware } from "../../src"

function createTracked() {
    const Model = types
        .model("Model", { count: 0 })
        .actions(self => ({
            inner: flow(function* () {
                yield Promise.resolve()
                self.count++
                return "inner"
            })
        }))
        .actions(self => ({
            outer: flow(function* () {
                const result: string = yield self.inner()
                yield Promise.resolve()
                self.count++
                return result
            }),
            single: flow(function* () {
                yield Promise.resolve()
                self.count++
                return "single"
            })
        }))

    const model = Model.create()
    const log: string[] = []
    addMiddleware(
        model,
        createActionTrackingMiddleware({
            onStart: call => {
                log.push(`start ${call.name}`)
                return call.name
            },
            onResume: () => {},
            onSuspend: () => {},
            onSuccess: (_call, name) => {
                log.push(`success ${name}`)
            },
            onFail: (_call, name, error) => {
                log.push(`fail ${name}: ${error}`)
            }
        })
    )
    return { model, log }
}

function withTimeout<T>(promise: Promise<T>) {
    return Promise.race([promise, new Promise<string>(r => setTimeout(() => r("timeout"), 30))])
}

describe("1271 - createActionTrackingMiddleware with nested flows", () => {
    test("baseline: a single, non-nested flow is tracked fine", async () => {
        const { model, log } = createTracked()
        expect(await withTimeout(model.single())).toBe("single")
        expect(log).toEqual(["start single", "success single"])
    })

    test.failing("a flow that yields another flow completes and is tracked", async () => {
        const { model, log } = createTracked()
        expect(await withTimeout(model.outer())).toBe("inner")
        expect(model.count).toBe(2)
        expect(log.filter(entry => entry.startsWith("fail"))).toEqual([])
        // exactly one terminal hook for the outer action, and it is the last thing that happens
        expect(log.filter(entry => entry === "success outer")).toHaveLength(1)
        expect(log[log.length - 1]).toBe("success outer")
    })
})
