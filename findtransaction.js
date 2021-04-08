// Require the IOTA libraries
const Iota = require('@iota/core');
const iotaAreaCodes = require('@iota/area-codes');
const Extract = require('@iota/extract-json');

// Create a new instance of the IOTA object
// Use the `provider` field to specify which IRI node to connect to
const iota = Iota.composeAPI({
provider: 'https://nodes.devnet.iota.org:443'
});

const seed ="PUEOTSEITFEVEWCWBTSIZM9NKRGJEIMXTULBACGFRQK9IMGICLBKW9TTEVSDQMGWKBXPVCBMMCXWMNPDX"

var iac = iotaAreaCodes.encode(47.22681455133932, 8.663277730383621, iotaAreaCodes.CodePrecision.EXTRA);
var allTransactions = [];

console.log("IOTA Area Code", iac);

var locations =[];
// Have to find a better way to distinguish which transaction is important to me
iota.findTransactions({tags:[iac]})
    .then(trytes => {
        iota.getTransactionObjects(trytes)
            .then(
                array => {
                    for(i=0;i<array.length;i++){
                        let areaCode = iotaAreaCodes.extract(array[i].tag);
                        let data = iotaAreaCodes.decode(areaCode);
                        locations.push({"lat": data.latitude, "lng":data.longitude});
                        allTransactions.push(array[i]);
                    }
                    console.log(`${locations.length} transactions found with the ${iac} tag`)
                    for (transaction of allTransactions){
                        iota.getBundle(transaction.trunkTransaction)
                        .then(bundle => {
                            console.log(bundle.length);
                            console.log(JSON.parse(Extract.extractJson(bundle)));
                        });
                    }
                }
            )
        }
    )
.catch(err => {
// Catch any errors
console.log(err);
});