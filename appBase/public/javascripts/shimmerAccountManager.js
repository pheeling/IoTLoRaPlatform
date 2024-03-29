// standard modules
const bcrypt = require('bcryptjs');
const fs = require('fs');
const util = require('util');
const elcomDataCsv = 'config/elcom-data-2022.csv'
const envfile = require('envfile');
const saltRounds = 10;
var managerPerm;
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
const { parse } = require('path');

async function createAccount(manager, accountName) {
    try {
        //const manager = await getUnlockedManager(dbname);

        const account = await manager.createAccount({
            alias: accountName,
        });
        console.log('Account created:', account);
        return account
    } catch (error) {
        console.log('Error: ', error);
        return "Account creation failed"
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
            // 1 = SH_PASSWORD, 2 = MNENOMIC
            await this.savePassword(mnemonic, 2)           
            return manager;
        } else {
            console.log("wrong config")
            throw "wrong config"
        }
    } catch (error) {
        console.log('Error: ', error);
    }
}

async function savePassword(plaintext, property){
    // 1 = SH_PASSWORD, 2 = MNENOMIC
    try {
        var hash = bcrypt.hashSync(plaintext, saltRounds)
        let filecontent = await readFile(filepathEnvFile) 
        let parsedFile = envfile.parse(filecontent);

        if(property == 1){
            parsedFile.SH_PASSWORD = hash
        } else {
            parsedFile.MNEMONIC = hash
        }
        fs.writeFileSync(filepathEnvFile, envfile.stringify(parsedFile))
        console.log("saved mnemonic in file")
        return "saved mnemonic in file"
    } catch (err){
        console.log(err)
        return err
    }
}

async function getUnlockedManager(dbname, strongholdPassword) {
    if(managerPerm == null){
        let manager = new AccountManager({
            storagePath: filepathIotaData + '/' + dbname + '-database',
            clientOptions: {
                nodes: ['https://api.testnet.shimmer.network'],
                localPow: true,
            }
        });
        managerPerm = manager
        await manager.setStrongholdPassword(strongholdPassword);
    } else {
        managerPerm.destroy()
        let manager = new AccountManager({
            storagePath: filepathIotaData + '/' + dbname + '-database',
            clientOptions: {
                nodes: ['https://api.testnet.shimmer.network'],
                localPow: true,
            }
        });
        managerPerm = manager
    }
    return managerPerm;
}

//TODO: Create NFT or native Token to represent energy production
//Idea: create nft based on Report API, can only produce if nft if Ws not null.
async function createAddresses(dbname, accountName, numberOfaddresses, strongholdPassword){
    try {
        const manager = await getUnlockedManager(dbname, strongholdPassword);

        const account = await manager.getAccount(accountName);
        console.log('Account:', account);

        if(!(numberOfaddresses == null)){
            var address = await account.generateAddress(numberOfaddresses);
            console.log('New address:', address);
        } else {
            var address = await account.generateAddress();
            console.log('New address:', address);
        }
        // Use the Faucet to send testnet tokens to your address:
        console.log("Fill your address with the Faucet:  https://faucet.testnet.shimmer.network")
        return address
    } catch (error) {
        console.log('Error: ', error);
    }
}

async function checkBalance(accountName, dbname, strongholdPassword) {
    try {
        const manager = await getUnlockedManager(dbname, strongholdPassword);
        const account = await manager.getAccount(accountName);
        const addressObject = await account.listAddresses();
        console.log('Addresses before:', addressObject);

        // Always sync before calling getBalance()
        const synced = await account.sync();
        console.log('Syncing... - ', synced);

        const balance = await account.getBalance()
        console.log('Available balance', balance);
        managerPerm.destroy()
        return balance
    } catch (error) {
        console.log('Error: ', error);
        managerPerm.destroy()
        return "wrong information supplied"
    }
}

module.exports = { createAccountManager, createAccount, getUnlockedManager, savePassword, createAddresses, checkBalance}

