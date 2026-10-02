/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/1631
 * `types.Date` expects a number in postProcessSnapshot
 *
 * Status: WORKS_AS_DESIGNED
 * Summary: The reporter (screenshot only, not recoverable) writes a `postProcessSnapshot` that treats
 * the `types.Date` property as a `Date` and gets a TypeScript error because the callback parameter
 * types it as `number`. `types.Date` is declared `IType<number | Date, number, Date>`: the snapshot of a
 * Date is its unix-millisecond timestamp (`DatePrimitive.getSnapshot` returns `getTime()` in
 * src/types/primitives.ts), so the typing matches what the callback receives at runtime. Snapshots
 * are meant to be plain serializable data. The `Date` form exists only on the instance and as an
 * accepted creation value. Docs (docs/API/index.md `types.Date`, docs/overview/types.md) never state the
 * snapshot form; adding "its snapshot is the unix millisecond timestamp" there would address this. The
 * rule is stated only by the `IType` signature. A real fix would be a snapshot-shape change, not a bug fix.
 * Caveat: the exact code in the reporter's screenshot is unavailable, so this pins the rule rather than
 * the reporter's literal line.
 */
import { test, expect, describe } from "bun:test"
import { types, getSnapshot, SnapshotOut } from "../../src"

type Expect<T extends true> = T
type Equal<A, B> =
    (<X>() => X extends A ? 1 : 2) extends <X>() => X extends B ? 1 : 2 ? true : false

describe("1631 - types.Date snapshot is a number in postProcessSnapshot", () => {
    test("the postProcessSnapshot parameter is typed and delivered as a number timestamp", () => {
        let received: unknown

        const Log = types.model({ at: types.Date }).postProcessSnapshot(snapshot => {
            // The type of `snapshot.at` is `number`, matching the runtime value
            type _SnapshotAtIsNumber = Expect<Equal<typeof snapshot.at, number>>
            received = snapshot.at
            return { at: new Date(snapshot.at).toISOString() }
        })

        const log = Log.create({ at: new Date(86400000) })

        // The user can convert the number into another form, which also changes the snapshot type
        type _OutAtIsString = Expect<Equal<SnapshotOut<typeof Log>["at"], string>>
        expect(getSnapshot(log)).toEqual({ at: "1970-01-02T00:00:00.000Z" })
        expect(typeof received).toBe("number")
        expect(received).toBe(86400000)
    })

    test("the instance value is a Date, only the snapshot is a number", () => {
        const Log = types.model({ at: types.Date })
        const log = Log.create({ at: new Date(5) })

        expect(log.at).toBeInstanceOf(Date)
        expect(getSnapshot(log).at).toBe(5)
    })
})
