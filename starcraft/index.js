const ggbetURL = 'http://goggbet.com'
//актуальный урл, всегда можно найти вот здесь.
//https://vk.com/ggbet_zerkalo
const ggbetParser = require('ggbet-parser')
const fs = require('fs')
const aligulac_api_key = '996TfcqdZrgcVpNJg0gK'
const nodeFetch = require('node-fetch')
const { getAllBetsInBookmakers } = require('../api/myoddsbetAPI.js')
const { getCashNumber, formatNumber } = require('../api/support')


async function searchPlayer(name) {
    return nodeFetch(`http://aligulac.com/search/json/?q=${name}&search_for=players`)
        .then(res => res.json())
        .then(res => res.players[0])
}

async function getPredictMatch(id1, id2, bo) {
    return nodeFetch(`http://aligulac.com/api/v1/predictmatch/${id1},${id2}/?apikey=${aligulac_api_key}&bo=${bo}`)
        .then(res => res.json())
}

async function getPlayerInfo(id) {
    return nodeFetch(`http://aligulac.com//api/v1/player/${id}/?apikey=${aligulac_api_key}`)
        .then(res => res.json())
}

async function getValueMatches(data) {

    let array = []

    const otherBookmakersOdds = await getAllBetsInBookmakers()

    function searchOddsWinnerAnotherBookmakers(away, home) {
        let array = []
        for (let i = 0; i < otherBookmakersOdds.length; i++) {
            if ( (otherBookmakersOdds[i].team1 == away && otherBookmakersOdds[i].team2 == home)) {
                for (let j = 0; j < otherBookmakersOdds[i].events.length; j++) {
                    if (otherBookmakersOdds[i].events[j].name == 'Winner' && otherBookmakersOdds[i].events[j].map == 0) {
                        array = otherBookmakersOdds[i].events[j].bets
                    }
                }
            }
        }
        return array
    }

    function calculateValue(homeOdd, awayOdd, proba, probb) {
        const margin = (((1 / homeOdd) + (1 / awayOdd)) - 1) / 2
        //считаем маржинальность ставок, чтобы учесть их в наших рассчетах
        //специально делим на 2 чтобы потом применить к каждому из вероятностей игроков

        const calcHomeOdd = formatNumber(1 / (proba + margin)) //считаем коэффициент победы с учетом маржи для первого игрока
        const calcAwayOdd = formatNumber(1 / (probb + margin)) //считаем коэффициент победы с учетом маржи для второго игрока

        const valueHome = formatNumber(homeOdd * (1 / calcHomeOdd)) //считаем вэлью для первого игрока
        const valueAway = formatNumber(awayOdd * (1 / calcAwayOdd)) //считам вэлью для второго игрока

        return { calcHomeOdd, calcAwayOdd, valueHome, valueAway }
    }

    for (let i in data) {
        const match = data[i]

        const home = await searchPlayer(match.home) //ищем первого игрока
        const away = await searchPlayer(match.away) //ищем второго игрока
        if (typeof home == 'undefined' || typeof away == 'undefined') {

        } else {
            const odds = await getPredictMatch(home.id, away.id, match.bo) // получаем предикты в процентах на основе ELO ранкеда
            const allOdds = searchOddsWinnerAnotherBookmakers(match.home, match.away) //находим матч на других букмекерских конторах и получаем коэффициенты
            const calcValue = calculateValue(match.homeOdd, match.awayOdd, odds.proba, odds.probb)
            
            /*
            for (let i = 0; i < allOdds.length; i++) {
                if (allOdds[i].bookmaker !== 'GG.BET') {
                    const calcValue = calculateValue(allOdds[i].odd1, allOdds[i].odd2, odds.proba, odds.probb)
                    array.push({
                        time: new Date(match.startTime),
                        bo: match.bo,
                        bk: allOdds[i].bookmaker,
                        tournamentName: (match.tournamentName.length > 15) ? match.tournamentName.slice(0, match.tournamentName.length - match.tournamentName.length * 0.5) : match.tournamentName,
                        home: match.home,
                        away: match.away,
                        homeOdd: allOdds[i].odd1,
                        awayOdd: allOdds[i].odd2,
                        calcHome: calcValue.calcHomeOdd,
                        calcAway: calcValue.calcAwayOdd,
                        valueHome: calcValue.valueHome,
                        valueAway: calcValue.valueAway,
                        bet: calcValue.valueHome > 1 ? match.home : calcValue.valueAway > 1 ? match.away : '',
                        cash: calcValue.valueHome > 1 ? getCashNumber(match.homeOdd) : calcValue.valueAway > 1 ? getCashNumber(match.awayOdd) : ''
                    })
                }
            }
            */

            
            array.push({
                time: new Date(match.startTime),
                bo: match.bo,
                bk: 'GGBET',
                tournamentName: (match.tournamentName.length > 15) ? match.tournamentName.slice(0, match.tournamentName.length - match.tournamentName.length * 0.5) : match.tournamentName,
                home: match.home,
                away: match.away,
                homeOdd: match.homeOdd,
                awayOdd: match.awayOdd,
                calcHome: calcValue.calcHomeOdd,
                calcAway: calcValue.calcAwayOdd,
                valueHome: calcValue.valueHome,
                valueAway: calcValue.valueAway,
                bet: calcValue.valueHome > 1 ? match.home : calcValue.valueAway > 1 ? match.away : '',
                cash: calcValue.valueHome > 1 ? getCashNumber(match.homeOdd) : calcValue.valueAway > 1 ? getCashNumber(match.awayOdd) : ''
            })
        }

    }

    console.table(array)
}

async function main(testJSON = false) {
    if (testJSON) {
        const data = JSON.parse(fs.readFileSync('./test.json', 'utf-8'))
        getValueMatches(data)
    } else {
        const ggbetLine = ggbetParser.getLine('starcraft2', {
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




