import Meta from "gi://Meta"

interface WindowPosition {
	centerX: number
	centerY: number
	height: number
	width: number
	window: Meta.Window
	x: number
	y: number
}

export class WindowManager {
	/**
	 * Find the nearest window in the specified direction
	 */
	static findWindowInDirection(
		currentWindow: Meta.Window,
		direction: Direction
	): Meta.Window | null {
		const windows = WindowManager.getWindows()
		const currentPos = WindowManager.getWindowPosition(currentWindow)

		// Filter windows that are in the correct direction
		const candidates = windows
			.filter((w) => w !== currentWindow)
			.map((w) => WindowManager.getWindowPosition(w))
			.filter((pos) => {
				switch (direction) {
					case Direction.LEFT:
						// Window is to the left if its center is left of current window's left edge
						return pos.centerX < currentPos.x
					case Direction.RIGHT:
						// Window is to the right if its center is right of current window's right edge
						return pos.centerX > currentPos.x + currentPos.width
					case Direction.UP:
						// Window is above if its center is above current window's top edge
						return pos.centerY < currentPos.y
					case Direction.DOWN:
						// Window is below if its center is below current window's bottom edge
						return pos.centerY > currentPos.y + currentPos.height
					default:
						return false
				}
			})

		if (candidates.length === 0) {
			return null
		}

		// Find the nearest candidate
		let nearest: WindowPosition | null = null
		let minDistance = Number.POSITIVE_INFINITY

		for (const candidate of candidates) {
			let distance: number

			switch (direction) {
				case Direction.LEFT:
				case Direction.RIGHT:
					// For horizontal movement, prioritize vertical alignment
					// Distance is primarily horizontal, with vertical offset as secondary factor
					distance =
						Math.abs(candidate.centerX - currentPos.centerX) +
						Math.abs(candidate.centerY - currentPos.centerY) * 0.5
					break
				case Direction.UP:
				case Direction.DOWN:
					// For vertical movement, prioritize horizontal alignment
					// Distance is primarily vertical, with horizontal offset as secondary factor
					distance =
						Math.abs(candidate.centerY - currentPos.centerY) +
						Math.abs(candidate.centerX - currentPos.centerX) * 0.5
					break
				default:
					distance = WindowManager.distance(
						currentPos.centerX,
						currentPos.centerY,
						candidate.centerX,
						candidate.centerY
					)
			}

			if (distance < minDistance) {
				minDistance = distance
				nearest = candidate
			}
		}

		return nearest ? nearest.window : null
	}

	/**
	 * Get the currently focused window
	 */
	static getFocusedWindow(): Meta.Window | null {
		const display = global.display
		return display.get_focus_window()
	}

	/**
	 * Get the position and dimensions of a window
	 */
	static getWindowPosition(window: Meta.Window): WindowPosition {
		const rect = window.get_frame_rect()
		return {
			window,
			x: rect.x,
			y: rect.y,
			width: rect.width,
			height: rect.height,
			centerX: rect.x + rect.width / 2,
			centerY: rect.y + rect.height / 2,
		}
	}

	/**
	 * Get all normal windows (excluding dialogs, popups, etc.)
	 */
	static getWindows(): Meta.Window[] {
		const workspace = global.workspace_manager.get_active_workspace()
		const windows = workspace.list_windows()

		return windows.filter((window: Meta.Window) => {
			// Only include normal windows
			return window.get_window_type() === Meta.WindowType.NORMAL && !window.is_skip_taskbar()
		})
	}

	/**
	 * Navigate to the window in the specified direction
	 */
	static navigateInDirection(direction: Direction): void {
		const currentWindow = WindowManager.getFocusedWindow()
		if (!currentWindow) {
			return
		}

		const targetWindow = WindowManager.findWindowInDirection(currentWindow, direction)
		if (targetWindow) {
			const timestamp = global.get_current_time()
			targetWindow.activate(timestamp)
		}
	}

	/**
	 * Calculate distance between two points
	 */
	private static distance(x1: number, y1: number, x2: number, y2: number): number {
		const dx = x2 - x1
		const dy = y2 - y1
		return Math.sqrt(dx * dx + dy * dy)
	}
}

export enum Direction {
	LEFT = "left",
	RIGHT = "right",
	UP = "up",
	DOWN = "down",
}
