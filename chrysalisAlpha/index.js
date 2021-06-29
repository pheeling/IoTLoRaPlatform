async function run(data) {

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
}

async function mystrom () {
  return new Promise(function(resolve, reject) {
    const request = require('request');
    var options = {
      'method': 'GET',
      'url': 'http://myStrom-Switch-43F2B8/report',
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

mystrom().then(data => run(data))

