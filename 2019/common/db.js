const config = require('../config/common');
const util = require('util');
const mysql = require('mysql');


//DB Connection

const pool = mysql.createPool({
    connectionLimit: config.database.dbConnectionLimit,
    host: config.database.dbHost,
    database: config.database.dbDatabase,
    user: config.database.dbUser,
    password: config.database.dbPassword
});

pool.query = util.promisify(pool.query);


module.exports = pool;