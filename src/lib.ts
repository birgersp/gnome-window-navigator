export type Direction = "DOWN" | "LEFT" | "RIGHT" | "UP"

export class Window<T = unknown> {
	constructor(
		readonly data: T,
		readonly pos: readonly [number, number],
		readonly width: number,
		readonly height: number
	) {}
}

function getBaseValue(window: Window, direction: Direction) {
	switch (direction) {
		case "RIGHT":
			return window.pos[0] + window.width
		case "LEFT":
			return -window.pos[0]
		case "DOWN":
			return window.pos[1]
		case "UP":
			return -(window.pos[1] + window.height)
	}
}

function getCandidateValue(window: Window, direction: Direction) {
	switch (direction) {
		case "RIGHT":
			return window.pos[0]
		case "LEFT":
			return -(window.pos[0] + window.width)
		case "DOWN":
			return window.pos[1]
		case "UP":
			return -(window.pos[1] + window.height)
	}
}

export function getWindow<T>(
	window: Window<T>,
	windows: Array<Window<T>>,
	direction: Direction
): Window<T> | undefined {
	const baseValue = getBaseValue(window, direction)
	const candidates = windows
		.filter((it) => it != window && getBaseValue(it, direction) > baseValue)
		.map((it) => ({
			w: it,
			cost: getCandidateValue(it, direction) - baseValue,
		}))
	candidates.sort((a, b) => a.cost - b.cost)
	let winner = candidates[0]
	return winner?.w
}
