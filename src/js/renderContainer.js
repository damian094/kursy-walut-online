export default class RenderCurrencyContainer {
    constructor() {
        const getCurrencyData = function (currencyCode) {
            return this.data.currentRates.find(data => data.code === currencyCode.toUpperCase())
        };

        const createContainer = code => {
            const mainContainer = document.querySelector(`#mainContainer`);
            const currencyContainer = document.createElement('div');
            currencyContainer.classList.add('currencyContainer');
            currencyContainer.dataset.currency = code;
            mainContainer.appendChild(currencyContainer);
            currencyContainer.appendChild(document.createElement('div')).classList.add('mainInfo', `${code}`);
            currencyContainer.appendChild(document.createElement('div')).classList.add('otherInfo', `${code}`);
        }

        const createMainInfo = function (code, currency, mid) {
            const mainInfoDiv = document.querySelector(`div.mainInfo.${code}`);
            mainInfoDiv.innerHTML = `
            <p><span class="icon" style="background-image: url(images/${code}.png);"></span>${code}<span class="currency">(${currency})<span></ p>
            <p>Kurs: <span class="exchange">${mid.toFixed(4)}</span></p>
            <p class="updateDate">Dane z ${this.data.uploadingDate}</p>`
        }


        const setBacklightColor = (rates, i) => {
            if (i > 0) {
                return rates[i].mid > rates[i - 1].mid ? '#43a047' : '#ff5252'
            } else {
                return '#ccc'
            }

        }

        const createOhterInfo = function (code, days) {
            let lastRates = []
            new Promise(resolve => {
                    this.data.getLastRates(code, days)
                        .then(res => {
                            lastRates = res;
                            lastRates.length = lastRates.length - 1;
                            resolve();
                        })
                        .catch()
                })
                .then(() => {
                    const otherInfoDiv = document.querySelector(`div.otherInfo.${code}`);
                    otherInfoDiv.appendChild(document.createElement('h2')).textContent = 'Ostatnie notowania';
                    for (let i = lastRates.length - 1; i >= 0; i--) {
                        const {
                            effectiveDate,
                            mid
                        } = lastRates[i];
                        const newP = document.createElement('p');
                        otherInfoDiv.appendChild(newP).innerHTML = `<span class="lastRate" style="color: ${setBacklightColor(lastRates, i)};">${mid.toFixed(4)}</span> <span class="lastDate">(${effectiveDate})</span>`;
                    }
                    const chartBtn = document.createElement('button');
                    chartBtn.innerHTML = 'Pokaż wykres <i class="fas fa-chart-line"></i>';
                    otherInfoDiv.appendChild(chartBtn).classList.add('chart');
                    chartBtn.addEventListener('mouseover', () => {
                        otherInfoDiv.classList.add('enableBlur');
                    })
                    chartBtn.addEventListener('mouseleave', () => {
                        otherInfoDiv.classList.remove('enableBlur')
                    })

                    const switchBtn = document.createElement('button');
                    switchBtn.innerHTML = '<i class="fas fa-arrow-circle-up"></i>';
                    otherInfoDiv.appendChild(switchBtn).classList.add('switch');
                    switchBtn.addEventListener('click', function () {
                        otherInfoDiv.classList.toggle('hidden');
                        this.classList.toggle('rotate');
                    })
                })

        }

        this.render = function (currencyCode, days) {
            const currencyData = getCurrencyData.bind(this, currencyCode)();
            if (currencyData) {
                const {
                    currency,
                    code,
                    mid
                } = currencyData
                createContainer(code);
                createMainInfo.bind(this, code, currency, mid)();
                createOhterInfo.bind(this, code, days)();
            } else {
                console.log(`Waluta "${currencyCode}" nie istnieje lub nie ma jej w bazie danych`);
            }
        }
    }
}