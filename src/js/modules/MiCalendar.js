/*
DOC

the ready decision of a calendar is made by Mitzael.

settings: {

    language - the calendar supports two languages (with reduction). It is Russian and English
                You can give one of the five parameters.

                1. en (just English)
                2. short_en (short English)
                3. ru (just Russian)
                4. short_ru (short Russian)
                5. Object of arrays. The object has the follow view (

                    {
                        month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                        weeks: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                        activeMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                    }

                )

                default value is short_en


    parent - it is place, when you want to set your calendar. You must give DOM object.
             default value is document.body
    
    showDate - it is date, which calendar open at first time. You must give Date object
                default date is current time.
    
    range - it is range of time, which calendar will show. The parameter must have the follow view (

                {
                    beginning: {
                        year: '1900' (it is necessary parameter),
                        month: +(new Date().getMonth()) + 1, (You also can use getMonth to generate autoloading date, but you must increase the value on 1),
                        day: 3,
                    },

                    end {
                        year: +(new Date().getFullYear) + 3 (it is necessary parameter),
                        month: 4,
                        day: 29,
                    }
                }

            )

            default value is 
            {

                beginning: {
                    year: '1900',
                    
                },
                end: {
                    year: +(new Date().getFullYear()) + 2,
                } 
            }
    
    input - the input, where you will save a date.
            default value is false,
    
    format - it is format, which you will save in value of a input. For example: ( y/m/d - 2020/07/26, d-m-y - 26-07-2020 ),
            default value is y-m-d,
    
    showOverDate: if it is true, you will see days of other months, otherwise the cells wll be empty.
                  default value is true
    
    inputClickable: it is mini replacement for clickToShow. If it is true, then when you click on input
                    calendar will show, but it won't hide, if you click again.
                    default value is false.

    clickToShow: it is array of objects. if you click one of the object, you will show/hide the calendar
                default value is false,
    
    afterLoadCondition: it is status of calendar after load page. it can has one of the two parameters: 'show' or 'hide',
                        default value depends on clickToShow and inputClickable. if you have some object in clickToShow or inputClickable === true, then default value is 'hide'.
                        Otherwise it is 'show',
    
    closeAfterChoise: if it is true, then when you choose the date, the calendar will hide.
                      default value is false,
    
    unlimitedNarrow: if it true, you can see date, which more or less then date, which you gave in range. 
                     default value is false,
                
    animation: it is object, which serves for animation. it has the follow view (

                    {
                        appereance: it can has one of the next parameters (growing, opacity, none). default value is false (none),
                        duration: '1000', default value is 500
                        timingFunction: 'ease-in', default value is ease
                    }

                )
            default value is false,


    
    Example of declaration:

    new MiCalendar({
    parent: document.querySelector('.main-content'),
    language: 'short_en',
    input: document.querySelector('input'),
    format: 'd-m-y',
    showOverDate: true,
    showDate: new Date('2022-04'),
    animation: {
        appearance: 'opacity',
        duration: '400',
        timingFunction: 'ease'
    },
    clickToShow: [document.querySelector('.message')],
    afterLoadCondition: 'show',
    range: {
        beginning: {
            year: '2022',
            month: '3',
            day: '12',
        },
        end: {
            year: '2025',
            month: '9',
        }
    },
    closeAfterChoice: false,
    unlimitedNarrow: false,
});

}

*/


export class MiCalendar {

