// Require the IOTA libraries
import {composeAPI, findTransactions, getBundle, findTransactionObjects, getTransactionObjects} from '@iota/core';
import {Extract} from '@iota/extract-json';
import {encode, extract, decode, iotaAreaCodes} from '@iota/area-codes';

// Create a new instance of the IOTA object
// Use the `provider` field to specify which IRI node to connect to
const iota = composeAPI({
provider: 'https://nodes.devnet.iota.org:443'
});

const seed ="PUEOTSEITFEVEWCWBTSIZM9NKRGJEIMXTULBACGFRQK9IMGICLBKW9TTEVSDQMGWKBXPVCBMMCXWMNPDX"

var iac = encode(47.22681455133932, 8.663277730383621, iotaAreaCodes.CodePrecision.EXTRA);
var allTransactions = [];

console.log("IOTA Area Code", iac);

var locations =[];
// Have to find a better way to distinguish which transaction is important to me
iota.findTransactions({tags:[iac]})
    .then(trytes => {
        iota.getTransactionObjects(trytes)
            .then(
                array => {
                    let i;
                    for(i=0;i<array.length;i++){
                        let areaCode = extract(array[i].tag);
                        let data = decode(areaCode);
                        locations.push({"lat": data.latitude, "lng":data.longitude});
                        allTransactions.push(array[i]);
                    }
                    console.log(`${locations.length} transactions found with the ${iac} tag`)
                    let transaction;
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