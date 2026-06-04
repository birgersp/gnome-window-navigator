import Adw from "gi://Adw"
import Gio from "gi://Gio"
import Gtk from "gi://Gtk"
import Gdk from "gi://Gdk"
import {
	ExtensionPreferences,
	gettext as _,
} from "resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js"

interface GdkKeyEventWithModifier {
	is_modifier(): boolean
}

export default class GnomeRectanglePreferences extends ExtensionPreferences {
	_settings?: Gio.Settings

	override fillPreferencesWindow(window: Adw.PreferencesWindow): Promise<void> {
		this._settings = this.getSettings()
		const page = new Adw.PreferencesPage({
			title: _("General"),
			iconName: "dialog-information-symbolic",
			vexpand: true,
		})

		const group = new Adw.PreferencesGroup({
			title: _("Keyboard Shortcuts"),
			vexpand: true,
		})

		group.add(this._createShortcutRow("window-navigator-left", _("Move Left")))
		group.add(this._createShortcutRow("window-navigator-right", _("Move Right")))
		group.add(this._createShortcutRow("window-navigator-up", _("Move Up")))
		group.add(this._createShortcutRow("window-navigator-down", _("Move Down")))

		page.add(group)
		window.add(page)
		return Promise.resolve()
	}

	private _createShortcutRow(key: string, label: string): Adw.ActionRow {
		const settings = this._settings
		if (settings == null) {
			throw new Error("Settings not initialized")
		}

		const row = new Adw.ActionRow({
			title: label,
		})

		const shortcutLabel = new Gtk.ShortcutLabel({
			valign: Gtk.Align.CENTER,
		})

		const editButton = new Gtk.Button({
			valign: Gtk.Align.CENTER,
		})
		editButton.set_child(shortcutLabel)

		const updateLabel = () => {
			const strv = settings.get_strv(key)
			const shortcut = strv[0] !== undefined ? strv[0] : ""
			shortcutLabel.set_accelerator(shortcut)
		}

		updateLabel()

		const signalId = settings.connect(`changed::${key}`, updateLabel)
		row.connect("destroy", () => {
			settings.disconnect(signalId)
		})

		const resetButton = new Gtk.Button({
			iconName: "edit-undo-symbolic",
			valign: Gtk.Align.CENTER,
			tooltipText: _("Reset to default"),
		})

		const updateResetButton = () => {
			const isCustom = settings.get_user_value(key) !== null
			resetButton.set_sensitive(isCustom)
		}
		updateResetButton()
		const resetSignalId = settings.connect(`changed::${key}`, updateResetButton)
		row.connect("destroy", () => {
			settings.disconnect(resetSignalId)
		})

		resetButton.connect("clicked", () => {
			settings.reset(key)
		})

		row.add_suffix(editButton)
		row.add_suffix(resetButton)

		editButton.connect("clicked", () => {
			this._showShortcutDialog(key, label, editButton)
		})

		return row
	}

	private _showShortcutDialog(key: string, label: string, parentWidget: Gtk.Widget): void {
		const settings = this._settings
		if (settings == null) {
			throw new Error("Settings not initialized")
		}
		const root = parentWidget.get_root()
		const parentWindow = root instanceof Gtk.Window ? root : null

		const dialog = new Adw.MessageDialog({
			transient_for: parentWindow !== null ? parentWindow : undefined,
			heading: _("Set Shortcut"),
			body: _("Press any key combination to set the shortcut for \"%s\", Backspace to clear, or Escape to cancel.").replace("%s", label),
		})

		dialog.add_response("cancel", _("Cancel"))
		dialog.set_close_response("cancel")
		dialog.set_default_response("cancel")

		const controller = new Gtk.EventControllerKey()
		controller.connect("key-pressed", (_self, keyval, _keycode, state) => {
			let isMod = false
			const event = controller.get_current_event() as GdkKeyEventWithModifier | null
			if (event !== null && typeof event.is_modifier === "function") {
				isMod = event.is_modifier()
			} else {
				isMod = [
					Gdk.KEY_Control_L, Gdk.KEY_Control_R,
					Gdk.KEY_Shift_L, Gdk.KEY_Shift_R,
					Gdk.KEY_Alt_L, Gdk.KEY_Alt_R,
					Gdk.KEY_Super_L, Gdk.KEY_Super_R,
					Gdk.KEY_Meta_L, Gdk.KEY_Meta_R,
					Gdk.KEY_Hyper_L, Gdk.KEY_Hyper_R,
					Gdk.KEY_Caps_Lock, Gdk.KEY_Num_Lock,
					Gdk.KEY_Scroll_Lock, Gdk.KEY_Shift_Lock
				].includes(keyval)
			}

			if (isMod) {
				return false
			}

			const mask = state & Gtk.accelerator_get_default_mod_mask()

			if (mask === 0 && keyval === Gdk.KEY_Escape) {
				dialog.close()
				return true
			}

			if (mask === 0 && keyval === Gdk.KEY_BackSpace) {
				settings.set_strv(key, [])
				dialog.close()
				return true
			}

			const accelString = Gtk.accelerator_name(keyval, mask)
			if (accelString !== "") {
				settings.set_strv(key, [accelString])
				dialog.close()
				return true
			}

			return false
		})

		dialog.add_controller(controller)
		dialog.present()
	}
}