    constructor(settings = {}) {


        const languages = new Map();
        
        languages.set('ru', {
            months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
            weeks: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
            activeMonths: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        });
        
        languages.set('en', {
            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            weeks: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            activeMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        });

        languages.set('short_en', {
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            weeks: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
            activeMonths: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        });

        languages.set('short_ru', {
            months: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
            weeks: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
            activeMonths: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        });

        


        this.settings =  {

            language: settings.language ? settings.language : 'short_en',

            parent: settings.parent ? settings.parent : document.body,

            showDate : settings.showDate ? settings.showDate : false,

            inputClickable : settings.inputClickable === false ? false : true,

            range: settings.range ? settings.range : {

                beginning: {
                    year: `${+(new Date().getFullYear()) - 100}`,
                    
                },
                end: {
                    year: `${+(new Date().getFullYear()) + 2}`,
                    
                }

            },

            

            input: settings.input ? settings.input : false,

            format: settings.format ? settings.format : 'y-m-d',

            showOverDate: settings.showOverDate || settings.showOverDate === false ? settings.showOverDate : true,

            clickToShow: settings.clickToShow ? settings.clickToShow : false,

            afterLoadCondition: settings.afterLoadCondition ? settings.afterLoadCondition : (settings.clickToShow || settings.inputClickable ? 'hide' : 'show'),

            closeAfterChoice: settings.closeAfterChoice ? settings.closeAfterChoice : false,

            unlimitedNarrow: settings.unlimitedNarrow ? settings.unlimitedNarrow : false,

            animation: settings.animation ? {
                appearance: settings.animation.appearance ? settings.animation.appearance : false,
                duration: settings.animation.duration ? settings.animation.duration : '500',
                timingFunction: settings.animation.timingFunction ? settings.animation.timingFunction : 'ease',
            } : false,

        }

        this.settings.range.beginning.month = this.settings.range.beginning.month ? this.settings.range.beginning.month : '1';
        this.settings.range.end.month = this.settings.range.end.month ? this.settings.range.end.month : '12';

        this.settings.range.beginning.day = this.settings.range.beginning.day ? this.settings.range.beginning.day : '1';
        this.settings.range.end.day = this.settings.range.end.day ? this.settings.range.end.day : this.#getLastDay(new Date(this.settings.range.end.year, +this.settings.range.end.month - 1));



        let lan = languages.get(this.settings.language);

        if(!lan) {          
            lan = this.settings.language;
        }

        this.settings.language = lan;

        this.chosenDay = this.#getChosenDay();

        this.#builder();

    }


    #builder() {

        const date = this.settings.showDate ? this.settings.showDate : new Date();

        this.calendar = document.createElement('div');

        this.calendar.style.display = 'none';

        this.header = document.createElement('div');

        this.header.innerHTML = `<div class="MiCalendar__year">${date.getFullYear()}</div>`

        this.header.innerHTML += `<div class="MiCalendar__nav">
                                <div class="MiCalendar__narrow MiCalendar__narrow--left">⮜</div>
                                <div class='MiCalendar__month'>${this.settings.language.activeMonths[date.getMonth()]}</div>
                                <div class="MiCalendar__narrow MiCalendar__narrow--right">⮞</div>
                                </div>`;

        this.header.classList.add('MiCalendar__header');

        this.calendar.append(this.header);




        this.header.querySelector('.MiCalendar__narrow--left').addEventListener('click', (event) => {

            let date = this.calendar_body.querySelector('tbody.active').dataset.date;

            date = date.split(':');

            date = new Date(date[1], parseInt(date[0]) - 1);

            if(!this.settings.unlimitedNarrow && this.settings.range.beginning.year >= date.getFullYear() && this.settings.range.beginning.month > date.getMonth() + 1
                || (!this.settings.unlimitedNarrow && this.settings.range.beginning.year > date.getFullYear()) ) return false;

            this.changeTbody(date);
            
         } );




        this.header.querySelector('.MiCalendar__narrow--right').addEventListener('click', (event) => {

            let date = this.calendar_body.querySelector('tbody.active').dataset.date;

            date = date.split(':');

            date = new Date(date[1], parseInt(date[0]) + 1, 1);

            if((!this.settings.unlimitedNarrow && this.settings.range.end.year <= date.getFullYear() && this.settings.range.end.month < date.getMonth() + 1) 
                || (!this.settings.unlimitedNarrow && this.settings.range.end.year < date.getFullYear())) return false;


            this.changeTbody(date);

         } );





