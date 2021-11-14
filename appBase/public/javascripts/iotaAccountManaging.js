const bcrypt = require('bcryptjs');
const fs = require('fs');
const util = require('util');
const filepathEnvFile = 'config/.env'
const envfile = require('envfile');
const saltRounds = 10;

// Convert fs.readFile, fs.writeFile, envfile.parse / readfile,writefile,envParseFile into Promise version of same    
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const appendFile = util.promisify(fs.appendFile);
const envParseFile = util.promisify(envfile.parse)

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
    const { AccountManager } = require('@iota/wallet');
 
    const manager = new AccountManager({
        storagePath: filepathIotaData + dbname + '-database',
    });

    let result = await compareHash(password)
    if(result == true){
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

                const synced = await account.sync();
                console.log('Synced account', synced);
            }
        } catch (error) {
            console.log('Error: ' + error);
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
          }
          catch (err){
            console.log(err)
          }
    });
}

async function compareHash(PlainTextPassword){
    let filecontent = await readFile(filepathEnvFile)
    let parsedFile = envfile.parse(filecontent)
    bcrypt.compare(PlainTextPassword, parsedFile.SH_PASSWORD, function(err, result) {
        console.log(result)
        return result
    });

}

module.exports = { compareHash, savePassword, createDB, createAccount}