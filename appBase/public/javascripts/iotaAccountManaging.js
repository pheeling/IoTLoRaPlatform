// modules for wattcalculation
const iota = require('./iotaWriteRead');

// standard modules
const bcrypt = require('bcryptjs');
const fs = require('fs');
const util = require('util');
const filepathEnvFile = 'config/.env'
const elcomDataCsv = 'config/elcom-data-2022.csv'
const envfile = require('envfile');
const saltRounds = 10;

// Convert fs.readFile, fs.writeFile, envfile.parse / readfile,writefile,envParseFile into Promise version of same    
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const appendFile = util.promisify(fs.appendFile);
const envParseFile = util.promisify(envfile.parse)

// dependency calculateWatt to parse CSV File
const {parse} = require('csv-parse');
const { finished } = require('stream/promises');

const processFile = async () => {
    const records = [];
    const parser = fs
      .createReadStream(elcomDataCsv)
      .pipe(parse({ delimiter: ',' }));
    parser.on('readable', function(){
      let record; 
      while ((record = parser.read()) !== null) {
      // Work with each record
      var temp = new ElcomData(...record)
        records.push(temp);
      }
    });
    await finished(parser);
    return records;
};

class ElcomData {
    constructor(period,operator,operatorLabel,category,product,aidfee,fixcosts,charge,gridusage,energy,total) {
      this.period = period;
      this.operator = operator;
      this.operatorLabel = operatorLabel;
      this.category = category;
      this.product = product;
      this.aidfee = aidfee;
      this.fixcosts = fixcosts;
      this.charge = charge;
      this.gridusage = gridusage;
      this.energy = energy;
      this.total = total;
    }
}

// iota Account Manager dependency
require('dotenv').config();
const filepathIotaData = 'config/'

require('dotenv').config();

async function createDB(dbname,password) {
    const { AccountManager } = require('@iota/wallet');
 
    const manager = new AccountManager({
        storagePath: filepathIotaData + dbname + '-database',
    });
    let result = await compareHash(password)
    if(result == true){
        try {
            manager.setStrongholdPassword(password);
        } catch (error) {
            console.log('Error: ' + error);
        }
    }
}

async function createAccount(dbname,accountName,password){
    const { AccountManager,SignerType  } = require('@iota/wallet');
    const manager = new AccountManager({
        storagePath: filepathIotaData + dbname + '-database',
    });

    let result = await compareHash(password)
    if(result == 1){
        try {
            manager.setStrongholdPassword(password);
            let account;
            try {
                account = manager.getAccount(accountName);
            } catch (e) {
                console.log("Couldn't get account, creating a new one");
            }

            if (!account) {
                manager.storeMnemonic(SignerType.Stronghold);
                account = manager.createAccount({
                    clientOptions: {
                        node: { url: 'https://api.lb-0.h.chrysalis-devnet.iota.cafe' },
                        localPow: true,
                    },
                    alias: accountName,
                });
                console.log('Account created:', account.id());
            }
    
            const synced = await account.sync();
            console.log('Synced account', synced);
        } catch (error) {
            console.log('Error: ' + error);
        }
    }
}

async function createAddress(dbname,accountName,password) {
    const { AccountManager } = require('@iota/wallet');
    
    const manager = new AccountManager({
        storagePath: filepathIotaData + dbname + '-database',
    });

    let result = await compareHash(password)
    if(result == 1){
        try {
            manager.setStrongholdPassword(password);
            account = manager.getAccount(accountName);
            console.log('Account:', account.alias());
            
                // Always sync before doing anything with the account
                await account.sync();
                console.log('Syncing...');

                const address = account.generateAddress();
                console.log('New address:', address);

                // You can also get the latest unused address:
                const addressObject = account.latestAddress();
                console.log('Address:', addressObject.address);

                // Use the Chrysalis Faucet to send testnet tokens to your address:

                console.log(
                    'Fill your address with the Faucet: https://faucet.chrysalis-devnet.iota.cafe/',
                );
                
                const addresses = account.listAddresses();
                console.log('Addresses:', addresses);
                return await addresses
        } catch (e) {
            console.log(e);
        }
    }   
}

function savePassword(PlainTextPassword){
    bcrypt.hash(PlainTextPassword, saltRounds, function(err, hash) {
        try {
            //https://stackoverflow.com/questions/53360535/how-to-save-changes-in-env-file-in-node-js
            let parsedFile = envParseFile(filepathEnvFile);
            parsedFile.SH_PASSWORD = hash
            writeFile(filepathEnvFile, envfile.stringify(parsedFile))
            console.log("saved hash")
            return "saved hash"
          }
          catch (err){
            console.log(err)
          }
    });
}

async function compareHash(PlainTextPassword){
    try {
        let filecontent = await readFile(filepathEnvFile)
        let parsedFile = envfile.parse(filecontent)
        return await bcrypt.compare(PlainTextPassword, parsedFile.SH_PASSWORD)
    } catch (e) {
        console.log(e)
    }
}

async function listAddresses(dbname,accountName){
    const { AccountManager } = require('@iota/wallet');
    
    const manager = new AccountManager({
        storagePath: filepathIotaData + dbname + '-database',
    });

    try {
        account = manager.getAccount(accountName);
        console.log('Account:', account.alias());

        // Always sync before doing anything with the account
        await account.sync();
        console.log('Syncing...');

        const addresses = account.listAddresses();
        console.log('Addresses:', addresses);
        return addresses
    } catch (e) {
        console.log(e)
    }
}

function sendValue(value, account, address){
    
}

async function checkBalance(dbname,accountName){
    const { AccountManager } = require('@iota/wallet');
    
    const manager = new AccountManager({
        storagePath: filepathIotaData + dbname + '-database',
    });

    try {
        account = manager.getAccount(accountName);
        console.log('Account:', account.alias());

        // Always sync before doing anything with the account
        await account.sync();
        console.log('Syncing...');
        console.log('Available balance', account.balance().available);

        return account.balance().available
    } catch (e) {
        console.log(e)
    }
}

function backupWallet(){

}

function filterItems(element){
    return element.operator == 486 &&
         element.category == "H4" &&
         element.product == "standard";
}

async function calculateWattToIota(){
    // TODO: Response not displayed on frontend
    try{
        var elcomDataObject = await processFile();
        var result = elcomDataObject.filter(filterItems)
        var calculatoryPriceTotalkwh = await result.reduce((previousValue, currentValue) => 
            (parseFloat(previousValue.total) + parseFloat(currentValue.total))/result.length
        );
        
        let datamap = await iota.getIotaData()
        let messagesId = (await iota.getContentsEnergyProduction()).split(/\r?\n/)
        counter = 0
        datamap.forEach(element => {
            var data = JSON.parse(element)
            let earnings = parseFloat(data.Ws) * calculatoryPriceTotalkwh/3600000
            let message = '{"Rp/Ws_Produced": "' + earnings + '" ,"source_message_id": "' + messagesId[counter] + '"}'
            console.log(message)
            iota.writeDataEarnings(message)
        });
        response = "Successfully uploaded earnings"
        return response
    } catch (e) {
        console.log(e)
    }   
}



module.exports = { compareHash, savePassword, createDB, createAccount, createAddress, listAddresses, checkBalance, calculateWattToIota } //, loadElcomData}