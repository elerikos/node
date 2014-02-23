//
  // require the native http module, as well as director.
  //
  var http = require('http'),
      director = require('director');

  //
  // create some logic to be routed to.
  //
  function helloWorld() {
    this.res.writeHead(200, { 'Content-Type': 'text/plain' })
    this.res.end('hello world');
  }

  //
  // define a routing table.
  //
  var router = new director.http.Router({
    '/hello': {
      get: helloWorld
    }
  });

  //
  // setup a server and when there is a request, dispatch the
  // route that was requested in the request object.
  //
  var server = http.createServer(function (req, res) {
    router.dispatch(req, res, function (err) {
      if (err) {
        res.writeHead(404);
        res.end();
      }
    });
  });

  //
  // You can also do ad-hoc routing, similar to `journey` or `express`.
  // This can be done with a string or a regexp.
  //
  router.get('/bonjour', helloWorld);
  router.get(/hola/, helloWorld);

  //
  // set the server to listen on port `8080`.
  //
  server.listen(8080);