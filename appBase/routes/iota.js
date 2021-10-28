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

/* Update with current value */
router.get('/sub', function(req, res, next) {
  iota.mystrom().then(response => {
    res.send(response.body)
  });
});

/* Write data to IOTA Tangle. */
router.get('/writeToIota', function(req, res, next) {
  iota.mystrom()
  .then(response => 
    iota.writeData(response.body))
    .then(response =>
      res.send(response))
});

/* Retrieve written data. */
router.get('/getIotaData', function(req, res, next) {
  iota.getIotaData().then(response => 
    res.send(response))
});

module.exports = router;
