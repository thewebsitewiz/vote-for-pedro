const execSync = require('child_process').execSync;
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const distribution = {
    6: { low: 9, high: 12 },
    7: { low: 14, high: 18 },
    8: { low: 16, high: 24 },
    9: { low: 24, high: 35 },
    10: { low: 28, high: 36 },
    11: { low: 28, high: 40 },
    12: { low: 35, high: 39 },
    13: { low: 28, high: 38 },
    14: { low: 29, high: 42 },
    15: { low: 28, high: 43 },
    16: { low: 26, high: 38 },
    17: { low: 28, high: 44 },
    18: { low: 38, high: 46 },
    19: { low: 48, high: 58 },
    20: { low: 38, high: 56 },
    21: { low: 38, high: 56 },
    22: { low: 32, high: 42 },
    23: { low: 26, high: 32 },
};

const categories = {
    'Best Art Classes': {
        'Sussex County Arts & Heritage': { low: 1, high: 40 },
        'Main Street Gallery': { low: 41, high: 70 },
        'Peters Valley School of Craft': { low: 71, high: 100 },
    },

    'Best Barber Shop': {
        'Plaza Barber Shop': { low: 1, high: 80 },
        'A Cut Above': { low: 81, high: 20 },
    },
    'Best Brewery/Distillery': {
        'Kroghs Restaurant & Brew Pub': { low: 1, high: 100 },
    },
    'Best Bridal/Tuxedo Store': {
        'Sew N Sew Bridal and Tuxedo​': { low: 1, high: 100 },
    },
    'Best Florist': {
        'Petals Florists': { low: 1, high: 70 },
        'The Flower Box': { low: 71, high: 100 },
    },
    'Best Veterinary Office': {
        'Andover Animal Hospital': { low: 1, high: 100 },
    },
    'Best Butcher Store': { 'Sussex Meat Packing': { low: 1, high: 100 }, },
    'Best Fuel Company': { 'Region Oil': { low: 1, high: 100 }, },
    'Best Garden Center': { 'Sunnyside Garden and Gifts': { low: 1, high: 100 }, },
    'Best Gift Shop': { 'Flowers in the Attic': { low: 1, high: 100 }, },
    'Best Deli': { 'Bagels On The Hill': { low: 1, high: 100 }, },
    'Best Ice Cream Store': { 'Cliffs Ice Cream': { low: 1, high: 100 }, },
    'Best Liquor/Wine Store': { 'The Liquor Factory': { low: 1, high: 100 }, },
    'Best Pizza': { 'Carmines': { low: 1, high: 100 }, },
    'Best Restaurant (All-Around)': {
        'Carmines': { low: 1, high: 70 },
        'Kroghs Restaurant & Brew Pub': { low: 71, high: 100 },
    },
    'Best Restaurant (New)': {
        'Sparta Diner': { low: 1, high: 100 },
    },
    'Best Restaurant (Italian)': {
        'Carmines': { low: 1, high: 100 },
    },
    'Best Restaurant (Outdoor Dining)': {
        'Jefferson House': { low: 1, high: 100 },
    },
    'Best Tire Store': {
        'Sparta Tire': { low: 1, high: 100 },
    },
    'Best Towing Company': {
        'Hampton Body Works': { low: 1, high: 100 },
    },
    'Best Womens Healthcare/OB/GYN': {
        'Woman To Woman': { low: 1, high: 100 },
    },
    'Best Banquet Hall': {
        'Crystal Springs': { low: 1, high: 40 },
        'North Shore House': { low: 41, high: 60 },
        'Rock Island Club': { low: 61, high: 80 },
        'Perona Farms': { low: 81, high: 90 },
        'Farmstead Golf & Country Club': { low: 91, high: 100 },
    },
    'Best Photography Business': {
        'Rob Yaskovic Photography': { low: 1, high: 35 },
        'Black Raven Imagery': { low: 36, high: 60 },
        'D. Becker Photo, LLC': { low: 61, high: 80 },
        'George Segal Studios': { low: 81, high: 100 },
    },
    'Best Golf Course': {
        'Farmstead Golf & Country Club': { low: 1, high: 50 },
        'Bally Owen': { low: 51, high: 70 },
        'Crystal Springs': { low: 71, high: 80 },
        'Newton Country Club': { low: 81, high: 90 },
        'Lake Mohawk Golf Club': { low: 91, high: 100 },
    },
    'Best Rental Services': {
        'Warwick Party Rental': { low: 1, high: 100 },
    }
};


const categoryList = Object.keys(categories);
const numberOfCategories = categoryList.length;


const pick = Math.floor(Math.random() * 100);

let currentIP;

do {
    try {

        let scriptPath = '/Users/dennis.luken@ibm.com/Dropbox/will/2019/voteForPedro.js'
        //let scriptPath = '/Users/dennisluken/Dropbox/will/2019/voteForPedro.js';

        let category = categoryList[Math.floor(Math.random() * numberOfCategories)]


        // Hardwire Category
        category = 'Best Photography Business';
        // category = 'Best Art Classes';

        let votingFor;
        const pick = Math.floor(Math.random() * 100);

        for (let business in categories[category]) {
            if (categories[category][business].low <= pick && categories[category][business].high >= pick) {
                votingFor = business;
            }
        }

        // Hardwire votingFor
        votingFor = 'Will Blochinger Photography';

        console.log(category, votingFor);

        category = category.replace(/ /g, '-');
        votingFor = votingFor.replace(/ /g, '-');

        var d = new Date();
        console.log(`I am about to vote for ${votingFor} at `, d);

        console.log('getting new IP address', currentIP)
        currentIP = getFreshIP(currentIP);
        console.log('newIP: ', currentIP);

        let args = `category=${category} votingFor=${votingFor} ipAddress=${currentIP}`

        let command = `node ${scriptPath} ${args}`;
        execSync(command, { stdio: 'inherit' });

        const now = new Date().getTime();
        while (new Date().getTime() < now + 80000) { }
    }
    catch (err) {

        console.log('err: ', err)
    }
}
while (1);




function getFreshIP(previousIP) {
    console.log('trying to get new IP Address')
    let currentIP = getIP();
    console.log('c: ', currentIP, 'p: ', previousIP);

    console.log();


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

    try {
        var xhr = new XMLHttpRequest();
        let urls = [
            'https://ipinfo.io/json',
            'https://api.ipify.org/?format=json',
            'https://api.myip.com/',
            'https://ifconfig.co/json'
        ];

        let idx = 1;
        let ip = null;
        do {
            
           idx = Math.floor(Math.random() * urls.length);

            console.log('\ttrying ',urls[idx]);
            xhr.open('GET', urls[idx], false);
            xhr.send();
            if (xhr.readyState == 4 && xhr.status == 200) {
                var response = JSON.parse(xhr.responseText);
                ip =  response.ip;
            } else {
                ip = null
                console.log('IP ERR: ', xhr.readyState, xhr.status)
            }
        }
        while (ip === null)
        
        return ip;
    }
    catch (err) {
        console.log('IP ERR: ', err)
    }
}
