const axios = require('axios')
const cheerio = require('cheerio')
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const fs = require('fs')
dayjs.extend(utc)

function parseGameTime (match) {
  const gameTime = dayjs(`2022/${match.date} ${match.time}`, 'YYYY/MM/DD HH:mm')
  if (gameTime.isBefore('2022-10-01')) {
    return gameTime.add(1, 'year').utc().format('YYYY-MM-DD HH:mm:ss')
  }
  return gameTime.utc().format('YYYY-MM-DD HH:mm:ss')
}

function parseTeamId (teamName) {
  switch (teamName) {
    case '勇士':
      return 1
    case '領航猿':
      return 2
    case '攻城獅':
      return 3
    case '夢想家':
      return 4
    case '鋼鐵人':
      return 5
    case '國王':
      return 6
  }
}

async function crawlMatches (url, fileName) {
  try {
    const response = await axios.get(url)
    const html = response.data
    const $ = cheerio.load(html)
    const matches = $('.match_row').map((index, el) => {
      const result = {
        type: fileName,
        id: fileName === 'REGULAR' ? $(el).find('.fs14.mb-2').text() : $(el).find('.fs14.mb-2').text().slice(-3),
        date: $(el).find('.match_row_datetime').find('h5').eq(0).text(),
        day: $(el).find('.match_row_datetime').find('h5').eq(1).text(),
        time: $(el).find('.match_row_datetime').find('h6').text(),
        arena: $(el).find('.fs12.mb-0').text(),
        guest: {
          logo: $(el).find('.px-0').eq(0).find('img').attr('src'),
          name: $(el).find('.px-0').eq(0).find('.PC_only.fs14').text(),
          englishName: $(el).find('.px-0').eq(0).find('.fs12.PC_only').eq(1).text()
        },
        home: {
          logo: $(el).find('.px-0').eq(2).find('img').attr('src'),
          name: $(el).find('.px-0').eq(2).find('.PC_only.fs14').text(),
          englishName: $(el).find('.px-0').eq(2).find('.fs12.PC_only').eq(1).text()
        }
      }
      return result
    }).get()
    writeFile(matches, fileName)
  } catch (err) {
    console.log(err)
  }
}

function writeFile (matches, fileName) {
  const matchList = matches.map(match => ({
    type: match.type,
    game_id: match.id,
    game_time: parseGameTime(match),
    arena: match.arena,
    guest_id: parseTeamId(match.guest.name),
    home_id: parseTeamId(match.home.name)
  }))

  fs.writeFileSync(`${fileName}.json`, JSON.stringify(matchList, 0, 2))
}

const urlRegular = 'https://pleagueofficial.com/schedule-regular-season/2022-23'
const urlPlayoffs = 'https://pleagueofficial.com/schedule-playoffs/2022-23'
crawlMatches(urlRegular, 'REGULAR')
crawlMatches(urlPlayoffs, 'PLAYOFFS')
