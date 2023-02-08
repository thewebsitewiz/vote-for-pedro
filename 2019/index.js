/* const rp = require('request-promise');
const $ = require('cheerio');
const url = 'https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States';

rp(url)
  .then(function (html) {
    //success!
    const numberOfPresidents = $('big > a', html).length;
    const wikiUrls = [];
    for (let i = 0 ; i < numberOfPresidents ; i++) {
      wikiUrls.push($('big > a', html)[i].attribs.href);
    }
    console.log(wikiUrls);
  })
  .catch(function (err) {
    //handle error
  });
 */


/* const rp = require('request-promise');
const url = 'https://www.reddit.com';

rp(url)
  .then(function(html){
    //success!
    console.log(html);
  })
  .catch(function(err){
    //handle error
  }); */


const puppeteer = require('puppeteer');
const $ = require('cheerio');
const url = 'https://www.reddit.com';


puppeteer
  .launch()
  .then(function(browser) {
    console.log('A');
    return browser.newPage();
  })
  .then(function(page) {
    console.log('B');
    return page.goto(url).then(function() {

    console.log('C');
      return page.content();
    });
  })
  .then(function(html) {

    console.log('D');
    $('h2', html).each(function() {
      console.log($(this).text());
    });
  })
  .catch(function(err) {

    console.log('Err');
    //handle error
  }); 