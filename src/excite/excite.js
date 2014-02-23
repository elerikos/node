var ApiServer = require('apiserver')

var apiServer = new ApiServer({ port: 8080 })

// middleware
apiServer.use(/^\/admin\//, ApiServer.httpAuth({
  realm: 'ApiServer Example',
  encode: true,
  credentials: ['admin:apiserver']
}))
apiServer.use(ApiServer.payloadParser())

// modules
apiServer.addModule('1', 'fooModule', {
  // only functions exposed
  options: {
    opt1: 'opt1',
    opt2: 'opt2',
    opt3: 'opt3'
  },
  foo: {
    get: function (request, response) {
      response.serveJSON({
        id: request.querystring.id,
        verbose: request.querystring.verbose,
        method: 'GET',
        options: this.options
      })
    },
    post: function (request, response) {
      request.resume()
      request.once('end', function () {
        response.serveJSON({
          id: request.querystring.id,
          verbose: request.querystring.verbose,
          method: 'POST',
          payload: request.body // thanks to payloadParser
        })
      })
    }
  },
  bar: function (request, response) {
    response.serveJSON({ foo: 'bar', pow: this._pow(5), method: '*/' + request.method })
  },
  // never exposed due to the initial underscore
  _pow: function (n) {
    return n * n
  }
})

// custom routing
apiServer.router.addRoutes([
  ['/foo', '1/fooModule#foo'],
  ['/foo/:id/:verbose', '1/fooModule#foo'],
  ['/foo_verbose/:id', '1/fooModule#foo', { 'verbose': true }],
  ['/bar', '1/fooModule#bar', {}, true] // will keep default routing too
])

// events
apiServer.on('requestStart', function (pathname, time) {
  console.info(' ☉ :: start    :: %s', pathname)
}).on('requestEnd', function (pathname, time) {
  console.info(' ☺ :: end      :: %s in %dms', pathname, time)
}).on('error', function (pathname, err) {
  console.info(' ☹ :: error    :: %s (%s)', pathname, err.message)
}).on('timeout', function (pathname) {
  console.info(' ☂ :: timedout :: %s', pathname)
})

apiServer.listen()