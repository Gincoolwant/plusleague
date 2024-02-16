const express = require('express')
const passport = require('passport')

const userController = require('../../controllers/user-controller')
const tryCatch = require('../../utils/tryCatch')
const upload = require('../../middleware/multer')

const router = express.Router()

router.get('/login', userController.getLoginPage)
router.post('/login', passport.authenticate('local', { failureRedirect: '/users/login' }), userController.setJwtCookie)
router.get('/register', userController.getRegisterPage)
router.post('/register', tryCatch(userController.registerUser))
router.get('/logout', userController.logout)
router.get('/:id/profile', userController.getProfile)
router.put('/:id/profile', upload.single('avatar'), userController.putProfile)
router.get('/demoCalendar', (req, res) => {
  res.render('user/user1-calendar')
})

module.exports = router
