const express = require('express')
const router = express.Router()
const { Match, User, sequelize } = require('../../models')
const { Op } = require('sequelize')
const dayjs = require('dayjs')

router.get('/matches', (req, res) => {
  return Match.findAll({
    where: { gameTime: { [Op.gte]: dayjs() } },
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

router.delete('/matches/:match_id', (req, res) => {
  return Match.findOne({
    where: { id: req.params.match_id }
  })
    .then(match => match.destroy())
    .then(match => {
      req.flash('error_messages', `${match.toJSON().gameId}已成功下架。`)
      res.redirect('/admin/matches')
    })
    .catch((err) => console.log(err))
})

router.patch('/matches/:match_id', (req, res) => {
  console.log(req.params.match_id)
  return Match.findOne({
    where: { id: req.params.match_id },
    paranoid: false
  })
    .then(match => match.restore())
    .then(match => {
      console.log(match.toJSON())
      req.flash('success_messages', `${match.toJSON().gameId}已成功上架。`)
      res.redirect('/admin/matches')
    })
    .catch((err) => console.log(err))
})

module.exports = router
