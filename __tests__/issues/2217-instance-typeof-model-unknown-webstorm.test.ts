/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/2217
 * got 「unknown」 type when using Instance<typeof SomeModel>
 *
 * Status: CANNOT_REPRODUCE
 * Summary: The reporter shows two screenshots (not recoverable) of models, one where
 * `Instance<typeof Model>` resolves and one where it shows `unknown`. The maintainer could not
 * reproduce, and the thread narrows it to the editor: the same code resolves correctly in VS Code
 * (tsserver) but not in WebStorm, so the likely cause is the IDE's language service (other language
 * server, tsconfig not loaded, or a different TypeScript version), not mobx-state-tree typings. The
 * second model definition never appears as text. Under the repo's tsc (TypeScript 5.7) the common
 * definition styles all resolve, as pinned below, which is the only part that can be built here.
 */
import { test, expect, describe } from "bun:test"
import { types, Instance } from "../../src"

type Expect<T extends true> = T
type Equal<A, B> =
    (<X>() => X extends A ? 1 : 2) extends <X>() => X extends B ? 1 : 2 ? true : false

describe("2217 - Instance<typeof Model> resolves to unknown", () => {
    test("control: under tsc, Instance<typeof Model> is not unknown for common definition styles", () => {
        const Plain = types.model("Plain", { name: types.string })
        const WithActions = types
            .model("WithActions", { count: types.number })
            .views(self => ({
                get double() {
                    return self.count * 2
                }
            }))
            .actions(self => ({
                inc() {
                    self.count++
                }
            }))

        type _PlainNotUnknown = Expect<
            Equal<unknown extends Instance<typeof Plain> ? true : false, false>
        >
        type _ActionsNotUnknown = Expect<
            Equal<unknown extends Instance<typeof WithActions> ? true : false, false>
        >

        const a: Instance<typeof WithActions> = WithActions.create({ count: 2 })
        a.inc()
        expect(a.double).toBe(6)
        expect(Plain.create({ name: "x" }).name).toBe("x")
    })

    test.todo(
        "2217: need the text of the second model definition (screenshot only) and the WebStorm/TypeScript service versions, to check whether any definition yields unknown under tsc",
        () => {}
    )
})
