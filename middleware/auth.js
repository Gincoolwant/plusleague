const passport = require('passport')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      req.flash('warning_messages', '錯誤發生...請聯絡開發者。')
      res.status(404).redirect('/')
    }
    if (!user) {
      req.flash('warning_messages', '請登入使用。')
      return res.status(401).redirect('/users/login')
    }
    req.user = user
    next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  if (req.user?.isAdmin === 'admin') return next()
  req.flash('warning_messages', '非管理者嘗試登入，若為管理者請聯絡開發者。')
  return res.status(403).redirect('/users/login')
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
