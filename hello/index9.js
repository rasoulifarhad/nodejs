const crypto = require('crypto');

exports.encrypt = (algorithm, privateKey, data) => {
  const civ = new Buffer(crypto.randomBytes(16), 'utf8')
  const cipher = crypto.createCipheriv(algorithm, privateKey, civ)
  let crypted = cipher.update(data, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return {
    content: crypted,
    tag: cipher.getAuthTag()
  }
}

exports.decrypt = (algorithm, privateKey, data, keyAuthTag) => {
  const div = new Buffer(crypto.randomBytes(16), 'utf8')
  const decipher = crypto.createDecipheriv(algorithm, new Buffer(privateKey,'utf8'), div)
  decipher.setAuthTag(keyAuthTag)
  let dec = decipher.update(data,'hex', 'utf8')
  dec += decipher.final('utf8')
  return dec;
}
