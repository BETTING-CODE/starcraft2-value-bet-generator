const pool = require('../config/db');
const Promise = require('promise');

async function create(data) {
    return new Promise(function (resolve, reject) {
        pool.query('SELECT * FROM ratings WHERE team = $1 AND game = $2', [data.team, data.game])
            .then(function (result) {
                if (result.rows.length == 0) {
                    pool.query(
                        `INSERT INTO ratings ( 
                        game,
                        team,
                        rating
                    ) VALUES ($1, $2, $3)`,
                        [
                            data.game,
                            data.team,
                            data.rating
                        ])
                        .then(result => {
                            resolve(true)
                        })
                        .catch(e => reject(false))
                } else {
                    pool.query(
                        `UPDATE ratings SET rating = $1 WHERE id = $2 returning *`,
                        [
                            data.rating,
                            result.rows[0].id
                        ])
                        .then(result => {
                            resolve(true)
                        })
                        .catch(e => reject(false))
                    }
                })
            .catch(e => {
                reject(false)
            })
    })
}


module.exports = {
    create
}