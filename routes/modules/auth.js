const express = require('express')
const passport = require('passport')

const { authenticatedGoogleCalendar } = require('../../middleware/auth.js')
const authController = require('../../controllers/auth-controller.js')
const tryCatch = require('../../utils/tryCatch')

const router = express.Router()
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const googleAuthenticateOptions = {
  scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar'],
  accessType: 'offline'
}

router.post('/schedule/:season/:type/:gameId', authenticatedGoogleCalendar, tryCatch(authController.insertMatchToCalendar))
router.get('/google', passport.authenticate('google', googleAuthenticateOptions))
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/' }), tryCatch(authController.storeGoogleToken))

module.exports = router
