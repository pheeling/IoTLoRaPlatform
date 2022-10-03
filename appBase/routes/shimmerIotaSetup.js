var express = require('express');
var router = express.Router();
const pug = require('pug');

// personal modules
var shimmerIotaAccount = require ('../public/javascripts/shimmerAccountManager');

/* GET iota main side. */
router.get('/', function(req, res, next) {
    res.render('shimmerIotaSetup', { title: 'Shimmer IoTa Setup', dataField: ""})
});

/* create DB, Account and addresses*/
router.post('/DBandAccount', function(req, res, next) {
    response = {
      dbname : req.body.dbname,
      accountName : req.body.accountName,
      password : req.body.password,
    };
    console.log(response);

    shimmerIotaAccount.createAccountManager(response.dbname,response.password)
    .then( manager => {
      shimmerIotaAccount.createAccount(manager,response.accountName)
      .then( result=> {
              res.render('shimmerIotaSetup', { title: 'Shimmer IoTa Setup', dataField: JSON.stringify(result)})
          })
      })
    // redirect doesn't work, goal would be to post and redirected to iota page for further updates
    //res.redirect("/iota")
});

router.post('/setMasterPassword', function(req, res, next) {
  response = {
    masterPassword : req.body.masterPassword,
  };
  console.log(response);

  shimmerIotaAccount.savePassword(response.masterPassword, 1)
  .then( result=> {
            res.render('shimmerIotaSetup', { title: 'Shimmer IoTa Setup', dataField: JSON.stringify(result)})
        })
});

module.exports = router;
