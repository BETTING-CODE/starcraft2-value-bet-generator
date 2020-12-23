const fs = require('fs')
const ggbetParser = require('ggbet-parser')
const ggbetURL = 'http://goggbet.com'
const { formatNumber, getCashNumber } = require('../api/support')
const { getRatingAndSave } = require('../api/gosuGamers')

function searchTeam(name, teams) {
    return teams.filter(team => team.teamName.toUpperCase().replace(/\s/g, '').indexOf(name.toUpperCase().replace(/\s/g, '')) !== -1)
}

async function getValueMatches(data) {
    const teams = JSON.parse(fs.readFileSync('./csgo/ratings.json', 'utf-8'))
    let array = []

    for (let i in data) {
        const match = data[i]

        const home = match.home
        const away = match.away
        const homeOdd = match.homeOdd
        const awayOdd = match.awayOdd

        const margin = (((1 / homeOdd) + (1 / awayOdd)) - 1) / 2

        let eloRatingHome = searchTeam(home, teams)
        let eloRatingAway = searchTeam(away, teams)
        if (eloRatingHome.length > 0 && eloRatingAway.length > 0) {
            eloRatingHome = eloRatingHome[0].eloRanking
            eloRatingAway = eloRatingAway[0].eloRanking

            const dr = eloRatingHome - eloRatingAway
            const W1 = 1 / (Math.pow(10, (-dr / 400)) + 1)
            const W2 = 1 - W1

            const calcHomeOdd = formatNumber(1 / W1 + margin)
            const calcAwayOdd = formatNumber(1 / W2 + margin)

            const valueHome = formatNumber(homeOdd * (1 / calcHomeOdd))
            const valueAway = formatNumber(awayOdd * (1 / calcAwayOdd))

            array.push({
                home,
                away,
                eloRatingHome,
                eloRatingAway,
                homeOdd,
                awayOdd,
                calcHomeOdd,
                calcAwayOdd,
                valueHome,
                valueAway,
                bet: valueHome > 1 ? home : valueAway > 1 ? away : '',
                cash: valueHome > 1 ? getCashNumber(homeOdd) : valueAway > 1 ? getCashNumber(awayOdd) : ''
            })
        }

    }

    console.table(array)

}

async function main(testJSON = false, sync = false) {

    if (sync) {
        console.log('Запускаем синхронизацию с GosuGamers и выкачиваем рейтинги ' + new Date())
        await getRatingAndSave(10,'counterstrike', './csgo/ratings.json')
        console.log('Готово ' + new Date())
    }

    
    if (testJSON) {
        const data = JSON.parse(fs.readFileSync('./test.json', 'utf-8'))
        getValueMatches(data)
    } else {
        console.log('Забираем коэффициенты от букмекера ' + new Date())
        const ggbetLine = ggbetParser.getLine('counter-strike', {
            mirrorUrl: ggbetURL
        })
            .then(data => {
                getValueMatches(data)
            })
            .catch(e => console.log(e))
    }
}

module.exports = {
    main
}





