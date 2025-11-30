export type Point = [number, number]

export class Direction {
	static readonly DOWN = new Direction(([x, y]) => [y, x])
	static readonly LEFT = new Direction(([x, y]) => [-x, y])
	static readonly RIGHT = new Direction(([x, y]) => [x, y])
	static readonly UP = new Direction(([x, y]) => [-y, x])

	private constructor(readonly transform: (p: Point) => Point) {}
}

class Rectangle {
	constructor(readonly p1: Point, readonly p2: Point) {}
}

export class Window<T> extends Rectangle {
	constructor(readonly data: T, p1: Point, p2: Point) {
		super(p1, p2)
	}
}

export function getWindow<T>(
	window: Window<T>,
	others: Array<Window<T>>,
	direction: Direction
): Window<T> | undefined {
	const windowWrapped = {
		origin: window,
		transformed: new Rectangle(direction.transform(window.p1), direction.transform(window.p2)),
	}
	const othersTransformed = others.map((it) => ({
		origin: it,
		transformed: new Rectangle(direction.transform(it.p1), direction.transform(it.p2)),
	}))
	const candidates = othersTransformed
		// remove candidates that are on the "wrong" side
		.filter((it) => {
			if (it.transformed.p2[0] <= windowWrapped.transformed.p2[0]) {
				return false
			}
			return true
		})
		.map((it) => ({
			w: it,
			score: -Math.max(it.transformed.p2[0] - windowWrapped.transformed.p2[0], 0),
		}))
	let winner = candidates[0]
	for (const candidate of candidates) {
		if (winner == undefined || winner.score == candidate.score) {
			winner = candidate
		}
	}
	return winner?.w.origin
}
