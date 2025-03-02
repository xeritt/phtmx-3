export var storage = {
	vars: new Map()
}
export function get(name) {return storage.vars.get(name)}
export function val(name) {return storage.vars.get(name).value}

function addVar(dt) {
		storage.vars.set(dt.name, {
				name: dt.name,
				value: dt.value
		})
}
vars.forEach(el => {addVar(el.dataset)})

function compute() {
		const funcs = document.querySelectorAll("[data-func]")
		funcs.forEach(el => {
				let dt = el.dataset
				let args = dt.args.split(',').map((x) => valByName(x.trim())).join(', ')
				const str = dt.func + '(' + args + ')'
				log('func =', str)
				//const func = new Function(str)
				//dt.value = func()
				dt.value = eval(str)
				addVar(dt)
		})
}
