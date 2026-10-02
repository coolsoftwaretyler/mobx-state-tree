import { TypeSafeClient, RateLimitError } from "@typesafe-ai/sdk"
import { questions, MAINTAINER_POLICY, SCHEMA_VERSION } from "./questions"
import { readFileSync, writeFileSync } from "fs"

type Comment = {
    author: { login: string }
    authorAssociation: string
    body: string
    createdAt: string
}
type Issue = {
    number: number
    title: string
    body: string
    url: string
    createdAt: string
    updatedAt: string
    author: { login: string }
    labels: { name: string }[]
    comments: Comment[]
    reactionGroups: { content: string; users: { totalCount: number } }[]
}

const HERE = import.meta.dir
const DATA = process.env.ISSUES_JSON ?? `${HERE}/data/issues-2026-10-02.json`
const issues: Issue[] = JSON.parse(readFileSync(DATA, "utf8")).sort(
    (a: Issue, b: Issue) => a.number - b.number
)
const only = process.argv[2] ? new Set(process.argv[2].split(",").map(Number)) : null

const KNOWN_MAINTAINERS = new Set([
    "coolsoftwaretyler",
    "jamonholmgren",
    "mweststrate",
    "xaviergonz",
    "mattiamanzati",
    "k-g-a"
])
const assoc = new Map<string, string>()
for (const i of issues) for (const c of i.comments) assoc.set(c.author.login, c.authorAssociation)
const role = (login: string) => {
    const a = assoc.get(login)
    if (KNOWN_MAINTAINERS.has(login) || a === "MEMBER" || a === "COLLABORATOR" || a === "OWNER")
        return "maintainer"
    if (a === "CONTRIBUTOR") return "contributor"
    return "community"
}
const now = Date.now()
const years = (iso: string) => +((now - Date.parse(iso)) / (365.25 * 864e5)).toFixed(1)

function buildState(i: Issue) {
    return {
        maintainer_policy: MAINTAINER_POLICY,
        issue: {
            number: i.number,
            title: i.title,
            author: { login: i.author.login, role: role(i.author.login) },
            created: i.createdAt.slice(0, 10),
            last_activity: i.updatedAt.slice(0, 10),
            years_since_last_activity: years(i.updatedAt),
            existing_labels: i.labels.map(l => l.name),
            reactions_total: i.reactionGroups.reduce((n, g) => n + g.users.totalCount, 0),
            body: i.body || "",
            comments: i.comments.map(c => ({
                author: c.author.login,
                role: role(c.author.login),
                created: c.createdAt.slice(0, 10),
                body: c.body
            }))
        }
    }
}

const client = new TypeSafeClient()
const CONCURRENCY = 6
const targets = only ? issues.filter(i => only.has(i.number)) : issues
const out: any[] = []
let idx = 0,
    inputTokens = 0
const t0 = performance.now()
async function worker() {
    while (idx < targets.length) {
        const i = targets[idx++]
        const state = buildState(i)
        for (let attempt = 0; ; attempt++) {
            try {
                const res = await client.systemOne({ state, questions })
                inputTokens += res.usage.input_tokens
                out.push({
                    number: i.number,
                    title: i.title,
                    url: i.url,
                    labels: state.issue.existing_labels,
                    years_idle: state.issue.years_since_last_activity,
                    n_comments: i.comments.length,
                    model: res.model,
                    usage: res.usage,
                    answers: res.answers
                })
                break
            } catch (e) {
                if (e instanceof RateLimitError && attempt < 5) {
                    await new Promise(r => setTimeout(r, 1000 * 2 ** attempt))
                    continue
                }
                out.push({ number: i.number, title: i.title, error: String(e) })
                break
            }
        }
    }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker))
out.sort((a, b) => a.number - b.number)
const elapsed = Math.round(performance.now() - t0)
const run = {
    schema: SCHEMA_VERSION,
    ran_at: new Date().toISOString(),
    elapsed_ms: elapsed,
    issues: out.length,
    input_tokens: inputTokens,
    est_cost_usd: +((inputTokens / 1e6) * 0.042).toFixed(4),
    results: out
}
const stamp = new Date().toISOString().replace(/[:.]/g, "-")
writeFileSync(`${HERE}/results/run-${SCHEMA_VERSION}-${stamp}.json`, JSON.stringify(run, null, 2))
writeFileSync(`${HERE}/results/latest.json`, JSON.stringify(run, null, 2))
console.log(
    `done: ${out.length} issues, ${inputTokens} input tokens, ~$${run.est_cost_usd}, ${elapsed} ms, errors: ${out.filter(o => o.error).length}`
)
