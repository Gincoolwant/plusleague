const express = require('express')
const exphbs = require('express-handlebars')
const axios = require('axios')
const cheerio = require('cheerio')
const { User } = require('./models')
const flash = require('connect-flash')
const usePassport = require('./config/passport')
const session = require('express-session')
const bcrypt = require('bcryptjs')
const handlebarsHelpers = require('./helpers/handlebars-helper')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()

app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }))
app.use(flash())
usePassport(app)
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success-msg')
  res.locals.warning_msg = req.flash('warning-msg')
  res.locals.error = req.flash('error')

  next()
})

const { google } = require('googleapis')
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
)
const scopes = [
  'https://www.googleapis.com/auth/calendar'
]

app.get('/schedule/:id', (req, res) => {
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
      .then(() => res.redirect('/'))
      .catch((error) => console.log('Some error occured', error))
  } else {
    console.log('no token')
    res.redirect('/google')
  }
})

app.get('/google', async (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
  })
  res.redirect(url)
})

app.get('/google/redirect', async (req, res) => {
  const { tokens } = await oauth2Client.getToken(req.query.code)
  oauth2Client.setCredentials(tokens)

  res.redirect('/')
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.get('/register', (req, res) => {
  res.render('register')
})

app.post('/register', (req, res) => {
  const { email, password, confirmPassword } = req.body
  // 未輸入name以email帳號為name
  let name = req.body.name
  if (!name) {
    name = email.slice(0, email.indexOf('@'))
  }

  // 必填欄位及確認密碼驗證
  const errors = []
  if (!email || !password || !confirmPassword) {
    errors.push({ message: '請完成必填欄位。' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '兩次密碼輸入不相符。' })
  }
  if (errors.length) {
    return res.render('register', { name, email, password, confirmPassword, errors })
  }

  // 確認email是否註冊，是: 提示已註冊，否: 創建使用者
  return User.findOne({ where: { email } })
    .then(user => {
      // 已有用相同email使用者
      if (user) {
        errors.push({ message: '此Email已註冊' })
        return res.render('register', { name, email, password, confirmPassword, errors })
      }
      // 可註冊email，密碼加密並創建使用者
      return bcrypt.genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => {
          return User.create({ name, email, password: hash })
            .then(() => res.redirect('login'))
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

app.get('/', async (req, res) => {
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
