const yargs = require('yargs')
const argv = yargs.argv;
const sync = argv.sync
const game = argv.game
const test = argv.test

const starcraft = require('./starcraft/index')
const lol = require('./leagueoflegends/index')
const csgo = require('./csgo/index')

switch (game) {
    case 'sc2':
        starcraft.main(test)
        break;
    case 'lol':
        lol.main(test, sync)
        break;
    case 'csgo':
        csgo.main(test, sync)
        break;
    default:
        console.log('Что-то пошло не так, проверь параметры')
        break;
}