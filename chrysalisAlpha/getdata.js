async function getData(messageId){
    const { ClientBuilder } = require('@iota/client');
  
    // client will connect to testnet by default
    const client = new ClientBuilder().build();
  
    const message_index = await client.getMessage().index(messageId);
    console.log(message_index);

    message_index.forEach(element => {
      getMessage(element)
    });
  }

  async function getMessage(messageId){
    const { ClientBuilder } = require('@iota/client');
  
    // client will connect to testnet by default
    const client = new ClientBuilder().build();

    const message_data = await client.getMessage().raw(messageId)
    let regex = /{.*}/g;
    const found = message_data.match(regex);
    console.log(found);
  }
  
  getData("1e31ce59adf99710d99ee27e4511ee86af334f7d5c26513391742ae4a4ff6d3d")