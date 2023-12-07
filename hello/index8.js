const algorithm = 'aes-256-gcm';
const iv = Buffer.alloc(16);
const key = Buffer.alloc(256/8);

const cipher = crypto.createCipheriv(algorithm, key, iv);
const read_stream = fs.createReadStream(path.resolve(os.homedir(), 'Desktop', 'abstract.pdf'));
const encrypted_write_stream = fs.createWriteStream(path.resolve(os.homedir(), 'Desktop', 'abstract.enc.pdf'));

cipher.on('finish', () => 
{
    const tag = cipher.getAuthTag();
    console.log('File encrypted. Tag is', tag.toString('hex'));

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(tag);

    const encrypted_read_stream = fs.createReadStream(path.resolve(os.homedir(), 'Desktop', 'abstract.enc.pdf'));
    const write_stream = fs.createWriteStream(path.resolve(os.homedir(), 'Desktop', 'abstract.decrypted.pdf'));

    decipher.on('error', console.error);
    decipher.on('finish', () => 
    {
        console.log('Decrypted successfully');
    });

    encrypted_read_stream.pipe(decipher).pipe(write_stream);
});

read_stream.pipe(cipher).pipe(encrypted_write_stream);