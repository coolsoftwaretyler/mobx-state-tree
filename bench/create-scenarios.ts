import { performance } from "perf_hooks"
import { Treasure, Hero, Monster } from "./fixtures/fixture-models"
import { createTreasure, createHeros, createMonsters } from "./fixtures/fixture-data"

/** Instantiate `count` tiny models. Data is built before the timer starts. */
export function smallScenario(count: number) {
    const data = createTreasure(count)
    const t0 = performance.now()
    const converted = data.map(d => Treasure.create(d))
    const elapsed = performance.now() - t0
    return { count, elapsed, sanity: converted.length === count }
}

/** Instantiate `count` medium models, each with one computed view. */
export function mediumScenario(count: number) {
    const data = createHeros(count)
    const t0 = performance.now()
    const converted = data.map(d => Hero.create(d))
    const elapsed = performance.now() - t0
    return { count, elapsed, sanity: converted.length === count }
}

/** Instantiate `count` large models with nested small and medium children. */
export function largeScenario(count: number, smallChildren: number, mediumChildren: number) {
    const data = createMonsters(count, smallChildren, mediumChildren)
    const t0 = performance.now()
    const converted = data.map(d => Monster.create(d))
    const elapsed = performance.now() - t0
    return { count, elapsed, sanity: converted.length === count }
}
