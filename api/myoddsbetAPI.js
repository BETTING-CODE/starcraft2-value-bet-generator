const nodeFetch = require('node-fetch')

const url = 'https://myodds.bet/api/public'

function getAllBetsInBookmakers(game = 'SC2') {
    return nodeFetch(url, {
        headers : {
            Token : 'PCFBS69ZL9SHjm6AsVKMG'
        }
    })
    .then(res => res.json())
    .then(res => {
        return res.filter(r => r.game == game)
    })
    .catch(e => [])
}

module.exports = {
    getAllBetsInBookmakers
}