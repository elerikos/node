var hello = require('./hello');

// Create a Buffer of 10 bytes
var buffer = new Buffer(10);
// Modify a value
buffer[0] = 255;
// Log the buffer
console.log(buffer);


var buffer1 = new Buffer('Hyvää päivää!'); // create a buffer containing “Good day!” in Finnish
var str = 'Hyvää päivää!'; // create a string containing “Good day!” in Finnish
// log the contents and lengths to console
console.log(buffer1);
console.log('Buffer length:', buffer1.length);
console.log(str);
console.log('String length:', str.length);
console.log('buffer to String :', buffer1.toString());