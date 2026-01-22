export type Direction = "DOWN" | "LEFT" | "RIGHT" | "UP"
type Rectangle = {
	center: Vec2
	size: Vec2
}

type Vec2 = [number, number]

export class Window<T = unknown> {
	rectangle: Rectangle

	constructor(
		readonly data: T,
		geometry: { x: number; y: number; width: number; height: number }
	) {
		this.rectangle = {
			center: [geometry.x + geometry.width / 2, geometry.y + geometry.height / 2],
			size: [geometry.width, geometry.height],
		}
	}
}

export function getDirectionTransform(
	baseRect: Rectangle,
	direction: Direction
): (p: Vec2) => Vec2 {
	const origo = getNewOrigo(baseRect, direction)
	switch (direction) {
		case "DOWN": {
			return (p) => [p[1] - origo[1], p[0] - origo[0]]
		}
		case "LEFT": {
			return (p) => [(p[0] - origo[0]) * -1, p[1] - origo[1]]
		}
		case "RIGHT": {
			return (p) => [p[0] - origo[0], p[1] - origo[1]]
		}
		case "UP": {
			return (p) => [(p[1] - origo[1]) * -1, p[0] - origo[0]]
		}
	}
}

export function getNewOrigo(rect: Rectangle, direction: Direction): Vec2 {
	switch (direction) {
		case "DOWN": {
			return [rect.center[0], rect.center[1] + rect.size[1] / 2]
		}
		case "LEFT": {
			return [rect.center[0] - rect.size[0] / 2, rect.center[1]]
		}
		case "RIGHT": {
			return [rect.center[0] + rect.size[0] / 2, rect.center[1]]
		}
		case "UP": {
			return [rect.center[0], rect.center[1] - rect.size[1] / 2]
		}
	}
}

export function getWindow<T, W extends Window<T>>(
	window: W,
	windows: Array<W>,
	direction: Direction
): W | undefined {
	const transform = getDirectionTransform(window.rectangle, direction)
	const winner = windows
		.filter((it) => it.data != window.data)
		.map((it) => {
			const center2 = transform(it.rectangle.center)
			return {
				x1: center2[0] - it.rectangle.size[0] / 2,
				x2: center2[0] + it.rectangle.size[0] / 2,
				window: it,
			}
		})
		.filter((it) => {
			if (it.x2 <= 0) {
				return false
			}
			return true
		})
		.reverse()
		.sort((a, b) => a.x1 - b.x1)[0]
	return winner?.window
}
