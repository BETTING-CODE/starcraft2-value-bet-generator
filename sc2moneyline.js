const puppeteer = require('puppeteer')

function getMatches (page, reliably) {
  return new Promise(async resolve => {
    const result = {}

    const handleWebSocketFrameReceived = params => {
      try {
        const data = JSON.parse(params.response.payloadData)

        if (data && data.payload && data.payload.data && data.payload.data.matches) {

          const { matches } = data.payload.data

          for (const match of matches.filter(Boolean)) {
            try {
              const winnerMarket = match.markets.find(market => /^winner$/i.test(market.name))

              if (winnerMarket) {
                const { id, fixture } = match
                const { competitors, score, status, startTime } = fixture

                if (result[id] !== undefined) {
                  resolve(result)
                  break
                }

                const { name: home } = competitors.find(cmp => /home/i.test(cmp.homeAway))
                const { name: away } = competitors.find(cmp => /away/i.test(cmp.homeAway))
                const { value: homeOdd } = winnerMarket.odds.find(odd => odd.name === home)
                const { value: awayOdd } = winnerMarket.odds.find(odd => odd.name === away)

                result[id] = {
                  id,
                  originalId: id.length > 36 ? id.slice(-36) : id,
                  score,
                  status,
                  startTime: +new Date(startTime),
                  home,
                  away,
                  homeOdd,
                  awayOdd
                }
              }
            } catch (e) {}
          }

          if (!reliably) {
            resolve(result)
          }
        }
      } catch (e) {}
    }

    const f12 = await page.target().createCDPSession()
    await f12.send('Network.enable')
    await f12.send('Page.enable')

    f12.on('Network.webSocketFrameReceived', handleWebSocketFrameReceived)
  })
}

/**
 * @param {boolean} [reliably=false] if true will parse websocket until found duplicate.
 *                                   otherwise will resolve after first success parsing
 * @returns {Promise<object>}
 */
async function get_money_line (reliably = false) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.goto('https://gg22.bet/en/starcraft2', { waitUntil: 'domcontentloaded' })

  const matches = await getMatches(page, reliably)

  await page.close()
  await browser.close()

  return matches
}

module.exports = {
  get_money_line
}

get_money_line().then(res => console.log(res))
