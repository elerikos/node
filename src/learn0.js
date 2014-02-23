var rr =  require('./hello.js');

var divide = function(x,y,callback1) {
    if ( y === 0 ) {
        return callback1(new Error("Can't divide by zero"));
    }
    return callback1(null,x/y)
}


var ff = function(err,result){
    if ( err ) {
        // handle the error, or forward it to the next callback
        console.log(err);
        return;
    };
    return result;
}

 console.log(divide(6,0,ff));

console.log("-----------------")

divide(4,2,function(err,result){
    if ( err ) {
        // handle the error, or forward it to the next callback
        console.log(err);
        return;
    }
    console.log('4/2='+result);
});

console.log("-----------------")

divide(4,0,function(err,result){
    if ( err ) {
        // handle the error, or forward it to the next callback
        console.log(err);
        return;
    }
    console.log('4/0='+result);
});