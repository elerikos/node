var http = require('http'),
    request = require('request')
    fs = require('fs');



http.createServer(function(clientRequest,clientResponse){
    var r = request(clientRequest.url.substring(1),function (error, response, body) {
        if (!error && response.statusCode == 200){
        console.log(body) // Print the google web page.
        fs.writeFile('message.txt', body, function (err) {
            if (err) throw err;
            console.log('It\'s saved!');
        });

    }else{
            if (error){
                console.log(error);

            }
        }
});
//clientRequest.pipe(r);
//r.pipe(clientResponse);
console.log(clientRequest.url.substring(1))
console.log(clientRequest.method)
//console.log(clientRequest)
//clientRequest.pipe(request(clientRequest.url.substring(1))).pipe(clientResponse)
clientResponse.end();
}
)
.listen(8000)

