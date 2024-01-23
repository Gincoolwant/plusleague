'use strict'

const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')

dayjs.extend(utc)
dayjs.extend(timezone)

dayjs.tz.setDefault('Asia/Taipei')
let matches = require('../crawler/schedule/2023easl-regular.json')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const teams = await queryInterface.sequelize.query(
      'SELECT id, team_id FROM Teams;',
      { type: queryInterface.sequelize.QueryTypes.SELECT })
    matches = matches.map(match => ({
      season: match.season,
      type: match.type,
      game_id: match.game_id,
      game_time: dayjs.tz(match.game_time).utc().format('YYYY-MM-DD HH:mm:ss'),
      arena: match.arena,
      guest_id: teams[match.guest_id - 1].id,
      home_id: teams[match.home_id - 1].id
    }))
    await queryInterface.bulkInsert('Matches', matches, {})
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Matches', {})
  }
}
