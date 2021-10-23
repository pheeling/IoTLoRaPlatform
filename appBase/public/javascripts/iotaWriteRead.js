const fs = require('fs');
const { resolve } = require('path');
const filepathMessageId = 'log/messageIds.txt'
const filepathMeter = 'log/MeterData.txt'
const messageIdArray = new Array;
const solarMeterUrl = 'http://myStrom-Switch-43F2B8/report'
const got = require('got');

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

async function getData(messageId){
  const { ClientBuilder } = require('@iota/client');

  // client will connect to testnet by default
  const client = new ClientBuilder().build();

  const message_index = await client.getMessage().index(messageId);
  const messages = new Array;
  // console.log(message_index);

  message_index.forEach(element => {
    messages.push(getMessage(element, client))
  });
  return messages.toString()
}

async function getMessage(messageId, client){
    const message_data = await client.getMessage().raw(messageId)
    let regex = /{\".*}/g;
    const found = message_data.match(regex);
    //console.log(found.toString());
    return found.toString()
}

async function getMessageId(){
  return new Promise(function(resolve, reject) {
    const dataArray = new Array
    fs.readFile(filepathMessageId, 'utf8', function (err,data) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        // console.log(data);
        const lines = data.split(/\r?\n/);
        lines.forEach(element => {
          if(element.length > 0){
            dataArray.push(getData(element))
          }
        });
        resolve(dataArray)
      }
    });
  });
}

module.exports = { getData, writeData, mystrom, getMessageId}