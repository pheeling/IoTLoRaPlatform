// Require the IOTA library
var Converter = require('@iota/converter');

var data = JSON.stringify({"power": 0, "Ws": 0, "relay": "true"});

// Convert the data to trytes
var trytes = Converter.asciiToTrytes(data);

console.log(`${data} converted to trytes: ${trytes}`);

// Convert the trytes back to the original ASCII characters
var message = Converter.trytesToAscii(trytes);

console.log(`${trytes} converted back to data: ${message}`);