/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/1760
 * Cast doesn't seem to work in combination with types.references
 *
 * Status: ALREADY_FIXED
 * Fixed by: 3a2945db (#2199, 2024)
 * Summary: The reporter calls a function taking the model's instance type from an action, passing
 * `cast(self)` to satisfy TypeScript. That works for a model without references, but fails when the
 * model has `types.reference` properties. The CodeSandbox is not in the thread, so this is rebuilt
 * from the description. The model and action below (without the bun:test part) error on the
 * `cast(self)` call when typechecked against the parent of 3a2945db, and compile on 3a2945db and
 * on current source.
 */
import { test, expect, describe } from "bun:test"
import { cast, Instance, types } from "../../src"

const Other = types.model("Other", {
    id: types.identifier
})

let received: unknown

const Model = types
    .model("Model", {
        id: types.identifier,
        other: types.reference(Other),
        others: types.array(types.reference(Other))
    })
    .actions(self => ({
        passSelf() {
            takesInstance(cast(self))
        }
    }))

interface IModel extends Instance<typeof Model> {}

function takesInstance(model: IModel) {
    received = model
}

const Root = types.model("Root", {
    others: types.array(Other),
    models: types.array(Model)
})

describe("1760 - cast(self) in a model with references", () => {
    test("an action can pass cast(self) to a function taking the instance type", () => {
        const root = Root.create({
            others: [{ id: "o1" }],
            models: [{ id: "m1", other: "o1", others: ["o1"] }]
        })
        root.models[0].passSelf()
        expect(received).toBe(root.models[0])
    })
})
