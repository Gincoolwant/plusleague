const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const { User } = require('../models')
const AppError = require('../utils/AppError')
const errorCode = require('../utils/errorCode')
const { imgurFileHandler } = require('../helpers/file-helper')

const userService = {
  signJwtToken: (userData, secret, expires) => {
    return jwt.sign(userData, secret, { expiresIn: expires })
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
    const user = await User.findOne({ where: { email } })
    return user
  },
  getUserById: async (id) => {
    const user = await User.findByPk(id, { raw: true })
    if (!user) throw new AppError(errorCode.USER_NOT_FOUND, 'User not found.', errorCode.USER_NOT_FOUND.statusCode)
    return user
  },
  addUser: async (name, email, password) => {
    const user = await User.create({ name, email, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)) })
    if (!user) throw new AppError(errorCode.USER_CREATE_FAIL, 'Failed to create new user', errorCode.USER_CREATE_FAIL)
    return user
  },
  updateUser: async (id, name, file) => {
    const [user, filePath] = await Promise.all([
      User.findByPk(id),
      imgurFileHandler(file)
    ])

    if (!user) throw new AppError(errorCode.USER_CREATE_FAIL, 'Failed to create new user', errorCode.USER_CREATE_FAIL)

    const avatar = filePath || user.toJSON().avatar
    user.set({
      name,
      avatar
    })
    await user.save()
  }
}

module.exports = userService
