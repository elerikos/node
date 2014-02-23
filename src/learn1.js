var rr =  require('./hello.js');

var divideSync = function(x,y) {
    if ( y === 0 ) {
        return new Error("Can't divide by zero");
    }
    return x/y;
}

var result = divideSync(4,2);

if ( result instanceof Error ) {
    // handle the error
    console.log(result);
    process.exit();
}

console.log('4/2='+result);

result = divideSync(4,0);

if ( result instanceof Error ) {
    // handle the error
    console.log(result);
    process.exit();
}
console.log('4/0='+result);