        this.calendar.classList.add('MiCalendar');

        this.calendar_body = document.createElement('table');

        this.calendar_body.append(document.createElement('tr'));


        for(let index = 0; index < 7; index++) {

            let th = document.createElement('th');

            th.innerHTML = this.settings.language.weeks[index];

            this.calendar_body.rows[0].append(th);

        }


        this.calendar.append(this.calendar_body);

        this.settings.parent.append(this.calendar);
        

        if(this.settings.input) {

            

            this.calendar_body.addEventListener('click', (event) => {

                let target = event.target.closest('td');

                if(!target || target.classList.contains('MiCalendar__unreachable--td') || target.innerHTML === '') return false;
                
                let tbody = target.closest('tbody');

                let date = tbody.dataset.date.split(':');

                if(target.classList.contains('MiCalendar__overDate')) {
                    
                    if(target.innerHTML > 20) {
                        date[0] = date[0] - 1;
                        
                        if(date[0] === -1) {

                            date[0] = 11;
                            date[1] = date[1] - 1;

                        }
                    }

                    if(target.innerHTML < 10) {
                        date[0] = +date[0] + 1;
                        
                        if(date[0] === 12) {

                            date[0] = 0;
                            date[1] = +date[1] + 1;

                        }


                    }
                    
                }


                date[0] = parseInt(date[0]) + 1;

                if(date[0] < 10) date[0] = '0' + date[0];
                else if (date[0] === 13) {
                    date[0] = '01';
                }

                date = {
                    year: date[1],
                    month: date[0],
                    day: target.innerHTML.length === 1 ? 0 + target.innerHTML : target.innerHTML
                }

                let value = this.settings.format.replace('y', date.year);
                    value = value.replace('m', date.month);
                    value = value.replace('d', date.day);


                this.settings.input.value = value;

                if(this.settings.closeAfterChoice) {
                    this.hide();
                }
                
                this.settings.input.dispatchEvent(new Event('change'));

            })

        }


        this.monthBlock = document.createElement('div');

        this.monthBlock.classList.add('MiCalendar__monthBlock', 'MiCalendar__fullBlock');

        this.monthBlock.innerHTML = '<div class="MiCalendar__fullWrapper"></div>';

        this.calendar.append(this.monthBlock);

        this.calendar.querySelector('.MiCalendar__month').addEventListener('click', () => {
            this.monthBlock.classList.add('active');
        })

        this.monthBlock.addEventListener('click', (event) => {
            let target = event.target.closest('.MiCalendar__reachable--month');

            if(!target) return false;

            let date = target.dataset.date.split(':');
            
            date = new Date(date[1], date[0]);

            this.changeTbody(date);

            this.monthBlock.classList.remove('active');
            
        })



        this.yearBlock = document.createElement('div');

        this.yearBlock.innerHTML = '<div class="MiCalendar__fullWrapper"></div>'

        for(let year = this.settings.range.beginning.year; year <= this.settings.range.end.year; year++) {

            this.yearBlock.querySelector('.MiCalendar__fullWrapper').innerHTML += `<div class="MiCalendar__reachable MiCalendar__reachable--year">${year}</div>`;

        };

        this.yearBlock.classList.add('MiCalendar__fullBlock', 'MiCalendar__yearBlock');

        this.calendar.append(this.yearBlock);

        this.calendar.querySelector('.MiCalendar__year').addEventListener('click', () => {

            this.yearBlock.classList.add('active');

        })

        this.yearBlock.addEventListener('click', (event) => {
            let target = event.target.closest('.MiCalendar__reachable--year');

            if(!target) return false;

            this.#fillMonthsBlock(new Date(target.innerHTML));

            this.calendar.querySelector('.MiCalendar__month').dispatchEvent( new Event('click'));

            this.yearBlock.classList.remove('active');
        })

