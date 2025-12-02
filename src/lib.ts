export type Direction = "DOWN" | "LEFT" | "RIGHT" | "UP"

type Rectangle = {
	x: number
	y: number
	width: number
	height: number
}

type Point = [number, number]

export class Window<T = unknown> {
	constructor(readonly data: T, readonly rectangle: Rectangle) {}
}

function assertDefined<T>(subject: T | undefined | null): asserts subject is T {
	if (subject === undefined || subject === null) {
		throw new Error(`Expected a non-null or non-undefined value`)
	}
}

function getTransform(direction: Direction): (p: Point) => Point {
	switch (direction) {
		case "RIGHT":
			// remain unchanged
			return ([x, y]) => [x, y]
		case "DOWN":
			// 90 deg counter-clockwise
			return ([x, y]) => [y, -x]
		case "LEFT":
			// "flip" around the y axis
			return ([x, y]) => [-x, y]
		case "UP":
			// 90 deg clockwise
			return ([x, y]) => [-y, x]
	}
}

export function transformRectangle(rectangle: Rectangle, direction: Direction): Rectangle {
	const transform = getTransform(direction)
	const tl = transform([rectangle.x, rectangle.y])
	const tr = transform([rectangle.x + rectangle.width, rectangle.y])
	const bl = transform([rectangle.x, rectangle.y + rectangle.height])
	return {
		x: tl[0],
		y: tl[1],
		width: tr[0] - tl[0],
		height: bl[1] - tl[1],
	}
}

function getDistance2(p1: Point, p2: Point) {
	const dx = p2[0] - p1[0]
	const dy = p2[1] - p1[1]
	return dx * dx + dy * dy
}

export function getWindow<T>(
	window: Window<T>,
	windows: Array<Window<T>>,
	direction: Direction
): Window<T> | undefined {
	// transform rectangles according to direction
	const base = transformRectangle(window.rectangle, direction)
	const tr: Point = [base.x + base.width, base.y]
	const br: Point = [base.x + base.width, base.y + base.height]
	const midR: Point = [tr[0], tr[1] + (br[1] - tr[1]) / 2]
	const candidates = windows
		.filter((it) => it != window)
		.map((it) => ({
			window: it,
			rectangle: transformRectangle(it.rectangle, direction),
		}))
		.filter((it) => {
			if (it.rectangle.x + it.rectangle.width <= tr[0]) {
				// rectangle is on the left side
				return false
			}
			return true
		})
		.map((it) => {
			const { x, y, height } = it.rectangle
			const tl: Point = [Math.max(x, midR[0]), y]
			const bl: Point = [Math.max(x, midR[0]), y + height]
			const itMidR: Point = [tl[0], tl[1] + (bl[1] - tl[1]) / 2]
			return {
				window: it.window,
				cost: getDistance2(midR, itMidR),
			}
		})
	candidates.sort((a, b) => a.cost - b.cost)
	if (candidates.length == 0) {
		return
	}
	let winner = candidates[0]
	assertDefined(winner)
	// keep scanning until the next candidate has a higher cost
	for (const candidate of candidates) {
		if (candidate.cost == winner.cost) {
			winner = candidate
		} else {
			break
		}
	}
	return winner?.window
}
