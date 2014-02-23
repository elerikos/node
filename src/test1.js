var hello = require('./hello');
var uuid = require('node-uuid');
var md5b = require('blueimp-md5').md5;
var util = require('util');
var os=  require('os');

var sfsdf = {}
console.log(sfsdf == undefined);
console.log(sfsdf.msisdn);

console.log(os.platform());
console.log(os.cpus());
console.log(os.type());
console.log(os.release());
console.log(os.totalmem());
console.log(os.freemem());
console.log(os.hostname());
var md5 = require('MD5');

var VALUES_SEPARATOR = "/_/g";
console.log( ("34256_4_2365_".match(VALUES_SEPARATOR)||[]).length );

//Calculate the (hex-encoded) HMAC-MD5 hash of a given string value and key:
var hashb = md5b("value", "wcmH1YLW84pC8eKDE0oI6SJMajfomqwVX6doVCC3BOrQJg7tLmFFLFoqgwkSdOFi"); // "01433efd5f16327ea4b31144572c67f6"
console.log(hashb);

var hash1 = md5("value");
var hash2 = md5("value","dsfgsd");
console.log(hash1);
console.log(hash2);
var uu_id = uuid.v1();
console.log(uu_id);

const SALT_SOURCE = "wcmH1YLW84pC8eKDE0oI6SJMajfomqwVX6doVCC3BOrQJg7tLmFFLFoqgwkSdOFi";
var  expirationDateMillis = (new Date()).getTime() + 5184000 * 1000;
var value_prefix = uuid.v1() + '_' + expirationDateMillis;
var value_suffix = md5b(value_prefix,SALT_SOURCE);
console.log(value_prefix);
console.log(value_suffix);

process.exit(0);

console.log(hello.world());
console.log("----");
console.log(hello.world1());
hello.world();
hello.world1();


opts = {
    host : '127.0.0.1',
    port: 8124,
    method: 'POST',
    path: '/',
    headers: {},
    func: function(fr){this.path = fr;console.log(fr)},
    create: function(){return this}
  };

console.log(opts);
console.log("opts:%j",opts);
console.log("opts:"+util.inspect(opts,true));
var obk = JSON.stringify(opts)
console.log(obk);
opts.func("dfdef");
console.log(opts);
console.log(JSON.stringify(opts));
console.log(opts.create())




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
console.log(JSON.stringify(personA));
console.log("----------Person--------------");

person=new Object();
person.firstName="John";
person.lastName="Doe";
person.age=50;
person.eyecolor="blue";
console.log(person);

person1={firstName:"John",lastName:"Doe",age:50,eyecolor:"blue"};
person1a={"firstName":"John","lastName":"Doe","age":50,"eyecolor":"blue"};

console.log("----------person1--------------");
console.log("person:"+JSON.stringify(person1));
console.log("----------person1a--------------");
console.log(person1a.firstName);

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


console.log("----------person2--------------");
var person2_ =  new person2("erik","elp","blue");
person2_.changeName("dfhdf");
console.log(person2_);
console.log("person2_:"+ JSON.stringify(person2_));
console.log("----------------------------------------------------------");


process.exit(0);

var header = {};
var header1 = {a:5,b:'df'};

console.log(header);

header['f'] = 12;
header['d'] = '13';

console.log(header);
console.log(header1);
console.log(opts.headers);

//=====================================
console.log("--a--");
function init() {
  var name = "Mozilla";
  function displayName() {
      console.log(name);
  }
  displayName();
}
init();
console.log("--b--");

function makeFunc() {
  var name = "Mozilla";
  function displayName() {
      console.log(name);
  }
  return displayName;
}
 //A closure is a special kind of object that combines two things: a function, and the environment in which that function was created
var myFunc = makeFunc();
console.log("----");
myFunc();

//=====================================

var myObj = new Object(),
    str = "myString",
    rand = Math.random(),
    obj = new Object();

myObj.type              = "Dot syntax";
myObj["date created"]   = "String with space";
myObj[str]              = "String value";
myObj[rand]             = "Random Number";
myObj[obj]              = "Object";
myObj[""]               = "Even an empty string";

console.log(myObj);



var myCar = new Object();
//myCar.make = "Ford";
//myCar.model = "Mustang";
//myCar.year = 1969;

myCar["make"] = "Ford";
myCar["model"] = "Mustang";
myCar["year"] = 1969;

console.log(myCar);
var propertyName = "make";
console.log(myCar[propertyName]);







