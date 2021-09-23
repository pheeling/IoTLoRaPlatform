var express = require('express');
var router = express.Router();
const pug = require('pug');

// personal modules
var iota = require('../public/javascripts/iotaWriteRead');
// Where ist the problem to load per button??


/* GET solarMeterData listing. */
router.get('/', function(req, res, next) {
  const compiledFunction = pug.compileFile("views/iota.pug");
  result = iota.mystrom().then(data => compiledFunction({
    dataField: data
    }));
  res.render('iota', { title: 'IoTa'});
});

module.exports = router;
