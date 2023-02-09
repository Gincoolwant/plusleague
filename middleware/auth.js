const passport = require('passport')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      req.flash('warning_messages', '錯誤發生...請聯絡開發者。')
      res.status(401).redirect('/')
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
