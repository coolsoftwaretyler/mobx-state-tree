import { HeroRoles } from "./fixture-models"

/** Snapshots with very few fields. */
export function createTreasure(count: number) {
    const data = []
    for (let i = 0; i < Math.max(count, 1); i++) {
        data.push({ trapped: i % 2 === 0, gold: ((count % 10) + 1) * 10 })
    }
    return data
}

const titles = ["Sir", "Lady", "Baron von", "Baroness", "Captain", "Dread", "Fancy"]
const givenNames = ["Abe", "Beth", "Chuck", "Dora", "Ernie", "Fran", "Gary", "Haily"]
const epicNames = ["Amazing", "Brauny", "Chafed", "Dapper", "Egomaniac", "Foul"]
const wtf = `Daenerys Stormborn of the House Targaryen, First of Her Name, the Unburnt,
    Queen of the Andals and the First Men, Khaleesi of the Great Grass Sea, Breaker of Chains,
    and Mother of Dragons. `

/** Snapshots with a medium number of fields. */
export function createHeros(count: number) {
    const data = []
    for (let i = 0; i < Math.max(count, 1); i++) {
        data.push({
            id: i,
            name: `${titles[i % titles.length]} ${givenNames[i % givenNames.length]} the ${epicNames[i % epicNames.length]}`,
            level: (count % 100) + 1,
            role: HeroRoles[i % HeroRoles.length],
            description: `${wtf} ${wtf} ${wtf}`
        })
    }
    return data
}

/** Snapshots with many fields and nested children. */
export function createMonsters(count: number, treasureCount: number, heroCount: number) {
    const data = []
    let even = true
    for (let i = 0; i < Math.max(count, 1); i++) {
        data.push({
            id: `omg-${i}-run!`,
            freestyle: `${wtf} ${wtf} ${wtf}${wtf} ${wtf} ${wtf}`,
            level: (count % 100) + 1,
            hp: i % 2 === 0 ? 1 : 5 * i,
            maxHp: 5 * i,
            warning: "!!!!!!",
            createdAt: new Date(),
            hasFangs: even,
            hasClaws: even,
            hasWings: !even,
            hasGrowl: !even,
            fearsFire: even,
            fearsWater: !even,
            fearsWarriors: even,
            fearsClerics: !even,
            fearsMages: even,
            fearsThieves: !even,
            stenchLevel: i % 5,
            treasures: createTreasure(treasureCount),
            eatenHeroes: createHeros(heroCount)
        })
        even = !even
    }
    return data
}
