const http = require('http');
const https = require('https');
const fs = require('fs');

const options = {
    key: fs.readFileSync(__dirname + '/../../cert/server/server-key.pem'),
    cert: fs.readFileSync(__dirname + '/../../cert/server/server-cert.pem'),
    ca: fs.readFileSync(__dirname + '/../../autorite/autorite.cer'),
    requestCert: true,
    rejectUnauthorized: false,
    passphrase: 'gei761'
};

http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Hello Http');
}
).listen(8080);

https.createServer(options, (req, res) => {
    if (!req.client.authorized) {
        res.writeHead(401);
        return res.end('Invalid client certificate authentication.');
      }
    res.writeHead(200);
    res.end('Hello Https');
}
).listen(8081);