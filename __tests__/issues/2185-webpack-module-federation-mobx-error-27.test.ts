/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/2185
 * Mobx/Mobx-state-tree doesnt work in module federation of Webpack.
 *
 * Status: CANNOT_REPRODUCE
 * Summary: The reporter's MST store (Todo/User/RootStore) throws a minified MobX error 27 and
 * "users property is declared twice" only when bundled as a Webpack module-federation remote and
 * loaded into a Vue2 + Webpack host. The reporter supplied no repository, and the thread has no
 * trigger outside the bundler. The store code from the thread runs fine under bun with the
 * current source (checked once while triaging, not kept as a test since it passes trivially).
 * Webpack is not installed here and must not be installed. Most likely cause is two MobX or MST
 * module instances in the federated runtime (shared singleton not configured); unconfirmed.
 */
import { test } from "bun:test"

test.todo(
    "2185: needs a Webpack module-federation remote + host repro (webpack, host app, build config, and whether mobx/mobx-state-tree are declared as shared singletons)",
    () => {}
)
