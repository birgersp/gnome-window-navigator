import { EXTENSION_NAME } from "./constants.js"

export function print(...data: unknown[]) {
	console.log(`[${EXTENSION_NAME}]`, ...data)
}
