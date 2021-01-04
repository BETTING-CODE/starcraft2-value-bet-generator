const pg = require('pg');
const Promise = require('promise');

var config = {
    user: 'postgres',
    database: 'bets',
    password: 'йцу123',
    host: 'localhost',
    port: 5432,
    max: 100,
    idleTimeoutMillis: 30000,
};

const pool = new pg.Pool(config);

pool.on('error', function (err, client) {
    console.error('idle client error', err.message, err.stack);
});

module.exports.query = function (text, values) {
    return new Promise(function (resolve, reject) {
        pool.connect(function (err, client, done) {
            client.query(text, values, function (err, result) {
                done();
                if (err) {
                    console.log(text, values)
                    handleErrorMessages(err)
                        .then(function (message) {
                            reject(message);
                        })
                        .catch(function () {
                            reject();
                        });
                }
                else {
                    resolve(result);
                }
            });
        });
    });
};

function handleErrorMessages(err) {
    console.log(err)
    return new Promise(function(resolve, reject) {
      resolve(err);
    });
  }

module.exports.connect = function (callback) {
    return pool.connect(callback);
};