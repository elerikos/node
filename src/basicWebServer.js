var http = require('http');
var util = require('util');
var cookie = require('cookie');

var server_port = 8085;
var txt = '{ "employees" : [' +
    '{ "firstName":"John" , "lastName":"Doe" },' +
    '{ "firstName":"Anna" , "lastName":"Smith" },' +
    '{ "firstName":"Peter" , "lastName":"Jones" } ]}';

function PersonA(gender,name) {
    this.gender = gender;
    this.name = name;
    this.changeName= function(name){this.name = name; return this;}
}
var personA = new PersonA("gr","ee");
console.log("----------Person--------------");
console.log(personA);
console.log(personA.changeName("gg"));
console.log("----------Person--------------");

person=new Object();
person.firstName="John";
person.lastName="Doe";
person.age=50;
person.eyecolor="blue";

person1={firstName:"John",lastName:"Doe",age:50,eyecolor:"blue"};
person1a={"firstName":"John","lastName":"Doe","age":50,"eyecolor":"blue"};

function person2(firstname,lastname,age,eyecolor)
{
    this.firstName=firstname;
    this.lastName=lastname;
    this.age=age;
    this.eyecolor=eyecolor;
    this.changeName = changeName;
    function changeName(name)
    {
        this.lastName=name;
    }
}
console.log("----------txt--------------");
console.log(txt);
console.log("----------obj--------------");
var obj = eval ("(" + txt + ")");
console.log(obj);
console.log("----------obj1--------------");
var obj1 = JSON.parse(txt)
console.log(obj1);
console.log(obj1.employees[2].firstName);
console.log("----------person--------------");
console.log(person);
console.log("----------person1--------------");
console.log("person:"+JSON.stringify(person1));
console.log("----------person1a--------------");
console.log(person1a.firstName);
console.log("----------person2--------------");
var person2_ =  new person2("erik","elp","blue");
person2_.changeName("dfhdf");
console.log(person2_);
console.log("person2_:"+ JSON.stringify(person2_));
console.log("----------------------------------------------------------");

//process.exit(0);


http.createServer(function (request, response) {
    //console.log(request.connection);
    console.log('Method:%s',request.method);
    console.log('URL:%s',request.url);
    //console.log("Headers:"+util.inspect(request.headers));
    console.log('Headers:%j',request.headers);
    //  console.log('Headers:',JSON.stringify(request.headers));

    //  headers with name name contain "-" will not be treated as properties
    var headersJ = JSON.parse(JSON.stringify(request.headers));
    //var headersJ = JSON.parse("{\"host\":\"127.0.0.1:8124\",\"connection\":\"keep-alive\",\"accept\":\"*/*\",\"us-eragent\":\"Mozilla/5.0 (X11; Linux i686) AppleWebKit/537.17 (KHTML, like Gecko) Chrome/24.0.1312.56 Safari/537.17\"}");
    // console.log(headersJ.connection);
    // console.log(headersJ);
    var cookies = {};
    // console.log(request.headers.cookie);
    request.headers.cookie && request.headers.cookie.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
    });
    var cookies1 = cookie.parse(request.headers.cookie);


    console.log(cookies);
    console.log(cookies1);
    //  console.log( cookies.mycookie);
    //  console.log( cookies1.mycookie);

    var postData;
    var datee = new Date()
    var hdr = cookie.serialize('foo', 'bar',{path:'/',expires:datee,httpOnly:true,secure:true,maxAge:23131231});

    console.log(getCookieHead(datee));
    console.log(hdr);
    response.writeHead(200, {'Set-Cookie': 'mycookie1=test; Path=/; HttpOnly', 'Content-Type': 'text/plain'});
    //it will send by default Connection: keep-alive  &  Transfer-Encoding: chunked
    response.end('Hello World\n');
    request.on('data', function(chunk) {
        console.log("data->"+chunk);
        try{
            postData = JSON.parse(chunk);
        }catch (e){
            console.log("error")
        }
        //  console.log(postData.employees[1].firstName);
    });
    request.on('end', function() {
        console.log("end->");
    });

}).listen(server_port);

console.log('Server running at http://127.0.0.1:'+server_port+'/');


function getCookieHead(datee){
    return cookie.serialize('foo', 'bar',{path:'/',expires:datee,httpOnly:true,secure:true,maxAge:23131231});
}