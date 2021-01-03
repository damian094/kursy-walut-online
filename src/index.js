import Data from './js/data.js';
import DOM from './js/dom.js';
import RenderCurrencyContainer from './js/renderContainer.js';
import Background from './js/background.js';


class App {
    constructor() {
        this.data = new Data();
        this.data.getCurrentRates()
            .then(() => {
                this.currencyContainer.render.bind(this, 'eur', 15)();
                this.currencyContainer.render.bind(this, 'gbp', 15)();
                this.currencyContainer.render.bind(this, 'usd', 15)();
            })
            .catch(reject => console.log(reject));
        this.dom = new DOM();
        this.currencyContainer = new RenderCurrencyContainer();
        this.background = new Background();
    }
}

const app = new App();