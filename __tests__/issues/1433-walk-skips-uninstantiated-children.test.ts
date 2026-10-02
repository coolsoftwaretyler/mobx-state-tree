/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/1433
 * Walk is not walking the tree
 *
 * Status: REPRODUCES
 * Summary: The reporter calls `walk(root, fn)` on a freshly created tree and expects `fn` to be
 * called for every node. Only the root is visited (the codesandbox is not in the thread, so the
 * model below is a reconstruction: a store with an array of todos, a maybe child and a maybe
 * reference).
 * The cause is visible in `walk`: it recurses on `child.storedValue`, which is `undefined` for
 * object nodes whose observable instance has not been created yet (instances are created lazily
 * on first access). Children only become visible to `walk` after something has read them.
 * Fixer trap: the reporter's own suggestion, `child.value`, creates the instance but also
 * resolves references (ReferenceType.getValue). Walking that would visit the reference target a
 * second time (a loop on cyclic references) and throw on a dangling reference, which is likely
 * why a commenter said `value` did not work for them. The assertions below therefore require
 * every node to be visited exactly once, and a dangling reference not to throw.
 */
import { test, expect, describe } from "bun:test"
import { types, walk, IAnyStateTreeNode } from "../../src"

const Todo = types.model("Todo", { id: types.identifier, title: "" })
const Store = types.model("Store", {
    todos: types.array(Todo),
    selected: types.maybe(Todo),
    favorite: types.maybe(types.reference(Todo))
})

function createStore() {
    return Store.create({
        todos: [{ id: "1" }, { id: "2" }],
        selected: { id: "3" },
        // points at todo "1", which is also reachable through `todos`
        favorite: "1"
    })
}

function collect(root: IAnyStateTreeNode) {
    const nodes: IAnyStateTreeNode[] = []
    walk(root, node => {
        nodes.push(node)
    })
    return nodes
}

describe("1433 - walk on a freshly created tree", () => {
    test.failing("visits the root and every descendant exactly once", () => {
        const store = createStore()
        const nodes = collect(store)
        // store, todos array, 2 todos, selected: the reference is not a child node to walk into
        expect(nodes).toHaveLength(5)
        expect(new Set(nodes).size).toBe(5)
    })

    test.failing("a dangling reference does not stop the walk or throw", () => {
        const store = Store.create({ todos: [{ id: "1" }], favorite: "missing" })
        let nodes: IAnyStateTreeNode[] = []
        expect(() => {
            nodes = collect(store)
        }).not.toThrow()
        // store, todos array, todo "1"
        expect(nodes).toHaveLength(3)
    })

    test("workaround: children that were read before the walk are visited once", () => {
        const store = createStore()
        // reading the items creates their observable instances
        store.todos.forEach(todo => todo.title)
        void store.selected!.title
        const nodes = collect(store)
        expect(nodes).toHaveLength(5)
        expect(new Set(nodes).size).toBe(5)
    })
})
