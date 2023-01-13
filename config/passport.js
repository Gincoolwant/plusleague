const passport = require('passport')
const LocalStrategy = require('passport-local')
const GoogleStrategy = require('passport-google-oauth20')
const { User } = require('../models')
const bcrypt = require('bcryptjs')

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(
    new LocalStrategy({
      usernameField: 'email',
      passReqToCallback: true
    }, (req, email, password, done) => {
      if (!email || !password) return done(null, false, req.flash('error', { message: '請輸入Email及password。' }))
      User.findOne({ email })
        .then(user => {
          // 無效email登入嘗試，flash msg提示
          if (!user) return done(null, false, req.flash('error', { message: '請確認Email或密碼是否正確。' }))
          // 比對bcrypt，相同則登入，不相同flash msg提示
          return bcrypt.compare(password, user.password)
            .then((isMatch) => {
              if (!isMatch) return done(null, req.flash('error', { message: '請確認Email或密碼是否正確。' }))
              return done(null, user)
            })
        })
        .catch(err => done(err))
    })
  )

  // const jwtOptions = {
  //   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  //   secretOrKey: process.env.JWT_SECRET
  // }

  // passport.use(new JwtStrategy(jwtOptions, (jwtPayload, cb) => {
  //   User.findByPk(jwtPayload.id)
  //     .then(user => cb(null, user.toJSON()))
  //     .catch(err => cb(err))
  // }))

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    profileFields: ['email', 'displayName']
  }, (accessToken, refreshToken, profile, done) => {
    const { name, email } = profile._json
    return User.findOne({ email })
      .then(user => {
        if (user) return done(null, user)
        // 密碼必填，產生一組隨機密碼for auth登入者
        const randomPassword = Math.random().toString(36).slice(-8)
        return bcrypt.genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => {
            return User.create({ name, email, password: hash })
              .then(() => done(null, user))
              .catch(err => done(err))
          })
          .then(user => done(null, user))
          .catch(err => done(err))
      })
      .catch(err => done(err))
  })
  )

  passport.serializeUser((user, done) => {
    return done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    return User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err))
  })
}
