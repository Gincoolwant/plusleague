'use strict'

const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
dayjs.extend(utc)

let matches = require('../crawler/playoffs22-23.json')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const teams = await queryInterface.sequelize.query(
      'SELECT id, team_id FROM Teams;',
      { type: queryInterface.sequelize.QueryTypes.SELECT })
    matches = matches.map(match => ({
      type: match.type,
      game_id: match.game_id,
      game_time: dayjs(match.game_time).utc().format(),
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
