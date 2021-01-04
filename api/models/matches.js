const pool = require('../config/db');
const Promise = require('promise');

function create(data) {
    return new Promise(function (resolve, reject) {
        return pool.query(
            `INSERT INTO users (, 
                bookmaker, 
                game,
                bk_id,
                away,
                home, 
                created_at, 
                start_match,
                value_winner_away,
                value_winner_home,
                calc_winner_odd_away,
                calc_winner_odd_home,
                winner_odd_away,
                winner_odd_home) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
            [
                data.bookmaker, 
                data.game,
                data.bk_id,
                data.away,
                data.home, 
                new Date(), 
                data.start_match,
                data.value_winner_away,
                data.value_winner_home,
                data.calc_winner_odd_away,
                data.calc_winner_odd_home,
                data.winner_odd_away,
                data.winner_odd_home
            ]);  
    })
}