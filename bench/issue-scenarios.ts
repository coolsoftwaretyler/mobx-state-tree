/**
 * Scenarios that reproduce performance issues from the tracker. Each entry names the issue it
 * measures. Keep setup outside the timed section; return elapsed milliseconds (or, for memory
 * scenarios, bytes, with `unit: "bytes"`).
 *
 * Scenario names start with the issue number so `bun run bench -- --filter "#2237"` selects them.
 * The runner prints every number with an "ms" label, including the bytes scenarios, which say
 * "(bytes)" in their name.
 */
import { performance } from "perf_hooks"
import { heapStats } from "bun:jsc"
import { observable } from "mobx"
import { types } from "../src"
import type { Scenario } from "./scenarios"

const now = () => performance.now()

// -- #2237: replacing a large array of identified nodes ------------------------------------

const Point = types.model("Point", { uuid: types.identifier, name: types.string })
const PointsStore = types.model("PointsStore", { points: types.array(Point) }).actions(self => ({
    setPoints(points: unknown[]) {
        self.points.replace(points as never[])
    }
}))

const makePoints = (n: number, prefix: string) =>
    Array.from({ length: n }, (_, i) => ({ uuid: `${prefix}-${i}`, name: `point ${i}` }))

/** Reporter's shape: an array of n identified Points replaced by n Points with all-new ids. */
function replacePoints(n: number, kind: "instances" | "snapshots", clearFirst = false) {
    const store = PointsStore.create({ points: makePoints(n, "old") })
    const fresh = makePoints(n, "new")
    const incoming = kind === "instances" ? fresh.map(p => Point.create(p)) : fresh
    const t = now()
    if (clearFirst) store.setPoints([])
    store.setPoints(incoming)
    return now() - t
}

const replaceScenarios = (kind: "instances" | "snapshots", sizes: number[]): Scenario[] =>
    sizes.map(n => ({
        name: `#2237 array.replace: ${n} identified Points with ${n} fresh ${kind}`,
        issue: "#2237",
        run: () => replacePoints(n, kind)
    }))

// -- #1683: memory per node ----------------------------------------------------------------

const NODES = 20_000

const Metric = types.model("Metric", { id: types.identifier, value: types.number })
const MetricStore = types.model("MetricStore", { items: types.map(Metric) })

// same shape without an identifier, to see what the identifier costs
const Sample = types.model("Sample", { value: types.number })
const SampleStore = types.model("SampleStore", { items: types.map(Sample) })

// a more typical domain model: six props including a nested array, one view, two actions
const Entry = types
    .model("Entry", {
        id: types.identifier,
        name: types.string,
        value: types.number,
        active: types.boolean,
        note: "",
        tags: types.array(types.string)
    })
    .views(self => ({
        get label() {
            return `${self.name}:${self.value}`
        }
    }))
    .actions(self => ({
        setValue(value: number) {
            self.value = value
        },
        toggle() {
            self.active = !self.active
        }
    }))
const EntryStore = types.model("EntryStore", { items: types.map(Entry) })

type Dict = Record<string, Record<string, unknown>>
const metricSnapshot = (): Dict => {
    const items: Dict = {}
    for (let i = 0; i < NODES; i++) items["id" + i] = { id: "id" + i, value: i }
    return items
}
const sampleSnapshot = (): Dict => {
    const items: Dict = {}
    for (let i = 0; i < NODES; i++) items["id" + i] = { value: i }
    return items
}
const entrySnapshot = (): Dict => {
    const items: Dict = {}
    for (let i = 0; i < NODES; i++) {
        items["id" + i] = {
            id: "id" + i,
            name: "name" + i,
            value: i,
            active: i % 2 === 0,
            note: "",
            tags: ["a", "b"]
        }
    }
    return items
}

/** Read one prop of every node, which is what makes MST create the observable instance. */
const touch = (items: { values(): Iterable<{ value: number }> }) => {
    let sum = 0
    for (const item of items.values()) sum += item.value
    return sum
}

// Bun's process.memoryUsage().heapUsed is a cached value that only refreshes on an event-loop
// tick, so inside a synchronous scenario it never moves. heapStats().heapSize is live after a
// full GC and includes JSC's "extra memory" (strings, buffers).
const settledHeap = () => {
    Bun.gc(true)
    Bun.gc(true)
    return heapStats().heapSize
}
// JSC scans the machine stack conservatively, so a stale slot can keep the previous iteration's
// tree alive until the next event-loop tick. Overwriting the stack before each GC lowers that risk.
function scrubStack(depth: number): number {
    if (depth === 0) return 0
    const pad = [depth, depth + 1, depth + 2, depth + 3]
    return scrubStack(depth - 1) + pad[0]
}
// keeps the built value reachable until the second measurement
const keep: { value?: unknown } = {}
/** Bytes still reachable after `build()` returns, with everything `build` allocated and dropped collected. */
function retainedBytes(build: () => unknown): number {
    keep.value = undefined
    scrubStack(400)
    const before = settledHeap()
    keep.value = build()
    scrubStack(400)
    const after = settledHeap()
    keep.value = undefined
    return after - before
}

