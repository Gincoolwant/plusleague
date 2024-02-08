
const { Op } = require('sequelize')

const { Match, User, sequelize } = require('../models')
const { cache } = require('../helpers/cache-helper')
const AppError = require('../utils/AppError')
const errorCode = require('../utils/errorCode')

const adminService = {
  getMatchesFromTime: async (time) => {
    const matches = await Match.findAll({
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
    if (!matches) throw new AppError(errorCode.MATCH_NOT_FOUND, 'Failed to get matches from now.', errorCode.MATCH_NOT_FOUND.statusCode)
    return matches
  },
  getAllUser: async () => {
    const user = await User.findAll({ raw: true })
    if (!user) throw new AppError(errorCode.USER_NOT_FOUND, 'Users not found.', errorCode.USER_NOT_FOUND.statusCode)
    return user
  },
  findMatchById: async (id) => {
    const match = await Match.findByPk(id, { paranoid: false })
    if (!match) throw new AppError(errorCode.MATCH_NOT_FOUND, 'Match not found.', errorCode.MATCH_NOT_FOUND.statusCode)
    return match
  },
  delistMatch: async (match) => {
    const deletedMatch = await match.destroy()
    if (!deletedMatch) throw new AppError(errorCode.DELETE_MATCH_FAILED, 'Failed to delete the match.', errorCode.DELETE_MATCH_FAILED.statusCode)
    cache.flush()
    return deletedMatch.toJSON()
  },
  listMatch: async (match) => {
    const restoredMatch = await match.restore()
    if (!restoredMatch) throw new AppError(errorCode.RESTORE_MATCH_FAILED, 'Failed to restore the match.', errorCode.RESTORE_MATCH_FAILED.statusCode)
    cache.flush()
    return restoredMatch.toJSON()
  }
}

module.exports = adminService
