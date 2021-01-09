export default class DOM {
    constructor() {
        const mainContainer = document.querySelector('#mainContainer');
        const searchContainer = document.querySelector('#searchFormContainer');

        const functions = {
            searchSection: {
                showSection() {
                    const existDivs = document.querySelectorAll('div.currencyContainer');
                    if (existDivs.length) {
                        let delay = 0;
                        existDivs.forEach(div => div.style.animation = `.4s .${delay++}s hideContainer linear both`);
                        setTimeout(() => {
                            for (let i = 0; i < existDivs.length; i++) {
                                mainContainer.removeChild(existDivs[i]);
                            }
                            searchContainer.style.display = 'flex';
                            searchContainer.style.animation = '.4s showContainer linear both';
                        }, 600)
                    }

                    //create currency options to form
                    const selectForm = document.querySelector('#searchCurrencyCode');
                    const currencies = this.data.currenciesDatas;
                    currencies.sort((a, b) => (a.code > b.code) ? 1 : -1);
                    for (let i = 0; i < currencies.length; i++) {
                        const {
                            currency,
                            code
                        } = currencies[i];
                        const newOption = document.createElement('option');
                        newOption.value = code;
                        newOption.innerHTML = `${code} ( ${currency} )`;
                        selectForm.appendChild(newOption);
                    }

                    //select height limit
                    const select = document.querySelector('select#searchCurrencyCode');

                    select.addEventListener('mousedown', function () {
                        this.size = 5;
                    });
                    select.addEventListener('change', function () {
                        this.blur();
                    });
                    select.addEventListener('blur', function () {
                        this.size = 0;
                    });
                },
                findCurrency() {
                    const existDiv = document.querySelector('div.currencyContainer');
                    const code = document.querySelector('#searchCurrencyCode');
                    const ratesQuantity = document.querySelector('#searchRatesQuantity input');
                    new Promise((resolve, reject) => {
                            if (code.value !== 'default') {
                                searchContainer.style.animation = '.4s hideContainer linear both';
                                setTimeout(() => {
                                    searchContainer.style.display = 'none';
                                    existDiv ? mainContainer.removeChild(existDiv) : undefined;
                                    this.currencyContainer.render.bind(this, code.value, ratesQuantity.value)()
                                        .then(() => resolve());
                                }, 400)
                            } else {
                                alert('Zaznacz walutę');
                                reject();
                            }
                        })
                        .finally(() => {
                            code.value = 'default';
                            ratesQuantity.value = '20';
                        })
                }
            }
        }

        this.render = function () {
            const {
                searchSection
            } = functions

            //func for search section
            const showSearchBtn = document.querySelector('#search');
            showSearchBtn.addEventListener('click', searchSection.showSection.bind(this));
            const btnFindCurrency = document.querySelector('#btnSearchCurrency');
            btnFindCurrency.addEventListener('click', searchSection.findCurrency.bind(this));
            const forms = document.querySelectorAll('form');
            forms.forEach(form => (form.addEventListener('submit', e => e.preventDefault())))
        }
    }
}