const bcrypt = require('bcryptjs');
const fs = require('fs');
const util = require('util');
const filepathEnvFile = 'config/.env'
const envfile = require('envfile')

// Convert fs.readFile / writefile into Promise version of same    
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const appendFile = util.promisify(fs.appendFile);

const envParseFile = util.promisify(envfile.parse)
const envStringifyFile = util.promisify(envfile.stringify)

function savePassword(PlainTextPassword){
    bcrypt.hash(PlainTextPassword, saltRounds, function(err, hash) {
        try {
            //https://stackoverflow.com/questions/53360535/how-to-save-changes-in-env-file-in-node-js
            let parsedFile = await envParseFile(filepathEnvFile);
            parsedFile.SH_PASSWORD = hash
            writeFile(filepathEnvFile, envStringifyFile(parsedFile))
            return "saved hash"
          }
          catch (err){
            console.log(err)
          }
    });
}

function compareHash(PlainTextPassword){
    //TODO Read .env File and compare password
    bcrypt.compare(PlainTextPassword, hash, function(err, result) {
        return result
    });
}
