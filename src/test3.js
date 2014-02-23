setInterval(function(){console.log('World')},2000)

console.log("Hello");


var http = require('http');
/* function showHeaders(res){console.log(res.headers)};
setInterval(function(){
console.log('fetching google.com');
http.get({ host: 'google.com' },showHeaders)
}
,2000)*/



var s=http.createServer(function(req,res){
	res.writeHead(200,{'content-type': 'text/plain'});
	res.write("hello\n");
	//console.log("res");
      console.log(req.url)
	setTimeout(function(){
		res.end("world\n");},2000)


});

s.listen(8000);



//console.log("Hello");




