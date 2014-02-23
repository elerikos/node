var http = require('http');
var qs = require('querystring');


var data_ = {q: 'hello world'};;
var strigfyData= qs.stringify(data_);

opts = {
    host: '127.0.0.1',
    port: 8124,
    method: 'POST',
    path: '/',
    headers: {}
  };
// POST encoding
opts.headers['Content-Type'] = 'application/x-www-form-urlencoded';
opts.headers['Content-Length'] = strigfyData.length;
console.log("sent Headers: ");
console.log(opts.headers);

var callback = function(res_data) {
      console.log("end->");
    console.log(res_data);
  }

var req = http.request(opts, function(response) {
    var res_data = '';
    console.log(' response HEADERS: ' + JSON.stringify(response.headers));
  response.on('data', function(chunk) {  console.log("1: "+chunk );
    res_data += chunk;
  });
  response.on('end', function() {     console.log("2: " );
    callback(res_data);
  });


});

//req.data ={q: 'hello world'};
//console.log("req.data sent1: " + req.data);
//console.log("req.data sent2: " + qs.stringify(req.data));
//console.log("req.data sent3: " + qs.stringify(req.data).length);



req.on('error', function(e) {
  console.log("Got error: " + e.message);
});


// write the data
if (opts.method != 'GET') {
    console.log("Post.data sent: " +strigfyData);
  req.write(strigfyData);

}
req.end();