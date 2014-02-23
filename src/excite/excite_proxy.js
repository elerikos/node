var ApiServer = require('apiserver')
var cookie = require('cookie');
var reDis = require("redis");
var request = require('request');
var uuid = require('node-uuid');
var md5b = require('blueimp-md5').md5;
var os=  require('os');
var util=  require('util');
var log4js = require('log4js');

//*********************************************************
//  LSC Excite-Proxy
//  eelpiziotis/velti.com
//  Run: nohup node excite_proxy.js & tail -f nohup.out
//*********************************************************

//const EXCITE_URI = 'http://127.0.0.1:8081/lsc/api/mobileGame/';
const EXCITE_URI = 'http://10.1.8.111:8080/lsc/api/mobileGame/';
const SC_OK = 200;
const SC_FORBIDDEN = 403;
const SC_INTERNAL_SERVER_ERROR = 500;
const SC_BAD_REQUEST = 400;
const STATE_NEW = 1;
const STATE_PENDING = 2;
const STATE_AUTHORIZED = 4;
const VALUES_SEPARATOR = '_';
const COOKIE_MAX_AGE = 5184000;
const COOKIE_NAME = "427b48ca-1a95-4453-8aa9-29130f884815";
const SALT_SOURCE = "wcmH1YLW84pC8eKDE0oI6SJMajfomqwVX6doVCC3BOrQJg7tLmFFLFoqgwkSdOFi";
const cid = "campaignId";
const FIELD = "LSC_TRIVIA_GAME_PROXY_NODEJS";
var MOCK = true;

var redis_client = reDis.createClient(6379, '10.130.32.222', {detect_buffers: true});
var apiServer = new ApiServer({ port: 8083, timeout: 60000 })
var logger = log4js.getLogger();
logger.setLevel('DEBUG');

var questions = require('./questions');
var lastTriviaResponseMap = require('./responses');
var validate_response = require('./validate_response');
var action_response_template = require('./action_response_template');

printSystemInfo();

function LSCService(method,msisdn,urlEnd,queryString,triviaAction,callback){
    if (MOCK){
        logger.debug("MOCK RESPONSE to :"+urlEnd)
        var acrtmp;
        switch (urlEnd){
            case '/validate':
                acrtmp = validate_response
                acrtmp.nextCta = questions[Math.floor(Math.random()*questions.length)]
                callback(200,acrtmp);
                break;
            case '/action':
                acrtmp = action_response_template
                acrtmp.lastTriviaResponse =  lastTriviaResponseMap[triviaAction.questionId]
                acrtmp.nextCta = questions[Math.floor(Math.random()*questions.length)]
                callback(200,acrtmp);
                break;
            case '/state':
                acrtmp = action_response_template;
                logger.debug(Math.floor(Math.random()*questions.length))
                logger.debug(questions[Math.floor(Math.random()*questions.length)])
                acrtmp.nextCta = questions[Math.floor(Math.random()*questions.length)]
                callback(200,acrtmp);
                break;
            case '/user':
                acrtmp = action_response_template
                acrtmp.nextCta = questions[Math.floor(Math.random()*questions.length)]
                callback(200,acrtmp);
                break;
            default:
                callback(200,action_response_template);
        }
    }else{
        request(
            { method: method, uri: EXCITE_URI + msisdn + urlEnd + queryString,json:{},body:triviaAction }, function (error, response, body) {
                if (error){
                    logger.error("LSC error response"+util.inspect(error));
                    resp_code = SC_INTERNAL_SERVER_ERROR;
                }else{
                    var resp_code = response.statusCode;
                    logger.debug('LSC responseStatusCode: '+ response.statusCode)
                    logger.debug("LSC response:"+util.inspect(body));
                }
                callback(resp_code,body);
            }
        )
    }

}

