const crypto = require('crypto');

let key = Buffer.from('myverystrongpasswordo32bitlength', 'utf-8');
let iv = Buffer.from('000102030405060708090a0b0c0d0e0f', 'hex');
let authTagLength = 16;
const authTag1 = crypto.randomBytes(16)
// The Secret Message
let secret_msg = Buffer.from('To be Encrypted!', 'utf-8');

// Encrypt
let cipher = crypto.createCipheriv('aes-256-gcm', key, iv, { authTagLength });
let encryptedData = Buffer.concat([cipher.update(secret_msg), cipher.final(), cipher.getAuthTag()]);

// Separate the encrypted data from the Auth Tag
let dataToDecrypt = encryptedData.slice(0, encryptedData.length - authTagLength);
let authTag = encryptedData.slice(encryptedData.length - authTagLength, encryptedData.length);

// Decrypt
let decipher = crypto.createDecipheriv('aes-256-gcm', key, iv, { authTagLength });
decipher.setAuthTag(authTag);
let decryptedData = Buffer.concat([decipher.update(dataToDecrypt), decipher.final()]);

console.log('Auth1: ', cipher.getAuthTag().toString('hex'))
console.log('Auth: ', authTag.toString('hex'))
console.log(`\nEncryption Key: ${key.toString('hex')}`)
console.log(`IV: \t\t${iv.toString('hex')}\n`)

console.log(`Plain-text: \t"${secret_msg}"`);
console.log(`Plain-text: \t${secret_msg.toString('hex')}`);
console.log(`Encrypted: \t${encryptedData.toString('hex')}`);
console.log(`Encrypted: \t${encryptedData.toString('base64')}`);
console.log(`Decrypted: \t${decryptedData.toString('hex')}`);
console.log(`Decrypted: \t"${decryptedData.toString('utf-8')}"`);