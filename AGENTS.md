# Agent Instructions

This repository is a GNOME Shell extension named **Window Navigator**. It enables users to navigate focus between windows using directional hotkeys.

## Key Commands

- **Build / TypeScript compilation:** `make` or `pnpm run build`
- **Lint code:** `pnpm run lint`
- **Run tests:** `make test` or `pnpm test`
- **Package extension:** `make pack`
- **Install locally:** `make install`
- **Clean build outputs:** `make clean`

## Codebase Architecture

- `src/extension.ts`: Main entry point for the extension. Declares the extension class (extending `Extension` from GNOME Shell ESM API).
- `src/prefs.ts`: Preferences window interface (extending `ExtensionPreferences`).
- `src/lib.ts`: Core helper logic for finding and navigating to the nearest window.
- `src/constants.ts` & `src/icons.ts`: Static assets, identifiers, and configuration defaults.
- `src/printDebug.ts`: Safe console logging wrapper.
- `schemas/`: GNOME settings schemas (compiled using GLib tools).
- `tests/`: Extension unit tests run locally using the `tsx` test runner.

## Developer Guidelines for AI Agents

1. **GNOME Shell ESM API:** The extension target is GNOME Shell 45+. Modern ES module syntax must be used (e.g., `import Clutter from 'gi://Clutter';`). Legacy `const Clutter = imports.gi.Clutter;` is invalid.
2. **Type Declarations:** Use the types defined in `@girs/gjs` and `@girs/gnome-shell`.
3. **No Unneeded CLI Commands:** Test changes with automated tests if possible (`make test`).
4. **Settings Changes:** If settings schema changes are made, run `glib-compile-schemas schemas` or simply run `make` which compiles schemas under the hood.
