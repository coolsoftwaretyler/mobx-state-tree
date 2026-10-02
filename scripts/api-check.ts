/**
 * Public API guard.
 *
 * Emits the library's declaration files in-process (no build, no lib/ or dist/ writes),
 * normalizes them (comments stripped, printer-formatted), and compares them with the
 * committed baseline in api/baseline/. Any difference fails the check.
 *
 *   bun run api:check            fail on any difference, print unified diffs
 *   bun run api:update           rewrite the baseline from the current source
 *
 * The baseline is the contract consumers compile against. Changing it is a deliberate,
 * reviewed act: see api/README.md for what counts as an acceptable change.
 */
import ts from "typescript"
import { mkdirSync, readdirSync, readFileSync, statSync, unlinkSync, writeFileSync } from "fs"
import { dirname, join, relative, resolve } from "path"

const ROOT = resolve(import.meta.dir, "..")
const BASELINE = join(ROOT, "api", "baseline")
const ENTRY = join(ROOT, "src", "index.ts")
const update = process.argv.includes("--update")

function emitDeclarations(): Map<string, string> {
    const configPath = ts.findConfigFile(ROOT, ts.sys.fileExists, "tsconfig.json")!
    const { config, error } = ts.readConfigFile(configPath, ts.sys.readFile)
    if (error) throw new Error(ts.flattenDiagnosticMessageText(error.messageText, "\n"))
    const parsed = ts.parseJsonConfigFileContent(config, ts.sys, ROOT)
    const options: ts.CompilerOptions = {
        ...parsed.options,
        declaration: true,
        emitDeclarationOnly: true,
        noEmit: false,
        rootDir: ROOT,
        outDir: join(ROOT, "__api_virtual__")
    }
    const out = new Map<string, string>()
    const host = ts.createCompilerHost(options)
    host.writeFile = (fileName, text) => {
        const rel = relative(join(ROOT, "__api_virtual__", "src"), fileName)
            .split("\\")
            .join("/")
        out.set(rel, text)
    }
    const program = ts.createProgram([ENTRY], options, host)
    const diags = ts.getPreEmitDiagnostics(program)
    const errors = diags.filter((d: ts.Diagnostic) => d.category === ts.DiagnosticCategory.Error)
    if (errors.length) {
        const fmt = ts.formatDiagnosticsWithColorAndContext(errors, host)
        throw new Error("TypeScript errors while emitting declarations:\n" + fmt)
    }
    program.emit(undefined, undefined, undefined, true)
    return out
}

const printer = ts.createPrinter({ removeComments: true, newLine: ts.NewLineKind.LineFeed })
function normalize(fileName: string, text: string): string {
    const sf = ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, false, ts.ScriptKind.TS)
    return (
        printer
            .printFile(sf)
            .replace(/[ \t]+$/gm, "")
            .replace(/\n{3,}/g, "\n\n")
            .trimEnd() + "\n"
    )
}

function readBaseline(): Map<string, string> {
    const out = new Map<string, string>()
    const walk = (dir: string) => {
        for (const name of readdirSync(dir)) {
            const p = join(dir, name)
            if (statSync(p).isDirectory()) walk(p)
            else if (name.endsWith(".d.ts"))
                out.set(relative(BASELINE, p).split("\\").join("/"), readFileSync(p, "utf8"))
        }
    }
    try {
        walk(BASELINE)
    } catch {}
    return out
}

function unifiedDiff(path: string, a: string, b: string): string {
    // Small LCS-based diff; files are declaration files, not huge.
    const A = a.split("\n"),
        B = b.split("\n")
    const n = A.length,
        m = B.length
    const dp: Uint32Array[] = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1))
    for (let i = n - 1; i >= 0; i--)
        for (let j = m - 1; j >= 0; j--)
            dp[i][j] = A[i] === B[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1])
    const lines: string[] = [`--- baseline/${path}`, `+++ current/${path}`]
    let i = 0,
        j = 0,
        ctx: string[] = []
    const flushCtx = () => {
        for (const c of ctx.slice(-3)) lines.push(" " + c)
        ctx = []
    }
    while (i < n || j < m) {
        if (i < n && j < m && A[i] === B[j]) {
            ctx.push(A[i])
            i++
            j++
            continue
        }
        flushCtx()
        if (j < m && (i >= n || dp[i][j + 1] >= dp[i + 1][j])) lines.push("+" + B[j++])
        else lines.push("-" + A[i++])
    }
    return lines.join("\n")
}

const current = new Map<string, string>()
for (const [path, text] of emitDeclarations()) current.set(path, normalize(path, text))

if (update) {
    for (const path of readBaseline().keys())
        if (!current.has(path)) unlinkSync(join(BASELINE, path))
    for (const [path, text] of current) {
        mkdirSync(dirname(join(BASELINE, path)), { recursive: true })
        writeFileSync(join(BASELINE, path), text)
    }
    console.log(`api baseline written: ${current.size} declaration files in api/baseline/`)
    process.exit(0)
}

const baseline = readBaseline()
if (baseline.size === 0) {
    console.error("No API baseline found. Run `bun run api:update` once and commit api/baseline/.")
    process.exit(2)
}
const problems: string[] = []
for (const [path, text] of current) {
    const base = baseline.get(path)
    if (base === undefined) problems.push(`NEW FILE (not in baseline): ${path}`)
    else if (base !== text) problems.push(unifiedDiff(path, base, text))
}
for (const path of baseline.keys())
    if (!current.has(path)) problems.push(`REMOVED FILE (in baseline, not emitted): ${path}`)

if (problems.length === 0) {
    console.log(`public API unchanged: ${current.size} declaration files match api/baseline/`)
    process.exit(0)
}
console.error(`PUBLIC API CHANGED: ${problems.length} difference(s) against api/baseline/\n`)
for (const p of problems) console.error(p + "\n")
console.error(
    "If this change is intended and allowed by api/README.md, run `bun run api:update` and commit the baseline with an explanation."
)
process.exit(1)
