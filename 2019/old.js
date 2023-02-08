const puppeteer = require('puppeteer');
const $ = require('cheerio');
const ip = require('ip');

const pool = require('./common/db');

const people = require('./names');
const street = require('./readStreets');

const addressData = street.getStreetData();

const votingFor = 'Will Blochinger';

// Define IPAddress variable
let currentIP = '';

let count = 0;
console.log('begin: ', count);

// Start Loop
do {

  let uniqueIP = 0;

  console.log('loop: ', count);

  while (uniqueIP === 0) {

    // check local ip address
    let checkIP = ip.address();


    console.log('checkIP: ', checkIP);

    //    check if IP address is different
    while (checkIP === currentIP) {
      // if no then wait and keep checking every 5 seconds
      const now = new Date().getTime();
      while (new Date().getTime() < now + 5000) { }

      checkIP = ip.address();
      console.log('\tnew checkIP', checkIP);
    }

    currentIP = checkIP;

    const IPquery = 'select trackingId from tracking where IPAddress = ?';
    const IPunique = pool.query(IPquery, [currentIP]);


    console.log('IPunique: ', IPunique);

    if (IPunique.length < 1) {
      uniqueIP = 1;
    }

  }


  // get person -- get person should check for uniqueness
  let person = getPerson();
  console.log(person);


  // get Form page

  // parse form page

  // create post object

  // submit "Form" object

  // get confirmation & log results in DB


  const values = [
    `${person.firstName} ${person.lastName}`,
    `${person.email}`,
    `${person.userAgent}`,
    `${person.address.street}`,
    `${person.address.town}`,
    `${person.address.state}`,
    `${person.address.zip}`,
    votingFor,
    currentIP
  ];

  const logEntry = `
  insert into tracking
  (name,email,userAgent,streetAddress,town,state,zip,votingFor,IPAddress)
  values
  (?,?,?,?,?,?,?,?,?)
  `;

  const trackingResults = pool.query(logEntry, values);
  console.log('tracking: ', trackingResults.insertId);

  count++;
}
while (1);


/* --------- FUNCTIONS ------------ */


