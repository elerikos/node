var http = require('http');
var qs = require('querystring');

console.log("stringify: " + qs.stringify({q: 'hello world'}));


var options = {
    host: '' +
        '127.0.0.1',
    port: 8124,
    path: '/'+'?'+qs.stringify({q: 'hello world'})
  };

var req = http.get(options, function(response) {
  // handle the response
  var res_data = '';
  response.on('data', function(chunk) {
      console.log("data->");
    res_data += chunk;
  });
  response.on('end', function() {
      console.log("end->");
    console.log(res_data);
  });
});

req.on('error', function(e) {
  console.log("Got error: " + e.message);
});