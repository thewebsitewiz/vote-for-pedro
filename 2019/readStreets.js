const fs = require('fs');
const path = require('path');

module.exports.getStreetData = () => {
  let values = {};

  const files = fs.readdirSync(path.join(__dirname, 'results'));
  const numberOfFiles = files.length;

  for (let i = 1; i < numberOfFiles; i++) {
    const contents = fs.readFileSync(path.join(__dirname, 'results', files[i]), 'utf-8');

    const lines = contents.split('\n');
    const numberOfLines = lines.length;

    for (let y = 0; y < numberOfLines; y++) {
      const pieces = lines[y].split('|');

      const state = pieces[0];

      if (state === '') {
        continue;
      }
      const county = pieces[1];
      const town = pieces[2];
      const street = pieces[3];
      const zip = pieces[4];

      if (values[state] === undefined) {
        values[state] = {};
      }
      if (values[state][county] === undefined) {
        values[state][county] = {};
      }
      if (values[state][county][town] === undefined) {
        values[state][county][town] = {};
      }

      values[state][county][town][street] = zip;

    }
  }




  return values;

}


