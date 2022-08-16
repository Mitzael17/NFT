/*export function isWebp() {
    function testWebp(callback) {
        let webP = new Image();
        webP.onload = webP.onerror = function () {
            callback(webP.height == 2);
        };
        // webp.src = 
    }

    testWebp(function (support) {
        let className = support === true ? 'webp' : 'no-webp';
        document.documentElement.classList.add(className);
    });
}*/

export function support_format_webp()
{
 let elem = document.createElement('canvas');

 if (!!(elem.getContext && elem.getContext('2d'))) {
  document.documentElement.classList.add('webp');
 } else {
  document.documentElement.classList.add('no-webp');
 }
}


export function burger(burger, menu, blockBody = true, buttons = false, medias = false, additionalBlocks = false) {

    burger = document.querySelector(burger);
    menu = document.querySelector(menu);

    if(buttons) {
        for(let button of buttons) button.addEventListener('click', burgerMenu);
    }


    burger.addEventListener('click', burgerMenu);

    function burgerMenu(event) {

        if(buttons && medias) {
            if([...buttons].find( (button, index) => button === event.target && medias[index] <= window.innerWidth) ) {
                return false;
            }
        }

        burger.classList.toggle('active');
        menu.classList.toggle('active');
        if(blockBody) document.documentElement.classList.toggle('blocked');
        if(additionalBlocks) {
            for(let block of additionalBlocks) {
                block.classList.toggle('active');
            }
        }
    }
}


export async function AJAX(url, settings = {}) {

    settings.method = settings.method ? settings.method : 'GET';
    settings.headers = settings.headers ? settings.headers : {'Content-Type': 'application/json;charset=utf-8'};
    
    let promise = await fetch(url, settings);

    return(promise);

}


export function resize(callback) {
    callback();
    window.addEventListener('resize', callback);
}


export function patternInput() {

    Array.prototype.forEach.call(document.body.querySelectorAll("*[data-mask]"), applyDataMask);

    function applyDataMask(field) {
        var mask = field.dataset.mask.split('');
        
        // For now, this just strips everything that's not a number
        function stripMask(maskedData) {
            function isDigit(char) {
                return /\d/.test(char);
            }
            return maskedData.split('').filter(isDigit);
        }
        
        // Replace `_` characters with characters from `data`
        function applyMask(data) {
            return mask.map(function(char) {
                if (char != '_') return char;
                if (data.length == 0) return char;
                return data.shift();
            }).join('')
        }
        
        function reapplyMask(data) {
            return applyMask(stripMask(data));
        }
        
        function changed() {   
            var oldStart = field.selectionStart;
            var oldEnd = field.selectionEnd;
            
            field.value = reapplyMask(field.value);
            
            field.selectionStart = oldStart;
            field.selectionEnd = oldEnd;
        }
        
        field.addEventListener('click', changed)
        field.addEventListener('keyup', changed)
    }

}