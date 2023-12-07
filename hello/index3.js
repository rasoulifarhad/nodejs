const crypto = require('crypto');

// This two value (ivValueEn , ivValueDe) should be same, to decode the text properly!
const ivValueEn = "c5949f09a7e67318888c5949f09a7e6c09ca51e602867318888c5949f09a7e6c09ca51e602867318888";
const ivValueDe = "c5949f09a7e67318888c5949f09a7e6c09ca51e602867318888c5949f09a7e6c09ca51e602867318888[";

const keyValue = "c5949f09a7e6c09a7e6c09ca51e602867318888c5949f09a7e6c09ca51e602867318888";

const alog = 'aes-256-gcm';
const ivEn = ivValueEn.toString('hex'); console.log(ivEn);
const ivDe = ivValueDe.toString('hex'); console.log(ivDe);

const key = keyValue.slice(0, 32);
const cipher = crypto.createCipheriv(alog, key, ivEn);
const decipher = crypto.createDecipheriv(alog, key, ivDe);