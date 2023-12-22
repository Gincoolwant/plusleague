const { Team, Match, sequelize } = require('../models')
const { Op, QueryTypes } = require('sequelize')
const dayjs = require('dayjs')

async function renderIndex (req, res, next) {
  try {
    const { searchTeamId, searchArena, searchYearMonth } = req.query
    const splitYearMonth = searchYearMonth ? searchYearMonth.split('-') : ''
    const year = splitYearMonth ? Number(splitYearMonth[0]) : ''
    const month = splitYearMonth ? Number(splitYearMonth[1]) : ''
    const teamId = Number(searchTeamId) || ''
    const arena = searchArena || ''
    const [teams, matches, arenas, yearMonthCombs] = await Promise.all([
      Team.findAll({ raw: true }),
      Match.findAll({
        where: {
          [Op.and]: [
            { gameTime: { [Op.gte]: dayjs() } },
            month ? sequelize.where(sequelize.fn('MONTH', sequelize.col('game_time')), '=', month) : '',
            month ? sequelize.where(sequelize.fn('YEAR', sequelize.col('game_time')), '=', year) : '',
            teamId ? { [Op.or]: [{ guestId: teamId }, { homeId: teamId }] } : '',
            arena ? { arena } : ''
          ]
        },
        attributes: [
          'type', 'game_id', 'game_time', 'arena',
          [sequelize.col('guest.name'), 'g_name'],
          [sequelize.col('guest.logo'), 'g_logo'],
          [sequelize.col('home.name'), 'h_name'],
          [sequelize.col('home.logo'), 'h_logo']
        ],
        include: [
          {
            model: Team,
            as: 'guest',
            attributes: []
          },
          {
            model: Team,
            as: 'home',
            attributes: []
          }
        ],
        order: [['game_time', 'ASC']],
        raw: true
      }),
      sequelize.query('SELECT DISTINCT arena FROM Matches WHERE game_time >= :now',
        { replacements: { now: dayjs().format() }, type: QueryTypes.SELECT }),
      sequelize.query('SELECT DISTINCT YEAR(game_time) AS year, MONTH(game_time) AS month FROM Matches WHERE game_time >= :now',
        { replacements: { now: dayjs().format() }, type: QueryTypes.SELECT })
    ])
    res.status(200).render('index', { teams, matches, arenas, yearMonthCombs, searchTeamId: Number(searchTeamId), searchArena, searchYearMonth })
  } catch (err) {
    next(err)
  }
}

module.exports = renderIndex
