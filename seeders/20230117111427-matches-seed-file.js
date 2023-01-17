'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Matches',
    
    [{
      name: 'John Doe',
      isBetaMember: false
    }], {})
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Matches', {})
  }
}