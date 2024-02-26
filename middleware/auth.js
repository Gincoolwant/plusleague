const passport = require('passport')

const AppError = require('../utils/AppError')
const errorCode = require('../utils/errorCode')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      throw new AppError(errorCode.INVALID_JWT_TOKEN, 'jwt authenticate failed.', errorCode.INVALID_JWT_TOKEN.statusCode)
    }
    if (!user) {
      req.flash('warning_messages', '請登入使用。')
      return res.status(401).redirect('/users/login')
    }
    req.jwt = user
    next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  if (req.user?.isAdmin === 'admin') return next()
  req.flash('warning_messages', '非管理者嘗試登入，若為管理者請聯絡開發者。')
  return res.status(403).redirect('/users/login')
}

const authenticatedGoogle = (req, res, next) => {
  const isAuthTokenExists = req.jwt?.accessToken || req.user?.gToken
  if (!isAuthTokenExists) {
    return res.redirect('/auth/google')
  }
  next()
}

module.exports = {
  authenticated,
  authenticatedAdmin,
  authenticatedGoogle
}
