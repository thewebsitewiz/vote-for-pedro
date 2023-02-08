const puppeteer = require('puppeteer');
const $ = require('cheerio');


const fs = require('fs');
const path = require('path');

const pool = require('./common/db');

const people = require('./names');
const street = require('./readStreets');

const addressData = street.getStreetData();

let areaCodeInfo = {};

const small = 2973;
const large = 9318;


const typingSpeed = 100;


const url = 'https://embed-571111.secondstreetapp.com/embed/74968032-d1d5-4060-8466-d432806ee148/gallery';

let person;


(async () => {
  try {

    let categorySelected;
    let votingFor;
    let IPAddress;

    process.argv.forEach(function (val, index, array) {
      const argPieces = val.split('=');
      if (argPieces[0] === 'category') {
        categorySelected = argPieces[1].replace(/-/g, ' ');
      }

      if (argPieces[0] === 'votingFor') {
        votingFor = argPieces[1].replace(/-/g, ' ');
      }

      if (argPieces[0] === 'ipAddress') {
        IPAddress = argPieces[1].replace(/-/g, ' ');
      }
    });


    /* IPAddress = '103.25.56.109';
    categorySelected = 'Best Photography Business';
    votingFor = 'Will Blochinger Photography'; */

    console.log('args: ', categorySelected, votingFor, IPAddress);

    person = getPerson();

    // dont want to actually do anything
    // process.exit(0);

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const override = Object.assign(page.viewport(), { height: 1600, width: 1366 });
    await page.setViewport(override);

    await page.setUserAgent(person.userAgent.agent);

    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 300000
    });
    page.setDefaultTimeout(0);
    await page.waitForSelector('.ssUGCGallery');

    console.log('page loaded')
    let pCatId;

    const targetCategories = await page.$$('div.gallery-display--ballot.gallery-display.collapsed');
    for (let targetCategory of targetCategories) {
      const oHtmlCat = await page.evaluate(el => el.outerHTML, targetCategory);
      const categoryRegEx = new RegExp(/<a.*?>(.*)<\/a>/);
      const category = categoryRegEx.exec(oHtmlCat);

      if (category[1] === categorySelected) {

        const categoryIdRegEx = new RegExp(/^<div id="(.*?)"/);
        const categoryId = categoryIdRegEx.exec(oHtmlCat);
        pCatId = categoryId[1];
        console.log('getting category toggle');

        const sel = `div#${categoryId[1]} div.category-toggle`;
        console.log(sel);

        const categoryToggle = await page.$(sel);
        console.log('got category toggle')
        await categoryToggle.click();
        console.log('clicked category toggle');

        break;
      }

    }

    const entrantsSel = `div#${pCatId} div.ballot-showcase div.all-entrants div.ballots-entrants-list-display .material-list .collapsed.ember-view`;

    const entrants = await page.$$(`${entrantsSel}`);

    let showcaseId;
    for (let entrant of entrants) {

      const oHtmlEntrant = await page.evaluate(el => el.outerHTML, entrant);

      const businessRegEx = new RegExp(/<span data-test="entrant-name">(.*?)<\/span>/);
      const businessInfo = businessRegEx.exec(oHtmlEntrant);
      businessName = businessInfo[1];

      if (businessName === votingFor) {

        const idRegEx = new RegExp(/^<expansion-panel id="ember(.*?)"/);
        const idInfo = idRegEx.exec(oHtmlEntrant);
        showcaseId = parseInt(idInfo[1], 10);

        break;
      }
    }


    // <button class="ssButton ssButtonPrimary vote-button vote " data-ember-action="" data-ember-action-2068="2068">
    showcaseId += 5;

    console.log('got vote button: ', showcaseId)
    const voteButton = await page.$(`button[data-ember-action-${showcaseId}]`);
    await voteButton.click();
    console.log('clicked vote button');


    await page.waitForSelector('.ssRegistrationField');

    const catWithForm = await page.$('div.ssTileContent');

    const catWithFormHTML = await page.evaluate(el => el.outerHTML, catWithForm);
    showHTML(catWithFormHTML);

    ssFormIdRegEx = new RegExp(/.*?<ss-form id="(.*?)"/);
    const ssFormIdInfo = ssFormIdRegEx.exec(catWithFormHTML);
    ssFormId = ssFormIdInfo[1];

    ssFormPageIdRegEx = new RegExp(/.*?<ss-form-page id="(.*?)"/);
    const ssFormPageIdInfo = ssFormPageIdRegEx.exec(catWithFormHTML);
    ssFormPageId = ssFormPageIdInfo[1];



    inputIdRegEx = new RegExp(/.*?<input.*?id="(.*?)"/);
    const inputIdInfo = inputIdRegEx.exec(catWithFormHTML);
    inputId = inputIdInfo[1];

    // await page.$eval(`#${inputId}`, (el, value) => el.value = value, person.email);
    await page.type(`#${inputId}`, person.email, { delay: typingSpeed });

    const continueButtonSel = `div.ssTileContent #${ssFormId} #${ssFormPageId} form button`;
    const continueButton = await page.$(continueButtonSel);
    await continueButton.click();

    await page.waitForSelector('div.form-user a.ssStartFormOver');
    const registerForm = await page.$('.ssTile');
    const registerFormHTML = await page.evaluate(el => el.outerHTML, registerForm);
    // showHTML(registerFormHTML)

    await page.type('#ember3112', person.firstName, { delay: typingSpeed });
    await page.type('#ember3115', person.lastName, { delay: typingSpeed });
    await page.type('#ember3118', person.phone, { delay: typingSpeed });
    await page.type('#ember3121', person.address.zip, { delay: typingSpeed });

    // const submitButton = await page.$x('//button[text()="Submit"]');
    const [button] = await page.$x("//button[contains(., 'Submit')]");
    if (button) {
      console.log('Clicking Submit');
      await button.click();
    }
    else {
      console.log('No Submit Found');
    }

    await page.waitFor(2000);
    await browser.close();


    // await addTrackingInfo(votingFor, person, IPAddress);


    process.exit(0);
  }
  catch (err) {
    console.log('ERROR: ', err);
    process.exit(1);
  }
})();





