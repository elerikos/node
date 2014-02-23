var fs = require('fs');

var file = fs.createWriteStream('./out.txt');

process.stdin.on('data', function(data) {
  file.write(data);
});
process.stdin.on('end', function() {
  file.end();
});
process.stdin.resume(); // stdin in paused by default



/*    OR
var fs = require('fs');
process.stdin.pipe(fs.createWriteStream('./out.txt'));
process.stdin.resume();

*/
