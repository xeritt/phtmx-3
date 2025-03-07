import {addListenerElement} from "./listener_1.js"

const doc = document
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
export const handler_once = (n, h) =>{$$(`[${n}]`).forEach(e => 
	{
		if (e.dataset.handler){
			if (e.dataset.handler.indexOf(n) === 0) return;
		}   
		h(e); 
		if (e.dataset.handler)
			e.dataset.handler += n + ' ';
		else 
			e.dataset.handler = n + ' ';
	}
)}

export const on_by_name = (eventName, name, handler) =>{
	datas(name).forEach(el =>{
		addListenerElement(el, (e)=>handler(el), eventName)
	})
}