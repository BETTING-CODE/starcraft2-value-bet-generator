const url = 'https://unikrn.com/apiv2/events/current=1/type=1?'
const nodeFetch = require('node-fetch')

async function getLine(filterGame) {
    return nodeFetch(url)
    .then(res => res.json())
    .then(res => {
        let data = res.data.items.filter(item => item.game_short == filterGame)
        let result = { }
        for (const match of data) {
            
            const { eid: id } = match
            const { tournament } = match
            const { name: tournamentName, id: tournamentId } = tournament
            const homeId = match.teams[0].id
            const home = match.teams[0].name
            const awayId = match.teams[1].id
            const away = match.teams[1].name

            const { odd: homeOdd } = match.markets.find(market => market.marketname == 'Match Up Winner' && market.team == homeId)
            const { odd: awayOdd } = match.markets.find(market => market.marketname == 'Match Up Winner' && market.team == awayId) 

            result[id] = {
                id,
                tournamentName,
                tournamentId,
                home,
                away,
                homeOdd,
                awayOdd
            }
        }
        return result
    })
}

module.exports = {
    getLine
}