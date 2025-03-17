export const DEBUG = 0
export const VERSION = 3.3;
let debug = DEBUG;
/** Служебные */
export function version() { return VERSION }
export function setDebug(val) { debug = val }
export function log(mes) { if (debug) console.log(mes) }
export function logerr(mes) { if (debug) console.error(mes) }
export function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

/** Селекторы */

/**Аналог document.querySelector(name),
 * но с возможностью изменить второй параметр и
 * сузить поиск внутри определенного контейнера doc
 * @param {*} name 
 * @param {*} doc Контейнер
 * @returns 
 */
export const $ = (name, doc = document) => doc.querySelector(name)
export const $$ = (name, doc = document) => doc.querySelectorAll(name)
export const el = (id, doc = document) => doc.getElementById(id)
export const el_val = (id, doc = document) => el(id, doc)?.dataset.value
export const el_innerHTML = (id, doc = document) => el(id, doc)?.innerHTML

/** Селекторы data переменных */
export const data = (name, doc = document) => $(`[data-name='${name}']`, doc)
export const datas = (name, doc = document) => $$(`[data-name='${name}']`, doc)
export const val = (name, doc = document) => data(name, doc)?.dataset.value
export const innerHTML = (name, doc = document) => data(name, doc)?.innerHTML

/**
 * Вызывает func при активации setRequestOnLoad(true)
 * и прописывает data-handler=func что-бы исключить
 * повторный вызов
 * @param {HTMLElement} el 
 * @param {*} name 
 * @param {*} func 
 * @returns 
 */
const once = (el, name, func) => {
	if (el.dataset.handler) {
		if (el.dataset.handler.indexOf(name) === 0) return;
	}
	func(el);
	if (el.dataset.handler)
		el.dataset.handler += ' ' + name ;
	else
		el.dataset.handler = name //+ ' ';
}

/**
 * Совершаются вычисления после setRequestOnLoad(true)
 * <button data-func="true">Load</button> 
 * selector_handler('[data-func]', async (el) => { })
 * @param {*} name 
 * @param {*} func 
 */
export const selector_handler = (name, func) => { $$(`${name}`).forEach(el => func(el)) }

/**
 * Совершаются вычисления один раз за всю жизнь документа
 * после setRequestOnLoad(true)
 * <button data-func="true">Load</button> 
 * selector_handler_once('[data-func]', async (el) => { })
 * @param {*} name 
 * @param {*} func 
 */
export const selector_handler_once = (name, func) => { $$(`${name}`).forEach(el => { once(el, name, func) }) }

/**Упрощенная версия selector_handler с [name] чтобы гарантировать поиск
 * только по атрибутам 
 * Вешается обработчик на наличие $name=data-attr в атрибутах
 * <span data-log="Core work done..."></span>
 * phtmx.handler('data-log', (el) => {phtmx.log(el.dataset.log)})
 * @param {*} name 
 * @param {*} func 
 */
//export const handler = (name, func) =>{$$(`[${name}]`).forEach(e => func(e))}
export const handler = (name, func) => { selector_handler(`[${name}]`, func) }

/**
 * Упрощенная версия selector_handler_once с [name] чтобы гарантировать поиск
 * только по атрибутам 
 * @param {*} name 
 * @param {*} func 
 */
export const handler_once = (n, h) =>{$$(`[${n}]`).forEach(e => {once(e, n, h)})}
//export const handler_once = (name, func) => { selector_handler_once(`[${name}]`, func) }

/**
 * Обработчик на eventName по имени data-name = name
 * повешан один раз
 * <button data-name="func">8</button>
 * on_by_name('click', 'func', async (el) => { })
 * @param {*} eventName 
 * @param {*} name 
 * @param {*} handler 
 */
export const on_by_name = (eventName, name, handler) => {
	datas(name).forEach(el => {
		addListenerElement(el, (event) => handler(el, event), eventName)
	})
}

