// standard modules
const bcrypt = require('bcryptjs');
const fs = require('fs');
const util = require('util');
const elcomDataCsv = 'config/elcom-data-2022.csv'
const envfile = require('envfile');
const saltRounds = 10;
var path = require('path');

// Convert fs.readFile, fs.writeFile, envfile.parse / readfile,writefile,envParseFile into Promise version of same    
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const appendFile = util.promisify(fs.appendFile);
const envParseFile = util.promisify(envfile.parse)

// iota Shimmer Account Manager dependency
const filepathIotaData = path.join(__dirname, '..','..','config', 'shimmer');
const filepathEnvFile = filepathIotaData + '\\.env'
const { AccountManager, CoinType } = require('@iota/wallet');
require('dotenv').config( { path: filepathEnvFile});
var cryptfunctions = require ('./hashing');

async function createAccount(accountName,dbname) {
    try {
        const manager = await getUnlockedManager(dbname);

        const account = await manager.createAccount({
            alias: accountName,
        });
        console.log('Account created:', account);
    } catch (error) {
        console.log('Error: ', error);
    }
}

//TODO: How to deal with env File. 
// Goal is to have only a hashed version available and compare it to the user input

async function getEnvFile(){
    try {
        let filecontent = await readFile(filepathEnvFile)
        let parsedFile = envfile.parse(filecontent)
        return parsedFile
    } catch (e) {
        console.log(e)
    }
}

async function createAccountManager(dbname,password) {
    try {
        //TODO: Compare doesn't work... 
        let parsedFile = await getEnvFile()
        let result = await cryptfunctions.compareHash(password, parsedFile.SH_PASSWORD)
        if(result == 1){
            const accountManagerOptions = {
                storagePath: filepathIotaData + dbname + '-database',
                clientOptions: {
                    nodes: ['https://api.testnet.shimmer.network'],
                    localPow: true,
                },
                coinType: CoinType.Shimmer,
                secretManager: {
                    Stronghold: {
                        snapshotPath: filepathIotaData + '/wallet.stronghold',
                        password: `${password}`,
                    },
                },
            };
            const manager = new AccountManager(accountManagerOptions);

            const mnemonic = await manager.generateMnemonic()
            .then( () => 
                console.log('Mnemonic:', mnemonic),
                manager.verifyMnemonic(mnemonic))
                .then( () => 
                    manager.storeMnemonic(mnemonic))
                    this.savePassword(mnemonic)           
            return manager;
        } else {
            console.log("Password wrong")
        }
    } catch (error) {
        console.log('Error: ', error);
    }
}

function savePassword(plaintext){
    bcrypt.hash(plaintext, saltRounds, function(err, hash) {
        try {
            //https://stackoverflow.com/questions/53360535/how-to-save-changes-in-env-file-in-node-js
            let parsedFile = envParseFile(filepathEnvFile);
            parsedFile.MNEMONIC = hash
            writeFile(filepathEnvFile, envfile.stringify(parsedFile))
            console.log("saved mnemonic in file")
            return "saved mnemonic in file"
          }
          catch (err){
            console.log(err)
          }
    });
}

async function getUnlockedManager(dbname) {
    const manager = new AccountManager({
        storagePath: filepathIotaData + dbname + '-database',
    });
    await manager.setStrongholdPassword(process.env.SH_PASSWORD);
    return manager;
}

module.exports = { createAccountManager, createAccount, getUnlockedManager, savePassword}
