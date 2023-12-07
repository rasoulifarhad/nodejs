

const crypto = require('crypto');

const ARGON2ID_AES_GCM = 0;
var type = Buffer.alloc(1);
type.writeUInt8(ARGON2ID_AES_GCM);
const NONCE_LENGTH = 8;
const SALT_LENGTH = 32;
const BUFFER_SIZE = 16384; // 16 KiB

const argon2 = require('argon2');
const { log } = require('console');

const random = (length) => {
  return crypto.randomBytes(length);
}

async function generateKey (password, salt)  {

  let
      hashLength, 
      timeCost, 
      parallelism,
      passwordError,
          memoryCost = 65536;
  
    argon2.limits.timeCost.min = 1;	
    const hashingConfig = { 
      salt: salt,
      saltLength: 32,
      type: argon2.argon2id,
      hashLength: hashLength || 32,
      memoryCost,
      parallelism: parallelism || 4,
      timeCost: timeCost || 1,
      
    }		
  
      if( !password.trim().length ) 
          
      passwordError = 'Password/phrase can\'t be empty'
    else 
      return await argon2.hash( password, {
        ...hashingConfig,
        }
      )
      .then( hash => {
        return  hash;
      })
      .catch( error => console.log(error) );
      
  }
  
function generateAdditionalData(key, paddedNonce) {
	const cipher = crypto.createCipheriv('aes-256-gcm', key, paddedNonce); 
	let zeroAdditionalData = Buffer.alloc(16);
	const uint8 = new Uint8Array(1);
	uint8[0] = 128;
	finalAdditionalData = Buffer.concat([uint8, cipher.update(zeroAdditionalData), cipher.final()])
	return finalAdditionalData;
};

function encrypt(password, data) {
	const nonce = random(NONCE_LENGTH);
	const paddedNonce = Buffer.concat([nonce, Buffer.alloc(4)]);
	const salt = random(SALT_LENGTH);
	return  generateKey(password, salt).then( (key) => {
		const additionalData = generateAdditionalData(key, paddedNonce);
		paddedNonce[8] = 1;
		const cipher = crypto.createCipheriv('aes-256-gcm', key, paddedNonce);
		cipher.setAAD(additionalData);
		const buf = Buffer.concat([salt, type, nonce, cipher.update(data, 'utf8'), cipher.final(), cipher.getAuthTag() ]);
		console.log(cipher.getAuthTag());
		console.log('kkkkk',buf);
		return buf;
	});
};

function decrypt(password, payload) {
  let payloadBuffer = Buffer.from(payload);
  const salt  = payloadBuffer.subarray(0, SALT_LENGTH );
  payloadBuffer = payloadBuffer.subarray(SALT_LENGTH);
  type = payloadBuffer.subarray(0,1);
  payloadBuffer = payloadBuffer.subarray(1);
  nonce = payloadBuffer.subarray(0,8);
  payloadBuffer = payloadBuffer.subarray(8);
  authTag = payloadBuffer.subarray(payloadBuffer.length - 16);
  payloadBuffer = payloadBuffer.subarray(0,payloadBuffer.length - 16);

  const encryptedData = payloadBuffer;
  return generateKey(password, salt).then( (key) => {
    const paddedNonce = Buffer.concat([nonce, Buffer.alloc(4)]);
    // const additionalData = generateAdditionalData(key, paddedNonce);
    paddedNonce[8] = 1;
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, nonce);
    let str = decipher.update(encryptedData, null, 'utf8');
    decipher.setAuthTag(authTag);
    console.log(str);
    str += decipher.final('utf8');
    return str;
  });
};


const password = 'foo';

const data = Buffer.from('bar', 'utf8');
encrypt(password, data).then( (encryptedData) => {
	console.log(encryptedData);
});

// const encryptedData = encrypt("foo", data).then(res=>{
//   decrypt("foo", res)
// });
// const decryptedData = ;
// console.log(decryptedData);