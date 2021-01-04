const express = require('express')
const app = express()
const port = 3000
const starcraft = require('../starcraft/index')
const lol = require('../leagueoflegends/index')
const csgo = require('../csgo/index')
const dota = require('../dota/index')
const cors = require('cors')

app.use(cors())

app.get('/csgo', (req, res) => {
    const sync = (typeof req.query.sync !== 'undefined')
    csgo
        .main(false, sync)
        .then(response => {
            res.json(response)
        })
        .catch(e => {
            console.log(e)
            res.json([])
        })
})

app.get('/dota', (req, res) => {
    const sync = (typeof req.query.sync !== 'undefined')
    dota
        .main(false, sync)
        .then(response => {
            res.json(response)
        })
        .catch(e => {
            console.log(e)
            res.json([])
        })
})

app.get('/lol', (req, res) => {
    const sync = (typeof req.query.sync !== 'undefined')
    lol
        .main(false, sync)
        .then(response => {
            res.json(response)
        })
        .catch(e => {
            console.log(e)
            res.json([])
        })
})

app.get('/sc2', (req, res) => {
    const sync = (typeof req.query.sync !== 'undefined')
    starcraft
        .main(false, sync)
        .then(response => {
            res.json(response)
        })
        .catch(e => {
            console.log(e)
            res.json([])
        })
})

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
})