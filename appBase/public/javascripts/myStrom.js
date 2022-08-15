const got = require('got');
const solarMeterUrl = 'http://myStrom-Switch-43F2B8/report'

async function getReport() {
    try{
      return await got(solarMeterUrl)
    } catch (e) {
      console.log(e)
      return JSON.parse('{"body": [{"name": "no panel","data": "no data"}]}')
    }
};

module.exports = { getReport }