/**
 * Обработчик на eventName по имени name = [data-$attrname]
 * повешан один раз
 * <button data-loadtext="calc3" data-url="/calc3.html">Load</button> 
 * on_selector('click', '[data-loadtext]', async (el) => { })
 * @param {*} eventName 
 * @param {*} name 
 * @param {*} handler 
 */
export const on_selector = (eventName, name, handler) => {
	$$(name).forEach(el => {
		addListenerElement(el, (event) => handler(el, event), eventName)
	})
}
/* Загрузка обработчиков */
/**
 * 
 * @type Boolean|val запрос на запуск команды AddLoadAll
 */
export let requestOnLoad = false;
export function getRequestOnLoad() { return requestOnLoad; }
export function setRequestOnLoad(val) { requestOnLoad = val; }

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
 *  переменной requestOnLoad устанавливается через метод
 *  setRequestOnLoad(true)
 * 
 * @param {type} delay интервал между запуском сканирования классов
 * @returns {undefined}
 */
export function addDynamicElements(delay) {
	setRequestOnLoad(true);
	let resolve = () => {
		log('addDynamicElements!');
		if (getRequestOnLoad()) {
			//log('addLoadAll Request');
			//addLoadAll();
			if (dynamicHandlers) dynamicHandlers()
			setRequestOnLoad(false);
		}
	};
	//resolve();
	setInterval(resolve, delay);
}

/**Устанавливает listener(resolve) на событие eventName
 * по element(HTMLElement) и прописывает data-listener=eventName для
 * избежания повторной установки обработчика
 * @param {HTMLElement} element
 * @param {type} resolve
 * @param {type} eventName
 */
export function addListenerElement(element, resolve, eventName = 'click') {
	if (element.dataset.listener) {
		if (element.dataset.listener.indexOf(eventName) === 0) return;
	}
	log('Element Add Listener = ' + element.tagName);

	element.addEventListener(eventName, resolve);
	if (element.dataset.listener)
		element.dataset.listener += ' ' + eventName;
	else
		element.dataset.listener = eventName;
}

/**Устанавливает listener(resolve) на событие eventName
 * по itemId и прописывает data-listener=eventName для
 * избежания повторной установки обработчика
 * @param {*} itemId 
 * @param {*} resolve 
 * @param {*} eventName 
 */
export function addListener(itemId, resolve, eventName = 'click') {
	let element = document.getElementById(itemId);
	if (!element) return;
	//if (element.dataset.listener == eventName) return;
	addListenerElement(element, resolve, eventName)
}

export async function execApi(formData, path, method = 'POST') {

	let response = await fetch(path, {
		method: method,
		body: formData
	}).catch((error) => logerr(error));

	let result = await response.text();//json();

	return result;
}

/**
 * Выдает первый попавщийся parent 
 * елемент который содержит data-companent
 * @param {*} el 
 * @returns 
 */
export const component = (el) => {
	//Если елемент сам компанент
	if (el.dataset?.component) return el;

	let parent = el.parentElement
	while (parent.nodeName != 'BODY') {
		if (parent.dataset?.component) break
		parent = parent.parentElement
	}
	return parent
}

/**
 * Загрузка текста url по fetch 
 * @param {*} url 
 * @returns 
 */
export const loadText = async (url) => {
	const response = await fetch(url)
	if (!response.ok) {
		const message = `An error has occured: ${response.status} url: ${url}`;
		logerr(message)
		return null;//message;
	} else {
		const text = await response.text();
		return text
	}
}

/**
 * Загрузка json url по fetch 
 * @param {*} url 
 * @returns 
 */
export const loadJson = async (url) => {
	const response = await fetch(url)
	if (!response.ok) {
		const message = `An error has occured json: ${response.status} url: ${url}`;
		logerr(message)
		return null;//message;
	} else {
		const json = await response.json();
		return json
	}
}
