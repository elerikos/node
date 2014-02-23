var redis = require("redis");

var client = redis.createClient(6379, '10.130.32.222', {detect_buffers: true});

client.set("foo_rand000000000000", "OK");

// This will return a JavaScript String
client.get("foo_rand000000000000", function (err, reply) {
    console.log(reply.toString()); // Will print `OK`
  //  console.log(err.toString()); // Will print `OK`
});


// This will return a Buffer since original key is specified as a Buffer
client.get(new Buffer("foo_rand000000000000"), function (err, reply) {
    console.log(reply.toString()); // Will print `<Buffer 4f 4b>`
  //  console.log(err.toString()); // Will print `<Buffer 4f 4b>`
});

client.hmset("hosts", "mjr", "1", "another", "23", "home", "1234");
client.hgetall("hosts", function (err, obj) {
    console.dir(obj);
});


client.HMSET("hosts1", {
    "prop1": "abcdefghij", // NOTE: the key and value must both be strings
    "prop2": "a type of value"
});

var user3 = {
    "msisdn": "306999999993", // NOTE: the key and value must both be strings
    "cookieValue": "sdfgewrge",
    "token": "123456",
    "validated": "true"
};
var user4 = {
    msisdn: "306999999993", // NOTE: the key and value must both be strings
    cookieValue: "sdfgewrge",
    token: "123456",
    validated: 'true'
};
console.log("====================")
console.log(user4)

var user5  = JSON.stringify(user4)
console.log(user3)
console.log(user5)

client.HMSET("user3", user3);
client.HMSET("user4", user4);




client.hgetall("hosts1", function (err, obj) {
    console.log("----------------------------");
    console.dir(obj);
    console.log(obj.prop1);
    //console.log(JSON.parse(JSON.stringify(obj)));
});

client.hgetall("user3", function (err, obj) {
    console.log("----------------------------");
    console.log(obj);
    var obj1= JSON.parse(JSON.stringify(obj));
    console.dir(    obj.token);
    console.dir(    obj1.token);
    console.dir(    obj.msisdn);

    //console.log(JSON.parse(JSON.stringify(obj)));
});

client.hgetall("user1", function (err, obj) {
    console.log("----------------------------");
    console.log(obj);


    //console.log(JSON.parse(JSON.stringify(obj)));
});

//client.end();
client.quit();

