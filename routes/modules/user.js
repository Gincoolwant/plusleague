const express = require('express')
const router = express.Router()
const { User } = require('../../models')
const passport = require('passport')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { authenticated } = require('../../middleware/auth')

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', { failureRedirect: '/users/login' }), (req, res) => {
  const userData = req.user.toJSON()
  delete userData.password
  const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '1d' })
  res.cookie('jwt', token, { maxAge: 15 * 60 * 1000, httpOnly: true, signed: true })
  res.redirect('/')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
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
        res.render('register', { name, email, password, confirmPassword, errors })
      }
      // 可註冊email，密碼加密並創建使用者
      return bcrypt.genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => {
          return User.create({ name, email, password: hash })
            .then(() => {
              req.flash('success_messages', '註冊成功，馬上登入使用吧!')
              res.redirect('/users/login')
            })
        })
    })
    .catch(err => console.log(err))
})

router.get('/logout', (req, res) => {
  res.clearCookie('jwt')
  req.logout((err) => {
    if (err) console.log(err)
    req.flash('success_msg', '你已成功登出。')
    res.redirect('/')
  })
})

router.get('/demoCalendar', authenticated, (req, res) => {
  res.render('user1-calendar')
})

module.exports = router
