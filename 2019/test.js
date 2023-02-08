const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

console.log(getFreshIP('93.190.93.137'));

function getFreshIP(previousIP) {
    console.log('trying to get new IP Address')
    currentIP = getIP();
    console.log('c: ', currentIP, 'p: ', previousIP);


    if (currentIP === previousIP || currentIP === '173.56.91.53') {
        console.log(true)
    }
    else {
        console.log(false)
    }


    if (currentIP === previousIP || currentIP === '173.56.91.53') {
        console.log('going to wait for new IP Addrress')

        do {
            const now = new Date().getTime();
            while (new Date().getTime() < now + 5000) { }

            currentIP = getIP();
            console.log('what is the current IP: ', currentIP);
        }
        while (previousIP === currentIP ||
        currentIP === '173.56.91.53' ||
        currentIP === undefined ||
            currentIP === '')
    }

    return currentIP;

}


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
