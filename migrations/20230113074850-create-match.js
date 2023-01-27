'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Matches', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      game_id: {
        type: Sequelize.INTEGER
      },
      game_time: {
        type: Sequelize.DATE
      },
      // date: {
      //   type: Sequelize.STRING
      // },
      // time: {
      //   type: Sequelize.STRING
      // },
      // day: {
      //   type: Sequelize.STRING
      // },
      arena: {
        type: Sequelize.STRING
      },
      guest_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Teams',
          key: 'id'
        }
      },
      home_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Teams',
          key: 'id'
        }
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        type: Sequelize.DATE
      }
    })
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Matches')
  }
}