        this.changeTbody(date);



        if(this.settings.animation) {
            if(this.settings.animation.appearance) {
                this.calendar.style.transition = `${this.settings.animation.duration}ms all ${this.settings.animation.timingFunction}`;

                this.calendar.addEventListener('transitionend', (event) => {

                    if(this.calendar.classList.contains('active')) return false;
                    if(this.calendar !== event.target) return false;

                    this.calendar.style.display = 'none';
                })
            }
        }

        if(this.settings.clickToShow.length) {

            this.settings.clickToShow.forEach( element => {
                
                element.addEventListener('click', () => {
                    if(this.calendar.classList.contains('active')) {
                        this.hide();
                    } else {
                        this.show();
                    }
                });

            });

            if(this.settings.afterLoadCondition === 'show') {

                this.show();
                
            }

        } else {
            if(this.settings.afterLoadCondition === 'show') {

                this.show();
                
            }

            if(this.settings.inputClickable && this.settings.input) {

                this.settings.input.addEventListener('click', () => {
                    if(this.calendar.classList.contains('active')) return false;
                    this.show();
                })

            }
        }
        

        if(this.settings.format.match(/d/) && this.settings.input) {
            
            this.settings.input.addEventListener('change', () => {

                let chosenDay = this.calendar_body.querySelectorAll('.MiCalendar__chosenDay');

                if(chosenDay) {
                    chosenDay.forEach( day => day.classList.remove('MiCalendar__chosenDay'));
                }

                this.chosenDay = this.#getChosenDay();

                if(!this.#checkChosenDate()) this.chosenDay = this.#getChosenDay();

                if(this.chosenDay) {
                    
                    let tbody = this.calendar_body.querySelector(`tbody[data-date="${this.chosenDay.month}:${this.chosenDay.year}"]`);


                    if(tbody) {


                        [...tbody.querySelectorAll('td')].forEach( td => {


                            if(td.classList.contains('MiCalendar__overDate') || td.innerHTML !== this.chosenDay.day) return;

                            td.classList.add('MiCalendar__chosenDay');


                        })

                    }


                    if(this.settings.showOverDate) {

                        let nextDate = new Date(this.chosenDay.year, +this.chosenDay.month + 1);
                        let nextTbody = this.calendar_body.querySelector(`tbody[data-date="${[nextDate.getMonth()]}:${nextDate.getFullYear()}"]`);
    
                        let previousDate = new Date(this.chosenDay.year, this.chosenDay.month - 1);
                        let previousTbody = this.calendar_body.querySelector(`tbody[data-date="${[previousDate.getMonth()]}:${previousDate.getFullYear()}"]`);
    
                        if(this.chosenDay.day > 20 && nextTbody) {
    

    
                            nextTbody.querySelectorAll('.MiCalendar__overDate').forEach( day => {
                                
                                if(day.innerHTML === this.chosenDay.day) day.classList.add('MiCalendar__chosenDay');

                            });
    
                            
    
                        }
    
                        if(this.chosenDay.day < 10 && previousTbody) {

                            previousTbody.querySelectorAll('.MiCalendar__overDate').forEach( day => {
                                
                                if(day.innerHTML === this.chosenDay.day) day.classList.add('MiCalendar__chosenDay');

                            });

                        }
                    }

                }

            })
            
        }

    }


