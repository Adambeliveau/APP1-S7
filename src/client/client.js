const http = require('http');
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
    port: 8080,
    path: '/',
    method: 'GET',
};

http.get(options, (res) => {
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