const ggbetURL = 'https://gg112.bet'
//актуальный урл, всегда можно найти вот здесь.
//https://vk.com/ggbet_zerkalo
const ggbetParser = require('ggbet-parser')
const fs = require('fs')
const aligulac_api_key = '996TfcqdZrgcVpNJg0gK'
const nodeFetch = require('node-fetch')
const testJSON = false


async function searchPlayer(name) {
    return nodeFetch(`http://aligulac.com/search/json/?q=${name}&search_for=players`)
        .then(res => res.json())
        .then(res => res.players[0])
}

async function getPredictMatch(id1, id2) {
    return nodeFetch(`http://aligulac.com/api/v1/predictmatch/${id1},${id2}/?apikey=${aligulac_api_key}&bo=3`)
        .then(res => res.json())
}

async function getPlayerInfo(id) {
    return nodeFetch(`http://aligulac.com//api/v1/player/${id}/?apikey=${aligulac_api_key}`)
    .then(res => res.json())
}

function getCashNumber(coefficient) {
    let cash = 0
    if (coefficient < 1.5) {
        cash = 150
    } else if (coefficient >= 1.5 && coefficient <= 2.5) {
        cash = 100
    } else if (coefficient > 2.5) {
        cash = 85
    }
    return cash
}

async function getValueMatches(data) {

    let array = []

    for (let i in data) {
        const match = data[i]

        const home = await searchPlayer(match.home) //ищем первого игрока
        const away = await searchPlayer(match.away) //ищем второго игрока
        const odds = await getPredictMatch(home.id, away.id) // получаем предикты в процентах на основе ELO ранкеда

        const margin = (((1/match.homeOdd) + (1/match.awayOdd)) - 1)/ 2 
        //считаем маржинальность ставок, чтобы учесть их в наших рассчетах
        //специально делим на 2 чтобы потом применить к каждому из вероятностей игроков

        const calcHomeOdd = formatNumber(1 / odds.proba + margin) //считаем коэффициент победы с учетом маржи для первого игрока
        const calcAwayOdd = formatNumber(1 / odds.probb + margin) //считаем коэффициент победы с учетом маржи для второго игрока

        const valueHomeGGbet = formatNumber(match.homeOdd * (1 / calcHomeOdd)) //считаем вэлью для первого игрока
        const valueAwayGGbet = formatNumber(match.awayOdd * (1 / calcAwayOdd)) //считам вэлью для второго игрока


        /*

        если вы хотите посчитать математическое ожидание, то стоит обратиться еще и к этой части кода
        const ph1 = 1 / 2
        const ph2 = 1 / 2
        const ph1a = odds.proba
        const ph2a = odds.probb
        const pa = (ph1 * ph1a) + (ph2 * ph2a)
        const pah1 = (ph1 * ph1a) / pa
        const pah2 = (ph2 * ph2a) / pa
        const money = 100

        const winMoneyHomeGGbet = (money * match.homeOdd) - money
        const lose = -money
        const winMoneyAwayGGbet = (money * match.awayOdd) - money

        const mathExHomeGGbet = (winMoneyHomeGGbet * pah1) + (lose * (1 - pah1))
        const mathExAwayGGbet = (winMoneyAwayGGbet * pah2) + (lose * (1 - pah2))

        match.mathExHomeGGbet = formatNumber(mathExHomeGGbet)
        match.mathExAwayGGbet = formatNumber(mathExAwayGGbet)

        */

        array.push({
            tournamentName : (match.tournamentName.length > 15) ? match.tournamentName.slice(0, match.tournamentName.length - 9) : match.tournamentName,
            home : match.home,
            away : match.away,
            homeOdd : match.homeOdd,
            awayOdd : match.awayOdd,
            calcHomeOdd : calcHomeOdd,
            calcAwayOdd : calcAwayOdd,
            valueHomeGGbet : valueHomeGGbet,
            valueAwayGGbet : valueAwayGGbet,
            bet : valueHomeGGbet > 1 ? match.home : valueAwayGGbet > 1 ? match.away : '',
            cash : valueHomeGGbet > 1 ? getCashNumber(match.homeOdd) : valueAwayGGbet > 1 ? getCashNumber(match.awayOdd) : ''
        })
    }

    console.table(array)
}

function formatNumber(num) {
    return Math.round(num * 100) / 100
}


async function main() {
    if (testJSON) {
        const data = JSON.parse(fs.readFileSync('./test.json', 'utf-8'))
        getValueMatches(data)
    } else {
        const ggbetLine = ggbetParser.getLine('starcraft2', {
            mirrorUrl : ggbetURL
        })
        .then(data => {
            console.log(data)
            getValueMatches(data)
        })
        .catch(e => console.log(e))
    }
}

main()




