const cheerio = require('cheerio')
const nodeFetch = require('node-fetch')
const fs = require('fs')

async function getRatingAndSave(game) {
    /*
    название game на сайте gosugamers
    lol -> league of legends
    dota2 -> dota2
    counterstrike -> CS:GO
    overwatch -> Overwatch
    starcraft2 -> Starcraft2
    */
    let urls = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(start => `https://www.gosugamers.net/${game}/rankings/list?maxResults=50&page=${start}`)
    let responses = await Promise.all(urls.map(url => nodeFetch(url).then(data => data.text())))
    let $$ = responses.map(response => cheerio.load(response))
    return $$.map($ => {
        let teams = []
        $('.ranking-list li a').each(function (i, element) {
            //j = 4 -> data - название команды
            //j = 5 -> children -> data эло рейтинг команды
            const teamName = element.children[4].data.replace(/\s/g, '')
            const eloRanking = element.children[5].children[0].data.replace(/\s/g, '');
            teams.push({
                teamName, eloRanking
            })
        })
        return teams
    })
}


module.exports = {
    getRatingAndSave
}
