const express = require('express')
const app = express()
const port = 3000
const iotaWriteRead = require('./app/Models/iotaWriteRead');

app.get('/', (req, res) => {
    res.send('Hello, running IOTA in the console! And getting Data to the Tangle')
    iotaWriteRead.mystrom().then(data => iotaWriteRead.writeData(data));
})

app.get('/getData', (req, res) => {
    res.send(new Date().toString() + ' Collected Data to console')
    iotaWriteRead.getMessageId()
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})