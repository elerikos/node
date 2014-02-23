var http = require('http'),
    url = require('url'),
    fs = require('fs');

http.createServer(function (req, res) {
  fs.readFile('./index.html', function(err, data) {
    res.end(data);
  });
}).listen(8080, 'localhost');
console.log('Server running.');