UserState =  {
    userState : STATE_NEW,
    create : function(user){
        if (user == undefined) {
        } else if (user.msisdn.length>0 && !user.validated) {
            this.userState  = STATE_PENDING;
        } else if (user.msisdn.length>0 && user.validated) {
            this.userState = STATE_AUTHORIZED;
        }
        return this;
    }
}

function log(request){
    logger.info("RequestURL:"+request.url);
}

apiServer.use(ApiServer.payloadParser())

// modules ************************************************************************
apiServer.addModule('1', 'fooModule', {

//------  REGISTER USER  https://<SERVER>:<PORT>/lsc/api/mobileGame/<MSISDN>/register
    foo_REG: {
        get: function (request, response) {
            log(request)

            if (!request.querystring.msisdn) {
                response.serveJSON("Mo MSISDN specified!",{httpStatusCode: SC_FORBIDDEN});
                logger.error("Mo MSISDN specified!");
            }else{

                var cookieValue  = cookieFilter(request);
                // from the cookie get the user from DB
                getFromRedis(cookieValue, function (err, user) {
                    if (err){
                        response.serveJSON(err,{httpStatusCode: SC_INTERNAL_SERVER_ERROR,headers: getCookieHead(cookieValue)});
                        logger.error(err);
                    }else if (!user) {
                        response.serveJSON("No cookie found!",{httpStatusCode: SC_FORBIDDEN,headers: getCookieHead(cookieValue)});
                        logger.error("No cookie found!");
                    }else{
                        // hit LSC
                        LSCService('GET',request.querystring.msisdn,'/register',null,null,function(resp_code,actionResponse){
                            if (actionResponse!= undefined){
                                logger.debug(actionResponse);
                                // pair the msisdn with the cookie
                                user.msisdn = request.querystring.msisdn;
                                // store the new token
                                user.token = actionResponse.token;
                                setToRedis(cookieValue,user);
                                // strip token and user
                                delete actionResponse.token;
                            }
                            response.serveJSON(actionResponse,{httpStatusCode: resp_code ,headers: getCookieHead(cookieValue)})

                        })
                    }
                });
            }
        }
    },
//------  VALIDATE  https://<SERVER>:<PORT>/lsc/api/mobileGame/<MSISDN>/validate?token=<TOKEN>&verificationCode=< CODE>
    foo_VAL: {
        get: function (request, response) {
            log(request)
            var cookieValue  = cookieFilter(request);
            // from the cookie get the user from DB
            getFromRedis(cookieValue, function (err, user) {
                if (err){
                    response.serveJSON(err,{httpStatusCode: SC_INTERNAL_SERVER_ERROR,headers: getCookieHead(cookieValue)});
                    logger.error(err);
                }else if (!user) {
                    response.serveJSON("No cookie found!",{httpStatusCode: SC_FORBIDDEN,headers: getCookieHead(cookieValue)});
                    logger.error("No cookie found!");
                }else{
                    var us = UserState.create(user);
                    if (us.userState!=STATE_PENDING) {
                        response.serveJSON("User is still in " + us.userState + " state!",{httpStatusCode: SC_FORBIDDEN,headers: getCookieHead(cookieValue)});
                        logger.error("User is still in " + us.userState + " state!");
                    }else if (!request.querystring.verificationCode){
                        response.serveJSON("No verification code found!",{httpStatusCode: SC_FORBIDDEN,headers: getCookieHead(cookieValue)});
                        logger.error("No verification code found!");

                    }else{
                        // hit LSC
                        LSCService('GET',user.msisdn,'/validate','?token='+user.token+'&verificationCode='+request.querystring.verificationCode,null,function(resp_code,actionResponse){
                            if (actionResponse!= undefined){
                                user.validated = true;
                                setToRedis(cookieValue,user);
                                // strip token and user
                                delete actionResponse.token;
                            }
                            response.serveJSON(actionResponse,{httpStatusCode: resp_code ,headers: getCookieHead(cookieValue)})
                        })
                    }
                }
            });
        }
    }, //------  SUBMIT ACTION  -----https://<SERVER>:<PORT>/lsc/api/mobileGame/<CAMPAIGN_ID>/<MSISDN>/action?token=<TOKEN>
    foo_ACT: {
        put: function (request, response) {
            log(request)

            request.resume()
            request.once('end', function () {
                if (request.parseError) {
                    response.serveJSON(request.parseError.message,{httpStatusCode: SC_BAD_REQUEST})
                    logger.error(request.parseError.message)
                } else {
                    logger.debug("TriviaAction Request: "+util.inspect(request.body))
                    var cookieValue  = cookieFilter(request);
                    // from the cookie get the user from DB
                    getFromRedis(cookieValue, function (err, user) {
                        if (err){
                            response.serveJSON(err,{httpStatusCode: SC_INTERNAL_SERVER_ERROR,headers: getCookieHead(cookieValue)});
                            logger.error(err);
                        }else if (!user) {
                            response.serveJSON("No cookie found!",{httpStatusCode: SC_FORBIDDEN,headers: getCookieHead(cookieValue)});
                            logger.error("No cookie found!");
                        }else{
                            var us = UserState.create(user);
                            if (us.userState != STATE_AUTHORIZED) {
                                response.serveJSON("User is not validated!",{httpStatusCode: SC_FORBIDDEN,headers: getCookieHead(cookieValue)});
                                logger.error("User is not validated!");
                            }else{
                                // hit LSC
                                LSCService('PUT',user.msisdn,'/action','?token='+user.token,request.body,function(resp_code,actionResponse){
                                    if (actionResponse!= undefined){
                                        // store the new token
                                        user.token = actionResponse.token;
                                        setToRedis(cookieValue,user);
                                        // strip token and user
                                        delete actionResponse.token;
                                    }
                                    response.serveJSON(actionResponse,{httpStatusCode: resp_code ,headers: getCookieHead(cookieValue)})
                                })
                            }
                        }
                    });
                }
            })


        }
    },  //------------------------------  LOAD USER STATE  -----------------------------------------
    foo_STATE: {
        get: function (request, response) {
            log(request)
            var cookieValue  = cookieFilter(request);
            // from the cookie get the user from DB
            getFromRedis(cookieValue, function (err, user) {
                if (err){
                    response.serveJSON(err,{httpStatusCode: SC_INTERNAL_SERVER_ERROR,headers: getCookieHead(cookieValue)});
                    logger.error(err);
                }else if (!user) {
                    response.serveJSON("No cookie found!",{httpStatusCode: SC_FORBIDDEN,headers: getCookieHead(cookieValue)});
                    logger.error("No cookie found!");
                }else{
                    var us = UserState.create(user);
                    if (us.userState != STATE_AUTHORIZED) {
                        response.serveJSON("error userState!",{httpStatusCode: SC_FORBIDDEN,headers: getCookieHead(cookieValue)});
                        logger.error("error userState:"+us);
                    }else{
                        // hit LSC
                        LSCService('GET',user.msisdn,'/state','?token='+user.token,null,function(resp_code,actionResponse){
                            if (actionResponse!= undefined){
                                // store the new token
                                user.token = actionResponse.token;
                                setToRedis(cookieValue,user);
                                // strip token and user
                                delete actionResponse.token;
                            }
                            response.serveJSON(actionResponse,{httpStatusCode: resp_code ,headers: getCookieHead(cookieValue)})
                        })
                    }
                }
            });
        }
    },
//--------- SESSION--------------------------------------------------------------------------------------
    foo_SESSION: {
        post: function (request, response) {
            log(request)
            var cookieValue  = cookieFilter(request);
            // from the cookie get the user from DB
            getFromRedis(cookieValue, function (err, user) {
                if (err){
                    response.serveJSON(err,{httpStatusCode: SC_INTERNAL_SERVER_ERROR,headers: getCookieHead(cookieValue)});
                    logger.error(err);
                }else if (!user) {
                    response.serveJSON("No cookie found!",{httpStatusCode: SC_FORBIDDEN,headers: getCookieHead(cookieValue)});
                    logger.error("No cookie found!");
                }else{
                    var us = UserState.create(user);
                    response.serveJSON(us,{headers: getCookieHead(cookieValue)})
                }
            });
        }
    },
//------  LOAD USER PROFILE  ---https://<SERVER>:<PORT>/lsc/api/mobileGame/<CAMPAIGN_ID>/<MSISDN>?token=<TOKEN>
    foo_LUP: {
        get: function (request, response) {
            log(request)
            var cookieValue  = cookieFilter(request);
            // from the cookie get the user from DB
            getFromRedis(cookieValue, function (err, user) {
                if (err){
                    response.serveJSON(err,{httpStatusCode: SC_INTERNAL_SERVER_ERROR,headers: getCookieHead(cookieValue)});
                    logger.error(err);
                }else if (!user) {
                    response.serveJSON("No cookie found!",{httpStatusCode: SC_FORBIDDEN,headers: getCookieHead(cookieValue)});
                    logger.error("No cookie found!");
                }else{
                    var us = UserState.create(user);
                    if (us.userState != STATE_AUTHORIZED) {
                        response.serveJSON("User is not validated!",{httpStatusCode: SC_FORBIDDEN,headers: getCookieHead(cookieValue)});
                        logger.error("User is not validated!");
                    }else{
                        // hit LSC
                        LSCService('GET',user.msisdn,null,'?token='+user.token,null,function(resp_code,actionResponse){
                            if (actionResponse!= undefined){
                                // store the new token
                                user.token = actionResponse.token;
                                setToRedis(cookieValue,user);
                                // strip token and user
                                delete actionResponse.token;
                            }
                            response.serveJSON(actionResponse,{httpStatusCode: resp_code ,headers: getCookieHead(cookieValue)})
                        })
                    }
                }
            });
        }
    },
//--------- LOG LEVEL--------------------------------------------------------------------------------------
    foo_CONF: {
        get: function (request, response) {
            log(request)
            if (request.querystring.level){
                logger.setLevel(request.querystring.level.toUpperCase());
                response.serveJSON("LOG LEVEL is set to :"+logger.level);
            }else
            if (request.querystring.mock){
                MOCK = (request.querystring.mock=='true');
                response.serveJSON("Mock is set to :"+MOCK);
            }else{
                response.serveJSON("send parameter ?level=[DEBUG,INFO...] to set LOG4j Level, send parameter ?mock=[true|false] to set mock LSC service. Current LEVEL:"+logger.level+" MOCK:"+MOCK);
            }
        }
    }

})

