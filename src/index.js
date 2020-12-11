// const createElement = (err, res, resolve, reject) => {
//     if (err) throw reject(new Error('Nie znaleziono strony. Error 404'));
//     console.log(res.status, res.body.code, res.body.rates[0].mid, res.body.rates[0].effectiveDate);
//     resolve();
// }

// const getAPI = () => {
//     return new Promise((resolve, reject) => {
//             superagent
//                 .get('http://api.nbp.pl/api/exchangerates/rates/A/EUR')
//                 .end((err, res) => {
//                     createElement(err, res, resolve, reject);
//                 })

//             // superagent
//             //     .get('http://api.nbp.pl/api/exchangerates/rates/A/GBP')
//             //     .end((err, res) => {
//             //         createElement(err, res, resolve, reject);
//             //     })
//             // superagent
//             //     .get('http://api.nbp.pl/api/exchangerates/rates/A/CHF')
//             //     .end((err, res) => {
//             //         createElement(err, res, resolve, reject);
//             //     })

//         })
//         .then(() => {
//             return new Promise((resolve, reject) => {
//                 superagent
//                     .get('http://api.nbp.pl/api/exchangerates/rates/A/USD')
//                     .end((err, res) => {
//                         createElement(err, res, resolve, reject);
//                     })
//             })
//             .catch(()=>console.log('nok USD'))

//         })
//         .then(() => {
//             return new Promise((resolve, reject) => {
//                 superagent
//                     .get('http://api.nbp.pl/api/exchangerates/rates/A/GBP')
//                     .end((err, res) => {
//                         createElement(err, res, resolve, reject);
//                     })
//             })

//         })
//         .then(() => {
//             return new Promise((resolve, reject) => {
//                 superagent
//                     .get('http://api.nbp.pl/api/exchangerates/rates/A/CHF')
//                     .end((err, res) => {
//                         createElement(err, res, resolve, reject);
//                     })
//             })

//         })
//         .then(() => console.log('ok'))
//         .catch(() => console.log('nok'))

// }


// const getAPI = () => {
//     new Promise((resolve, reject) => {
//             superagent
//                 .get('http://api.nbp.pl/api/exchangerates/rates/A/EUR')
//                 .end((err, res) => {
//                     createElement(err, res, resolve, reject);
//                 })
//         })
//         .then(resolve => console.log(resolve))
//         .catch(reject => console.log(reject, 'nok EUR'))

//     new Promise((resolve, reject) => {
//             superagent
//                 .get('http://api.nbp.pl/api/exchangerates/rates/A/GBP')
//                 .end((err, res) => {
//                     createElement(err, res, resolve, reject);
//                 })
//         })
//         .then(resolve => console.log(resolve))
//         .catch(reject => console.log(reject, 'nok GBP'))

//         new Promise((resolve, reject) => {
//             superagent
//                 .get('http://api.nbp.pl/api/exchangerates/rates/A/CHF')
//                 .end((err, res) => {
//                     createElement(err, res, resolve, reject);
//                 })
//         })
//         .then(resolve => console.log(resolve))
//         .catch(reject => console.log(reject, 'nok CHF'))

//         new Promise((resolve, reject) => {
//             superagent
//                 .get('http://api.nbp.pl/api/exchangerates/rates/A/USD')
//                 .end((err, res) => {
//                     createElement(err, res, resolve, reject);
//                 })
//         })
//         .then(resolve => console.log(resolve))
//         .catch(reject => console.log(reject, 'nok USD'))

//     // superagent
//     //     .get('http://api.nbp.pl/api/exchangerates/rates/A/GBP')
//     //     .end((err, res) => {
//     //         createElement(err, res, resolve, reject);
//     //     })
//     // superagent
//     //     .get('http://api.nbp.pl/api/exchangerates/rates/A/CHF')
//     //     .end((err, res) => {
//     //         createElement(err, res, resolve, reject);
//     //     })

// }

class App {
    constructor() {
        const currency = ['EUR', 'GBP', 'USD', 'CHF'];
        let requestCounter = 0;
        const solveRequest = (err, res, resolve, reject, currentCurrency) => {
            if (err) return reject(new Error('Nie znaleziono strony. Error 404'));
            console.log(res.status, res.body.currency, res.body.code, res.body.rates[0].mid, res.body.rates[0].effectiveDate);
            const mainCurrencyDivs = [...document.querySelectorAll('.mainCurrency>div')];
            const currentDiv = mainCurrencyDivs.find(div => div.dataset.currency === currentCurrency);
            console.log(currentDiv)
            currentDiv.innerHTML = `<p><span class="icon" style="background-image: url(images/${currentCurrency}.png);"></span>${res.body.code}<span class="currency">(${res.body.currency})</span></p><p>Kurs: <span class="exchange">${res.body.rates[0].mid.toFixed(4)}</span></p><p class="updateDate">Dane z ${res.body.rates[0].effectiveDate}</p>`
            resolve(++requestCounter);
        }
        this.render = () => {
            new Promise(resolve => {
                    for (let i = 0; i < currency.length; i++) {
                        new Promise((resolve, reject) => {
                                superagent
                                    .get(`https://api.nbp.pl/api/exchangerates/rates/A/${currency[i]}`)
                                    .end((err, res) => {
                                        solveRequest(err, res, resolve, reject, currency[i]);
                                    })
                            })
                            .then(resolvedRequestNumber => {
                                console.log(`OK ${currency[i]}`);
                                resolvedRequestNumber === currency.length ? resolve() : undefined;
                            })
                            .catch(reject => console.log(reject, `NOK ${currency[i]}`));
                    }
                })
                .then(() => console.log('Koniec'))
        }
        this.render()
    }
}

const app = new App();