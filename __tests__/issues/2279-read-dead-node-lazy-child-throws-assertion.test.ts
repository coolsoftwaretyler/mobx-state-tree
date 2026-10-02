/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/2279
 * React 19.2 dev mode breaks MST: "creation of the observable instance must be done on the
 * initializing phase"
 *
 * Status: REPRODUCES
 * Summary: React 19.2 (logComponentRender -> addObjectDiffToProperties) reads every property of a
 * component's previous props, including an MST node that was replaced (`self.menu_items =
 * cast(...)`) and is dead. Reading a dead node's property only warns, except when the property is
 * a nested model that was never accessed before the node died: that read goes through lazy
 * instantiation of a dead node and throws "assertion failed: the creation of the observable
 * instance must be done on the initializing phase", even with liveliness checking "warn" or
 * "ignore". React is not installed, so this test emulates React's traversal by reading every own
 * key of the replaced node. A reader of a dead node should get a warning at most, never an
 * internal assertion.
 */
import { test, expect, spyOn } from "bun:test"
import { types, cast, isAlive, setLivelinessChecking, getLivelinessChecking } from "../../src"

const Price = types.model("Price", {
    currency_code: types.enumeration(["GBP", "EUR"]),
    value: types.number
})
const BasketMenuItem = types.model("BasketMenuItem", {
    id: types.string,
    quantity: types.number,
    price: Price
})
const Basket = types.model("Basket", { menu_items: types.array(BasketMenuItem) }).actions(self => ({
    replaceItems(items: Array<{ id: string; quantity: number; price: any }>) {
        self.menu_items = cast(items)
    }
}))

function createDeadItem() {
    const basket = Basket.create({
        menu_items: [{ id: "a", quantity: 1, price: { currency_code: "GBP", value: 5 } }]
    })
    const item = basket.menu_items[0] // `price` is never read, so it is not instantiated yet
    basket.replaceItems([{ id: "b", quantity: 2, price: { currency_code: "EUR", value: 7 } }])
    expect(isAlive(item)).toBe(false)
    return item
}

// what React 19.2's addObjectDiffToProperties does to a prop: read each property
function readAllProperties(node: object) {
    return Object.keys(node).map(key => (node as Record<string, unknown>)[key])
}

for (const mode of ["warn", "ignore"] as const) {
    test.failing(
        `reading all properties of a replaced node does not throw (liveliness "${mode}")`,
        () => {
            const previous = getLivelinessChecking()
            const warnSpy = spyOn(console, "warn").mockImplementation(() => {})
            try {
                setLivelinessChecking(mode)
                const item = createDeadItem()

                expect(() => readAllProperties(item)).not.toThrow()
            } finally {
                setLivelinessChecking(previous)
                warnSpy.mockRestore()
            }
        }
    )
}

test("control: when the nested model was read before the node died, reading it is fine", () => {
    const warnSpy = spyOn(console, "warn").mockImplementation(() => {})
    try {
        const basket = Basket.create({
            menu_items: [{ id: "a", quantity: 1, price: { currency_code: "GBP", value: 5 } }]
        })
        const item = basket.menu_items[0]
        expect(item.price.value).toBe(5)
        basket.replaceItems([])

        expect(() => readAllProperties(item)).not.toThrow()
    } finally {
        warnSpy.mockRestore()
    }
})
