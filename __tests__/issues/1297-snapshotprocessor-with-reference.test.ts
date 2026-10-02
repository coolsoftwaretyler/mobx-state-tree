/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/1297
 * types.snapshotProcessor and types.reference
 *
 * Status: ALREADY_FIXED
 * Summary: A `types.reference(SimpleLog)` pointing at a node whose type is
 * `types.snapshotProcessor(SimpleLog, ...)` used to throw "Failed to resolve reference '2' to type
 * 'SimpleLog'" on read. On current source the reference resolves, both for a single processed
 * node (xaviergonz's minimal repro) and for processed nodes inside an array.
 */
import { test, expect, describe } from "bun:test"
import { types } from "../../src"

const SimpleLog = types.model("SimpleLog", {
    id: types.identifier
})

const SingleLog = types.snapshotProcessor(SimpleLog, {
    preProcessor(sn: { time: string }) {
        return {
            id: `${sn.time}`
        }
    }
})

describe("1297 - snapshotProcessor and reference", () => {
    test("reference to the inner model type resolves to a processed node", () => {
        const LogsStore = types.model("Logs", {
            ref: types.maybe(types.reference(SimpleLog)),
            obj: SingleLog
        })

        const Logs = LogsStore.create({
            ref: "2",
            obj: {
                time: "2"
            }
        })

        expect(Logs.ref).toBe(Logs.obj)
        expect(Logs.ref!.id).toBe("2")
    })

    test("reference resolves to a processed node stored in an array", () => {
        const LogsStore = types.model("Logs", {
            highlighted: types.maybe(types.reference(SimpleLog)),
            logs: types.array(SingleLog)
        })

        const Logs = LogsStore.create({
            highlighted: "2",
            logs: [{ time: "1" }, { time: "2" }]
        })

        expect(Logs.highlighted).toBe(Logs.logs[1])
        expect(Logs.highlighted!.id).toBe("2")
    })
})
