function createMenu() {
    return `
        <style>
            li { 
                display: inline-block;
                vertical-align: top;
                margin-right: 10px;
            }
        </style>
        <ul>
            <li><a href="/csgo">CS:GO</a></li>
            <li><a href="/lol">LOL</a></li>
            <li><a href="/sc2">SC2</a></li>
            <li><a href="/dota">DOTA</a></li>
        </ul>
        <p><b>Welcome to the value betting club</b></p>
        <p>In this system you can find interesting bets on such disciplines as SC2 / CS GO / Dota 2 / League of Legends</p>
        <p>To calculate the value of the bet, we use two methods: ELO rating and Aligulac (SC2)</p>
        <p>We leave the rest of the calculations to our clients.</p>
    `
}

module.exports = {
    createMenu
}