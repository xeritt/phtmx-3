async function load(){
	const phtmx = await import(`./phtmx/core.js`)

	const allHandlers = () =>{
		//dynamicload.addLoadAll()
		phtmx.handler('data-log', (el) => {phtmx.log(el.dataset.log)})
		phtmx.on_selector('click', '[data-calc]', (el) => {
			let name = el.dataset.calc
			let res = phtmx.data(name)
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
		
		const clear = () =>{
			/*
			phtmx.data('arg').innerHTML = ''
			phtmx.data('arg').dataset.one = ''
			phtmx.data('arg').dataset.value = ''
			phtmx.data('arg').dataset.action = ''
			*/
			phtmx.data('func').innerHTML = ''
			phtmx.data('func').dataset.value = ''
		}
		const getArgName = (el) =>{
			let name = el.dataset.res
			let res = phtmx.data(name)
			return res.dataset.arg
		}

		const clearArg = (el) =>{
			//let name = el.dataset.res
			//let res = phtmx.data(name)
			let arg = getArgName(el)// res.dataset.arg
			phtmx.data(arg).innerHTML = ''
			phtmx.data(arg).dataset.one = ''
			phtmx.data(arg).dataset.value = ''
			phtmx.data(arg).dataset.action = ''
		}

		phtmx.on_selector('click', '[data-reset]', (el) => {
			let name = el.dataset.res
			let res = phtmx.data(name)
			res.value = 0
			//clear()
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

		const format = (x) => parseFloat(x)
		phtmx.on_selector('click', '[data-func]', (el) => {
			let func = el.dataset.func

			let arg = phtmx.data(getArgName(el))
			let name = el.dataset.res
			let one = el.dataset?.one;
			let res = phtmx.data(name)
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
				//phtmx.data('func').dataset.value = el.dataset.func
				arg.dataset.action = el.dataset.func
				res.value = 0
			}
			//phtmx.log(arg.innerHTML) 
		})

		phtmx.on_selector('click', '[data-ravno]', (el) => {
			let name = el.dataset.res
			let res = phtmx.data(name)
			let arg = phtmx.data(res.dataset.arg)
			let func = arg.dataset.action //phtmx.val('func')//phtmx.data('func').dataset.value
			//let one = arg.dataset?.one;
			if (arg.dataset.value){
				let val = format(arg.dataset.value)
				res.value = exec(func, val, format(res.value))
			}// else {
				//res.value = arg.dataset.value
		///	}
			clearArg(el)
		})

		phtmx.on_selector('click', '[data-del]', (el) => {
			let name = el.dataset.del
			let res = phtmx.data(name)
			let val = res.value
			res.value = val.substring(0, val.length - 1);
			if (val.length == 0) res.value = 0
		})	
	}

	phtmx.setDebug(1)
	phtmx.log('The page has fully loaded')
	
	//phtmx.setRequestOnLoad(true)
	phtmx.setDynamicHandlers(allHandlers)
	phtmx.addDynamicElements(500)
}

window.addEventListener('load', load)
