const axios = require('axios')
const cheerio = require('cheerio')
const path = require('path')
const fs = require('fs')
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')

const teamList = require('../crawler/src/team')

dayjs.extend(utc)

async function crawlMatches (url, fileName) {
  try {
    const response = await axios.get(url)
    const html = response.data
    const matchList = extractMatchInformation(html)
    writeFile(matchList, fileName)
  } catch (err) {
    console.log(err)
  }
}

function parseGameTime (match) {
  const gameTime = dayjs(`2023/${match.date} ${match.time}`, 'YYYY/MM/DD HH:mm')
  if (gameTime.isBefore('2023-10-01')) {
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

function extractMatchInformation (data) {
  const $ = cheerio.load(data)
  const matches = $('.match_row').map((_, el) => {
    const result = {
      type: fileName,
      id: fileName.includes('regular') || fileName.includes('easl') ? $(el).find('.fs14.mb-2').text() : $(el).find('.fs14.mb-2').text().slice(-3),
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

function writeFile (matches, fileName) {
  const matchList = matches.map(match => ({
    type: match.type,
    game_id: match.id,
    game_time: parseGameTime(match),
    arena: match.arena,
    guest_id: teamNameParseId(match.guest.name),
    home_id: teamNameParseId(match.home.name)
  }))

  const directory = path.join(__dirname, `${fileName}.json`)
  fs.writeFileSync(directory, JSON.stringify(matchList, 0, 2))
}

const fileName = 'easl23-24'
const url = 'https://pleagueofficial.com/easl-season'
// const fileName = 'regular23-24'
// const url = 'https://pleagueofficial.com/schedule-regular-season/2023-24'
// const fileName = 'playoffs23-24'
// const url = 'https://pleagueofficial.com/schedule-playoffs/2023-24'

crawlMatches(url, fileName)
