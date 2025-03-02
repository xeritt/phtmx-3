import {DEBUG} from "./constant.js";

export const isDebug = () => {return DEBUG}
export const nullLog = () => {}
export const log = isDebug() ? console.log : nullLog
export const err = isDebug() ? console.error : nullLog
export const dir = isDebug() ? console.dir : nullLog
export const jsn = (x) => JSON.stringify(x, null, '  ')
export function jsnlog (map) {
	let obj = map
	if (map instanceof Map) 
		obj = Object.fromEntries(map.entries())
	log(jsn(obj))
}