const dayjs = require('dayjs')

const formatIntoEvent = (match) => {
  const startTime = dayjs(match.game_time).format()
  const endTime = dayjs(match.game_time).add(2, 'hour').format()
  const event = {
    summary: `${match.game_id}${match.g_name} vs ${match.h_name}`,
    description: `${match.type} - 賽事編號${match.game_id}`,
    location: `${match.arena}`,
    start: {
      dateTime: `${startTime}`,
      timeZone: 'Asia/Taipei'
    },
    end: {
      dateTime: `${endTime}`,
      timeZone: 'Asia/Taipei'
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 120 }
      ]
    }
  }
  return event
}

module.exports = {
  formatIntoEvent
}
