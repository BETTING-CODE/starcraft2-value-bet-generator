const nodeFetch = require('node-fetch')
const unikrn = require('./unikrnparser')

function wc3infoApi() {
    nodeFetch('https://warcraft3.info/api/v1/stats_players/Happy')
    .then(data => data.json())
    .then(data => {
        console.log(data)
    })
}


unikrn
.getLine('sc2')
.then(data => console.log(JSON.stringify(data, null, 2)))
