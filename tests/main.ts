import assert from "node:assert"
import test from "node:test"
import { getWindow, Window } from "../src/lib.js"

const windows2 = [
	new Window(
		//
		"top",
		[0, 0],
		10,
		10
	),
	new Window(
		//
		"bottom",
		[5, 15],
		10,
		10
	),
	new Window(
		//
		"right",
		[20, 5],
		10,
		10
	),
]

await test("window navigator", async (t) => {
	await t.test("navigate up", () => {
		assert.deepStrictEqual(getWindow(windows2[1], windows2, "UP"), windows2[2])
		assert.deepStrictEqual(getWindow(windows2[2], windows2, "UP"), windows2[0])
		assert.deepStrictEqual(getWindow(windows2[0], windows2, "UP"), undefined)
	})

	await t.test("navigate down", () => {
		assert.deepStrictEqual(getWindow(windows2[0], windows2, "DOWN"), windows2[2])
		assert.deepStrictEqual(getWindow(windows2[2], windows2, "DOWN"), windows2[1])
		assert.deepStrictEqual(getWindow(windows2[1], windows2, "DOWN"), undefined)
	})

	await t.test("navigate left", () => {
		assert.deepStrictEqual(getWindow(windows2[2], windows2, "LEFT"), windows2[1])
		assert.deepStrictEqual(getWindow(windows2[1], windows2, "LEFT"), windows2[0])
		assert.deepStrictEqual(getWindow(windows2[0], windows2, "LEFT"), undefined)
	})

	await t.test("navigate right", () => {
		assert.deepStrictEqual(getWindow(windows2[0], windows2, "RIGHT"), windows2[1])
		assert.deepStrictEqual(getWindow(windows2[1], windows2, "RIGHT"), windows2[2])
		assert.deepStrictEqual(getWindow(windows2[2], windows2, "RIGHT"), undefined)
	})
})
