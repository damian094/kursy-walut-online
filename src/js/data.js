export default class Data {
    constructor() {
        this.currenciesData = [];
        this.uploadingDate;

        this.getCurrenciesData = () => {
            return new Promise((resolve, reject) => {
                axios.get(`https://api.nbp.pl/api/exchangerates/tables/a`)
                    .then(result => {
                        this.currenciesData = result.data[0].rates;
                        this.uploadingDate = result.data[0].effectiveDate;
                        resolve();
                    })
                    .catch(() => reject(new Error('Cannot found data')))
            })
        }

        this.getLastRates = (currencyCode, days) => {
            days++;
            return new Promise((resolve, reject) => {
                axios.get(`https://api.nbp.pl/api/exchangerates/rates/A/${currencyCode}/last/${days}`)
                    .then(result => {
                        resolve(result.data.rates);
                    })
                    .catch(reason => reject(reason));
            })
        }
    }
}