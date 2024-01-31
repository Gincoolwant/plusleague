const userService = require('../services/user-service')

const userController = {
  getLoginPage: (req, res, next) => {
    userService.getLoginPage(req, (err, _data) => err ? next(err) : res.render('login'))
  },
  // 登入成功後，製作jwt token儲存至browser cookie
  setJwtCookie: (req, res, next) => {
    const userData = req.user.toJSON()
    delete userData.password
    delete userData.gToken

    const jwtToken = userService.signJwtToken(userData, process.env.JWT_SECRET, '15m')

    const cookieOptions = { maxAge: 30 * 60 * 1000, httpOnly: true, signed: true }
    res.cookie('pleagueJWT', jwtToken, cookieOptions)
    res.redirect('/')
  },
  getRegisterPage: (req, res, next) => {
    userService.getRegisterPage(req, (err, _data) => err ? next(err) : res.render('register'))
  },
  registerUser: async (req, res, next) => {
    // 未輸入name以email帳號為name
    const { email, password } = req.body
    let { name } = req.body
    if (!name) {
      name = email.slice(0, email.indexOf('@'))
    }

    const invalidations = userService.registerValidator(req.body)
    if (invalidations.length) {
      return res.render('register', { name, email, password, errors: invalidations })
    }

    // 確認email是否註冊，是: 提示已註冊，否: 創建使用者
    try {
      const isUserRegistered = await userService.getUserByEmail(email)
      if (isUserRegistered) {
        return res.render('register', { name, email, password, errors: [{ message: '此Email已註冊。' }] })
      }
      const newRegisteredUser = await userService.addUser(name, email, password)
      // 立即登入
      req.login(newRegisteredUser, (err) => {
        if (err) {
          throw new Error('Auto login failed.')
        }
        req.flash('success_messages', `歡迎${newRegisteredUser.name}的加入，馬上使用看看吧!`)
        res.redirect('/')
      })
    } catch (error) {
      next(error)
    }
  },
  logout: (req, res, next) => {
    res.clearCookie('pleagueJWT')
    req.logout((err) => {
      if (err) {
        return next(err)
      }
      req.flash('success_msg', '你已成功登出。')
      res.redirect('/')
    })
  }
}

module.exports = userController
