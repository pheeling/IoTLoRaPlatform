const fs = require('fs');
const util = require('util');
const { resolve } = require('path');
const filepathMessageId = 'log/messageIds.txt'
const filepathMeter = 'log/MeterData.txt'
const messageIdArray = new Array;
const solarMeterUrl = 'http://myStrom-Switch-43F2B8/report'
const got = require('got');
const { getegid } = require('process');
const dataArrayResultIota = new Array

// Convert fs.readFile into Promise version of same    
const readFile = util.promisify(fs.readFile);

async function writeData(data) {

    var response = ''
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
      response = "solid message"
    } else {
      console.log("no solid message");
    }   

    // maybe implement to get data from fs back: https://www.geeksforgeeks.org/how-to-operate-callback-based-fs-appendfile-method-with-promises-in-node-js/
    //TODO Response send to return
    fs.appendFile(filepathMessageId, message_metadata.messageId + "\r\n", function (err) {
      if (err) {
        console.log(err)
      } else {
        console.log('successfully added messageId')
        response = "successfully added " + message_metadata.messageId
      }
    })
    return response
}

async function mystrom() {
  return await got(solarMeterUrl)
};

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

function getContents() {
  try {
    return readFile(filepathMessageId, 'utf8');
  }
  catch (err){
    console.log(err)
  }
}

async function getIotaData(){
  try {
    let messages = await getContents()
    let iotaReturns = getData(messages.split(/\r?\n/))
    return iotaReturns
  }
  catch (err){
    console.log(err)
  } 
}

module.exports = { getData, writeData, mystrom, getIotaData }