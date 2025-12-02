import assert from "node:assert"
import test from "node:test"
import { getWindow, Window } from "../src/lib.js"

await test("window navigator", async (t) => {
	await t.test("navigate up 1", () => {
		const windows = [
			new Window(
				//
				"left",
				{ x: 0, y: 0, width: 10, height: 40 }
			),
			new Window(
				//
				"top right",
				{ x: 15, y: 5, width: 10, height: 10 }
			),
			new Window(
				//
				"bottom right",
				{ x: 15, y: 20, width: 10, height: 10 }
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
				{ x: 0, y: 0, width: 10, height: 10 }
			),
			new Window(
				//
				"bottom",
				{ x: 5, y: 15, width: 10, height: 10 }
			),
			new Window(
				//
				"right",
				{ x: 20, y: 5, width: 10, height: 10 }
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
				{ x: 0, y: 0, width: 10, height: 10 }
			),
			new Window(
				//
				"bottom",
				{ x: 5, y: 15, width: 10, height: 10 }
			),
			new Window(
				//
				"right",
				{ x: 20, y: 5, width: 10, height: 10 }
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
				{ x: 0, y: 0, width: 10, height: 10 }
			),
			new Window(
				//
				"bottom",
				{ x: 5, y: 15, width: 10, height: 10 }
			),
			new Window(
				//
				"right",
				{ x: 20, y: 5, width: 10, height: 10 }
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
				{ x: 0, y: 0, width: 10, height: 10 }
			),
			new Window(
				//
				"bottom",
				{ x: 5, y: 15, width: 10, height: 10 }
			),
			new Window(
				//
				"right",
				{ x: 20, y: 5, width: 10, height: 10 }
			),
		]
		assert.deepStrictEqual(getWindow(windows[0], windows, "RIGHT"), windows[1])
		assert.deepStrictEqual(getWindow(windows[1], windows, "RIGHT"), windows[2])
		assert.deepStrictEqual(getWindow(windows[2], windows, "RIGHT"), undefined)
	})
})
