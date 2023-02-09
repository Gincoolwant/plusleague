const express = require('express')
const router = express.Router()
const { Match, sequelize } = require('../../models')
const { google } = require('googleapis')
const { checkOauth, setCredentials, checkCalendar, insertEvent } = require('../../middleware/google-calendar.js')
const dayjs = require('dayjs')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
)

// router.post('/schedule/test/:game_id', checkOauth(oauth2Client), checkCalendar(oauth2Client), (req, res, next) => {
//   return Match.findOne({
//     where: { gameId: req.params.game_id },
//     attributes: [
//       'game_id', 'game_time', 'arena',
//       [sequelize.literal('(SELECT logo FROM Teams WHERE Teams.id = Match.guest_id)'), 'g_logo'],
//       [sequelize.literal('(SELECT name FROM Teams WHERE Teams.id = Match.guest_id)'), 'g_name'],
//       [sequelize.literal('(SELECT logo FROM Teams WHERE Teams.id = Match.home_id)'), 'h_logo'],
//       [sequelize.literal('(SELECT name FROM Teams WHERE Teams.id = Match.home_id)'), 'h_name']
//     ],
//     raw: true
//   })
//     .then(match => {
//       const startTime = dayjs(match.game_time).format()
//       const endTime = dayjs(match.game_time).add(2, 'hour').format()
//       req.event = {
//         summary: `G${match.game_id}${match.g_name} vs ${match.h_name}`,
//         description: `賽事編號G${match.game_id} @ ${match.arena}`,
//         start: {
//           dateTime: `${startTime}`,
//           timeZone: 'Asia/Taipei'
//         },
//         end: {
//           dateTime: `${endTime}`,
//           timeZone: 'Asia/Taipei'
//         },
//         reminders: {
//           useDefault: false,
//           overrides: [
//             { method: 'popup', minutes: 120 }
//           ]
//         }
//       }
//       next()
//     })
// }, insertEvent(oauth2Client), (req, res) => {
//   req.flash('success_messages', '已成功加入您的行事曆。')
//   res.redirect('back')
// })

router.post('/schedule/:game_id', checkOauth(oauth2Client), (req, res, next) => {
  return Match.findOne({
    where: { gameId: req.params.game_id },
    attributes: [
      'game_id', 'game_time', 'arena',
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
        summary: `G${match.game_id}${match.g_name} vs ${match.h_name}`,
        description: `賽事編號G${match.game_id} @ ${match.arena}`,
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
}, insertEvent(oauth2Client), (req, res) => {
  req.flash('success_messages', '已成功加入您的行事曆。')
  res.redirect('back')
})

router.get('/google/callback', setCredentials(oauth2Client), (req, res) => {
  req.flash('auth_messages', '成功授權，歡迎使用加入行事曆功能。')
  res.redirect('back')
})

module.exports = router
