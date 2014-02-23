var request = require('request');
  var cid = 2;
  var msisdn = 11111111;
  var token = 12321;

  request(
    { method: 'GET', uri: 'http://127.0.0.1:8080/lsc/api/mobileGame/' + cid + "/" + msisdn + "/state?token="+ token

    }
  , function (error, response, body) {
      if(response.statusCode == 201){
        console.log('document saved as:')
      } else {
        console.log('error: '+ response.statusCode)
        console.log(body)
      }
    }
  )
