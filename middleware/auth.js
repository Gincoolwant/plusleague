const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  req.flash('warning_messages', '請登入使用。')
  return res.status(401).redirect('/users/login')
}

const authenticatedAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin === 'admin') return next()
  req.flash('warning_messages', '非管理者嘗試登入，若為管理者請聯絡開發者。')
  return res.status(403).redirect('/users/login')
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
