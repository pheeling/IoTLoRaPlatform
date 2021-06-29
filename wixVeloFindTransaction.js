// Require the IOTA libraries
import {composeAPI, findTransactions, getBundle, findTransactionObjects, getTransactionObjects} from '@iota/core';
import {Extract} from '@iota/extract-json';
import {} from 'bluebird';


// Create a new instance of the IOTA object
// Use the `provider` field to specify which IRI node to connect to
const iota = composeAPI({
    provider: 'https://nodes.devnet.iota.org:443'
    });

const address = "HEQLOPHILIHELLOPHILIHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWORLDHELLOWOR99D9VKLUBCTB";
var allTransactions = [];

iota.findTransactions({ addresses: [address] })
    .then(trytes => {
        iota.getTransactionObjects(trytes)
            .then(
                array => {
                    let element;
                    for(element of array){
                        allTransactions.push(element);
                    }
                    console.log(`${allTransactions.length} transactions found with the address ${address}`)
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