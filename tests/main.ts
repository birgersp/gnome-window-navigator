import assert from "node:assert"
import test from "node:test"
import { Direction, getWindow, Point, Window } from "../src/lib.js"

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
	await t.test("navigate right", () => {
		const windows = [
			//
			window([0, 10], [10, 10]),
			window([20, 10], [30, 10]),
			window([30, 10], [40, 10]),
		]
		const newWindow = getWindow(window([10, 10], [20, 10]), windows, Direction.RIGHT)
		assert.deepStrictEqual(newWindow, windows[1])
	})

	await t.test("navigate left", () => {
		const windows = [
			//
			window([0, 10], [10, 10]),
			window([20, 10], [30, 10]),
			window([30, 10], [40, 10]),
		]
		const newWindow = getWindow(window([10, 10], [20, 10]), windows, Direction.LEFT)
		assert.deepStrictEqual(newWindow, windows[0])
	})

	await t.test("navigate nowhere", () => {
		const newWindow = getWindow(window([0, 10], [0, 10]), [], Direction.LEFT)
		assert.strictEqual(newWindow, undefined)
	})

	await t.test("navigate right but no windows are there", () => {
		const windows = [
			//
			window([10, 10], [20, 10]),
		]
		const newWindow = getWindow(window([20, 10], [30, 10]), windows, Direction.RIGHT)
		assert.deepStrictEqual(newWindow, undefined)
	})
})
