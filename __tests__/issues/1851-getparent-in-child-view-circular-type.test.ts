/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/1851
 * getParent not useable in child view with TypeScript when adding actions to parent
 *
 * Status: REPRODUCES
 * Summary: A child model's view calls `getParent<typeof Parent>(self)` while the parent model
 * (which has an action) lists the child in its props. The reporter expects the parent type to be
 * usable; instead TypeScript reports a circular inference (TS7022 and TS2615 on the `Parent`
 * declaration line, TS7023 on the view) and `Parent`, and so its instances, collapse to `any`.
 * The reporter's linked repo is not in the thread; this is the closest reconstruction, and in it
 * the cycle exists with or without actions on the parent, so the "only with actions" part of the
 * report did not reproduce.
 *
 * Cause: MST's part in the cycle is not yet identified. It is not in getParent's signature:
 * `getParent(self) as Instance<typeof Parent>` and `getParent<Instance<typeof Parent>>(self)` give
 * the same TS7022/TS7023/TS2615 errors. Only the extra TS2615 errors are traced so far: they name
 * `Pick<ModelInstanceType<...>, "parentTitle">`, and the only such Pick in src is WritableKeys
 * (`IsFullyWritable<Pick<T, K>>`), used by ExcludeReadonly in IType.create (src/core/type/type.ts
 * ~lines 43, 93, 118). Patching `create` to not use it removes TS2615 but leaves TS7022/TS7023.
 * #1157 and #1463 share that TS2615/ExcludeReadonly symptom only, not the circular inference.
 * Simplified analogs of this shape typecheck cleanly on TS 5.7.2, so this is not just a plain
 * TypeScript limitation. An explicit return type on the view avoids the cycle (control below), so
 * there is a user-side workaround.
 *
 * Each @ts-expect-error below goes unused, and typecheck fails, once the cycle is resolved.
 */
import { test, expect } from "bun:test"
import { types, getParent } from "../../src"

type Expect<T extends true> = T
type Equal<A, B> =
    (<X>() => X extends A ? 1 : 2) extends <X>() => X extends B ? 1 : 2 ? true : false

const Child = types.model("Child", { name: types.string }).views(self => ({
    // @ts-expect-error BUG #1851: TS7023 circular return type, getParent<typeof Parent> is any
    get parentTitle() {
        return getParent<typeof Parent>(self).title
    }
}))

// @ts-expect-error BUG #1851: TS7022 Parent implicitly has type 'any' (cycle through Child's view)
const Parent = types
    .model("Parent", {
        title: types.string,
        child: Child
    })
    .actions(self => ({
        setTitle(title: string) {
            self.title = title
        }
    }))

const parent = Parent.create({ title: "p", child: { name: "c" } })

// @ts-expect-error BUG #1851: Parent instances should keep their model type, but are any
export type ParentTitleIsString = Expect<Equal<typeof parent.title, string>>

// Control: the same shape with an explicit return type on the view typechecks and keeps types.
const AnnotatedChild = types.model("AnnotatedChild", { name: types.string }).views(self => ({
    get parentTitle(): string {
        return getParent<typeof AnnotatedParent>(self).title
    }
}))

const AnnotatedParent = types
    .model("AnnotatedParent", { title: types.string, child: AnnotatedChild })
    .actions(self => ({
        setTitle(title: string) {
            self.title = title
        }
    }))

const annotatedParent = AnnotatedParent.create({ title: "p", child: { name: "c" } })

export type AnnotatedParentTitleIsString = Expect<Equal<typeof annotatedParent.title, string>>

test("control: an annotated view keeps the parent type and works at runtime", () => {
    expect(annotatedParent.child.parentTitle).toBe("p")
})

test("getParent in the child view works at runtime", () => {
    expect(parent.child.parentTitle).toBe("p")
    parent.setTitle("q")
    expect(parent.child.parentTitle).toBe("q")
})
