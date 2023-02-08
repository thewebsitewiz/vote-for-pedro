const fs = require('fs');
const path = require('path');

const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


do {
  
/*   const A = Math.floor((Math.random() * (300 - 5 + 1) + 5));
  const B = Math.floor((Math.random() * (300 - 5 + 1) + 5));
  const C = Math.floor((Math.random() * (300 - 5 + 1) + 5));
  const D = Math.floor((Math.random() * (300 - 5 + 1) + 5)); */


  
  const IPAddress = getIP();

  console.log('new ip address: ', IPAddress);
  fs.writeFileSync(path.join(__dirname, 'currentIP.txt'), IPAddress);

  const now = new Date().getTime();
  let wait = Math.floor((Math.random() * (50 - 10 + 1) + 10));
  //console.log('waiting: ', wait);
  wait = 5;
  while (new Date().getTime() < now + wait * 1000) { }
}
while(1);



function getIP() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', "https://ipinfo.io/json", false);
  xhr.send();

  if (xhr.readyState == 4 && xhr.status == 200) {
      var response = JSON.parse(xhr.responseText);
      return response.ip;
  } else {
      console.log('bad')
  }
}

