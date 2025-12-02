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
			() => this.#navigateInDirection("LEFT")
		)

		Main.wm.addKeybinding(
			"window-navigator-right",
			this.getSettings(),
			Meta.KeyBindingFlags.NONE,
			Shell.ActionMode.NORMAL,
			() => this.#navigateInDirection("RIGHT")
		)

		Main.wm.addKeybinding(
			"window-navigator-up",
			this.getSettings(),
			Meta.KeyBindingFlags.NONE,
			Shell.ActionMode.NORMAL,
			() => this.#navigateInDirection("UP")
		)

		Main.wm.addKeybinding(
			"window-navigator-down",
			this.getSettings(),
			Meta.KeyBindingFlags.NONE,
			Shell.ActionMode.NORMAL,
			() => this.#navigateInDirection("DOWN")
		)
	}

	#navigateInDirection(direction: Direction): void {
		const focusedWindow = global.display.get_focus_window()
		if (focusedWindow == null) {
			return
		}
		const currentRect = focusedWindow.get_frame_rect()
		const currentWindow = new Window(focusedWindow, currentRect)
		const workspace = global.workspace_manager.get_active_workspace()
		const windows = workspace
			.list_windows()
			// remove unwanted candidates
			.filter(
				(it) =>
					it.get_window_type() == Meta.WindowType.NORMAL && //
					!it.is_skip_taskbar() &&
					!it.minimized
			)
			// read geometry
			.map((it) => {
				const rect = it.get_frame_rect()
				return new Window(it, rect)
			})
		const winner = getWindow(currentWindow, windows, direction)
		if (winner != undefined) {
			winner.data.activate(global.get_current_time())
		}

		for (const { data } of windows) {
			const rect = data.get_frame_rect()
			console.log(data.title, rect.x, rect.y)
		}
	}
}
