/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/1547
 * Destroying a model with a preprocessor that returns a new object triggers onSnapshot
 *
 * Status: WORKS_AS_DESIGNED
 * Summary: The reporter's sandbox is not available, so this is rebuilt from the title and the note that
 * returning the input snapshot avoids the problem. With types.maybe(snapshotProcessor(...)) and a
 * preProcessor that returns a new object ({ ...sn }), the preProcessor turns undefined into {}, which is a
 * valid Todo snapshot, so SnapshotProcessor.is(undefined) is true and the union built by maybe() picks the
 * processed type before the undefined literal. The result is { todo: {} } for create({}), create({ todo:
 * undefined }), assigning undefined and destroy alike; destroy is not special. After destroy the existing node
 * is reconciled in place, so store.todo is still the same instance with an empty snapshot, not a fresh Todo.
 * The reporter expected the field to stay undefined; the documented rule is that is() / validation of a
 * snapshotProcessor type means "valid after preProcessing" (see the SnapshotProcessor.is doc comment), and
 * a preProcessor that should leave undefined alone must pass undefined through. No library behavior change
 * is implied; a docs note on types.snapshotProcessor / types.maybe would help (preProcessor must pass
 * undefined through when used under maybe()/optional()).
 */
import { test, expect, describe } from "bun:test"
import { types, destroy, onSnapshot, unprotect, getSnapshot } from "../../src"

const TodoModel = types.model({ text: types.maybe(types.string) })

describe("1547 - destroying a maybe(snapshotProcessor) child", () => {
    test("preProcessor returning a new object turns undefined into {}: create, assign and destroy agree", () => {
        const Todo = types.snapshotProcessor(TodoModel, {
            preProcessor(sn) {
                return { ...sn }
            }
        })
        const Store = types.model({ todo: types.maybe(Todo) })

        expect(getSnapshot(Store.create({}))).toEqual({ todo: { text: undefined } })
        expect(getSnapshot(Store.create({ todo: undefined }))).toEqual({
            todo: { text: undefined }
        })

        const assigned = Store.create({ todo: { text: "a" } })
        unprotect(assigned)
        assigned.todo = undefined
        expect(getSnapshot(assigned)).toEqual({ todo: { text: undefined } })

        const store = Store.create({ todo: { text: "a" } })
        unprotect(store)
        const old = store.todo
        const snapshots: unknown[] = []
        onSnapshot(store, sn => snapshots.push(sn))

        destroy(store.todo!)

        expect(getSnapshot(store)).toEqual({ todo: { text: undefined } })
        expect(snapshots).toEqual([{ todo: { text: undefined } }])
        // the existing node is reconciled in place, not replaced by a fresh Todo
        expect(store.todo).toBe(old)
    })

    test("preProcessor returning its input: destroy leaves the field undefined", () => {
        const Todo = types.snapshotProcessor(TodoModel, {
            preProcessor(sn) {
                return sn
            }
        })
        const Store = types.model({ todo: types.maybe(Todo) })
        const store = Store.create({ todo: { text: "a" } })
        unprotect(store)
        const snapshots: unknown[] = []
        onSnapshot(store, sn => snapshots.push(sn))

        destroy(store.todo!)

        expect(store.todo).toBeUndefined()
        expect(getSnapshot(store)).toEqual({ todo: undefined })
        expect(snapshots).toEqual([{ todo: undefined }])
    })
})
