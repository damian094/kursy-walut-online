export default class DOM {
    constructor() {
        const mainContainer = document.querySelector('#mainContainer');
        const hidingTime = window.matchMedia('(max-width: 1024px)').matches ? 2 : 3;
        const showingTime = window.matchMedia('(max-width: 1024px)').matches ? 3 : 4;

        const functions = {
            general: {
                showSection(kindOfSection) {
                    const shownSection = document.querySelector(`#${kindOfSection}Container`);
                    const activeSection = document.querySelector('.mainContainer__containers.active');
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
            searchSection: {
                formScripts() {
                    //add currency options to form>select
                    const selectForm = document.querySelector('#search__form--currencyCode');
                    const currencies = this.data.currenciesDatas;
                    currencies.sort((a, b) => (a.code > b.code) ? 1 : -1);
                    for (let i = 0; i < currencies.length; i++) {
                        const {
                            currency,
                            code
                        } = currencies[i];
                        const newOption = document.createElement('option');
                        newOption.value = code;
                        newOption.innerHTML = `${code} - ${currency}`;
                        selectForm.appendChild(newOption);
                    }

                    //btns plus and minus - rates quantity
                    const operationFunc = type => {
                        const ratesQuantity = document.querySelector('#search__form--ratesQuantity input');
                        let value = ratesQuantity.value * 1;
                        if (type === '+' && value >= 5 && value < 99) {
                            value++;
                        } else if (type === '-' && value > 5 && value <= 99) {
                            value--;
                        }
                        ratesQuantity.value = value;
                    }

                    const btns = [...document.querySelectorAll('.search__form--changeQuantity')];

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
                    const code = document.querySelector('#search__form--currencyCode');
                    const ratesQuantity = document.querySelector('#search__form--ratesQuantity input');
                    new Promise((resolve, reject) => {
                            if (code.value !== 'default') {
                                searchContainer.style.animation = `.${hidingTime}s hideContainer linear both`;
                                setTimeout(() => {
                                    searchContainer.style.display = 'none';
                                    existDiv ? mainContainer.removeChild(existDiv) : undefined;
                                    this.currencyContainer.render.bind(this, code.value, ratesQuantity.value)()
                                        .then(() => resolve());
                                }, hidingTime * 100 + 100)
                            } else {
                                alert('Zaznacz walutę');
                                reject(new Error('Nie wybrano waluty'));
                            }
                        })
                        .catch(err => console.log(err))
                        .finally(() => {
                            code.value = 'default';
                            ratesQuantity.value = '15';
                        })
                }
            },
            calculatorSection: {
                formScripts() {
                    //add currency options to form>select
                    const selects = document.querySelectorAll('.calculator__form--select');
                    const currencies = this.data.currenciesDatas;
                    currencies.sort((a, b) => (a.code > b.code) ? 1 : -1);
                    for (let i = 0; i < currencies.length; i++) {
                        const {
                            currency,
                            code
                        } = currencies[i];

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
                    const startCalculateBtn = document.querySelector('#calculator__form--button');
                    startCalculateBtn.textContent = 'Dalej';

                    //reset calculator
                    const optionsSection = document.querySelector('#calculator__form--options');
                    const resultSection = document.querySelector('#calculator__form--result');
                    optionsSection.style.animation = '';
                    setTimeout(() => {
                        optionsSection.style.display = 'block';
                        resultSection.style.display = 'none';
                    }, showingTime * 100)

                    const selectedOptions = document.querySelectorAll('.calculator__form--select');
                    selectedOptions.forEach(sel => sel.value = 'default');
                },
                calculate() {
                    const optionsSection = document.querySelector('#calculator__form--options');
                    const resultSection = document.querySelector('#calculator__form--result');

                    //change displayed section
                    optionsSection.style.animation = `.${hidingTime}s hideContainer linear both`;
                    setTimeout(() => {
                        resultSection.style.height = `${optionsSection.clientHeight}px`
                        optionsSection.style.display = 'none';
                        resultSection.style.display = 'flex';
                        resultSection.style.animation = `.${showingTime}s showContainer linear both`;
                    }, hidingTime * 100)
                    this.textContent = 'Nowe obliczenie';

                    //calculate process
                    const fromCurrency = document.querySelector('#calculator__form--from').value;
                    const toCurrnecy = document.querySelector('#calculator__form--to').value;
                    console.log(fromCurrency, toCurrnecy)
                    const spansNextToInputs = document.querySelectorAll('.calculator__form--result-container span');
                    spansNextToInputs[0].textContent = fromCurrency;
                    spansNextToInputs[1].textContent = toCurrnecy;
                }
            }
        }

        this.render = function () {
            const {
                general,
                searchSection,
                calculatorSection
            } = functions


            //functions for search section
            const showSearchBtn = document.querySelector('#nav_search');
            const findCurrencyBtn = document.querySelector('#search__form--button');

            showSearchBtn.addEventListener('click', () => {
                general.showSection('search');
            });
            findCurrencyBtn.addEventListener('click', searchSection.findCurrency.bind(this));
            searchSection.formScripts.bind(this)();


            //functions for calculator section
            const showCalculatorBtn = document.querySelector("#nav_calculator");
            const startCalculateBtn = document.querySelector('#calculator__form--button');

            showCalculatorBtn.addEventListener('click', () => {
                calculatorSection.setDefault();
                general.showSection('calculator');
            });
            startCalculateBtn.addEventListener('click', calculatorSection.calculate);
            calculatorSection.formScripts.bind(this)();

            //others
            const forms = document.querySelectorAll('form');
            forms.forEach(form => (form.addEventListener('submit', e => e.preventDefault())));
        }
    }
}