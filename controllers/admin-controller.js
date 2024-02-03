
const dayjs = require('dayjs')

const adminService = require('../services/admin-service')

const adminController = {
  getMatchesFromNow: async (req, res, next) => {
    const now = dayjs()
    try {
      const matches = await adminService.getMatchesFromTime(now)
      res.render('admin/admin', { matches })
    } catch (err) {
      next(err)
    }
  },
  getAllUser: async (req, res, next) => {
    try {
      const users = await adminService.getAllUser()
      res.render('admin/users', { users })
    } catch (err) {
      next(err)
    }
  },
  delistMatch: async (req, res, next) => {
    const { id } = req.params
    try {
      const match = await adminService.findMatchById(id)
      const deletedMatch = await adminService.delistMatch(match)
      req.flash('error_messages', `${deletedMatch.gameId} 已成功下架。`)
      res.redirect('/admin/matches')
    } catch (err) {
      next(err)
    }
  },
  listMatch: async (req, res, next) => {
    const { id } = req.params
    try {
      const match = await adminService.findMatchById(id)
      const listedMatch = await adminService.listMatch(match)
      req.flash('success_messages', `${listedMatch.gameId}已成功上架。`)
      res.redirect('/admin/matches')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController
