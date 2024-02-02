const { Op, QueryTypes } = require('sequelize')
const dayjs = require('dayjs')

const { Team, Match, sequelize } = require('../models')
const { cache } = require('../helpers/cache-helper')

async function renderIndex (req, res, next) {
  try {
    const { searchTeamId, searchArena, searchYearMonth } = req.query
    const splitYearMonth = searchYearMonth ? searchYearMonth.split('-') : ''
    const year = splitYearMonth ? Number(splitYearMonth[0]) : ''
    const month = splitYearMonth ? Number(splitYearMonth[1]) : ''
    const teamId = Number(searchTeamId) || ''
    const arena = searchArena || ''

    const cacheMatches = await cache.getSet(`matches?${searchTeamId}${searchArena}${searchYearMonth}`)

    if (cacheMatches !== null) {
      const { teams, arenas, yearMonthCombs } = JSON.parse(await cache.getSet('selectionList'))
      return res.status(200).render('index', { teams, matches: JSON.parse(cacheMatches), arenas, yearMonthCombs, searchTeamId: Number(searchTeamId), searchArena, searchYearMonth })
    } else {
      const [teams, matches, arenas, yearMonthCombs] = await Promise.all([
        Team.findAll({ raw: true }),
        Match.findAll({
          where: {
            [Op.and]: [
              { gameTime: { [Op.gte]: dayjs() } },
              month ? sequelize.where(sequelize.fn('MONTH', sequelize.col('game_time')), '=', month) : '',
              year ? sequelize.where(sequelize.fn('YEAR', sequelize.col('game_time')), '=', year) : '',
              teamId ? { [Op.or]: [{ guestId: teamId }, { homeId: teamId }] } : '',
              arena ? { arena } : ''
            ]
          },
          attributes: [
            'season', 'type', 'game_id', 'game_time', 'arena',
            [sequelize.col('guest.name'), 'g_name'],
            [sequelize.col('guest.logo'), 'g_logo'],
            [sequelize.col('home.name'), 'h_name'],
            [sequelize.col('home.logo'), 'h_logo']
          ],
          include: [
            { model: Team, as: 'guest', attributes: [] },
            { model: Team, as: 'home', attributes: [] }
          ],
          order: [['game_time', 'ASC']],
          raw: true
        }),
        sequelize.query('SELECT DISTINCT arena FROM Matches WHERE game_time >= :now',
          { replacements: { now: dayjs().format() }, type: QueryTypes.SELECT }),
        sequelize.query('SELECT DISTINCT YEAR(game_time) AS year, MONTH(game_time) AS month FROM Matches WHERE game_time >= :now',
          { replacements: { now: dayjs().format() }, type: QueryTypes.SELECT })
      ])

      const selectionList = {
        teams,
        arenas,
        yearMonthCombs
      }
      await cache.addExpireSet(`matches?${searchTeamId}${searchArena}${searchYearMonth}`, 60 * 60, matches)
      await cache.addExpireSet('selectionList', 60 * 60, selectionList)
      return res.status(200).render('index', { teams, matches, arenas, yearMonthCombs, searchTeamId: Number(searchTeamId), searchArena, searchYearMonth })
    }
  } catch (err) {
    next(err)
  }
}

module.exports = renderIndex
