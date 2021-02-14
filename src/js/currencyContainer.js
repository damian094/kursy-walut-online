export default class CurrencyContainer {
    constructor() {
        const functions = {
            getCurrencyData(currencyCode) {
                return this.data.currenciesData.find(data => data.code === currencyCode.toUpperCase())
            },
            createContainer(code) {
                const mainContainer = document.querySelector('main');
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
                    return rates[i].mid > rates[i - 1].mid ? '#43a047' : '#e91f00';
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
                    spans.forEach(span => span.style.color = '#e91f00');
                    spans[1].childNodes[0].style.transform = 'rotate(180deg) translateY(-3px)';
                }
            },
            createOhterInfo(code, days) {
                let lastRates = [];
                let lastRatesChart = [];

                return new Promise(resolve => {
                        this.data.getLastRates(code, days)
                            .then(result => {
                                lastRatesChart = result;
                                lastRates = result;
                                lastRates.length = lastRates.length - 1;
                                resolve();
                            })
                            .catch(reason => console.log(reason));
                    })
                    .then(() => {
                        //set backlight color to main info > currency exchange (using 'lastRates' array)
                        setBacklightColorMainInfo(code, lastRates[lastRates.length - 1]);

                        //render other info
                        const otherInfoDiv = document.querySelector(`div.otherInfo.${code}`);
                        otherInfoDiv.appendChild(document.createElement('h2')).textContent = 'Ostatnie notowania';
                        const paragraphsContainer = document.createElement('div');
                        paragraphsContainer.classList.add('paragraphsContainer');
                        if (lastRates.length > 15) {
                            paragraphsContainer.classList.add('scrollable');
                        } else if (lastRates.length > 10 && window.matchMedia('(max-width: 640px)').matches) {
                            paragraphsContainer.classList.add('scrollable');
                        }
                        otherInfoDiv.appendChild(paragraphsContainer);
                        for (let i = lastRates.length - 1; i >= 0; i--) {
                            const {
                                effectiveDate,
                                mid
                            } = lastRates[i];
                            const newP = document.createElement('p');
                            paragraphsContainer.appendChild(newP).innerHTML = `<span class="lastRate" style="color: ${setBacklightColorOtherInfo(lastRates, i)};">${mid.toFixed(4)}</span> <span class="lastDate">(${effectiveDate})</span>`;
                        }

                        //render chart button
                        const chartBtn = document.createElement('button');
                        chartBtn.innerHTML = 'Pokaż wykres <i class="fas fa-chart-line"></i>';
                        otherInfoDiv.appendChild(chartBtn).classList.add('app-btn', 'app-btn--chart');
                        chartBtn.addEventListener('mouseover', () => {
                            otherInfoDiv.classList.add('enableBlur');
                        })
                        chartBtn.addEventListener('mouseleave', () => {
                            otherInfoDiv.classList.remove('enableBlur');
                        })
                        chartBtn.addEventListener('click', () => {
                            const wrapper = document.querySelector('.wrapper');
                            wrapper.classList.add('blurred');

                            const chartContainer = document.querySelector('#chartContainer');
                            chartContainer.classList.add('active');

                            const getDataToChart = (type) => {
                                let labels = [];
                                let data = [];
                                for (let i = 0; i < lastRatesChart.length; i++) {
                                    labels.push(lastRatesChart[i].effectiveDate.substring(5))
                                    data.push(lastRatesChart[i].mid)
                                }
                                if (type === 'labels') return labels
                                if (type === 'data') return data
                            }

                            const chartHeight = window.matchMedia('(max-width: 1024px)').matches ? '200px' : `450px`;
                            const chartWidth = window.matchMedia('(max-width: 1024px)').matches ? '90vw' : `70vw`;
                            const createChart = () => {
                                const myChart = document.createElement('canvas');
                                myChart.id = 'myChart';
                                chartContainer.appendChild(myChart);
                                Chart.defaults.global.maintainAspectRatio = false;
                                Chart.defaults.global.defaultFontColor = '#ddd';
                                myChart.parentNode.style.height = chartHeight;
                                myChart.parentNode.style.width = chartWidth;
                                myChart.parentNode.style.maxWidth = '1200px'
                                var ctx = myChart.getContext('2d');
                                var chart = new Chart(ctx, {
                                    type: 'line',
                                    data: {
                                        labels: getDataToChart('labels'),
                                        datasets: [{
                                            label: code,
                                            borderColor: '#B29700',
                                            borderWidth: 3,
                                            data: getDataToChart('data')
                                        }]
                                    },
                                    options: {
                                        scales: {
                                            yAxes: [{
                                                ticks: {
                                                    stepSize: 0.03
                                                },
                                                gridLines: {
                                                    color: '#b2970070',
                                                    display: true
                                                }
                                            }],
                                            xAxes: [{
                                                gridLines: {
                                                    color: '#b2970070',
                                                    display: true
                                                }
                                            }]
                                        }
                                    }
                                });
                            }
                            createChart();

                            //event listener to close chart
                            const oldElement = document.querySelector('.chartContainer__close');
                            const newElement = oldElement.cloneNode(true);
                            oldElement.parentNode.replaceChild(newElement, oldElement);
                            newElement.addEventListener('click', function () {
                                this.parentNode.removeChild(document.querySelector('#myChart'));
                                chartContainer.classList.remove('active');
                                wrapper.classList.remove('blurred');
                            })
                        })
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
        } = functions;

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