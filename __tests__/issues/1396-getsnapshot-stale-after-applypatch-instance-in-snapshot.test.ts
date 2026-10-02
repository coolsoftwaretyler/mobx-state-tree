/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/1396
 * getSnapshot returning inconsistent results
 *
 * Status: REPRODUCES
 * Summary: A Product instance created with Product.create() is placed in the snapshot of a nested
 * Cart (via an optional() default factory, and equally via a plain create() argument). After
 * applyPatch changes the product price through the root, getSnapshot(root) still reports the old
 * price while getSnapshot(root.cart.products) and the live instance report the new one. Direct
 * property assignment, or touching root.cart before patching, gives correct snapshots; the stale
 * value comes from the cached initial snapshot of the not-yet-instantiated ancestor nodes.
 */
import { test, expect, describe } from "bun:test"
import { types, getSnapshot, applyPatch } from "../../src"

const Product = types.model("Product", {
    price: 0,
    id: types.identifier
})

const Cart = types.model("Cart", {
    products: types.array(Product)
})

describe("1396 - getSnapshot after applyPatch with an instance inside the creation snapshot", () => {
    test.failing(
        "reporter repro: root snapshot reflects patched price (optional default factory)",
        () => {
            const UserStore = types.model("Store", {
                user: "Some User",
                cart: types.optional(Cart, () =>
                    Cart.create({
                        products: [Product.create({ price: 1, id: "111" })]
                    })
                )
            })
            const userStore = UserStore.create()
            expect(getSnapshot(userStore).cart.products[0]).toEqual({ price: 1, id: "111" })

            applyPatch(userStore, { op: "replace", path: "/cart/products/0/price", value: 2 })

            expect(getSnapshot(userStore).cart.products[0].price).toBe(2)
        }
    )

    test.failing("reduced: instance passed straight into the create snapshot", () => {
        const Store = types.model({ cart: Cart })
        const store = Store.create({
            cart: { products: [Product.create({ price: 1, id: "111" })] }
        })

        applyPatch(store, { op: "replace", path: "/cart/products/0/price", value: 2 })

        expect(getSnapshot(store).cart.products[0].price).toBe(2)
    })

    test("the live instance and the products snapshot are already correct", () => {
        const Store = types.model({ cart: Cart })
        const store = Store.create({
            cart: { products: [Product.create({ price: 1, id: "111" })] }
        })

        applyPatch(store, { op: "replace", path: "/cart/products/0/price", value: 2 })

        expect(store.cart.products[0].price).toBe(2)
        expect(getSnapshot(store.cart.products)[0].price).toBe(2)
    })

    test("same flow with plain snapshots instead of instances is consistent", () => {
        const Store = types.model({ cart: Cart })
        const store = Store.create({ cart: { products: [{ price: 1, id: "111" }] } })

        applyPatch(store, { op: "replace", path: "/cart/products/0/price", value: 2 })

        expect(getSnapshot(store).cart.products[0].price).toBe(2)
    })
})
