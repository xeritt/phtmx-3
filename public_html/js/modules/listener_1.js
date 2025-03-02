let debug = true;
export function setDebug(val){ debug = val; } 
export function log(mes) {if (debug) console.log(mes) }
export function logerr(mes) {if (debug) console.error(mes) }
export function sleep(ms) {return new Promise(resolve => setTimeout(resolve, ms));}


/**
 * go('Index/edit')
 * @param {type} params
 * @returns {String}
 */
export function go(route){
    //'index.php?page=Index&action=menu'
    let str = route.split('/');
    let res = 'index.php?model=' + str[0] + '&action=' + str[1];
    //log(res);
    return res;
}
/**
 * Функция для отбора параметров кроме model и action
 * @param {type} p
 * @returns {unresolved}
 */
function getParamsWithoutModelAction(p) {
    if (p[0] != 'model' && p[0] != 'action')
        return p;
    return null;
}

/**
 * Переход по ссылке с параметраметрами 
 * goParams('Index/edit')
 * @param {type} route
 * @returns {undefined|String}
 */
export function goParams(route){
    const paths = window.location.search;
    let path = paths.split('?');
    if (!path[1]) return;
    
    const params = new URLSearchParams(path[1]);
    //log(params);
    let entries = params.entries().filter(getParamsWithoutModelAction);
    
    let paramsStr = '';
    //log('PaRAMMMSSSSS------------->');
    for (const p of entries) {
        //log(p);
        //log(p[0]+'|'+p[1]);
        paramsStr += '&' + p[0] + '=' + p[1];//params.get("model");
    }
    let str = route.split('/');
    //let res = 'index.php?model=' + str[0] + '&action=' + str[1];
    let res = 'index.php?model=' + str[0] + '&action=' + str[1] + paramsStr;
    return res;
}

/**
 * 
 * @type Boolean|val запрос на запуск команды AddLoadAll
 */
export let requestOnLoad = false;
export function getRequestOnLoad(){ return requestOnLoad; }
export function setRequestOnLoad(val){ requestOnLoad = val; }

let classNames = {
  addLoadTextMenuAll: '.loadTextMenu',
  addLoadTextAll: '.loadText',
  addLoadDialogAll: '.loadDialog',
  addLinkButtonAll: '.linkButton',
  addActionCloseAll: '.actionClose',
  addActionSubmitAll: '.actionSubmit',
  addLoadDynamicTextAll: '.loadDynamicText',
  addLoadDynamicToggleButtonAll:'.toggleButton',
  addloadDynamicStyleAll: 'loadDynamicStyle'
};
export function setClassNames(val){ classNames = val; }
export function getClassNames(){ return classNames; }
/*
 * 
 * Добавляет все обработчики классов
 */
export function addLoadAll() {
    const names = getClassNames();
    //log('addLoadAll start');
    addLoadTextMenuAll(names.addLoadTextMenuAll);
    addLoadTextAll();
    addLinkButtonAll();
    addLoadDialogAll(names.addLoadDialogAll);
    addActionCloseAll();
    addActionSubmitAll(names.addActionSubmitAll);
    
    addLoadDynamicTextAll(names.addLoadDynamicTextAll);
    addLoadDynamicToggleButtonAll(names.addLoadDynamicToggleButtonAll);
    addLoadDynamicStyleAll(names.loadDynamicStyleAll);
}

/** Запускает по интервалу сканирование классов для подключения 
 *  новых обработчиков если есть запрос на загрузку в 
 *  переменной requestOnLoad 
 * 
 * @param {type} delay интервал между запуском сканирования классов
 * @returns {undefined}
 */
export function addDynamicElements(delay) {
    let resolve = () => {
        log('addDynamicElements');
        if (getRequestOnLoad()){
            log('addLoadAll Request');
            addLoadAll();
            setRequestOnLoad(false);
        }    
    };
    //resolve();
    setInterval(resolve, delay);
}

