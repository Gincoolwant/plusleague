const fs = require('fs')
const path = require('path')
const dayjs = require('dayjs')

const plgRegular2023 = require('../schedule/2023plg-regular.json')
const teamList = {
  1: '臺北富邦勇士',
  2: '桃園璞園領航猿',
  3: '新竹御頂攻城獅',
  4: '福爾摩沙夢想家',
  5: '高雄17直播鋼鐵人',
  6: '新北國王',
  7: '安養赤紅火箭',
  8: '首爾SK騎士',
  9: '琉球黃金國王',
  10: '菲律賓電信',
  11: '千葉噴射機',
  12: '馬尼拉電器'
}

let icsContent = 'BEGIN:VCALENDAR\r\n'
icsContent += 'VERSION:2.0\r\n'
icsContent += 'PRODID:-//CK//Plus League//EN\r\n'

// 將每個賽事加入到 ics
plgRegular2023.forEach(game => {
  const startDate = dayjs(game.game_time).format('YYYYMMDDTHHmmss')
  const endDate = dayjs(game.game_time).add(2, 'h').format('YYYYMMDDTHHmmss')
  const summary = `${game.game_id}${teamList[game.guest_id]} vs ${teamList[game.home_id]}`
  const location = game.arena
  const description = `plg-regular - 賽事編號${game.game_id}`

  icsContent += 'BEGIN:VEVENT\r\n'
  icsContent += `DTSTART:${startDate}\r\n`
  icsContent += `DTEND:${endDate}\r\n`
  icsContent += `SUMMARY:${summary}\r\n`
  icsContent += `LOCATION:${location}\r\n`
  icsContent += `DESCRIPTION:${description}\r\n`
  icsContent += 'END:VEVENT\r\n'
})

// 結束 ics
icsContent += 'END:VCALENDAR\r\n'

// 寫入檔案
const outputFilename = path.join(__dirname, '../../public', 'plus-league-calendar.ics')
fs.writeFileSync(outputFilename, icsContent)

console.log(`iCalendar file "${outputFilename}" generated successfully!`)
