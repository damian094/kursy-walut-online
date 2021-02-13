import Data from './js/data.js';
import DOM from './js/dom.js';
import CurrencyContainer from './js/currencyContainer.js';
import Background from './js/background.js';

class App {
    constructor() {
        this.currencyContainer = new CurrencyContainer();
        this.background = new Background();
        this.data = new Data();
        this.data.getCurrenciesData()
            .then(() => {
                this.dom = new DOM(this.data.currenciesData);
                this.dom.render.bind(this)();
                this.currencyContainer.render.bind(this, 'EUR', 15)();
                this.currencyContainer.render.bind(this, 'GBP', 15)();
                this.currencyContainer.render.bind(this, 'USD', 15)()
                if (window.matchMedia('(max-width: 1024px)').matches) {
                    const containers = document.querySelectorAll('.currencyContainer');
                    containers.forEach(container => container.classList.add('withoutOtherInfo'));
                }
                // .then(() => {
                //     setTimeout(() => {
                //         DOM.textWriting(document.querySelector('header h1'), 'Kursy walut online', 700)
                //     }, 500)
                // })
            })
            .catch(reason => console.log(reason));
    }

}

const app = new App();