/**
 * Scenarios that reproduce performance issues from the tracker. Each entry names the issue it
 * measures. Keep setup outside the timed section; return elapsed milliseconds (or, for memory
 * scenarios, bytes, with `unit: "bytes"`).
 */
import type { Scenario } from "./scenarios"

export const issueScenarios: Scenario[] = []
