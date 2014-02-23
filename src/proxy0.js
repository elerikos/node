var http = require('http'),
    url = require('url');


http.createServer(function(clientRequest,clientResponse){
	var uri = url.parse(clientRequest.url);
        if (uri.port == undefined) uri.port  = {"http":80,"https":4443}
	//clientRequest.pipe(r);
	//r.pipe(clientResponse);
clientRequest.pipe(request(clientRequest.url)).pipe(clientResponse)	
}
)
.listen(8000)
