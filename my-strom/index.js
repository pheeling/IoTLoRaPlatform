const request = require('request');
var options = {
  'method': 'GET',
  'url': 'http://myStrom-Switch-43F2B8/report',
  'headers': {
  }
};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});