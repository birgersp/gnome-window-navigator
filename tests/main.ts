import assert from "node:assert"
import test from "node:test"
import { Direction, getNextWindow, Point, Window } from "../src/lib.js"

function arrayGet<T>(array: Array<T>, index: number) {
	const item = array[index]
	if (item == undefined) {
		throw new Error(`Element at index ${index} is undefined`)
	}
}

function window(p1: Point, p2: Point) {
	return new Window(null, p1, p2)
}

await test("window navigator", async (t) => {
	await t.test("navigate nowhere", () => {
		const newWindow = getNextWindow(window([0, 0], [0, 0]), [], Direction.LEFT)
		assert.strictEqual(newWindow, undefined)
	})

	await t.test("navigate right", () => {
		const windows = [
			//
			window([10, 0], [20, 0]),
		]
		const newWindow = getNextWindow(window([0, 0], [0, 0]), windows, Direction.RIGHT)
		assert.deepStrictEqual(newWindow, windows[0])
	})

	await t.test("navigate right but no windows are there", () => {
		const windows = [
			//
			window([10, 0], [20, 0]),
		]
		const newWindow = getNextWindow(window([20, 0], [30, 0]), windows, Direction.RIGHT)
		assert.deepStrictEqual(newWindow, undefined)
	})
})
