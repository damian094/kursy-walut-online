export default class Data {
    constructor() {
        this.currenciesDatas = [];
        this.uploadingDate;

        this.getCurrenciesDatas = () => {
            return new Promise((resolve, reject) => {
                axios.get(`https://api.nbp.pl/api/exchangerates/tables/a`)
                    .then(res => {
                        this.currenciesDatas = res.data[0].rates;
                        this.uploadingDate = res.data[0].effectiveDate;
                        resolve();
                    })
                    .catch(() => reject(new Error('Cannot found data')))
            })
        }

        this.getLastRates = (currencyCode, days) => {
            days++;
            return new Promise((resolve, reject) => {
                axios.get(`https://api.nbp.pl/api/exchangerates/rates/A/${currencyCode}/last/${days}`)
                    .then(res => {
                        resolve(res.data.rates);
                    })
                    .catch(err => reject(err));
            })
        }
    }
}