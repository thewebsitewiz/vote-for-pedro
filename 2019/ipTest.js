
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
let ip = getIP();
console.log(ip)



function getIP() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "https://ipinfo.io/json", false);
    xhr.send();

    if (xhr.readyState == 4 && xhr.status == 200) {
        var response = JSON.parse(xhr.responseText);
        return response.ip;
    }
}