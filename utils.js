const cl = require('chloride');
const XXHash = require('xxhash');

exports.generateKeys = seed => {
  if(!seed) cl.randombytes(seed = new Buffer(32));
  const keys = seed ? cl.crypto_sign_seed_keypair(seed) : cl.crypto_sign_keypair()
  return {
    curve: 'ed25519',
    public: keys.publicKey,
    private: keys.privateKey || keys.secretKey
  }
}

exports.hash = buffer => {
	return cl.crypto_hash(buffer);
	// return cl.crypto_hash_sha256(buffer);
}

exports.hashCode = (buff, seed) => {
  return XXHash.hash(buff, seed || 0xCAFEBABE);
}

exports.random = bytes => {
	const b = Buffer.alloc(bytes);
	cl.randombytes(b, bytes);
	return b;
}
