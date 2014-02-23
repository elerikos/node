var http = require('http');
var url = require('url');
var cp = require('child_process');

function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log(pathname);
    if( pathname == '/wait' ){
     //   var startTime = new Date().getTime();
     //   while (new Date().getTime() < startTime + 15000);
        //cp.exec('block1.js', myCallback);
    }
    else{
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.write('Hello!\n');
        response.end();
    }

    console.log('New connection');

    function myCallback(){
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.write('Thanks for waiting!\n');
        response.end();
    }
}

function   kkk(callback){
    var startTime = new Date().getTime();
    console.log("this");
    while (new Date().getTime() < startTime + 10000);

}

http.createServer(onRequest).listen(8080);
console.log('Server started');