// Even with the scrub, a leftover tree from the previous iteration occasionally survives into the
// "before" reading and makes the delta near zero. Memory scenarios therefore measure in a fresh
// child process (this file run directly), where there is no previous iteration.
const inProcess = new Map<string, () => number>()
function inFreshProcess(name: string): number {
    const child = Bun.spawnSync([process.execPath, import.meta.path, name])
    const bytes = Number(child.stdout.toString().trim())
    if (child.exitCode !== 0 || !Number.isFinite(bytes)) {
        throw new Error(`memory child failed for "${name}": ${child.stderr.toString()}`)
    }
    return bytes
}

const memory = (name: string, build: () => unknown): Scenario => {
    const full = `#1683 memory (bytes): ${name}, ${NODES} nodes`
    inProcess.set(full, () => retainedBytes(build))
    return { name: full, issue: "#1683", unit: "bytes", run: () => inFreshProcess(full) }
}

const jsonSize = (name: string, snapshot: () => Dict): Scenario => ({
    name: `#1683 snapshot JSON text (bytes): ${name}, ${NODES} nodes`,
    issue: "#1683",
    unit: "bytes",
    run: () => JSON.stringify(snapshot()).length
})

// -- #1683: adding nodes one at a time (the reporter notes each add gets slower) ---------

const Ledger = types.model("Ledger", { items: types.map(Metric) }).actions(self => ({
    add(id: string, value: number) {
        self.items.set(id, { id, value })
    },
    addMany(count: number) {
        for (let i = 0; i < count; i++) self.items.set("id" + i, { id: "id" + i, value: i })
    }
}))

const addOneAtATime = (count: number): Scenario => ({
    name: `#1683 map.set ${count} identified items, one action per item`,
    issue: "#1683",
    run: () => {
        const ledger = Ledger.create({})
        const t = now()
        for (let i = 0; i < count; i++) ledger.add("id" + i, i)
        return now() - t
    }
})

export const issueScenarios: Scenario[] = [
    ...replaceScenarios("instances", [1000, 2000, 4000, 10_000]),
    ...replaceScenarios("snapshots", [1000, 2000]),
    {
        name: "#2237 array.replace: 10000 identified Points with 10000 fresh instances, after replace([])",
        issue: "#2237",
        run: () => replacePoints(10_000, "instances", true)
    },
    jsonSize("{id, value}", metricSnapshot),
    jsonSize("six props with identifier", entrySnapshot),
    memory("plain objects {id, value}", () => Object.values(metricSnapshot())),
    memory("MobX observable objects {id, value}", () =>
        Object.values(metricSnapshot()).map(item => observable(item))
    ),
    memory("types.map(Metric {id, value}), created and never read", () =>
        MetricStore.create({ items: metricSnapshot() as never })
    ),
    memory("types.map(Metric {id, value}), every node read", () => {
        const store = MetricStore.create({ items: metricSnapshot() as never })
        touch(store.items)
        return store
    }),
    memory("types.map(Sample {value}) without identifier, every node read", () => {
        const store = SampleStore.create({ items: sampleSnapshot() as never })
        touch(store.items)
        return store
    }),
    memory("plain objects, six props with identifier", () => Object.values(entrySnapshot())),
    memory("types.map(Entry) six props, view, 2 actions, every node read", () => {
        const store = EntryStore.create({ items: entrySnapshot() as never })
        touch(store.items)
        return store
    }),
    addOneAtATime(2000),
    addOneAtATime(4000),
    {
        name: "#1683 map.set 4000 identified items, all in one action (control)",
        issue: "#1683",
        run: () => {
            const ledger = Ledger.create({})
            const t = now()
            ledger.addMany(4000)
            return now() - t
        }
    }
]

// `bun bench/issue-scenarios.ts "<scenario name>"` prints one memory measurement (see inFreshProcess)
if (import.meta.main) {
    const measure = inProcess.get(process.argv[2] ?? "")
    if (!measure) throw new Error(`no memory scenario named "${process.argv[2]}"`)
    console.log(measure())
}
