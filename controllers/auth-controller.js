const authService = require('../services/auth-service')
const { formatIntoEvent } = require('../helpers/matchFormat-helper')
const jwt = require('jsonwebtoken')

const authController = {
  addMatchToCalendar: async (req, res) => {
    const { season, type, gameId } = req.params
    const accessTokenGoogle = req.jwt.accessToken
    const refreshTokenGoogle = req.jwt.gToken || req.user.gToken
    const match = await authService.findMatch(season, type, gameId)
    const event = formatIntoEvent(match)
    const insertedEvent = await authService.insertToGoogleCalendar(event, accessTokenGoogle, refreshTokenGoogle)
    req.flash('insertCalendar_success_messages', `${insertedEvent.summary}，已成功加入您的行事曆。`)
    req.flash('event_link', `${insertedEvent.htmlLink}`)
    res.redirect('back')
  },
  addAllToCalendar: async (req, res) => {
    const { season } = req.params
    const accessTokenGoogle = req.jwt.accessToken
    const refreshTokenGoogle = req.jwt.gToken || req.user.gToken
    await authService.insertToGoogleCalendar('all', accessTokenGoogle, refreshTokenGoogle)
    req.flash('insertCalendar_success_messages', `${season}賽季例行賽已成功加入您的行事曆。`)
    req.flash('event_link', '')
    res.redirect('back')
  },
  storeGoogleToken: async (req, res, next) => {
    const { id } = req.jwt
    const { accessToken, refreshToken } = req.user

    const updatedUser = await authService.storeGoogleToken(id, accessToken, refreshToken)
    const userDataJwt = jwt.sign(updatedUser, process.env.JWT_SECRET, { expiresIn: '15m' })
    const cookieOptions = { maxAge: 30 * 60 * 1000, httpOnly: true, signed: true }
    res.cookie('pleagueJWT', userDataJwt, cookieOptions)
    req.flash('success_messages', '您可以開始加入行事曆功能。')
    res.redirect('back')
  }
}

module.exports = authController
