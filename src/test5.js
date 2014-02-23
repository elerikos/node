var http = require('http');

var s=http.createServer(function(req,res){
	res.writeHead(200,{'content-type': 'text/plain'});
	res.write("hello\n");
	//console.log("res");

	setTimeout(function(){
		res.end("world\n");},4000)


});

s.listen(8000);

//console.log("Hello");




