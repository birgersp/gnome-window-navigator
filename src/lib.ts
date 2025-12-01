export type Direction = "DOWN" | "LEFT" | "RIGHT" | "UP"

export class Window<T = unknown> {
	constructor(
		readonly data: T,
		readonly pos: readonly [number, number],
		readonly width: number,
		readonly height: number
	) {}
}

function assertDefined<T>(subject: T | undefined | null): asserts subject is T {
	if (subject === undefined || subject === null) {
		throw new Error(`Expected variable to be not undefined or null`)
	}
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
	if (candidates.length == 0) {
		return
	}
	candidates.sort((a, b) => a.cost - b.cost)
	let winner = candidates[0]
	assertDefined(winner)
	// if there is a tie, pick the last of the candidates with the same cost
	for (const candidate of candidates) {
		if (candidate.cost == winner.cost) {
			winner = candidate
		} else {
			break
		}
	}
	return winner?.w
}
