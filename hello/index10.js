var crypto = require("crypto");
var clearText = 'secret';
var key = crypto.randomBytes(16);
var iv = new Buffer(crypto.randomBytes(12));
var algo = 'aes-128-gcm';
console.log(`clearText: ${clearText}`);

var cipher = crypto.createCipheriv(algo, key, iv);
var encrypted = cipher.update(clearText, 'utf8','hex');
encrypted += cipher.final('hex');
var cipherTag = cipher.getAuthTag();
console.log(`encrypted: ${encrypted}`);

var decipher = crypto.createDecipheriv(algo, key, iv);
decipher.setAuthTag(cipherTag); 
var decrypted = decipher.update(encrypted, 'hex','utf-8');
decrypted += decipher.final('utf-8');
console.log(`decrypted: ${decrypted}`);