// events
apiServer.on('requestStart', function (pathname, time) {
    // logger.info(' ☉ :: start    :: %s', pathname)
}).on('requestEnd', function (pathname, time) {
        //      logger.info(' ☺ :: end      :: %s in %dms', pathname, time)
    }).on('error', function (pathname, err) {
        logger.error(' ☹ :: error    :: %s (%s)', pathname, err.message)
    }).on('timeout', function (pathname) {
        logger.error(' ☂ :: timedout :: %s', pathname)
    })

apiServer.listen(function (err) {
    if (err) {
        logger.error('Something terrible happened: %s', err.message)
    } else {
        logger.info('Successful bound to port %s', apiServer.port)
    }
})


function getUserState(user){
    var userState;
    if (user == null || user.msisdn.length==0) {
        userState = STATE_NEW;
    } else if (user.msisdn.length>0 && user.validated=='false') {
        userState = STATE_PENDING;
    } else if (user.msisdn.length>0 && user.validated=='true') {
        userState = STATE_AUTHORIZED;
    }
    return userState;
}


function cookieFilter(request){
    var cookieValue;
    if (request.headers.cookie){
        logger.debug("HAS COOKIE VAL:"+request.headers.cookie)
        var cookies = cookie.parse(request.headers.cookie);
        cookieValue= cookies[COOKIE_NAME];
        if (cookieValue==undefined){
            logger.warn("New user !");
            cookieValue = createNewCookie();
        }else if ((cookieValue.match(/_/g)||[]).length!=2){
            logger.error("Cookie value does not have 2 hyphens!!");
            cookieValue = createNewCookie();
        }else{
            var lastSepIndex = cookieValue.lastIndexOf(VALUES_SEPARATOR);
            var value_prefix = cookieValue.substring(0, lastSepIndex);
            var value_suffix = cookieValue.substring(lastSepIndex + VALUES_SEPARATOR.length);
            if (isPasswordValid(value_suffix, value_prefix)) {
                var expirationDate = value_prefix.substring(value_prefix.indexOf(VALUES_SEPARATOR) + VALUES_SEPARATOR.length);
                if (expirationDate < (new Date()).getTime()) {
                    logger.debug("Cookie has expired but browser did not delete it!!");
                    cookieValue = createNewCookie()
                }
            } else {
                logger.error("Cookie signature is invalid!!");
                cookieValue = createNewCookie()
            }
        }
    }else{
        cookieValue = createNewCookie()
    }
    logger.debug("END COOKIE VAL:"+cookieValue)
    return cookieValue;
}

