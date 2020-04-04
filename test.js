const nodeFetch = require('node-fetch')
const aligulac_api_key = '996TfcqdZrgcVpNJg0gK'

// function wc3infoApi() {
//     nodeFetch('https://warcraft3.info/api/v1/stats_players/Happy')
//     .then(data => data.json())
//     .then(data => {
//         console.log(data)
//     })
// }

async function searchPlayer(name) {
    return nodeFetch(`http://aligulac.com/search/json/?q=${name}&search_for=players`)
        .then(res => res.json())
        .then(res => res.players[0])
}

const playerID = 49
///api/v1/player/1/

nodeFetch(`http://aligulac.com//api/v1/player/48/?apikey=${aligulac_api_key}`)
.then(res => res.json())
.then(data => console.log(data))

console.log('/*****************/\n')

nodeFetch(`http://aligulac.com//api/v1/player/1793/?apikey=${aligulac_api_key}`)
.then(res => res.json())
.then(data => console.log(data))


async function getPredictMatch(id1, id2) {
    return nodeFetch(`http://aligulac.com/api/v1/predictmatch/${id1},${id2}/?apikey=${aligulac_api_key}&bo=3`)
        .then(res => res.json())
}

getPredictMatch(48, 1793)
.then(data => console.log(data))


/*
innovation 
  form: { P: [ 41, 18 ], T: [ 29, 17 ], Z: [ 38, 19 ], total: [ 108, 54 ] },
race T

TZ - 38/57 - 0.66

solar 
form: { P: [ 50, 19 ], T: [ 22, 27 ], Z: [ 27, 15 ], total: [ 99, 61 ] },
race Z

ZT - 22/49 - 0.44
*/

// sum = 80 + 70
// home = Math.ceil(80 / sum * 100)
// away = Math.floor(70 / sum * 100)
// console.log(home, away)



