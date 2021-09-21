var express = require('express');
var router = express.Router();
const iota = require('../public/javascripts/iotaWriteRead');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', (req, res) => {
  res.render('index', { title: 'SendData' });
  iota.mystrom().then(data => res.send(data));
})

module.exports = router;
