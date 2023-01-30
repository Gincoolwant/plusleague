const express = require('express')
const router = express.Router()
const auth = require('./modules/auth')
const users = require('./modules/user')
const admin = require('./modules/admin')
const { Match, sequelize } = require('../models')
const { Op } = require('sequelize')
const dayjs = require('dayjs')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')

router.use('/users', users)
router.use('/auth', authenticated, auth)
router.use('/admin', authenticated, authenticatedAdmin, admin)
router.get('/', (req, res) => {
  return Match.findAll({
    where: { gameTime: { [Op.gte]: dayjs() } },
    attributes: [
      'game_id', 'game_time', 'arena',
      [sequelize.literal('(SELECT logo FROM Teams WHERE Teams.id = Match.guest_id)'), 'g_logo'],
      [sequelize.literal('(SELECT name FROM Teams WHERE Teams.id = Match.guest_id)'), 'g_name'],
      [sequelize.literal('(SELECT logo FROM Teams WHERE Teams.id = Match.home_id)'), 'h_logo'],
      [sequelize.literal('(SELECT name FROM Teams WHERE Teams.id = Match.home_id)'), 'h_name']
    ],
    order: [['game_time', 'ASC']],
    raw: true
  })
    .then(matches => {
      res.render('index', { matches })
    })
    .catch((err) => console.log(err))
})

module.exports = router
