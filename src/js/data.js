export default class Data {
    constructor() {
        this.currentRates = [];
        this.uploadingDate;

        this.getCurrentRates = () => {
            return new Promise((resolve) => {
                axios.get(`https://api.nbp.pl/api/exchangerates/tables/a`)
                    .then(res => {
                        this.currentRates = res.data[0].rates;
                        this.uploadingDate = res.data[0].effectiveDate;
                        resolve();
                    })
                    .catch(err => alert(err))
            })
        }

        this.getLastRates = (currencyCode, days) => {
            return new Promise((resolve, reject) => {
                axios.get(`https://api.nbp.pl/api/exchangerates/rates/A/${currencyCode}/last/${days}`)
                    .then(res => {
                        resolve(res.data.rates)
                    })
                    .catch(err => reject(err))
            })
        }
    }
}