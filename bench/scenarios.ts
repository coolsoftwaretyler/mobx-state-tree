/**
 * Benchmark scenarios. Each returns the elapsed milliseconds of the measured section only;
 * setup happens before the timer starts. Keep scenarios deterministic and allocation-light
 * outside the measured section so run-to-run noise stays low.
 */
import { types, getSnapshot, applySnapshot, onPatch, resolveIdentifier } from "../src"
import { smallScenario, mediumScenario, largeScenario } from "./create-scenarios"

const now = () => performance.now()

const Shape = types
    .model("Shape", {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        rotation: 90,
        fill: "red",
        stroke: "black",
        name: ""
    })
    .actions(self => ({
        set(attrs: Record<string, any>) {
            Object.assign(self, attrs)
        }
    }))
const Group = types.model("Group", { shapes: types.array(Shape) }).actions(self => ({
    replaceAll(items: any[]) {
        self.shapes.replace(items)
    }
}))

const Item = types.model("Item", { id: types.identifier, label: "" })
const Catalog = types
    .model("Catalog", { items: types.map(Item), picks: types.array(types.reference(Item)) })
    .actions(self => ({
        put(snapshot: { id: string; label: string }) {
            self.items.put(snapshot)
        },
        pick(id: string) {
            self.picks.push(id as any)
        }
    }))

export type Scenario = { name: string; issue?: string; run: () => number }

export const scenarios: Scenario[] = [
    { name: "create 10k small models", run: () => smallScenario(10_000).elapsed },
    { name: "create 5k medium models (1 computed)", run: () => mediumScenario(5_000).elapsed },
    {
        name: "create 250 large models, 10 small + 10 medium children",
        run: () => largeScenario(250, 10, 10).elapsed
    },
    {
        name: "applySnapshot: 2k-item array, 10 items changed",
        issue: "#2128",
        run: () => {
            const group = Group.create({ shapes: new Array(2000).fill({}) })
            const original = getSnapshot(group)
            for (let i = 0; i < 2000; i += 200) group.shapes[i].set({ x: 20, y: 30 })
            const t = now()
            applySnapshot(group, original)
            return now() - t
        }
    },
    {
        name: "applySnapshot: 2k-item array, 10 items changed, with onPatch listener",
        issue: "#2128",
        run: () => {
            const group = Group.create({ shapes: new Array(2000).fill({}) })
            const original = getSnapshot(group)
            for (let i = 0; i < 2000; i += 200) group.shapes[i].set({ x: 20, y: 30 })
            const dispose = onPatch(group, () => {})
            const t = now()
            applySnapshot(group, original)
            const ms = now() - t
            dispose()
            return ms
        }
    },
    {
        name: "array.replace: 2k items with 2k fresh snapshots",
        issue: "#2237",
        run: () => {
            const group = Group.create({ shapes: new Array(2000).fill({}) })
            const fresh = Array.from({ length: 2000 }, (_, i) => ({ name: "n" + i }))
            const t = now()
            group.replaceAll(fresh)
            return now() - t
        }
    },
    {
        name: "getSnapshot: 2k-item array after one mutation",
        run: () => {
            const group = Group.create({ shapes: new Array(2000).fill({}) })
            getSnapshot(group)
            group.shapes[7].set({ x: 1 })
            const t = now()
            getSnapshot(group)
            return now() - t
        }
    },
    {
        name: "map.put 5k identified items, then resolve 5k references",
        run: () => {
            const catalog = Catalog.create({})
            const t = now()
            for (let i = 0; i < 5000; i++) catalog.put({ id: "id" + i, label: "L" + i })
            for (let i = 0; i < 5000; i++) resolveIdentifier(Item, catalog, "id" + i)
            return now() - t
        }
    },
    {
        name: "push 2k references and read them back",
        run: () => {
            const catalog = Catalog.create({})
            for (let i = 0; i < 2000; i++) catalog.put({ id: "id" + i, label: "" })
            const t = now()
            for (let i = 0; i < 2000; i++) catalog.pick("id" + i)
            let n = 0
            for (const p of catalog.picks) n += p.label.length
            return now() - t + n * 0
        }
    }
]
