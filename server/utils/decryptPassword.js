const crypto = require('crypto');

// DECRYPT SAVED BCS PASSWORD BEFORE SENDING TO FRONT END
module.exports = function decryptPass(bcsEmail, bcsPassword) {
    // console.log('inside decryptPass()')

    // ALGORIGHM, IV AND KEY MATCHING VALUES FROM ENCRYPTION AT SAVE
    const algorithm = 'aes-256-cbc';
    const initVector = crypto.scryptSync(bcsEmail, 'salt', 16);
    const SecurityKey = crypto.scryptSync(bcsEmail, 'salt', 32);

    // decipher function
    const decipher = crypto.createDecipheriv(algorithm, SecurityKey, initVector);

    let decryptedPassword = decipher.update(bcsPassword, 'hex', 'utf-8');

    decryptedPassword += decipher.final('utf-8');
    // console.log({ decryptedPassword })

    return decryptedPassword;

}