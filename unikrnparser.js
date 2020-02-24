const url = 'https://unikrn.com/apiv2/events/current=1/type=1?'
const nodeFetch = require('node-fetch')

async function getLine(filterGame) {
    return nodeFetch(url)
    .then(res => res.json())
    .then(res => {
        return res.data.items.filter(item => item.game_short == filterGame)
    })
}

module.exports = {
    getLine
}