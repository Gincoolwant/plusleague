const fs = require('fs')
const path = require('path')

// 假設 jsonData 是您的 JSON 格式資料
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

// 將每個賽事加入到 iCalendar 中
plgRegular2023.forEach(game => {
  const startDate = new Date(game.game_time).toISOString().replace(/-/g, '').replace(/:/g, '').slice(0, -5)
  const endDate = new Date(game.game_time).toISOString().replace(/-/g, '').replace(/:/g, '').slice(0, -5)
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

// 結束 iCalendar 文本
icsContent += 'END:VCALENDAR\r\n'

// 寫入至檔案
const outputFilename = path.join(__dirname, '../../public', 'plus-league-calendar.ics')
fs.writeFileSync(outputFilename, icsContent)

console.log(`iCalendar file "${outputFilename}" generated successfully!`)
