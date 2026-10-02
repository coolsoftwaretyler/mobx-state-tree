/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/1640
 * `cast` TS error when `types.array` sub-type has reference
 *
 * Status: ALREADY_FIXED
 * Fixed by: 3a2945db (#2199, 2024)
 * Summary: `self.entities = cast(entities)`, where `entities` is an array of instances of a model
 * that has a `types.reference` property, used to fail with "... is not assignable to type
 * 'ReferenceIdentifier'" while the same `cast` worked for a model without references. On current
 * source the reporter's code compiles (no @ts-expect-error needed) and runs.
 */
import { test, expect, describe } from "bun:test"
import { cast, Instance, types } from "../../src"

const Reference = types.model("Referense", {
    id: types.identifier,
    name: types.string
})

interface IReference extends Instance<typeof Reference> {}

const Entity = types.model("Entity", {
    id: types.identifier,
    name: types.string,
    ref: types.reference(Reference)
})

interface IEntity extends Instance<typeof Entity> {}

const RootModel = types
    .model("Store", {
        entities: types.array(Entity),
        references: types.array(Reference)
    })
    .actions(self => ({
        setReferences(references: IReference[]) {
            // no references in the `Reference` model
            // so it works correctly
            self.references = cast(references)
        },
        setEntities(entities: IEntity[]) {
            // `Entity` model has a reference, this used to be a type error
            self.entities = cast(entities)
        }
    }))

describe("1640 - cast of an array whose sub-type has a reference", () => {
    test("assigning cast instance arrays works and references resolve", () => {
        const store = RootModel.create()
        store.setReferences([Reference.create({ id: "r1", name: "First" })])
        store.setEntities([Entity.create({ id: "e1", name: "Entity", ref: "r1" })])

        expect(store.entities).toHaveLength(1)
        expect(store.entities[0].ref).toBe(store.references[0])
        expect(store.entities[0].ref.name).toBe("First")
    })
})
