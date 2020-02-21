const fs = require('fs')
const sc2 = require('ggbet-parser')
const aligulac_api_key = '996TfcqdZrgcVpNJg0gK'
const nodeFetch = require('node-fetch')
const money = 100

async function searchPlayer(name) {
    return nodeFetch(`http://aligulac.com/search/json/?q=${name}&search_for=players`)
        .then(res => res.json())
        .then(res => res.players[0])
}

async function getPredictMatch(id1, id2) {
    return nodeFetch(`http://aligulac.com/api/v1/predictmatch/${id1},${id2}/?apikey=${aligulac_api_key}&bo=3`)
        .then(res => res.json())
}

function formatNumber(num) {
    return Math.round(num * 100) / 100
}

function generateLinkForBet(match) {
    //example link - https://gg22.bet/ru/betting/match/heromarine-vs-awers-24-02
    const date = new Date(match.startTime)
    const month = ('0' + (date.getMonth() + 1)).slice(-2)
    const day = ('0' + date.getDate()).slice(-2)
    return `https://gg22.bet/ru/betting/match/${match.home.replace(' ', '-').toLowerCase()}-vs-${match.away.replace(' ', '-').toLowerCase()}-${day}-${month}`
}

function generateHtml(sc2line) {

    let html = `
    <html>
        <head>
            <title>Starcraft2 value bet scanner</title> 
        </head>
        <style>
            body {
                margin: 0;
                padding: 10px;
                box-sizing: border-box;
                background-color: #13171d;
                color: #fff;
                font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Open Sans,Helvetica Neue,sans-serif;
            }

            p {
                font-weight: 600;
            }

            table {
                width: 100%;
            }

            td, th {
                padding: 8px;
                background-color: #202731;
            }
            
            .active {
                background: linear-gradient(to bottom, #74ad5a 5%, #68a54b 100%);;
                color: #fff;
                padding : 5px;
            }

            .calc_info {
                font-size: 12px;
            }

            .calc_info p {
                margin: 3px 0px;
            }

            .bet {
                box-shadow:inset 0px 1px 0px 0px #9acc85;
                background:linear-gradient(to bottom, #74ad5a 5%, #68a54b 100%);
                background-color:#74ad5a;
                border:1px solid #3b6e22;
                display:inline-block;
                cursor:pointer;
                color:#ffffff;
                font-family:Arial;
                font-size:13px;
                font-weight:bold;
                padding:6px 12px;
                text-decoration:none;
                margin-top: 5px;
            }
            .bet:hover {
                background:linear-gradient(to bottom, #68a54b 5%, #74ad5a 100%);
	            background-color:#68a54b;
            }
            .bet:active {
                position:relative;
	            top:1px;
            }
            
        </style>
    <body>
    `
    let table = `<table>
        <tbody>`


    for (const match of Object.values(sc2line)) {
        if ((match.valueHome > 1 && match.mathExHome > 0) || (match.valueAway > 1 && match.mathExAway > 0)) {
            table += `<tr>
            <td>
                <p>${new Date(match.startTime).toLocaleDateString('en-EN', { hour: 'numeric', minute: 'numeric', month: 'short', day: 'numeric' }).toUpperCase()}<p>
            </td>
            <td>${match.home} <img src='./images/${match.raceHome}.png'></td>
            <td>
                <p><b>${match.homeOdd}</b></p>
                <div class='calc_info'>
                    <p>calc odd: ${match.calcHomeOdd}</p>
                    <p class='${match.valueHome > 1 ? 'active' : ''}'>value: ${match.valueHome * 100}%</p>
                    <p>math ex: ${match.mathExHome}</p>
                </div>
                ${
                (match.valueHome > 1 && match.mathExHome > 0) ?
                    `<a class='bet' target='_blank' href='${generateLinkForBet(match)}'>BET</a>`
                    : ''
                }
            </td>
            <td>
                <p><b>${match.awayOdd}</b></p>
                <div class='calc_info'>
                    <p>calc odd: ${match.calcAwayOdd}</p>
                    <p class='${match.valueAway > 1 ? 'active' : ''}'>value: ${match.valueAway * 100}%</p>
                    <p>math ex: ${match.mathExAway}</p>
                </div>
                ${
                (match.valueAway > 1 && match.mathExAway > 0) ?
                    `<a class='bet' target='_blank' href='${generateLinkForBet(match)}'>BET</a>`
                    : ''
                }
            </td>
            <td><img src='./images/${match.raceAway}.png'> ${match.away}</td>
        </tr>`
        }
    }
    table += '</tbody></table>'

    html += table
    html += `
        </body>
    </html>
    `

    fs.writeFileSync('./index.html', html)
}

async function main() {
    let sc2line = await sc2.getLine('starcraft2')

    for (const match of Object.values(sc2line)) {
        const home = await searchPlayer(match.home)
        const away = await searchPlayer(match.away)
        const odds = await getPredictMatch(home.id, away.id)

        match.raceHome = home.race
        match.raceAway = away.race
        match.calcHomeOdd = formatNumber(1 / odds.proba)
        match.calcAwayOdd = formatNumber(1 / odds.probb)
        match.valueHome = formatNumber(match.homeOdd * (1 / match.calcHomeOdd))
        match.valueAway = formatNumber(match.awayOdd * (1 / match.calcAwayOdd))

        const ph1 = 1 / 2
        const ph2 = 1 / 2
        const ph1a = odds.proba
        const ph2a = odds.proba
        const pa = (ph1 * ph1a) + (ph2 * ph2a)
        const pah1 = (ph1 * ph1a) / pa
        const pah2 = (ph2 * ph2a) / pa

        const winMoneyHome = (money * match.homeOdd) - money
        const lose = -money
        const winMoneyAway = (money * match.awayOdd) - money

        let mathExHome = (winMoneyHome * pah1) + (lose * (1 - pah1))
        let mathExAway = (winMoneyAway * pah2) + (lose * (1 - pah2))

        match.mathExAway = formatNumber(mathExAway)
        match.mathExHome = formatNumber(mathExHome)

    }

    generateHtml(sc2line)
}

main()




