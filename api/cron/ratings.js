const { getRatingAndSave } = require('../gosuGamers')
const ratings = require('../models/ratings')

async function save(data, game) {
    let k = 0
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            setTimeout(function () {
                ratings.create({
                    team: data[i][j].teamName,
                    game: game,
                    rating: data[i][j].eloRanking
                })
                    .then(res => console.log(res))
            }, k * 2000)
            k++
        }
    }
}

async function main() {
    const csgo = await getRatingAndSave('counterstrike')
    await save(csgo, 'csgo')

    const lol = await getRatingAndSave('lol')
    await save(lol, 'lol')

    const dota = await getRatingAndSave('dota2')
    await save(dota, 'dota2')
}

main()