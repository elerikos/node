var redis = require("redis");
var util=  require('util');
var client = redis.createClient(6379, '10.130.32.222', {detect_buffers: true});

/*
client.hset("hash key", "hashtest 1", "some value", redis.print);
   client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
   client.hkeys("hash key", function (err, replies) {
       console.log(replies.length + " replies:");
       replies.forEach(function (reply, i) {
           console.log("    " + i + ": " + reply);
       });
       client.quit();
       process.exit(0);
   });*/

var tmp =  {
    prop1: "abcdefghij",
    prop2: "a type of value"
}
var  FIELD = "FIELD"
var user = {msisdn:'',token:'',validated: false};
user.msisdn = 23423
user.validated = true
client.hset("cookie", FIELD, JSON.stringify(user));
client.hget("cookie",FIELD, function(err, reply) {
    if (err){
        console.log("ERROR:"+err);
        console.log("ERROR1:"+reply);
    }
    console.log(reply);
    var gf= JSON.parse(reply);
    console.log(gf)
    if (gf.validated){
        console.log("Hlellee")
    }

    console.log("sdfsdf"+reply);
    client.quit();
    process.exit(0);

});

client.hset("hashkey", "hashtest 1", "some value", redis.print);
tmp.valid = 'true'

client.hset("hashkey", "hashtest 2", JSON.stringify(tmp));
/*client.hset("hosts1","hashtest 2", {
    "prop1": "abcdefghij", // NOTE: the key and value must both be strings
    "prop2": "a type of value"
}, redis.print);*/
client.set("somekey", "some val");
//client.hget("hashkey","hashtest 2", function(err, reply) {
client.hget("hashkey","hashtest 2", function(err, reply) {
    console.log(reply);
    console.log("sdfsdf"+reply);
    client.quit();
    process.exit(0);

});







client.set("foo_rand000000000000", "OK");

// This will return a JavaScript String
client.get("foo_rand000000000000", function (err, reply) {
    console.log(reply.toString()); // Will print `OK`
});


// This will return a Buffer since original key is specified as a Buffer
client.get(new Buffer("foo_rand000000000000"), function (err, reply) {
    console.log(reply.toString()); // Will print `<Buffer 4f 4b>`
});

client.hmset("hosts", "mjr", "1", "another", "23", "home", "1234");
client.hgetall("hosts", function (err, obj) {
    console.dir(obj);
});


client.HMSET("hosts1", {
    "prop1": "abcdefghij", // NOTE: the key and value must both be strings
    "prop2": "a type of value"
});
var field =  "FIELD1";
client.HSET("user1",field , {
    "msisdn": "11111111", // NOTE: the key and value must both be strings
    "cookieValue": "sdfgewrge",
    "token": "123456",
    "validated": "true"
});
client.HMSET("9ef9dda0-7d05-11e2-a1b9-195b01cf5bcf_1366731387002_7592ce0047ce6f8a6e8632efb827e7b5", {
    "msisdn": "306999999999", // NOTE: the key and value must both be strings
    "token": "KD9SDF98SDF79SD",
    "validated": "true"
});






client.hgetall("hosts1", function (err, obj) {
    console.dir(obj);
    console.log(obj.prop1);
    //console.log(JSON.parse(JSON.stringify(obj)));
});

client.hgetall("user1", function (err, obj) {
    console.log(obj);
    var obj1= JSON.parse(JSON.stringify(obj));
    console.dir(    obj.token);
    console.dir(    obj1.token);
    console.dir( util.inspect(obj[field]));
//    console.dir( JSON.parse(obj.FIELD1));

    //console.log(JSON.parse(JSON.stringify(obj)));
});
client.hgetall("9ef9dda0-7d05-11e2-a1b9-195b01cf5bcf_1366731387002_7592ce0047ce6f8a6e8632efb827e7b5", function (err, obj) {
    console.log(obj);
    var obj1= JSON.parse(JSON.stringify(obj));
    console.dir(    obj.token);
    console.dir(    obj1.token);
    console.dir(    obj.msisdn);

    //console.log(JSON.parse(JSON.stringify(obj)));
});

client.hgetall("sdfsdfse34234", function (err, obj) {
    if (!obj){
        console.log("No object found");
    }else{
    console.log(obj);
    var obj1= JSON.parse(JSON.stringify(obj));
    console.dir(    obj.token);
    console.dir(    obj1.token);
    console.dir(    obj.msisdn);
    }
    //console.log(JSON.parse(JSON.stringify(obj)));
});

//client.end();
client.quit();

