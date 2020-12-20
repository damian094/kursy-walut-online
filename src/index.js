// class App {
//     constructor() {
//         this.data = [];
//         this.uploadingDate;

//         const getData = () => {
//             return new Promise((resolve) => {
//                 axios.get(`https://api.nbp.pl/api/exchangerates/tables/a/`)
//                     .then(res => {
//                         this.data = res.data[0].rates;
//                         this.uploadingDate = res.data[0].effectiveDate;
//                         resolve();
//                     })
//                     .catch(err => alert(err))
//             })
//         }
//         getData()
//             .then(() => {
//                 this.render('eur', 15);
//                 this.render('gbp', 15);
//                 this.render('usd', 15);
//                 this.render('chf', 15);
//             });


//         this.getLastRates = (currencyCode, days) => {
//             return new Promise((resolve, reject) => {
//                 axios.get(`https://api.nbp.pl/api/exchangerates/rates/A/${currencyCode}/last/${days}/`)
//                     .then(res => {
//                         resolve(res.data.rates)
//                     })
//                     .catch(err => reject(err))
//             })
//         }

//         this.render = (currencyCode, days) => {
//             const currentCurrency = this.data.find(data => data.code === currencyCode.toUpperCase());
//             if (currentCurrency) {
//                 const {
//                     currency,
//                     code,
//                     mid
//                 } = currentCurrency

//                 const mainContainer = document.querySelector(`#mainContainer`);
//                 const currencyContainer = document.createElement('div');
//                 currencyContainer.classList.add('currencyContainer');
//                 currencyContainer.dataset.currency = code;
//                 mainContainer.appendChild(currencyContainer);

//                 currencyContainer.appendChild(document.createElement('div')).classList.add('mainInfo', `${code}`);
//                 currencyContainer.appendChild(document.createElement('div')).classList.add('otherInfo', `${code}`);

//                 const mainInfoDiv = document.querySelector(`div.mainInfo.${code}`);
//                 mainInfoDiv.innerHTML = `
//                 <p><span class="icon" style="background-image: url(images/${code}.png);"></span>${code}<span class="currency">(${currency})<span></ p>
//                 <p>Kurs: <span class="exchange">${mid.toFixed(4)}</span></p>
//                 <p class="updateDate">Dane z ${this.uploadingDate}</p>`

//                 let lastRates = []
//                 new Promise(resolve => {
//                         this.getLastRates(currencyCode, days)
//                             .then(res => {
//                                 lastRates = res;
//                                 lastRates.length = lastRates.length - 1;
//                                 lastRates.reverse();
//                                 resolve();
//                             })
//                             .catch()
//                     })
//                     .then(() => {
//                         const otherInfoDiv = document.querySelector(`div.otherInfo.${code}`);
//                         otherInfoDiv.appendChild(document.createElement('h2')).textContent = 'Ostatnie notowania'
//                         for (let i = 0; i < lastRates.length; i++) {
//                             const {
//                                 effectiveDate,
//                                 mid
//                             } = lastRates[i];
//                             const newP = document.createElement('p');
//                             otherInfoDiv.appendChild(newP).innerHTML = `<span class="lastRate">${mid.toFixed(4)}</span> <span class="lastDate">(${effectiveDate})</span>`
//                         }
//                         const chartBtn = document.createElement('button');
//                         chartBtn.innerHTML = 'Pokaż wykres <i class="fas fa-chart-line"></i>';
//                         otherInfoDiv.appendChild(chartBtn).classList.add('chart');

//                         const switchBtn = document.createElement('button');
//                         switchBtn.innerHTML = '<i class="fas fa-arrow-circle-up"></i>';
//                         otherInfoDiv.appendChild(switchBtn).classList.add('switch');
//                         switchBtn.addEventListener('click', function () {
//                             otherInfoDiv.classList.toggle('hidden');
//                             this.classList.toggle('rotate');
//                         })
//                     })


//             } else {
//                 console.log('Wybrana waluta nie istnieje lub nie ma jej w bazie danych')
//             }
//         }
//     }
// }


// const app = new App();


import Data from './js/data.js';
import DOM from './js/dom.js';
import RenderCurrencyContainer from './js/renderContainer.js';


class App {
    constructor() {
        this.data = new Data();
        this.data.getCurrentRates()
            .then(() => {
                this.currencyContainer.render.bind(this, 'eur', 15)();
                this.currencyContainer.render.bind(this, 'gbp', 15)();
                this.currencyContainer.render.bind(this, 'chf', 15)();
            });
        this.dom = new DOM();
        this.currencyContainer = new RenderCurrencyContainer();
    }
}

const app = new App();