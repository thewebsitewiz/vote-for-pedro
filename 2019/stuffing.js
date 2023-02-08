const puppeteer = require('puppeteer');
const $ = require('cheerio');

const ip = require('ip');

const pool = require('./common/db');

const people = require('./names');
const street = require('./readStreets');

const addressData = street.getStreetData();

let areaCodeInfo = {};

const small = 2973;
const large = 9318;


const votingFor = 'Will Blochinger';
const contestant = 'Will Blochinger Photography';
const category = 'Best Photography Business';

// Define IPAddress variable
let previousIP = '9.66.188.61';

let count = 0;

const ORIGINALdistribution = {
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

const distribution = {
  6: { low: 1, high: 2 },
  7: { low: 1, high: 2 },
  8: { low: 1, high: 2 },
  9: { low: 2, high: 3 },
  10: { low: 2, high: 4 },
  11: { low: 2, high: 4 },
  12: { low: 3, high: 5 },
  13: { low: 6, high: 8 },
  14: { low: 3, high: 4 },
  15: { low: 2, high: 4 },
  16: { low: 2, high: 3 },
  17: { low: 2, high: 4 },
  18: { low: 3, high: 4 },
  19: { low: 4, high: 5 },
  20: { low: 3, high: 5 },
  21: { low: 3, high: 5 },
  22: { low: 3, high: 4 },
  23: { low: 2, high: 3 },
};


const categories = {
  'Best Art Classes': {
    'Sussex County Arts & Heritage': 40,
    'Main Street Gallery': 30,
    'Peters Valley School of Craft': 30
  },

  'Best Barber Shop': {
    'Plaza Barber Shop': 80,
    'A Cut Above': 20
  },
  'Best Brewery/Distillery': {
    'Kroghs Restaurant & Brew Pub': 40,
  },
  'Best Bridal/Tuxedo Store': {
    'Sew N Sew Bridal and Tuxedo​': 50,
  },
  'Best Florist': {
    'Petals Florists': 60,
    'The Flower Box': 20
  },
  'Best Veterinary Office': {
    'Andover Animal Hospital': 40
  },
  'Best Butcher Store': { 'Sussex Meat Packing': 40 },
  'Best Fuel Company': { 'Region Oil': 30 },
  'Best Garden Center': { 'Sunnyside Garden and Gifts': 70 },
  'Best Gift Shop': { 'Flowers in the Attic': 30 },
  'Best Deli': { 'Bagels On The Hill': 60 },
  'Best Ice Cream Store': { 'Cliffs Ice Cream': 80 },
  'Best Liquor/Wine Store': { 'The Liquor Factory': 60 },
  'Best Pizza': { 'Carmines': 80 },
  'Best Restaurant (All-Around)': { 'Carmines': 80, 'Kroghs Restaurant & Brew Pub': 30 },
  'Best Restaurant (New)': { 'Sparta Diner': 40 },
  'Best Restaurant (Italian)': { 'Carmines': 80 },
  'Best Restaurant (Outdoor Dining)': { 'Jefferson House': 70 },
  'Best Tire Store': { 'Sparta Tire': 40 },
  'Best Towing Company': { 'Hampton Body Works': 40 },
  'Best Womens Healthcare/OB/GYN': { 'Woman To Woman': 50 },
  'Best Banquet Hall': { 'Crystal Springs': 50, 'North Shore House': 40, 'Rock Island Club': 20, 'Perona Farms': 10, 'Farmstead Golf & Country Club': 5 },

  'Best Photography Business': {
    'Will Blochinger Photography': 100,
    'Rob Yaskovic Photography': 46,
    'Black Raven Imagery': 43,
    'D. Becker Photo, LLC': 31,
    'George Segal Studios': 23,
  },
  'Best Golf Course': {
    'Farmstead Golf & Country Club': 50,
    'Bally Owen': 30,
    'Crystal Springs': 20,
    'Newton Country Club': 10,
    'Lake Mohawk Golf Club': 5
  },
  'Best Rental Services': {
    'Warwick Party Rental': 40
  }
};


const numberOfTerminals = 3;

const percentage = categories[category][contestant];



let previousHour = 0;

prepare().then(areaCodeInfo => {
  mainFunction().then(result => {
    try {
      //console.log('success: ');
      process.exit(0);
    }
    catch (err) {
      //console.log('error: ', err);
      process.exit(1);
    }
  })

})

async function prepare() {
  areaCodeInfo = await getAreaCodeInfo();
  return areaCodeInfo;
}

async function mainFunction() {

  try {
    for (let x = 0; x < 20; x++) {
      console.log();
    }

    console.log('in main function');
    // console.log(areaCodeInfo);

    let votesCast = 0;
    let attempts = 1;

    const now = new Date();
    let theHour = now.getHours();

    let min;
    let max;
    let voteGoal;

    do {
      console.log(`====================== begin ${attempts} ========================`);

      console.log('theHour: ', theHour)

      if (distribution[theHour] !== undefined) {

        if (votesCast === voteGoal) {
          console.log('votesCast equals voteGoal');
          let currentHour = now.getHours();

          console.log('theHour: ', theHour, ' currentHour: ', currentHour)
          if (theHour === currentHour) {
            let tries = 0;
            while (theHour === currentHour) {
              const waitNow = new Date().getTime();
              const waitIncrement = 1 * 60 * 1000 // 1 minutes
              while (new Date().getTime() < waitNow + waitIncrement) { }
            }
          }

          votesCast = 0;

          voteGoal = getVoteGoal(theHour);

        }
        else {
          console.log('votesCast does NOT equal voteGoal');
          if (votesCast === 0) {
            console.log('no votes cast yet - geting Vote Goal');

            voteGoal = getVoteGoal(theHour)

            console.log('New Vote Goal: ', voteGoal);
          }
        }

        console.log('start voting');
        for (let votes = 0; votes < voteGoal; votes++) {

          const waitNow = new Date().getTime();
          while (new Date().getTime() < waitNow + 5000) { }
          /*
          const IPAddress = await getFreshIP();
          const person = await getPerson();
          await addTrackingInfo(person, IPAddress);
          */





          votesCast++;
          console.log('\tvote: ', theHour, votes, votesCast);


        }

        console.log('done voting');
      }
      else {
        // wait for 6am !!!
      }


      console.log('repeating');
      console.log(`====================== end ${attempts} ========================`);
      attempts++;
      if (attempts > 3) {
        process.exit(0);
      }
    }
    while (1);

  }
  catch (err) {
    console.log('main function ERROR: ', err);

    process.exit(1);
  }
}

function getVoteGoal(theHour) {

  console.log('in getVoteGoal: ', theHour)
  let min = distribution[theHour].low;
  let max = distribution[theHour].high;

  let voteGoal = Math.floor(((Math.random() * (max - min + 1) + min) * (percentage / 100)) / numberOfTerminals);
  if (voteGoal < 2) {
    voteGoal = 2
  }
  return voteGoal;
}

async function addTrackingInfo(person, IPAddress) {
  try {
    const values = [
      `${person.firstName} ${person.lastName}`,
      `${person.email}`,
      `${person.phoneNumber}`,
      `${person.userAgent.agent}`,
      `${person.address.street}`,
      `${person.address.town}`,
      `${person.address.state}`,
      `${person.address.zip}`,
      votingFor,
      IPAddress
    ];

    const logEntry = `
  insert into tracking
  (name,email,phoneNumber,userAgent,streetAddress,town,state,zip,votingFor,IPAddress)
  values
  (?,?,?,?,?,?,?,?,?,?)
  `;

    const trackingResults = await pool.query(logEntry, values);


  }
  catch (err) {
    //console.log('tracking err: ', err);
  }

}



async function getPerson() {
  try {

    let person = {};

    let personUnique = 0;
    while (personUnique === 0) {
      // get person
      //      first name
      //      last name
      person = people.getName('any');

      //  is person uinque
      const uniquePerson = `select trackingId from tracking where name = '${person.firstName} ${person.lastName}'`;

      const uniquePersonResults = await pool.query(uniquePerson);

      if (uniquePersonResults.length === 0) {
        personUnique = 1;
      }
    }

    //      email address
    const emailDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'verizon.net', 'earthlink.net', 'outlook.com', 'optimum.net'];
    const emailDomainsLength = emailDomains.length;

    const emailType = Math.floor(Math.random() * 2);

    let emailAddress = '';
    emailType === 0 ? emailAddress = person.firstName.substr(0, 1) + person.lastName : emailAddress = `${person.firstName}.${person.lastName}`;

    const domain = emailDomains[Math.floor(Math.random() * emailDomainsLength)];

    person.email = `${emailAddress.toLowerCase()}@${domain}`;

    // user agent
    person.userAgent = getUserAgent();

    // city, state, zip
    person.address = getAddress();

    const state = person.address.state;
    const town = person.address.town;

    person.phone = getPhoneNumber(state, town);

    return person;
  }
  catch (err) {
    //console.log('get person err: ', err);
  }
}


