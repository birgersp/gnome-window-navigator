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
	const isHorizontal = direction === "LEFT" || direction === "RIGHT"
	const C_sizeY = isHorizontal ? window.rectangle.size[1] : window.rectangle.size[0]

	const candidates = windows
		.map((it, index) => {
			const center2 = transform(it.rectangle.center)
			const sizeX = isHorizontal ? it.rectangle.size[0] : it.rectangle.size[1]
			const sizeY = isHorizontal ? it.rectangle.size[1] : it.rectangle.size[0]
			const x1 = center2[0] - sizeX / 2
			const x2 = center2[0] + sizeX / 2
			const y1 = center2[1] - sizeY / 2
			const y2 = center2[1] + sizeY / 2
			const collides = y1 < C_sizeY / 2 && y2 > -C_sizeY / 2

			return {
				window: it,
				x1,
				x2,
				collides,
				stackIndex: index,
			}
		})
		.filter((it) => it.window.data !== window.data && it.x2 > 0)

	const colliding = candidates.filter((it) => it.collides)
	if (colliding.length > 0) {
		// If multiple windows collide, navigate to the window that is topmost.
		colliding.sort((a, b) => b.stackIndex - a.stackIndex)
		const first = colliding[0]
		if (first !== undefined) {
			return first.window
		}
	}

	// If no windows collide, navigate to the window that is closest.
	if (candidates.length > 0) {
		candidates.sort((a, b) => {
			if (Math.abs(a.x1 - b.x1) < 1e-5) {
				return b.stackIndex - a.stackIndex
			}
			return a.x1 - b.x1
		})
		const first = candidates[0]
		if (first !== undefined) {
			return first.window
		}
	}

	return undefined
}
