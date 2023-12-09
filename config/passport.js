const passport = require('passport')
const LocalStrategy = require('passport-local')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const bcrypt = require('bcryptjs')

const { User } = require('../models')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy(
    // customize user field
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    // authenticate user
    (req, email, password, cb) => {
      User.findOne({ where: { email } })
        .then(user => {
          if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
          bcrypt.compare(password, user.password).then(res => {
            if (!res) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
            return cb(null, user)
          })
        })
        .catch(err => cb(err))
    }
  ))

  const jwtOptions = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.JWT_SECRET
  }

  passport.use(new JwtStrategy(jwtOptions, (jwtPayload, cb) => {
    return cb(null, jwtPayload)
  }))

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URL
  },
  (accessToken, refreshToken, profile, cb) => {
    const personalInformation = profile._json
    const googleInformation = {
      accessToken,
      refreshToken,
      personalInformation
    }
    return cb(null, googleInformation)
  }
  ))

  passport.serializeUser((user, done) => {
    return done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findByPk(id)
      .then(user => done(null, user.toJSON()))
      .catch(err => done(err))
  })
}

const cookieExtractor = (req) => {
  let token = null
  if (req?.signedCookies) {
    token = req.signedCookies.pleagueJWT
  }
  return token
}
