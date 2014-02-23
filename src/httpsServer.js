// HTTPS
var https = require('https');
var fs = require('fs');

server_port = 8124;
// read in the private key and certificate
var pk = fs.readFileSync('./privatekey.pem');
var pc = fs.readFileSync('./certificate.pem');
var opts = { key: pk, cert: pc };
// create the secure server
var serv = https.createServer(opts, function(req, res) {
  console.log(req.method);
  res.end();
});
// listen on port 443
serv.listen(server_port, '127.0.0.1');

console.log('Server running at http://127.0.0.1:'+server_port+'/');