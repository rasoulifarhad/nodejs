const crypto = require('crypto');

const argon2 = require( 'argon2' );
const { Console } = require('console');

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
		raw: true,
		
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

function random(length) {
	return crypto.randomBytes(length);
}


function generateAdditionalData(key, paddedNonce) {
	const cipher = crypto.createCipheriv('aes-256-gcm', key, paddedNonce); 
	let zeroAdditionalData = Buffer.alloc(16);
	const uint8 = new Uint8Array(1);
	uint8[0] = 128;
	finalAdditionalData = 
		Buffer.concat([
			uint8, 
			cipher.update(zeroAdditionalData), 
			cipher.final()
		]);
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
		const encrypted = 
			Buffer.concat([
					salt, 
					type, 
					nonce, 
					cipher.update(Buffer.from(data, 'utf8')), 
					cipher.final(), 
					cipher.getAuthTag() 
			]);
		const authTag = cipher.getAuthTag();
		console.info('Value encrypted', {
			valueToEncrypt: data,
			encryptedValue: encrypted.toString('hex'),
			authTag: authTag.toString('hex'),
		  });		
		return encrypted;
	});
};

function decrypt(password, payload) {

	let payloadBuffer = Buffer.from(payload);
	// get salt
	const salt  = payloadBuffer.subarray(0, SALT_LENGTH );
	payloadBuffer = payloadBuffer.subarray(SALT_LENGTH);
	// get organ2 algorithm
	const type = payloadBuffer.subarray(0,1);
	payloadBuffer = payloadBuffer.subarray(1);
	// get Nonce
	const nonce = payloadBuffer.subarray(0,8);
	payloadBuffer = payloadBuffer.subarray(8);
	// get Tag
	const authTag = payloadBuffer.subarray(payloadBuffer.length - 16);
	payloadBuffer = payloadBuffer.subarray(0,payloadBuffer.length - 16);
	// get encrypted data
	const encryptedData = payloadBuffer;

	return generateKey(password, salt).then( (key) => {
	  const paddedNonce = Buffer.concat([nonce, Buffer.alloc(4)]);
	  const additionalData = generateAdditionalData(key, paddedNonce);

	  paddedNonce[8] = 1;
	  const decipher = crypto.createDecipheriv('aes-256-gcm', key, paddedNonce);
	  decipher.setAAD(Buffer.from(additionalData));
	  decipher.setAuthTag(authTag);
	  const decrypted = 
	  	Buffer.concat([
			decipher.update(encryptedData), 
			decipher.final()
		]);

	  console.info('Value decrypted', {
		valueToDecrypt: encryptedData.toString('hex'),
		decryptedValue: decrypted.toString('utf-8'),
	  });
	  return decrypted;
	});
  };
  
const ARGON2ID_AES_GCM = 0;
var type = Buffer.alloc(1);
type.writeUInt8(ARGON2ID_AES_GCM);
  
const NONCE_LENGTH = 8;
const SALT_LENGTH = 32;
const BUFFER_SIZE = 16384; // 16 KiB


function test(password, data) {
	const dataBuffer = Buffer.from(data, 'utf8');
	encrypt(password, dataBuffer)
			.then( (encryptedData) => {
					decrypt(password, encryptedData).then( (decriptedData) => {
						console.log(decriptedData.toString('utf8'));	
					});
	});

}


// test('foo', 'bar');
decrypt('minio123', Buffer.from([121, -34, 0, 97, 68, 107, -51, -70, -57, -64, 52, 14, -40, -15, 8, 78, -27, -111, -8, -120, -115, 79,
	88, 122, -97, -4, -25, 38, -35, -80, 12, -113, 0, -82, -8, 100, -72, 51, 75, 37, -39, -14, 48, -80, 14, 102, 84,
	21, 26, 121, -45, 127, -117, -80, 6, -27, 112, 48, -38, 37, -122, -58, 117, -65, 1, 74, -59, -46, -109, -18,
	-108, -52, 23, 48, 75, 33, -41, 98, 0, 107, -6, -87, -43, -77, 63, 10, 97, 89, -126, -87, -39, 72, -33, 51, -36,
	-96, 14, 63, 13, 91, 118, 114, -109, 47, 65, 23, 24, -44, -125, 28, 63, 103, 96, -24, -65, 68, 27, 17, -5, 64,
	-107, -12, 33, -70, -119, -100, -24, 38, -120, -90, 46, -64, -75, -59, -119, -25, 17, 5, 29, -2, -128, -67, -16,
	-26, 26, -15, 99, -86, -65]))
	.then( (d) => {
		console.log(d.toString('utf8'));
	});


