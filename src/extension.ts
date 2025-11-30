import Meta from "gi://Meta"
import Shell from "gi://Shell"
import { Extension } from "resource:///org/gnome/shell/extensions/extension.js"
import * as Main from "resource:///org/gnome/shell/ui/main.js"
import { Direction, getWindow, Window } from "./lib.js"

// shadow node "global"
const global = Shell.Global.get()

export default class WindowNavigatorExtension extends Extension {
	override disable() {
		Main.wm.removeKeybinding("window-navigator-left")
		Main.wm.removeKeybinding("window-navigator-right")
		Main.wm.removeKeybinding("window-navigator-up")
		Main.wm.removeKeybinding("window-navigator-down")
	}

	override enable() {
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
		const focusedWindow = global.display.get_focus_window()
		if (focusedWindow == null) {
			return
		}
		const currentRect = focusedWindow.get_frame_rect()
		const currentWindow = new Window(
			focusedWindow,
			[currentRect.x, currentRect.y],
			[currentRect.x + currentRect.width, currentRect.y + currentRect.height]
		)
		const workspace = global.workspace_manager.get_active_workspace()
		const windows = workspace
			.list_windows()
			// remove unwanted candidates
			.filter(
				(it) =>
					it != focusedWindow &&
					it.get_window_type() == Meta.WindowType.NORMAL &&
					!it.is_skip_taskbar()
			)
			// read geometry
			.map((it) => {
				const rect = it.get_frame_rect()
				return new Window(it, [rect.x, rect.y], [rect.x + rect.width, rect.y + rect.height])
			})
		const winner = getWindow(currentWindow, windows, direction)
		if (winner != undefined) {
			winner.data.activate(global.get_current_time())
		}
	}
}
