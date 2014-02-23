var connect = require('connect')
  , http = require('http');

var app = connect()
  .use(connect.favicon())
  .use(connect.logger('dev'))
  .use(connect.static('public1'))
 // .use(connect.directory('public1'))
  .use(connect.cookieParser())
  .use(connect.cookieSession({ secret: 'tobo!', cookie: { maxAge: 60 * 60 * 1000 }}))
  //.use(connect.session({ secret: 'my secret here' }))
  .use(function(req, res){
    //console.log(req);
    console.log(req.cookies);
    res.end('Hello from Connect!\n');
  });

http.createServer(app).listen(3000);