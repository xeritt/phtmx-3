async function load(){
	const phtmx = await import(`./phtmx/core.js`)

	const cardsHandlers = () =>{

		phtmx.handler('data-log', (el) => {phtmx.log(el.dataset.log)})

		phtmx.handler_once('data-template', async (el) => {
			phtmx.log(`Load data from ${el.dataset.url}`)
			let json = await phtmx.loadJson(el.dataset.url)
			//phtmx.log(json)
			if (json){
				let template = phtmx.data(el.dataset.template, el)
				json.forEach(item =>{
					let clon = template.content.cloneNode(true);
					let card = phtmx.$('[data-card]', clon)
					let names = phtmx.$$('[data-name]', card)
					//phtmx.log(names)
					names.forEach(element => {element.innerText = item[element.dataset.name]});
					el.appendChild(clon)
				})
				//phtmx.log(json)
				//phtmx.setRequestOnLoad(true)
			}
		})
	}

	phtmx.setDebug(1)
	phtmx.log('The page has fully loaded')
	
	//phtmx.setRequestOnLoad(true)
	phtmx.setDynamicHandlers(cardsHandlers)
	phtmx.addDynamicElements(500)
}

window.addEventListener('load', load)
