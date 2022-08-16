export function cardRotate(cards) {

    cards.forEach( card => {
        card.addEventListener('pointermove', rotate);
    });

    function rotate(event) {

        this.style.transition = '';

        this.addEventListener('pointerleave', leave, {once: true});
        
        let cardCoords = this.getBoundingClientRect();

        let coords = [event.clientX - cardCoords.left, event.clientY - cardCoords.top];

        
        let rotateY = ((this.offsetWidth - coords[0]) / 20 - 5) + 'deg';
        let rotateX = -1 * (((this.offsetHeight - coords[1]) / 20) - 5) + 'deg';

        this.style.transform = `rotateX(${rotateX}) rotateY(${rotateY}) scale(0.95)`;



        function leave() {
            this.style.transition = "transform .3s";
            this.style.transform = '';
        }

    }

}