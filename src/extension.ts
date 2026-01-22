import Meta from "gi://Meta"
import Shell from "gi://Shell"
import { Extension } from "resource:///org/gnome/shell/extensions/extension.js"
import * as Main from "resource:///org/gnome/shell/ui/main.js"
import { EXTENSION_NAME } from "./constants.js"
import { Direction, getWindow, Window } from "./lib.js"

// shadow node "global"
const global = Shell.Global.get()

export default class WindowNavigatorExtension extends Extension {
	override disable() {
		Main.wm.removeKeybinding(`${EXTENSION_NAME}-left`)
		Main.wm.removeKeybinding(`${EXTENSION_NAME}-right`)
		Main.wm.removeKeybinding(`${EXTENSION_NAME}-up`)
		Main.wm.removeKeybinding(`${EXTENSION_NAME}-down`)
	}

	override enable() {
		Main.wm.addKeybinding(
			`${EXTENSION_NAME}-left`,
			this.getSettings(),
			Meta.KeyBindingFlags.NONE,
			Shell.ActionMode.NORMAL,
			() => this.#navigateInDirection("LEFT")
		)

		Main.wm.addKeybinding(
			`${EXTENSION_NAME}-right`,
			this.getSettings(),
			Meta.KeyBindingFlags.NONE,
			Shell.ActionMode.NORMAL,
			() => this.#navigateInDirection("RIGHT")
		)

		Main.wm.addKeybinding(
			`${EXTENSION_NAME}-up`,
			this.getSettings(),
			Meta.KeyBindingFlags.NONE,
			Shell.ActionMode.NORMAL,
			() => this.#navigateInDirection("UP")
		)

		Main.wm.addKeybinding(
			`${EXTENSION_NAME}-down`,
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
		const actors = global.get_window_actors()
		const allWindows = actors.map((a) => a.get_meta_window())
		const wsWindows = allWindows
			.filter((it) => it != null)
			.filter(
				(it) =>
					[Meta.WindowType.NORMAL, Meta.WindowType.DIALOG].includes(it.get_window_type()) && //
					!it.is_skip_taskbar() &&
					!it.minimized
			)
			.map((it) => {
				const rect = it.get_frame_rect()
				return new Window(it, rect)
			})
		const winner = getWindow(currentWindow, wsWindows, direction)
		if (winner != undefined) {
			winner.data.activate(global.get_current_time())
		}
	}
}