export function addListener(itemId, resolve, eventName = 'click') {
    let element = document.getElementById(itemId);
    if (!element) return;
    //if (element.dataset.listener == eventName) return;
    if (element.dataset.listener){
        if (element.dataset.listener.indexOf(eventName) === 0) return;
    }    
    element.addEventListener(eventName, resolve);
    if (element.dataset.listener)
        element.dataset.listener += eventName + ' ';
    else 
        element.dataset.listener = eventName + ' ';
}

/**
 * 
 * @param {type} element
 * @param {type} resolve
 * @param {type} eventName
 */
export function addListenerElement(element, resolve, eventName = 'click') {
    if (element.dataset.listener){
        if (element.dataset.listener.indexOf(eventName) === 0) return;
    }    
    log('Element Add Listener = ' + element.id);
    element.addEventListener(eventName, resolve);
    if (element.dataset.listener)
        element.dataset.listener += ' ' + eventName;
    else 
        element.dataset.listener = eventName;
}

export function prepareParams(button) {
    let params = {};
    if (button.dataset.method) {
        params = {
            method: button.dataset.method
        };
        if (button.dataset.body) {
            params.body = JSON.stringify(button.dataset.body);
        }
        if (button.dataset.type) {
            params.headers = {
                "Content-Type": button.dataset.type
            }
        }
        if (button.dataset.mode) {
            params.mode = button.dataset.mode;
        } else {
            params.mode = "cors";//, // no-cors, *cors, same-origin
        }    
    }
    return params;
}
/**
 * Добавление закрузки текста в container по click
 * 
 * @param {type} itemId
 * @param {type} container
 * @param {type} url
 * @param {type} timeout
 * @returns {undefined}
 */
export function addLoadText(itemId, container, url, timeout = 0) {
    let button = document.getElementById(itemId);
    if (!button) return;
    //button.addEventListener('click', (e) => {
    addListenerElement(button, (e) => { 
        
        if (button.dataset.confirm) {
            if (confirm(button.dataset.confirm)) {
                //location.href = item.dataset.href;
            } else {
                return false;
            }    
        }

        e.preventDefault();
        //e.classList.add("pressed");
        let div = document.getElementById(container);
        //console.error('Click!' + container);
        if (!div) {
            console.error('Error!. No target div id=' + container);
            return;
        }
        let params = prepareParams(button);
        log(params);
        fetch(url, params)
                //fetch(url)
                .then((response) => response.text())
                .then(async (text) => {
                    await sleep(timeout);
                    div.innerHTML = text;
                    //addLoadAll();
                    loadByClick(url);
                    setRequestOnLoad(true);
                    //requestOnLoad = true;
                });
    });
}
/**
 * Динамическая загрузка по timeout после загрузки основной страницы.
 * 
 * @param {type} container
 * @param {type} url
 * @param {type} timeout
 * @returns {undefined}
 */
export async function loadDynamic(container, url, timeout = 0) {
    log('Start Dyn Load to container id=' + container);
    let div = document.querySelector(container);
    if (!div) {
        console.error('No container ' + container + ' to load');
        return;
    }
    if (timeout>0) await sleep(timeout);
    fetch(url)
            //.then((response) => response.json())
            .then((response) => response.text())
            .then((data) => {
                //log(data);  
                //div.innerHTML = 'Dynamic load:' + data.text;
                div.innerHTML = data;
                //addLoadAll();
                requestOnLoad = true;
                
                checkMenuItemSelect();
            });
    log('End Dyn Load');
}

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
                        requestOnLoad = true;
                    });

        } catch (error) {
            console.error(`Download error: ${error.message}`);
        }
    });
}


/*
 <button id="button_load_htmx" 
 class="loadText" 
 data-url="test.html" 
 data-target="htmx"
 data-timeout="0"
 data-confirm="Do you realy want?"
 >Load htmx</button>
 <div id="htmx"></div>
 */
