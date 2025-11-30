export type Point = [number, number]

export class Direction {
	static readonly DOWN = new Direction(([x, y]) => [y, x])
	static readonly LEFT = new Direction(([x, y]) => [-x, y])
	static readonly RIGHT = new Direction(([x, y]) => [x, y])
	static readonly UP = new Direction(([x, y]) => [y, x])

	private constructor(readonly transform: (p: Point) => Point) {}
}

export class Window<T> {
	constructor(readonly data: T, readonly p1: Point, readonly p2: Point) {}
}

export function getNextWindow<T>(
	window: Window<T>,
	others: Array<Window<T>>,
	direction: Direction
): Window<T> | undefined {
	throw new Error("Not implemented")
}
