const game = 'csgo'
const starcraft = require('./starcraft/index')
const lol = require('./leagueoflegends/index')
const csgo = require('./csgo/index')

switch (game) {
    case 'starcraft':
        starcraft.main(false)
        break;
    case 'lol':
        lol.main(false, true)
        break;
    case 'csgo':
        csgo.main(false, true)
        break;
    default:
        console.log('Что-то пошло не так, проверь параметры')
        break;
}