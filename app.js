const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')

const usePassport = require('./config/passport')
const routes = require('./routes/index')
const handlebarsHelpers = require('./helpers/handlebars-helper')
const { errorHandler } = require('./middleware/errorHandle')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const staticFilesPath = path.join(__dirname, '/public')

app.use(morgan('short'))
app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')
app.use(express.static(staticFilesPath))
app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }))
app.use(flash())
app.use(cookieParser(process.env.SESSION_SECRET))
app.use(methodOverride('_method'))
usePassport(app)
app.use((req, res, next) => {
  res.locals.auth_messages = req.flash('auth_messages')
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.warning_messages = req.flash('warning_messages')
  res.locals.event_link = req.flash('event_link')
  res.locals.insertCalendar_success_messages = req.flash('insertCalendar_success_messages')
  res.locals.user = req.user
  next()
})

app.use(routes)
app.use(errorHandler)

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`App is listening on port ${port}!`))

module.exports = app
