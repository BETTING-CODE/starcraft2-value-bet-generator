function formatNumber(num) {
    return Math.round(num * 100) / 100
}

function getCashNumber(coefficient) {
    let cash = 0
    if (coefficient < 1.5) {
        cash = 150
    } else if (coefficient >= 1.5 && coefficient <= 2.5) {
        cash = 100
    } else if (coefficient > 2.5) {
        cash = 85
    }
    return cash
}


module.exports = {
    formatNumber,
    getCashNumber
}