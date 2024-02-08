
const dayjs = require('dayjs')

const adminService = require('../services/admin-service')

const adminController = {
  getMatchesFromNow: async (req, res) => {
    const now = dayjs()
    const matches = await adminService.getMatchesFromTime(now)
    res.render('admin/admin', { matches })
  },
  getAllUser: async (req, res) => {
    const users = await adminService.getAllUser()
    res.render('admin/users', { users })
  },
  delistMatch: async (req, res) => {
    const { id } = req.params
    const match = await adminService.findMatchById(id)
    const deletedMatch = await adminService.delistMatch(match)
    req.flash('error_messages', `${deletedMatch.gameId} 已成功下架。`)
    res.redirect('/admin/matches')
  },
  listMatch: async (req, res) => {
    const { id } = req.params
    const match = await adminService.findMatchById(id)
    const listedMatch = await adminService.listMatch(match)
    req.flash('success_messages', `${listedMatch.gameId}已成功上架。`)
    res.redirect('/admin/matches')
  }
}

module.exports = adminController
