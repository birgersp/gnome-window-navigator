export class Direction {
	static readonly DOWN = new Direction((p) => new Vec2(p.y, p.x))
	static readonly LEFT = new Direction((p) => new Vec2(-p.x, p.y))
	static readonly RIGHT = new Direction((p) => new Vec2(p.x, p.y))
	static readonly UP = new Direction((p) => new Vec2(-p.y, p.x))

	private constructor(readonly transform: (p: Vec2) => Vec2) {}
}

class Rectangle {
	constructor(readonly p1: Vec2, readonly size: Vec2) {}
}

export class Vec2 {
	constructor(readonly x: number, readonly y: number) {}

	add(other: Vec2): Vec2 {
		return new Vec2(this.x + other.x, this.y + other.y)
	}
}

export class Window<T> extends Rectangle {
	constructor(readonly data: T, p1: Vec2, size: Vec2) {
		super(p1, size)
	}
}

export function getWindow<T>(
	window: Window<T>,
	windows: Array<Window<T>>,
	direction: Direction
): Window<T> | undefined {
	const windowWrapped = {
		window,
		p1: direction.transform(window.p1),
		p2: direction.transform(window.p1.add(window.size)),
	}
	const othersTransformed = windows
		.filter((it) => it != window)
		.map((it) => ({
			origin: it,
			p1: direction.transform(it.p1),
			p2: direction.transform(it.p1.add(it.size)),
		}))
	const candidates = othersTransformed
		// remove candidates that are on the "wrong" side
		.filter((it) => {
			if (it.p2.x <= windowWrapped.p2.x) {
				return false
			}
			return true
		})
		.map((it) => ({
			w: it,
			score: -Math.max(it.p1.x - windowWrapped.p2.x, 0),
		}))
	candidates.sort((a, b) => b.score - a.score)
	let winner = candidates[0]
	for (const candidate of candidates) {
		if (winner == undefined || winner.score == candidate.score) {
			winner = candidate
		}
	}
	return winner?.w.origin
}
