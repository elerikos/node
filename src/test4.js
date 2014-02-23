var net = require('net');

var s=net.createServer(function(socket){
	socket.write('hello\n');
	socket.write('world\n');
socket.on('data',function(data){socket.write(data);})

	//console.log("res");

//	setTimeout(function(){
//		res.end("world\n");},2000)

});

s.listen(8000);

//console.log("Hello");




