//standard modules
const bcrypt = require('bcryptjs');
const saltRounds = 10;

async function hashString(plaintext){
    bcrypt.hash(plaintext, saltRounds, async function(err, hash) {
        try {
            return hash
          }
          catch (err){
            console.log(err)
          }
    });
}

async function compareHash(string1, string2){
    try {
        return await bcrypt.compare(string1, string2)
    } catch (e) {
        console.log(e)
    }
}

module.exports = { compareHash, hashString}