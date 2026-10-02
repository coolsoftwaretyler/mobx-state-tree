/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/1745
 * Instance node can't be used to instantiate a reference
 *
 * Status: WORKS_AS_DESIGNED
 * Summary: The reporter copies the `castToReferenceSnapshot` JSDoc example (ModelA instance `a`,
 * ModelB instance `b` created with `refA: castToReferenceSnapshot(a)`) and expects
 * `console.log(b.refA.n)` to print 5. It throws "Failed to resolve reference 'someId'" instead,
 * because `a` is the root of its own tree and references only resolve through the referencing
 * node's root identifierCache. That is the documented rule: docs/overview/types.md line 66 says a
 * reference targets an item "somewhere in the same tree", and docs/concepts/references.md line 69
 * says references "are looked up through the entire tree". Cross-tree resolution is not supported.
 * The actual defect is the `castToReferenceSnapshot` JSDoc example in src/core/mst-operations.ts
 * (around lines 988 to 1006, mirrored in docs/API), which should either put `a` and `b` in the
 * same tree or say the target must share the referencing node's tree.
 */
import { test, expect, describe } from "bun:test"
import { types, castToReferenceSnapshot } from "../../src"

const ModelA = types
    .model({
        id: types.identifier,
        n: types.number
    })
    .actions(self => ({
        setN(aNumber: number) {
            self.n = aNumber
        }
    }))

const ModelB = types.model({
    refA: types.reference(ModelA)
})

describe("1745 - instance node used to instantiate a reference", () => {
    test("creating the referencing model from an instance does not throw", () => {
        const a = ModelA.create({ id: "someId", n: 5 })
        const b = ModelB.create({ refA: castToReferenceSnapshot(a) })
        expect(b).toBeDefined()
    })

    test("the reference does not resolve across separate trees", () => {
        const a = ModelA.create({ id: "someId", n: 5 })
        const b = ModelB.create({ refA: castToReferenceSnapshot(a) })
        expect(() => b.refA).toThrow(/Failed to resolve reference 'someId'/)
    })

    test("the reference resolves when the instance lives in the same tree", () => {
        const Root = types.model({
            a: ModelA,
            b: ModelB
        })
        const root = Root.create({
            a: { id: "someId", n: 5 },
            b: { refA: "someId" }
        })
        expect(root.b.refA.n).toBe(5)
    })
})
