async function load(){
	const phtmx = await import(`./phtmx/core.js`)

	const cardsHandlers = () =>{

		phtmx.handler('data-log', (el) => {phtmx.log(el.dataset.log)})

		const loadData = async (el) =>{
			phtmx.log(`Load data from ${el.dataset.url}`)
			let json = await phtmx.loadJson(el.dataset.url)
			phtmx.log(json)
			if (json){
				//el.replaceChildren();
				let template = phtmx.data(el.dataset.template, el)
				let target = phtmx.data(el.dataset.target, el)
				target.replaceChildren()
				phtmx.log(target)
				json.forEach(item =>{
					let clon = template.content.cloneNode(true);
					let card = phtmx.$('[data-card]', clon)
					let names = phtmx.$$('[data-name]', card)
					//phtmx.log(names)
					names.forEach(element => {element.innerText = item[element.dataset.name]});
					target.appendChild(clon)
				})
			}
		}

		phtmx.handler_once('data-template', async (el) => {
			loadData(el)
		})

		phtmx.on_selector('click', '[data-workers]', (el) => {
			phtmx.log('click')
			let comp = phtmx.component(el)
			comp.dataset.template = "workers"
			loadData(comp)
		})

		phtmx.on_selector('click', '[data-players]', (el) => {
			phtmx.log('click')
			let comp = phtmx.component(el)
			comp.dataset.template = "players"
			loadData(comp)
		})

		phtmx.on_selector('click', '[data-request]', () => {
			phtmx.log('click')
			//phtmx.setRequestOnLoad(true)
		})
/*
		let buttons = document.querySelectorAll('[data-request]')
		const resolve = () =>{console.log('click')} 
		let eventName = 'click'
		buttons.forEach(element => {
				//addListenerElement(el, (event) => resolve(el, event), eventName)
				if (element.dataset.listener) {
						if (element.dataset.listener.indexOf(eventName) === 0) return;
					}
					console.log('Element Add Listener = ' + element.tagName);
					element.addEventListener(eventName, resolve);
					if (element.dataset.listener)
						element.dataset.listener += ' ' + eventName;
					else
						element.dataset.listener = eventName;
		})
*/
	}

	phtmx.setDebug(1)
	phtmx.log('The page has fully loaded')
	
	phtmx.setRequestOnLoad(true)
	phtmx.setDynamicHandlers(cardsHandlers)
	phtmx.addDynamicElements(500)
}

window.addEventListener('load', load)
