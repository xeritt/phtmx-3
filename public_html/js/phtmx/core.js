//import {DEBUG, VERSION} from "./constant.js"
//import {log, err} from "./logs.js"
export const DEBUG = 0
export const VERSION = 2;

let debug = DEBUG;
//const VERSION = 2;
/** Служебные */
export function version(){ return VERSION } 
export function setDebug(val){ debug = val} 
export function log(mes) {if (debug) console.log(mes) }
export function logerr(mes) {if (debug) console.error(mes) }
export function sleep(ms) {return new Promise(resolve => setTimeout(resolve, ms));}
/*
export const isDebug = () => {return debug}
export const nullLog = () => {}
export const log = isDebug() ? console.log : nullLog
export const err = isDebug() ? console.error : nullLog
export const logerr = isDebug() ? console.error : nullLog
export const dir = isDebug() ? console.dir : nullLog
export const jsn = (x) => JSON.stringify(x, null, '  ')
export function jsnlog (map) {
	let obj = map
	if (map instanceof Map) 
		obj = Object.fromEntries(map.entries())
	log(jsn(obj))
}
*/
const doc = document
/** Селекторы */
export const $ = (name) =>doc.querySelector(name)
export const $$ = (name) =>doc.querySelectorAll(name)
export const el = (id) => doc.getElementById(id)
export const data = (name) => $(`[data-name='${name}']`)
export const datas = (name) => $$(`[data-name='${name}']`)
//export const data = (name) => $$(`[data-name='${name}']`)
export const val = (name) => data(name)?.dataset.value
export const innerHTML = (name) => data(name)?.innerHTML

export const el_innerHTML = (id) => el(id)?.innerHTML
export const el_val = (id) => el(id)?.dataset.value
export const handler = (n, h) =>{$$(`[${n}]`).forEach(e => h(e))}

const once = (e, name, handler) => {
	if (e.dataset.handler){
		if (e.dataset.handler.indexOf(name) === 0) return;
	}   
	handler(e); 
	if (e.dataset.handler)
		e.dataset.handler += name + ' ';
	else 
		e.dataset.handler = name + ' ';
}

export const handler_once = (n, h) =>{$$(`[${n}]`).forEach(e => {once(e, n, h)})}

export const on_by_name = (eventName, name, handler) =>{
	datas(name).forEach(el =>{
		addListenerElement(el, (e)=>handler(el), eventName)
	})
}

export const selector_handler = (n, h) =>{$$(`${n}`).forEach(e => h(e))}
export const selector_handler_once = (n, h) =>{$$(`${n}`).forEach(e => {once(e, n, h)})}

/* Загрузка обработчиков */
/**
 * 
 * @type Boolean|val запрос на запуск команды AddLoadAll
 */
export let requestOnLoad = false;
export function getRequestOnLoad(){ return requestOnLoad; }
export function setRequestOnLoad(val){ requestOnLoad = val; }

/**
 * Функция вызова обработчиков от пользователей 
 * 
 */
let dynamicHandlers = null

export function setDynamicHandlers(handlersFunction) {
	dynamicHandlers = handlersFunction
}
export function getDynamicHandlers() {
	return dynamicHandlers
}

/** Запускает по интервалу сканирование классов для подключения 
 *  новых обработчиков если есть запрос на загрузку в 
 *  переменной requestOnLoad 
 * 
 * @param {type} delay интервал между запуском сканирования классов
 * @returns {undefined}
 */
export function addDynamicElements(delay) {
	  setRequestOnLoad(true);
    let resolve = () => {
        log('addDynamicElements');
        if (getRequestOnLoad()){
            //log('addLoadAll Request');
            //addLoadAll();
						if (dynamicHandlers) dynamicHandlers()
            setRequestOnLoad(false);
        }    
    };
    //resolve();
    setInterval(resolve, delay);
}



export function addListener(itemId, resolve, eventName = 'click') {
    let element = document.getElementById(itemId);
    if (!element) return;
    //if (element.dataset.listener == eventName) return;
    if (element.dataset.listener){
        if (element.dataset.listener.indexOf(eventName) === 0) return;
    }    
    element.addEventListener(eventName, resolve);
    if (element.dataset.listener)
        element.dataset.listener += eventName + ' ';
    else 
        element.dataset.listener = eventName + ' ';
}

/**
 * 
 * @param {type} element
 * @param {type} resolve
 * @param {type} eventName
 */
export function addListenerElement(element, resolve, eventName = 'click') {
    if (element.dataset.listener){
        if (element.dataset.listener.indexOf(eventName) === 0) return;
    }    
    log('Element Add Listener = ' + element.id);
    element.addEventListener(eventName, resolve);
    if (element.dataset.listener)
        element.dataset.listener += ' ' + eventName;
    else 
        element.dataset.listener = eventName;
}

export async function execApi(formData, path){

	let response = await fetch(path, {
			method: 'POST',
			body: formData
	}).catch((error) => console.log(error));
	
	let result = await response.text();//json();
	
	return result;
}