async function addTrackingInfo(votingFor, person, IPAddress) {
  try {
    const values = [
      `${person.firstName} ${person.lastName}`,
      `${person.email}`,
      `${person.phone}`,
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
    console.log('tracking err: ', err);
  }

}

function getPerson() {
  try {
    let person = {};

    person = people.getName('any');

    /* let personUnique = 0;
    while (personUnique === 0) {

        console.log('2: ', personUnique);
        // get person
        //      first name
        //      last name


        //  is person uinque
        const uniquePerson = `select trackingId from tracking where name = '${person.firstName} ${person.lastName}'`;

        const uniquePersonResults = await pool.query(uniquePerson);
        console.log('3: ');
        if (uniquePersonResults.length === 0) {
            personUnique = 1;
        }
    } */
    //      email address
    const emailDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'verizon.net', 'earthlink.net', 'outlook.com', 'optimum.net'];

    const emailType = Math.floor(Math.random() * 2);

    let emailAddress = '';
    emailType === 0 ? emailAddress = person.firstName.substr(0, 1) + person.lastName : emailAddress = `${person.firstName}.${person.lastName}`;

    const domain = emailDomains[Math.floor(Math.random() * 7)];

    person.email = `${emailAddress.toLowerCase()}@${domain}`;

    //person.email = `${emailAddress.toLowerCase()}@gmail.com`;


    // user agent
    person.userAgent = getUserAgent();

    // city, state, zip
    person.address = getAddress();

    const state = person.address.state;
    const town = person.address.town;

    const areaCodes = [201, 212, 215, 223, 267, 272, 315, 332, 347, 412, 445, 484, 516, 518, 551, 570, 585, 607, 609, 610, 631, 640, 646, 680, 716, 717, 718, 724, 732, 814, 838, 845, 848, 856, 862, 878, 908, 914, 917, 929, 934, 973]
    const areaCode = areaCodes[Math.floor(Math.random() * 42)];

    const prefix = Math.floor((Math.random() * (989 - 257 + 1) + 257));


    const number = Math.floor((Math.random() * (8567 - 3487 + 1) + 3487));

    person.phone = `${areaCode}-${prefix}-${number}`;   //getPhoneNumber(state, town);

    return person;
  }
  catch (err) {
    console.log('get person err: ', err);
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






function showHTML(html) {
  /*
  console.log('******************************');
  console.log('******************************');
  console.log(html);
  console.log('******************************');
  console.log('******************************'); */
}

// Normalizing the text
function getText(linkText) {
  linkText = linkText.replace(/\r\n|\r/g, "\n");
  linkText = linkText.replace(/\ +/g, " ");

  // Replace &nbsp; with a space
  var nbspPattern = new RegExp(String.fromCharCode(160), "g");
  return linkText.replace(nbspPattern, " ");
}

// find the link, by going over all links on the page
async function findByLink(page, linkString) {
  const links = await page.$$('a')
  for (var i = 0; i < links.length; i++) {
    let valueHandle = await links[i].getProperty('innerText');

    let id = await links[i].getProperty('id');
    let linkText = await valueHandle.jsonValue();
    const text = getText(linkText);
    if (linkString == text) {
      //console.log(linkString);
      //console.log(text);
      //console.log("Found");
      //console.log(links[i].getAttribute('id'))
      console.log('id: ', id);
      return links[i];
    }
  }
  return null;
}