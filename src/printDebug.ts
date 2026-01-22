import { EXTENSION_NAME } from "./constants.js"

export function printDebug(...data: unknown[]) {
	console.log(`[${EXTENSION_NAME}]`, ...data)
}
