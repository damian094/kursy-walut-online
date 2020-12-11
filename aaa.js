import superagent from 'superagent';

superagent
.get('http://api.nbp.pl/api/exchangerates/rates/A/EUR/?format=json')
.set('accept', 'json')
.end((err, res)=>{
    console.log(res.status, res.body.code, res)
})