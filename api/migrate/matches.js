const pool = require('../config/db');
const Promise = require('promise');

function create_table_matches() {
    return pool.query(
        `CREATE TABLE matches 
        (   
            id SERIAL PRIMARY KEY, 
            bookmaker TEXT, 
            game TEXT,
            bk_id TEXT,
            away TEXT,
            home TEXT, 
            created_at TIMESTAMP, 
            start_match TIMESTAMP,
            value_winner_away FLOAT,
            value_winner_home FLOAT,
            calc_winner_odd_away FLOAT,
            calc_winner_odd_home FLOAT,
            winner_odd_away FLOAT,
            winner_odd_home FLOAT
        ) `, []
    )
}

function drop_table() {
    return pool.query(
        `DROP TABLE matches`, []
    )
}

module.exports = {
    create_table_matches,
    drop_table
}

/*
Таблица матчи должна отвечать за то как меняются коэффициенты и у каких букмекеров и как при этом меняется value
- ид записи
- букмекер
- игра
- дата записи
- дата матча
- противник 1
- противник 2
- коэффициенты на победу 1
- коэффициенты на победу 2
- рассчитанные коэффициенты на победу 1
- рассчитанные коэффициенты на победу 2
- ид букмекера на этот матч
– вэлью противник 1
- вэлью противник 2
*/