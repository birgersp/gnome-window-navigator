import assert from "node:assert"
import test from "node:test"
import { getDirectionTransform, getNewOrigo, getWindow, Window } from "../src/lib.js"

await test("window navigator", async (t) => {
	await t.test("basic", async (t) => {
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

		await t.test(getNewOrigo.name, () => {
			const origo = getNewOrigo(windows[1].rectangle, "LEFT")
			assert.equal(origo[0], 5)
			assert.equal(origo[1], 20)
		})

		await t.test(getDirectionTransform.name, () => {
			const transform = getDirectionTransform(windows[1].rectangle, "LEFT")
			const transformed = transform(windows[0].rectangle.center)
			assert.equal(transformed[0], 0)
			assert.equal(transformed[1], -15)
		})

		await t.test("navigate up", () => {
			assert.equal(getWindow(windows[0], windows, "UP"), undefined)
			assert.equal(getWindow(windows[1], windows, "UP"), windows[0])
			assert.equal(getWindow(windows[2], windows, "UP"), windows[0])
		})

		await t.test("navigate down", () => {
			assert.equal(getWindow(windows[0], windows, "DOWN"), windows[1])
			assert.equal(getWindow(windows[1], windows, "DOWN"), undefined)
			assert.equal(getWindow(windows[2], windows, "DOWN"), windows[1])
		})

		await t.test("navigate left", () => {
			assert.equal(getWindow(windows[0], windows, "LEFT"), undefined)
			assert.equal(getWindow(windows[1], windows, "LEFT"), windows[0])
			assert.equal(getWindow(windows[2], windows, "LEFT"), windows[0])
		})

		await t.test("navigate right", () => {
			assert.equal(getWindow(windows[0], windows, "RIGHT"), windows[2])
			assert.equal(getWindow(windows[1], windows, "RIGHT"), windows[2])
			assert.equal(getWindow(windows[2], windows, "RIGHT"), undefined)
		})
	})

	await t.test("stacking order and collision tie-breaking", async (t) => {
		await t.test("multiple colliding windows: choose topmost in stack", () => {
			const current = new Window("current", { x: 0, y: 0, width: 10, height: 10 })
			const bottom = new Window("bottom-stack", { x: 20, y: 0, width: 10, height: 10 })
			const top = new Window("top-stack", { x: 20, y: 5, width: 10, height: 10 })

			const list = [current, bottom, top]

			// Navigating RIGHT from current should select the topmost window in the stacking order (top)
			assert.equal(getWindow(current, list, "RIGHT"), top)
		})

		await t.test("non-colliding windows: choose closest", () => {
			const current = new Window("current", { x: 0, y: 0, width: 10, height: 10 })
			const far = new Window("far", { x: 20, y: 20, width: 10, height: 10 })
			const near = new Window("near", { x: 15, y: 20, width: 10, height: 10 })

			const list = [current, far, near]

			// Navigating RIGHT from current should select 'near' because its distance is smaller (5 vs 10)
			assert.equal(getWindow(current, list, "RIGHT"), near)
		})

		await t.test("non-colliding tie-break: choose topmost in stack", () => {
			const current = new Window("current", { x: 0, y: 0, width: 10, height: 10 })
			const bottom = new Window("bottom-stack", { x: 15, y: 20, width: 10, height: 10 })
			const top = new Window("top-stack", { x: 15, y: 35, width: 10, height: 10 })

			const list = [current, bottom, top]

			// Both are non-colliding and at distance 5. Should choose 'top' (topmost in stacking order)
			assert.equal(getWindow(current, list, "RIGHT"), top)
		})
	})
})
