const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const { User } = require('../models')

const userService = {
  getLoginPage: (req, cb) => {
    try {
      cb(null)
    } catch (err) {
      cb(err)
    }
  },
  signJwtToken: (userData, secret, expires) => {
    return jwt.sign(userData, secret, { expiresIn: expires })
  },
  getRegisterPage: (req, cb) => {
    try {
      cb(null)
    } catch (err) {
      cb(err)
    }
  },
  registerValidator: (userData) => {
    const { email, password, confirmPassword } = userData

    // 必填欄位及確認密碼驗證
    const errors = []
    if (!email || !password || !confirmPassword) {
      errors.push({ message: '請完成必填欄位。' })
    }
    if (password !== confirmPassword) {
      errors.push({ message: '兩次密碼輸入不相符。' })
    }
    return errors
  },
  getUserByEmail: async (email) => {
    await User.findOne({ where: { email } })
  },
  addUser: async (name, email, password) => {
    await User.create({ name, email, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)) })
  }
}

module.exports = userService
