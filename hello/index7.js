const _crypto = require('crypto');

function encrypt(message, secret) {
  // random initialization vector
  const iv = _crypto.randomBytes(16);

  // extract the auth tag
  const cipher = _crypto.createCipheriv('aes-256-gcm', secret, iv);

  // add the following line if you want to include "AES256GCM" on the elixir side
  // cipher.setAAD(Buffer.from("AES256GCM", 'utf8'));

  // encrypt the given text
  const encrypted = Buffer.concat([cipher.update(message, 'utf8'), cipher.final()]);

  // extract the auth tag
  const tag = cipher.getAuthTag();

  const encrypted_message = Buffer.concat([iv, tag, encrypted]).toString('base64');
  return encrypted_message;
}

const secret = _crypto.randomBytes(32);
encrypt("secret message", secret);