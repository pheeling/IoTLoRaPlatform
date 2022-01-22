var express = require('express');
var router = express.Router();
const pug = require('pug');

// personal modules
var iotaAccount = require ('../public/javascripts/iotaAccountManaging');

/* GET iota main side. */
router.get('/', function(req, res, next) {
    res.render('iotaSetup', { title: 'IoTa Setup', dataField: ""})
});

/* create DB, Account and addresses*/
router.post('/setupDBandAccount', function(req, res, next) {
  response = {
    dbname : req.body.dbname,
    accountName : req.body.accountName,
    password : req.body.password,
  };
  console.log(response);

  iotaAccount.createDB(response.dbname,response.password)
  .then( () => {
    iotaAccount.createAccount(response.dbname,response.accountName,response.password)
    .then( () => {
      iotaAccount.createAddress(response.dbname,response.accountName,response.password)
        .then(result =>{
            res.render('iotaSetup', { title: 'IoTaSetup', dataField: JSON.stringify(result)})
        })
    })})
  // redirect doesn't work, goal would be to post and redirected to iota page for further updates
  //res.redirect("/iota")
});

module.exports = router;
