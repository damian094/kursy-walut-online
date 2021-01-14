export default class RenderCurrencyContainer {
    constructor() {

        const functions = {
            getCurrencyData(currencyCode) {
                return this.data.currenciesDatas.find(data => data.code === currencyCode.toUpperCase())
            },
            createContainer(code) {
                const mainContainer = document.querySelector(`#mainContainer`);
                const currencyContainer = document.createElement('div');
                currencyContainer.classList.add('currencyContainer');
                currencyContainer.dataset.currency = code;
                mainContainer.appendChild(currencyContainer);
                currencyContainer.appendChild(document.createElement('div')).classList.add('mainInfo', `${code}`);
                currencyContainer.appendChild(document.createElement('div')).classList.add('otherInfo', `${code}`);
                return currencyContainer
            },
            createMainInfo(code, currency, mid) {
                const mainInfoDiv = document.querySelector(`div.mainInfo.${code}`);
                mainInfoDiv.innerHTML = `
            <div class="name"><span class="icon" style="background-image: url(images/flags/${code}.png);"></span>${code}<span class="currency">(${currency})<span></div>
            <div class="currentExchange"><p>Kurs: <span class="exchange backlight ${code}">${mid.toFixed(4)}</span><span class="trend backlight ${code}"><i class="fas fa-caret-up"></i></span></p></div>
            <div class="updateDate"><p>Dane z ${this.data.uploadingDate}</p></div>`
            },
            setBacklightColorOtherInfo(rates, i) {
                if (i > 0) {
                    return rates[i].mid > rates[i - 1].mid ? '#43a047' : '#ff2400';
                } else {
                    return '#ccc';
                }
            },
            setBacklightColorMainInfo: (code, rate) => {
                const spans = document.querySelectorAll(`span.backlight.${code}`);
                const currentRate = spans[0].textContent * 1;
                const lastRate = rate.mid;
                if (currentRate > lastRate) {
                    spans.forEach(span => span.style.color = '#43a047');
                } else {
                    spans.forEach(span => span.style.color = '#ff2400');
                    spans[1].childNodes[0].style.transform = 'rotate(180deg) translateY(-3px)';
                }
            },
            createOhterInfo(code, days) {
                let lastRates = [];

                return new Promise(resolve => {
                        this.data.getLastRates(code, days)
                            .then(res => {
                                lastRates = res;
                                lastRates.length = lastRates.length - 1;
                                resolve();
                            })
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
                            otherInfoDiv.appendChild(newP).innerHTML = `<span class="lastRate" style="color: ${setBacklightColorOtherInfo(lastRates, i)};">${mid.toFixed(4)}</span> <span class="lastDate">(${effectiveDate})</span>`;
                        }

                        const chartBtn = document.createElement('button');
                        chartBtn.innerHTML = 'Pokaż wykres <i class="fas fa-chart-line"></i>';
                        otherInfoDiv.appendChild(chartBtn).classList.add('chart');
                        chartBtn.addEventListener('mouseover', () => {
                            otherInfoDiv.classList.add('enableBlur');
                        })
                        chartBtn.addEventListener('mouseleave', () => {
                            otherInfoDiv.classList.remove('enableBlur');
                        })


                        const switchBtn = document.createElement('button');
                        if (window.matchMedia('(max-width: 1024px)').matches) {
                            switchBtn.innerHTML = '<i class="fas fa-arrow-circle-up"></i>';

                            switchBtn.addEventListener('click', function () {
                                otherInfoDiv.classList.toggle('hidden');
                                this.classList.toggle('rotate');
                            })
                        } else {
                            switchBtn.style.cursor = 'default';
                        }
                        otherInfoDiv.appendChild(switchBtn).classList.add('switch');

                        setBacklightColorMainInfo(code, lastRates[lastRates.length - 1]);
                    })
            }
        }

        const {
            getCurrencyData,
            createContainer,
            createMainInfo,
            setBacklightColorOtherInfo,
            setBacklightColorMainInfo,
            createOhterInfo
        } = functions

        this.render = function (currencyCode, days) {
            let container;
            return new Promise(resolve => {
                    const currencyData = getCurrencyData.bind(this, currencyCode)();
                    if (currencyData) {
                        const {
                            currency,
                            code,
                            mid
                        } = currencyData;
                        container = createContainer(code);
                        createMainInfo.bind(this, code, currency, mid)();
                        createOhterInfo.bind(this, code, days)()
                            .then(() => resolve(container))
                    } else {
                        alert(`Waluta "${currencyCode}" nie jest obecnie dostępna`);
                    }
                })
                .then(container => {
                    //synchronously displaying complete containers
                    container.classList.add('downloaded');
                    const containers = [...document.querySelectorAll('.currencyContainer')];
                    const downloadedContainers = containers.filter(con => con.classList.contains('downloaded'));
                    let delay = 0;
                    if (containers.length === downloadedContainers.length) {
                        containers.forEach(con => con.style.animation = `.4s .${delay++}s showContainer linear both`);
                    }
                })
        }
    }
}