const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
dayjs.extend(utc)
const axios = require('axios')
const cheerio = require('cheerio')

const match = {
  date: '03/28',
  time: '17:00'
}

function parseGameTime (match) {
  const gameTime = dayjs(`2022/${match.date} ${match.time}`, 'YYYY/MM/DD HH:mm')
  if (gameTime.isBefore('2022-10-01')) {
    return gameTime.add(1, 'year').format('YYYY-MM-DD HH:mm:ss')
  }
  return gameTime.format('YYYY-MM-DD HH:mm:ss')
}

async function crawlTeams(url) {
  try {
    const response = await axios.get(url)
    const html = response.data
    const $ = cheerio.load(html)
    const teams = $('.match_row').map((index, el) => {
      const team = {
        logo: $(el).find('.px-0').eq(2).find('img').attr('src'),
        name: $(el).find('.px-0').eq(2).find('.PC_only.fs14').text(),
        englishName: $(el).find('.px-0').eq(2).find('.fs12.PC_only').eq(1).text()
      }
      return team
    }).get()
    const result = teams.map(team => {
      if
    })
    console.log(result)
  } catch (err) {
    console.log(err)
  }
}

// console.log(parseGameTime(match))
crawlTeams('https://pleagueofficial.com/schedule-regular-season/2022-23')