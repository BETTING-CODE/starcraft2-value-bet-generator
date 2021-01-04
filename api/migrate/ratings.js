const pool = require('../config/db');
const Promise = require('promise');

function create_table_ratings() {
    return pool.query(
        `CREATE TABLE ratings 
        (   
            id SERIAL PRIMARY KEY, 
            game TEXT,
            team TEXT,
            rating INT
        ) `, []
    )
}

function drop_table() {
    return pool.query(
        `DROP TABLE ratings`, []
    )
}

module.exports = {
    create_table_ratings,
    drop_table
}

/*
Таблица матчи должна отвечать за то как меняются коэффициенты и у каких букмекеров и как при этом меняется value
- ид записи
- команда
- игра
- рейтинг
*/