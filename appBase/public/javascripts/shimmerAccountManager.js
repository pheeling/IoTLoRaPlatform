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

async function createAccount(manager, accountName) {
    try {
        //const manager = await getUnlockedManager(dbname);

        const account = await manager.createAccount({
            alias: accountName,
        });
        console.log('Account created:', account);
    } catch (error) {
        console.log('Error: ', error);
    }
}

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
        let parsedFile = await getEnvFile()
        let result = await cryptfunctions.compareHash(password, parsedFile.SH_PASSWORD)
        if(result == 1){
            const accountManagerOptions = {
                storagePath: filepathIotaData + '/' + dbname + '-database',
                clientOptions: {
                    nodes: ['https://api.testnet.shimmer.network'],
                    localPow: true,
                },
                coinType: CoinType.Shimmer,
                secretManager: {
                    Stronghold: {
                        snapshotPath: filepathIotaData + '/' + dbname + '-wallet.stronghold',
                        password: `${password}`,
                    },
                },
            };
            const manager = new AccountManager(accountManagerOptions)

            await manager.setStrongholdPassword(password);

            const mnemonic = await manager.generateMnemonic()
            console.log('Mnemonic:', mnemonic)
            await manager.verifyMnemonic(mnemonic)
            await manager.storeMnemonic(mnemonic)
            await this.savePassword(mnemonic)           
            return manager;
        } else {
            console.log("Password wrong")
        }
    } catch (error) {
        console.log('Error: ', error);
    }
}

async function savePassword(plaintext){
    try {
        var hash = bcrypt.hashSync(plaintext, saltRounds)
        let filecontent = await readFile(filepathEnvFile) 
        let parsedFile = envfile.parse(filecontent);
        parsedFile.MNEMONIC = hash
        fs.writeFileSync(filepathEnvFile, envfile.stringify(parsedFile))
        console.log("saved mnemonic in file")
    } catch (err){
        console.log(err)
    }
}

async function getUnlockedManager(dbname) {
    //TODO: Check If unlockedManager works to get Account etc after Lock is released.
    const manager = new AccountManager({
        storagePath: filepathIotaData + '/' + dbname + '-database',
        clientOptions: {
            nodes: ['https://api.testnet.shimmer.network'],
            localPow: true,
        }
    });
    await manager.setStrongholdPassword(process.env.SH_PASSWORD);
    return manager;
}

//TODO: Generate addresses

module.exports = { createAccountManager, createAccount, getUnlockedManager, savePassword}

