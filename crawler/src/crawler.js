// 'easl23-24' 'https://pleagueofficial.com/easl-season'
// 'regular23-24' 'https://pleagueofficial.com/schedule-regular-season/2023-24'
// 'playoffs23-24' 'https://pleagueofficial.com/schedule-playoffs/2023-24'
// 'regular22-23' 'https://pleagueofficial.com/schedule-regular-season/2022-23'
// 'playoffs22-23' 'https://pleagueofficial.com/schedule-playoffs/2022-23'
// 'finals22-23' 'https://pleagueofficial.com/schedule-finals/2022-23'

const axios = require('axios')
const cheerio = require('cheerio')
const path = require('path')
const fs = require('fs')
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')

const teamList = require('./teams')

dayjs.extend(utc)

const arg = process.argv.splice(2)
if (arg.length !== 3) {
  console.error('Invalid input length')
} else {
  const seasonBeginYear = Number(arg[0])
  const seasonType = arg[1]
  const url = arg[2]
  crawlService(seasonBeginYear, seasonType, url)
}

async function crawlService (seasonBeginYear, seasonType, url) {
  try {
    const response = await axios.get(url)
    const html = response.data
    const matchList = extractMatchInformation(seasonBeginYear, seasonType, html)
    writeFile(seasonBeginYear, seasonType, matchList)
  } catch (err) {
    console.log(err)
  }
}

function parseGameTime (seasonBeginYear, match) {
  const gameTime = dayjs(`${seasonBeginYear}/${match.date} ${match.time}`, 'YYYY/MM/DD HH:mm')
  if (gameTime.isBefore(`${seasonBeginYear}-10-01`)) {
    return gameTime.add(1, 'year').format('YYYY-MM-DD HH:mm:ss')
  }
  return gameTime.format('YYYY-MM-DD HH:mm:ss')
}

function teamNameParseId (teamName) {
  switch (teamName) {
    case teamList[0].fullName:
    case teamList[0].name:
      return teamList[0].team_id
    case teamList[1].fullName:
    case teamList[1].name:
      return teamList[1].team_id
    case teamList[2].fullName:
    case teamList[2].name:
      return teamList[2].team_id
    case teamList[3].fullName:
    case teamList[3].name:
      return teamList[3].team_id
    case teamList[4].fullName:
    case teamList[4].name:
      return teamList[4].team_id
    case teamList[5].fullName:
    case teamList[5].name:
      return teamList[5].team_id
    case teamList[6].fullName:
    case teamList[6].name:
      return teamList[6].team_id
    case teamList[7].fullName:
    case teamList[7].name:
      return teamList[7].team_id
    case teamList[8].fullName:
    case teamList[8].name:
      return teamList[8].team_id
    case teamList[9].fullName:
    case teamList[9].name:
      return teamList[9].team_id
    case teamList[10].fullName:
    case teamList[10].name:
      return teamList[10].team_id
    case teamList[11].fullName:
    case teamList[11].name:
      return teamList[11].team_id
    default:
      return '找不到隊名, 請更新確認球隊名單'
  }
}

function extractMatchInformation (seasonBeginYear, seasonType, data) {
  const $ = cheerio.load(data)
  const matches = $('.match_row').map((_, el) => {
    const result = {
      season: seasonBeginYear,
      seasonType,
      gameId: seasonType === 'regular' || seasonType === 'easl' ? $(el).find('.fs14.mb-2').text() : $(el).find('.fs14.mb-2').text().slice(-3),
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

  return matches
}

function writeFile (seasonBeginYear, seasonType, matches) {
  const matchList = matches.map(match => ({
    season: seasonBeginYear,
    type: match.seasonType,
    game_id: match.gameId,
    game_time: parseGameTime(seasonBeginYear, match),
    arena: match.arena,
    guest_id: teamNameParseId(match.guest.name),
    home_id: teamNameParseId(match.home.name)
  }))

  const directory = path.join(__dirname, '../schedule', `${seasonBeginYear + seasonType}.json`)
  fs.writeFileSync(directory, JSON.stringify(matchList, 0, 2))
}