function createNewCookie() {
    logger.debug("createNewCookie");
    var  expirationDateMillis = (new Date()).getTime() + COOKIE_MAX_AGE * 1000;
    var  cookieValue = generateCookieValue(expirationDateMillis);
    logger.debug("createdNewCookie:"+cookieValue);
    var user = {msisdn:'',token:'',validated: false};
    setToRedis(cookieValue,user);
    return cookieValue;
}

function generateCookieValue(expirationDateMillis) {
    logger.debug("generateCookieValue");
    var value_prefix = uuid.v1() + VALUES_SEPARATOR + expirationDateMillis;
    var value_suffix = md5b(value_prefix,SALT_SOURCE);
    return value_prefix + VALUES_SEPARATOR + value_suffix;
}

function isPasswordValid(value_suffix, value_prefix){
    return ( value_suffix ==  md5b(value_prefix,SALT_SOURCE) );
}

function getCookieHead(cookieVal){
    return { 'Set-Cookie': cookie.serialize(COOKIE_NAME, cookieVal,{path:'/', httpOnly:true, secure:!MOCK, maxAge:COOKIE_MAX_AGE}) }
}

function printSystemInfo(){
    logger.info("Platform:"+os.platform()+" Release:"+os.release());
    logger.info("Platform:"+os.type());
    logger.info("TotalMem:"+os.totalmem());
    logger.info("FreeMem:"+os.freemem());
    logger.info("HostName:"+os.hostname());
    logger.info("LSC Mock Service:"+MOCK);
    logger.info("Log Level:"+logger.level);
}

function setToRedis(key,object){
    logger.debug("User before Saving:"+util.inspect(object));
    redis_client.hset(key, FIELD, JSON.stringify(object));
}

function getFromRedis(key,callback){
    redis_client.hget(key, FIELD, function (err, object){
        logger.debug("User: "+object);
        if (err)
            logger.error("error: "+err);
        callback(err, JSON.parse(object))
    });
}

// custom routing
apiServer.router.addRoutes([
    ['/mobileGame/:msisdn/register', '1/fooModule#foo_REG'],
    ['/mobileGame/validate', '1/fooModule#foo_VAL'],            //+token+verificationCode
    ['/mobileGame/action', '1/fooModule#foo_ACT'],             //+token
    ['/mobileGame/state', '1/fooModule#foo_STATE'],           //+token
    ['/mobileGame/session', '1/fooModule#foo_SESSION'],
    ['/mobileGame/user', '1/fooModule#foo_LUP'],                    //+token
    ['/configure', '1/fooModule#foo_CONF']       //+level

])









