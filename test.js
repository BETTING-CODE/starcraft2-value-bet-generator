const sc2 = require('ggbet-parser')
sc2.getLine('counter-strike')
.then(data => {
    console.log(Object.keys(data).length)
    const a = Object.values(data).map(da => [da.home.trim(), da.away.trim()]).flat()
    const b = new Set(a)
    //console.log(Array.from(b))

})


// function wc3infoApi() {
//     nodeFetch('https://warcraft3.info/api/v1/stats_players/Happy')
//     .then(data => data.json())
//     .then(data => {
//         console.log(data)
//     })
// }


