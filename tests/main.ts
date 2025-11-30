import assert from "node:assert"
import test from "node:test"
import { Direction, getWindow, Vec2, Window } from "../src/lib.js"

const windows = [
	new Window(
		//
		"ide",
		new Vec2(1920, 0),
		new Vec2(2560, 1392)
	),
	new Window(
		//
		"git gui",
		new Vec2(4808, 411),
		new Vec2(2024, 674)
	),
	new Window(
		//
		"browser",
		new Vec2(4480, 0),
		new Vec2(2560, 1440)
	),
	new Window(
		//
		"terminal",
		new Vec2(0, 0),
		new Vec2(1920, 1080)
	),
]

await test("window navigator", async (t) => {
	await t.test("navigate right, find none", () => {
		const newWindow = getWindow(windows[2], windows, Direction.RIGHT)
		assert.deepStrictEqual(newWindow, undefined)
	})

	await t.test("navigate right", () => {
		const newWindow = getWindow(windows[0], windows, Direction.RIGHT)
		assert.deepStrictEqual(newWindow, windows[2])
	})
})
