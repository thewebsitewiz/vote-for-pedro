const config = require('../config/common');

var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: config.database.dbHost,
        database: config.database.dbDatabase,
        user: config.database.dbUser,
        password: config.database.dbPassword
    }
});

module.exports = knex;