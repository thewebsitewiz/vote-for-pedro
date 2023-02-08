const rp = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const info = getTowns();



getStreets();



/* ------------ FUNCTIONS --------------- */


function getStreets(url, state, county, town) {
  let output;
  let promises = [];
  for (let state in info) {
    //console.log(state);

    if (state !== 'NY') {
      continue;
    }

    for (let county in info[state]) {
      //console.log('\t',county)

      for (let town of info[state][county]) {

        urlTown = town.replace(/ /g, '_');
        let url = `https://geographic.org/streetview/usa/${state}/${county}/${urlTown}.html`.toLowerCase();

        console.log(url);

        rp(url)
          .then(function (html) {
            //success!

            // console.log(html);

            let $ = cheerio.load(html);

            let results = {};

            $('li a').each(function (i, elem) {

              let street = $(elem).text();

              const re = new RegExp(String.fromCharCode(160), "g");
              let zip = $(elem).parent().text().replace(re, ' ');
              let fullZip = zip.split('   ')[1].padStart(5, '0');

              if (results[state] === undefined) {
                results[state] = {};
              }
              if (results[state][county] === undefined) {
                results[state][county] = {};
              }
              if (results[state][county][town] === undefined) {
                results[state][county][town] = {};
              }
              if (results[state][county][town][street] === undefined) {
                results[state][county][town][street] = fullZip;
              }

              const line = `${state}|${county}|${town}|${street}|${fullZip}\n`;

              console.log(line);

              fs.appendFile(path.join(__dirname, 'results', `${state}-${county}.txt`), line, function (err) {
                if (err) throw err;
              });
            });


          })
          .catch(function (err) {
            console.log('CATCH ERR: ', err)
          });
        wait(1);
      } // Town
    } // County
  } // State
}

function wait(delay) {
  var now = new Date().getTime();
  var millisecondsToWait =  delay * 1000; /* i.e. 1 second */
    while (new Date().getTime() < now + millisecondsToWait) { }
}

function getTowns() {
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

  return info;
}