var express = require('express');
var router = express.Router();
const pug = require('pug');

// personal modules
var iota = require('../public/javascripts/iotaWriteRead');

/* GET solarMeterData listing. */
router.get('/', function(req, res, next) {
    iota.mystrom().then(response => {
      res.render('iota', { title: 'IoTa', dataField: response.body})
    });
});

router.get('/sub', function(req, res, next) {
  iota.mystrom().then(response => {
    res.send(response.body)
  });
});

router.get('/writeToIota', function(req, res, next) {
  iota.mystrom().then(response => {
    iota.writeData(response)  });
});

module.exports = router;
