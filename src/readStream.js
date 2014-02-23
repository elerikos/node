var fs = require('fs');
var file = fs.createReadStream('./myfile.txt');
file.on('error', function(err) {
  console.log('Error '+err);
  throw err;
});
file.on('data', function(data) {
  console.log('Data '+data);
});
file.on('end', function(){
  console.log('Finished reading all of the data');
});