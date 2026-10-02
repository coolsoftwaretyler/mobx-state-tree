/**
 * Compare two benchmark result files.
 *
 *   bun run bench:compare bench/baselines/<file>.json bench/results/current.json [--tolerance 0.15] [--fail]
 *
 * Prints every scenario with its change in median time. With --fail, exits 1 when any
 * scenario is slower than the baseline by more than the tolerance (default 15%).
 */
import { readFileSync } from "fs"
const [a, b] = process.argv.slice(2).filter(x => !x.startsWith("--"))
if (!a || !b) {
    console.error("usage: compare <baseline.json> <current.json> [--tolerance 0.15] [--fail]")
    process.exit(2)
}
const ti = process.argv.indexOf("--tolerance")
const tolerance = ti === -1 ? 0.15 : Number(process.argv[ti + 1])
const fail = process.argv.includes("--fail")
const base = JSON.parse(readFileSync(a, "utf8")),
    cur = JSON.parse(readFileSync(b, "utf8"))
const byName = new Map(base.results.map((r: any) => [r.name, r]))
let regressions = 0
console.log(
    `baseline ${base.commit} (${base.date.slice(0, 10)})  →  current ${cur.commit} (${cur.date.slice(0, 10)})\n`
)
for (const r of cur.results) {
    const o: any = byName.get(r.name)
    if (!o) {
        console.log(`   new      ${r.median.toFixed(2).padStart(9)} ms  ${r.name}`)
        continue
    }
    const delta = (r.median - o.median) / o.median
    const flag = delta > tolerance ? "SLOWER" : delta < -tolerance ? "faster" : "  ~   "
    if (delta > tolerance) regressions++
    console.log(
        `${flag}  ${(delta * 100).toFixed(1).padStart(7)}%  ${o.median.toFixed(2).padStart(9)} → ${r.median.toFixed(2).padStart(9)} ms  ${r.name}`
    )
}
if (regressions)
    console.log(
        `\n${regressions} scenario(s) slower than baseline by more than ${tolerance * 100}%`
    )
if (fail && regressions) process.exit(1)
