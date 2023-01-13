const express = require('express')
const exphbs = require('express-handlebars')
const axios = require('axios')
const cheerio = require('cheerio')
const handlebarsHelpers = require('./helpers/handlebars-helper')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()

app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')

const { google } = require('googleapis')
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
)
const scopes = [
  'https://www.googleapis.com/auth/calendar'
]

app.get('/google', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
  })

  res.redirect(url)
})

app.get('/google/redirect', async (req, res) => {
  const { tokens } = await oauth2Client.getToken(req.query.code)
  oauth2Client.setCredentials(tokens)

  const event = {
    summary: 'Test event',
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
    .then(event => console.log(event.data.htmlLink))
    .catch((error) => console.log('Some error occured', error))
})

app.use('/', async (req, res) => {
  axios('https://pleagueofficial.com/schedule-regular-season/2022-23')
    .then((response) => {
      const html = response.data
      const $ = cheerio.load(html)
      const matches = $('.match_row.is-future').map((index, el) => {
        const result = {
          id: Number($(el).find('.fs14.mb-2').text().slice(1)),
          date: $(el).find('.match_row_datetime').find('h5').eq(0).text(),
          day: $(el).find('.match_row_datetime').find('h5').eq(1).text(),
          time: $(el).find('.match_row_datetime').find('h6').text(),
          arena: $(el).find('.fs12.mb-0').text(),
          guest: {
            logo: $(el).find('.px-0').eq(0).find('img').attr('src'),
            name: $(el).find('.px-0').eq(0).find('.PC_only.fs14').text(),
            englishName: $(el).find('.px-0').eq(0).find('.fs12.PC_only').eq(1).text()
          },
          home: {
            logo: $(el).find('.px-0').eq(2).find('img').attr('src'),
            name: $(el).find('.px-0').eq(2).find('.PC_only.fs14').text(),
            englishName: $(el).find('.px-0').eq(2).find('.fs12.PC_only').eq(1).text()
          }
        }
        return result
      }).get()
      res.render('index', { matches })
    })
    .catch((err) => console.log(err))
})

const port = 3000
app.listen(port, () => console.log(`App is listening on port ${port}!`))
