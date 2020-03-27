const url = 'https://buff.bet/api/sportmatch/get?sportID=2357&clientTimezoneOffset=3&page=0&pageSize=999&includeWinnerMapsPreviewMarkets=true&includesOnGoing=false'
const nodeFetch = require('node-fetch')

async function getLine(filterGame) {
    return nodeFetch(url)
    .then(res => res.json())
    .then(res => {
        const data = res.filter(match => match.Category.Name == filterGame)
        let result = { }
        for (const match of data) {
            
            const { ID: id } = match
            const { Tournament } = match
            const { Name: tournamentName, ID: tournamentId } = Tournament
            const home = match.OriginalHomeTeamName
            const away = match.OriginalAwayTeamName

            const { Value: homeOdd } = match.PreviewOdds.find(market => market.Title == home)
            const { Value: awayOdd } = match.PreviewOdds.find(market => market.Title == away) 

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
