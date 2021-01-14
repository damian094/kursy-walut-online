import Data from './js/data.js';
import DOM from './js/dom.js';
import RenderCurrencyContainer from './js/renderContainer.js';
import Background from './js/background.js';


class App {
    constructor() {
        this.dom = new DOM();
        this.currencyContainer = new RenderCurrencyContainer();
        this.background = new Background();
        this.data = new Data();
        this.data.getCurrenciesDatas()
            .then(() => {
                this.currencyContainer.render.bind(this, 'EUR', 15)();
                this.currencyContainer.render.bind(this, 'GBP', 15)();
                this.currencyContainer.render.bind(this, 'USD', 15)();
                this.dom.render.bind(this)();
            })
            .catch(err => console.log(err));
    }
}

const app = new App();