var express = require('express');
var router = express.Router();
const pug = require('pug');

// personal modules
var iota = require('../public/javascripts/iotaWriteRead');
var mystrom = require('../public/javascripts/myStrom');
var iotaAccount = require ('../public/javascripts/iotaAccountManaging');
var shimmerAccountManager = require('../public/javascripts/shimmerAccountManager');

/* GET iota main side. */
router.get('/', function(req, res, next) {
    res.render('iota', { title: 'IoTa', dataField: ""})
});

/* Update with current value */
router.get('/sub', function(req, res, next) {
  mystrom.getReport().then(response => {
    res.send(response.body)
  });
});

/* Write data to IOTA Tangle. */
router.get('/writeToIota', function(req, res, next) {
  mystrom.getReport()
  .then(response => 
    iota.writeData(response.body))
    .then(response =>
      res.send(response))
});

/* Retrieve written data Production. */
router.get('/getIotaData', function(req, res, next) {
  iota.getIotaData().then(response => 
    res.send(response))
});

/* Retrieve written Earnings. */
router.get('/getIotaDataEarnings', function(req, res, next) {
  iota.getIotaDataEarnings().then(response => 
    res.send(response))
});

/* Write Earnings to IOTA Tangle. */
router.get('/writeEarningsToIota', function(req, res, next) {
  iotaAccount.calculateWattToIota()
  .then(response => 
    res.send(response))
});

/* Retrieve addresses*/
router.post('/listAddresses', function(req, res, next) {
  response = {
    dbname : req.body.dbname,
    accountName : req.body.accountName,
    password : req.body.password,
  };
  console.log(response);
  iotaAccount.listAddresses(response.dbname,response.accountName)
  .then(result => 
    res.render('iota', { title: 'IoTa', dataField: JSON.stringify(result)}))
  // redirect doesn't work, goal would be to post and redirected to iota page for further updates
  //res.redirect("/iota")
});

/* Retrieve shimmer addresses*/
router.post('/shimmerCheckBalance', function(req, res, next) {
  response = {
    dbname : req.body.dbname,
    accountName : req.body.accountName,
    strongholdPassword : req.body.strongholdPassword,
  };
  console.log(response);
  shimmerAccountManager.checkBalance(response.accountName, response.dbname, response.strongholdPassword)
  .then(result => 
    res.render('iota', { title: 'IoTa', dataField: JSON.stringify(result)})
  //TODO: prefill form with previous values (, dbname: JSON.stringify(response.dbname))
  // redirect doesn't work, goal would be to post and redirected to iota page for further updates
  //res.redirect("/iota")
)});

// app.use('/iota/createDB', iotaRouter);
// app.use('/iota/createAccount', iotaRouter);
// app.use('/iota/listAddresses', iotaRouter);
// app.use('/iota/checkBalance', iotaRouter);



module.exports = router;
