const bcrypt = require('bcryptjs');
const fs = require('fs');
const util = require('util');
const filepathEnvFile = 'config/.env'
const envfile = require('envfile');
const { runInContext } = require('vm');
const saltRounds = 10;

// Convert fs.readFile / writefile into Promise version of same    
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const appendFile = util.promisify(fs.appendFile);

const envParseFile = util.promisify(envfile.parse)

function savePassword(PlainTextPassword){
    bcrypt.hash(PlainTextPassword, saltRounds, function(err, hash) {
        try {
            //https://stackoverflow.com/questions/53360535/how-to-save-changes-in-env-file-in-node-js
            let parsedFile = envParseFile(filepathEnvFile);
            parsedFile.SH_PASSWORD = hash
            writeFile(filepathEnvFile, envfile.stringify(parsedFile))
            console.log("saved hash")
          }
          catch (err){
            console.log(err)
          }
    });
}

async function compareHash(PlainTextPassword){
    // Test comparison 
    var parsedFile = await envParseFile(filepathEnvFile);
    var hash = parsedFile.SH_PASSWORD
    bcrypt.compare(PlainTextPassword, hash, function(err, result) {
        console.log(result)
        return result
    });

}

module.exports = { compareHash, savePassword}

// savePassword("test")
compareHash("test")