function getPhoneNumber(state, town) {
  let areaCode;
  let prefix;
  if (areaCodeInfo[state][town] === undefined) {
    areaCode = 646;
    prefix = 282;
  }
  else {
    areaCodes = Object.keys(areaCodeInfo[state][town]);

    const areaCodesLength = areaCodes.length;
    const idx = Math.floor(Math.random() * areaCodesLength);
    areaCode = areaCodes[idx];

    const prefixes = Object.keys(areaCodeInfo[state][town][areaCode]);
    const prefixesLength = prefixes.length;
    prefix = areaCodeInfo[state][town][areaCode][Math.floor(Math.random() * prefixesLength)];
  }

  const number = Math.floor(Math.random() * (large - small + 1) + small);

  return `${areaCode}-${prefix}-${number}`;
}

async function getFreshIP() {
  try {
    let returnIP = '';
    let currentIP = ip.address();

    if (previousIP === currentIP) {
      // if IP address is different
      let tries = 1; // debugging

      while (previousIP === currentIP) {
        const now = new Date().getTime();
        while (new Date().getTime() < now + 10000) { }

        currentIP = ip.address();


        // debugging
        if (tries > 9) {
          currentIP = '9.66.188.62';
        }
        tries++;
        // end debugging
      }

      previousIP = currentIP;
    }

    const usedIP = await hasIPBeenUsed(currentIP);

    if (usedIP === 0) {
      return currentIP;
    }
    else {
      getFreshIP();
    }
  }
  catch (err) {
    //console.log('getFreshIP err: ', err);
  }
}

