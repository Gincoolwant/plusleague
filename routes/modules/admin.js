const express = require('express')
const router = express.Router()
const { Match, User, sequelize } = require('../../models')
const { Op } = require('sequelize')
const dayjs = require('dayjs')

router.get('/matches', (req, res) => {
  return Match.findAll({
    where: { gameTime: { [Op.gte]: dayjs() } },
    attributes: [
      'game_id', 'game_time', 'arena',
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
    .then(matches => {
      res.render('admin', { matches })
    })
    .catch((err) => console.log(err))
})

router.get('/users', (req, res) => {
  return User.findAll({
    raw: true
  })
    .then(users => {
      res.render('admin/users', { users })
    })
    .catch((err) => console.log(err))
})

router.delete('/matches/:game_id', (req, res) => {
  return Match.findOne({
    where: { gameId: req.params.game_id }
  })
    .then(match => match.destroy())
    .then(match => {
      req.flash('error_messages', `G${match.toJSON().gameId}已成功下架。`)
      res.redirect('/admin/matches')
    })
    .catch((err) => console.log(err))
})

router.patch('/matches/:game_id', (req, res) => {
  return Match.findOne({
    where: { gameId: req.params.game_id },
    paranoid: false
  })
    .then(match => match.restore())
    .then(match => {
      req.flash('success_messages', `G${match.toJSON().gameId}已成功上架。`)
      res.redirect('/admin/matches')
    })
    .catch((err) => console.log(err))
})

module.exports = router
