

const { log } = require('console');
const crypto = require('crypto');

const aes256gcm = (key) => {

  const encrypt = (str) => {
    const iv = new crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

    let enc1 = cipher.update(str, 'utf8');
    let enc2 = cipher.final();
    console.log('authTag: ', Buffer.from(cipher.getAuthTag().toString('utf8')))
    return Buffer.concat([enc1, enc2, iv, cipher.getAuthTag()]);
    // return Buffer.concat([enc1, enc2, iv, cipher.getAuthTag()]).toString();
  };

  const decrypt = (enc) => {
    const iv = enc.slice(enc.length - 28, enc.length - 16);
    const tag = enc.slice(enc.length - 16);
    enc = enc.slice(0, enc.length - 28);
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    let str = decipher.update(enc, 'hex', 'utf8');
    console.log(str);
    str += decipher.final('utf8');
    return str;
  };

  return {
    encrypt,
    decrypt,
  };
};

key = Buffer.from('myverystrongpasswordo32bitlength', 'utf8');
const cipher = aes256gcm(key); // just a test key
const ct = cipher.encrypt('Hello 8gwifi.org');
console.log("Original Text:  ", 'Hello')
console.log("====GCM Encryption/ Decryption Without AAD====")
console.log("GCM Eecrypted Text:  ", ct)

const cipher2 = aes256gcm(key); // just a test key
const pt = cipher2.decrypt(ct);
console.log(pt);