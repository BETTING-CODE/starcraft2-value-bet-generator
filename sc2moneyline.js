const puppeteer = require('puppeteer');

async function get_money_line() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://gg22.bet/en/starcraft2', { waitUntil: 'networkidle2' });

    const starcraft2matches = await page.evaluate(() => {
        let object = []
        let j = 0
        let names = document.querySelectorAll('.__app-LogoTitle-name.LogoTitle__name___2LTlu')
        let odds = document.querySelectorAll('.odd__ellipsis___3b4Yk')
        let date_time = document.querySelectorAll('.dateTime__date___147AU')

        function get_day(text) {
            if (text.indexOf('TODAY') !== -1) {
                let day = new Date()
                day = day.toLocaleDateString('en-EN', { month: 'short', day: 'numeric' })
                day = day.toUpperCase()
                return text.replace('TODAY', day)
            } else {
                return text
            }
        }

        for (let i = 0; i < names.length; i++) {
            if (i == 0)
                object[j] = []
            if (i % 2 == 0 && i != 0) {
                j++
                object[j] = []
                object[j].push({ time: get_day(date_time[j].innerText), name: names[i].innerText, odds: odds[i].innerText })
            } else {
                object[j].push({ time: get_day(date_time[j].innerText), name: names[i].innerText, odds: odds[i].innerText })
            }
        }

        return object
    })

    await browser.close();
    return starcraft2matches
}

module.exports = {
    get_money_line : get_money_line
}