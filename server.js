const express = require('express')
const app = express()
const port = 3000
const starcraft = require('./starcraft/index')
const lol = require('./leagueoflegends/index')
const csgo = require('./csgo/index')
const dota = require('./dota/index')
const { createHtmlTable } = require('./views/table')
const { createMenu } = require('./views/menu')
const { style } = require('./views/style')

function mainHtml() {
    return style() + createMenu()
}

app.get('/csgo', (req, res) => {
    const sync = (typeof req.query.sync !== 'undefined')
    csgo
        .main(false, sync)
        .then(response => {
            res.send(
                mainHtml() +
                createHtmlTable(response))
        })
})

app.get('/dota', (req, res) => {
    const sync = (typeof req.query.sync !== 'undefined')
    dota
        .main(false, sync)
        .then(response => {
            res.send(
                mainHtml() +
                createHtmlTable(response))
        })
})

app.get('/lol', (req, res) => {
    const sync = (typeof req.query.sync !== 'undefined')
    lol
        .main(false, false)
        .then(response => {
            res.send(
                mainHtml() +
                createHtmlTable(response))
        })
})

app.get('/sc2', (req, res) => {
    const sync = (typeof req.query.sync !== 'undefined')
    starcraft
        .main(false, false)
        .then(response => {
            res.send(
                mainHtml() +
                createHtmlTable(response))
        })
})

app.get('/', (req, res) => {
    res.send(mainHtml())
})

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
})