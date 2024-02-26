const express = require('express')
const passport = require('passport')

const { authenticatedGoogle } = require('../../middleware/auth.js')
const authController = require('../../controllers/auth-controller.js')
const tryCatch = require('../../utils/tryCatch')

const router = express.Router()
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const googleAuthOptions = {
  scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar'],
  accessType: 'offline'
}

router.post('/schedule/:season/:type/:gameId', authenticatedGoogle, tryCatch(authController.addMatchToCalendar))
router.get('/scheduleAll/:season/', authenticatedGoogle, tryCatch(authController.addAllToCalendar))
router.get('/google', passport.authenticate('google', googleAuthOptions))
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/' }), tryCatch(authController.storeGoogleToken))

module.exports = router