async function hasIPBeenUsed(IPAddress) {
  try {
    const IPquery = 'select trackingId from tracking where IPAddress = ?';
    const IPunique = await pool.query(IPquery, [IPAddress]);

    return IPunique.length;
  }
  catch (err) {
    //console.log('hasIPBeenUsed err: ', err);

  }

}

function getAddress() {

  const states = Object.keys(addressData);

  const stateRand = Math.floor(Math.random() * 9);
  let state = '';
  if (stateRand < 6) {
    state = 'NJ';
  }
  else if (stateRand < 8) {
    state = 'NY';
  }
  else {
    state = 'PA';
  }

  const counties = Object.keys(addressData[state]);
  const countyRand = Math.floor(Math.random() * counties.length);
  const county = counties[countyRand];

  const towns = Object.keys(addressData[state][county]);
  const townRand = Math.floor(Math.random() * towns.length);
  const town = towns[townRand];

  const streets = Object.keys(addressData[state][county][town]);
  const streetRand = Math.floor(Math.random() * streets.length);
  let street = streets[streetRand];

  const zip = addressData[state][county][town][street];

  const houseNumber = Math.floor(Math.random() * 300);
  street = houseNumber + ' ' + street;

  return {
    street: street,
    town: town,
    state: state,
    zip: zip
  }
}

function getUserAgent() {
  const userAgents = {
    82: {
      agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36',
      name: 'Chrome 72.0 Win10'
    },
    69: {
      agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36',
      name: 'Chrome 72.0 Win10'
    },
    58: {
      agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:65.0) Gecko/20100101 Firefox/65.0',
      name: 'Firefox Generic Win10'
    },
    49: {
      agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36',
      name: 'Chrome 72.0 Win10'
    },
    43: {
      agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.3 Safari/605.1.15',
      name: 'Safari 12.0 macOS'
    },
    39: {
      agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36',
      name: 'Chrome 72.0 macOS'
    },
    34: {
      agent: 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)', name: 'Chrome/72.0.3626.121 Safari/537.36',
      name: 'Chrome 72.0 Win7'
    },
    31: {
      agent: 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:65.0) Gecko/20100101 Firefox/65.0',
      name: 'Firefox Generic Win7'
    },
    27: {
      agent: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:65.0) Gecko/20100101 Firefox/65.0',
      name: 'Firefox Generic Linux'
    },
    24: {
      agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36',
      name: 'Chrome 72.0 macOS'
    },
    20: {
      agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
      name: 'Chrome 71.0 Win10'
    },
    17: {
      agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/17.17134',
      name: 'Edge 17.0 Win10'
    },
    14: {
      agent: 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.119 Safari/537.36',
      name: 'Chrome 72.0 Win7'
    },
    12: {
      agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36',
      name: 'Chrome 72.0 macOS'
    },
    10: {
      agent: 'Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/60.0',
      name: 'Firefox 60.0 Linux'
    },
    7: {
      agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36',
      name: 'Chrome Generic Win10'
    },
    6: {
      agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:65.0) Gecko/20100101 Firefox/65.0',
      name: 'Firefox Generic MacOSX'
    },
    5: {
      agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/18.17763',
      name: 'Edge 18.0 Win10'
    },
    4: {
      agent: 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36',
      name: 'Chrome 72.0 Win7'
    },
    2: {
      agent: 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko',
      name: 'IE 11.0 for Desktop Win10'
    },
    0: {
      agent: 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko',
      name: 'IE 11.0 for Desktop Win7'
    }

  }
  const chances = [0, 2, 4, 5, 7, 10, 12, 14, 17, 20, 24, 27, 31, 34, 39, 43, 49, 58, 69, 82];

  const chancesLength = chances.length;

  const pick = Math.floor(Math.random() * chancesLength);

  let choice;
  for (let i = 0; i < chancesLength; i++) {
    if (pick <= chances[i]) {
      choice = chances[i]
    }
    if (pick === chances[i]) {
      break;
    }
  }

  return userAgents[choice];
};



async function getAreaCodeInfo() {
  areaCodeInfo = await getAreaCodes();
  return areaCodeInfo;
}

async function getAreaCodes() {
  const areaCodes = await pool.query('select * from areaCodes');

  const numberInfo = {};

  for (let info of areaCodes) {

    const state = info.stateAbbr;
    const town = info.location;
    const areaCode = info.areaCode;
    const prefix = info.prefix;

    if (numberInfo[state] === undefined) {
      numberInfo[state] = {};
    }

    if (numberInfo[state][town] === undefined) {
      numberInfo[state][town] = {};
    }

    if (numberInfo[state][town][areaCode] === undefined) {
      numberInfo[state][town][areaCode] = [];
    }

    numberInfo[state][town][areaCode].push(prefix);

  }

  return numberInfo;

}
