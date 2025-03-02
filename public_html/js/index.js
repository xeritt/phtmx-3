import {log, err, dir, jsn, jsnlog} from "./modules/logs.js"
import {add, minus} from "./modules/func.js"
import * as $ from "./modules/selector.js"
import {addDynamicElements, setRequestOnLoad} from "./modules/listener_1.js"

log("Start")
log($.data("Her"))
log($.val("Her"))
log($.innerHTML("hello"))
log($.el_innerHTML("test"))

$.handler('data-log', (el) => {log(el.dataset.log)})
$.handler('data-uppercase', (el) => {el.innerHTML = el.innerHTML.toUpperCase()})

const sum = (el) =>{
	const name = el.dataset.args
	let acc = 0
	$.datas(name).forEach((x)=>{acc += x.dataset.value * x.value})
	el.value = acc;
}
//$.handler('data-sum', sum)

/*
const onsum = (el, name) =>{
	let acc = 0
	$.datas(name).forEach((x)=>{acc += x.dataset.value * x.value})
	$.data(el.dataset.result).value = acc
}
*/
const onsumitem = (el) =>{
	let acc = 0
	let name = el.dataset.name
	if (el.dataset.args) name = el.dataset.args
	$.datas(name).forEach((x)=>{acc += x.dataset.value * x.value})
	$.data(el.dataset.result).value = acc
}
//window.onsum = onsum;

$.on_by_name('change', 'item', onsumitem)
$.on_by_name('click', 'clicksum', onsumitem)

//window.onsum = onsum;
/*
const data_log = () => {
	$$("[data-log]").forEach(el => {
		log(el.dataset.log)
	})
}
*/
/*
const logs = $$("[data-log]")

logs.forEach(element => {
    log(element.dataset.log)
});
*/
//const vars = $$("[data-name]")
//storage.vars = new Map()
//compute()

function computeInner() {
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
computeInner()

//jsnlog(storage.vars) 
//console.dir(storage.vars.values())
//jsnlog(storage)
//jsnlog(get('hello'))
//log(val('hello'), val('world'))
//err(get('hello'))

window.addEventListener('load', (event) => {
	log('The page has fully loaded');
	//loadDynamic('#Login', 'index.php?page=Login&action=in', 0);
	//loadDynamic('#User', 'user.html', 0);
	//loadDynamic('#UserStatus', go('UserStatus/index'), 0);
	//addLoadAll();
	setRequestOnLoad(true)
	addDynamicElements(500);  
});
log(window.document)