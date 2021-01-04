function formatNumber(num) {
    return Math.round(num * 100) / 100
}

//https://wewin.neocities.org/bet-size.html
function getCashNumber(odds, bank = 10000, risk = 12, edge = 1) {
    let betSizePercent =
        Math.log10(1 - (1 / (odds / (1 + (edge / 100))))) /
        Math.log10(Math.pow(10, -risk));

    if (isNaN(betSizePercent)) {
        betSizePercent = 0;
    }
    return (betSizePercent * bank).toFixed(1)
}

module.exports = {
    formatNumber,
    getCashNumber
}