export function addLoadTextAll(className = '.loadText') {
    log('addLoadTextAll start');
    let loadText = document.querySelectorAll(className);
    log(loadText);
    loadText.forEach(async (item) => {
        log('addLoadTextAll id= ' + item.id);
        addLoadText(item.id, item.dataset.target, item.dataset.url, item.dataset.timeout);
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
 <button data-href="http://localhost" data-confirm="Do you realy want?" class="linkButton" title="Localhost">Home</button>
 <a data-href="https://ya.ru/" data-confirm="Do you realy want?" class="linkButton" title="Ya.ru" href="#" target="_blank">Home</a>
 */
export function addLinkButtonAll(className = '.linkButton') {
    let links = document.querySelectorAll(className);
    links.forEach((item) => {
        if (item.title) {
            item.title += ' ' + item.dataset.href;
        } else {
            item.title = item.dataset.href;
        }
        addListenerElement(item, (e) => {
            e.preventDefault();
            if (item.dataset.confirm) {
                if (confirm(item.dataset.confirm)) {
                    location.href = item.dataset.href;
                }
                return false;
            }
            location.href = item.dataset.href;
        });
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

//export function addLoadDialog(itemId, container, url, timeout = 0) {
export function addLoadDialog(item) {
    let itemId = item.id;
    let container = item.dataset.target;
    let url = item.dataset.url;
    let timeout = item.dataset.timeout;
    let script = item.dataset.script;
    let button = document.getElementById(itemId);
    if (!button) return;
    //if (button.getAttribute('listener') === 'true') return;
    addListenerElement(button, (e) => {
    //button.addEventListener('click', (e) => {
        e.preventDefault();
        //e.classList.add("pressed");
        let div = document.getElementById(container);
        log('Click!' + container);
        if (!div) {
            console.error('Error!. No target div id=' + container);
            return;
        }
        let params = prepareParams(button);
        log(params);
        fetch(url, params)
                //fetch(url)
                .then((response) => response.text())
                .then(async (text) => {
                    await sleep(timeout);
                    div.innerHTML = text;

                    const scriptName = itemId + '-script';
                    let dialogScript = document.getElementById(scriptName);
                    if (dialogScript == null){
                        let dialogUrl = url + '.js';
                        log('Dialog script 1' + script);
                        if (script != null) {
                            dialogUrl = script;
                        }
                        log('Dialog script 2' + dialogUrl);
                        log('Load Dialog script ' + scriptName);
                        try {
                            let sc = document.createElement('script');
                            sc.setAttribute('id', scriptName);
                            sc.setAttribute('src', dialogUrl);
                            //type="module"
                            //sc.setAttribute("type", "module"); 
                            sc.setAttribute("type", "text/javascript"); 
                            document.head.appendChild(sc);
                        } catch (error) {
                          logerr(error);
                        }
                    }
                    
                    setRequestOnLoad(true);
                    const dialog = document.getElementById(container);
                    log('Load dialog id=' + container);
                    log(dialog);
                    dialog.showModal();
                });
    });
}

 
/*
 <button id="button_load_htmx" 
 class="loadText" 
 data-url="test.html" 
 data-target="htmx"
 data-timeout="0"
 data-script="/js/form.submit.js"
 >Load htmx</button>
 <dialog id="htmx"></dialog>
 */
export function addLoadDialogAll(className = '.loadDialog') {
    //log('addLoadTextAll start');
    let loadText = document.querySelectorAll(className);
    log(loadText);
    loadText.forEach(async (item) => {
        log('addLoadDialogAll id= ' + item.id);
        //addLoadDialog(item.id, item.dataset.target, item.dataset.url, item.dataset.timeout);
        addLoadDialog(item);
    });
}


/*
 <button id="closeDialog" 
 class="actionClose" 
 data-target="htmx"
 >Load htmx</button>
 <dialog id="htmx"></dialog>
 */
export function addActionCloseAll(className = '.actionClose') {
    //log('addLoadTextAll start');
    let loadText = document.querySelectorAll(className);
    log(loadText);
    loadText.forEach(async (item) => {
        log('addActionCloseAll id= ' + item.id);
        addListenerElement(item, (e) => {
        //item.addEventListener("click", () => {
          const dialog = document.getElementById(item.dataset.target);  
          log('close dialog listener');
          dialog.close();
        });
        
        //addLoadDialog(item.id, item.dataset.target, item.dataset.url, item.dataset.timeout);
    });
}

/*
 <button id="confirmDialog" 
 class="actionConfirm" 
 data-target="htmx"
 >Load htmx</button>
 <dialog id="htmx"></dialog>
 */
export function addActionConfirmAll(className = '.actionConfirm') {
    //log('addLoadTextAll start');
    let loadText = document.querySelectorAll(className);
    log(loadText);
    loadText.forEach(async (item) => {
        log('addactionConfirmAll id= ' + item.id);
        addListenerElement(item, (e) => {
        //item.addEventListener("click", () => {
          const dialog = document.getElementById(item.dataset.target);  
          log('Confirm dialog listener');
          dialog.close();
        });
        
        //addLoadDialog(item.id, item.dataset.target, item.dataset.url, item.dataset.timeout);
    });
}

async function execApi(formData, path){

    let response = await fetch(path, {
        method: 'POST',
        body: formData
    }).catch((error) => console.log(error));
    
    let result = await response.text();//json();
    
    return result;
}

export async function submitForm(containerId, formId){
    const form = document.getElementById(formId);
    let formData = new FormData(form);
    let path = form.getAttribute("action");
    let res = await execApi(formData, path);
    //let div = document.getElementById(containerId);
    //div.innerHTML = res;
    //setRequestOnLoad(true);
    return res;
    //form.submit();
} 
 
/*
 <button id="actionSubmit" 
 class="actionSubmit" 
 data-target="htmx"
 data-form="formId"
 data-dialogclose="dialog"
 >Load htmx</button>
 <dialog id="htmx"></dialog>
 */
export function addActionSubmitAll(className = '.actionSubmit') {
    //log('addLoadTextAll start');
    let loadText = document.querySelectorAll(className);
    log(loadText);
    loadText.forEach(async (item) => {
        log('addactionSubmitAll id= ' + item.id);
        addListenerElement(item, async (e) => {
          let res = await submitForm(item.dataset.target, item.dataset.form);
          if (item.dataset.dialogclose){
              const dialog = document.getElementById(item.dataset.dialogclose);  
              log('close dialog listener');
              dialog.close();
          }
          if (item.dataset.target){
              let div = document.getElementById(item.dataset.target);
              div.innerHTML = res;
          }
          const form = document.getElementById(item.dataset.form);
          const paths = form.getAttribute("action");
          log('path=' + paths);
          //let path = paths.split('?');
          //Переходим по клику если задан data-url
          loadByClick(paths);
          setRequestOnLoad(true);
        });
        
        //addLoadDialog(item.id, item.dataset.target, item.dataset.url, item.dataset.timeout);
    });
}

/*
 * Загрузка контента data-url по клику в data-target=item.id
 * проверка model и action из path
 * @param {type} paths
 * @param {type} className
 * @returns {undefined}
 */
export function loadByClick(paths, className = '.loadByClick') {
    let path = paths.split('?');
    if (!path[1]) return;
    
    let items = document.querySelectorAll(className);
    log(items);
    const params = new URLSearchParams(path[1]);
    for (const p of params) {
        log(p);
    }
    let model = params.get("model");
    let action = params.get("action");
    log('model=' + model);
    log('action=' + action);
    items.forEach(async (item) => {
        if (!item.dataset.models.includes(model)) return;
        if (!item.dataset.actions.includes(action)) return;
        log('LoadByClick ' + action);
        fetch(item.dataset.url)
            .then((response) => response.text())
            .then((data) => {
                let div = document.querySelector('#' + item.id);
                div.innerHTML = data;
                setRequestOnLoad(true);
            });
    });
}

/**
 *  Отложенная загрузка текста в контейнер по target
 *  <button id="loadDynamicText_id" 
 *   class="loadDynamicText" 
 *   data-url="test.html" 
 *   data-target="htmx"
 *   data-timeout="0"
 *   >Load htmx</button>
 *   <div id="htmx"></div>
 * @param {type} className
 * @returns {undefined}
 */
export function addLoadDynamicTextAll(className = '.loadDynamicText') {
    //log('addLoadTextAll start');
    let loadText = document.querySelectorAll(className);
    log(loadText);
    loadText.forEach(async (item) => {
        log('loadDynamicText id= ' + item.id);
        //loadDynamic('#' + item.dataset.target, item.dataset.url, item.dataset.timeout);
        //addLoadText(item.id, item.dataset.target, item.dataset.url, item.dataset.timeout);
        //setRequestOnLoad(false);
        let div = document.querySelector('#' + item.dataset.target);
        if (!div) {
            console.error('No container ' + container + ' to load');
            return;
        }
        //await sleep(item.dataset.timeout);
        fetch(item.dataset.url)
            //.then((response) => response.json())
            .then((response) => response.text())
            .then((data) => {
                div.innerHTML = data;
                setRequestOnLoad(true);
                //requestOnLoad = true;
                item.classList.remove(className.replace('.', ''));
            });
    });
    
    
    //setRequestOnLoad(false);
    
}

/**
 * Подключение кнопок переключателей
 * @param {type} className
 * @returns {undefined}
 */
export function addLoadDynamicToggleButtonAll(className = '.toggleButton') {
    //log('addLoadTextAll start');
    let items = document.querySelectorAll(className);
    //log(items);
    items.forEach(async (item) => {
        addListenerElement(item, (e) => {
            const toggle = document.getElementById(item.dataset.target);  
            toggle.classList.toggle('hide'); 
        });
    });
}    



export function addLoadDynamicStyleAll(className = '.loadDynamicStyle') {
    log('addLoadDynamicStyleAll start');
    let loadText = document.querySelectorAll(className);
    log(loadText);
    
    let loadedClasses = [];
    loadText.forEach(async (item) => {
        //Если Был уже загружен стиль
        if (loadedClasses.includes(item.dataset.class)) {
            item.classList.remove(className.replace('.', ''));
            return;
        }
        loadedClasses.push(item.dataset.class);
        
        log('loadDynamicStyle id= ' + item.dataset.class);
        let div = document.querySelector('#' + item.dataset.target);
        if (!div) {
            console.error('No container ' + container + ' to load style');
            return;
        }
        
        let loadedStyles = document.querySelectorAll('.dynamicStyle');
        log(loadedStyles);
        //Проверяем загружался ли ранее этот стиль
        for (let i = 0; i < loadedStyles.length; i++) {
            let st = loadedStyles[i];
            let stuid = item.dataset.class + 'Style';
            log('Style id = ' + st.id + ' == ' + stuid);
            if (st.id === stuid) {
                item.classList.remove(className.replace('.', ''));
                log('Style >>>> is loaded .....' + item.dataset.class);
                //notLoad = false;
                return;
            }
        }
        //await sleep(item.dataset.timeout);
        fetch(item.dataset.url)
            //.then((response) => response.json())
            .then((response) => response.text())
            .then((data) => {
                //log('DynamicStyleAll:');
                div.innerHTML = data;
                //setRequestOnLoad(true);
                //requestOnLoad = true;
                item.classList.remove(className.replace('.', ''));
            });
    });
    
    
    //setRequestOnLoad(false);
    
}
