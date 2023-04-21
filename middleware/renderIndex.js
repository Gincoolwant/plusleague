const { Team, Match, sequelize } = require('../models')
const { Op, QueryTypes } = require('sequelize')
const dayjs = require('dayjs')

async function renderIndex (req, res, next) {
  try {
    const teamId = Number(req.query.searchTeamId) || ''
    const arena = req.query.searchArena || ''
    const [teams, matches, arenas] = await Promise.all([
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

    res.status(200).render('index', { teams, matches, arenas, searchTeamId: Number(req.query.searchTeamId), searchArena: req.query.searchArena })
  } catch (err) {
    next(err)
  }
}

module.exports = renderIndex
