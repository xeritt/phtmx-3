async function load(){
	const phtmx = await import(`./phtmx/core.js`)

	const calcHandlers = () =>{
		phtmx.handler('data-log', (el) => {phtmx.log(el.dataset.log)})
		const result = (el) => phtmx.$('[data-name=result]', phtmx.component(el))
		const argument = (el) => phtmx.$('[data-name=arg]', phtmx.component(el))
		const format = (x) => parseFloat(x)		

		phtmx.on_selector('click', '[data-calc]', (el) => {
			let res = result(el)
			if (res.value == 0){
				if (res.value.indexOf('.') != -1){
					res.value = '' + res.value + el.innerHTML	
				} else {	
					res.value = el.innerHTML
				}
			}	
			else {
				res.value ='' + res.value + el.innerHTML
			}	
		})
		
		const clearArg = (el) =>{
			let arg = argument(el)
			arg.innerHTML = ''
			arg.dataset.one = ''
			arg.dataset.value = ''
			arg.dataset.action = ''
		}

		phtmx.on_selector('click', '[data-reset]', (el) => {
			let res = result(el)
			res.value = 0
			clearArg(el)
		})
		
		const exec = (name, a, b) =>{
			if (name == 'plus') return a + b
			if (name == 'minus') return a - b
			if (name == 'multi') return a * b
			if (name == 'divide') return a / b
		}

		const execOne = (name, a ) =>{
			if (name == 'sin') return Math.sin(a)
			if (name == 'cos') return Math.cos(a)
			if (name == 'tan') return Math.tan(a)
		}
		
		phtmx.on_selector('click', '[data-func]', (el) => {
			let func = el.dataset.func
			let arg = argument(el)
			let one = el.dataset?.one;
			let res = result(el) 
			let res_val = format(res.value)
			let val = 0
			if (arg.dataset.value && func){
				val = format(arg.dataset.value)
				if (one){
					res.value = execOne(func, res_val)
				} else {
					arg.dataset.value = exec(func, val, res_val)
				}
			} else {
				if (one){
					res.value = execOne(func, res_val)
				}else {
					arg.dataset.value =  res_val
				}
			}

			if (!one){
				arg.innerHTML += res_val + el.innerHTML
				arg.dataset.action = el.dataset.func
				res.value = 0
			}
		})

		phtmx.on_selector('click', '[data-ravno]', (el) => {
			let res = result(el)
			let arg = argument(el)
			let func = arg.dataset.action 
			if (arg.dataset.value){
				let val = format(arg.dataset.value)
				res.value = exec(func, val, format(res.value))
			}
			clearArg(el)
		})

		phtmx.on_selector('click', '[data-del]', (el) => {
			let res = result(el)
			let val = res.value
			res.value = val.substring(0, val.length - 1);
			if (val.length == 0) res.value = 0
		})	
	}

	const cals2Hadlesrs = () =>{
		phtmx.on_selector('click', '[data-calc]', (el) => {
			let comp = compnent(el)
			phtmx.log(comp)
			let res = phtmx.$('[data-name=result]', comp)
			let arg = phtmx.$('[data-name=arg]', comp)
			phtmx.log(res)
			phtmx.log(arg)

		})	

	}

	phtmx.setDebug(1)
	phtmx.log('The page has fully loaded')
	
	//phtmx.setRequestOnLoad(true)
	phtmx.setDynamicHandlers(calcHandlers)
	phtmx.addDynamicElements(500)
}

window.addEventListener('load', load)
