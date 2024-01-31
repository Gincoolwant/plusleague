const express = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken')

const { User } = require('../../models')
const { checkGoogleAuthToken, insertEventToCalendar, matchFormatService } = require('../../middleware/google-calendar.js')

const router = express.Router()
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

router.post('/schedule/:season/:type/:game_id', checkGoogleAuthToken, matchFormatService, insertEventToCalendar, (req, res) => {
  req.flash('insertCalendar_success_messages', `${req.event.summary}，已成功加入您的行事曆。`)
  req.flash('event_link', `${req.event.htmlLink}`)
  res.redirect('back')
})

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar'],
  accessType: 'offline'
}))

router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/' }), (req, res) => {
  const refreshToken = req.user.refreshToken
  const accessToken = req.user.accessToken

  User.update({ gToken: refreshToken }, {
    where: {
      id: req.jwt.id
    },
    refreshing: true
  })
    .then(() => {
      return User.findByPk(req.jwt.id, { raw: true })
    })
    .then(user => {
      delete user.password
      delete user.gToken
      const userData = {
        ...user,
        accessToken
      }
      const userDataJwt = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '15m' })
      res.cookie('pleagueJWT', userDataJwt, { maxAge: 30 * 60 * 1000, httpOnly: true, signed: true })
      res.redirect('/')
    })
    .catch(err => console.log(err))
})

module.exports = router
