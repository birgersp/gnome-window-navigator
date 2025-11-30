import assert from "node:assert"
import test from "node:test"
import { getWindow, Window } from "../src/lib.js"

await test("window navigator", async (t) => {
	await t.test("navigate up 1", () => {
		const windows = [
			new Window(
				//
				"left",
				[0, 0],
				10,
				40
			),
			new Window(
				//
				"top right",
				[15, 5],
				10,
				10
			),
			new Window(
				//
				"bottom right",
				[15, 20],
				10,
				10
			),
		]
		assert.deepStrictEqual(getWindow(windows[0], windows, "UP"), undefined)
		assert.deepStrictEqual(getWindow(windows[2], windows, "UP"), windows[1])
		assert.deepStrictEqual(getWindow(windows[1], windows, "UP"), undefined)
	})

	await t.test("navigate up 2", () => {
		const windows = [
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
		assert.deepStrictEqual(getWindow(windows[1], windows, "UP"), windows[2])
		assert.deepStrictEqual(getWindow(windows[2], windows, "UP"), windows[0])
		assert.deepStrictEqual(getWindow(windows[0], windows, "UP"), undefined)
	})

	await t.test("navigate down", () => {
		const windows = [
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
		assert.deepStrictEqual(getWindow(windows[0], windows, "DOWN"), windows[2])
		assert.deepStrictEqual(getWindow(windows[2], windows, "DOWN"), windows[1])
		assert.deepStrictEqual(getWindow(windows[1], windows, "DOWN"), undefined)
	})

	await t.test("navigate left", () => {
		const windows = [
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
		assert.deepStrictEqual(getWindow(windows[2], windows, "LEFT"), windows[1])
		assert.deepStrictEqual(getWindow(windows[1], windows, "LEFT"), windows[0])
		assert.deepStrictEqual(getWindow(windows[0], windows, "LEFT"), undefined)
	})

	await t.test("navigate right", () => {
		const windows = [
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
		assert.deepStrictEqual(getWindow(windows[0], windows, "RIGHT"), windows[1])
		assert.deepStrictEqual(getWindow(windows[1], windows, "RIGHT"), windows[2])
		assert.deepStrictEqual(getWindow(windows[2], windows, "RIGHT"), undefined)
	})
})
