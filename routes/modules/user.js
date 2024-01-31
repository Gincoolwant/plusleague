const express = require('express')
const passport = require('passport')

const userController = require('../../controllers/user-controller')

const router = express.Router()

router.get('/login', userController.getLoginPage)
router.post('/login', passport.authenticate('local', { failureRedirect: '/users/login' }), userController.setJwtCookie)
router.get('/register', userController.getRegisterPage)
router.post('/register', userController.registerUser)
router.get('/logout', userController.logout)
router.get('/demoCalendar', (req, res) => {
  res.render('user1-calendar')
})

module.exports = router
