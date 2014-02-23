var ApiServer = require('apiserver')
var questions = require('./questions');
var responses = require('./responses');
var validate_response = require('./validate_response');
var action_response_template = require('./action_response_template');
var connect = require('connect');


var apiServer = new ApiServer({ port: 8081 })

var valid_msisdns = ['306999999999','306999999991','306999999992']


function checkMsisdn(msidn, token){
    if (msidn.length != 12){
        return 400;
    }
    if (   valid_msisdns.indexOf(msidn)  == -1){
        return 604;
    }
    if (msidn == token){
        return 401;
    }
    return 200;
}
function log(request){
    console.log("cid:"+request.querystring.cid);
    console.log("msisdn:"+request.querystring.msidn);
    console.log("token:"+request.querystring.token);
    console.log('Headers:%j',request.headers);
}
var realm = 'ApiServer Example';

// middleware
apiServer.use(/^\/admin\//, ApiServer.httpAuth({
    realm: realm,
    encode: true,
    credentials: ['admin:apiserver']
}))

apiServer.use(ApiServer.payloadParser())

// modules
apiServer.addModule('1', 'fooModule', {
    // only functions exposed

    'protectedApi': function (request, response) {
        console.log("Hello");
    },

    foo_REG: {
        get: function (request, response) {
            log(request)
            var ret_code=checkMsisdn(request.querystring.msidn,request.querystring.token);
            console.log("ret_code:"+ret_code);
            if (ret_code==200){
                response.serveJSON(action_response_template)
            }else{
                response.writeHead(ret_code);
                response.end();
            }

        }
    },
    foo_VAL: {
        get: function (request, response) {
            log(request)
            var ret_code=checkMsisdn(request.querystring.msidn,request.querystring.token);
            console.log("ret_code:"+ret_code);
            if (ret_code==200){
                response.serveJSON(action_response_template)
            }else{
                response.writeHead(ret_code);
                response.end();
            }

        }
    },
    foo_ACT: {
        put: function (request, response) {
            log(request)
            request.resume()
              request.once('end', function () {
                if (request.parseError) {
                  // :(
                  console.error(request.parseError.message)
                } else {
                    console.log(request.body) // an object containing the parsed data
                //    console.log(JSON.parse(request.body)) // an object containing the parsed data
                 //   console.log(request.rawBody) // contains a binary buffer with your payload
                }
              })
            var ret_code=checkMsisdn(request.querystring.msidn,request.querystring.token);
            console.log("ret_code:"+ret_code);
            if (ret_code==200){
                response.serveJSON(action_response_template)
            }else{
                response.writeHead(ret_code);
                response.end();
            }

        }
    },
    foo_STATE: {
        get: function (request, response) {
            log(request)
            var ret_code=checkMsisdn(request.querystring.msidn,request.querystring.token);
            console.log("querystringParam:"+request.querystring.msisdn+"|");
            if (request.querystring.token){console.log("querystringParam1:"+request.querystring.token+"|");}
            console.log("ret_code:"+ret_code);
            console.log( request.headers.cookie);
            if (ret_code==200){
                response.serveJSON(action_response_template)
            }else{
                response.writeHead(ret_code);
                response.end();
            }

        }
    },
    foo_OPOUT: {
        put: function (request, response) {
            log(request)
            var ret_code=checkMsisdn(request.querystring.msidn,request.querystring.token);

            response.writeHead(ret_code, {'Content-Type': 'text/plain'});

            //it will send by default Connection: keep-alive  &  Transfer-Encoding: chunked
            response.end();

        }

    },
    foo_LUP: {
        get: function (request, response) {
            log(request)
            var ret_code=checkMsisdn(request.querystring.msidn,request.querystring.token);
            console.log("ret_code:"+ret_code);
            if (ret_code==200){
                response.serveJSON(action_response_template)
            }else{
                response.writeHead(ret_code);
                response.end();
            }

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
    ['/lsc/api/mobileGame/:msidn/register', '1/fooModule#foo_REG'],
    ['/lsc/api/mobileGame/:msidn/validate', '1/fooModule#foo_VAL'],
    ['/lsc/api/mobileGame/:msidn/action', '1/fooModule#foo_ACT'],
    ['/lsc/api/mobileGame/:msidn/state', '1/fooModule#foo_STATE'],
    ['/lsc/api/mobileGame/:msidn/optout', '1/fooModule#foo_OPOUT'],
    ['/lsc/api/mobileGame/:msidn', '1/fooModule#foo_LUP']

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

apiServer.listen(function (err) {
    if (err) {
        console.error('Something terrible happened: %s', err.message)
    } else {
        console.log('Successful bound to port %s', apiServer.port)
    }
})