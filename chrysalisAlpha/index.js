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
    iotaWriteRead.getData('3a9c6cba69e5a342653bff276c5987ecf1f7fff6fd3cf001dcb85335dc7ef9df')
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})