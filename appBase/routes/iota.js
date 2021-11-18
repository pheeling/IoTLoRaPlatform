var express = require('express');
var router = express.Router();
const pug = require('pug');

// personal modules
var iota = require('../public/javascripts/iotaWriteRead');
var iotaAccount = require ('../public/javascripts/iotaAccountManaging');

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

/* save DB password, keep password always protected */
router.post('/savePassword', function(req, res, next) {
  response = {
    password : req.body.password,
  };
  console.log(response);
  //iotaAccount.savePassword(response.password)
  // redirect doesn't work, goal would be to post and redirected to iota page for further updates
  res.redirect(200,"/iota")
});

// app.use('/iota/createDB', iotaRouter);
// app.use('/iota/createAccount', iotaRouter);
// app.use('/iota/listAddresses', iotaRouter);
// app.use('/iota/checkBalance', iotaRouter);



module.exports = router;
