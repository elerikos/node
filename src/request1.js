var request = require('request');
var fs = require('fs');
request('http://google.com/doodle.png').pipe(fs.createWriteStream('doodle.png'))