    changeTbody(date) {

        let tbody = this.calendar_body.querySelector(`tbody[data-date="${date.getMonth()}:${date.getFullYear()}"]`);

        let activeTbody = this.calendar_body.querySelector('tbody.active');

        let now = new Date();

        this.#fillMonthsBlock(date);

        this.calendar.querySelector('.MiCalendar__year').innerHTML = date.getFullYear();
        this.calendar.querySelector('.MiCalendar__month').innerHTML = this.settings.language.activeMonths[date.getMonth()];
        
        const narrows = {
            left: this.calendar.querySelector('.MiCalendar__narrow--left'),
            right: this.calendar.querySelector('.MiCalendar__narrow--right'),
        }

        narrows.left.classList.remove('blocked');
        narrows.right.classList.remove('blocked');

        if(this.settings.range.beginning.month) {

            let nextDate = new Date(date.getFullYear(), date.getMonth());

            if((nextDate.getMonth() < this.settings.range.beginning.month && this.settings.range.beginning.year >= nextDate.getFullYear() ) || this.settings.range.beginning.year > nextDate.getFullYear()) {
                
                narrows.left.classList.add('blocked');
                
            }


        } 
        
        if(this.settings.range.end.month) {

            let nextDate = new Date(date.getFullYear(), date.getMonth() + 2);

            if( nextDate.getMonth() > this.settings.range.end.month && this.settings.range.end.year <= nextDate.getFullYear()) {
                    
                narrows.right.classList.add('blocked');

            } else {
                nextDate = new Date(date.getFullYear(), date.getMonth() + 1);

                if(this.settings.range.end.year < nextDate.getFullYear()) {
                    narrows.right.classList.add('blocked');
                }

            }

        }

        if(activeTbody) {

            activeTbody.classList.remove('active');

        }

        if(tbody) {
            tbody.classList.add('active');
        } else {
            const lastDay = this.#getLastDay(date);
            
            tbody = document.createElement('tbody');
    
            tbody.dataset.date = `${date.getMonth()}:${date.getFullYear()}`;
    
            this.calendar_body.append(tbody);

            tbody.classList.add('active');

            for(let index = 1; index <= lastDay; index++) {
    
                if(index === 1) {
    
                    tbody.append(document.createElement('tr'));
    
                    let weekDay = this.#getDay(new Date(date.getFullYear(), date.getMonth(), index));
    
                    for(let day = 1; day < weekDay + 1; day++) {
    
                        let td = document.createElement('td');

                        td.classList.add('MiCalendar__overDate');

                        let nextDate = new Date(date.getFullYear(), date.getMonth(), index - day);

                        let dateDay = nextDate.getDate();

                        if(this.settings.range.beginning.year > date.getFullYear()) 
                             {
                                
                                td.classList.add('MiCalendar__unreachable', 'MiCalendar__unreachable--td');

                            } else if(this.settings.range.beginning.month > date.getMonth() && this.settings.range.beginning.year == date.getFullYear()) {

                                td.classList.add('MiCalendar__unreachable', 'MiCalendar__unreachable--td');

                            } else if((this.settings.range.beginning.year > date.getFullYear()) || (date.getMonth() === 0 && this.settings.range.beginning.year > date.getFullYear() - 1) ) {
                                td.classList.add('MiCalendar__unreachable', 'MiCalendar__unreachable--td');
                            }
    
                        if(this.settings.range.beginning.day) {
                            

                            if(this.settings.range.beginning.day > dateDay && this.settings.range.beginning.month == date.getMonth() && this.settings.range.beginning.year == date.getFullYear()) {
                                td.classList.add('MiCalendar__unreachable', 'MiCalendar__unreachable--td');
                            }

                        }

                        let lastDay = '31';

                        if(this.settings.range.end.month && !this.settings.range.end.day) {

                            lastDay = this.#getLastDay(new Date(this.settings.range.end.year, this.settings.range.end.month - 1));

                        }

                        let endDate = new Date(this.settings.range.end.year, this.settings.range.end.month ? this.settings.range.end.month - 1: '11', this.settings.range.end.day ? this.settings.range.end.day : lastDay);
                        

                        if(nextDate - endDate > 0) {
                            
                            td.classList.add('MiCalendar__unreachable', 'MiCalendar__unreachable--td');


                        };
                        
                        if(this.settings.showOverDate) {
                            
                            td.innerHTML = dateDay;

                            if(this.chosenDay) {

                                let previousDate = new Date(date.getFullYear(), date.getMonth() - 1);

                                if(dateDay == this.chosenDay.day && this.chosenDay.month == previousDate.getMonth() && this.chosenDay.year == previousDate.getFullYear()) {
            
                                    td.classList.add('MiCalendar__chosenDay');
            
                                }
            
                            }

                        }
    
                        tbody.rows[tbody.rows.length - 1].prepend(td);
                        
                    }
    
                }
    
                let td = document.createElement('td');
    
                td.innerHTML = index;

                if(this.settings.range.beginning.day && this.settings.range.beginning.month == date.getMonth() + 1 && this.settings.range.beginning.year == date.getFullYear()) {
                    
                    if(index < this.settings.range.beginning.day) td.classList.add('MiCalendar__unreachable', 'MiCalendar__unreachable--td');

                } else if(this.settings.range.beginning.month > date.getMonth() + 1 && this.settings.range.beginning.year == date.getFullYear()) {

                    td.classList.add('MiCalendar__unreachable', 'MiCalendar__unreachable--td');

                } else if(this.settings.range.beginning.year > date.getFullYear()) {
                    td.classList.add('MiCalendar__unreachable', 'MiCalendar__unreachable--td');
                }

                if(this.settings.range.end.day && this.settings.range.end.month == date.getMonth() + 1 && this.settings.range.end.year == date.getFullYear()) {
                    
                    if(index > this.settings.range.end.day) td.classList.add('MiCalendar__unreachable', 'MiCalendar__unreachable--td');

                } else if(this.settings.range.end.month < date.getMonth() + 1 && this.settings.range.end.year == date.getFullYear()) {

                    td.classList.add('MiCalendar__unreachable', 'MiCalendar__unreachable--td');

                } else if(this.settings.range.end.year < date.getFullYear()) {
                    td.classList.add('MiCalendar__unreachable', 'MiCalendar__unreachable--td');
                }
    
                tbody.rows[tbody.rows.length - 1].append(td);

                if(this.chosenDay) {

                    if(index == this.chosenDay.day && this.chosenDay.month == date.getMonth() && this.chosenDay.year == date.getFullYear()) {

                        td.classList.add('MiCalendar__chosenDay');

                    }

                }

                if(index === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {

                    td.classList.add('MiCalendar__today');

                }
                
    
                if(this.#getDay(new Date(date.getFullYear(), date.getMonth(), index)) === 6 && index !== lastDay) {
    
                    tbody.append(document.createElement('tr'));
    
                }
    
    
                if(index === lastDay) {
    
                    let weekDay = this.#getDay(new Date(date.getFullYear(), date.getMonth(), index));
    
                    let day = 1;

                    while(weekDay < 6) {
                        let td = document.createElement('td');

                        td.classList.add('MiCalendar__overDate');

                        let nextDate = new Date(date.getFullYear(), date.getMonth(), index + day++);

                        let dateDay = nextDate.getDate();

                        if(this.settings.range.end.year < date.getFullYear()) 
                            {
                                td.classList.add('MiCalendar__unreachable', 'MiCalendar__unreachable--td');
                             
                            } else if(this.settings.range.end.month < date.getMonth() + 2 && this.settings.range.end.year == date.getFullYear()) {
                                td.classList.add('MiCalendar__unreachable', 'MiCalendar__unreachable--td');

                            } else if((this.settings.range.end.year < date.getFullYear()) || (date.getMonth() === 11 && this.settings.range.end.year < +(date.getFullYear()) + 1) ) {
                                td.classList.add('MiCalendar__unreachable', 'MiCalendar__unreachable--td');
                            }

                        
                        
                        let beginningDate = new Date(this.settings.range.beginning.year, this.settings.range.beginning.month ? this.settings.range.beginning.month - 1: '0', this.settings.range.beginning.day ? this.settings.range.beginning.day : '1');

                        

                        if(beginningDate - nextDate > 0) {
                           
                            td.classList.add('MiCalendar__unreachable', 'MiCalendar__unreachable--td');


                        };
                        
                        
                        if(this.settings.range.end.day) {

                            if(this.settings.range.end.day < dateDay && this.settings.range.end.month == date.getMonth() + 2 && this.settings.range.end.year == date.getFullYear()) {
                                td.classList.add('MiCalendar__unreachable', 'MiCalendar__unreachable--td');
                            }

                        }

                        if(this.settings.showOverDate) {

                            td.innerHTML = dateDay;

                            if(this.chosenDay) {

                                let previousDate = new Date(date.getFullYear(), date.getMonth() + 1);

                                if(dateDay == this.chosenDay.day && this.chosenDay.month == previousDate.getMonth() && this.chosenDay.year == previousDate.getFullYear()) {
            
                                    td.classList.add('MiCalendar__chosenDay');
            
                                }
            
                            }
                        }

                        
                        tbody.rows[tbody.rows.length - 1].append(td);
                        ++weekDay;
                    }
    
                }
    
    
    
            }

            

        }


    }


    show() {

        this.calendar.classList.add('active');

        if(this.settings.animation) {

            if(this.settings.animation.appearance) {

                if(this.settings.animation.appearance === 'growing') {

                    this.calendar.style.display = 'flex';

                    this.calendar.style.height = 'auto';

                    let height = this.calendar.offsetHeight + 'px';

                    this.calendar.style.height = 0;

                    this.calendar.style.display = 'none';

                    this.calendar.style.display = 'flex';

                    setTimeout( () => {
                        this.calendar.style.height = height;
                        this.calendar.addEventListener('transitionend', () => {
                            this.calendar.style.height = 'auto';
                        }, {once: true})
                    }, 50)

                    

                }

                if(this.settings.animation.appearance === 'opacity') {

                    this.calendar.style.opacity = 0;

                    this.calendar.style.display = 'flex';

                    setTimeout( () => {
                        this.calendar.style.opacity = 1;
                    }, 50)

                }

                if(this.settings.animation.appearance === 'none') this.calendar.style.display = 'flex';

            } else this.calendar.style.display = 'flex';

        } else this.calendar.style.display = 'flex';


    }

    hide() {

        this.calendar.classList.remove('active');

        if(this.settings.animation) {

            if(this.settings.animation.appearance) {

                
                if(this.settings.animation.appearance === 'growing') {

                    let height = this.calendar.offsetHeight + 'px';

                    this.calendar.style.height = height;

                    setTimeout( () => {
                        this.calendar.style.height = 0;
                    }, 50)

                }

                if(this.settings.animation.appearance === 'opacity') {

                    this.calendar.style.opacity = 0;

                }

                if(this.settings.animation.appearance === 'none') {

                    
                    this.calendar.style.display = 'none';

                }

            } else {
                this.calendar.style.display = 'none';
                
            }

        } else {
            this.calendar.style.display = 'none';    
        }
    }

    #getDay(date) {

        let weekDay = date.getDay();

        if(weekDay === 0) {
            weekDay = 6;
        } else {
            weekDay = weekDay -1;
        }

        return weekDay;


    }


