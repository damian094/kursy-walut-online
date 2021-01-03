export default class DOM {
    constructor() {
        const mainContainer = document.querySelector('#mainContainer');

        const searchCurrencyBtn = document.querySelector('#search');
        const searchFunction = () => {
            const currencyDivs = document.querySelectorAll('div.currencyContainer');
            if (currencyDivs.length) {
                let delay = 0;
                currencyDivs.forEach(div => div.style.animation = `.4s .${delay++}s hideContainer linear both`);
                setTimeout(() => {
                    for (let i = 0; i < currencyDivs.length; i++) {
                        mainContainer.removeChild(currencyDivs[i]);
                    }
                    const formDiv = document.querySelector('#searchFormContainer');
                    formDiv.style.display = 'flex';
                    formDiv.style.animation = '.4s showContainer linear both';
                }, 600)
            }
        }

        this.render = function () {
            searchCurrencyBtn.addEventListener('click', searchFunction);
        }

        this.render();
    }
}