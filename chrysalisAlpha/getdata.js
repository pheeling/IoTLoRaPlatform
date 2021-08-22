async function getData(messageId){
    const { ClientBuilder } = require('@iota/client');
  
    // client will connect to testnet by default
    const client = new ClientBuilder().build();
  
    const message_index = await client.getMessage().index(messageId);
    console.log(message_index);

    message_index.forEach(element => {
      getMessage(element, client)
    });
  }

  async function getMessage(messageId, client){
    const message_data = await client.getMessage().raw(messageId)
    let regex = /{.*}/g;
    const found = message_data.match(regex);
    console.log(found);
  }
  
  // getData('3a9c6cba69e5a342653bff276c5987ecf1f7fff6fd3cf001dcb85335dc7ef9df')