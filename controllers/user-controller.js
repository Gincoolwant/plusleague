const userService = require('../services/user-service')
const AppError = require('../utils/AppError')
const errorCode = require('../utils/errorCode')

const userController = {
  getLoginPage: (req, res) => {
    res.render('login')
  },
  // 登入成功後，製作jwt token儲存至browser cookie
  setJwtCookie: (req, res) => {
    const userData = req.user.toJSON()
    delete userData.password
    delete userData.gToken

    const jwtToken = userService.signJwtToken(userData, process.env.JWT_SECRET, '15m')
    const cookieOptions = { maxAge: 30 * 60 * 1000, httpOnly: true, signed: true }
    res.cookie('pleagueJWT', jwtToken, cookieOptions)
    res.redirect('/')
  },
  getRegisterPage: (req, res) => {
    res.render('register')
  },
  registerUser: async (req, res) => {
    const { email, password } = req.body
    let { name } = req.body

    // 未輸入name以email帳號為name
    if (!name) {
      name = email.slice(0, email.indexOf('@'))
    }

    const invalidations = userService.registerValidator(req.body)
    if (invalidations.length) {
      return res.render('register', { name, email, password, errors: invalidations })
    }

    // 確認email是否註冊，是: 提示已註冊，否: 創建使用者
    const isUserRegistered = await userService.getUserByEmail(email)
    if (isUserRegistered) {
      return res.render('register', { name, email, password, errors: [{ message: '此Email已註冊。' }] })
    }
    const newRegisteredUser = await userService.addUser(name, email, password)

    // 註冊完畢，立即登入
    req.login(newRegisteredUser, (err) => {
      if (err) {
        throw new AppError(errorCode.INVALID_AUTO_LOGIN, 'New register user auto login failed.', errorCode.INVALID_AUTO_LOGIN.statusCode)
      }
      req.flash('success_messages', `歡迎${newRegisteredUser.name}的加入，馬上使用看看吧!`)
      res.status(201).redirect('/')
    })
  },
  logout: (req, res) => {
    res.clearCookie('pleagueJWT')
    req.logout((err) => {
      if (err) {
        throw new AppError(errorCode.LOG_OUT_FAIL, 'Log out failed.', errorCode.LOG_OUT_FAIL.statusCode)
      }
      req.flash('success_msg', '你已成功登出。')
      res.redirect('/')
    })
  },
  getProfile: async (req, res) => {
    res.render('user/profile', { user: req.user })
  },
  putProfile: async (req, res) => {
    const { id } = req.params
    const { name } = req.body
    const { file } = req

    // 必填欄位及確認密碼驗證
    const errors = []
    if (!name) {
      errors.push({ message: '欄位name必填。' })
    }

    await userService.updateUser(id, name, file)
    req.flash('success_messages', '已成功修改個人資料。')
    res.redirect(`/users/${id}/profile`)
  }
}

module.exports = userController
