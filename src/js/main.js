import Parallax from "parallax-js";
import ScrollMagic from 'scrollmagic/scrollmagic/minified/ScrollMagic.min.js';

const burger = document.querySelector('.header__burger');


document.querySelectorAll('.nav-refer').forEach( refer => {

    refer.addEventListener('click', (event) => {
        event.preventDefault();

        

        let id = refer.getAttribute('href');
        
        if(id === '#') return false;

        let block = document.querySelector(id);

        if(block) {

            if(document.body.classList.contains('blocked')) {
                burger.dispatchEvent( new Event('click'))
            }

            block.scrollIntoView({
                'block': 'start',
                'behavior': 'smooth'
            })
        }
        

    })

})

let controller = new ScrollMagic.Controller();

new ScrollMagic.Scene({
    triggerElement: "#tokners-trigger",
    triggerHook: 0.5,
    offset: 0,
    reverse: false,
})
.setClassToggle('.tokners', 'reveal')
.addTo(controller);

new ScrollMagic.Scene({
    triggerElement: "#path-trigger",
    triggerHook: 0.5,
    offset: 0,
    reverse: false,
})
.setClassToggle('.path', 'reveal')
.addTo(controller);


const scene = document.querySelector('#scene');
const parralaxInstance = new Parallax(scene, {
    relativeInput: true
});

const menu = document.querySelector('.header__nav');


burger.addEventListener('click', function() {

    burger.classList.toggle('active');
    menu.classList.toggle('active');
    document.documentElement.classList.toggle('blocked');
    document.body.classList.toggle('blocked');
    
    document.body.scrollIntoView({
        block: 'start',
        behavior: 'smooth'
    })

})

const backgrounds = document.querySelector('.svg-sprites');

backgrounds.querySelectorAll('clipPath').forEach( clipPath => {
    let thePath = clipPath.querySelector('path');

    let bb=thePath.getBBox();

    let sx = 1/bb.width; 
    let sy = 1/bb.height;

    thePath.style.transform = `scale(${sx}, ${sy})`;
});


