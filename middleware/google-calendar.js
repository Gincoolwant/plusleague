const { google } = require('googleapis')
const { User } = require('../models')
const jwt = require('jsonwebtoken')
const scopes = [
  'https://www.googleapis.com/auth/calendar'
]

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
)

const checkOauth = async (req, res, next) => {
  const accessToken = await User.findByPk(req.user.id, { raw: true })
  if (accessToken.gToken) {
    oauth2Client.setCredentials({ access_token: accessToken.gToken })
    return next()
  }
  const data = {
    userId: req.user.id,
    gameId: req.params.game_id
  }
  const state = jwt.sign(data, process.env.GOOGLE_CLIENT_SECRET, { expiresIn: '1m' })
  if (oauth2Client.credentials.access_token) return next()
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    state
  })
  res.redirect(url)
}

const updateToken = async (req, res, next) => {
  const data = jwt.verify(req.query.state, process.env.GOOGLE_CLIENT_SECRET)
  req.gameId = data.gameId
  const { tokens } = await oauth2Client.getToken(req.query.code)
  await User.update(
    { gToken: tokens.access_token },
    {
      where: {
        id: data.userId
      },
      raw: true
    })
  next()
}

const insertEvent = (req, res, next) => {
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
  return calendar.events.insert({
    calendarId: 'primary',
    resource: req.event
  })
    .then(() => {
      next()
    })
    .catch(err => console.log(err))
}

module.exports = {
  checkOauth,
  updateToken,
  insertEvent
}
