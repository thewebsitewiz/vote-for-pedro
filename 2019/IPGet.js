const fs = require('fs');
const path = require('path');

let previousIP = '';

do {

  let currentIP = fs.readFileSync(path.join(__dirname, 'currentIP.txt'), 'utf8');



  if (currentIP === previousIP) {

    do {
      console.log('\tc: ',currentIP,'p: ',previousIP, ' did match');

      const now = new Date().getTime();
      while (new Date().getTime() < now + 3000) { }
  
      currentIP = fs.readFileSync(path.join(__dirname, 'currentIP.txt'), 'utf8');
  
    }
    while(currentIP === previousIP)
    
  }
  else {
    console.log('\tc: ',currentIP,'p: ',previousIP, ' did not match');
  }


  previousIP = currentIP;

  console.log('Got New IP Address: ', currentIP);



} while (1);
