'use strict'
const { crawlMatches } = require('../crawler')
const urlMatches = 'https://pleagueofficial.com/schedule-regular-season/2022-23'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const matches = await crawlMatches(urlMatches)
    await queryInterface.bulkInsert('Matches', matches, {})
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Matches', {})
  }
}
