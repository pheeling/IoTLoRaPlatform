const got = require('got');

var options = {
    'method': 'GET',
    'url': 'http://myStrom-Switch-43F2B8/report',
    'headers': {
    }
  };

(async () => {
	try {
		const response = await got(options);
		console.log('statusCode:', response.statusCode);
		console.log('body:', response.body);
	} catch (error) {
		console.log('error:', error);
	}
})();


