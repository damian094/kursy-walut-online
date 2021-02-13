export default class DOM {
    static random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    static textWriting(element, text, time, typeOfWriting, isReverse) {
        //element - DOM element in which you want to write
        //text - the text to write
        //time - animation duration
        //type (letter/all) - type of animation duration (time for one letter or time for all text)
        //reverse (true/false)

        const typeCharacter = typeOfWriting === 'letter' ? true : false;
        const reverse = isReverse || false;

        return new Promise(resolve => {
            if (!reverse) {
                const endTxt = text.split('');
                let displayedTxt = '';
                let i = 0;
                let interval = setInterval(() => {
                    displayedTxt += endTxt[i++];
                    element.textContent = displayedTxt;
                    if (displayedTxt.length === text.length) {
                        clearInterval(interval);
                        resolve();
                    }
                }, typeCharacter ? time : time / endTxt.length)
            } else {
                let displayedTxt = text;
                let interval = setInterval(() => {
                    displayedTxt = displayedTxt.slice(0, -1);
                    element.textContent = displayedTxt;
                    if (!displayedTxt.length) {
                        clearInterval(interval);
                        resolve();
                    }
                }, typeCharacter ? time : time / endTxt.length)
            }
        })

    }

    static showModal(title, ...texts) {
        const wrapper = document.querySelector('.wrapper');
        const modal = document.querySelector('.modal');
        const modalTitle = document.querySelector('.modal__title');
        const modalContent = document.querySelector('.modal__content');
        modalTitle.textContent = title;

        const closeModal = () => {
            modalTitle.textContent = 'Błąd';
            modalContent.innerHTML = '';
            modal.classList.remove('active');
            wrapper.classList.remove('blurred');
            closeBtn.classList.remove('active')
        }

        const closeBtn = document.querySelector('.modal__close');
        closeBtn.addEventListener('click', closeModal);

        //show modal and render li
        setTimeout(() => {
            (async function loop() {
                for (let i = 0; i < texts.length; i++) {
                    await new Promise(resolve => {
                        const newLi = document.createElement('li');
                        modalContent.appendChild(newLi);
                        DOM.textWriting(newLi, texts[i], texts[i].length * 20)
                            .then(() => setTimeout(resolve, 200))
                    }).then(() => {
                        if (i === texts.length - 1) {
                            closeBtn.classList.add('active');
                        }
                    })
                }
            })();
        }, 400)

        modal.classList.add('active');
        wrapper.classList.add('blurred');
    }

    constructor(data) {
        const currenciesData = [...data.sort((a, b) => (a.code > b.code) ? 1 : -1)];
        currenciesData.push({
            currency: 'Polski złoty',
            code: 'PLN',
            mid: 1
        });
        const mainContainer = document.querySelector('main');
        const hidingTime = window.matchMedia('(max-width: 768px)').matches ? 2 : 3;
        const showingTime = window.matchMedia('(max-width: 768px)').matches ? 4 : 5;

        const functions = {
            general: {
                showSection(typeOfSection) {
                    const shownSection = document.querySelector(`#${typeOfSection}Container`);
                    const activeSection = document.querySelector('.sectionContainer.active');
                    const existDivs = document.querySelectorAll('.currencyContainer');

                    const show = () => {
                        shownSection.style.display = 'flex';
                        shownSection.style.animation = `.${showingTime}s .1s showContainer linear both`;
                        shownSection.classList.add('active');
                    }

                    //hide currency containers and show clicked
                    if (existDivs.length) {
                        let delay = 0;
                        existDivs.forEach(div => div.style.animation = `.${hidingTime}s .${delay++}s hideContainer linear both`);
                        setTimeout(() => {
                            for (let i = 0; i < existDivs.length; i++) {
                                mainContainer.removeChild(existDivs[i]);
                            }
                            show();
                        }, hidingTime * 100 + existDivs.length * 100)
                    }

                    //hide active section and show clicked
                    if (activeSection) {
                        activeSection.style.animation = `.${hidingTime}s hideContainer linear both`;
                        activeSection.classList.remove('active');
                        setTimeout(() => {
                            activeSection.style.display = 'none';
                            show();
                        }, hidingTime * 100)
                    }
                }
            },
            search: {
                formScripts() {
                    //add currency options to form>select
                    const selectForm = document.querySelector('#form_search-currencyCode');
                    for (let i = 0; i < currenciesData.length - 1; i++) {
                        const {
                            currency,
                            code
                        } = currenciesData[i];
                        const newOption = document.createElement('option');
                        newOption.value = code;
                        newOption.innerHTML = `${code} - ${currency}`;
                        selectForm.appendChild(newOption);
                    }

                    //btns plus and minus - rates quantity
                    const operationFunc = type => {
                        const ratesQuantity = document.querySelector('.inputQuantity-container--search input');
                        let value = ratesQuantity.value * 1;
                        if (type === '+' && value >= 5 && value < 99) {
                            value++;
                        } else if (type === '-' && value > 5 && value <= 99) {
                            value--;
                        }
                        ratesQuantity.value = value;
                    }

                    const btns = [...document.querySelectorAll('.form_search-changeQuantity')];

                    const btnDown = btns.find(btn => btn.classList.contains('down'));
                    btnDown.addEventListener('click', () => {
                        operationFunc('-');
                    });

                    const btnUp = btns.find(btn => btn.classList.contains('up'));
                    btnUp.addEventListener('click', () => {
                        operationFunc('+');
                    });
                },
                findCurrency() {
                    const existDiv = document.querySelector('.currencyContainer');
                    const code = document.querySelector('#form_search-currencyCode');
                    const ratesQuantity = document.querySelector('.inputQuantity-container--search input');
                    new Promise((resolve, reject) => {
                            if (code.value !== 'default' && (ratesQuantity.value >= 5 && ratesQuantity.value <= 99)) {
                                searchContainer.style.animation = `.${hidingTime}s hideContainer linear both`;
                                setTimeout(() => {
                                    searchContainer.style.display = 'none';
                                    existDiv ? mainContainer.removeChild(existDiv) : undefined;
                                    this.currencyContainer.render.bind(this, code.value, ratesQuantity.value)()
                                        .then(() => resolve());
                                }, hidingTime * 100 + 100)
                            } else if (code.value === 'default') {
                                reject(['Nie wybrałeś/aś waluty, której mam wyszukać', 'Wybierz ilość ostatnich nowań, na ich podstawie wygenerowany zostanie wykres', 'Liczba ostatnich notowań nie może być mniejsza niż 5 i większa niż 99']);
                            } else if (ratesQuantity.value < 5) {
                                reject(['Liczba ostatnich notowań nie może być mniejsza niż 5']);
                            } else if (ratesQuantity.value > 99) {
                                reject(['Liczba ostatnich notowań nie może być większa niż 99']);
                            }
                        })
                        .catch(reason => {
                            DOM.showModal('Błąd', ...reason);
                        })
                        .finally(() => {
                            code.value = 'default';
                            ratesQuantity.value = '15';
                        })
                }
            },
            calculator: {
                formScripts() {
                    //add currency options to form>select
                    const selects = document.querySelectorAll('.form_calculator-select');
                    for (let i = 0; i < currenciesData.length - 1; i++) {
                        const {
                            currency,
                            code
                        } = currenciesData[i];

                        const newOptions = [document.createElement('option'), document.createElement('option')];
                        newOptions.forEach(opt => {
                            opt.value = code;
                            opt.innerHTML = `${code} - ${currency}`;
                        })

                        for (let j = 0; j < selects.length; j++) {
                            selects[j].appendChild(newOptions[j]);
                        }
                    }
                },
                setDefault() {
                    //reset button inside form
                    const startCalculateBtn = document.querySelector('#form_calculator-button');
                    startCalculateBtn.textContent = 'Dalej';
                    startCalculateBtn.style.animation = '';
                    startCalculateBtn.removeEventListener('click', functions.calculator.changeBtnListener, true);
                    startCalculateBtn.addEventListener('click', functions.calculator.calculate);

                    //reset calculator
                    const optionsSection = document.querySelector('#form_calculator-options');
                    const resultSection = document.querySelector('#form_calculator-result');
                    optionsSection.style.animation = '';
                    setTimeout(() => {
                        optionsSection.style.display = 'block';
                        resultSection.style.display = 'none';
                    }, showingTime * 100)

                    const selectedOptions = document.querySelectorAll('.form_calculator-select');
                    selectedOptions.forEach(sel => sel.value = 'default');
                },
                changeBtnListener() {
                    functions.general.showSection('calculator');
                    functions.calculator.setDefault();
                },
                calculate() {
                    const fromCurrency = document.querySelector('#form_calculator-from').value;
                    const toCurrnecy = document.querySelector('#form_calculator-to').value;
                    const optionsSection = document.querySelector('#form_calculator-options');
                    const resultSection = document.querySelector('#form_calculator-result');
                    new Promise((resolve, reject) => {
                            if ((fromCurrency !== 'default' && toCurrnecy !== 'default') && fromCurrency !== toCurrnecy) {
                                //change displayed section
                                optionsSection.style.animation = `.${hidingTime}s hideContainer linear both`;
                                setTimeout(() => {
                                    resultSection.style.height = `${optionsSection.clientHeight}px`
                                    optionsSection.style.display = 'none';
                                    resultSection.style.display = 'flex';
                                    resultSection.style.animation = `.${showingTime}s showContainer linear both`;
                                }, hidingTime * 100)

                                //change button property 
                                this.style.animation = `.${hidingTime+showingTime}s btnAnimation linear both`
                                setTimeout(() => {
                                    this.textContent = 'Reset';
                                    this.removeEventListener('click', functions.calculator.calculate);
                                    this.addEventListener('click', functions.calculator.changeBtnListener, true);
                                }, (hidingTime + showingTime) * 100 / 2)

                                //calculate process
                                const fromExchange = currenciesData.find(cur => cur.code === fromCurrency).mid;
                                const toExchange = currenciesData.find(cur => cur.code === toCurrnecy).mid;
                                const fromInput = document.querySelector('#form_calculator-result-from');
                                const toInput = document.querySelector('#form_calculator-result-to');
                                fromInput.value = '';
                                toInput.value = '';
                                fromInput.addEventListener('input', () => {
                                    if (fromInput.value) {
                                        const result = fromInput.value * (fromExchange / toExchange);
                                        toInput.value = result.toFixed(4);
                                    } else if (fromInput.value === '') {
                                        toInput.value = '';
                                    }
                                })
                                const spansNextToInputs = document.querySelectorAll('.form_calculator-resultContainer span');
                                spansNextToInputs[0].textContent = fromCurrency;
                                spansNextToInputs[1].textContent = toCurrnecy;
                                resolve();
                            } else if (fromCurrency === 'default' && toCurrnecy === 'default') {
                                reject(['Wybierz waluty z listy']);
                            } else if (fromCurrency === toCurrnecy) {
                                reject(['Wybierz dwie różne waluty']);
                            } else if (fromCurrency === 'default' && toCurrnecy !== 'default') {
                                reject(['Nie wybrałeś/aś waluty, z której mam przeliczyć']);
                            } else if (fromCurrency !== 'default' && toCurrnecy === 'default') {
                                reject(['Nie wybrałeś/aś waluty, na którą mam przeliczyć']);
                            }
                        })
                        .catch(reason => {
                            DOM.showModal('Błąd', ...reason);
                            functions.calculator.setDefault();
                        })
                }
            },
            curiosities: {
                curiosites: ['Sasin to nowa oraz najbardziej stabilna waluta. Jeden Sasin jest (i będzie) równy 70000000zł.', 'Robert Lewandowski zarabia około 1,3 Sasin rocznie.', 'W 2020 roku TVP dostało od rządu 28,5 Sasina.', 'Cena nowego Poloneza Caro w latach 90 zaczynała się od 0.0003128571429 Sasina.', 'Minimalne wynagrodzenie dla umów cywilnoprawynch w 2021 roku wynosi 0.0000002614286 Sasina/h.', 'Prognozy przewidują, że w 2050 roku Sasinami będzie można płacić na całym świecie.'],
                wasInitialization: false,
                active: true,
                remainingCuriosites: [],
                writeCuriosites(e) {
                    const render = () => {
                        return new Promise(resolve => {
                                paragraph.textContent = '';

                                if (!this.remainingCuriosites.length) {
                                    this.remainingCuriosites = [...this.curiosites];
                                    if (this.wasInitialization) {
                                        DOM.showModal('Uwaga!', `Wyświetliłeś już wszystkie dostępne ciekawostki (${this.curiosites.length})`, 'Ciekawostki będą wyświetlać się od nowa');
                                    }
                                }

                                const selectedCuriosity = this.remainingCuriosites[DOM.random(0, this.remainingCuriosites.length - 1)];
                                const indexToRemove = this.remainingCuriosites.findIndex(txt => txt.includes(selectedCuriosity));
                                this.remainingCuriosites.splice(indexToRemove, 1);

                                setTimeout(() => {
                                    DOM.textWriting(paragraph, selectedCuriosity, 25, 'letter').then(() => {
                                        resolve();
                                    })
                                }, !!delay ? (showingTime + hidingTime + 5) * 100 : 100)
                            })
                            .then(() => this.wasInitialization = true)
                    }
                    this.active = false;

                    let delay;
                    e.target.id === 'drawCuriosity' ? delay = false : delay = true;

                    const paragraph = document.querySelector('p.curiosity span');

                    if (!delay) {
                        const oldElement = document.querySelector('#drawCuriosity');
                        const newElement = oldElement.cloneNode(true);
                        oldElement.parentNode.replaceChild(newElement, oldElement);
                        DOM.textWriting(paragraph, paragraph.textContent, 20, 'letter', true)
                            .then(() => {
                                render()
                                    .then(() => {
                                        newElement.addEventListener('click', () => {
                                            functions.curiosities.writeCuriosites(e);
                                            this.active = true;
                                        })
                                    })
                            })
                    } else {
                        render().then(() => this.active = true)
                    }
                }
            },
            info: {
                show() {
                    DOM.showModal('Informacje', 'Dane dotyczące kursów walut pochodzą z "http://api.nbp.pl/"', 'Wykres trendu waluty renderowany jest w oparciu o wszystkie notowania, które znajdują się na liście ostatnich notowań', 'Wyliczenia kalkulatora oparte są o aktualne kursy walut, które można sprawdzić w zakładce "Wyszukaj waluty"', 'Wykresy w dolnej częsci strony są jedynie elementem ozdobnym')
                }
            }
        }

        this.render = function () {
            const {
                general,
                search,
                calculator,
                curiosities,
                info
            } = functions;

            const searchScripts = () => {
                const showSearchBtn = document.querySelector('#nav_search');
                const findCurrencyBtn = document.querySelector('#form_search-button');

                showSearchBtn.addEventListener('click', () => {
                    general.showSection('search');
                });
                findCurrencyBtn.addEventListener('click', search.findCurrency.bind(this));
                search.formScripts();
            }
            searchScripts();

            const calculatorScripts = () => {
                const showCalculatorBtn = document.querySelector("#nav_calculator");

                showCalculatorBtn.addEventListener('click', () => {
                    calculator.setDefault();
                    general.showSection('calculator');
                });
                calculator.formScripts.bind(this)();
            }
            calculatorScripts();

            const curiositesScripts = () => {
                const showCuriositesBtn = document.querySelector('#nav_curiosites');

                showCuriositesBtn.addEventListener('click', e => {
                    if (curiosities.active) {
                        general.showSection('curiosites');
                        curiosities.remainingCuriosites = [];
                        curiosities.wasInitialization = false;
                        curiosities.writeCuriosites(e);
                    }
                })
                const btnDrawCuriosity = document.querySelector('#drawCuriosity');
                btnDrawCuriosity.addEventListener('click', e => {
                    if (curiosities.wasInitialization && curiosities.active) {
                        functions.curiosities.writeCuriosites(e);
                    }
                })
            }
            curiositesScripts();

            const infoScripts = () => {
                const showInfoBtn = document.querySelector('#nav_info');
                showInfoBtn.addEventListener('click', info.show)
            }
            infoScripts();

            //others
            const headerHeight = document.querySelector('header').offsetHeight;
            mainContainer.style.marginTop = window.matchMedia('(max-width: 768px)').matches ? `${headerHeight + 40}px` : `${headerHeight}px`;

            const forms = document.querySelectorAll('form');
            forms.forEach(form => (form.addEventListener('submit', e => e.preventDefault())));
        }
    }
}