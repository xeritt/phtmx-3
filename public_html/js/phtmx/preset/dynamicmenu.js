import {log, logerr, addListener, addListenerElement, sleep, setRequestOnLoad, execApi} from "./../core.js"

export function menuReset(menu) {
	let buttons = menu.children;
	if (buttons) {
			for (let button of buttons) {
					button.classList.remove("pressed");
			}
	}
}

export function addLoadTextMenuItem(menu, item, containerId, url, timeout = 0) {
	let button = document.getElementById(item);
	if (!button)
			return;
	//if (button.classList.contains('pressed')) {
	//log('pressed reaction ' + url);
	//loadDynamic('#' + container, url, 0);
	//}
	//button.addEventListener('click', (e) => {
	addListenerElement(button, (e) => {        
			log('Click menu');
			try {
					e.preventDefault();
					let div = document.getElementById(containerId);
					if (!div)
							return;
					let params = prepareParams(button);
					//log(params);
					fetch(url, params)
									.then((response) => response.text())
									.then(async (data) => {
											//log(data);
											//log(JSON.stringify(json, null, 2));
											await sleep(timeout);
											div.innerHTML = data;
											//let state = {page: url};
											//history.pushState(state, "", url);
											//log('Push ' + url + ' state:');
											//log(state);
											menuReset(menu);
											button.classList.add("pressed");
											// addLoadAll();
											setRequestOnLoad(true);
									});

			} catch (error) {
					logerr(`Download error: ${error.message}`);
			}
	});
}

/*
<div id="Mymenu" data-target="page" class="loadTextMenu">
<button data-href="/index.html">Home</button>
<button data-url="pages/about.php" data-method="post" data-body="{i:100}" data-type="application/json">About</button>
<button data-url="pages/contact.html">Contact</button>
<button data-url="pages/blog.html">Blog</button>
</div>    
<div id="page"></div>
*/
export function addLoadTextMenuAll(className = '.loadTextMenu') {
	let loadTextMenu = document.querySelectorAll(className);
	loadTextMenu.forEach((item) => {
			let target = item.dataset.target;
			let buttons = item.children;
			if (buttons) {
					let i = 0;
					for (const button of buttons) {

							if (!button.id) {
									let newId = item.id + '_item' + i;
									//log('id=' + newId);
									button.setAttribute("id", newId);
							}

							if (button.dataset.href) {
									//button.setAttribute("title", button.dataset.href);
									addListener(button.id, () => {
											location.href = button.dataset.href;
									});
									i++;
									continue;
							}

							if (!button.dataset.url)
									continue;
							addLoadTextMenuItem(item, button.id, target, button.dataset.url, button.dataset.timeout);
							i++;
					}
			}
	});
}


/*
<nav class="aside-menu">
	<div class="aside-menu__item"><a href="index.html" class="aside-menu__item-link is-active">Главная</a></div>
	<div class="aside-menu__item"><a href="records.html" class="aside-menu__item-link">Записи лекций</a></div>
	<div class="aside-menu__item"><a href="protection.html" class="aside-menu__item-link">Защита проектов</a></div>
	<div class="aside-menu__item"><a href="projects.html" class="aside-menu__item-link">Лучшие проекты</a></div>
	<div class="aside-menu__item"><a href="photo.html" class="aside-menu__item-link">Фотоальбом</a></div><div class="aside-menu__item"><a href="press.html" class="aside-menu__item-link">СМИ о Школе</a></div>
	<div class="aside-menu__item"><a href="register.html" class="aside-menu__item-link">Регистрация</a></div>
	<div class="aside-menu__item"><a href="https://chat.whatsapp.com/KE1QfA66hFU09It1nuSyGf" class="aside-menu__item-link">Обратная связь</a></div>
</nav>
*/
export function checkMenuItemSelect(className = '.aside-menu'){
	let loadTextMenu = document.querySelectorAll(className);
	log('loadTextMenu=', loadTextMenu);
	loadTextMenu.forEach((item) => {
			//let target = item.dataset.target;
			let divs = item.children;
			//log('divs=', divs);
			//let activeIndex = -1; 
			for (let i = 0; i < divs.length; i++) {
			//divs.forEach((div) => {
					//log('div=', divs[i].children[0]);
					let lnk = divs[i].children[0];
					if (lnk) {
							let url = lnk.href;
							let menufilename = url.substring(url.lastIndexOf('/') + 1);
							
							let wurl = window.location.pathname;
							let wfilename = wurl.substring(wurl.lastIndexOf('/') + 1);
							//log('lnk.href', menufilename, wfilename);
							if (wfilename === menufilename){
									lnk.classList.add('is-active');
									break;
									//activeIndex = i;
							} 
				 }    
			}
			//if (activeIndex > -1){
				//  let lnk = divs[activeIndex].children[0];
					//lnk.classList.add('is-active');
			//}
			
	});    
}