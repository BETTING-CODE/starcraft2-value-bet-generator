const url = 'https://loot.bet/odds/api/matches?league=00000000-0000-0000-0000-000000000ceb&match_type=1&match_type=2&page=1&items=20'
const nodeFetch = require('node-fetch')

const sportID = '00000000-0000-0000-0000-000000000ceb' //sc2

async function getLine() {
    return nodeFetch(url)
    .then(res => res.json())
    .then(res => {
        const data = res
        let result = { }
        for (const match of data) {
            
            const { Id: id } = match
            const { tournament } = match
            const { Name: tournamentName, Id: tournamentId } = tournament
            const home = match.HomeTeamName
            const away = match.AwayTeamName

            const { Value: homeOdd } = match.top_market[0].odds.find(market => market.Name == home)
            const { Value: awayOdd } = match.top_market[0].odds.find(market => market.Name == away) 

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
    .catch(e => console.log(e))
}

module.exports = {
    getLine
}