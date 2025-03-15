async function load(){
	const phtmx = await import(`./phtmx/core.js`)

	const picsHandlers = () =>{
		const picsPath = '/pics/'
		phtmx.handler('data-log', (el) => {phtmx.log(el.dataset.log)})
		
		const listPictures = (el) => {
			let comp = phtmx.component(el)
			let name = comp.dataset.list
			return phtmx.data(name, comp)
		}

		const picture = (component) =>{
			let name = component.dataset.pic
			return phtmx.data(name)
		}

		const link = (text, url) =>{
			const button = document.createElement('button')
			button.dataset.piclink = true
			button.dataset.url = url
			button.innerText = text
			return button
		}
		const br = () => document.createElement('br')

		phtmx.handler_once('data-pic', async (el) => {
			phtmx.log(`Load pictures from ${el.dataset.url}`)
			let text = await phtmx.loadText(el.dataset.url)
			if (text){
				let pics = text.split("\n");
				let buffer = listPictures(el)
				pics.forEach(pic => {
					if (pic) {
						buffer.append(link(pic, picsPath + pic))
					}
				});
				phtmx.setRequestOnLoad(true)
			}
		})

		phtmx.on_selector('click', '[data-piclink]', (el) => {
			let comp = phtmx.component(el)
			let pic = picture(comp)
			pic.src = el.dataset.url
			comp.dataset.current =  el.dataset.url
		})

		phtmx.on_selector('click', '[data-btnend]', (el) => {
			let list = listPictures(el)
			let links = phtmx.$$('[data-piclink]', list)
			let current = links[links.length - 1]
			if (current){
				let comp = phtmx.component(el)
				let pic = picture(comp)
				pic.src = current.dataset.url
				comp.dataset.current = current.dataset.url
			}
		})

		phtmx.on_selector('click', '[data-btnstart]', (el) => {
			let list = listPictures(el)
			let links = phtmx.$$('[data-piclink]', list)
			if (links.length > 0){
				let current = links[0]
				let comp = phtmx.component(el)
				let pic = picture(comp)
				pic.src = current.dataset.url
				comp.dataset.current = current.dataset.url
			}
		})

		phtmx.on_selector('click', '[data-btnback]', (el) => {
			let list = listPictures(el)
			let links = phtmx.$$('[data-piclink]', list)
			if (links.length > 0){
				let i = 0
				let comp = phtmx.component(el)
				for (i = 0; i <links.length; i++) {
					const l = links[i];
					if (l.dataset.url == comp.dataset.current) break;
				}	
				let current = links[i - 1]
				if (current){
					let pic = picture(comp)
					pic.src = current.dataset.url
					comp.dataset.current = current.dataset.url
				}	
			}
		})


		phtmx.on_selector('click', '[data-btngo]', (el) => {
			let list = listPictures(el)
			let links = phtmx.$$('[data-piclink]', list)
			if (links.length > 0){
				let i = 0
				let comp = phtmx.component(el)
				for (i = 0; i <links.length; i++) {
					const l = links[i];
					if (l.dataset.url == comp.dataset.current) break;
				}	
				let current = links[i + 1]
				if (current){
					let pic = picture(comp)
					pic.src = current.dataset.url
					comp.dataset.current = current.dataset.url
				}	
			}
		})

		phtmx.on_by_name('load', 'pic', (el) => {
			phtmx.log('load')
			let comp = phtmx.component(el)
			let info = phtmx.data('info', comp)
			info.innerText = el.src
		})	
		
	}
	phtmx.setDebug(1)
	phtmx.log('The page has fully loaded')
	
	//phtmx.setRequestOnLoad(true)
	phtmx.setDynamicHandlers(picsHandlers)
	phtmx.addDynamicElements(500)
}

window.addEventListener('load', load)
