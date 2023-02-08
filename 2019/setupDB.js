(function () {
    var knex = require('./common/knex');
    var co = require('co');

    var dropTable = co.wrap(function* (table) {
        yield knex.schema.dropTableIfExists(table);
    });

    var tables, dropTables, tracking, areaCodes;

    tables = 'tracking,areaCodes';

    dropTables = tables.split(',');

    setup = co.wrap(function* () {
        // Drop existing tables
        console.log('Dropping existing Tables');
        for (var d of dropTables) {
            console.log("\tdropping " + d);
            yield knex.schema.dropTableIfExists(d);
        }
        console.log('\nDone Dropping Tables\n\n');

        console.log('Creating Tables\n');
        if (1) {
            // tracking
            yield (tracking = knex.schema.createTable('tracking', function (t) {
                t.increments('trackingId');
                t.string('name');
                t.string('phoneNumber');
                t.string('email');
                t.string('userAgent');
                t.string('streetAddress');
                t.string('town');
                t.string('state');
                t.string('zip');
                t.string('votingFor');
                t.string('IPAddress');
                t.timestamps(true, true);
                return console.log('\tcreated tracking');
            }));



            // areaCodes
            yield (areaCodes = knex.schema.createTable('areaCodes', function (t) {
                t.increments('areaCodeId');
                t.string('areaCode', 3);
                t.string('prefix', 3);
                t.string('stateAbbr');
                t.string('location');
                t.string('region');
                t.string('name');
                t.timestamps(true, true);
                return console.log('\tcreated areaCodes');
            }));
        }
    });

    setup().then(function () {
        return console.log('ok');
    })["catch"](function (e) {
        return console.log(e);
    }).then(function () {
        return knex.destroy().then(function () {
            return console.log('closing');
        });
    });
}).call(this);