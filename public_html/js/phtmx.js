async function load(){
	const phtmx = await import(`./phtmx/core.js`)
	const {add, minus, sum, onsumitem, computeInner} = await import(`./modules/func.js`)
	const dynamicload = await import(`./phtmx/preset/dynamicload.js`)

	const allHandlers = () =>{
		dynamicload.addLoadAll()
		phtmx.handler('data-log', (el) => {phtmx.log(el.dataset.log)})
		phtmx.handler_once('data-uppercase', (el) => {el.innerHTML = el.innerHTML.toUpperCase()})
		phtmx.handler('data-sum', sum)
		phtmx.on_by_name('change', 'item', onsumitem)
		phtmx.on_by_name('click', 'clicksum', onsumitem)
		phtmx.handler('data-alert', (el) => {alert(el.dataset.alert)})
		phtmx.selector_handler('.alert', (el) => {alert(el.dataset.value)} )
		phtmx.selector_handler_once('.log', (el) => {phtmx.log(el.dataset.value)} )
		computeInner()
	}
	
	phtmx.log('The page has fully loaded')
	phtmx.setDebug(1)
	//phtmx.setRequestOnLoad(true)
	phtmx.setDynamicHandlers(allHandlers)
	phtmx.addDynamicElements(500)
}

window.addEventListener('load', load)

//window.addEventListener('load', async (event) => {
//})