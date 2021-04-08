// Require the client library packages
const Iota = require('@iota/core');
const Converter = require('@iota/converter');
const iotaAreaCodes = require('@iota/area-codes');
const got = require('got');

// Create a new instance of the IOTA API object
// Use the `provider` field to specify which node to connect to
const iota = Iota.composeAPI({
provider: 'https://nodes.devnet.iota.org:443'
});

const depth = 3;
const minimumWeightMagnitude = 9;

/* const address =
'HEQLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWOR99D';
 */

const address =
'HEQLOPHILIHELLOPHILIHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWOR99D';

const seed =
'PUEOTSEITFEVEWCWBTSIZM9NKRGJEIMXTULBACGFRQK9IMGICLBKW9TTEVSDQMGWKBXPVCBMMCXWMNPDX';

var options = {
    'method': 'GET',
    'url': 'http://myStrom-Switch-43F2B8/report'
};
var iac = iotaAreaCodes.encode(47.22681455133932, 8.663277730383621, iotaAreaCodes.CodePrecision.EXTRA);

const message = JSON.stringify({power: 0, Ws: 0, relay: true, temperature: 4.8100000000000005});

sendIOTAMessage(message);

(async () => {
	try {
		const response = await got(options);
        //const message = JSON.parse(response.body);
		console.log(message);
        //sendIOTAMessage(message);
    } catch (error) {
        console.log(error.response.body);
    }
})();

function sendIOTAMessage (message){
    const messageInTrytes = Converter.asciiToTrytes(message);

    const PrepareTransfers = Iota.createPrepareTransfers();
    const transfers = [
        {
            value: 0,
            address: address,
            message: messageInTrytes,
            tag: iac
        }
    ];

    Iota
        PrepareTransfers(seed, transfers)
        .then(trytes => {
            return iota.sendTrytes(trytes, depth, minimumWeightMagnitude);
        })
        .then(bundle => {
            console.log(bundle[0].hash)
        })
        .catch(err => {
            console.error(err)
        });
}
