const { asciiToTrytes, trytesToAscii } = require('@iota/converter');
const Mam = require('@iota/mam');
const iotaAreaCodes = require('@iota/area-codes');

// Define privacy mode and channel
const provider = 'https://nodes.devnet.iota.org:443'
const mode = 'public';
const providerName = 'devnet';
const mamExplorerLink = 'https://utils.iota.org/mam';

// initialize MAM
let mamState = Mam.init(provider);

// area code information
var iac = iotaAreaCodes.encode(47.22681463962826, 8.663457142353627, iotaAreaCodes.CodePrecision.EXTRA);

const publish = async packet => {
    // Create MAM message as a string of trytes
    const trytes = asciiToTrytes(JSON.stringify(packet));
    const message = Mam.create(mamState, trytes);

    // Save your new mamState
    mamState = message.state;
    // Attach the message to the Tangle
    await Mam.attach(message.payload, message.address, 3, 9);

    console.log('Published', packet, '\n');
    return message.root;
}

const publishAll = async () => {
    const root = await publish({
      message: 'Message from Alice',
      timestamp: (new Date()).toLocaleString(),
      tag: iac
    });
  
    await publish({
      message: 'Message from Bob',
      timestamp: (new Date()).toLocaleString(),
      tag: iac
    });
  
    await publish({
      message: 'Message from Charlie',
      timestamp: (new Date()).toLocaleString(),
      tag: iac
    });
  
    return root;
  }

// Callback used to pass data out of the fetch
const logData = data => console.log('Fetched and parsed', JSON.parse(trytesToAscii(data)), '\n');

publishAll()
  .then(async root => {

    // Output asynchronously using "logData" callback function
    await Mam.fetch(root, mode, null, logData);

    // Output synchronously once fetch is completed
    const result = await Mam.fetch(root, mode);
    result.messages.forEach(message => console.log('Fetched and parsed', JSON.parse(trytesToAscii(message)), '\n'));

    console.log(`Verify with MAM Explorer:\n${mamExplorerLink}/${root}/${mode}/${providerName}\n`);
});  