function getPerson() {
  let person = {};

  let personUnique = 0;
  while (personUnique === 0) {
    // get person
    //      first name
    //      last name
    person = people.getName('any');

    //  is person uinque
    const uniquePerson = `select trackingId from tracking where name = '${person.firstName} ${person.lastName}'`;

    const addPaymentResults = pool.query(uniquePerson);

    if (addPaymentResults.length > 0) {
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

  return person;
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

  const houseNumber = Math.floor(Math.random() * 300);
  street = houseNumber + ' ' + street;

  const zip = addressData[state][county][town][street];

  // console.log(state, county, town, street, zip);

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

function getCityStateZip() {
  const info = {
    NJ: {
      Sussex: ['Andover',
        'Augusta',
        'Branchville',
        'Franklin',
        'Glasser',
        'Glenwood',
        'Greendell',
        'Hamburg',
        'Highland Lakes',
        'Hopatcong',
        'Lafayette',
        'Layton',
        'Mc Afee',
        'Middleville',
        'Montague',
        'Newton',
        'Ogdensburg',
        'Sparta',
        'Stanhope',
        'Stillwater',
        'Stockholm',
        'Sussex',
        'Swartswood',
        'Tranquility',
        'Vernon',
        'Wallpack Center'],
      Bergen: ['Allendale',
        'Alpine',
        'Bergenfield',
        'Bogota',
        'Carlstadt',
        'Cliffside Park',
        'Closter',
        'Cresskill',
        'Demarest',
        'Dumont',
        'East Rutherford',
        'Edgewater',
        'Elmwood Park',
        'Emerson',
        'Englewood',
        'Englewood Cliffs',
        'Fair Lawn',
        'Fairview',
        'Fort Lee',
        'Franklin Lakes',
        'Garfield',
        'Glen Rock',
        'Hackensack',
        'Harrington Park',
        'Hasbrouck Heights',
        'Haworth',
        'Hillsdale',
        'Ho Ho Kus',
        'Leonia',
        'Little Ferry',
        'Lodi',
        'Lyndhurst',
        'Mahwah',
        'Maywood',
        'Midland Park',
        'Montvale',
        'Moonachie',
        'New Milford',
        'North Arlington',
        'Northvale',
        'Norwood',
        'Oakland',
        'Oradell',
        'Palisades Park',
        'Paramus',
        'Park Ridge',
        'Ramsey',
        'Ridgefield',
        'Ridgefield Park',
        'Ridgewood',
        'River Edge',
        'Rochelle Park',
        'Rutherford',
        'Saddle Brook',
        'Saddle River',
        'South Hackensack',
        'Teaneck',
        'Tenafly',
        'Teterboro',
        'Township of Washington',
        'Waldwick',
        'Wallington',
        'Westwood',
        'Wood Ridge',
        'Woodcliff Lake',
        'Wyckoff'
      ],
      Warren: ['Allamuchy',
        'Belvidere',
        'Blairstown',
        'Broadway',
        'Buttzville',
        'Changewater',
        'Columbia',
        'Delaware',
        'Great Meadows',
        'Hackettstown',
        'Hope',
        'Johnsonburg',
        'Oxford',
        'Phillipsburg',
        'Port Murray',
        'Stewartsville',
        'Vienna',
        'Washington',
      ],
      Morris: ['Boonton',
        'Brookside',
        'Budd Lake',
        'Butler',
        'Cedar Knolls',
        'Chatham',
        'Chester',
        'Convent Station',
        'Denville',
        'Dover',
        'East Hanover',
        'Flanders',
        'Florham Park',
        'Gillette',
        'Green Village',
        'Hibernia',
        'Ironia',
        'Kenvil',
        'Lake Hiawatha',
        'Lake Hopatcong',
        'Landing',
        'Ledgewood',
        'Lincoln Park',
        'Long Valley',
        'Madison',
        'Mendham',
        'Millington',
        'Mine Hill',
        'Montville',
        'Morris Plains',
        'Morristown',
        'Mount Arlington',
        'Mount Freedom',
        'Mount Tabor',
        'Mountain Lakes',
        'Netcong',
        'New Vernon',
        'Parsippany',
        'Pequannock',
        'Picatinny Arsenal',
        'Pine Brook',
        'Pompton Plains',
        'Randolph',
        'Riverdale',
        'Rockaway',
        'Schooleys Mountain',
        'Stirling',
        'Succasunna',
        'Towaco',
        'Wharton',
        'Whippany'
      ],
      Hunterdon: ['Annandale',
        'Asbury',
        'Baptistown',
        'Bloomsbury',
        'Califon',
        'Clinton',
        'Flemington',
        'Frenchtown',
        'Glen Gardner',
        'Hampton',
        'High Bridge',
        'Lambertville',
        'Lebanon',
        'Milford',
        'Oldwick',
        'Pittstown',
        'Pottersville',
        'Quakertown',
        'Readington',
        'Ringoes',
        'Rosemont',
        'Sergeantsville',
        'Stanton',
        'Stockton',
        'Three Bridges',
        'Whitehouse',
        'Whitehouse Station'
      ],
      Somerset: ['Basking Ridge',
        'Bedminster',
        'Belle Mead',
        'Bernardsville',
        'Blawenburg',
        'Bound Brook',
        'Bridgewater',
        'Far Hills',
        'Flagtown',
        'Franklin Park',
        'Gladstone',
        'Hillsborough',
        'Kingston',
        'Liberty Corner',
        'Lyons',
        'Manville',
        'Martinsville',
        'Neshanic Station',
        'Peapack',
        'Raritan',
        'Rocky Hill',
        'Skillman',
        'Somerset',
        'Somerville',
        'South Bound Brook',
        'Warren',
        'Watchung'
      ],
      Union: ['Berkeley Heights',
        'Clark',
        'Cranford',
        'Elizabeth',
        'Elizabethport',
        'Fanwood',
        'Garwood',
        'Hillside',
        'Kenilworth',
        'Linden',
        'Mountainside',
        'New Providence',
        'Plainfield',
        'Rahway',
        'Roselle',
        'Roselle Park',
        'Scotch Plains',
        'Springfield',
        'Summit',
        'Union',
        'Vauxhall',
        'Westfield'
      ],
      Hudson: ['Bayonne',
        'Harrison',
        'Hoboken',
        'Jersey City',
        'Kearny',
        'North Bergen',
        'Secaucus',
        'Union City',
        'Weehawken',
        'West New York'
      ],
      Middlesex: ['Avenel',
        'Carteret',
        'Colonia',
        'Cranbury',
        'Dayton',
        'Dunellen',
        'East Brunswick',
        'Edison',
        'Fords',
        'Helmetta',
        'Highland Park',
        'Iselin',
        'Keasbey',
        'Kendall Park',
        'Metuchen',
        'Middlesex',
        'Milltown',
        'Monmouth Junction',
        'Monroe Township',
        'New Brunswick',
        'North Brunswick',
        'Old Bridge',
        'Parlin',
        'Perth Amboy',
        'Piscataway',
        'Plainsboro',
        'Port Reading',
        'Sayreville',
        'Sewaren',
        'South Amboy',
        'South Plainfield',
        'South River',
        'Spotswood',
        'Woodbridge'
      ],
      Mercer: ['Hightstown',
        'Hopewell',
        'Lawrence Township',
        'Pennington',
        'Princeton',
        'Princeton Junction',
        'Titusville',
        'Trenton',
        'Windsor'
      ],
      Essex: ['Belleville',
        'Bloomfield',
        'Caldwell',
        'Cedar Grove',
        'East Orange',
        'Essex Fells',
        'Fairfield',
        'Glen Ridge',
        'Irvington',
        'Livingston',
        'Maplewood',
        'Millburn',
        'Montclair',
        'Newark',
        'Nutley',
        'Orange',
        'Roseland',
        'Short Hills',
        'South Orange',
        'Verona',
        'West Orange'
      ]
    },
    PA: {
      Lackawanna: ['Archbald',
        'Carbondale',
        'Chinchilla',
        'Clarks Summit',
        'Dalton',
        'Elmhurst',
        'Fleetville',
        'Jermyn',
        'Jessup',
        'La Plume',
        'Moosic',
        'Moscow',
        'Old Forge',
        'Olyphant',
        'Peckville',
        'Ransom',
        'Scranton',
        'Taylor',
        'Waverly'
      ],
      Monroe: ['Analomink',
        'Bartonsville',
        'Blakeslee',
        'Brodheadsville',
        'Buck Hill Falls',
        'Canadensis',
        'Cresco',
        'Delaware Water Gap',
        'East Stroudsburg',
        'Effort',
        'Gilbert',
        'Henryville',
        'Kresgeville',
        'Kunkletown',
        'Long Pond',
        'Marshalls Creek',
        'Minisink Hills',
        'Mount Pocono',
        'Mountainhome',
        'Pocono Lake',
        'Pocono Manor',
        'Pocono Pines',
        'Pocono Summit',
        'Reeders',
        'Saylorsburg',
        'Sciota',
        'Scotrun',
        'Shawnee On Delaware',
        'Skytop',
        'Stroudsburg',
        'Swiftwater',
        'Tannersville',
        'Tobyhanna'

      ],
      Northhampton: ['Bangor',
        'Bath',
        'Bethlehem',
        'Cherryville',
        'Danielsville',
        'Easton',
        'Hellertown',
        'Martins Creek',
        'Mount Bethel',
        'Nazareth',
        'Northampton',
        'Pen Argyl',
        'Portland',
        'Stockertown',
        'Tatamy',
        'Treichlers',
        'Walnutport',
        'Wind Gap'
      ],
      Pike: ['Bushkill',
        'Dingmans Ferry',
        'Greeley',
        'Greentown',
        'Hawley',
        'Lackawaxen',
        'Matamoras',
        'Milford',
        'Millrift',
        'Paupack',
        'Rowland',
        'Shohola',
        'Tafton',
        'Tamiment'
      ],
      Susquenna: ['Brackney',
        'Brooklyn',
        'Clifford',
        'Dimock',
        'Forest City',
        'Friendsville',
        'Gibson',
        'Great Bend',
        'Hallstead',
        'Harford',
        'Herrick Center',
        'Hop Bottom',
        'Jackson',
        'Kingsley',
        'Lanesboro',
        'Lawton',
        'Lenoxville',
        'Little Meadows',
        'Montrose',
        'New Milford',
        'South Gibson',
        'South Montrose',
        'Springville',
        'Susquehanna',
        'Thompson',
        'Union Dale'
      ],
      Wayne: ['Beach Lake',
        'Damascus',
        'Equinunk',
        'Gouldsboro',
        'Hamlin',
        'Honesdale',
        'Lake Ariel',
        'Lake Como',
        'Lakeville',
        'Lakewood',
        'Milanville',
        'Newfoundland',
        'Orson',
        'Pleasant Mount',
        'Poyntelle',
        'Preston Park',
        'Prompton',
        'South Canaan',
        'South Sterling',
        'Starlight',
        'Starrucca',
        'Sterling',
        'Tyler Hill',
        'Waymart',
        'White Mills'
      ]
    },
    NY: {
      Bronx: ['Bronx'],
      Kings: ['Brooklyn'],
      'New York': ['New York'],
      Orange: ['Arden',
        'Bellvale',
        'Blooming Grove',
        'Bullville',
        'Campbell Hall',
        'Central Valley',
        'Chester',
        'Circleville',
        'Cornwall',
        'Cornwall On Hudson',
        'Cuddebackville',
        'Florida',
        'Fort Montgomery',
        'Goshen',
        'Greenwood Lake',
        'Harriman',
        'Highland Falls',
        'Highland Mills',
        'Howells',
        'Huguenot',
        'Johnson',
        'Maybrook',
        'Middletown',
        'Monroe',
        'Montgomery',
        'Mountainville',
        'New Hampton',
        'New Milford',
        'New Windsor',
        'Newburgh',
        'Otisville',
        'Pine Bush',
        'Pine Island',
        'Port Jervis',
        'Rock Tavern',
        'Salisbury Mills',
        'Slate Hill',
        'Southfields',
        'Sparrow Bush',
        'Sterling Forest',
        'Sugar Loaf',
        'Thompson Ridge',
        'Tuxedo Park',
        'Unionville',
        'Vails Gate',
        'Walden',
        'Warwick',
        'Washingtonville',
        'West Point',
        'Westtown'
      ],
      Queens: ['Arverne',
        'Astoria',
        'Bayside',
        'Bellerose',
        'Breezy Point',
        'Cambria Heights',
        'College Point',
        'Corona',
        'East Elmhurst',
        'Elmhurst',
        'Far Rockaway',
        'Floral Park',
        'Flushing',
        'Forest Hills',
        'Fresh Meadows',
        'Glen Oaks',
        'Hollis',
        'Howard Beach',
        'Jackson Heights',
        'Jamaica',
        'Kew Gardens',
        'Little Neck',
        'Long Island City',
        'Maspeth',
        'Middle Village',
        'Oakland Gardens',
        'Ozone Park',
        'Queens Village',
        'Rego Park',
        'Richmond Hill',
        'Ridgewood',
        'Rockaway Park',
        'Rosedale',
        'Saint Albans',
        'South Ozone Park',
        'South Richmond Hill',
        'Springfield Gardens',
        'Sunnyside',
        'Whitestone',
        'Woodhaven',
        'Woodside'
      ],
      Richmond: ['Staten Island'],
      Rockland: ['Bear Mountain',
        'Blauvelt',
        'Congers',
        'Garnerville',
        'Haverstraw',
        'Hillburn',
        'Monsey',
        'Nanuet',
        'New City',
        'Nyack',
        'Orangeburg',
        'Palisades',
        'Pearl River',
        'Piermont',
        'Pomona',
        'Sloatsburg',
        'Sparkill',
        'Spring Valley',
        'Stony Point',
        'Suffern',
        'Tallman',
        'Tappan',
        'Thiells',
        'Tomkins Cove',
        'Valley Cottage',
        'West Haverstraw',
        'West Nyack'
      ],
      Sullivan: ['Barryville',
        'Bethel',
        'Bloomingburg',
        'Burlingham',
        'Callicoon',
        'Callicoon Center',
        'Claryville',
        'Cochecton',
        'Cochecton Center',
        'Eldred',
        'Fallsburg',
        'Ferndale',
        'Forestburgh',
        'Fremont Center',
        'Glen Spey',
        'Glen Wild',
        'Grahamsville',
        'Hankins',
        'Harris',
        'Highland Lake',
        'Hortonville',
        'Hurleyville',
        'Jeffersonville',
        'Kauneonga Lake',
        'Kenoza Lake',
        'Kiamesha Lake',
        'Lake Huntington',
        'Liberty',
        'Livingston Manor',
        'Loch Sheldrake',
        'Long Eddy',
        'Mongaup Valley',
        'Monticello',
        'Mountain Dale',
        'Narrowsburg',
        'Neversink',
        'North Branch',
        'Obernburg',
        'Parksville',
        'Phillipsport',
        'Pond Eddy',
        'Rock Hill',
        'Roscoe',
        'Smallwood',
        'South Fallsburg',
        'Summitville',
        'Swan Lake',
        'Thompsonville',
        'Westbrookville',
        'White Lake',
        'White Sulphur Springs',
        'Woodbourne',
        'Woodridge',
        'Wurtsboro',
        'Youngsville',
        'Yulan'
      ],
      Westchester: ['Amawalk',
        'Ardsley',
        'Ardsley On Hudson',
        'Armonk',
        'Baldwin Place',
        'Bedford',
        'Bedford Hills',
        'Briarcliff Manor',
        'Bronxville',
        'Buchanan',
        'Chappaqua',
        'Cortlandt Manor',
        'Crompond',
        'Cross River',
        'Croton Falls',
        'Croton On Hudson',
        'Dobbs Ferry',
        'Eastchester',
        'Elmsford',
        'Goldens Bridge',
        'Granite Springs',
        'Harrison',
        'Hartsdale',
        'Hastings On Hudson',
        'Hawthorne',
        'Irvington',
        'Jefferson Valley',
        'Katonah',
        'Larchmont',
        'Lincolndale',
        'Mamaroneck',
        'Maryknoll',
        'Millwood',
        'Mohegan Lake',
        'Montrose',
        'Mount Kisco',
        'Mount Vernon',
        'New Rochelle',
        'North Salem',
        'Ossining',
        'Peekskill',
        'Pelham',
        'Pleasantville',
        'Port Chester',
        'Pound Ridge',
        'Purchase',
        'Purdys',
        'Rye',
        'Scarsdale',
        'Shenorock',
        'Shrub Oak',
        'Somers',
        'South Salem',
        'Tarrytown',
        'Thornwood',
        'Tuckahoe',
        'Valhalla',
        'Verplanck',
        'Waccabuc',
        'West Harrison',
        'White Plains',
        'Yonkers',
        'Yorktown Heights'
      ],
    }

  }
}
