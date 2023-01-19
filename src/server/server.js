const http = require('http');
const https = require('https');
const fs = require('fs');
const { resolve } = require('path');

const options = {
    key: fs.readFileSync(__dirname + '/../../cert/server/server-key.pem'),
    cert: fs.readFileSync(__dirname + '/../../cert/server/server-cert.pem'),
    ca: fs.readFileSync(__dirname + '/../../autorite/autorite.cer'),
    requestCert: true,
    rejectUnauthorized: false,
    passphrase: 'gei761',
    ciphers: 'TLS_AES_128_CCM_SHA256:TLS_AES_128_GCM_SHA256',
};

http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Hello Http');
}
).listen(8080);

const dbEntries = fs.readFileSync(__dirname + '/db.txt', 'utf8').split('\n')
let usernames = [];
let passwords = [];
dbEntries.forEach(entry => {
    const [username, password] = entry.split(':')
    usernames.push(username)
    passwords.push(password)
});

https.createServer(options, (req, res) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk;
    });
    req.on('end', () => {
        body = JSON.parse(body);
        if (!login(body)) {
            res.writeHead(401);
            return res.end('Login unsuccessful. Username or password incorrect.');
        }
        if (!req.client.authorized) {
            res.writeHead(401);
            return res.end('Invalid client certificate authentication.');
        }
        res.writeHead(200);
        return res.end(`login successful with ${body.username} and done over https`);
    });
}
).listen(8081, () => {
    console.log('Server listening on port 8081');
});

const login = (body) => {
    const match = usernames.find((username , i) => {
        if (username === body.username) {
            if (passwords[i] === body.password) {
                return true;
            }
        }
        return false;
    });
    return match !== undefined;
}