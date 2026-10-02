/**
 * Reproduction for https://github.com/mobxjs/mobx-state-tree/issues/1738
 * types.reference is not working on instance creation
 *
 * Status: ALREADY_FIXED
 * Fixed by: 3a2945db (#2199, 2024)
 * Summary: The README "Using a MST type at design time" example creates `Author` and `Tweet`
 * (with `author: types.reference(Author)`) instances, then passes them to `RootStore.create`.
 * TypeScript used to reject `tweets: [tweet]` because the instance's `author` is not a
 * ReferenceIdentifier. On current source the example compiles (no @ts-expect-error needed) and
 * runs, with the reference resolving inside the new tree.
 */
import { test, expect, describe } from "bun:test"
import { types } from "../../src"

// Define a couple models
const Author = types.model({
    id: types.identifier,
    firstName: types.string,
    lastName: types.string
})

const Tweet = types.model({
    id: types.identifier,
    author: types.reference(Author), // stores just the `id` reference!
    body: types.string,
    timestamp: types.number
})

// Define a store just like a model
const RootStore = types.model({
    authors: types.array(Author),
    tweets: types.array(Tweet)
})

describe("1738 - reference-bearing instance passed to create", () => {
    test("README example compiles and the reference resolves", () => {
        // Instantiate a couple model instances
        const jamon = Author.create({
            id: "jamon",
            firstName: "Jamon",
            lastName: "Holmgren"
        })

        const tweet = Tweet.create({
            id: "1",
            author: jamon.id, // just the ID needed here
            body: "Hello world!",
            timestamp: Date.now()
        })

        // Now instantiate the store!
        const rootStore = RootStore.create({
            authors: [jamon],
            tweets: [tweet]
        })

        expect(rootStore.tweets[0].author).toBe(rootStore.authors[0])
        expect(rootStore.tweets[0].author.firstName).toBe("Jamon")
    })
})
