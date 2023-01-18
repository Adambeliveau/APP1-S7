const https = require('https');
const fs = require('fs');
const { Resolver } = require('node:dns');

const hostname = 'www.myapp.com';
const resolver = new Resolver();
resolver.setServers(['172.17.0.2']);

let address;

resolver.resolve4(hostname, (err, addresses) => {
    console.log(`addresses: ${JSON.stringify(addresses)}`);
    address = addresses[0];
  });

const options = {
    hostname: address,
    port: 8081,
    path: '/',
    method: 'GET',
    // key: fs.readFileSync('client-key.pem'),
    // cert: fs.readFileSync('client-cert.pem'),
    // ca: fs.readFileSync('ca-cert.pem'),
    rejectUnauthorized: false
};

https.get(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
        console.log('No more data in response.');
    });
});

