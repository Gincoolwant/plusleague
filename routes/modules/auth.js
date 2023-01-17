const express = require('express')
const router = express.Router()
const { google } = require('googleapis')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
)
const scopes = [
  'https://www.googleapis.com/auth/calendar'
]

router.get('/schedule/:id', (req, res) => {
  if (oauth2Client.credentials.access_token) {
    const event = {
      summary: `賽事編號G${req.params.id}`,
      description: 'Google add event testing.',
      start: {
        dateTime: '2023-01-11T01:00:00-07:00',
        timeZone: 'Asia/Kolkata'
      },
      end: {
        dateTime: '2023-01-11T05:00:00-07:00',
        timeZone: 'Asia/Kolkata'
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 30 }
        ]
      }
    }

    const calendar = google.calendar({ version: 'v3', auth: process.env.GOOGLE_API_KEY })
    calendar.events.insert({
      auth: oauth2Client,
      calendarId: 'primary',
      resource: event
    })
      .then(() => {
        req.flash('success_messages', '已成功加入行事曆。')
        res.redirect('/')
      })
      .catch(err => console.log(err))
  } else {
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes
    })
    res.redirect(url)
  }
})

router.get('/google/callback', async (req, res) => {
  const { tokens } = await oauth2Client.getToken(req.query.code)
  oauth2Client.setCredentials(tokens)
  res.redirect('/')
})

module.exports = router
