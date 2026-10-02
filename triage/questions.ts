import { choice, noul, score } from "@typesafe-ai/sdk"

export const SCHEMA_VERSION = "v4"

export const MAINTAINER_POLICY = `
mobx-state-tree is a mature, long-lived state management library. Maintainer policy, from CONTRIBUTING.md and the current maintainers:
- Stability over new features. The public API is already extensive and must stay 100% backward compatible. New features rank below bug fixes, TypeScript fixes, and performance fixes.
- New functionality is encouraged to live in third-party libraries or the separate mst-middlewares package rather than expanding the core API.
- Every change needs tests. Changes that would alter existing public behavior or API incompatibly are not accepted in the current major version.
- Goals right now: fix real runtime bugs, fix TypeScript inference and declaration problems, fix performance and memory problems, implement small feature requests that fit this vision, and close issues that are stale or no longer actionable.
`.trim()

export const questions = {
    disposition: choice(
        "Read `issue` (title, body, and the comment thread with each commenter's role) in light of `maintainer_policy`. What kind of issue is this? Judge the content of the request, not whether it is old or still active.",
        {
            usage_question: {
                covers: "The reporter asks how to accomplish something and the library already supports it as documented",
                excludes:
                    "Reports that the documented way does not work, or that documentation is missing or wrong",
                examples: [
                    "How do I model dynamic keys?",
                    "Should stores be created eagerly or lazily?"
                ]
            },
            docs_only: {
                covers: "The library behaves correctly and the fix is to add, correct, or clarify documentation, API docs, or examples",
                excludes:
                    "Pure how-do-I questions where the docs already answer it; defects in behavior or types",
                examples: [
                    "Missing docs for types.lazy",
                    "API docs render incorrectly",
                    "Example in the async actions guide does not compile"
                ]
            },
            typescript_defect:
                "Runtime behavior is correct, but TypeScript inference or declared types are wrong, too loose, or collapse to never, any, or unknown",
            runtime_bug: {
                covers: "Observable incorrect runtime behavior under documented usage: wrong values, unexpected errors, hooks misfiring, reflection returning the wrong type",
                excludes: "Requests to change behavior that is working as documented or intended",
                note: "Still a bug even if fixing it changes what users currently see"
            },
            performance_or_memory: "Behavior is correct but unacceptably slow or memory hungry",
            feature_api_neutral: {
                covers: "An improvement that adds nothing to the public API and changes no existing intended behavior: new warnings or diagnostics for cases that are silent today, performance or internal work, or opt-in behavior behind a flag whose default keeps today's behavior",
                excludes:
                    "Rewording existing error messages or warnings, changing defaults, new public functions, types, or combinators"
            },
            feature_new_api:
                "A requested capability that would add new public functions, types, type combinators, or options",
            breaking_change_proposal: {
                covers: "A proposal to change behavior that is intended, documented, or long relied upon: defaults, public signatures, snapshot or patch shapes, the wording of existing error messages or warnings, or an RFC that rethinks a core concept",
                excludes:
                    "Fixing behavior that is wrong under documented usage; adding new warnings, options, or opt-in behavior; purely additive API"
            },
            infra_chore:
                "Build tooling, linting, packaging, release process, CI, or dependency work with no user-facing behavior change",
            other: "None of the above fit well"
        }
    ),

    root_module: choice(
        "Based on `issue`, which area of the mobx-state-tree codebase is most likely responsible for the behavior discussed?",
        {
            model: "types.model: properties, views, actions, volatile, compose, named, preProcessSnapshot and postProcessSnapshot on models",
            array: "types.array and array reconciliation, splice, push, replacement",
            map: "types.map, put, keys, identifier-keyed maps",
            reference: "types.reference, types.safeReference, onInvalidated, resolving identifiers",
            identifier: "types.identifier, identifierNumber, identifier cache, resolveIdentifier",
            union: "types.union, dispatcher, eager union evaluation, maybeNull inside unions",
            snapshot_processor: "types.snapshotProcessor and its preProcessor and postProcessor",
            optional_maybe: "types.optional, types.maybe, types.maybeNull, default values",
            late_lazy: "types.late and types.lazy, circular model definitions",
            refinement_custom_enum:
                "types.refinement, types.custom, types.enumeration, types.frozen, types.literal, types.Date",
            actions_flow:
                "actions, flow generators, async actions, applyAction, onAction, recordActions, decorate",
            middleware:
                "addMiddleware, createActionTrackingMiddleware, createActionTrackingMiddleware2, mst-middlewares",
            patches_snapshots:
                "onPatch, applyPatch, onSnapshot, applySnapshot, getSnapshot, JSON patch semantics",
            tree_operations:
                "walk, getPath, getPathParts, resolvePath, getRelativePath, tryResolve, clone, getMembers, getPropertyMembers and other tree traversal helpers",
            mobx_interop:
                "interaction with MobX itself: observe, reaction, computed, autorun, MobX version compatibility, observable typing",
            node_lifecycle:
                "node creation and death, afterCreate, afterAttach, beforeDestroy, destroy, detach, isAlive, getRoot, getParent, environments, liveliness checking",
            type_checker:
                "typecheck, runtime type checking, production mode checks, error formatting",
            react_integration:
                "interaction with React, mobx-react, observer, StrictMode, React DevTools",
            build_packaging:
                "bundling, package exports, module formats, dependencies, linting, tests infrastructure",
            docs_site: "documentation website, API docs generation, examples",
            unknown: "Cannot tell from the thread"
        }
    ),

    has_reproduction: noul(
        "The `issue` thread includes runnable code, a sandbox or repository link, or exact numbered steps that reproduce the problem.",
        {
            true: "A code sample, sandbox link, repo link, or precise steps are present",
            false: "Only prose description, or the code shown is not enough to reproduce"
        }
    ),
    proposes_concrete_fix: noul(
        "Someone in the `issue` thread proposes a specific implementation, patch, or opens a pull request for this issue.",
        {
            true: "A concrete code-level proposal or PR link appears",
            false: "Only the problem or a vague wish is described"
        }
    ),
    thread_already_resolved: noul(
        "The originally reported problem in `issue` has been fixed: a maintainer states a fix for it shipped, or the reporter confirms the original problem no longer occurs on a current version.",
        {
            true: "A shipped fix or confirmed disappearance of the original problem itself",
            false: "No such statement; a workaround, a fix for a different regression, a closing thanks, or the problem restated as present do not count"
        }
    ),
    has_workaround: noul(
        "A usable workaround for the reported problem is described in the `issue` thread.",
        {
            true: "Someone posts code or steps that avoid the problem without a library change",
            false: "No workaround, or only a suggestion that something might work"
        }
    ),
    others_affected: noul(
        "People other than the original reporter say in `issue.comments` that they hit the same problem or want the same change.",
        {
            true: "At least one other person reports the same need or problem",
            false: "Only the reporter, or only maintainers discussing it"
        }
    ),
    external_cause: noul(
        "The root cause discussed in `issue` lies outside mobx-state-tree itself, for example in MobX, React, a bundler, a test runner, or the reporter's own code.",
        {
            true: "Evidence points to another library, tool, or user error",
            false: "Evidence points to mobx-state-tree's own code or types"
        }
    ),
    maintainer_declined: noul(
        "A commenter with role maintainer in `issue.comments` has said this will not be done, is by design, or is out of scope for the core library.",
        {
            true: "A maintainer explicitly declined or deferred to userland",
            false: "No maintainer declined, or maintainers expressed interest"
        }
    ),
    blocked_on_info: noul(
        "A maintainer asked the reporter for more information or a reproduction in `issue.comments` and no adequate answer followed.",
        {
            true: "Request for info or repro is the last substantive maintainer message and went unanswered",
            false: "No such request, or it was answered"
        }
    ),
    asks_to_change_documented_behavior: noul(
        "The `issue` asks for behavior that is currently documented or intentional to work differently, rather than reporting that something fails to work as documented.",
        {
            true: "The current behavior is acknowledged as intended or documented and the request is to change it",
            false: "The request is to make the library do what it already claims to do, or to add something new without changing existing behavior"
        }
    ),
    reporter_is_frustrated_or_blocked: noul(
        "The reporter or other users in `issue` describe being blocked in production or express significant frustration.",
        {
            true: "Mentions of production impact, being blocked, or strong frustration",
            false: "Neutral tone, curiosity, or minor inconvenience"
        }
    ),

    severity: score(
        "If the problem described in `issue` is real, how severe is its impact on users of the library?",
        [
            "Cosmetic, or affects only an unusual edge case; no practical impact on real applications",
            "Inconvenient; a straightforward workaround exists and is mentioned or obvious",
            "Blocks a common usage pattern; workaround is awkward, incomplete, or undocumented",
            "Causes crashes, data loss, silent data corruption, or unbounded memory growth with no workaround"
        ]
    ),
    vision_fit: score("How well does acting on `issue` fit `maintainer_policy`?", [
        "Contradicts the policy: expands the public API substantially, trades stability for novelty, or requires a breaking change",
        "Neutral: a reasonable idea that neither advances nor conflicts with the policy, best left to userland",
        "Fits: improves correctness, types, performance, docs, or ergonomics without meaningfully expanding public API",
        "Directly advances the policy: fixes a real defect, type error, or performance problem in an existing feature"
    ])
}
