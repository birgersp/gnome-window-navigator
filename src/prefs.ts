import Adw from "gi://Adw"
import Gio from "gi://Gio"
import {
	ExtensionPreferences,
	gettext as _,
} from "resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js"

export default class GnomeRectanglePreferences extends ExtensionPreferences {
	_settings?: Gio.Settings

	override fillPreferencesWindow(window: Adw.PreferencesWindow): Promise<void> {
		this._settings = this.getSettings()
		const page = new Adw.PreferencesPage({
			title: _("General"),
			iconName: "dialog-information-symbolic",
		})
		window.add(page)
		return Promise.resolve()
	}
}
