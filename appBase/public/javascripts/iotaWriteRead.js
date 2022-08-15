const fs = require('fs');
const util = require('util');
const { resolve } = require('path');
const filepathMessageId = 'log/messageIds.txt'
const filepathMeter = 'log/meterData.txt'
const { getegid } = require('process');

// Convert fs.readFile into Promise version of same    
const readFile = util.promisify(fs.readFile);
const appendFile = util.promisify(fs.appendFile);

async function writeData(data) {
  try{
    const appendDataToFile = async (path, data) => {
      await appendFile(path, data)
      response.push("successfully added " + data)
    }

    var response = []
    const { ClientBuilder } = require('@iota/client');

    // client will connect to testnet by default
    const client = new ClientBuilder()
        .localPow(true)
        .build();

    client.getInfo().then(console.log).catch(console.error);
    
    const tips = await client.getTips();
    const message_metadata = await client.getMessage().metadata(tips[0]);
    if(message_metadata.isSolid == true){
      console.log(message_metadata);
      var message = await client.message()
      .index(message_metadata.messageId)
      .data(data)
      .submit();
      console.log(message)
      response.push("solid message")
    } else {
      console.log("no solid message");
    }
    
    await appendDataToFile(filepathMessageId, 
    message_metadata.messageId + "\r\n")
      .catch(err => {
      console.log(`Error Occurs, 
      Error code -> ${err.code}, 
      Error NO -> ${err.errno}`)
    })

    return response
  } catch (e){
    console.log(e)
    return "Error see console output"
  }  
}

async function writeDataEarnings(data) {
  try{
    const appendDataToFile = async (path, data) => {
      appendFile(path, data)
    }
    var response = []
    const { ClientBuilder } = require('@iota/client');

    // client will connect to testnet by default
    const client = new ClientBuilder()
        .localPow(true)
        .build();

    client.getInfo().then(console.log).catch(console.error);
    
    const tips = await client.getTips();
    const message_metadata = await client.getMessage().metadata(tips[0]);
    if(message_metadata.isSolid == true){
      console.log(message_metadata);
      var message = await client.message()
      .index(message_metadata.messageId)
      .data(data)
      .submit();
      console.log(message)
      response.push("solid message")
    } else {
      console.log("no solid message");
    }   

    // TODO: Send meaningful Output to Frontend
    appendDataToFile(filepathMeter, 
    message_metadata.messageId + "\r\n")
      .catch(err => {
      console.log(`Error Occurs, 
      Error code -> ${err.code}, 
      Error NO -> ${err.errno}`)
    })

    return response
  } catch (e){
    console.log(e)
    return "Error see console output"
  }  
}

async function getData(messageIds){
    const { ClientBuilder } = require('@iota/client');

    // client will connect to testnet by default
    const client = new ClientBuilder().build();
    var results = new Array
    results = await messageIds.map(async element => {
      try{
        var message_index = await client.getMessage().index(element);
        let result = await getMessage(message_index[0],client)
        return result
      }
      catch (err){
        console.log(err)
      }
    });

    return Promise.all(results)
}

async function getMessage(messageId, client){
    const message_data = await client.getMessage().raw(messageId)
    let regex = /{\".*}/g;
    const found = message_data.match(regex);
    return found.toString()
}

function getContentsEnergyProduction() {
  try {
    return readFile(filepathMessageId, 'utf8');
  }
  catch (err){
    console.log(err)
  }
}

async function getIotaData(){
  try {
    let messages = await getContentsEnergyProduction()
    let iotaReturns = getData(messages.split(/\r?\n/))
    return iotaReturns
  }
  catch (err){
    console.log(err)
  } 
}

function getContentsEarnings() {
  try {
    return readFile(filepathMeter, 'utf8');
  }
  catch (err){
    console.log(err)
  }
}

async function getIotaDataEarnings(){
  try {
    let messages = await getContentsEarnings()
    let iotaReturns = getData(messages.split(/\r?\n/))
    return iotaReturns
  }
  catch (err){
    console.log(err)
  } 
}

module.exports = { getData, writeData, getIotaData, getIotaDataEarnings, writeDataEarnings, getContentsEnergyProduction}