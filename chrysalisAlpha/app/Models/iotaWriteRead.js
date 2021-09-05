const fs = require('fs')
const filepath = 'log/messageIds.txt'
const messageIdArray = new Array;
const solarMeterUrl = 'http://myStrom-Switch-43F2B8/report'

async function writeData(data) {

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
    } else {
      console.log("no solid message");
    }   

    fs.appendFile(filepath, message_metadata.messageId + "\r\n", function (err) {
      if (err) {
        console.log(err)
      } else {
        console.log('successfully added messageId')
      }
    })
}

async function mystrom () {
  return new Promise(function(resolve, reject) {
    const request = require('request');
    var options = {
      'method': 'GET',
      'url': solarMeterUrl,
      'headers': {
      }
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      console.log(response.body);
      resolve(response.body)
    });
  });
};

async function getData(messageId){
  const { ClientBuilder } = require('@iota/client');

  // client will connect to testnet by default
  const client = new ClientBuilder().build();

  const message_index = await client.getMessage().index(messageId);
  const messages = new Array;
  console.log(message_index);

  message_index.forEach(element => {
    messages.push(getMessage(element, client))
  });
  return messages
}

async function getMessage(messageId, client){
  const message_data = await client.getMessage().raw(messageId)
  let regex = /{.*}/g;
  const found = message_data.match(regex);
  console.log(found);
  return found
}

async function getMessageId(){
    fs.readFile(filepath, 'utf8', function (err,data) {
      if (err) {
        console.log(err);
      } else {
        console.log(data);
        const lines = data.split(/\r?\n/);
        lines.forEach(element => {
          getData(element)
        });
      }
    });
}

module.exports = { getData, writeData, mystrom, getMessageId}