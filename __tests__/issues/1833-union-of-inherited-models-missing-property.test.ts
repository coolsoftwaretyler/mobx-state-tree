/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/1833
 * Accessing a field of a model that inherits from another leads to a missing type error
 *
 * Status: WORKS_AS_DESIGNED
 * Summary: The reporter builds `Orange` and `Apple` with `Fruit.props({...})`, unions them with
 * `Fruit` under a dispatcher, and expects `food.seeded` to compile and be `undefined` for an
 * Apple. The instance type of `types.union(A, B, C)` is the TypeScript union of the three
 * instance types, and TypeScript only allows a property read on a union when every member has it,
 * so `seeded` (declared on Orange only) is rejected. That is plain TypeScript union semantics, not
 * an MST typing defect; the error text "does not exist on type" for a union lists the common
 * properties, which looks like an intersection. At run time Apple instances simply have no `seeded`
 * key, so the read returns undefined. Narrowing with `"seeded" in food`, or a discriminating literal
 * field, compiles and is the supported way to read member-specific props. The docs could
 * mention narrowing for unions of models that share a base; no typing change is wanted.
 */
import { test, expect, describe } from "bun:test"
import { types, Instance } from "../../src"

type Expect<T extends true> = T
type Equal<A, B> =
    (<X>() => X extends A ? 1 : 2) extends <X>() => X extends B ? 1 : 2 ? true : false

const Fruit = types.model("Fruit", {
    name: types.string,
    kind: types.string
})
const Orange = Fruit.props({ seeded: types.boolean })
const Apple = Fruit.props({ crisp: types.boolean })

const Food = types.union(
    {
        dispatcher: snapshot =>
            snapshot.kind === "orange" ? Orange : snapshot.kind === "apple" ? Apple : Fruit
    },
    Fruit,
    Orange,
    Apple
)

type FoodInstance = Instance<typeof Food>

// the instance type is the union of the member instance types
export type FoodIsUnionOfMembers = Expect<
    Equal<FoodInstance, Instance<typeof Fruit> | Instance<typeof Orange> | Instance<typeof Apple>>
>

const Root = types.model("Root", { food: Food })

describe("1833 - property that exists on one member of a union of inherited models", () => {
    test("a property read that is not on every union member is rejected by the compiler", () => {
        const root = Root.create({ food: { name: "navel", kind: "orange", seeded: false } })
        const food: FoodInstance = root.food
        // @ts-expect-error by design: TypeScript only allows common properties on a union
        expect(food.seeded).toBe(false)
    })

    test("the property is simply absent at run time on the other members", () => {
        const root = Root.create({ food: { name: "gala", kind: "apple", crisp: true } })
        expect("seeded" in root.food).toBe(false)
    })

    test("narrowing with `in` gives access to the member-specific property", () => {
        const orange = Root.create({ food: { name: "navel", kind: "orange", seeded: true } })
        const apple = Root.create({ food: { name: "gala", kind: "apple", crisp: true } })

        const seededOf = (food: FoodInstance) => ("seeded" in food ? food.seeded : undefined)

        expect(seededOf(orange.food)).toBe(true)
        expect(seededOf(apple.food)).toBeUndefined()
    })
})
