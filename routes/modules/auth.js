const express = require('express')
const router = express.Router()
const { Match, sequelize } = require('../../models')
const { checkOauth, updateToken, insertEvent } = require('../../middleware/google-calendar.js')
const dayjs = require('dayjs')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

router.get('/schedule/:type/:game_id', checkOauth, (req, res, next) => {
  return Match.findOne({
    where: {
      type: req.params.type,
      gameId: req.params.game_id
    },
    attributes: [
      'type', 'game_id', 'game_time', 'arena',
      [sequelize.literal('(SELECT logo FROM Teams WHERE Teams.id = Match.guest_id)'), 'g_logo'],
      [sequelize.literal('(SELECT name FROM Teams WHERE Teams.id = Match.guest_id)'), 'g_name'],
      [sequelize.literal('(SELECT logo FROM Teams WHERE Teams.id = Match.home_id)'), 'h_logo'],
      [sequelize.literal('(SELECT name FROM Teams WHERE Teams.id = Match.home_id)'), 'h_name']
    ],
    raw: true
  })
    .then(match => {
      const startTime = dayjs(match.game_time).format()
      const endTime = dayjs(match.game_time).add(2, 'hour').format()
      req.event = {
        summary: `${match.game_id}${match.g_name} vs ${match.h_name}`,
        description: `${match.type} - 賽事編號${match.game_id} @ ${match.arena}`,
        start: {
          dateTime: `${startTime}`,
          timeZone: 'Asia/Taipei'
        },
        end: {
          dateTime: `${endTime}`,
          timeZone: 'Asia/Taipei'
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 120 }
          ]
        }
      }
      next()
    })
    .catch(err => console.log(err))
}, insertEvent, (req, res) => {
  req.flash('success_messages', `${req.event.summary}，已成功加入您的行事曆。`)
  req.flash('event_link', `${req.event.htmlLink}`)
  res.redirect('/')
})

router.get('/google/callback', updateToken, (req, res) => {
  res.redirect(`/auth/schedule/${req.type}/${req.gameId}`)
})

module.exports = router
