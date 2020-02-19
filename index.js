const fs = require('fs')
const sc2 = require('./sc2moneyline')
const aligulac_api_key = '996TfcqdZrgcVpNJg0gK'
const node_fetch = require('node-fetch')

async function search_players(name) {
    return node_fetch(`http://aligulac.com/search/json/?q=${name}&search_for=players`)
        .then(res => res.json())
}

async function get_info_player(id) {
    return node_fetch(`http://aligulac.com/api/v1/player/?id=${id}&apikey=${aligulac_api_key}`)
        .then(res => res.json())
}

async function get_predictmatch(id1, id2) {
    return node_fetch(`http://aligulac.com/api/v1/predictmatch/${id1},${id2}/?apikey=${aligulac_api_key}&bo=3`)
        .then(res => res.json())
}

function format_number(num) {
    return Math.round(num * 100) / 100
}

function generate_html(sc2line) {

    let html = `
    <html>
        <head>
            <title>Starcraft2 value bet scanner</title> 
        </head>
        <style>
            body {
                margin: 0;
                font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Open Sans,Helvetica Neue,sans-serif;
            }
            table {
                width: 100%;
                border-collapse: collapse;
            }

            td, th {
                border: 1px solid #ddd;
                padding: 8px;
            }
            
            tr:nth-child(even){background-color: #f2f2f2;}
            
            tr:hover {background-color: #ddd;}
            
            th {
                padding-top: 12px;
                padding-bottom: 12px;
                text-align: left;
                background-color: #4CAF50;
                color: white;
            }

            .active {
                background-color: green;
                color: #fff;
                padding : 5px;
            }
        </style>
    <body>
    `
    let table = `<table>
        <thead>
            <th>Time</th>
            <th>Player 1</th>
            <th>Player 2</th>
            <th>Player 1 ggbet odds</th>
            <th>Player 1 my odds</th>
            <th>Player 2 ggbet odds</th>
            <th>Player 2 my odds</th>
        </thead>
        <tbody>`

    for (let i = 0; i < sc2line.length; i++) {
        table += `<tr>
            <td>${sc2line[i][0].time}</td>
            <td>${sc2line[i][0].name}</td>
            <td>${sc2line[i][1].name}</td>
            <td>${sc2line[i][0].odds}</td>
            <td>
                <p>my odd:${sc2line[i][0].custom_odds}</p>
                <p class='${sc2line[i][0].value > 1 ? 'active' : ''}'>value:${sc2line[i][0].value * 100}%</p>
            </td>
            <td>${sc2line[i][1].odds}</td>
            <td>
                <p>my odd:${sc2line[i][1].custom_odds}</p>
                <p class='${sc2line[i][1].value > 1 ? 'active' : ''}'>value:${sc2line[i][1].value * 100}%</p>
            </td>
        </tr>`

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

    let sc2line = await sc2.get_money_line()



    for (let i = 0; i < sc2line.length; i++) {
        let player_1 = await search_players(sc2line[i][0].name)
        player_1 = player_1.players[0]
        let player_2 = await search_players(sc2line[i][1].name)
        player_2 = player_2.players[0]
        let player_form_1 = await get_info_player(player_1.id)
        let player_form_2 = await get_info_player(player_2.id)
        let custom_odds = await get_predictmatch(player_1.id, player_2.id)
        custom_odds = [
            custom_odds.proba,
            custom_odds.probb
        ]

        sc2line[i][0].id = player_1.id
        sc2line[i][0].race = player_1.race
        sc2line[i][1].id = player_2.id
        sc2line[i][1].race = player_2.race

        sc2line[i][0].form = player_form_1.objects[0].form
        sc2line[i][1].form = player_form_2.objects[0].form

        sc2line[i][0].custom_odds = format_number((1 / custom_odds[0]))
        sc2line[i][0].value = format_number(sc2line[i][0].odds * (1 / sc2line[i][0].custom_odds))

        sc2line[i][1].custom_odds = format_number((1 / custom_odds[1]))
        sc2line[i][1].value = format_number(sc2line[i][1].odds * (1 / sc2line[i][1].custom_odds))
    }

    generate_html(sc2line)
}

main()




