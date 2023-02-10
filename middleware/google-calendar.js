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
  if (req.user.gToken) {
    const gToken = jwt.verify(req.user.gToken, process.env.GOOGLE_CLIENT_SECRET)
    delete gToken.iat
    console.log('check:', gToken)
    oauth2Client.setCredentials(gToken)
    return next()
  }
  const data = {
    userId: req.user.id,
    gameId: req.params.game_id
  }
  const state = jwt.sign(data, process.env.GOOGLE_CLIENT_SECRET, { expiresIn: '1m' })
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
  console.log(tokens)
  const gToken = jwt.sign(tokens, process.env.GOOGLE_CLIENT_SECRET)
  try {
    await User.update(
      { gToken },
      {
        where: {
          id: data.userId
        },
        raw: true
      })
    next()
  } catch (err) {
    console.log(err)
  }
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
