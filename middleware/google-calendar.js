const { google } = require('googleapis')

const { Match, sequelize } = require('../models')
const { matchToCalendarFormat } = require('../helpers/matchFormat-helper')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const checkGoogleAuthToken = (req, res, next) => {
  const isAuthTokenExists = req.jwt?.accessToken || req.user?.gToken
  if (!isAuthTokenExists) {
    return res.redirect('/auth/google')
  }
  next()
}

const matchFormatService = (req, res, next) => {
  return Match.findOne({
    where: {
      season: req.params.season,
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
      req.event = matchToCalendarFormat(match)
      next()
    })
    .catch(err => console.log(err))
}

const insertEventToCalendar = (req, res, next) => {
  const accessToken = req.jwt.accessToken
  const refreshToken = req.jwt.gToken || req.user.gToken

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
      } else {
        throw new Error('Failed to insert event into calendar.')
      }
    })
    .catch(err => console.log(err))
}

module.exports = {
  checkGoogleAuthToken,
  matchFormatService,
  insertEventToCalendar
}
