'use strict'
/** @type {import('sequelize-cli').Migration} */
const teamList = require('../crawler/src/teams')
module.exports = {
  async up (queryInterface, Sequelize) {
    const teams = teamList.map(team => ({
      team_id: team.team_id,
      logo: team.logo,
      name: team.fullName,
      english_name: team.english_name,
      created_at: new Date(),
      updated_at: new Date()
    }))
    await queryInterface.bulkInsert('Teams', teams, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Teams', {})
  }
}
