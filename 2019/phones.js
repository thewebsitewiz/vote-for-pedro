const pool = require('./common/db');

const areaCodeInfo = getAreaCodes();

module.exports.getAreacodeInfo = (gender, count) => {
    return areaCodeInfo;
}


async function getAreaCodes() {
    console.log('p.pre query')
    const areaCodes = await pool.query('select * from areaCodes');

    const numberInfo = {};

    for (let info of areaCodes) {

        const state = info.stateAbbr;
        const town = info.town;
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