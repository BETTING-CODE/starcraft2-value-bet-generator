const { getAllBetsInBookmakers } = require('../api/myoddsbetAPI')
const { formatNumber, getCashNumber } = require('../api/support')
const { getRatingAndSave } = require('../api/gosuGamers')
const fs = require('fs')


function searchTeam(name, teams) {
    return teams.filter(team => team.teamName.toUpperCase().replace(/\s/g, '').indexOf(name.toUpperCase().replace(/\s/g, '')) !== -1)
}

async function getValueMatches(data) {
    const teams = JSON.parse(fs.readFileSync('./leagueoflegends/ratings.json', 'utf-8'))
    let array = []

    for (let i = 0; i < data.length; i++) {
        const match = data[i]
        const home = match.team1
        const away = match.team2
        const date = match.date

        let eloRatingHome = searchTeam(home, teams)
        let eloRatingAway = searchTeam(away, teams)

        if (eloRatingHome.length > 0 && eloRatingAway.length > 0 && !match.live) {


            eloRatingHome = eloRatingHome[0].eloRanking
            eloRatingAway = eloRatingAway[0].eloRanking

            const dr = eloRatingHome - eloRatingAway
            const W1 = 1 / (Math.pow(10, (-dr / 400)) + 1)
            const W2 = 1 - W1


            for (let j = 0; j < match.events.length; j++) {
                if (match.events[j].name == 'Winner') {
                    const event = match.events[j]
                    for (let k = 0; k < event.bets.length; k++) {

                        const bookmaker = event.bets[k].bookmaker

                        const homeOdd = event.bets[k].odd1
                        const awayOdd = event.bets[k].odd2
                        const margin = (((1 / homeOdd) + (1 / awayOdd)) - 1) / 2

                        const calcHomeOdd = formatNumber(1 / W1 + margin)
                        const calcAwayOdd = formatNumber(1 / W2 + margin)

                        const valueHome = formatNumber(homeOdd * (1 / calcHomeOdd))
                        const valueAway = formatNumber(awayOdd * (1 / calcAwayOdd))

                        array.push({
                            date,
                            bookmaker,
                            home,
                            away,
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
            }
        }
    }

    console.table(array)

}

async function main(testJSON = false, sync = false, game = 'LOL') {

    if (sync) {
        console.log('Запускаем синхронизацию с GosuGamers и выкачиваем рейтинги ' + new Date())
        await getRatingAndSave(10, 'lol', './leagueoflegends/ratings.json')
        console.log('Готово ' + new Date())
    }

    if (testJSON) {
        const data = JSON.parse(fs.readFileSync('./test.json', 'utf-8'))
        getValueMatches(data)
    } else {
        console.log('Забираем коэффициенты от букмекера ' + new Date())
        getAllBetsInBookmakers(game)
            .then(data => {
                getValueMatches(data)
            })
    }
}


module.exports = {
    main
}


