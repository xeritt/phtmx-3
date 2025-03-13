//import {DEBUG, VERSION} from "./constant.js"
//import {log, err} from "./logs.js"
export const DEBUG = 0
export const VERSION = 3;

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
//const doc = document
/** Селекторы */
export const $ = (name, doc = document) => doc.querySelector(name)
export const $$ = (name, doc = document) => doc.querySelectorAll(name)
export const el = (id, doc = document) => doc.getElementById(id)
export const data = (name, doc = document) => $(`[data-name='${name}']`, doc)
export const datas = (name, doc = document) => $$(`[data-name='${name}']`, doc)
//export const data = (name) => $$(`[data-name='${name}']`)
export const val = (name, doc = document) => data(name, doc)?.dataset.value
export const innerHTML = (name, doc = document) => data(name, doc)?.innerHTML

export const el_innerHTML = (id, doc = document) => el(id, doc)?.innerHTML
export const el_val = (id, doc = document) => el(id, doc)?.dataset.value
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

/**
 * Обработчик на eventName по имени data-name = name
 * повешан один раз
 * <button data-name="func">8</button>
 * on_by_name('func', async (el) => { })
 * @param {*} eventName 
 * @param {*} name 
 * @param {*} handler 
 */
export const on_by_name = (eventName, name, handler) =>{
	datas(name).forEach(el =>{
		addListenerElement(el, (e)=>handler(el), eventName)
	})
}

/**
 * Совершаются вычисления при каждм setRequestOnLoad(true)
 * <button data-func="true">Load</button> 
 * selector_handler('[data-func]', async (el) => { })
 * @param {*} n 
 * @param {*} h 
 */
export const selector_handler = (n, h) =>{$$(`${n}`).forEach(e => h(e))}

/**
 * Совершаются вычисления один раз за все жизнь документа
 * при каждом setRequestOnLoad(true)
 * <button data-func="true">Load</button> 
 * selector_handler_once('[data-func]', async (el) => { })
 * @param {*} n 
 * @param {*} h 
 */
export const selector_handler_once = (n, h) =>{$$(`${n}`).forEach(e => {once(e, n, h)})}

/**
 * Обработчик на eventName по имени name = [data-$attrname]
 * повешан один раз
 * <button data-loadtext="calc3" data-url="/calc3.html">Load</button> 
 * on_selector('click', '[data-loadtext]', async (el) => { })
 * @param {*} eventName 
 * @param {*} name 
 * @param {*} handler 
 */
export const on_selector = (eventName, name, handler) =>{
	$$(name).forEach(el =>{
		addListenerElement(el, (e)=>handler(el), eventName)
	})
}
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
        log('addDynamicElements!');
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
    log('Element Add Listener = ' + element.tagName);
    element.addEventListener(eventName, resolve);
    if (element.dataset.listener)
        element.dataset.listener += ' ' + eventName;
    else 
        element.dataset.listener = eventName;
}

export async function execApi(formData, path, method = 'POST'){

	let response = await fetch(path, {
			method: method,
			body: formData
	}).catch((error) => console.log(error));
	
	let result = await response.text();//json();
	
	return result;
}

/**
 * Выдает parent елемент который содержит
 * data-companent
 * @param {*} el 
 * @returns 
 */
export const component = (el) =>{
	let parent = el.parentElement
	while(parent.nodeName != 'BODY'){
		if (parent.dataset?.component) break
		parent = parent.parentElement
	}
	return parent
}