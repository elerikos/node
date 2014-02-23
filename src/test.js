var net = require('net');
var sockets= [];
var s=net.createServer(function(socket){
sockets.push(socket);	

socket.on('data',function(d){
for (var i=0;i <sockets.length;i++){
//if (sockets.indexOf(socket) == i ) continue;
if (sockets[i] == socket ) continue;
	sockets[i].write(d);
}
});

socket.on('end',function(d){ var i = sockets.indexOf(socket);  sockets.delete[i];	})

});

s.listen(8000);

//console.log("Hello");




