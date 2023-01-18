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
    method: 'POST',
    key: fs.readFileSync(__dirname + '/../../cert/client/client-key.pem'),
    cert: fs.readFileSync(__dirname + '/../../cert/client/client-cert.pem'),
    rejectUnauthorized: false,
    passphrase: 'gei761',
};

const req = https.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
        console.log('No more data in response.');
    });
})

req.write(JSON.stringify({username: 'user1234', password: 'password1234'}));
req.end();

