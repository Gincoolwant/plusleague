const { google } = require('googleapis')

const { Match, User, sequelize } = require('../models')
const AppError = require('../utils/AppError')
const errorCode = require('../utils/errorCode')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const authService = {
  findMatch: async (season, type, gameId) => {
    const match = await Match.findOne({
      where: { season, type, gameId },
      attributes: [
        'type', 'game_id', 'game_time', 'arena',
        [sequelize.literal('(SELECT logo FROM Teams WHERE Teams.id = Match.guest_id)'), 'g_logo'],
        [sequelize.literal('(SELECT name FROM Teams WHERE Teams.id = Match.guest_id)'), 'g_name'],
        [sequelize.literal('(SELECT logo FROM Teams WHERE Teams.id = Match.home_id)'), 'h_logo'],
        [sequelize.literal('(SELECT name FROM Teams WHERE Teams.id = Match.home_id)'), 'h_name']
      ],
      raw: true
    })
    if (!match) {
      throw new AppError(errorCode.MATCH_NOT_FOUND, 'Match not found.', errorCode.MATCH_NOT_FOUND.statusCode)
    }
    return match
  },
  insertEventToGoogleCalendar: async (event, accessToken, refreshToken) => {
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
    const insertedEvent = await calendar.events.insert({
      calendarId: 'primary',
      resource: event
    })

    if (insertedEvent.data.status !== 'confirmed') {
      throw new AppError(errorCode.INSERT_EVENT_FAILED, 'Failed to insert event into google calendar.', errorCode.INSERT_EVENT_FAILED.statusCode)
    }

    return insertedEvent.data
  },
  storeGoogleToken: async (id, accessToken, refreshToken) => {
    const user = await User.findOne({ id }, { raw: true })
    if (!user) {
      throw new AppError(errorCode.USER_NOT_FOUND, 'User not found.', errorCode.USER_NOT_FOUND.statusCode)
    }
    user.gToken = refreshToken
    await user.save()

    const userData = {
      ...user.toJSON(),
      accessToken
    }
    delete userData.password
    delete userData.gToken

    return userData
  }
}

module.exports = authService
