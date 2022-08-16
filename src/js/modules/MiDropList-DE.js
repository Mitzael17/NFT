export class MiDropList_DE {

    constructor(mainSelector = '.MiDropList', listSelector = '.MiDropList__list', additionalActivities = false, ...settings) {
        if(settings.length >= 2) {

            this.medias = [];

            settings.forEach( setting => this.medias.push(setting.media) );

            let HTMLwidth = window.innerWidth;

            this.activeMedia = false;

            for(let i = 0; i < this.medias.length; i++) {

                if(this.medias[i] <= HTMLwidth) {
                    
                    this.activeMedia = this.medias[i];

                    break;

                }

            }

            

            for(let setting of settings) {

                if(setting.media === this.activeMedia) {
                    this.settings = {
                        event: setting.event ? setting.event : 'hover',
                        animation: setting.animation ? setting.animation : 'opacity',
                        delay: setting.delay ? setting.delay : '2000',
                        duration: setting.duration ? setting.duration : '700',
                        timingFunction: setting.timingFunction ? setting.timingFunction : 'linear',
                        protected: setting.protected ? setting.protected : '0',
                        waitOtherLists: setting.waitOtherLists !== undefined ? setting.waitOtherLists : false,
                        media: setting.media,
                        closeOtherLists: setting.closeOtherLists !== undefined ? setting.closeOtherLists : true,
                    }

                    this.settings.changeListDuration = setting.changeListDuration ? setting.changeListDuration : this.settings.duration;
                }

            }
        
            window.addEventListener('resize', () => {
                let HTMLwidth = window.innerWidth;
                for(let i = 0; i < this.medias.length; i++) {

                    if((this.medias[i-1] && this.medias[i-1] > this.medias[i]) && this.medias[i-1] < HTMLwidth) return false;

                    if(this.medias[i] <= HTMLwidth && this.medias[i] !== this.activeMedia) {

                        this.activeMedia = this.medias[i];
                        
                        this.rebuild(settings.find( setting => setting.media === this.activeMedia), additionalActivities);

                        break;
    
                    }
    
                }

            })

        } else {
            
            this.settings = {
                event: settings[0].event ? settings[0].event : 'hover',
                animation: settings[0].animation ? settings[0].animation : 'opacity',
                delay: settings[0].delay ? settings[0].delay : '2000',
                duration: settings[0].duration ? settings[0].duration : '700',
                timingFunction: settings[0].timingFunction ? settings[0].timingFunction : 'linear',
                waitOtherLists: settings[0].waitOtherLists !== undefined ? settings[0].waitOtherLists : false,
                protected: settings[0].protected ? settings[0].protected : '0',
                closeOtherLists: settings[0].closeOtherLists !== undefined ? settings[0].closeOtherLists : true,
            }

            this.settings.changeListDuration = settings[0].changeListDuration ? settings[0].changeListDuration : this.settings.duration;

        }
        

        this.mainSelector = mainSelector;
        this.listSelector = listSelector;


        this.timerShowList = null;
        this.timerHideList = null;

        this.date = null;
        this.clearList = false;
        this.class_active = this.listSelector.substring(1) + '__MiDropList--active';

        this.dateBeginAppering;
        this.differenceTimeApDisAp;
        this.dateBeginDisappering;
        
        this.activeList;

        this.hover = false;
        this.click = false;

        [...document.querySelectorAll(this.mainSelector)]
            .forEach( item => {
                if(this.settings.event === 'hover') {

                    this.hover = true;

                    item.addEventListener('pointerenter', event => {

                        if(this.settings.event !== 'hover') return false;

                        this.#delayBeforeShow(event);
                    })
                    item.addEventListener('pointerleave', () => {
                        
                        if(this.settings.event !== 'hover') return false;

                        if(item.classList.contains(this.class_active)) this.hide(item);

                    })

                }
                if(this.settings.event === 'click') {
                    
                    this.click = true;

                    item.addEventListener('click', event => {

                        if(this.settings.event !== 'click') return false;

                        if(event.target.closest(this.listSelector)) return false;

                        this.#delayBeforeShow(event)
                    });

                }
            });

        for(let list of document.querySelectorAll(this.listSelector)) {

            list.style.display = 'none';

            if(this.settings.animation === 'growing') {

                // list.style.display = 'flex';

                // list.style.height = 'auto';

                // list.dataset.height = list.offsetHeight + 'px';
                
                // list.style.display = 'none';

                // list.style.height = '0';
                
                this.transition = `height ${this.settings.duration}ms ${this.settings.timingFunction}`;
                list.style.transition = this.transition;
                list.style.overflow = 'hidden';
            }

            if(this.settings.animation === 'opacity') {
                list.style.opacity = '0';
                this.transition = `opacity ${this.settings.duration}ms ${this.settings.timingFunction}`;
                list.style.transition = this.transition;
                list.style.overflow = 'hidden';
            }

            list.addEventListener('transitionend', event => {

                if((!event.target.closest(this.mainSelector).classList.contains(this.class_active)) &&
                (event.target.style.height === '0px' || event.target.style.opacity === '0')) {
                    
                    event.target.style.display = 'none';

                }

            })



        }
        

    }


    #show(mainBlock) {
       
        mainBlock.classList.add(this.class_active);

        let target = mainBlock.querySelector(this.listSelector);

        if(this.settings.animation === 'none') {

            target.style.display = 'flex';
            
        }

        if(this.settings.animation === 'growing' || this.settings.animation === 'opacity') {

            this.timerShowList = setTimeout( () => {

                this.dateBeginDisappering = null;
                this.differenceTimeApDisAp = null;
                this.dateBeginAppering = Date.now();

                target.style.display = 'flex';

                if(this.settings.animation === 'growing') {
                    target.style.height = 'auto';

                    target.dataset.height = target.offsetHeight + 'px';

                    target.style.height = '0px';
                }

                setTimeout( () => {

                    if(!mainBlock.classList.contains(this.class_active)) {
                        target.style.display = 'none';
                        return false;
                    }

                    if(this.settings.animation === 'growing') {

                        target.style.height = target.dataset.height;
                        
                    }
                    if(this.settings.animation === 'opacity') target.style.opacity = 1;

                    this.clearList = false;
                    
                }, 50)
                
            }, this.settings.waitOtherLists ? (this.clearList ? this.#countDuration() : 0) : 0);

        }
    }


    hide(target, clearImmediately = false) {

        let list = target.querySelector(this.listSelector);

        if(this.settings.animation === 'none') {

            this.timerHideList = setTimeout( () => {

                target.classList.remove(this.class_active);

                list.style.display = 'none';

            }, clearImmediately ? 0 : this.settings.delay);
            
        }

        if(this.settings.animation === 'growing' || this.settings.animation === 'opacity') {
            
            this.timerHideList = setTimeout( () => {

                target.classList.remove(this.class_active);

                if(clearImmediately) {

                    list.addEventListener('transitionend', () => {
                        
                        if(list.style.transition === this.transition) return false;
                        list.style.transition = this.transition;

                    }, {once: true});

                    let property = this.settings.animation === 'growing' ? 'height' : 'opacity';

                    list.style.transition = `${property} ${this.settings.changeListDuration}ms ${this.settings.timingFunction}`;

                }

                if(this.settings.animation === 'growing') list.style.height = '0';
                if(this.settings.animation === 'opacity') list.style.opacity = '0';

            }, clearImmediately ? 0 : this.settings.delay);
            
        }

    }


    #delayBeforeShow(event) {  

        let target = event.target.closest(this.mainSelector);

        let continuePrepare = () => {
            
            this.activeList = document.querySelector('.' + this.class_active);

            if(this.activeList && this.activeList !== target) {
                
                if(this.settings.closeOtherLists) {
                    clearTimeout(this.timerHideList);
                    this.clearList = true;
                    this.hide(this.activeList, true);
                }
    
            } else clearTimeout(this.timerHideList);
    
            
            clearTimeout(this.timerShowList);
        }
        

        if(this.settings.event === 'click') {

            if(Date.now() - this.date < this.settings.protected && this.date) return false;
            this.date = Date.now();

            if(target.classList.contains(this.class_active)) this.hide(target);
                else {
                    continuePrepare();
                    this.#show.bind(this)(target);
                }
            
        }

        if(this.settings.event === 'hover') {
            this.timerShowList = setTimeout( () => {continuePrepare(); this.#show.bind(this)(target)}, this.settings.protected);
            event.target.addEventListener('pointerleave', () => {
                this.clearList = false;
                clearTimeout(this.timerShowList);
            }, {once: true});
        }

        
    }


    rebuild(setting, additionalActivities = false) {

        for(let list of document.querySelectorAll(this.listSelector)) {
            
            list.style.transition = '';

            let mainBlock = list.closest(this.mainSelector);

            if(mainBlock.classList.contains(this.class_active)) {

                
                this.hide(mainBlock, true);
            }

        }

        if(additionalActivities) additionalActivities();

        this.settings = {
            event: setting.event ? setting.event : 'hover',
            animation: setting.animation ? setting.animation : 'opacity',
            delay: setting.delay ? setting.delay : '2000',
            duration: setting.duration ? setting.duration : '700',
            timingFunction: setting.timingFunction ? setting.timingFunction : 'linear',
            protected: setting.protected ? setting.protected : '0',
            waitOtherLists: setting.waitOtherLists !== undefined ? setting.waitOtherLists : false,
            media: setting.media,
            closeOtherLists: setting.closeOtherLists !== undefined ? setting.closeOtherLists : true,
        }
        
        
        this.settings.changeListDuration = setting.changeListDuration ? setting.changeListDuration : this.settings.duration;


        [...document.querySelectorAll(this.mainSelector)]
        .forEach( item => {

            if(this.settings.event === 'hover' && !this.hover) {

                item.addEventListener('pointerenter', event => {

                    if(this.settings.event !== 'hover') return false;

                    this.#delayBeforeShow(event);
                })
                item.addEventListener('pointerleave', () => {
                    
                    if(this.settings.event !== 'hover') return false;

                    if(item.classList.contains(this.class_active)) this.hide(item);

                })

            }
            if(this.settings.event === 'click' && !this.click) {

                item.addEventListener('click', event => {

                    if(this.settings.event !== 'click') return false;

                    if(event.target.closest(this.listSelector)) return false;

                    this.#delayBeforeShow(event)
                });

            }

        });

        if(this.settings.event === 'hover') this.hover = true;
        if(this.settings.event === 'click') this.click = true;

        for(let list of document.querySelectorAll(this.listSelector)) {

            list.style.display = 'none';

            if(this.settings.animation === 'growing') {

                // list.style.display = 'flex';

                // list.style.height = 'auto';

                // list.dataset.height = list.offsetHeight + 'px';

                // list.style.display = 'none';

                // list.style.height = '0';

                list.style.opacity = '1';

                this.transition = `height ${this.settings.duration}ms ${this.settings.timingFunction}`;
                list.style.transition = this.transition;
                list.style.overflow = 'hidden';
            }

            if(this.settings.animation === 'opacity') {
                list.style.height = 'auto';
                list.style.opacity = '0';
                this.transition = `opacity ${this.settings.duration}ms ${this.settings.timingFunction}`;
                list.style.transition = this.transition;
                list.style.overflow = 'hidden';
            }

            if(this.settings.animation === 'none') {
                list.style.height = 'auto';
                list.style.opacity = '1';
            }

        }

    }


    #countDuration() {
        
        if(this.differenceTimeApDisAp) {
            this.differenceTimeApDisAp = this.differenceTimeApDisAp - (Date.now() - this.dateBeginDisappering);
            this.dateBeginDisappering = Date.now();
        } else {
            this.dateBeginDisappering = Date.now();
            this.differenceTimeApDisAp = this.dateBeginDisappering - this.dateBeginAppering;
        }


        if(this.differenceTimeApDisAp < this.settings.changeListDuration && this.differenceTimeApDisAp >= 0) return this.differenceTimeApDisAp;
        else if(this.differenceTimeApDisAp < 0) return 0;
        else return this.settings.changeListDuration;

    }

}

// problems
/*
1. Lists can have a wrong duration. (changeListDuration)
*/