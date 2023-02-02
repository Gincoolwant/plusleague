const express = require('express')
const router = express.Router()
const auth = require('./modules/auth')
const users = require('./modules/user')
const admin = require('./modules/admin')
const { Team, Match, sequelize } = require('../models')
const { Op, QueryTypes } = require('sequelize')
const dayjs = require('dayjs')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')

router.use('/users', users)
router.use('/auth', authenticated, auth)
router.use('/admin', authenticated, authenticatedAdmin, admin)
router.get('/', (req, res) => {
  const teamId = Number(req.query.teamId) || ''
  const arena = req.query.arena || ''
  return Promise.all([
    Team.findAll({ raw: true }),
    Match.findAll({
      where: {
        [Op.and]: [
          { gameTime: { [Op.gte]: dayjs() } },
          teamId ? { [Op.or]: [{ guestId: teamId }, { homeId: teamId }] } : '',
          arena ? { arena } : ''
        ]
      },
      attributes: [
        'game_id', 'game_time', 'arena',
        [sequelize.literal('(SELECT logo FROM Teams WHERE Teams.id = Match.guest_id)'), 'g_logo'],
        [sequelize.literal('(SELECT name FROM Teams WHERE Teams.id = Match.guest_id)'), 'g_name'],
        [sequelize.literal('(SELECT logo FROM Teams WHERE Teams.id = Match.home_id)'), 'h_logo'],
        [sequelize.literal('(SELECT name FROM Teams WHERE Teams.id = Match.home_id)'), 'h_name']
      ],
      order: [['game_time', 'ASC']],
      raw: true
    }),
    sequelize.query('SELECT DISTINCT arena FROM Matches', { type: QueryTypes.SELECT })
  ])
    .then(([teams, matches, arenas]) => {
      console.log(matches)
      res.render('index', { teams, matches, arenas, teamId: Number(req.query.teamId), arena: req.query.arena })
    })
    .catch((err) => console.log(err))
})

module.exports = router
