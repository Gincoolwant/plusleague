const { google } = require('googleapis')
const dayjs = require('dayjs')

const { Match, sequelize } = require('../models')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const checkJwtAccessToken = (req, res, next) => {
  if (!req.jwt.accessToken) {
    return res.redirect('/auth/google')
  }
  next()
}

const coverToCalendarFormat = (req, res, next) => {
  return Match.findOne({
    where: {
      type: req.params.type,
      gameId: req.params.game_id
    },
    attributes: [
      'type', 'game_id', 'game_time', 'arena',
      [sequelize.literal('(SELECT logo FROM Teams WHERE Teams.id = Match.guest_id)'), 'g_logo'],
      [sequelize.literal('(SELECT name FROM Teams WHERE Teams.id = Match.guest_id)'), 'g_name'],
      [sequelize.literal('(SELECT logo FROM Teams WHERE Teams.id = Match.home_id)'), 'h_logo'],
      [sequelize.literal('(SELECT name FROM Teams WHERE Teams.id = Match.home_id)'), 'h_name']
    ],
    raw: true
  })
    .then(match => {
      const startTime = dayjs(match.game_time).format()
      const endTime = dayjs(match.game_time).add(2, 'hour').format()
      req.event = {
        summary: `${match.game_id}${match.g_name} vs ${match.h_name}`,
        description: `${match.type} - 賽事編號${match.game_id} @ ${match.arena}`,
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
      next()
    })
    .catch(err => console.log(err))
}

const insertCalendarEvent = (req, res, next) => {
  const accessToken = req.jwt.accessToken
  const refreshToken = req.jwt.gToken
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL
  )

  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken
  })
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
  return calendar.events.insert({
    calendarId: 'primary',
    resource: req.event
  })
    .then((event) => {
      if (event.data.status === 'confirmed') {
        req.event.htmlLink = event.data.htmlLink
        next()
      }
    })
    .catch(err => console.log(err))
}

module.exports = {
  checkJwtAccessToken,
  coverToCalendarFormat,
  insertCalendarEvent
}
