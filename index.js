'use strict'

const SHS = require('./protocol')(require('./crypto'));
const utils = require('./utils');
const appKey = utils.random(32);
const cl = require('chloride');
const alice = cl.crypto_sign_keypair(); //client
const bob = cl.crypto_sign_keypair();   //server

const keys = utils.generateKeys();

const CHARSET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/".split('');
const buckets = new Array(64);

for(let i = 0; i < buckets.length; i++) buckets[i] = 0;
for(let i = 0, c = -1; i < 100000; i++){
	c = ++c & 63;
	const input = Buffer.from(CHARSET[c], 'utf8');
	//const input = utils.random(16);

	const buff = utils.hash(input);
	const hash = utils.hashCode(buff);

	//const buff = utils.createHash(input);
	//const hash = murmurHash(buff);

	const bucket = hash & 63;
	buckets[bucket]++;
}

debugger;
console.log('empty buckets: ' + buckets.filter(i => i === 0).length);
const holes = {};
for(let i = 0; i < buckets.length; i++){
	if(buckets[i] === 0) holes[i] = true;
};
console.log(Object.keys(holes));
console.log(buckets);

// console.log(JSON.stringify(keys, 2, 2));

const pull = require('pull-stream');

function authorize(id, cb) {
	cb(null, true);
}

const ServerStream = SHS.createServer(alice, authorize, appKey)
const ClientStream = SHS.createClient(bob, appKey)

const alice_stream = ServerStream((err, stream) => {
	debugger;
});

const bob_stream = ClientStream(alice.publicKey, (err, stream) => {
	debugger;
});

//connect streams together.
const stream = pull(
	alice_stream,
	bob_stream,
	alice_stream
);

pull(pull.values(['hello', 'world']), stream, function (err, data) {
	debugger;
	console.log(err, data);
});
