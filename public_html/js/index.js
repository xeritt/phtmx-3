import {log, err, dir, jsn, jsnlog} from "./modules/logs.js"
import {add, minus, sum, onsumitem, computeInner} from "./modules/func.js"
import * as $ from "./modules/selector.js"
import {addDynamicElements, setDynamicHandlers, setRequestOnLoad} from "./modules/listener_1.js"

const allHandlers = () =>{
	$.handler('data-log', (el) => {log(el.dataset.log)})
  $.handler_once('data-uppercase', (el) => {el.innerHTML = el.innerHTML.toUpperCase()})
	$.handler('data-sum', sum)
	$.on_by_name('change', 'item', onsumitem)
	$.on_by_name('click', 'clicksum', onsumitem)
	computeInner()
}

window.addEventListener('load', (event) => {
	log('The page has fully loaded');
	setRequestOnLoad(true)
	setDynamicHandlers(allHandlers)
	addDynamicElements(500)
});
