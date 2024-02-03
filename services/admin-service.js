
const { Op } = require('sequelize')

const { Match, User, sequelize } = require('../models')
const { cache } = require('../helpers/cache-helper')

const adminService = {
  getMatchesFromTime: async (time) => {
    try {
      return await Match.findAll({
        where: { gameTime: { [Op.gte]: time } },
        attributes: [
          'id', 'type', 'game_id', 'game_time', 'arena',
          [sequelize.literal('(SELECT logo FROM Teams WHERE Teams.id = Match.guest_id)'), 'g_logo'],
          [sequelize.literal('(SELECT name FROM Teams WHERE Teams.id = Match.guest_id)'), 'g_name'],
          [sequelize.literal('(SELECT logo FROM Teams WHERE Teams.id = Match.home_id)'), 'h_logo'],
          [sequelize.literal('(SELECT name FROM Teams WHERE Teams.id = Match.home_id)'), 'h_name'],
          'deleted_at'
        ],
        order: [['game_time', 'ASC']],
        paranoid: false,
        raw: true
      })
    } catch (err) {
      throw new Error('Failed to get all matches from now for admin.')
    }
  },
  getAllUser: async () => {
    return await User.findAll({ raw: true })
  },
  findMatchById: async (id) => {
    const match = await Match.findByPk(id)
    if (!match) throw new Error('Cannot find specific match.')
    return match
  },
  delistMatch: async (match) => {
    const deletedMatch = await match.destroy()
    cache.flush()
    return deletedMatch.toJSON()
  },
  listMatch: async (match) => {
    const restoredMatch = await match.restore()
    cache.flush()
    return restoredMatch.toJSON()
  }
}

module.exports = adminService
