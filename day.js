const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
dayjs.extend(utc)

const match = {
  date: '03/28',
  time: '17:00'
}

function parseGameTime (match) {
  const gameTime = dayjs(`2022/${match.date} ${match.time} +08:00`, 'YYYY/MM/DD HH:mm Z')
  if (gameTime.isBefore('2022-10-01')) {
    return gameTime.add(1, 'year').utc().format('YYYY-MM-DD HH:mm:ss')
  }
  return gameTime.utc().format('YYYY-MM-DD HH:mm:ss')
}

console.log(parseGameTime(match))
