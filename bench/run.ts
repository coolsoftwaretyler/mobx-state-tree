/**
 * Micro-benchmark runner. Informational, not a test: numbers are machine-specific.
 *
 *   bun run bench                         run every scenario, print a table
 *   bun run bench -- --out bench/results/x.json
 *   bun run bench -- --filter applySnapshot --iterations 15
 *
 * Compare two result files with `bun run bench:compare <baseline.json> <current.json>`.
 */
import { scenarios } from "./scenarios"
import { writeFileSync, mkdirSync } from "fs"
import { dirname } from "path"
import { execSync } from "child_process"
import { cpus, platform, arch } from "os"

const arg = (flag: string, dflt?: string) => {
    const i = process.argv.indexOf(flag)
    return i === -1 ? dflt : process.argv[i + 1]
}
const iterations = Number(arg("--iterations", "9"))
const warmup = Number(arg("--warmup", "2"))
const filter = arg("--filter")
const out = arg("--out")
const gc = () => {
    try {
        ;(Bun as any).gc(true)
    } catch {}
}
const median = (xs: number[]) => {
    const s = [...xs].sort((a, b) => a - b)
    return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2
}
let commit = "unknown"
try {
    commit = execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] })
        .toString()
        .trim()
} catch {}

const results = []
for (const s of scenarios) {
    if (filter && !s.name.includes(filter)) continue
    for (let i = 0; i < warmup; i++) {
        s.run()
        gc()
    }
    const samples: number[] = []
    for (let i = 0; i < iterations; i++) {
        gc()
        samples.push(s.run())
    }
    const r = {
        name: s.name,
        issue: s.issue,
        median: +median(samples).toFixed(2),
        min: +Math.min(...samples).toFixed(2),
        max: +Math.max(...samples).toFixed(2),
        iterations
    }
    results.push(r)
    console.log(
        `${r.median.toFixed(2).padStart(9)} ms  (min ${r.min.toFixed(2)}, max ${r.max.toFixed(2)})  ${r.name}${r.issue ? "  " + r.issue : ""}`
    )
}
const record = {
    commit,
    date: new Date().toISOString(),
    bun: Bun.version,
    platform: `${platform()}-${arch()}`,
    cpu: cpus()[0]?.model,
    iterations,
    warmup,
    results
}
if (out) {
    mkdirSync(dirname(out), { recursive: true })
    writeFileSync(out, JSON.stringify(record, null, 2) + "\n")
    console.log(`\nwrote ${out}`)
}
