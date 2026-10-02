/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/1648
 * My model returns fields as null, if I created model fields with types.maybeNull and use model in
 * types.union
 *
 * Status: WORKS_AS_DESIGNED
 * Summary: The reporter unions `SingleFilter` (every field `types.maybeNull`) with a `types.late`
 * `GroupFilter`, creates a store from a nested group snapshot, and gets
 * `{ field: null, operator: null, value: null }` instead of the group. An eager union
 * (the default) uses the first member whose `is(snapshot)` passes, and a model ignores unknown keys,
 * so a model whose properties are all optional accepts any plain object. SingleFilter therefore
 * always wins and the `filters` / `condition` keys are dropped. docs/overview/types.md (the
 * `types.union` entry) says the first matching type is used when `eager` is true and that a
 * dispatcher is needed when the type cannot be inferred unambiguously from a snapshot; the
 * reporter's observation that it works once `maybeNull` is removed is the same rule (required
 * fields stop SingleFilter from matching). No behavior change is wanted. The docs could add a line
 * that a model with only optional properties matches any object, so it should come last in a union
 * or be paired with a dispatcher.
 */
import { test, expect, describe } from "bun:test"
import { types, getSnapshot, getType, IAnyModelType, IAnyType, UnionOptions } from "../../src"

const snapshot = {
    name: "New group",
    priority: 1,
    filter: {
        filters: [
            {
                filters: [
                    { field: "chat_channel", value: "some channel", operator: "=" },
                    { field: "eq_utm_term", value: "11121", operator: "=" }
                ],
                condition: "and"
            },
            {
                filters: [{ field: "tags", value: "some tag 1", operator: "=" }],
                condition: "or"
            }
        ],
        condition: "or"
    }
}

const SingleFilter = types.model("SingleFilter", {
    field: types.maybeNull(types.string),
    operator: types.maybeNull(types.string),
    value: types.maybeNull(types.string)
})

function createGroupModel(options: { dispatcher?: boolean; eager?: boolean }) {
    const unionOptions: UnionOptions<IAnyType[]> = {}
    if (options.dispatcher) {
        unionOptions.dispatcher = (sn: any) => ("filters" in sn ? GroupFilter : SingleFilter)
    }
    if (options.eager !== undefined) unionOptions.eager = options.eager

    const GroupFilter: IAnyModelType = types.model("GroupFilter", {
        condition: types.maybeNull(types.enumeration(["and", "or"])),
        filters: types.array(
            types.union(
                unionOptions,
                SingleFilter,
                types.late((): IAnyModelType => GroupFilter)
            )
        )
    })
    return types.model("Group", {
        name: types.string,
        priority: types.number,
        filter: types.union(
            unionOptions,
            SingleFilter,
            types.late((): IAnyModelType => GroupFilter)
        )
    })
}

describe("1648 - all-optional model first in an eager union", () => {
    test("the all-optional first member matches the group snapshot and drops its data", () => {
        const Group = createGroupModel({})
        const group = Group.create(snapshot)
        expect(getType(group.filter)).toBe(SingleFilter)
        expect(getSnapshot(group).filter).toEqual({ field: null, operator: null, value: null })
    })

    test("a dispatcher selects GroupFilter and keeps the whole snapshot", () => {
        const Group = createGroupModel({ dispatcher: true })
        const group = Group.create(snapshot)
        expect(getSnapshot(group)).toEqual(snapshot)
    })

    test("a non-eager union reports the ambiguity instead of picking one member", () => {
        const Group = createGroupModel({ eager: false })
        expect(() => Group.create(snapshot)).toThrow(/No type is applicable for the union/)
    })

    test("required fields on the first member let the group snapshot fall through", () => {
        const RequiredFilter = types.model("RequiredFilter", {
            field: types.string,
            operator: types.string,
            value: types.string
        })
        const GroupOfFilters = types.model("GroupOfFilters", {
            condition: types.string,
            filters: types.array(RequiredFilter)
        })
        const Holder = types.model("Holder", {
            filter: types.union(RequiredFilter, GroupOfFilters)
        })
        const holder = Holder.create({
            filter: {
                condition: "and",
                filters: [{ field: "tags", operator: "=", value: "a" }]
            }
        })
        expect(getType(holder.filter)).toBe(GroupOfFilters)
    })
})
