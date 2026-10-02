/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/2216
 * TypeScript does not recognize overriding mandatory property with optional one in sub-model
 *
 * Status: REPRODUCES
 * Summary: `InputStore` declares `error` as a required `types.union(ErrorStore, NoDisplayError)`;
 * `InputStore.props({ error: types.optional(<same union>, () => ErrorStore.create({})) })` overrides it
 * with an optional prop and `create({})` works at runtime. The type of `.props` is the plain
 * intersection `PROPS & NEW_PROPS`, so the creation type of `error` is the intersection of a required and
 * an optional prop, which stays required, and `PasswordInputStore.create({})` does not compile
 * (TS2345, "Property 'error' is missing"). The fix `Omit<PROPS, keyof PROPS2> & PROPS2` shipped in
 * #2218 (96f2e469) and was reverted in #2234 (f8bb1472) because of "excessively deep" instantiation
 * (#2230). Same root cause as #1403 and #2253.
 */
import { test, expect, describe } from "bun:test"
import { types, getSnapshot } from "../../src"

const ErrorStore = types
    .model("ErrorStore", {
        value: ""
    })
    .actions(self => ({
        set(value: string) {
            self.value = value
        },
        reset() {
            self.value = ""
        }
    }))
    .views(self => ({
        get formattedValue() {
            return self.value
        }
    }))

const NoDisplayError = ErrorStore.named("NoDisplayError").views(() => ({
    get formattedValue() {
        return undefined
    }
}))

const InputStore = types.model("InputStore", {
    value: "",
    // developer should explicitly specify whether validation errors should be displayed or not
    error: types.union(ErrorStore, NoDisplayError)
})

const PasswordInputStore = InputStore.named("PasswordInputStore").props({
    // we have strict requirements for password, so validation errors should be displayed by default
    error: types.optional(types.union(ErrorStore, NoDisplayError), () => ErrorStore.create({}))
})

describe("2216 - overriding a required prop with an optional one via .props", () => {
    test("the base model still requires `error`", () => {
        // @ts-expect-error `error` is required on InputStore, so omitting it must be rejected
        expect(() => InputStore.create({})).toThrow()
    })

    test("the sub-model can be created without the overridden prop", () => {
        // @ts-expect-error BUG #2216: `error` is optional on PasswordInputStore but its creation type still requires it
        const passwordS = PasswordInputStore.create({})
        expect(getSnapshot(passwordS)).toEqual({ value: "", error: { value: "" } })
        expect(passwordS.error.formattedValue).toBe("")
    })
})
