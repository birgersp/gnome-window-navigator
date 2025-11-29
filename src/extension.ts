import GLib from "gi://GLib"
import Gio from "gi://Gio"
import Meta from "gi://Meta"
import Shell from "gi://Shell"
import * as Main from "resource:///org/gnome/shell/ui/main.js"
import { Extension } from "resource:///org/gnome/shell/extensions/extension.js"
import { Direction, WindowManager } from "./window.js"

export default class WindowNavigatorExtension extends Extension {
	enable() {
		// Add keybindings for window navigation
		Main.wm.addKeybinding(
			"window-navigator-left",
			this.getSettings(),
			Meta.KeyBindingFlags.NONE,
			Shell.ActionMode.NORMAL,
			() => WindowManager.navigateInDirection(Direction.LEFT)
		)

		Main.wm.addKeybinding(
			"window-navigator-right",
			this.getSettings(),
			Meta.KeyBindingFlags.NONE,
			Shell.ActionMode.NORMAL,
			() => WindowManager.navigateInDirection(Direction.RIGHT)
		)

		Main.wm.addKeybinding(
			"window-navigator-up",
			this.getSettings(),
			Meta.KeyBindingFlags.NONE,
			Shell.ActionMode.NORMAL,
			() => WindowManager.navigateInDirection(Direction.UP)
		)

		Main.wm.addKeybinding(
			"window-navigator-down",
			this.getSettings(),
			Meta.KeyBindingFlags.NONE,
			Shell.ActionMode.NORMAL,
			() => WindowManager.navigateInDirection(Direction.DOWN)
		)
	}

	disable() {
		// Remove keybindings
		Main.wm.removeKeybinding("window-navigator-left")
		Main.wm.removeKeybinding("window-navigator-right")
		Main.wm.removeKeybinding("window-navigator-up")
		Main.wm.removeKeybinding("window-navigator-down")
	}
}
