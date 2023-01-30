const express = require('express')
const exphbs = require('express-handlebars')
const flash = require('connect-flash')
const usePassport = require('./config/passport')
const session = require('express-session')
const handlebarsHelpers = require('./helpers/handlebars-helper')
const routes = require('./routes/index')
const methodOverride = require('method-override')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()

app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }))
app.use(flash())
app.use(methodOverride('_method'))
usePassport(app)
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.warning_messages = req.flash('warning_messages')
  res.locals.user = req.user
  next()
})

app.use(routes)

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`App is listening on port ${port}!`))
