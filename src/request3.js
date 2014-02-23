var request = require('request');
var j = request.jar()
var cookie = request.cookie('your_cookie_here')

j.add(cookie)
request({url: 'http://www.google.com', jar: j}, function () {
  request('http://images.google.com')
})