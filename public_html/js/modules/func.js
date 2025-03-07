import * as $ from "./selector.js"
import {log, err} from "./logs.js"

export const add = (a, b)=> {return (parseInt(a) + parseInt(b))}
export const minus = (a, b)=> {return (parseInt(a) - parseInt(b))}

export const sum = (el) =>{
	const name = el.dataset.args
	let acc = 0
	$.datas(name).forEach((x)=>{acc += x.dataset.value * x.value})
	el.value = acc;
}

export const onsumitem = (el) =>{
	let acc = 0
	let name = el.dataset.name
	if (el.dataset.args) name = el.dataset.args
	$.datas(name).forEach((x)=>{acc += x.dataset.value * x.value})
	$.data(el.dataset.result).value = acc
}

export function computeInner() {
	const funcs = $.$$("[data-func]")
	////document.querySelectorAll("[data-func]")
	funcs.forEach(el => {
			let dt = el.dataset
			let args = dt.args.split(',').map((x) => {
				let name = x.trim()
				if (dt.source == 'innerHTML')
					return $.innerHTML(name)
				else
					return $.val(name)
			}).join(', ')
			const str = dt.func + '(' + args + ')'
			log(str)
			let res;
			try {
				res = eval(str);	
			} catch (error) {
				err(error)
			}
			
			if (dt.target === 'innerHTML')
				el.innerHTML = res;
			else
				dt.value = res;
			//addVar(dt)
	})
}