    #getLastDay(date) {

        let nextDate = new Date(date.getFullYear(), date.getMonth() + 1, '0');

        return nextDate.getDate();

    }

    #fillMonthsBlock(date) {

        let monthWrapper = this.monthBlock.querySelector('.MiCalendar__fullWrapper');

        monthWrapper.innerHTML = '';

        const year = date.getFullYear();

        const beginningMonth = this.settings.range.beginning.month;
        const endMonth = this.settings.range.end.month;

        this.settings.language.months.forEach( (month, index) => {



            if(this.settings.range.beginning.year >= year) {


                if(index + 1 < beginningMonth || this.settings.range.beginning.year > year) {
                    monthWrapper.innerHTML += `<div class="MiCalendar__unreachable MiCalendar__unreacheable--month">${month}</div>`;
                    return;
                }

                if(this.settings.range.end.year <= year) {
                    if(index + 1 > endMonth || this.settings.range.end.year < year) {
                        monthWrapper.innerHTML += `<div class="MiCalendar__unreachable MiCalendar__unreacheable--month">${month}</div>`;
                        return;
                    }                  
                }

                monthWrapper.innerHTML += `<div data-date="${index}:${year}" class="MiCalendar__reachable MiCalendar__reachable--month">${month}</div>`;


            } else if(this.settings.range.end.year <= year) {
                
                if(index + 1 > endMonth || this.settings.range.end.year < year)  {
                    monthWrapper.innerHTML += `<div class="MiCalendar__unreachable MiCalendar__unreacheable--month">${month}</div>`;
                    return;
                }

                monthWrapper.innerHTML += `<div data-date="${index}:${year}" class="MiCalendar__reachable MiCalendar__reachable--month">${month}</div>`;


            } else {
                monthWrapper.innerHTML += `<div data-date="${index}:${year}" class="MiCalendar__reachable MiCalendar__reachable--month">${month}</div>`;
            }

        })
        

    }


    #getChosenDay() {

        if(!this.settings.input || !this.settings.input.value) return false;

        let collection = new Map();

        collection.set('day', this.settings.format.indexOf('d'));
        collection.set('month', this.settings.format.indexOf('m'));
        collection.set('year', this.settings.format.indexOf('y'));

        if(!collection.get('day') && collection.get('day') > 0) return false;

        let arrValue = this.settings.input.value.split(/\D/);

        collection = new Map([...collection.entries()].sort((a, b) => a[1] - b[1]));

        let index = 0;

        collection.forEach( (value, key) => {

            collection.set(key, arrValue[index++]);

        });

        collection = Object.fromEntries(collection);

        collection = this.#makeCorrectCollectionOfDate(collection);

        return collection;

    }


    #checkChosenDate() {

        let date = new Date(this.chosenDay.year, this.chosenDay.month, this.chosenDay.day);
        
        if(date > new Date(this.settings.range.end.year, this.settings.range.end.month - 1, this.settings.range.end.day))  {


            let value = this.settings.format;

            value = value.replace('d', this.settings.range.end.day);
            value = value.replace('m', this.settings.range.end.month);
            value = value.replace('y', this.settings.range.end.year);

            this.settings.input.value = value;

            this.#getChosenDay();


            return false;
        }

        if(date < new Date(this.settings.range.beginning.year, this.settings.range.beginning.month - 1, this.settings.range.beginning.day))  {

            let value = this.settings.format;

            value = value.replace('d', this.settings.range.beginning.day);
            value = value.replace('m', this.settings.range.beginning.month);
            value = value.replace('y', this.settings.range.beginning.year);

            this.settings.input.value = value;
            
            this.#getChosenDay();


            return false;
        } 

    }

    #makeCorrectCollectionOfDate(collection) {

        collection.month = collection.month.match(/^0/) ? collection.month.substring(1) : collection.month;

        collection.month = +collection.month - 1;

        collection.day = collection.day.match(/^0/) ? collection.day.substring(1) : collection.day;

        let date = new Date(collection.year, collection.month, collection.day);

        collection.year = `${date.getFullYear()}`;
        collection.month = date.getMonth();
        collection.day = `${date.getDate()}`;

        if(this.settings.input) {
            
            let value = this.settings.format;

            let realMonth = `${+collection.month + 1}`
            realMonth = realMonth.length === 1 ? '0' + realMonth : realMonth;

            value = value.replace('d', collection.day.length === 1 ? '0' + collection.day : collection.day);
            value = value.replace('m', realMonth);
            value = value.replace('y', collection.year);
            

            this.settings.input.value = value;

        }

        return collection;
    }

}
