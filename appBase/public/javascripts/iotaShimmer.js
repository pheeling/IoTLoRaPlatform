// standard modules
const bcrypt = require('bcryptjs');
const fs = require('fs');
const util = require('util');
const elcomDataCsv = 'config/elcom-data-2022.csv'
const envfile = require('envfile');
const saltRounds = 10;

// Convert fs.readFile, fs.writeFile, envfile.parse / readfile,writefile,envParseFile into Promise version of same    
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const appendFile = util.promisify(fs.appendFile);
const envParseFile = util.promisify(envfile.parse)

// iota Shimmer Account Manager dependency
const filepathIotaData = 'config/shimmer'
const filepathEnvFile = filepathIotaData + '/.env'
const { AccountManager } = require('@iota/wallet');
require('dotenv').config( { path: filepathEnvFile});

async function createAccount(accountName) {
    try {
        const manager = await createAccountManager();

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

async function compareHash(PlainTextPassword){
    try {
        let filecontent = await readFile(filepathEnvFile)
        let parsedFile = envfile.parse(filecontent)
        return await bcrypt.compare(PlainTextPassword, parsedFile.SH_PASSWORD)
    } catch (e) {
        console.log(e)
    }
}

async function createAccountManager(dbname,password) {
    try {
        let result = await compareHash(password)
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

            return manager;
        }
    } catch (error) {
        console.log('Error: ', error);
    }
}

module.exports = { createAccountManager, createAccount}

