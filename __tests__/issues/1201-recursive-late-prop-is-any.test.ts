/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/1201
 * Improving Typescript usability?
 *
 * Status: WORKS_AS_DESIGNED
 * Summary: The thread is a broad wish list (slow inference, cryptic errors, generator typing,
 * read-only instances, codegen). The one concrete, reproducible complaint with code is "circular
 * references in structure need casts sprinkled at all use sites". With the documented recursive
 * form `types.maybe(types.late((): IAnyModelType => Node))`, the self-referencing prop `me`
 * is typed `any` (no checking on `node.me!.nonexistent`), while sibling props such as `x` stay
 * strongly typed. docs/tips/circular-deps.md says exactly this ("while 'me' will become any ...
 * you can typecast the self referencing properties once more") and gives the cast as the
 * workaround; maintainers called it a TypeScript limitation (label "can't fix"). The test pins that
 * behavior. Docs could change: the example there reads `node.((me) as Instance<typeof Node>).x`,
 * which is not valid TypeScript and should be `(node.me as Instance<typeof Node>).x`.
 * Not reproduced here: `self.otherAction()` inside the same actions block (not typed; the thread's
 * answer is `this`, which docs/concepts/actions.md says not to use), generator typing and
 * the vague items.
 */
import { test, expect, describe } from "bun:test"
import { types, Instance, IAnyModelType } from "../../src"

type Expect<T extends true> = T
type Equal<A, B> =
    (<X>() => X extends A ? 1 : 2) extends <X>() => X extends B ? 1 : 2 ? true : false

const Node = types.model("Node", {
    x: 5,
    me: types.maybe(types.late((): IAnyModelType => Node))
})

const node = Node.create({ x: 1, me: { x: 2 } })

// documented: other props stay strongly typed, the self referencing prop becomes any
export type XIsNumber = Expect<Equal<typeof node.x, number>>
export type MeIsAny = Expect<Equal<typeof node.me, any>>

// the documented workaround: cast once at the use site
const typedMe = node.me as Instance<typeof Node> | undefined
export type CastXIsNumber = Expect<Equal<NonNullable<typeof typedMe>["x"], number>>

describe("1201 - recursive props declared with types.late", () => {
    test("the recursive prop works at runtime and needs a cast to be typed", () => {
        expect(node.x).toBe(1)
        expect(typedMe!.x).toBe(2)
        expect(typedMe!.me).toBeUndefined()
    })
})
