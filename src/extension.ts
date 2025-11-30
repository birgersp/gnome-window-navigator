import Meta from "gi://Meta"
import Shell from "gi://Shell"
import { Extension } from "resource:///org/gnome/shell/extensions/extension.js"
import * as Main from "resource:///org/gnome/shell/ui/main.js"

interface Rectangle {
	height: number
	width: number
	x: number
	y: number
}

export class Direction {
	static readonly DOWN = new Direction(
		(it) => -it.y,
		(it) => -it.height
	)
	static readonly LEFT = new Direction(
		(it) => -(it.x + it.width),
		(it) => -it.x
	)
	static readonly RIGHT = new Direction(
		(it) => it.x,
		(it) => it.x + it.width
	)
	static readonly UP = new Direction(
		(it) => it.y,
		(it) => it.height
	)

	private constructor(
		readonly getX1: (subject: Rectangle) => number,
		readonly getX2: (subject: Rectangle) => number
	) {}
}

export default class WindowNavigatorExtension extends Extension {
	override disable() {
		// Remove keybindings
		Main.wm.removeKeybinding("window-navigator-left")
		Main.wm.removeKeybinding("window-navigator-right")
		Main.wm.removeKeybinding("window-navigator-up")
		Main.wm.removeKeybinding("window-navigator-down")
	}

	override enable() {
		// Add keybindings for window navigation
		Main.wm.addKeybinding(
			"window-navigator-left",
			this.getSettings(),
			Meta.KeyBindingFlags.NONE,
			Shell.ActionMode.NORMAL,
			() => this.#navigateInDirection(Direction.LEFT)
		)

		Main.wm.addKeybinding(
			"window-navigator-right",
			this.getSettings(),
			Meta.KeyBindingFlags.NONE,
			Shell.ActionMode.NORMAL,
			() => this.#navigateInDirection(Direction.RIGHT)
		)

		Main.wm.addKeybinding(
			"window-navigator-up",
			this.getSettings(),
			Meta.KeyBindingFlags.NONE,
			Shell.ActionMode.NORMAL,
			() => this.#navigateInDirection(Direction.UP)
		)

		Main.wm.addKeybinding(
			"window-navigator-down",
			this.getSettings(),
			Meta.KeyBindingFlags.NONE,
			Shell.ActionMode.NORMAL,
			() => this.#navigateInDirection(Direction.DOWN)
		)
	}

	#navigateInDirection(direction: Direction): void {
		const currentWindow = global.display.get_focus_window()
		if (currentWindow == null) {
			return
		}
		const currentGeometry = currentWindow.get_frame_rect()
		const current = {
			x1: direction.getX1(currentGeometry),
			x2: direction.getX2(currentGeometry),
		}

		const workspace = global.workspace_manager.get_active_workspace()
		const windows = workspace
			.list_windows()
			// remove unwanted candidates
			.filter(
				(it) =>
					it != currentWindow &&
					it.get_window_type() == Meta.WindowType.NORMAL &&
					!it.is_skip_taskbar()
			)
			// read geometry
			.map((it) => {
				const geometry = it.get_frame_rect()
				return {
					x1: direction.getX1(geometry),
					x2: direction.getX2(geometry),
					w: it,
					geometry,
				}
			})

		debug("windows")
		debug(windows.map((w) => [w.w.title, w.x1, w.x2]))
		debug([currentWindow.title, current.x1, current.x2])

		// remove candidates that are on the "wrong side"
		const candidates = windows
			.filter((it) => {
				if (it.x2 <= current.x2) {
					return false
				}
				return true
			})
			// give each a "score"
			.map((it) => ({
				score: -Math.max(it.x1 - current.x2, 0),
				...it,
			}))
		candidates.sort((a, b) => b.score - a.score)

		// candidates are now sorted by score
		// but if there is a tie, the winner is the last in the list (because the last is the topmost window)
		const winner = candidates[0]

		if (winner != undefined) {
			winner.w.activate(global.get_current_time())
		}
	}
}

function debug(...data: unknown[]) {
	console.debug(...data)
}
