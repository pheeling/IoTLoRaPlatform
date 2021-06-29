async function run() {

    const { ClientBuilder } = require('@iota/client');

    // client will connect to testnet by default
    const client = new ClientBuilder()
        .localPow(true)
        .build();

    client.getInfo().then(console.log).catch(console.error);

    const message = await client.message()
        .index('074c4ddafa5643e3814b2af31024b3a3715b222f04ca6698bff670bbca704e00')
        .data('{"power":30.87,"Ws":31.27,"relay":true,"temperature":14.8}')
        .submit();

    console.log(message);
}

function mystrom (){
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
    });
}

run()

