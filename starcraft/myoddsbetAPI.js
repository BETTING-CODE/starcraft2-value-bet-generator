const nodeFetch = require('node-fetch')

const url = 'https://myodds.bet/api/public'

function getAllBetsInBookmakers() {
    return nodeFetch(url, {
        headers : {
            Token : 'PCFBS69ZL9SHjm6AsVKMG'
        }
    })
    .then(res => res.json())
    .then(res => {
        return res.filter(r => r.game == 'SC2')
    })
    .catch(e => [])
}

module.exports = {
    getAllBetsInBookmakers
}