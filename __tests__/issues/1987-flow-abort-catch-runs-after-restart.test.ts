/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/1987
 * Aborting action with AbortController does not work immediately, causes trouble with React.StrictMode
 *
 * Status: WORKS_AS_DESIGNED
 * Summary: The reporter starts a flow, aborts its AbortController (React StrictMode unmount) and
 * synchronously starts the flow again (remount). They expect the first run's `catch` block to
 * run before the second run starts. It runs after, because the abort only rejects a promise and
 * the flow resumes on a later microtask. React is not installed, so only the non-React part is
 * reproduced; the codesandbox is not in the thread, so the model is a reconstruction.
 * The test pins that a flow orders exactly like an `async` function does, which is what
 * docs/concepts/async-actions.md promises ("further behavior should be the same"). The thread
 * itself shows a plain async action behaves the same. Nothing in MST's flow delays the catch.
 * Docs could say explicitly that aborting does not make the catch block run synchronously, and
 * that to sequence runs the caller must await the aborted action's promise first (pinned below).
 * The reporter's side question, MobX style `flow.cancel()`, is a separate feature request: MST
 * flows return a plain promise with no cancel method.
 */
import { test, expect, describe } from "bun:test"
import { types, flow } from "../../src"

function abortable(signal: AbortSignal) {
    return new Promise<string>((_resolve, reject) => {
        signal.addEventListener("abort", () => reject(new Error("Aborted")))
    })
}

function createStore(log: string[]) {
    let controller = new AbortController()
    return types
        .model("Store", { title: "" })
        .actions(self => ({
            load: flow(function* (run: number) {
                log.push(`start ${run}`)
                try {
                    yield abortable(controller.signal)
                } catch {
                    log.push(`catch ${run}`)
                }
            }),
            cancel() {
                log.push("cancel")
                controller.abort()
                controller = new AbortController()
            }
        }))
        .create()
}

describe("1987 - aborting a flow and restarting it", () => {
    test("the first run's catch block runs after a synchronous restart, same as an async function", async () => {
        const flowLog: string[] = []
        const store = createStore(flowLog)
        const first = store.load(1)
        store.cancel()
        const second = store.load(2)
        store.cancel()
        await Promise.all([first, second])

        const asyncLog: string[] = []
        let controller = new AbortController()
        const load = async (run: number) => {
            asyncLog.push(`start ${run}`)
            try {
                await abortable(controller.signal)
            } catch {
                asyncLog.push(`catch ${run}`)
            }
        }
        const cancel = () => {
            asyncLog.push("cancel")
            controller.abort()
            controller = new AbortController()
        }
        const asyncFirst = load(1)
        cancel()
        const asyncSecond = load(2)
        cancel()
        await Promise.all([asyncFirst, asyncSecond])

        expect(flowLog).toEqual(["start 1", "cancel", "start 2", "cancel", "catch 1", "catch 2"])
        expect(flowLog).toEqual(asyncLog)
    })

    test("workaround: awaiting the aborted run before restarting gives the expected order", async () => {
        const log: string[] = []
        const store = createStore(log)
        const first = store.load(1)
        store.cancel()
        await first
        const second = store.load(2)
        store.cancel()
        await second
        expect(log).toEqual(["start 1", "cancel", "catch 1", "start 2", "cancel", "catch 2"])
    })
})
