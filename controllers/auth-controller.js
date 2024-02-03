const authService = require('../services/auth-service')
const { formatIntoEvent } = require('../helpers/matchFormat-helper')
const jwt = require('jsonwebtoken')

const authController = {
  insertMatchToCalendar: async (req, res, next) => {
    const { season, type, gameId } = req.params
    const accessTokenGoogle = req.jwt.accessToken
    const refreshTokenGoogle = req.jwt.gToken || req.user.gToken
    try {
      const match = await authService.findMatch(season, type, gameId)
      const event = formatIntoEvent(match)
      const insertedEvent = await authService.insertEventToGoogleCalendar(event, accessTokenGoogle, refreshTokenGoogle)
      req.flash('insertCalendar_success_messages', `${insertedEvent.summary}，已成功加入您的行事曆。`)
      req.flash('event_link', `${insertedEvent.htmlLink}`)
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  storeGoogleToken: async (req, res, next) => {
    const { id } = req.jwt
    const { accessToken, refreshToken } = req.user
    try {
      const updatedUser = await authService.storeGoogleToken(id, accessToken, refreshToken)
      const userDataJwt = jwt.sign(updatedUser, process.env.JWT_SECRET, { expiresIn: '15m' })
      const cookieOptions = { maxAge: 30 * 60 * 1000, httpOnly: true, signed: true }
      res.cookie('pleagueJWT', userDataJwt, cookieOptions)
      req.flash('success_messages', '您可以開始加入行事曆功能。')
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = authController
