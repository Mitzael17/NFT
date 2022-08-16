export function validationCheck(form, excepts = []) {

    let patternEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let lengthPhone = 17;
    let elements = form.querySelectorAll('textarea, input');
    let validation = true;

    elements.forEach( element => {

        let type = element.getAttribute('type');

        switch (type) {

            case 'tel':

                if(element.value.length < lengthPhone) {
                    makeMistake(element);
                    validation = false;
                }

            break;

            case 'radio':

                let name = element.getAttribute('name');

                if(
                    ![...form.querySelectorAll(`input[name="${name}"]`)]
                    .find( radio => radio.checked)
                ) {
                    makeMistake(element.closest('.radio-container'));
                    validation = false;
                }

            break;

            case 'checkbox':

            break;

            default:

                if(element.classList.contains('email')) {

                    if(!element.value.match(patternEmail)) {
                        makeMistake(element);
                        validation = false;
                    }

                } else {
                        if(element.value.length < element.getAttribute('minlength') || element.value.length > element.getAttribute('maxlength')) {
                        makeMistake(element);
                        validation = false;
                    }
                }

            break;

        }

    })

    function makeMistake(element) {
        
        element.style.border = '1px solid red';
    
        element.addEventListener('focus', () => element.style.border = '', {once:true});
        element.addEventListener('click', () => element.style.border = '', {once:true});
    
    }

    return validation;
}


export function addressInput(forms) {

    let url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
    let token = '14dbf845efde22f64536669c02052e6366f65aba';
    let count = 10;
    
    let options = {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Token " + token,
        },
    };
    
    forms.forEach( form => {
        [].forEach.call(form.querySelectorAll('.address'), function(input) {

            let hints = input.parentElement.querySelector('.popup__address-hints');
            let children = hints.children;
            let activeIndex = 0;
            let query = '';

            buildHintBlocks(count);
    
    
            input.addEventListener('blur', (event) => {

                
                    hints.parentElement.style.display = 'none';
                    buildHintBlocks(0);

            });
        
        
            hints.addEventListener('pointerdown', chooseHint);
            input.addEventListener('keydown', function(event) {  

                if(event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'Escape' || event.key === 'Enter') {

                    event.preventDefault();

                    chooseHint(event);
        
                    return false;
                }
        
                input.addEventListener('keyup', () => {

                    query = this.value;  
        
                    if(query.length) {
            
                        options.body = JSON.stringify(
                            {
                            query: query,
                            count: count,
                            language: 'ru',
                
                        }),
            
                        fetch(url, options)
                        .then(response => response.json())
                        .then(result => {
                            
                            let activeItem = hints.querySelector('.hint-active')
            
                            if(activeItem) activeItem.classList.remove('hint-active');
            
                            hints.scrollTop = 0;
    
                            if(hints && result.suggestions.length) {
            
                                hints.parentElement.style.display = 'block';
            
                                if(!result.suggestions) input.dispatchEvent(new Event('blur'));
            
                                if(children.length !== result.suggestions.length) {
            
                                    buildHintBlocks(result.suggestions.length);
            
                                }
            
                                result.suggestions.forEach( (suggest, index) => {
            
                                    children[index].innerHTML = suggest.value;
            
                                });
            
                            } else {
                                input.dispatchEvent(new Event('blur'));
                            }
            
                        })
                        .catch(error => console.log("error", error));
                    } else {
                        input.dispatchEvent(new Event('blur'));
                    }
                }, {once: true})
                
            });

           

            function chooseHint(event) {
                
                if(hints.children.length) {

                    let activeItem = hints.querySelector('.hint-active');
                    
                    if(event.key) {

                        switch (event.key) {
        
                            case 'ArrowUp':
            
                                activeItem = activeItem ? activeItem : children[0];
            
                                activeIndex = [...children].indexOf(activeItem) <= 0 ? null : --activeIndex;
            
                            break;
            
                            case 'ArrowDown':
                                
                                activeItem = activeItem ? activeItem : children[children.length - 1];
            
                                activeIndex = [...children].indexOf(activeItem) === children.length - 1 ? 0 : ++activeIndex;
            
                            break;
            
                            default: 
            
                            input.dispatchEvent(new Event('blur'));
                            return false;
            
                            break;
            
                        }

                    } else {
        
                        let target = event.target.closest('.hint');

                        if(!target) return false;
        
                        if(target.classList.contains('hint-active')) return false;
        
                        activeIndex = [...children].indexOf(target);
        
                    }
                    
        
                    if(activeItem) activeItem.classList.remove('hint-active');

                    if(activeIndex === null) {
                        input.value = query;
                        return false;
                    };
        
                    children[activeIndex].classList.add('hint-active');
        
                    input.value = children[activeIndex].innerHTML;

                    if(event.key) {

                        if(children[activeIndex].offsetTop > hints.offsetHeight - 30) hints.scrollTop = children[activeIndex].offsetTop - hints.offsetHeight + children[activeIndex].offsetHeight + 30;
                        else if (children[activeIndex].offsetTop <= hints.offsetHeight) hints.scrollTop = 0;
                        

                    }
                }
            }
        
        
            function buildHintBlocks(count) {
        
                if(children.length) [...children].forEach( element => element.remove());
        
                if(hints) {
        
                    for(let i = 0; i < count; i++) {
            
                        let div = document.createElement('div');
                        div.classList.add('hint');
                
                        hints.append(div);
                        
                    }
            
                }
        
            }
        });
    })


};


export function phoneInput(forms) {

    forms.forEach( form => {
        [].forEach.call( form.querySelectorAll('.tel'), function(input) {
            var keyCode;
            function mask(event) {
                event.keyCode && (keyCode = event.keyCode);
                var pos = this.selectionStart;
                if (pos < 3) event.preventDefault();
                var matrix = "+7 (___) ___ ____",
                    i = 0,
                    def = matrix.replace(/\D/g, ""),
                    val = this.value.replace(/\D/g, ""),
                    new_value = matrix.replace(/[_\d]/g, function(a) {
                        return i < val.length ? val.charAt(i++) || def.charAt(i) : a
                    });
                i = new_value.indexOf("_");
                if (i != -1) {
                    i < 5 && (i = 3);
                    new_value = new_value.slice(0, i)
                }
                var reg = matrix.substr(0, this.value.length).replace(/_+/g,
                    function(a) {
                        return "\\d{1," + a.length + "}"
                    }).replace(/[+()]/g, "\\$&");
                reg = new RegExp("^" + reg + "$");
                if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
                if (event.type == "blur" && this.value.length < 5)  this.value = ""
            }

            input.addEventListener("input", mask, false);
            input.addEventListener("focus", mask, false);
            input.addEventListener("blur", mask, false);
            input.addEventListener("keydown", mask, false);

            input.dispatchEvent(new Event('input'));
        
          });
    })

};



